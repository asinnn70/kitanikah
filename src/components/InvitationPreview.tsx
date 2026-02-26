import React from 'react';
import { WeddingDetails } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Props {
  details: WeddingDetails;
}

export const InvitationPreview: React.FC<Props> = ({ details }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Tanggal Belum Ditentukan";
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  };

  const renderTemplate = () => {
    switch (details.templateId) {
      case 'modern-minimal':
        return (
          <div className="bg-white h-full p-12 flex flex-col items-center justify-center text-center space-y-8 border-8 border-stone-50">
            <div className="space-y-2">
              <p className="uppercase tracking-[0.3em] text-xs text-stone-400">The Wedding of</p>
              <h1 className="text-5xl font-light tracking-tighter text-stone-800">
                {details.brideName} <span className="text-stone-300">&</span> {details.groomName}
              </h1>
            </div>
            <div className="w-12 h-px bg-stone-200" />
            <p className="max-w-md text-stone-500 font-light leading-relaxed italic">
              "{details.message}"
            </p>
            <div className="space-y-1">
              <p className="font-medium text-stone-800 uppercase tracking-widest text-sm">{formatDate(details.date)}</p>
              <p className="text-stone-500 text-sm">{details.time} WIB</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-stone-800">{details.venue}</p>
              <p className="text-stone-500 text-sm">{details.location}</p>
            </div>
          </div>
        );
      case 'floral-romance':
        return (
          <div className="bg-rose-50 h-full p-12 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden">
            {/* Simple floral accents using CSS shapes or just text/icons if needed, but let's use style */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-rose-200/30 rounded-full -translate-x-16 -translate-y-16 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-rose-200/30 rounded-full translate-x-16 translate-y-16 blur-3xl" />
            
            <div className="space-y-4 z-10">
              <p className="font-serif italic text-rose-400">Menuju Hari Bahagia</p>
              <h1 className="text-6xl font-serif text-rose-900 leading-tight">
                {details.brideName} <br />
                <span className="text-3xl text-rose-300">&</span> <br />
                {details.groomName}
              </h1>
            </div>
            <p className="max-w-md text-rose-800/70 font-serif italic z-10">
              {details.message}
            </p>
            <div className="z-10 bg-white/50 backdrop-blur-sm p-6 rounded-full border border-rose-100">
              <p className="font-serif text-rose-900">{formatDate(details.date)}</p>
              <p className="text-rose-400 text-sm">{details.time} WIB</p>
            </div>
            <div className="z-10">
              <p className="font-serif font-bold text-rose-900">{details.venue}</p>
              <p className="text-rose-800/60 text-sm">{details.location}</p>
            </div>
          </div>
        );
      case 'royal-gold':
        return (
          <div className="bg-stone-900 h-full p-12 flex flex-col items-center justify-center text-center space-y-8 border-[12px] border-wedding-gold/30 relative">
             <div className="absolute inset-4 border border-wedding-gold/20 pointer-events-none" />
             <div className="space-y-6">
              <p className="text-wedding-gold uppercase tracking-[0.5em] text-[10px]">Save the Date</p>
              <h1 className="text-5xl font-display text-white font-bold">
                {details.brideName} <br />
                <span className="text-wedding-gold">&</span> <br />
                {details.groomName}
              </h1>
            </div>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-wedding-gold to-transparent" />
            <p className="max-w-md text-stone-400 font-serif italic leading-relaxed">
              {details.message}
            </p>
            <div className="space-y-2">
              <p className="text-wedding-gold font-display text-xl">{formatDate(details.date)}</p>
              <p className="text-stone-500 tracking-widest text-xs uppercase">{details.time} WIB</p>
            </div>
            <div className="space-y-1">
              <p className="text-white font-medium tracking-wide">{details.venue}</p>
              <p className="text-stone-500 text-sm uppercase tracking-tighter">{details.location}</p>
            </div>
          </div>
        );
      case 'classic-serif':
      default:
        return (
          <div className="bg-[#fdfbf7] h-full p-12 flex flex-col items-center justify-center text-center space-y-10 border border-wedding-gold/20">
            <div className="space-y-4">
              <p className="font-serif italic text-wedding-gold text-lg">The Wedding of</p>
              <h1 className="text-6xl font-serif text-wedding-ink">
                {details.brideName} <br />
                <span className="text-4xl text-wedding-gold/50">&</span> <br />
                {details.groomName}
              </h1>
            </div>
            
            <div className="max-w-md space-y-6">
              <div className="h-px w-full bg-wedding-gold/20" />
              <p className="text-wedding-ink/70 font-serif leading-relaxed text-lg">
                {details.message}
              </p>
              <div className="h-px w-full bg-wedding-gold/20" />
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="font-serif text-2xl text-wedding-ink">{formatDate(details.date)}</p>
                <p className="text-wedding-gold font-medium tracking-widest text-sm uppercase">Pukul {details.time} WIB</p>
              </div>
              
              <div className="space-y-1">
                <p className="font-serif text-xl text-wedding-ink">{details.venue}</p>
                <p className="text-wedding-ink/60 text-sm italic">{details.location}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="sticky top-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">Pratinjau Undangan</h3>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-stone-200" />
          <div className="w-2 h-2 rounded-full bg-stone-200" />
          <div className="w-2 h-2 rounded-full bg-stone-200" />
        </div>
      </div>
      
      <motion.div 
        layout
        className="aspect-[3/4] w-full max-w-md mx-auto invitation-card rounded-sm overflow-hidden bg-white"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={details.templateId}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="h-full"
          >
            {renderTemplate()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      
      <p className="mt-6 text-center text-xs text-stone-400 italic">
        * Tampilan ini adalah representasi digital dari undangan Anda.
      </p>
    </div>
  );
};
