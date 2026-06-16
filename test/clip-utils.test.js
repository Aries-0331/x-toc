import assert from 'node:assert/strict';
import test from 'node:test';

import {
  addClipTag,
  filterExcerptGroups,
  normalizeClipNote,
  normalizeClipTags,
  removeClipTag,
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

test('addClipTag appends one normalized tag and deduplicates values', () => {
  const updated = addClipTag(
    { ...baseClip, tags: ['product'] },
    ' Product ',
    { now: '2026-06-16T02:30:00.000Z' }
  );

  assert.deepEqual(updated.tags, ['product']);
  assert.equal(updated.updatedAt, '2026-06-16T02:30:00.000Z');
});

test('addClipTag ignores blank tags', () => {
  const clip = { ...baseClip, tags: ['product'] };
  const updated = addClipTag(clip, '   ', {
    now: '2026-06-16T02:35:00.000Z'
  });

  assert.equal(updated, clip);
});

test('removeClipTag removes one tag without dropping other clip fields', () => {
  const updated = removeClipTag(
    { ...baseClip, tags: ['product', 'Quote'] },
    ' quote ',
    { now: '2026-06-16T02:45:00.000Z' }
  );

  assert.deepEqual(updated.tags, ['product']);
  assert.equal(updated.text, baseClip.text);
  assert.equal(updated.updatedAt, '2026-06-16T02:45:00.000Z');
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

const searchGroups = [
  {
    article: {
      id: 'article_1',
      title: 'Product lessons from small tools',
      authorName: 'Alice',
      authorHandle: '@alice'
    },
    excerpts: [
      {
        ...baseClip,
        id: 'excerpt_1',
        text: 'Small tools stay close to the workflow.',
        tags: ['product'],
        note: 'Positioning quote'
      },
      {
        ...baseClip,
        id: 'excerpt_2',
        text: 'Implementation details matter.',
        tags: ['engineering']
      }
    ]
  },
  {
    article: {
      id: 'article_2',
      title: 'Research notes',
      authorName: 'Bob',
      authorHandle: '@bob'
    },
    excerpts: [
      {
        ...baseClip,
        id: 'excerpt_3',
        articleId: 'article_2',
        text: 'Context helps readers connect ideas.',
        tags: ['research']
      }
    ]
  }
];

test('filterExcerptGroups returns all groups for an empty query', () => {
  assert.equal(filterExcerptGroups(searchGroups, '').length, 2);
  assert.equal(filterExcerptGroups(searchGroups, '   ').length, 2);
});

test('filterExcerptGroups searches clip text', () => {
  const result = filterExcerptGroups(searchGroups, 'workflow');
  assert.equal(result.length, 1);
  assert.deepEqual(result[0].excerpts.map((excerpt) => excerpt.id), ['excerpt_1']);
});

test('filterExcerptGroups searches article title', () => {
  const result = filterExcerptGroups(searchGroups, 'research notes');
  assert.equal(result.length, 1);
  assert.deepEqual(result[0].excerpts.map((excerpt) => excerpt.id), ['excerpt_3']);
});

test('filterExcerptGroups searches author, tags, and notes', () => {
  assert.deepEqual(
    filterExcerptGroups(searchGroups, '@alice')[0].excerpts.map((excerpt) => excerpt.id),
    ['excerpt_1', 'excerpt_2']
  );
  assert.deepEqual(
    filterExcerptGroups(searchGroups, 'engineering')[0].excerpts.map((excerpt) => excerpt.id),
    ['excerpt_2']
  );
  assert.deepEqual(
    filterExcerptGroups(searchGroups, 'positioning quote')[0].excerpts.map((excerpt) => excerpt.id),
    ['excerpt_1']
  );
});

test('filterExcerptGroups removes groups without matching excerpts', () => {
  assert.deepEqual(filterExcerptGroups(searchGroups, 'missing'), []);
});
