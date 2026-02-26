import React from 'react';
import { WeddingDetails } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Calendar, MapPin, Clock, MessageSquare, Send, Users } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { cn } from '../lib/utils';

interface Props {
  details: WeddingDetails;
  invitationId?: string;
}

export const LiveInvitation: React.FC<Props> = ({ details, invitationId }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [rsvp, setRsvp] = React.useState({ name: '', attendance: 'hadir', message: '' });
  const [rsvps, setRsvps] = React.useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [guestInfo, setGuestInfo] = React.useState({ name: '', title: '' });

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setGuestInfo({
      name: params.get('to') || '',
      title: params.get('title') || ''
    });

    if (invitationId) {
      fetch(`/api/invitations/${invitationId}/rsvps`)
        .then(res => res.json())
        .then(data => setRsvps(data));
    }
  }, [invitationId]);

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitationId) return;
    setIsSubmitting(true);
    try {
      await fetch(`/api/invitations/${invitationId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvp),
      });
      setRsvp({ name: '', attendance: 'hadir', message: '' });
      // Refresh RSVPs
      const res = await fetch(`/api/invitations/${invitationId}/rsvps`);
      const data = await res.json();
      setRsvps(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (!details.date || !details.time) return;
      
      const target = new Date(`${details.date}T${details.time}`).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (isNaN(distance) || distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [details.date, details.time]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (!isOpen) {
    return (
      <div className="fixed inset-0 z-[100] bg-wedding-cream flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Background Image with Blur */}
        {details.coverPhoto && (
          <div className="absolute inset-0 z-0">
            <img 
              src={details.coverPhoto} 
              alt="Background" 
              className="w-full h-full object-cover opacity-20 blur-sm"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-wedding-cream/60" />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 z-10"
        >
          {details.coverPhoto && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-48 h-64 mx-auto rounded-t-full rounded-b-lg border-4 border-white shadow-2xl overflow-hidden"
            >
              <img 
                src={details.coverPhoto} 
                alt="Cover" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          )}
          <div className="space-y-4">
            <p className="font-serif italic text-wedding-gold text-xl">The Wedding of</p>
            <h1 className="text-6xl font-serif text-wedding-ink">
              {details.brideName} & {details.groomName}
            </h1>
          </div>

          {guestInfo.name && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-2 py-4 border-y border-wedding-gold/20"
            >
              <p className="text-xs uppercase tracking-widest text-stone-500">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <h2 className="text-2xl font-serif text-wedding-ink font-bold">{guestInfo.name}</h2>
              {guestInfo.title && <p className="text-sm text-wedding-gold italic">{guestInfo.title}</p>}
            </motion.div>
          )}

          <Button 
            onClick={() => setIsOpen(true)}
            size="lg"
            className="rounded-full bg-wedding-gold hover:bg-wedding-gold/90 text-white px-12 py-8 text-xl shadow-xl shadow-wedding-gold/20"
          >
            Buka Undangan
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-wedding-cream min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center text-center p-6 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="space-y-6 z-10"
        >
          <p className="uppercase tracking-[0.5em] text-xs text-wedding-gold">Save the Date</p>
          <h1 className="text-7xl font-serif text-wedding-ink leading-tight">
            {details.brideName} <br />
            <span className="text-4xl text-wedding-gold/40">&</span> <br />
            {details.groomName}
          </h1>
          <p className="text-xl font-serif text-wedding-ink/60">{formatDate(details.date)}</p>
        </motion.div>
        <div className="absolute bottom-10 animate-bounce">
          <div className="w-px h-12 bg-wedding-gold/40" />
        </div>
      </section>

      {/* Message Section */}
      <section className="py-24 px-6 max-w-2xl mx-auto text-center space-y-8">
        <Heart className="w-8 h-8 text-wedding-rose mx-auto fill-wedding-rose/20" />
        <p className="text-xl font-serif italic text-wedding-ink/80 leading-relaxed">
          "{details.message}"
        </p>
      </section>

      {/* Couple Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-center space-y-4"
          >
            <div className="w-48 h-48 mx-auto rounded-full bg-stone-50 border-4 border-wedding-gold/20 flex items-center justify-center overflow-hidden">
               <img src={`https://picsum.photos/seed/${details.brideName}/400/400`} alt={details.brideName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <h3 className="text-4xl font-serif text-wedding-ink">{details.brideName}</h3>
            <p className="text-stone-500 text-sm italic">{details.brideParents}</p>
          </motion.div>

          <div className="text-6xl font-serif text-wedding-gold/30">&</div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-center space-y-4"
          >
            <div className="w-48 h-48 mx-auto rounded-full bg-stone-50 border-4 border-wedding-gold/20 flex items-center justify-center overflow-hidden">
               <img src={`https://picsum.photos/seed/${details.groomName}/400/400`} alt={details.groomName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <h3 className="text-4xl font-serif text-wedding-ink">{details.groomName}</h3>
            <p className="text-stone-500 text-sm italic">{details.groomParents}</p>
          </motion.div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-12 bg-wedding-ink text-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            {[
              { label: 'Hari', value: timeLeft.days },
              { label: 'Jam', value: timeLeft.hours },
              { label: 'Menit', value: timeLeft.minutes },
              { label: 'Detik', value: timeLeft.seconds },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl md:text-5xl font-serif text-wedding-gold">{item.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-stone-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-4xl font-serif text-wedding-ink">Akad Nikah</h2>
            <div className="space-y-4 text-stone-600">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Calendar className="w-5 h-5 text-wedding-gold" />
                <span>{formatDate(details.date)}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Clock className="w-5 h-5 text-wedding-gold" />
                <span>{details.time} WIB - Selesai</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <MapPin className="w-5 h-5 text-wedding-gold" />
                <span>{details.venue}, {details.location}</span>
              </div>
            </div>
          </div>
          <div className="h-64 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-400 border border-black/5">
            <MapPin className="w-12 h-12 mb-2" />
            <span className="text-sm">Peta Lokasi</span>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {details.gallery && details.gallery.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-serif text-wedding-ink">Momen Bahagia</h2>
              <p className="text-stone-500 italic">Galeri foto pre-wedding kami</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {details.gallery.map((url, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="aspect-square rounded-2xl overflow-hidden border border-black/5 shadow-sm"
                >
                  <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Section */}
      {details.videoUrl && (
        <section className="py-24 bg-wedding-cream">
          <div className="max-w-4xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-serif text-wedding-ink">Video Undangan</h2>
            </div>
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <iframe
                width="100%"
                height="100%"
                src={details.videoUrl.replace("watch?v=", "embed/").split("&")[0]}
                title="Wedding Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <section className="py-24 px-6 bg-wedding-cream">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-xl shadow-black/5 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-serif text-wedding-ink">Konfirmasi Kehadiran</h2>
            <p className="text-stone-500 text-sm">Mohon konfirmasi kehadiran Anda melalui form di bawah ini.</p>
          </div>

          <form onSubmit={handleRSVP} className="space-y-4">
            <div className="space-y-2">
              <Input 
                placeholder="Nama Lengkap" 
                value={rsvp.name}
                onChange={e => setRsvp({...rsvp, name: e.target.value})}
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRsvp({...rsvp, attendance: 'hadir'})}
                className={cn(
                  "flex-1 py-3 rounded-xl border-2 transition-all text-sm font-medium",
                  rsvp.attendance === 'hadir' ? "border-wedding-gold bg-wedding-gold/5 text-wedding-gold" : "border-stone-100 text-stone-400"
                )}
              >
                Hadir
              </button>
              <button
                type="button"
                onClick={() => setRsvp({...rsvp, attendance: 'tidak hadir'})}
                className={cn(
                  "flex-1 py-3 rounded-xl border-2 transition-all text-sm font-medium",
                  rsvp.attendance === 'tidak hadir' ? "border-wedding-rose bg-wedding-rose/5 text-wedding-rose" : "border-stone-100 text-stone-400"
                )}
              >
                Tidak Hadir
              </button>
            </div>
            <div className="space-y-2">
              <Textarea 
                placeholder="Ucapan & Doa" 
                value={rsvp.message}
                onChange={e => setRsvp({...rsvp, message: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full py-6 rounded-xl" disabled={isSubmitting}>
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Mengirim..." : "Kirim Konfirmasi"}
            </Button>
          </form>
        </div>
      </section>

      {/* Guestbook Section */}
      <section className="py-24 px-6 max-w-2xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-wedding-gold mb-2">
            <MessageSquare className="w-5 h-5" />
            <h2 className="text-2xl font-serif">Buku Tamu</h2>
          </div>
          <p className="text-stone-500 text-sm">{rsvps.length} Ucapan dari Tamu Undangan</p>
        </div>

        <div className="space-y-6">
          {rsvps.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              key={idx} 
              className="bg-white p-6 rounded-2xl border border-black/5 space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-wedding-ink">{item.name}</h4>
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full uppercase font-bold",
                  item.attendance === 'hadir' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                  {item.attendance}
                </span>
              </div>
              <p className="text-stone-600 text-sm italic">"{item.message}"</p>
              <p className="text-[10px] text-stone-400">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-stone-400 text-sm border-t border-black/5 bg-white">
        <p>Made with ❤️ by NikahYuk</p>
      </footer>
    </div>
  );
};
