import {
  addClipTag,
  filterExcerptGroups,
  removeClipTag,
  updateClipNote
} from './clip-utils.js';
import {
  renderAllJson,
  renderAllMarkdown
} from './export-utils.js';

// Options page script

const excerptStorageKeys = {
  articles: 'twitterTocArticles',
  excerpts: 'twitterTocExcerpts',
  settings: 'twitterTocExcerptSettings'
};

let excerptState = {
  articles: {},
  excerpts: {}
};

let selectedExcerptIds = new Set();
let excerptSearchQuery = '';

async function loadExcerptData() {
  const data = await chrome.storage.local.get([
    excerptStorageKeys.articles,
    excerptStorageKeys.excerpts
  ]);

  excerptState = {
    articles: data[excerptStorageKeys.articles] || {},
    excerpts: data[excerptStorageKeys.excerpts] || {}
  };

  renderExcerptManager();
}

function groupExcerptsByArticle() {
  const groups = new Map();

  Object.values(excerptState.excerpts)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .forEach((excerpt) => {
      const article = excerptState.articles[excerpt.articleId] || {
        id: excerpt.articleId,
        title: 'Unknown Article',
        url: excerpt.pageUrl || '',
        canonicalUrl: excerpt.pageUrl || '',
        authorName: null,
        authorHandle: null,
        publishedAt: null,
        platform: excerpt.source || 'x.com'
      };

      if (!groups.has(article.id)) {
        groups.set(article.id, {
          article,
          excerpts: []
        });
      }

      groups.get(article.id).excerpts.push(excerpt);
    });

  return Array.from(groups.values())
    .sort((a, b) => {
      const latestA = a.excerpts[a.excerpts.length - 1]?.createdAt || '';
      const latestB = b.excerpts[b.excerpts.length - 1]?.createdAt || '';
      return new Date(latestB) - new Date(latestA);
    });
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDisplayDate(value) {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function formatAuthor(article) {
  if (article.authorName && article.authorHandle) {
    return `${article.authorName} (${article.authorHandle})`;
  }
  return article.authorName || article.authorHandle || 'Unknown';
}

function getSelectedExcerptCount() {
  selectedExcerptIds = new Set(
    Array.from(selectedExcerptIds).filter((excerptId) => excerptState.excerpts[excerptId])
  );
  return selectedExcerptIds.size;
}

function renderExcerptManager() {
  const manager = document.getElementById('excerptManager');
  const exportMenuBtn = document.getElementById('exportMenuBtn');
  const exportMarkdownMenuItem = document.getElementById('exportMarkdownMenuItem');
  const exportJsonMenuItem = document.getElementById('exportJsonMenuItem');
  const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
  const clearSelectionBtn = document.getElementById('clearSelectionBtn');
  const selectionSummary = document.getElementById('selectionSummary');
  const articleCount = document.getElementById('articleCount');
  const excerptCount = document.getElementById('excerptCount');
  const allGroups = groupExcerptsByArticle();
  const groups = filterExcerptGroups(allGroups, excerptSearchQuery);
  const hasExcerpts = groups.length > 0;
  const hasSavedExcerpts = allGroups.length > 0;
  const hasSearchQuery = excerptSearchQuery.trim().length > 0;
  const totalExcerpts = groups.reduce((count, group) => count + group.excerpts.length, 0);
  const selectedCount = getSelectedExcerptCount();
  const hasSelection = selectedCount > 0;

  exportMenuBtn.disabled = !hasSavedExcerpts;
  exportMenuBtn.textContent = hasSelection ? 'Export selected' : 'Export';
  exportMarkdownMenuItem.textContent = hasSelection ? 'Markdown' : 'All excerpts as Markdown';
  exportJsonMenuItem.textContent = hasSelection ? 'JSON' : 'All excerpts as JSON';
  selectionSummary.textContent = `${selectedCount} selected`;
  clearSelectionBtn.classList.toggle('hidden', !hasSelection);
  deleteSelectedBtn.classList.toggle('hidden', !hasSelection);
  articleCount.textContent = groups.length;
  excerptCount.textContent = totalExcerpts;

  if (!hasSavedExcerpts) {
    manager.innerHTML = `
      <div class="empty-state">
        <strong>No excerpts saved yet</strong>
        <span>Select text in an X/Twitter article and click "save to xtoc".</span>
      </div>
    `;
    return;
  }

  if (hasSearchQuery && !hasExcerpts) {
    manager.innerHTML = `
      <div class="empty-state">
        <strong>No matching excerpts</strong>
        <span>Try a different search term.</span>
      </div>
    `;
    return;
  }

  manager.innerHTML = groups.map(({ article, excerpts }) => `
    <article class="article-excerpt-group" data-article-id="${escapeHtml(article.id)}">
      <div class="article-group-header">
        <div class="article-title-block">
          <div class="article-title-row">
            <h3>
              <a class="article-title-link" href="${escapeHtml(article.url || article.canonicalUrl || '#')}" target="_blank" rel="noreferrer">
                <span>${escapeHtml(article.title || 'Unknown Article')}</span>
                <span class="external-link-mark" aria-hidden="true">↗</span>
              </a>
            </h3>
            <div class="article-meta-row">
              <span>${escapeHtml(formatAuthor(article))}</span>
              <span>${excerpts.length} excerpt${excerpts.length === 1 ? '' : 's'}</span>
            </div>
          </div>
        </div>
      </div>

      <ul class="excerpt-list">
        ${excerpts.map((excerpt) => `
          <li class="excerpt-item" data-excerpt-id="${escapeHtml(excerpt.id)}">
            <label class="excerpt-select" title="Select excerpt">
              <input type="checkbox" data-action="select-excerpt" data-excerpt-id="${escapeHtml(excerpt.id)}" ${selectedExcerptIds.has(excerpt.id) ? 'checked' : ''}>
            </label>
            <div class="excerpt-content">
              <blockquote>${escapeHtml(excerpt.text)}</blockquote>
              <div class="excerpt-tags" aria-label="Clip tags">
                <div class="tag-list">
                  ${(excerpt.tags || []).map((tag) => `
                    <button class="tag-chip" type="button" data-action="remove-tag" data-excerpt-id="${escapeHtml(excerpt.id)}" data-tag="${escapeHtml(tag)}" title="Remove tag">
                      <span>${escapeHtml(tag)}</span>
                      <span aria-hidden="true">×</span>
                    </button>
                  `).join('')}
                </div>
                <div class="tag-editor">
                  <input type="text" data-role="tag-input" aria-label="Add tag" placeholder="Add tag">
                  <button type="button" data-action="add-tag" data-excerpt-id="${escapeHtml(excerpt.id)}">Add</button>
                </div>
              </div>
              <div class="excerpt-note">
                <label>
                  <span>Note</span>
                  <textarea data-role="note-input" rows="2" placeholder="Add a note">${escapeHtml(excerpt.note || '')}</textarea>
                </label>
                <button type="button" data-action="save-note" data-excerpt-id="${escapeHtml(excerpt.id)}">Save note</button>
              </div>
              <div class="excerpt-footer">
                <span>Saved ${escapeHtml(formatDisplayDate(excerpt.createdAt))}</span>
              </div>
            </div>
          </li>
        `).join('')}
      </ul>
    </article>
  `).join('');
}

async function saveExcerptState() {
  await chrome.storage.local.set({
    [excerptStorageKeys.articles]: excerptState.articles,
    [excerptStorageKeys.excerpts]: excerptState.excerpts
  });
}

async function deleteSelectedExcerpts() {
  const articleIds = new Set();

  selectedExcerptIds.forEach((excerptId) => {
    const articleId = excerptState.excerpts[excerptId]?.articleId;
    if (articleId) articleIds.add(articleId);
    delete excerptState.excerpts[excerptId];
  });

  articleIds.forEach((articleId) => {
    if (!Object.values(excerptState.excerpts).some((excerpt) => excerpt.articleId === articleId)) {
      delete excerptState.articles[articleId];
    }
  });

  selectedExcerptIds = new Set();
  await saveExcerptState();
  renderExcerptManager();
}

async function updateExcerpt(excerptId, updater) {
  const excerpt = excerptState.excerpts[excerptId];
  if (!excerpt) return;

  const nextExcerpt = updater(excerpt);
  if (nextExcerpt === excerpt) return;

  excerptState.excerpts[excerptId] = nextExcerpt;
  await saveExcerptState();
  renderExcerptManager();
}

function currentDateSlug() {
  return new Date().toISOString().slice(0, 10);
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getExportGroups() {
  const groups = groupExcerptsByArticle();
  if (selectedExcerptIds.size === 0) return groups;

  return groups
    .map(({ article, excerpts }) => ({
      article,
      excerpts: excerpts.filter((excerpt) => selectedExcerptIds.has(excerpt.id))
    }))
    .filter((group) => group.excerpts.length > 0);
}

function exportMarkdown() {
  const groups = getExportGroups();
  if (groups.length === 0) return;

  const markdown = renderAllMarkdown(groups, new Date().toISOString());
  const filenamePrefix = selectedExcerptIds.size > 0 ? 'x-twitter-selected-excerpts' : 'x-twitter-excerpts';
  downloadFile(`${filenamePrefix}-${currentDateSlug()}.md`, markdown, 'text/markdown;charset=utf-8');
}

function exportJson() {
  const groups = getExportGroups();
  if (groups.length === 0) return;

  const json = renderAllJson(groups, new Date().toISOString());
  const filenamePrefix = selectedExcerptIds.size > 0 ? 'x-twitter-selected-excerpts' : 'x-twitter-excerpts';
  downloadFile(`${filenamePrefix}-${currentDateSlug()}.json`, json, 'application/json;charset=utf-8');
}

function bindExcerptManagerEvents() {
  const manager = document.getElementById('excerptManager');

  manager.addEventListener('change', (event) => {
    if (event.target.dataset.action !== 'select-excerpt') return;

    if (event.target.checked) {
      selectedExcerptIds.add(event.target.dataset.excerptId);
    } else {
      selectedExcerptIds.delete(event.target.dataset.excerptId);
    }
    renderExcerptManager();
  });

  manager.addEventListener('click', async (event) => {
    const actionTarget = event.target.closest('[data-action]');
    const action = actionTarget?.dataset.action;
    if (action === 'add-tag') {
      const item = actionTarget.closest('.excerpt-item');
      const input = item?.querySelector('[data-role="tag-input"]');
      const tag = input?.value || '';
      await updateExcerpt(actionTarget.dataset.excerptId, (excerpt) => addClipTag(excerpt, tag));
    } else if (action === 'remove-tag') {
      await updateExcerpt(actionTarget.dataset.excerptId, (excerpt) => removeClipTag(excerpt, actionTarget.dataset.tag));
    } else if (action === 'save-note') {
      const item = actionTarget.closest('.excerpt-item');
      const input = item?.querySelector('[data-role="note-input"]');
      await updateExcerpt(actionTarget.dataset.excerptId, (excerpt) => updateClipNote(excerpt, input?.value || ''));
    }
  });

  manager.addEventListener('keydown', async (event) => {
    if (event.key !== 'Enter' || event.target.dataset.role !== 'tag-input') return;

    event.preventDefault();
    const item = event.target.closest('.excerpt-item');
    const addButton = item?.querySelector('[data-action="add-tag"]');
    await updateExcerpt(addButton?.dataset.excerptId, (excerpt) => addClipTag(excerpt, event.target.value));
  });
}

function closeExportMenu() {
  document.getElementById('exportMenuBtn').setAttribute('aria-expanded', 'false');
  document.getElementById('exportDropdown').classList.remove('open');
}

function bindExportMenu() {
  const exportMenuBtn = document.getElementById('exportMenuBtn');
  const exportDropdown = document.getElementById('exportDropdown');

  exportMenuBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = exportDropdown.classList.toggle('open');
    exportMenuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  document.getElementById('exportMenu').addEventListener('click', (event) => {
    const action = event.target.dataset.action;
    if (action === 'export-markdown') {
      exportMarkdown();
    } else if (action === 'export-json') {
      exportJson();
    }
    closeExportMenu();
  });

  document.addEventListener('click', closeExportMenu);
}

function bindSelectionActions() {
  document.getElementById('deleteSelectedBtn').addEventListener('click', async () => {
    const selectedCount = getSelectedExcerptCount();
    if (selectedCount > 0 && confirm(`Delete ${selectedCount} selected excerpt${selectedCount === 1 ? '' : 's'}?`)) {
      await deleteSelectedExcerpts();
    }
  });

  document.getElementById('clearSelectionBtn').addEventListener('click', () => {
    selectedExcerptIds = new Set();
    renderExcerptManager();
  });

  document.addEventListener('click', (event) => {
    if (selectedExcerptIds.size === 0) return;
    if (event.target.closest('.excerpt-item') || event.target.closest('.excerpt-actions')) return;

    selectedExcerptIds = new Set();
    renderExcerptManager();
  });
}

function bindExcerptSearch() {
  const searchInput = document.getElementById('excerptSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (event) => {
    excerptSearchQuery = event.target.value;
    renderExcerptManager();
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  bindExcerptSearch();
  bindExcerptManagerEvents();
  bindExportMenu();
  bindSelectionActions();
  loadExcerptData();
});
