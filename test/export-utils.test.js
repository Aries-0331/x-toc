import assert from 'node:assert/strict';
import test from 'node:test';

import {
  renderAllJson,
  renderAllMarkdown
} from '../src/options/export-utils.js';

const groups = [
  {
    article: {
      id: 'article_1',
      url: 'https://x.com/alice/status/1',
      canonicalUrl: 'https://x.com/alice/status/1',
      title: 'Product notes',
      authorName: 'Alice',
      authorHandle: '@alice',
      publishedAt: '2026-06-16T01:00:00.000Z',
      platform: 'x.com',
      createdAt: '2026-06-16T02:00:00.000Z',
      updatedAt: '2026-06-16T03:00:00.000Z'
    },
    excerpts: [
      {
        id: 'excerpt_1',
        text: 'Useful saved text',
        contextBefore: 'Before',
        contextAfter: 'After',
        pageUrl: 'https://x.com/alice/status/1',
        selectionLength: 17,
        createdAt: '2026-06-16T02:30:00.000Z',
        updatedAt: '2026-06-16T03:30:00.000Z',
        source: 'x.com',
        tags: ['product', 'quote'],
        note: 'Use this later.'
      }
    ]
  }
];

test('renderAllMarkdown includes clip tags and notes', () => {
  const markdown = renderAllMarkdown(groups, '2026-06-16T04:00:00.000Z');

  assert.match(markdown, /Tags: `product`, `quote`/);
  assert.match(markdown, /Note:\n\n> Use this later\./);
  assert.match(markdown, /Updated at: 2026-06-16T03:30:00.000Z/);
});

test('renderAllMarkdown keeps user tag text readable', () => {
  const markdown = renderAllMarkdown([
    {
      article: groups[0].article,
      excerpts: [{
        ...groups[0].excerpts[0],
        tags: ['AI Coding', 'product*note', '中文 标签']
      }]
    }
  ], '2026-06-16T04:00:00.000Z');

  assert.match(markdown, /Tags: `AI Coding`, `product\*note`, `中文 标签`/);
});

test('renderAllJson includes clip metadata fields', () => {
  const json = JSON.parse(renderAllJson(groups, '2026-06-16T04:00:00.000Z'));
  const excerpt = json.articles[0].excerpts[0];

  assert.deepEqual(excerpt.tags, ['product', 'quote']);
  assert.equal(excerpt.note, 'Use this later.');
  assert.equal(excerpt.updatedAt, '2026-06-16T03:30:00.000Z');
});

test('renderAllJson exports old clips without optional metadata', () => {
  const json = JSON.parse(renderAllJson([
    {
      article: groups[0].article,
      excerpts: [{
        id: 'excerpt_2',
        text: 'Old saved text',
        contextBefore: '',
        contextAfter: '',
        pageUrl: 'https://x.com/alice/status/1',
        selectionLength: 14,
        createdAt: '2026-06-16T02:30:00.000Z',
        source: 'x.com'
      }]
    }
  ], '2026-06-16T04:00:00.000Z'));

  const excerpt = json.articles[0].excerpts[0];
  assert.deepEqual(excerpt.tags, []);
  assert.equal(excerpt.note, '');
  assert.equal(excerpt.updatedAt, null);
});
