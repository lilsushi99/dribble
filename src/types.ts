export interface Project {
  id: string;
  title: string;
  client: string;
  year: string;
  category: string;
  description: string;
  imageUrl: string;
  aspectRatio: string; // e.g. "aspect-[4/3]", "aspect-[3/4]", "aspect-[16/9]"
  gridSpan: string; // Tailwind grid span e.g. "col-span-12 md:col-span-7"
  route: string;
}

export interface MangaPanel {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  widthRatio: number;
  heightRatio: number;
}

declare global {
  interface Window {
    Tawk_API?: {
      toggle?: () => void;
      maximize?: () => void;
      minimize?: () => void;
      showWidget?: () => void;
    };
  }
}
