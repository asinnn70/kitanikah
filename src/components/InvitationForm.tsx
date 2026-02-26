import React from 'react';
import { WeddingDetails, TEMPLATES } from '../types';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { Sparkles, Calendar, MapPin, Clock, User, Image as ImageIcon, Video, Plus, Trash2 } from 'lucide-react';
import { generateWeddingMessage } from '../services/geminiService';

interface Props {
  details: WeddingDetails;
  setDetails: (details: WeddingDetails) => void;
}

export const InvitationForm: React.FC<Props> = ({ details, setDetails }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleAddImage = () => {
    setDetails({ ...details, gallery: [...details.gallery, ""] });
  };

  const handleRemoveImage = (index: number) => {
    const newGallery = details.gallery.filter((_, i) => i !== index);
    setDetails({ ...details, gallery: newGallery });
  };

  const handleImageChange = (index: number, value: string) => {
    const newGallery = [...details.gallery];
    newGallery[index] = value;
    setDetails({ ...details, gallery: newGallery });
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const message = await generateWeddingMessage(details);
      if (message) {
        setDetails({ ...details, message });
      } else {
        alert("Gagal membuat pesan otomatis. Silakan coba lagi.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 p-6 bg-white rounded-2xl border border-black/5 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold">Detail Undangan</h2>
        <p className="text-sm text-stone-500">Lengkapi informasi pernikahan Anda di bawah ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="brideName" className="flex items-center gap-2">
            <User className="w-4 h-4 text-wedding-rose" /> Nama Mempelai Wanita
          </Label>
          <Input
            id="brideName"
            name="brideName"
            value={details.brideName}
            onChange={handleChange}
            placeholder="Contoh: Sarah Adelia"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brideParents" className="text-xs text-stone-400">Nama Orang Tua Wanita</Label>
          <Input
            id="brideParents"
            name="brideParents"
            value={details.brideParents}
            onChange={handleChange}
            placeholder="Contoh: Putri dari Bpk. X & Ibu Y"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="groomName" className="flex items-center gap-2">
            <User className="w-4 h-4 text-wedding-sage" /> Nama Mempelai Pria
          </Label>
          <Input
            id="groomName"
            name="groomName"
            value={details.groomName}
            onChange={handleChange}
            placeholder="Contoh: Budi Santoso"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="groomParents" className="text-xs text-stone-400">Nama Orang Tua Pria</Label>
          <Input
            id="groomParents"
            name="groomParents"
            value={details.groomParents}
            onChange={handleChange}
            placeholder="Contoh: Putra dari Bpk. A & Ibu B"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-400" /> Tanggal
          </Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={details.date}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time" className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-400" /> Waktu
          </Label>
          <Input
            id="time"
            name="time"
            type="time"
            value={details.time}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="venue" className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-stone-400" /> Nama Gedung / Tempat
        </Label>
        <Input
          id="venue"
          name="venue"
          value={details.venue}
          onChange={handleChange}
          placeholder="Contoh: The Glass House"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-stone-400" /> Lokasi (Kota)
        </Label>
        <Input
          id="location"
          name="location"
          value={details.location}
          onChange={handleChange}
          placeholder="Contoh: Jakarta Selatan"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="message">Pesan Undangan</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="text-wedding-gold hover:text-wedding-gold/80 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? "Menulis..." : "Tulis dengan AI"}
          </Button>
        </div>
        <Textarea
          id="message"
          name="message"
          rows={4}
          value={details.message}
          onChange={handleChange}
          placeholder="Tuliskan pesan atau kutipan romantis..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverPhoto" className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-stone-400" /> Foto Sampul (URL)
        </Label>
        <Input
          id="coverPhoto"
          name="coverPhoto"
          value={details.coverPhoto}
          onChange={handleChange}
          placeholder="https://example.com/cover.jpg"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-stone-400" /> Galeri Foto (URL)
          </Label>
          <Button variant="ghost" size="sm" onClick={handleAddImage} className="text-wedding-gold">
            <Plus className="w-4 h-4 mr-1" /> Tambah Foto
          </Button>
        </div>
        <div className="space-y-3">
          {details.gallery.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <Button variant="ghost" size="sm" onClick={() => handleRemoveImage(index)} className="text-rose-500">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoUrl" className="flex items-center gap-2">
          <Video className="w-4 h-4 text-stone-400" /> Video Undangan (YouTube URL)
        </Label>
        <Input
          id="videoUrl"
          name="videoUrl"
          value={details.videoUrl}
          onChange={handleChange}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      <div className="space-y-4">
        <Label>Pilih Tema</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setDetails({ ...details, templateId: t.id })}
              className={`p-3 rounded-xl border-2 transition-all text-left ${
                details.templateId === t.id
                  ? "border-wedding-gold bg-wedding-gold/5"
                  : "border-transparent bg-stone-50 hover:bg-stone-100"
              }`}
            >
              <div className={`w-full h-12 rounded-md mb-2 ${t.previewColor} border border-black/5`} />
              <span className="text-xs font-medium block truncate">{t.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
