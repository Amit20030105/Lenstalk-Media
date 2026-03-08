import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { 
  Zap, 
  Target, 
  Palette, 
  Search, 
  Facebook, 
  Video, 
  Heart, 
  ArrowUpRight, 
  ChevronRight,
  Menu,
  X,
  Globe,
  BarChart3,
  Layers,
  Award,
  Users,
  MapPin,
  Camera,
  Sparkles,
  Star,
  ZapOff
} from 'lucide-react';
import { cn } from './lib/utils';
import { ChatBot } from './components/ChatBot';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current && followerRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: "power2.out"
        });
        gsap.to(followerRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor hidden md:block" />
      <div ref={followerRef} className="custom-cursor-follower hidden md:block" />
    </>
  );
};

const MagicalBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Animated Orbs */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0], 
          y: [0, -50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{ 
          x: [0, -100, 0], 
          y: [0, 100, 0],
          scale: [1.2, 1, 1.2]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[150px]" 
      />
      <motion.div 
        animate={{ 
          x: [0, 50, 0], 
          y: [0, 50, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-sky-500/5 rounded-full blur-[100px]" 
      />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="noise-bg" />
    </div>
  );
};

// Dynamic Content Configuration
const BRAND_CONFIG = {
  name: "LensTalk Media",
  location: "Bhubaneswar, Odisha",
  hero: {
    title: "Capturing Vision, Creating Impact",
    subtitle: "Bhubaneswar's #1 Digital Agency for Brands that want to lead, not follow.",
    cta: "Start Your Journey"
  },
  services: [
    {
      id: 'digital-marketing',
      title: 'Digital Marketing',
      description: 'Strategic growth campaigns that dominate the local and global market.',
      icon: Globe,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      id: 'brand-storytelling',
      title: 'Brand Storytelling',
      description: 'We don\'t just promote; we tell stories that connect with the heart of Odisha.',
      icon: Zap,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      id: 'visual-design',
      title: 'Logo & Visuals',
      description: 'Bespoke designs that give your brand a unique identity in a crowded market.',
      icon: Palette,
      color: 'text-sky-400',
      bg: 'bg-sky-400/10',
    },
    {
      id: 'ad-management',
      title: 'Google & FB Ads',
      description: 'Precision-targeted ads that convert clicks into loyal customers.',
      icon: Target,
      color: 'text-indigo-400',
      bg: 'bg-indigo-400/10',
    },
    {
      id: 'cinematography',
      title: 'Video Production',
      description: 'High-end cinematography for commercials, weddings, and brand films.',
      icon: Camera,
      color: 'text-blue-300',
      bg: 'bg-blue-300/10',
    }
  ],
  portfolio: [
    {
      title: 'Odisha Tourism Campaign',
      category: 'Digital Marketing',
      image: 'https://picsum.photos/seed/odisha/800/600',
      type: 'image'
    },
    {
      title: 'TechHub Branding',
      category: 'Visual Identity',
      image: 'https://picsum.photos/seed/techhub/800/600',
      type: 'image'
    },
    {
      title: 'Royal Wedding Film',
      category: 'Cinematography',
      image: 'https://picsum.photos/seed/weddingfilm/800/600',
      type: 'video'
    },
    {
      title: 'Local Brand Growth',
      category: 'Ad Management',
      image: 'https://picsum.photos/seed/growth/800/600',
      type: 'image'
    }
  ]
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b",
      scrolled ? "bg-slate-950/80 backdrop-blur-2xl border-white/5 py-4" : "bg-transparent border-transparent py-8"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center blue-glow group-hover:rotate-12 transition-transform">
            <Camera className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase text-white">
            Lens<span className="text-brand-primary">Talk</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {['Services', 'Work', 'Why Us', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(' ', '')}`}
              className="text-[11px] font-bold hover:text-brand-primary transition-all uppercase tracking-[0.2em] text-slate-400 relative group/nav"
            >
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-brand-primary transition-all duration-500 group-hover/nav:w-full" />
            </a>
          ))}
          <MagneticButton className="bg-brand-primary text-white px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-full blue-glow">
            Let's Talk
          </MagneticButton>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-slate-950 border-b border-white/5 p-8 flex flex-col gap-6 md:hidden overflow-hidden"
          >
            {['Services', 'Work', 'Why Us', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '')}`}
                className="text-xl font-bold hover:text-brand-primary transition-colors uppercase tracking-widest"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const HERO_VARIANTS = [
  {
    id: 'marketing',
    title: 'LensTalk',
    subtitle: 'Media',
    description: 'Bhubaneswar\'s premier digital agency for brands that want to lead, not follow.',
    accent: 'from-blue-400 via-blue-600 to-indigo-600',
    icon: Target,
    label: 'Digital Marketing Excellence'
  },
  {
    id: 'cinematography',
    title: 'Cinematic',
    subtitle: 'Vision',
    description: 'High-end brand films and storytelling that captures the heart of Odisha.',
    accent: 'from-sky-400 via-blue-500 to-indigo-400',
    icon: Camera,
    label: 'World-Class Production'
  },
  {
    id: 'branding',
    title: 'Digital',
    subtitle: 'Empire',
    description: 'We don\'t just build websites. We build legacies that stand the test of time.',
    accent: 'from-indigo-400 via-purple-500 to-blue-500',
    icon: Zap,
    label: 'Brand Identity Design'
  },
  {
    id: 'visuals',
    title: 'Visual',
    subtitle: 'Identity',
    description: 'Bespoke logos and visual systems that make your brand unforgettable.',
    accent: 'from-emerald-400 via-teal-500 to-blue-500',
    icon: Palette,
    label: 'Logo & Graphic Design'
  }
];

const MagneticButton = ({ children, className, ...props }: any) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set((e.clientX - centerX) * 0.4);
      mouseY.set((e.clientY - centerY) * 0.4);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={cn("relative group", className)}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const Hero = () => {
  const [currentVariant, setCurrentVariant] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // 3D Mouse Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

  // Parallax for text elements
  const textX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-30, 30]), springConfig);
  const textY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-30, 30]), springConfig);
  
  const subTextX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  const subTextY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), springConfig);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentVariant((prev) => (prev + 1) % HERO_VARIANTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(textRef.current.children, 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: "expo.out" }
      );
    }
  }, [currentVariant]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  const variant = HERO_VARIANTS[currentVariant];

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 perspective-2000"
    >
      {/* Mouse Following Glow */}
      <motion.div 
        style={{ 
          x: useSpring(useTransform(mouseX, [-0.5, 0.5], [-500, 500]), springConfig),
          y: useSpring(useTransform(mouseY, [-0.5, 0.5], [-500, 500]), springConfig),
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none z-0"
      />

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentVariant}
          style={{ y, opacity, rotateX, rotateY, transformStyle: "preserve-3d" }} 
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-7xl mx-auto px-6 text-center"
        >
          <motion.div
            style={{ x: subTextX, y: subTextY }}
            initial={{ opacity: 0, y: -20, skewX: -20 }}
            animate={{ opacity: 1, y: 0, skewX: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 border border-brand-primary/30 bg-brand-primary/5 px-6 py-2 rounded-full text-[10px] uppercase tracking-[0.4em] text-brand-primary mb-10 glass-panel"
          >
            <variant.icon className="w-3 h-3 animate-pulse" /> {variant.label}
          </motion.div>
          
          <motion.h1 
            style={{ x: textX, y: textY }}
            className="text-7xl md:text-[12rem] font-black tracking-tighter leading-[0.8] uppercase mb-10 text-white"
          >
            <motion.span 
              initial={{ opacity: 0, y: 100, skewY: 10 }}
              animate={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="block overflow-hidden"
            >
              {variant.title}
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 100, skewY: -10 }}
              animate={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              className={cn(
                "block overflow-hidden text-transparent bg-clip-text bg-gradient-to-r italic transition-all duration-1000",
                variant.accent
              )}
            >
              {variant.subtitle}
            </motion.span>
          </motion.h1>

          <motion.p 
            style={{ x: subTextX, y: subTextY }}
            initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-3xl mx-auto text-slate-400 text-xl md:text-2xl mb-14 leading-relaxed font-light"
          >
            {variant.description}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <MagneticButton className="bg-brand-primary text-white px-12 py-6 text-sm font-black uppercase tracking-[0.3em] overflow-hidden rounded-full blue-glow transition-all hover:scale-105 active:scale-95">
              <span className="relative z-10">Start Your Legacy</span>
              <motion.div 
                className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
              />
            </MagneticButton>
            <MagneticButton className="px-12 py-6 text-sm font-black uppercase tracking-[0.3em] border border-white/10 hover:border-brand-primary transition-all flex items-center gap-3 rounded-full glass-panel hover:bg-white/5">
              View Showreel <Video className="w-5 h-5 group-hover:scale-125 transition-transform text-brand-primary" />
            </MagneticButton>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Variant Indicators */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
        {HERO_VARIANTS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentVariant(idx)}
            className="group relative flex items-center justify-end"
          >
            <span className={cn(
              "absolute right-8 text-[9px] uppercase tracking-widest transition-all duration-500 opacity-0 group-hover:opacity-100",
              idx === currentVariant ? "text-brand-primary opacity-100" : "text-slate-500"
            )}>
              0{idx + 1}
            </span>
            <div className={cn(
              "w-2 h-10 rounded-full transition-all duration-500",
              idx === currentVariant ? "bg-brand-primary h-16" : "bg-white/10 group-hover:bg-white/30"
            )} />
          </button>
        ))}
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 opacity-40">
        <div className="text-[9px] uppercase tracking-[0.5em] text-white">Scroll to Ascend</div>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[1px] h-16 bg-gradient-to-b from-brand-primary to-transparent" 
        />
      </div>
    </section>
  );
};

