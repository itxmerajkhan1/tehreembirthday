import React from 'react';
import { motion } from 'motion/react';
import { Gift, Heart } from 'lucide-react';

interface GiftBoxProps {
  onOpen: () => void;
}

export function GiftBox({ onOpen }: GiftBoxProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] relative px-4 text-center z-10">
      
      {/* Decorative luxury backdrop rings */}
      <div className="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-tr from-pink-500/10 via-purple-500/10 to-amber-500/5 blur-3xl -z-10 animate-pulse" />
      <div className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] rounded-full border border-white/5 -z-10 animate-[spin_40s_linear_infinite]" />
      <div className="absolute w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] rounded-full border border-dashed border-accent/20 -z-10 animate-[spin_20s_linear_infinite_reverse]" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="max-w-md space-y-6"
      >
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.25em] bg-white/5 border border-white/10 text-accent/90 shadow-sm backdrop-blur-md">
          A Special Dedication ✨
        </span>

        <h2 className="font-serif text-3xl sm:text-4.5xl text-white font-extrabold tracking-tight leading-tight">
          Tehreem, There Is A <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-accent">Surprise</span> Waiting For You!
        </h2>
        
        <p className="text-text-muted/90 text-sm sm:text-base font-light font-sans max-w-sm mx-auto leading-relaxed">
          Each friendship holds a collection of beautiful stories, support, and memories. Click the premium box below to unveil your birthday surprise.
        </p>
      </motion.div>

      {/* Elegant Gift Box Element */}
      <motion.div
        className="mt-12 cursor-pointer relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpen}
      >
        {/* Subtle pulsing background glow under gift box */}
        <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-purple-600 to-accent rounded-3xl opacity-30 blur-2xl group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

        {/* Gift Box Container */}
        <div className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] bg-white/[0.06] backdrop-blur-xl border border-white/20 rounded-2xl flex flex-col items-center justify-center relative shadow-2xl relative overflow-visible">
          
          {/* Top/Lid element with Pink/Gold Ribbon */}
          <div className="absolute top-[35%] w-[110%] h-[15px] bg-gradient-to-r from-pink-500 via-purple-500 to-accent rounded shadow-md z-10" />
          
          {/* Vertical ribbon line */}
          <div className="absolute inset-y-0 w-[15px] bg-gradient-to-b from-pink-500 via-purple-500 to-accent z-0" />

          {/* Golden animated seal/card */}
          <div className="absolute top-[18%] z-20 flex flex-col items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-300 via-accent to-yellow-600 rounded-full flex items-center justify-center shadow-lg transform rotate-45 group-hover:rotate-[225deg] transition-transform duration-700">
              <Heart className="w-5 h-5 text-ink -rotate-45 group-hover:rotate-[-225deg] transition-transform duration-700" fill="currentColor" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#c5a47e] mt-2 block animate-pulse">
              Open Box
            </span>
          </div>

          <Gift className="w-16 h-16 sm:w-20 sm:h-20 text-white/20 group-hover:text-accent/40 transition-colors duration-500 z-10" />

          {/* Floating magical sparkles above box */}
          <div className="absolute -top-6 left-1/4 animate-bounce duration-1000">✨</div>
          <div className="absolute -top-12 right-1/3 animate-bounce duration-700 delay-100">✨</div>
          <div className="absolute -bottom-4 left-1/3 animate-bounce duration-500 delay-200">✨</div>
        </div>
      </motion.div>

      <div className="mt-8 text-xs text-text-muted/60 tracking-wider">
        PREVIEW MUSIC SYNTH READY • CLICK TO UNLOCK
      </div>
    </div>
  );
}
