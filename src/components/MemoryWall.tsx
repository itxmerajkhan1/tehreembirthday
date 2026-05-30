import React from 'react';
import { motion } from 'motion/react';
import { stickyWishes } from '../data/birthdayData';
import { Pin } from 'lucide-react';

export function MemoryWall() {
  return (
    <div className="py-12 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-5xl mx-auto">
        {stickyWishes.map((note, index) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, scale: 0.8, rotate: index % 2 === 0 ? -10 : 10 }}
            whileInView={{ 
              opacity: 1, 
              scale: 1, 
              rotate: index % 2 === 0 ? -2 : 3 
            }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ 
              type: 'spring',
              stiffness: 100,
              damping: 15,
              delay: index * 0.15 
            }}
            whileHover={{ 
              scale: 1.05, 
              rotate: 0, 
              zIndex: 10,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
            }}
            className={`p-6 pb-4 rounded-lg shadow-xl relative min-h-[160px] flex flex-col justify-between cursor-pointer transition-shadow ${note.colorClass}`}
          >
            {/* Elegant Sticky Note Metal Pushpin */}
            <div className="absolute top-1 right-1/2 translate-x-1/2 -translate-y-1/2 text-neutral-400 rotate-12 drop-shadow-sm">
              <Pin className="w-5 h-5 text-neutral-600 fill-neutral-600/30" />
            </div>

            {/* Notebook Lined Background Subtle Overlay */}
            <div className="absolute inset-x-0 top-6 bottom-0 border-t border-b border-black/[0.04] bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:100%_1.5rem] pointer-events-none" />

            {/* Note text content */}
            <p className="font-sans font-medium italic text-sm text-neutral-800 leading-relaxed z-10 pt-2 flex-1">
              "{note.text}"
            </p>

            {/* Note sender signature */}
            <div className="text-right border-t border-black/[0.08] pt-2 mt-4 z-10">
              <span className="font-serif text-xs font-bold text-neutral-700 tracking-wide">
                — {note.author}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
