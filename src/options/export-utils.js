function yamlString(value) {
  return String(value || '')
    .replace(/\r?\n/g, ' ')
    .replace(/"/g, '\\"');
}

function blockquote(value) {
  const text = String(value || '');
  if (!text) return '> ';
  return text.split(/\r?\n/).map((line) => `> ${line}`).join('\n');
}

function markdownValue(value) {
  return value || 'Unknown';
}

function formatAuthor(article) {
  if (article.authorName && article.authorHandle) {
    return `${article.authorName} (${article.authorHandle})`;
  }
  return article.authorName || article.authorHandle || 'Unknown';
}

function contextForMarkdown(excerpt) {
  const before = excerpt.contextBefore ? `...${excerpt.contextBefore}` : '...';
  const after = excerpt.contextAfter ? `${excerpt.contextAfter}...` : '...';
  return `${before} **[clip]** ${after}`;
}

function tagsForMarkdown(excerpt) {
  if (!Array.isArray(excerpt.tags) || excerpt.tags.length === 0) return 'None';
  return excerpt.tags.map((tag) => `#${tag}`).join(' ');
}

function noteForMarkdown(excerpt) {
  return excerpt.note ? `\nNote:\n\n${blockquote(excerpt.note)}\n` : '';
}

export function renderAllMarkdown(groups, exportedAt) {
  const excerptCount = groups.reduce((count, group) => count + group.excerpts.length, 0);

  return `---
title: "X / Twitter Clips Export"
source: "twitter-toc-extension"
exported_at: "${yamlString(exportedAt)}"
article_count: ${groups.length}
excerpt_count: ${excerptCount}
---

# X / Twitter Clips Export

Exported at: ${exportedAt}

${groups.map(({ article, excerpts }) => {
  const url = article.canonicalUrl || article.url || '';
  return `## ${article.title || 'Unknown Article'}

- Source: [X / Twitter](${url || '#'})
- Author: ${markdownValue(formatAuthor(article))}
- Published at: ${markdownValue(article.publishedAt)}
- Clip count: ${excerpts.length}

${excerpts.map((excerpt, index) => `### Clip ${index + 1}

${blockquote(excerpt.text)}

Tags: ${tagsForMarkdown(excerpt)}
${noteForMarkdown(excerpt)}
Context:

${blockquote(contextForMarkdown(excerpt))}

Saved at: ${markdownValue(excerpt.createdAt)}
Updated at: ${markdownValue(excerpt.updatedAt)}
`).join('\n---\n\n')}`;
}).join('\n\n')}`.trim();
}

export function renderAllJson(groups, exportedAt) {
  return JSON.stringify({
    version: 1,
    source: 'twitter-toc-extension',
    exportedAt,
    articles: groups.map(({ article, excerpts }) => ({
      id: article.id,
      url: article.url || '',
      canonicalUrl: article.canonicalUrl || '',
      title: article.title || '',
      authorName: article.authorName || null,
      authorHandle: article.authorHandle || null,
      publishedAt: article.publishedAt || null,
      platform: article.platform || '',
      createdAt: article.createdAt || null,
      updatedAt: article.updatedAt || null,
      excerpts: excerpts.map((excerpt) => ({
        id: excerpt.id,
        text: excerpt.text,
        contextBefore: excerpt.contextBefore || '',
        contextAfter: excerpt.contextAfter || '',
        pageUrl: excerpt.pageUrl || '',
        selectionLength: excerpt.selectionLength || excerpt.text.length,
        createdAt: excerpt.createdAt,
        updatedAt: excerpt.updatedAt || null,
        source: excerpt.source || '',
        tags: Array.isArray(excerpt.tags) ? excerpt.tags : [],
        note: excerpt.note || ''
      }))
    }))
  }, null, 2);
}
