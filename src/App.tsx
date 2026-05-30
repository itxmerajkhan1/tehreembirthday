import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GiftBox } from './components/GiftBox';
import { NotebookNotes } from './components/NotebookNotes';
import { AmazingCards } from './components/AmazingCards';
import { MemoryWall } from './components/MemoryWall';
import { FloatingBalloons } from './components/FloatingBalloons';
import { ConfettiEffect } from './components/ConfettiEffect';
import { ParticleCanvas } from './components/ParticleCanvas';
import { FireworksCanvas } from './components/FireworksCanvas';
import { birthdaySynthInstance } from './components/AudioPlayer';
import { 
  VolumeX, 
  Volume2, 
  Gift, 
  Sparkles, 
  X, 
  Cake, 
  Star, 
  Award,
  Heart,
  Music,
  ArrowDown
} from 'lucide-react';

// Premium Typewriter effect with luxurious pacing
function TypewriterText({ text, active }: { text: string, active: boolean }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (!active) return;
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, index + 1));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text, active]);

  return (
    <span className="font-sans font-medium text-text-muted/95 italic relative">
      "{displayedText}"
      <span className="inline-block w-[2px] h-[1em] bg-accent/80 ml-1 rounded shadow animate-ping" />
    </span>
  );
}

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [triggerBurst, setTriggerBurst] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [timeRemaining, setTimeRemaining] = useState(10);
  const countdownIntervalRef = useRef<number | null>(null);

  // Special Birthday/Final Section Trigger state
  const [finalSectionInView, setFinalSectionInView] = useState(false);
  const finalSectionRef = useRef<HTMLElement | null>(null);

  // Mouse custom glow helper tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // IntersectionObserver to trigger fireworks and balloons when user lands on final section
  useEffect(() => {
    if (!isOpened) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFinalSectionInView(true);
          // Auto-trigger falling confetti explosion for higher engagement!
          setTriggerBurst(true);
          setTimeout(() => setTriggerBurst(false), 2000);
        } else {
          setFinalSectionInView(false);
        }
      },
      { threshold: 0.25 }
    );

    const target = finalSectionRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [isOpened]);

  // Trigger continuous melody on launch
  const handleOpenGift = () => {
    setIsOpened(true);
    setTriggerBurst(true);
    // Soft timeouts to reset trigger state
    setTimeout(() => setTriggerBurst(false), 2200);

    // Initialise audio context & play sweet melody
    if (!isMuted) {
      birthdaySynthInstance.start();
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      birthdaySynthInstance.start();
      setIsMuted(false);
    } else {
      birthdaySynthInstance.stop();
      setIsMuted(true);
    }
  };

  // Triggers the countdown/autoclose logic of the custom birthday surprise pop-up
  const handleOpenSurprise = () => {
    setShowSurprise(true);
    setTriggerBurst(true);
    setTimeout(() => setTriggerBurst(false), 1500);
    
    setTimeRemaining(10);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    
    countdownIntervalRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setShowSurprise(false);
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCloseSurprise = () => {
    setShowSurprise(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  };

  // Clean bounds up on component exit
  useEffect(() => {
    return () => {
      birthdaySynthInstance.stop();
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a0b] text-white font-sans selection:bg-accent/40 selection:text-white overflow-x-hidden scroll-smooth">
      
      {/* Absolute Dynamic Background Noise + Gradients with parallax depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-[#0a0a0b] to-[#040405] -z-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] rounded-full bg-pink-500/5 blur-[140px] -z-10 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] rounded-full bg-purple-500/5 blur-[140px] -z-10 pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />

      {/* Cursor Radial Glow Tracking */}
      <div 
        className="fixed w-[320px] h-[320px] rounded-full cursor-glow-element pointer-events-none -z-10 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200" 
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />

      {/* Persistent floating particles */}
      <ParticleCanvas active={isOpened} />

      {/* Floating balloons and custom confetti cascades */}
      <FloatingBalloons active={isOpened} />
      <ConfettiEffect active={isOpened} triggerBurst={triggerBurst || finalSectionInView} />

      {/* Dynamic Sound Action Indicator with animation / Equalizer bars */}
      {isOpened && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-[#141416]/90 backdrop-blur-xl border border-white/10 py-2.5 px-4 rounded-full shadow-2xl"
        >
          {/* Audio Visualizer Equalizer (CSS-animated waves) */}
          {!isMuted && (
            <div className="flex items-end space-x-1 h-5 select-none w-6 justify-center">
              <span className="w-1 bg-accent rounded-full animate-[bounce_1.2s_infinite] h-3" style={{ animationDelay: '0.1s' }} />
              <span className="w-1 bg-pink-500 rounded-full animate-[bounce_1s_infinite] h-5" style={{ animationDelay: '0.3s' }} />
              <span className="w-1 bg-accent rounded-full animate-[bounce_1.4s_infinite] h-4" style={{ animationDelay: '0.5s' }} />
              <span className="w-1 bg-purple-500 rounded-full animate-[bounce_0.8s_infinite] h-2" style={{ animationDelay: '0.2s' }} />
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleMute}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/15 hover:bg-white/10 flex items-center justify-center text-accent hover:text-white transition-colors cursor-pointer"
            title={isMuted ? "Unmute Birthday Melody" : "Mute Birthday Melody"}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5" />}
          </motion.button>
        </motion.div>
      )}

      {/* Main Experience Gateways */}
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div 
            key="gift-gate"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <GiftBox onOpen={handleOpenGift} />
          </motion.div>
        ) : (
          <motion.div 
            key="birthday-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-28 sm:space-y-40 relative z-10"
          >
            {/* Header / Brand identity label */}
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
              <div className="flex items-center space-x-2">
                <Music className="w-4 h-4 text-accent animate-spin" style={{ animationDuration: '8s' }} />
                <span className="font-serif text-lg tracking-wider font-extrabold text-[#c5a47e]">
                  Sentinel of Friends
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-text-muted">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="tracking-widest uppercase">Celebration Active</span>
              </div>
            </div>

            {/* HERO SECTION UPGRADE & TYPEWRITER TEXT */}
            <section className="text-center space-y-8 pt-6 relative min-h-[400px] flex flex-col justify-center items-center">
              
              {/* Premium star overlays on title */}
              <div className="absolute top-0 animate-bounce duration-1000 text-pink-400 opacity-60">✨</div>
              <div className="absolute left-10 bottom-6 animate-pulse text-accent opacity-45">✨</div>
              <div className="absolute right-12 top-1/3 animate-ping duration-1000 text-purple-400 opacity-30">✨</div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="inline-block relative"
              >
                {/* Glowing ring wrapper */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-accent rounded-full blur-md opacity-25 animate-pulse" />
                <div className="relative px-6 py-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs sm:text-sm font-semibold tracking-[0.25em] text-accent/95 uppercase shadow-xl">
                  ✨ Happy 2026 Milestone ✨
                </div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, type: 'spring', stiffness: 50 }}
                className="font-serif text-4xl sm:text-6xl md:text-8xl font-black luxury-gradient-text leading-tight tracking-tight select-none py-2"
              >
                🎉 Happy Birthday Tehreem 🎉
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="min-h-[50px] flex items-center justify-center text-center px-4"
              >
                <div className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
                  <TypewriterText 
                    active={isOpened} 
                    text="Wishing you a day filled with happiness, laughter, success, and beautiful memories." 
                  />
                </div>
              </motion.div>

              {/* Decorative design indicators */}
              <div className="flex flex-col items-center pt-8 space-y-4">
                <div className="flex justify-center items-center space-x-4">
                  <div className="w-[80px] h-[1px] bg-gradient-to-r from-transparent to-accent/40" />
                  <Sparkles className="w-5 h-5 text-accent animate-spin" style={{ animationDuration: '6s' }} />
                  <div className="w-[80px] h-[1px] bg-gradient-to-l from-transparent to-accent/40" />
                </div>
                
                {/* Scroll reminder visual cues */}
                <span className="text-[10px] uppercase tracking-[0.25em] text-text-muted/60 flex items-center space-x-1.5 animate-bounce">
                  <span>Scroll Down to Celebrate</span>
                  <ArrowDown className="w-3 h-3 text-accent" />
                </span>
              </div>
            </section>

            {/* FRIENDSHIP NOTES DECK (AOS-style reveal wrapper) */}
            <motion.section 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="space-y-12"
            >
              <div className="text-center space-y-2">
                <h3 className="font-serif text-3xl sm:text-4.5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#c5a47e]">
                  Friendship Notes For You
                </h3>
                <p className="text-text-muted text-xs sm:text-sm max-w-md mx-auto font-light font-sans leading-relaxed">
                  Flip through some of the genuine lessons, appreciation, and wishes that highlight our spectacular journey.
                </p>
              </div>
              <NotebookNotes />
            </motion.section>

            {/* THINGS THAT MAKE TEHREEM AMAZING (AOS reveal + Glass design cards) */}
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8 }}
              className="space-y-12 bg-white/[0.01] rounded-3xl p-8 sm:p-14 border border-white/5 backdrop-blur-sm relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Award className="w-48 h-48 text-[#c5a47e]" />
              </div>
              
              <div className="text-center space-y-3 max-w-xl mx-auto">
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-accent/80 block">
                  Virtues & Talents
                </span>
                <h3 className="font-serif text-2xl sm:text-4.5xl font-extrabold text-white">
                  🌟 Things That Make Tehreem Amazing
                </h3>
                <p className="text-text-muted text-xs sm:text-sm font-light leading-relaxed">
                  A sincere visual dedication to the traits, virtues, and attitude that set you apart in the best ways possible.
                </p>
              </div>

              <AmazingCards />
            </motion.section>

            {/* INTERACTIVE COMPONENT: SURPRISE LAUNCHER */}
            <motion.section 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center py-10 space-y-8 relative"
            >
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="w-[320px] h-[320px] rounded-full bg-gradient-to-r from-pink-500/10 to-accent/5 blur-3xl animate-pulse" />
              </div>

              <div className="space-y-3 max-w-md mx-auto">
                <h4 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">Unveil The Golden Blessing</h4>
                <p className="text-text-muted text-xs sm:text-sm font-light leading-relaxed px-4">
                  Click the premium trigger below to receive an interactive, elegant birthday card overlay.
                </p>
              </div>

              {/* Glowing Interactive Shimmer Button wrapper */}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(197, 164, 126, 0.45)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenSurprise}
                className="px-10 py-5 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-accent text-white font-serif font-bold text-base tracking-widest uppercase shadow-2xl relative overflow-hidden group cursor-pointer border border-white/20"
              >
                {/* Shimmer animation */}
                <div className="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="flex items-center justify-center space-x-2.5">
                  <Gift className="w-5 h-5 animate-bounce" />
                  <span>🎁 Open Birthday Surprise</span>
                </span>
              </motion.button>
            </motion.section>

            {/* MEMORY STICKY WALL */}
            <motion.section 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="space-y-12"
            >
              <div className="text-center space-y-2 max-w-md mx-auto">
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-accent/80 block">
                  Community Corner
                </span>
                <h3 className="font-serif text-2xl sm:text-3.5xl font-extrabold text-white">
                  ✍️ The Birthday Sticky Wall
                </h3>
                <p className="text-text-muted text-xs sm:text-sm font-light">
                  A gorgeous board of wishes, quotes, and memories pinned down to celebrate Tehreem's day.
                </p>
              </div>

              <MemoryWall />
            </motion.section>

            {/* FINAL CELEBRATION SECTION WITH AUTOMATIC FIREWORKS OVERLAY */}
            <section 
              ref={finalSectionRef}
              className="text-center max-w-3xl mx-auto py-18 px-6 sm:px-12 rounded-3xl bg-gradient-to-tr from-white/[0.01] via-[#141416]/75 to-white/[0.03] border border-white/10 relative overflow-hidden shadow-2xl z-10"
            >
              {/* Specialized dynamic Canvas Fireworks rendered if finalSectionInView is active! */}
              <FireworksCanvas active={finalSectionInView} />

              {/* Balloon indicator indicators */}
              <div className="absolute top-4 left-6 animate-pulse text-pink-400 select-none z-20">🎈</div>
              <div className="absolute top-12 right-8 animate-bounce text-purple-400 select-none z-20">✨</div>
              <div className="absolute bottom-6 left-12 animate-ping text-accent select-none z-20 opacity-40">★</div>

              <div className="space-y-8 relative z-20">
                <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mx-auto shadow-inner">
                  <Cake className="w-8 h-8 animate-bounce" />
                </div>

                <motion.h3 
                  animate={finalSectionInView ? { 
                    scale: [1, 1.03, 1],
                    textShadow: [
                      '0 0 10px rgba(197, 164, 126, 0.2)',
                      '0 0 20px rgba(197, 164, 126, 0.4)',
                      '0 0 10px rgba(197, 164, 126, 0.2)'
                    ]
                  } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="font-serif text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-accent tracking-normal leading-tight mx-auto select-none"
                >
                  🎂 Have An Amazing Birthday, Tehreem! 🎂
                </motion.h3>

                <p className="text-text-muted font-sans text-sm sm:text-base leading-relaxed tracking-wide italic font-light max-w-xl mx-auto">
                  "May your birthday be as wonderful as your personality and may every day ahead bring new reasons to smile. Stay happy, stay successful, and keep shining. Happy Birthday, Tehreem!"
                </p>

                {/* Sparkling gold ribbon */}
                <div className="flex justify-center space-x-3 text-[10px] tracking-widest uppercase text-accent font-bold pt-4">
                  <span className="bg-white/5 py-1 px-3 rounded-full border border-white/5">Loyalty</span>
                  <span className="bg-white/5 py-1 px-3 rounded-full border border-white/5">Support</span>
                  <span className="bg-white/5 py-1 px-3 rounded-full border border-white/5">Cherished Friendship</span>
                </div>
              </div>
            </section>

            {/* Footer rights/dedication credits */}
            <footer className="text-center pt-10 border-t border-white/5 text-xs text-text-muted/60 space-y-1.5 pb-6">
              <p>© 2026 Built for Tehreem. All Wishes Registered.</p>
              <p>An elegant, premium tribute to genuine support and friendship.</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SURPRISE POPUP MODAL DIALOG OVERLAY WITH TWINKLING FLOATING STARS & COUNTDOWN BAR */}
      <AnimatePresence>
        {showSurprise && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Blurry Backdrop Filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseSurprise}
              className="absolute inset-0 bg-[#060608]/92 backdrop-blur-2xl"
            />

            {/* Star sparkles under popup */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center overflow-hidden">
              <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-r from-pink-500/10 to-accent/10 blur-3xl" />
              {Array.from({ length: 18 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5, y: 120 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5], y: -250 }}
                  transition={{
                    duration: 4 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                  className="absolute text-yellow-300 pointer-events-none"
                  style={{
                    left: `${15 + Math.random() * 70}%`,
                    top: `${40 + Math.random() * 50}%`,
                    fontSize: `${12 + Math.random() * 20}px`
                  }}
                >
                  ✦
                </motion.div>
              ))}
            </div>

            {/* Actual Surprise Popup Card */}
            <motion.div
              initial={{ scale: 0.88, y: 30, opacity: 0 }}
              animate={{ 
                scale: 1, 
                y: 0, 
                opacity: 1,
                transition: { type: 'spring', stiffness: 140, damping: 20 } 
              }}
              exit={{ scale: 0.88, y: 30, opacity: 0 }}
              className="relative w-full max-w-lg p-8 sm:p-11 rounded-3xl bg-[#141416]/95 border border-[#c5a47e]/55 shadow-2xl backdrop-blur-3xl z-10 flex flex-col items-center text-center space-y-6"
            >
              {/* Close Button */}
              <button 
                onClick={handleCloseSurprise}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-text-muted hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Glowing Top Medallion */}
              <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent/90 shadow-[0_0_15px_rgba(197,164,126,0.3)] animate-pulse">
                <Star className="w-7 h-7 fill-accent/40" />
              </div>

              {/* Popup Title */}
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-extrabold tracking-tight">
                A Birthday Blessing
              </h3>

              {/* Heartfelt wish message for Tehreem */}
              <p className="font-sans text-sm sm:text-base leading-relaxed text-neutral-200 font-light italic">
                "Tehreem, may this year bring you endless happiness, success, good health, wonderful opportunities, and countless beautiful moments. Keep smiling and keep shining. Happy Birthday!"
              </p>

              {/* Dynamic countdown visual progress meter bar */}
              <div className="w-full space-y-2 pt-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-[#c5a47e]/80">
                  <span>Autoclose Display</span>
                  <span>{timeRemaining}s</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: `${(timeRemaining / 10) * 100}%` }}
                    transition={{ duration: 1, ease: 'linear' }}
                    className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-accent shadow-[0_0_8px_rgba(197,164,126,0.5)]" 
                  />
                </div>
              </div>

              <button 
                onClick={handleCloseSurprise}
                className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest bg-white text-[#141416] hover:bg-accent hover:text-white transition-all shadow-xl cursor-pointer"
              >
                Thank You ✨
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
