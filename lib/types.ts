export type PurchaseLink = { label: string; url: string };

export type AboutSection = { id: string; title: string; body: string };

export type PullQuote = { id: string; text: string; attribution: string };

export type SiteSettings = {
  authorName: string;
  descriptor: string;
  heroStatement: string;
  heroIntro: string;
  profileImage: string;
  announcement: string;
  announcementActive: boolean;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  currentlyWriting: string;
  currentlyReading: string;
  currentlyListening: string;
  currentlyPublishing: string;
  poetryHeading: string;
  writingHeading: string;
  listenHeading: string;
  listenSubheading: string;
  elsewhereHeading: string;
  aboutTeaser: string;
  aboutHeading: string;
  aboutLede: string;
  aboutImage: string;
  aboutSections: AboutSection[];
  aboutQuotes: PullQuote[];
  contactHeading: string;
  contactIntro: string;
  booksIntro: string;
  poetryIntro: string;
  writingIntro: string;
  listenIntro: string;
  linksIntro: string;
  closingStatement: string;
  footerLine: string;
  email: string;
  substackUrl: string;
  spotifyProfileUrl: string;
  metaDescription: string;
  featuredBookId: string | null;
  featuredPoemId: string | null;
  featuredWritingId: string | null;
  featuredAudioId: string | null;
  updatedAt: string;
};

export type Book = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  coverImage: string;
  description: string;
  authorNote: string;
  year: number | null;
  publisher: string;
  isbn: string;
  amazonUrl: string;
  purchaseLinks: PurchaseLink[];
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Poem = {
  id: string;
  title: string;
  slug: string;
  body: string;
  date: string;
  category: string;
  bookId: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Writing = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  category: string;
  externalUrl: string;
  bookId: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AudioItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  spotifyUrl: string;
  coverImage: string;
  type: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ExternalLink = {
  id: string;
  title: string;
  url: string;
  icon: string;
  description: string;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MediaItem = {
  id: string;
  url: string;
  path: string;
  alt: string;
  createdAt: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  body: string;
  createdAt: string;
};

export type Store = {
  settings: SiteSettings;
  books: Book[];
  poems: Poem[];
  writings: Writing[];
  audio: AudioItem[];
  links: ExternalLink[];
  media: MediaItem[];
  messages: Message[];
};

export type ActionState = { ok: boolean; message: string } | null;

export type ContentKind = "book" | "poem" | "writing" | "audio" | "link";
