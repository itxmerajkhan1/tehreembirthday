import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { friendshipNotes } from '../data/birthdayData';
import { ChevronLeft, ChevronRight, Notebook, Sparkles } from 'lucide-react';

export function NotebookNotes() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    if (isAnimating) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % friendshipNotes.length);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + friendshipNotes.length) % friendshipNotes.length);
  };

  const currentNote = friendshipNotes[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 w-full select-none">
      
      {/* Small Section Tag */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="relative">
          <Notebook className="w-5 h-5 text-accent animate-pulse" />
          <div className="absolute -inset-1 rounded-full bg-accent/25 blur animate-ping pointer-events-none" />
        </div>
        <span className="text-[12px] uppercase tracking-[0.25em] text-accent font-bold">
          Tehreem's Friendship Notebook • Note {currentIndex + 1} of {friendshipNotes.length}
        </span>
      </div>

      {/* Realistic Interactive Notebook Card Container with smooth 3D Depth shadows */}
      <div className="relative w-full max-w-xl min-h-[440px] sm:min-h-[390px] mb-8 relative">
        
        {/* Soft realistic leather-pad background outline for luxury 3D book depth */}
        <div className="absolute -inset-4 rounded-[24px] bg-gradient-to-br from-[#27211a] via-[#1a1410] to-[#0a0806] border border-white/5 opacity-80 -z-10 shadow-2xl" />
        <div className="absolute -inset-2 rounded-[20px] bg-[#1a1a1c]/90 border border-white/10 -z-10 shadow-lg" />

        {/* Binder Metal Coils Decor with realistic metallic reflections */}
        <div className="absolute -top-6 inset-x-8 flex justify-between z-30 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Sleek shadow loop */}
              <div className="w-[10px] h-[32px] bg-gradient-to-b from-[#4a4a4d] via-[#e2e8f0] to-[#1e1f22] rounded-full shadow-md border-b border-black/40" />
              {/* Punch Hole */}
              <div className="w-[14px] h-[14px] rounded-full bg-[#111112] border border-neutral-700/50 -mt-1.5 shadow-inner" />
            </div>
          ))}
        </div>

        {/* Paper Container Animation */}
        <AnimatePresence 
          mode="wait" 
          custom={direction}
          onExitComplete={() => setIsAnimating(false)}
        >
          <motion.div
            key={currentNote.id}
            custom={direction}
            onAnimationStart={() => setIsAnimating(true)}
            initial={{ 
              opacity: 0, 
              rotateX: -12, 
              rotateY: direction * 55, 
              scale: 0.9,
              z: -120 
            }}
            animate={{ 
              opacity: 1, 
              rotateX: 0, 
              rotateY: 0, 
              scale: 1,
              z: 0 
            }}
            exit={{ 
              opacity: 0, 
              rotateX: 12, 
              rotateY: -direction * 55, 
              scale: 0.9,
              z: -120
            }}
            transition={{ 
              duration: 0.7, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            style={{ transformStyle: 'preserve-3d', transformOrigin: direction > 0 ? 'left center' : 'right center' }}
            // Styled like beautiful premium notebook paper with custom vintage texture
            className="w-full min-h-[440px] sm:min-h-[390px] paper-texture text-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col p-8 sm:p-10 relative border-l-8 border-[#c5a47e]"
          >
            {/* Lined paper margin line standard notebook style */}
            <div className="absolute top-0 bottom-0 left-[45px] sm:left-[60px] w-[1.5px] bg-red-400/70 pointer-events-none" />

            {/* Note details & texts */}
            <div className="flex-1 flex flex-col pl-[35px] sm:pl-[50px] relative z-10 pt-4">
              
              {/* Theme/Header */}
              <div className="flex justify-between items-start mb-6 border-b-2 border-dashed border-accent/20 pb-2">
                <h4 className="font-sans text-xs uppercase tracking-[0.18em] font-bold text-[#927859]">
                  {currentNote.theme}
                </h4>
                <span className="font-mono text-[9px] font-semibold text-neutral-400 bg-neutral-100 rounded px-2 py-0.5">
                  PAGE 0{currentNote.id}
                </span>
              </div>

              {/* Heartfelt friendship message text */}
              <p className="font-sans text-neutral-800 leading-[2.2rem] sm:leading-[2.2rem] text-sm sm:text-base italic font-semibold whitespace-pre-line tracking-wide flex-1 pr-2">
                "{currentNote.message}"
              </p>

              {/* Signature / Footer */}
              <div className="mt-8 flex justify-end items-center space-x-1.5 font-serif text-sm border-t border-neutral-200/80 pt-4">
                <span className="text-neutral-500 text-xs italic">Sincerely,</span>
                <span className="font-serif text-[#927859] font-extrabold tracking-tight">
                  {currentNote.signature}
                </span>
              </div>
            </div>

            {/* Luxury foil background wax seal watermark */}
            <div className="absolute bottom-6 left-6 opacity-[0.06] pointer-events-none">
              <Sparkles className="w-20 h-20 text-accent animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Upgraded Dual Navigation buttons with magnetic hover */}
      <div className="flex items-center space-x-4 select-none">
        
        {/* Previous Button */}
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrev}
          className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-accent hover:text-white transition-colors cursor-pointer"
          title="Back Note"
          disabled={isAnimating}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        
        {/* Next Trigger CTA */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="px-8 py-4 rounded-full font-serif font-bold tracking-wider text-black bg-gradient-to-r from-amber-300 via-accent to-yellow-600 shadow-xl flex items-center space-x-2 border border-white/20 cursor-pointer"
          disabled={isAnimating}
        >
          <span>Open Next Note ✨</span>
          <ChevronRight className="w-4 h-4 animate-pulse" />
        </motion.button>

      </div>
    </div>
  );
}
