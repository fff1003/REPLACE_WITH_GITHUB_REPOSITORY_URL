export type ScrapedPost = {
  title: string;
  href: string;
  slug: string;
  dateDisplay?: string;
  dateISO?: string;
  excerpt?: string;
  sourcePage: string;
  topics: string[];
};

export type ScrapedTopic = {
  name: string;
  url: string;
  count?: number;
};
