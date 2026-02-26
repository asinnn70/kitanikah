export interface WeddingDetails {
  brideName: string;
  brideParents: string;
  groomName: string;
  groomParents: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  message: string;
  templateId: string;
  gallery: string[];
  videoUrl?: string;
  coverPhoto?: string;
}

export const INITIAL_DETAILS: WeddingDetails = {
  brideName: "Sarah Adelia",
  brideParents: "Putri dari Bpk. Ahmad & Ibu Siti",
  groomName: "Budi Santoso",
  groomParents: "Putra dari Bpk. Slamet & Ibu Wahyu",
  date: "2026-08-15",
  time: "10:00",
  location: "Jakarta, Indonesia",
  venue: "The Glass House",
  message: "Kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri hari bahagia kami.",
  templateId: "classic-serif",
  gallery: [
    "https://picsum.photos/seed/wedding1/800/600",
    "https://picsum.photos/seed/wedding2/800/600",
    "https://picsum.photos/seed/wedding3/800/600"
  ],
  videoUrl: "",
  coverPhoto: "https://picsum.photos/seed/couple/800/1200",
};

export interface Template {
  id: string;
  name: string;
  previewColor: string;
}

export const TEMPLATES: Template[] = [
  { id: "classic-serif", name: "Classic Serif", previewColor: "bg-stone-100" },
  { id: "modern-minimal", name: "Modern Minimal", previewColor: "bg-white" },
  { id: "floral-romance", name: "Floral Romance", previewColor: "bg-rose-50" },
  { id: "royal-gold", name: "Royal Gold", previewColor: "bg-amber-50" },
];
