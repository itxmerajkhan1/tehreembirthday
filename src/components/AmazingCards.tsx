import React from 'react';
import { motion } from 'motion/react';
import { amazingAttributes } from '../data/birthdayData';
import { 
  Heart, 
  Sun, 
  Sparkles, 
  Shield, 
  HandHelping, 
  Award, 
  TrendingUp, 
  Palette,
  LucideIcon 
} from 'lucide-react';

const iconsMap: Record<string, LucideIcon> = {
  Heart,
  Sun,
  Sparkles,
  Shield,
  HandHelping,
  Award,
  TrendingUp,
  Palette
};

export function AmazingCards() {
  return (
    <div className="py-12 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {amazingAttributes.map((attr, index) => {
          const IconComponent = iconsMap[attr.iconName] || Sparkles;
          
          return (
            <motion.div
              key={attr.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -6, 
                borderColor: 'rgba(197, 164, 126, 0.4)', 
                boxShadow: '0 15px 30px -10px rgba(168, 85, 247, 0.15)' 
              }}
              className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 group flex flex-col justify-between h-48 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500/15 to-purple-500/15 border border-purple-500/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-white tracking-wide">
                  {attr.title}
                </h4>
                <p className="text-text-muted text-xs leading-relaxed font-sans font-light">
                  {attr.description}
                </p>
              </div>
              
              <div className="w-6 h-[2px] bg-accent/30 group-hover:w-full transition-all duration-300 mt-4 rounded-full" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
