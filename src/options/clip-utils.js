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
