import React from 'react';
import { InvitationForm } from './components/InvitationForm';
import { InvitationPreview } from './components/InvitationPreview';
import { LiveInvitation } from './components/LiveInvitation';
import { WeddingDetails, INITIAL_DETAILS } from './types';
import { Heart, Share2, Globe, Sparkles, Copy, Check, Users } from 'lucide-react';
import { Button } from './components/ui/Button';
import { motion } from 'motion/react';

export default function App() {
  const [details, setDetails] = React.useState<WeddingDetails>(INITIAL_DETAILS);
  const [isLive, setIsLive] = React.useState(false);
  const [invitationId, setInvitationId] = React.useState<string | null>(null);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [guestName, setGuestName] = React.useState('');
  const [guestTitle, setGuestTitle] = React.useState('');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      fetch(`/api/invitations/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then(data => {
          setDetails(data);
          setInvitationId(id);
          setIsLive(true);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          window.history.replaceState({}, '', '/');
        });
    }
  }, []);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to publish');
      }
      const data = await res.json();
      console.log("Published successfully, ID:", data.id);
      setInvitationId(data.id);
    } catch (error) {
      console.error(error);
      alert('Gagal mempublikasikan undangan. Pastikan koneksi internet stabil.');
    } finally {
      setIsPublishing(false);
    }
  };

  const copyLink = () => {
    let url = `${window.location.origin}/?id=${invitationId}`;
    if (guestName) url += `&to=${encodeURIComponent(guestName)}`;
    if (guestTitle) url += `&title=${encodeURIComponent(guestTitle)}`;
    
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLive) {
    return <LiveInvitation details={details} invitationId={invitationId!} />;
  }

  return (
    <div className="min-h-screen bg-wedding-cream">
      {/* Header */}
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-wedding-gold rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">NikahYuk</span>
          </div>
          
          <div className="flex items-center gap-3">
            {invitationId ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={copyLink} className="flex items-center gap-2">
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Tersalin!" : "Salin Link"}
                </Button>
                <Button size="sm" onClick={() => window.open(`/?id=${invitationId}`, '_blank')} className="flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Lihat Live
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={handlePublish} disabled={isPublishing} className="flex items-center gap-2">
                <Globe className="w-4 h-4" /> 
                {isPublishing ? "Mempublikasikan..." : "Publikasikan Undangan"}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7"
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wedding-gold/10 text-wedding-gold text-xs font-semibold mb-4">
                <Sparkles className="w-3 h-3" />
                <span>AI Powered Builder</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-bold text-wedding-ink mb-4">
                Buat Undangan <br />
                <span className="text-wedding-gold italic">Digital Live</span>
              </h1>
              <p className="text-stone-500 max-w-lg leading-relaxed">
                Rancang undangan pernikahan digital interaktif dengan RSVP dan Buku Tamu. 
                Publikasikan dan bagikan link undangan Anda ke teman dan keluarga.
              </p>
            </div>

            <InvitationForm details={details} setDetails={setDetails} />
          </motion.div>

          {/* Right Column: Preview & Guest Link */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-8"
          >
            {invitationId && (
              <div className="bg-white p-6 rounded-2xl border border-wedding-gold/20 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-wedding-gold">
                  <Users className="w-5 h-5" />
                  <h3 className="font-display font-bold">Personalisasi Link Tamu</h3>
                </div>
                <p className="text-xs text-stone-500">Buat link khusus untuk tamu tertentu agar nama mereka muncul di undangan.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-stone-400">Nama Tamu</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Budi"
                      className="w-full text-sm border-b border-stone-200 py-1 focus:outline-none focus:border-wedding-gold"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-stone-400">Jabatan/Gelar</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Manager"
                      className="w-full text-sm border-b border-stone-200 py-1 focus:outline-none focus:border-wedding-gold"
                      value={guestTitle}
                      onChange={e => setGuestTitle(e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="outline" className="w-full text-xs h-8" onClick={copyLink}>
                  {copied ? <Check className="w-3 h-3 mr-2 text-emerald-500" /> : <Copy className="w-3 h-3 mr-2" />}
                  Salin Link Personalisasi
                </Button>
              </div>
            )}
            <InvitationPreview details={details} />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 py-12 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-stone-400 text-sm">
            &copy; 2026 NikahYuk - Digital Wedding Invitation. Dibuat dengan cinta untuk hari bahagia Anda.
          </p>
        </div>
      </footer>
    </div>
  );
}
