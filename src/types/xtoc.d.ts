export type XtocExportFormat = 'markdown' | 'json';
export type XtocPlatform = 'x' | 'twitter' | (string & {});

export interface XtocArticle {
  id: string;
  url: string;
  canonicalUrl: string;
  title: string;
  authorName: string | null;
  authorHandle: string | null;
  publishedAt: string | null;
  platform: string;
  createdAt: string;
  updatedAt: string;
}

export interface XtocClip {
  id: string;
  articleId: string;
  text: string;
  contextBefore: string;
  contextAfter: string;
  pageUrl: string;
  selectionLength: number;
  createdAt: string;
  updatedAt?: string;
  source: string;
  tags?: string[];
  note?: string;
  liteContextItemId?: string;
}

export interface XtocLiteContextSettings {
  enabled: boolean;
  sourceNamespace: string;
  defaultTags: string[];
  includeContext: boolean;
  exportMode: 'json' | 'context-items';
}

export interface XtocSettings {
  contextLength: number;
  defaultExportFormat: XtocExportFormat;
  liteContext?: XtocLiteContextSettings;
}

export interface XtocStorageShape {
  twitterTocArticles: Record<string, XtocArticle>;
  twitterTocExcerpts: Record<string, XtocClip>;
  twitterTocExcerptSettings: XtocSettings;
}

export interface XtocJsonExportClip {
  id: string;
  text: string;
  contextBefore: string;
  contextAfter: string;
  pageUrl: string;
  selectionLength: number;
  createdAt: string;
  updatedAt?: string;
  source: string;
  tags?: string[];
  note?: string;
}

export interface XtocJsonExportArticle {
  id: string;
  url: string;
  canonicalUrl: string;
  title: string;
  authorName: string | null;
  authorHandle: string | null;
  publishedAt: string | null;
  platform: string;
  createdAt: string | null;
  updatedAt: string | null;
  excerpts: XtocJsonExportClip[];
}

export interface LiteContextContextItem {
  id: string;
  type: 'quote' | 'note' | 'web';
  title: string;
  content: string;
  source: {
    name: string;
    url: string;
    platform: XtocPlatform;
    author?: string | null;
    publishedAt?: string | null;
  };
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}

export interface XtocJsonExportV1 {
  version: 1;
  source: 'twitter-toc-extension';
  exportedAt: string;
  settings?: Partial<XtocSettings>;
  articles: XtocJsonExportArticle[];
  liteContext?: {
    items: LiteContextContextItem[];
  };
}