const WhyUs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section id="whyus" ref={sectionRef} className="py-32 px-6 relative overflow-hidden bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <div className="text-brand-primary text-[10px] uppercase tracking-[0.4em] mb-4">The LensTalk Advantage</div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-8">
            Why We Are <span className="text-brand-primary">Best</span> In <br />
            <span className="text-white/40 italic">Bhubaneswar</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 perspective-2000">
          {/* Main Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ rotateX: 2, rotateY: -2, scale: 1.01 }}
            className="md:col-span-8 glass-card p-12 rounded-[2.5rem] relative overflow-hidden group/card"
          >
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover/card:opacity-10 transition-opacity">
              <Award className="w-64 h-64 text-brand-primary" />
            </div>
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-primary/20 rounded-full blur-[100px]" 
            />
            
            <div className="relative z-10 h-full flex flex-col justify-end">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-10 border border-brand-primary/20 group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-500">
                <Award className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 text-white leading-none">Local Roots, <br /><span className="text-brand-primary">Global Standards</span></h3>
              <p className="text-slate-400 text-lg max-w-xl font-light leading-relaxed">
                We understand the heart of Odisha. Our campaigns resonate with the local culture while maintaining the technical excellence of top-tier global agencies.
              </p>
            </div>
          </motion.div>

          {/* Secondary Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            whileHover={{ rotateX: -2, rotateY: 2, scale: 1.02 }}
            className="md:col-span-4 glass-card p-12 rounded-3xl relative overflow-hidden group bg-gradient-to-br from-brand-primary/20 to-transparent"
          >
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-8 border border-white/10 group-hover:rotate-12 transition-transform">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white">Data-Driven ROI</h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Every pixel we design and every ad we run is backed by rigorous data analysis to ensure your business grows.
            </p>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 blur-2xl rounded-full" />
          </motion.div>

          {/* Third Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            whileHover={{ rotateX: 2, rotateY: 2, scale: 1.02 }}
            className="md:col-span-4 glass-card p-12 rounded-3xl relative overflow-hidden group"
          >
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white">Client-First Philosophy</h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              We don't just have clients; we have partners. Your success is our only metric of performance.
            </p>
          </motion.div>

          {/* Fourth Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            whileHover={{ rotateX: -2, rotateY: -2, scale: 1.02 }}
            className="md:col-span-8 glass-card p-12 rounded-3xl relative overflow-hidden group border-brand-primary/30"
          >
            <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 h-full">
              <div className="flex-1">
                <div className="w-14 h-14 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-8 border border-brand-primary/20 group-hover:rotate-[-10deg] transition-transform">
                  <Layers className="w-7 h-7 text-brand-primary" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">End-to-End Production</h3>
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  From cinematic video production to high-conversion digital ads, we handle the entire creative lifecycle in-house.
                </p>
              </div>
              <div className="hidden md:block w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl animate-pulse group-hover:scale-150 transition-transform duration-1000" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const PortfolioItem = ({ item, index }: { item: typeof BRAND_CONFIG.portfolio[0], index: number }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = itemRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={itemRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative aspect-[16/10] overflow-hidden rounded-3xl glass-panel border-white/5 cursor-pointer perspective-2000"
    >
      <motion.img 
        src={item.image} 
        alt={item.title} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
        referrerPolicy="no-referrer"
      />
      
      {item.type === 'video' && (
        <div className="absolute top-6 right-6 bg-brand-primary/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 z-20">
          <Video className="w-3.5 h-3.5" /> Cinematic Post
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-12 z-10">
        <motion.div 
          style={{ translateZ: 100 }}
          className="transform-gpu"
        >
          <div className="text-[11px] uppercase tracking-[0.4em] text-brand-primary mb-4 font-black flex items-center gap-2">
            <span className="w-8 h-[1px] bg-brand-primary" /> {item.category}
          </div>
          <h3 className="text-4xl font-black uppercase tracking-tighter text-white mb-8 leading-none drop-shadow-2xl">{item.title}</h3>
          <button className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-white group/btn">
            Explore Case Study 
            <div className="relative flex items-center">
              <div className="w-12 h-[1px] bg-brand-primary group-hover/btn:w-20 transition-all duration-500" />
              <ArrowUpRight className="w-4 h-4 text-brand-primary opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-500" />
            </div>
          </button>
        </motion.div>
      </div>

      {/* 3D Floating Elements */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-white/10 rounded-3xl scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700" />
      </div>
    </motion.div>
  );
};

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <section id="services" ref={sectionRef} onMouseMove={handleMouseMove} className="py-32 px-6 relative overflow-hidden group/services">
      {/* Spotlight Effect */}
      <div 
        className="absolute pointer-events-none inset-0 z-0 transition-opacity duration-500 opacity-0 group-hover/services:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.06), transparent 40%)`,
        }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-24">
          <div className="max-w-2xl">
            <div className="text-brand-primary text-[10px] uppercase tracking-[0.4em] mb-4">Our Expertise</div>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
              Digital <br />
              <span className="text-slate-600 italic">Evolution</span>
            </h2>
          </div>
          <p className="text-slate-400 max-w-md text-lg font-light leading-relaxed">
            From viral social media campaigns to cinematic brand films, we provide the tools your brand needs to dominate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-2000">
          {BRAND_CONFIG.services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ 
                rotateX: 10, 
                rotateY: -10, 
                z: 50,
                scale: 1.05 
              }}
              className="group glass-card p-12 rounded-3xl border-white/5 relative overflow-hidden service-card cursor-pointer"
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-[15deg] relative", 
                service.bg
              )}>
                <div className="absolute inset-0 bg-inherit rounded-inherit blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <service.icon className={cn("w-8 h-8 relative z-10", service.color)} />
              </div>
              
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 group-hover:text-brand-primary transition-colors relative z-10 flex items-center gap-3">
                {service.title}
                <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
              </h3>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-10 font-light relative z-10">
                {service.description}
              </p>
              
              <div className="absolute top-0 right-0 p-8 text-white/5 font-black text-8xl select-none pointer-events-none group-hover:text-brand-primary/10 transition-colors">
                {index + 1}
              </div>

              {/* Magical Border Accent */}
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-primary group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Work = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section id="work" ref={sectionRef} className="py-32 px-6 bg-slate-950/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-24">
          <div className="max-w-2xl">
            <div className="text-brand-primary text-[10px] uppercase tracking-[0.4em] mb-4">Selected Work</div>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
              Visual <br />
              <span className="text-slate-600 italic">Stories</span>
            </h2>
          </div>
          <button className="group flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] hover:text-brand-primary transition-all">
            Explore All <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {BRAND_CONFIG.portfolio.map((item, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
              className="portfolio-card"
            >
              <PortfolioItem item={item} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // 3D Form Tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = formRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-32 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="contact-content"
        >
          <div className="text-brand-primary text-[10px] uppercase tracking-[0.4em] mb-4">Get in Touch</div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-10">
            Let's <br />
            <span className="text-slate-600 italic">Lens</span> <br />
            Your Story
          </h2>
          <p className="text-slate-400 text-xl mb-16 max-w-md font-light leading-relaxed">
            Ready to make your brand the talk of the town? We're just a message away. Experience the <span className="text-white font-medium">LensTalk</span> magic.
          </p>
          
          <div className="space-y-10">
            <motion.div 
              whileHover={{ x: 10 }}
              className="flex items-center gap-6 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-brand-primary group-hover:blue-glow transition-all duration-500">
                <Globe className="w-7 h-7 text-brand-primary" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-slate-500 mb-1">Email Us</div>
                <div className="text-2xl font-black tracking-tighter">hello@lenstalk.media</div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ x: 10 }}
              className="flex items-center gap-6 group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-brand-primary group-hover:blue-glow transition-all duration-500">
                <MapPin className="w-7 h-7 text-brand-primary" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-slate-500 mb-1">Our Studio</div>
                <div className="text-2xl font-black tracking-tighter">Patia, Bhubaneswar, Odisha</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          ref={formRef}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          onMouseMove={handleMouseMove}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="glass-panel p-12 md:p-16 rounded-[2.5rem] relative overflow-hidden contact-form perspective-2000"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <form className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Full Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-brand-primary focus:bg-white/10 outline-none transition-all text-white placeholder:text-slate-700" placeholder="John Doe" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Email Address</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-brand-primary focus:bg-white/10 outline-none transition-all text-white placeholder:text-slate-700" placeholder="john@example.com" />
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Project Type</label>
              <div className="relative">
                <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-brand-primary focus:bg-white/10 outline-none transition-all text-white appearance-none cursor-pointer">
                  <option className="bg-slate-900">Digital Marketing</option>
                  <option className="bg-slate-900">Cinematography</option>
                  <option className="bg-slate-900">Visual Branding</option>
                  <option className="bg-slate-900">Ad Management</option>
                </select>
                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none rotate-90" />
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Your Vision</label>
              <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-brand-primary focus:bg-white/10 outline-none transition-all text-white placeholder:text-slate-700 resize-none" placeholder="Tell us about your brand..." />
            </div>
            
            <MagneticButton 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-primary text-white py-6 rounded-2xl text-sm font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all blue-glow"
            >
              Send Message
            </MagneticButton>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-white/5 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
              <Camera className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase text-white">LensTalk</span>
          </div>
          
          <div className="flex flex-wrap gap-10">
            {['Twitter', 'Instagram', 'LinkedIn', 'Facebook'].map((social) => (
              <a key={social} href="#" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-brand-primary transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
          <div className="text-[10px] uppercase tracking-[0.3em] text-slate-600">
            © 2024 LensTalk Media. Crafted in Bhubaneswar.
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-[9px] uppercase tracking-widest text-slate-600 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-[9px] uppercase tracking-widest text-slate-600 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen selection:bg-brand-primary selection:text-white bg-brand-bg overflow-x-hidden">
      <CustomCursor />
      <MagicalBackground />
      <Navbar />
      <main>
        <Hero />
        <WhyUs />
        <Services />
        <Work />
        <Contact />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}
