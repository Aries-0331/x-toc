export function normalizeClipTags(tags) {
  if (!Array.isArray(tags)) return [];

  const seen = new Set();
  const normalized = [];

  tags.forEach((tag) => {
    const value = String(tag || '').trim();
    if (!value) return;

    const key = value.toLocaleLowerCase();
    if (seen.has(key)) return;

    seen.add(key);
    normalized.push(value);
  });

  return normalized;
}

export function normalizeClipNote(note) {
  return String(note || '').trim();
}

export function updateClipTags(clip, tags, options = {}) {
  const now = options.now || new Date().toISOString();

  return {
    ...clip,
    tags: normalizeClipTags(tags),
    updatedAt: now
  };
}

export function addClipTag(clip, tag, options = {}) {
  const normalizedTag = normalizeClipTags([tag])[0];
  if (!normalizedTag) return clip;

  return updateClipTags(clip, [...normalizeClipTags(clip?.tags), normalizedTag], options);
}

export function removeClipTag(clip, tag, options = {}) {
  const target = String(tag || '').trim().toLocaleLowerCase();
  const nextTags = normalizeClipTags(clip?.tags).filter((value) => (
    value.toLocaleLowerCase() !== target
  ));

  return updateClipTags(clip, nextTags, options);
}

export function updateClipNote(clip, note, options = {}) {
  const now = options.now || new Date().toISOString();
  const normalizedNote = normalizeClipNote(note);
  const nextClip = {
    ...clip,
    updatedAt: now
  };

  if (normalizedNote) {
    nextClip.note = normalizedNote;
  } else {
    delete nextClip.note;
  }

  return nextClip;
}

function normalizeSearchValue(value) {
  return String(value || '').trim().toLocaleLowerCase();
}

function articleAuthorText(article) {
  return [
    article?.authorName,
    article?.authorHandle
  ].filter(Boolean).join(' ');
}

function excerptSearchText(article, excerpt) {
  return [
    excerpt?.text,
    excerpt?.note,
    ...(Array.isArray(excerpt?.tags) ? excerpt.tags : []),
    article?.title,
    articleAuthorText(article)
  ].filter(Boolean).join(' ');
}

export function filterExcerptGroups(groups, query) {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return groups;

  return groups
    .map(({ article, excerpts }) => ({
      article,
      excerpts: excerpts.filter((excerpt) => (
        normalizeSearchValue(excerptSearchText(article, excerpt)).includes(normalizedQuery)
      ))
    }))
    .filter((group) => group.excerpts.length > 0);
}

export function getClipLibraryEmptyState({ hasSavedClips, hasSearchQuery }) {
  if (!hasSavedClips) {
    return {
      title: 'No clips saved yet',
      message: 'Select text in an X/Twitter article and click "save to xtoc".'
    };
  }

  if (hasSearchQuery) {
    return {
      title: 'No matching clips',
      message: 'Try a different search term.'
    };
  }

  return null;
}
