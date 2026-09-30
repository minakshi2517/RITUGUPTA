import type { SiteSettings, Store } from "./types";

export const STARTER_BOOK_ID = "11111111-1111-4111-8111-111111111111";

export function defaultSettings(now = new Date().toISOString()): SiteSettings {
  return {
    authorName: "Ritu Gupta Garg",
    descriptor: "Author · Poet · Songwriter · Translator",
    heroStatement: "Through darkness,\nTo one's own light.",
    heroIntro:
      "I weave words across languages and cultures, exploring identity, heritage, and the quiet moments that shape a life.",
    profileImage: "",
    announcement: "",
    announcementActive: false,
    ctaPrimaryLabel: "Read my work",
    ctaPrimaryHref: "/poetry",
    ctaSecondaryLabel: "About me",
    ctaSecondaryHref: "/about",
    currentlyWriting: "The next manuscript",
    currentlyReading: "Left on the desk",
    currentlyListening: "Not playing",
    currentlyPublishing: "Not sending, yet",
    poetryHeading: "A few words,\nleft unfinished.",
    writingHeading: "Letters, thoughts,\nand things worth saying.",
    listenHeading: "Listen with me",
    listenSubheading: "Some words are better heard.",
    elsewhereHeading: "Find me elsewhere.",
    aboutTeaser:
      "The longer page is quieter. It is where the work, the influences, and the days in between can sit together.",
    aboutHeading: "Before the books,\nthere were the words.",
    aboutLede:
      "This is the longer introduction. It is waiting for the true one — who I am, what I write toward, and what I am making now.",
    aboutImage: "",
    aboutSections: [
      { id: "sec-who", title: "Who I am", body: "" },
      { id: "sec-writing", title: "The writing", body: "" },
      { id: "sec-books", title: "Books", body: "" },
      { id: "sec-influences", title: "Influences", body: "" },
      { id: "sec-now", title: "Current work", body: "" },
      { id: "sec-philosophy", title: "A philosophy", body: "" },
    ],
    aboutQuotes: [],
    contactHeading: "Have something to say?",
    contactIntro: "A note is enough. Write as you would to a person.",
    booksIntro: "The shelf, as it stands.",
    poetryIntro: "For the things\nThat needed words.",
    writingIntro: "An independent record of longer pieces.",
    listenIntro: "Songs, readings, and whatever is worth hearing twice.",
    linksIntro: "The other rooms.",
    closingStatement: "Stay a little longer.",
    footerLine: "Stories, poems, and everything in between.",
    email: "Ritygarg72@gmail.com",
    substackUrl: "https://rituguptagarg.substack.com",
    spotifyProfileUrl: "https://open.spotify.com/track/0QnoGoSrG1OgGJL3R3Bra9",
    metaDescription: "Poems, books, songs, and longer writing by Ritu Gupta Garg.",
    featuredBookId: "33333333-3333-4333-8333-333333333333",
    featuredPoemId: null,
    featuredWritingId: null,
    featuredAudioId: null,
    updatedAt: now,
  };
}

export function createDefaultStore(): Store {
  const now = new Date().toISOString();
  return {
    settings: defaultSettings(now),
    books: [],
    poems: [],
    writings: [],
    audio: [],
    links: [],
    media: [],
    messages: [],
  };
}
