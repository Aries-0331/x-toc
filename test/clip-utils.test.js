import assert from 'node:assert/strict';
import test from 'node:test';

import {
  normalizeClipNote,
  normalizeClipTags,
  updateClipNote,
  updateClipTags
} from '../src/options/clip-utils.js';

const baseClip = {
  id: 'excerpt_1',
  articleId: 'article_1',
  text: 'A saved clip',
  contextBefore: 'Before',
  contextAfter: 'After',
  pageUrl: 'https://x.com/example/status/1',
  selectionLength: 12,
  createdAt: '2026-06-16T01:00:00.000Z',
  source: 'x.com'
};

test('normalizeClipTags trims, removes blanks, and deduplicates tags', () => {
  assert.deepEqual(
    normalizeClipTags([' product ', '', 'Research', 'product', null, 'AI']),
    ['product', 'Research', 'AI']
  );
});

test('normalizeClipTags treats missing and non-array tags as empty', () => {
  assert.deepEqual(normalizeClipTags(), []);
  assert.deepEqual(normalizeClipTags('product'), []);
});

test('normalizeClipNote trims notes and handles missing values', () => {
  assert.equal(normalizeClipNote('  useful quote  '), 'useful quote');
  assert.equal(normalizeClipNote(), '');
});

test('updateClipTags adds normalized tags and preserves existing clip fields', () => {
  const updated = updateClipTags(baseClip, [' product ', 'product', 'Quote'], {
    now: '2026-06-16T02:00:00.000Z'
  });

  assert.deepEqual(updated.tags, ['product', 'Quote']);
  assert.equal(updated.updatedAt, '2026-06-16T02:00:00.000Z');
  assert.equal(updated.id, baseClip.id);
  assert.equal(updated.text, baseClip.text);
  assert.equal(updated.createdAt, baseClip.createdAt);
});

test('updateClipNote sets a note and preserves tags', () => {
  const updated = updateClipNote(
    { ...baseClip, tags: ['product'] },
    '  Keep this for positioning.  ',
    { now: '2026-06-16T03:00:00.000Z' }
  );

  assert.equal(updated.note, 'Keep this for positioning.');
  assert.deepEqual(updated.tags, ['product']);
  assert.equal(updated.updatedAt, '2026-06-16T03:00:00.000Z');
});

test('updateClipNote removes an empty note without dropping other fields', () => {
  const updated = updateClipNote(
    { ...baseClip, note: 'old note', tags: ['product'] },
    '   ',
    { now: '2026-06-16T04:00:00.000Z' }
  );

  assert.equal(Object.hasOwn(updated, 'note'), false);
  assert.deepEqual(updated.tags, ['product']);
  assert.equal(updated.updatedAt, '2026-06-16T04:00:00.000Z');
});
