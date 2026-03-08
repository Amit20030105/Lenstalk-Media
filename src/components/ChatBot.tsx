import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Calendar, Loader2, Volume2, VolumeX } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { cn } from '../lib/utils';

const SYSTEM_INSTRUCTION = `
You are "LensTalk AI", the virtual assistant for LensTalk Media, Bhubaneswar's premier digital agency.
Your goal is to be extremely professional, helpful, and high-end.

LANGUAGES:
You must be fluent in English, Hindi, and Odia. Respond in the language the user uses, or mix them naturally if they do.

OBJECTIVES:
1. Greet the client warmly.
2. Understand their business needs.
3. CRITICAL: Ask them about the problems or challenges they faced with their past agencies or marketing efforts. This helps us understand why they are coming to LensTalk Media.
4. Set a meeting: If they seem interested, ask for their preferred time and contact details to schedule a consultation.
5. Highlight LensTalk Media's features: Brand storytelling, high-end cinematography, and data-driven ads in Bhubaneswar.

TONE:
Sophisticated, empathetic, and results-oriented.

If the user asks to book a meeting, collect their name, email/phone, and preferred time.
`;

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Namaste! I am LensTalk AI. How can I help you elevate your brand today? Aapka swagat hai. Mu kemiti apananku sahayata kari paribi?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const voiceRequestIdRef = useRef(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const stopVoice = () => {
    voiceRequestIdRef.current++; // Invalidate any pending requests
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      sourceNodeRef.current = null;
    }
    setIsSpeaking(false);
  };

  const playVoice = async (text: string) => {
    if (!isVoiceEnabled) return;
    const requestId = ++voiceRequestIdRef.current;
    
    try {
      stopVoice();
      // Re-increment because stopVoice increments it to invalidate others
      voiceRequestIdRef.current = requestId; 
      setIsSpeaking(true);
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      if (requestId !== voiceRequestIdRef.current) return;

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const int16Data = new Int16Array(bytes.buffer);
        
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        
        const audioContext = audioContextRef.current;
        const audioBuffer = audioContext.createBuffer(1, int16Data.length, 24000);
        const channelData = audioBuffer.getChannelData(0);
        
        for (let i = 0; i < int16Data.length; i++) {
          channelData[i] = int16Data[i] / 32768;
        }
        
        if (requestId !== voiceRequestIdRef.current) return;

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => {
          if (sourceNodeRef.current === source) {
            setIsSpeaking(false);
          }
        };
        
        sourceNodeRef.current = source;
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("TTS Error:", error);
      if (requestId === voiceRequestIdRef.current) {
        setIsSpeaking(false);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messages.concat({ role: 'user', text: userMessage }).map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const aiText = response.text || "I'm sorry, I encountered an error. Please try again.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
      
      // Automatically play voice answer if enabled
      if (isVoiceEnabled) {
        playVoice(aiText);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[380px] h-[550px] glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl border-brand-primary/20"
          >
            {/* Header */}
            <div className="p-6 bg-brand-primary/10 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center blue-glow">
                  <Bot className="text-white w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-black uppercase tracking-widest">LensTalk AI</div>
                  <div className="text-[9px] text-brand-primary uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" /> Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    if (isVoiceEnabled) stopVoice();
                    setIsVoiceEnabled(!isVoiceEnabled);
                  }}
                  className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    isVoiceEnabled ? "text-brand-primary bg-brand-primary/10" : "text-slate-500 bg-white/5"
                  )}
                  title={isVoiceEnabled ? "Disable Voice" : "Enable Voice"}
                >
                  {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.23, 1, 0.32, 1],
                    delay: 0.05 
                  }}
                  className={cn(
                    "flex gap-3 max-w-[88%]",
                    m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-lg",
                    m.role === 'user' ? "bg-slate-800 border border-white/10" : "bg-brand-primary/20 border border-brand-primary/30"
                  )}>
                    {m.role === 'user' ? <User className="w-4 h-4 text-slate-300" /> : <Bot className="w-4 h-4 text-brand-primary" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-[13px] leading-relaxed relative group shadow-sm transition-all duration-300",
                    m.role === 'user' 
                      ? "bg-gradient-to-br from-brand-primary to-blue-700 text-white rounded-tr-none blue-glow-sm" 
                      : "bg-white/10 text-slate-100 rounded-tl-none border border-white/10 backdrop-blur-md"
                  )}>
                    {m.text}
                    {m.role === 'model' && isVoiceEnabled && (
                      <button 
                        onClick={() => playVoice(m.text)}
                        className="absolute -right-9 top-0 p-2 opacity-0 group-hover:opacity-100 transition-all text-slate-500 hover:text-brand-primary hover:scale-110"
                        title="Replay Voice"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {isSpeaking && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 px-11"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, 12, 4] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 bg-brand-primary rounded-full"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-brand-primary font-bold">AI is speaking...</span>
                  <button 
                    onClick={stopVoice}
                    className="ml-auto text-[9px] uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                  >
                    Stop
                  </button>
                </motion.div>
              )}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0 mt-1 border border-brand-primary/30 shadow-lg">
                    <Bot className="w-4 h-4 text-brand-primary animate-pulse" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl rounded-tl-none border border-white/10 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              scale: [1, 1.4, 1],
                              opacity: [0.3, 1, 0.3],
                            }}
                            transition={{ 
                              duration: 1.2, 
                              repeat: Infinity, 
                              delay: i * 0.2,
                              ease: "easeInOut"
                            }}
                            className="w-1.5 h-1.5 rounded-full bg-brand-primary blue-glow-sm"
                          />
                        ))}
                      </div>
                      <span className="text-[9px] uppercase tracking-[0.3em] text-brand-primary/70 font-black">LensTalk AI is thinking</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/10 bg-black/20">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 pr-12 focus:border-brand-primary outline-none transition-all text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="mt-4 flex justify-center gap-4">
                <button className="text-[9px] uppercase tracking-widest text-slate-500 hover:text-brand-primary transition-colors flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Book Meeting
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center text-white shadow-2xl blue-glow relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        {isOpen ? <X className="relative z-10 w-8 h-8" /> : <MessageSquare className="relative z-10 w-8 h-8" />}
      </motion.button>
    </div>
  );
};
