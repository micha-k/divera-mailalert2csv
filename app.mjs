import PostalMime from 'https://unpkg.com/postal-mime@3.0.0/src/postal-mime.js';
import {
  extractDiveraAlert,
  extractHeaderValue,
  formatMailDateHeader,
  htmlToText,
  normalizeBodyText
} from './parser-core.mjs';

const APP_JS_VERSION = '0.1.1';
const LEAVE_CONFIRMATION_MESSAGE = 'Lokale Auswahl und Ergebnisse gehen beim Verlassen verloren.';

const dropzone = document.querySelector('#dropzone');
const fileInput = document.querySelector('#file-input');
const parseButton = document.querySelector('#parse-button');
const clearButton = document.querySelector('#clear-button');
const fileList = document.querySelector('#file-list');
const selectionSummary = document.querySelector('#selection-summary');
const resultsBody = document.querySelector('#results-body');
const resultCount = document.querySelector('#result-count');
const jsVersion = document.querySelector('#js-version');
const resultSearch = document.querySelector('#result-search');
const statusFilter = document.querySelector('#status-filter');
const sortButtons = Array.from(document.querySelectorAll('[data-sort-key]'));

const SORTABLE_COLUMNS = new Set([
  'source_file',
  'status',
  'datum',
  'einsatzstichwort',
  'ort',
  'priority',
  'einheit',
  'verfasser'
]);

let selectedFiles = [];
let results = [];
let isParsing = false;
let filterText = '';
let selectedStatus = 'all';
let sortState = {
  column: '',
  direction: 'asc'
};

dropzone.addEventListener('dragenter', handleDragEnter);
dropzone.addEventListener('dragover', handleDragOver);
dropzone.addEventListener('dragleave', handleDragLeave);
dropzone.addEventListener('drop', handleDrop);
dropzone.addEventListener('keydown', handleDropzoneKeydown);
fileInput.addEventListener('change', () => addFiles(fileInput.files));
parseButton.addEventListener('click', parseSelectedFiles);
clearButton.addEventListener('click', clearFiles);
if (resultSearch) {
  resultSearch.addEventListener('input', handleResultSearch);
}

if (statusFilter) {
  statusFilter.addEventListener('change', handleStatusFilter);
}

for (const button of sortButtons) {
  button.addEventListener('click', handleSortButtonClick);
}
globalThis.addEventListener('beforeunload', handleBeforeUnload);

renderAppMetadata();
render();

function handleDragEnter(event) {
  event.preventDefault();
  dropzone.classList.add('is-dragging');
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDragLeave(event) {
  if (!dropzone.contains(event.relatedTarget)) {
    dropzone.classList.remove('is-dragging');
  }
}

function handleDrop(event) {
  event.preventDefault();
  dropzone.classList.remove('is-dragging');
  addFiles(event.dataTransfer.files);
}

function handleDropzoneKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    fileInput.click();
  }
}

function addFiles(fileListLike) {
  const incomingFiles = Array.from(fileListLike || []);

  for (const file of incomingFiles) {
    const id = createFileId(file);

    selectedFiles.push({
      id,
      file,
      supported: isSupportedEmlFile(file),
      status: 'pending'
    });
  }

  fileInput.value = '';
  render();
}

function createFileId(file) {
  const randomId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  return `${file.name}-${file.size}-${file.lastModified}-${randomId}`;
}

function clearFiles() {
  selectedFiles = [];
  results = [];
  resetResultViewState();
  render();
}

async function parseSelectedFiles() {
  if (isParsing) {
    return;
  }

  const supportedEntries = selectedFiles.filter((entry) => entry.supported);

  if (supportedEntries.length === 0) {
    selectionSummary.textContent = 'Bitte zuerst EML-Dateien auswählen';
    return;
  }

  results = [];
  isParsing = true;
  render();

  try {
    for (const entry of supportedEntries) {
      entry.status = 'parsing';
      render();

      try {
        const parsed = await parseEmlFile(entry.file);
        entry.status = 'done';
        results.push({
          source_file: entry.file.name,
          status: 'ok',
          error: '',
          ...parsed
        });
      } catch (error) {
        entry.status = 'error';
        results.push({
          source_file: entry.file.name,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unbekannter Parsing-Fehler',
          datum: '',
          einsatzstichwort: '',
          ort: '',
          priority: '',
          alarm_text: '',
          einheit: '',
          verfasser: ''
        });
      }

      render();
    }
  } finally {
    isParsing = false;
    render();
  }
}

function renderAppMetadata() {
  if (jsVersion) {
    jsVersion.textContent = `JS v${APP_JS_VERSION}`;
  }
}

function handleBeforeUnload(event) {
  if (!hasVolatilePageState()) {
    return;
  }

  event.preventDefault();
  event.returnValue = LEAVE_CONFIRMATION_MESSAGE;
}

function hasVolatilePageState() {
  return selectedFiles.length > 0 || results.length > 0 || isParsing;
}

function handleResultSearch(event) {
  filterText = event.target.value;
  renderResults();
}

function handleStatusFilter(event) {
  selectedStatus = event.target.value;
  renderResults();
}

function handleSortButtonClick(event) {
  const column = event.currentTarget.dataset.sortKey;

  if (!SORTABLE_COLUMNS.has(column) || results.length === 0) {
    return;
  }

  if (sortState.column === column) {
    sortState = {
      column,
      direction: sortState.direction === 'asc' ? 'desc' : 'asc'
    };
  } else {
    sortState = {
      column,
      direction: 'asc'
    };
  }

  renderResults();
}

function resetResultViewState() {
  filterText = '';
  selectedStatus = 'all';
  sortState = {
    column: '',
    direction: 'asc'
  };

  if (resultSearch) {
    resultSearch.value = '';
  }

  if (statusFilter) {
    statusFilter.value = selectedStatus;
  }
}

async function parseEmlFile(file) {
  const buffer = await file.arrayBuffer();
  const rawText = new TextDecoder('utf-8').decode(buffer);
  const dateHeader = extractHeaderValue(rawText, 'Date');
  const datum = formatMailDateHeader(dateHeader);
  const email = await PostalMime.parse(buffer);
  const body = extractReadableBody(email);
  const alert = extractDiveraAlert(body);

  return {
    datum,
    ...alert
  };
}

function extractReadableBody(email) {
  if (typeof email.text === 'string' && email.text.trim()) {
    return normalizeBodyText(email.text);
  }

  if (typeof email.html === 'string' && email.html.trim()) {
    return normalizeBodyText(htmlToText(email.html));
  }

  throw new Error('Kein auswertbarer Mailbody gefunden');
}

function isSupportedEmlFile(file) {
  return /\.eml$/i.test(file.name) || file.type === 'message/rfc822';
}

function render() {
  renderSelection();
  renderResults();
}

function renderSelection() {
  const supportedCount = selectedFiles.filter((entry) => entry.supported).length;
  const unsupportedCount = selectedFiles.length - supportedCount;
  const parts = [];

  if (supportedCount > 0) {
    parts.push(`${supportedCount} EML-Datei${supportedCount === 1 ? '' : 'en'}`);
  }

  if (unsupportedCount > 0) {
    parts.push(`${unsupportedCount} nicht unterstützt`);
  }

  selectionSummary.textContent = parts.length > 0 ? parts.join(', ') : 'Keine Dateien ausgewählt';
  parseButton.disabled = isParsing || supportedCount === 0;
  clearButton.disabled = isParsing || selectedFiles.length === 0;
  fileList.replaceChildren(...selectedFiles.map(createFileListItem));
}

function createFileListItem(entry) {
  const item = document.createElement('li');
  item.className = 'file-item';

  const details = document.createElement('div');
  const name = document.createElement('div');
  const meta = document.createElement('div');
  const badge = document.createElement('span');

  name.className = 'file-name';
  name.textContent = entry.file.name;

  meta.className = 'file-meta';
  meta.textContent = formatBytes(entry.file.size);

  details.append(name, meta);

  badge.className = `badge ${getFileBadgeClass(entry)}`;
  badge.textContent = getFileBadgeLabel(entry);

  item.append(details, badge);

  return item;
}

function renderResults() {
  renderResultControls();

  const visibleResults = getVisibleResults();
  resultCount.textContent = getResultCountLabel(visibleResults.length);

  if (results.length === 0) {
    resultsBody.replaceChildren(createEmptyResultRow('Noch keine Ergebnisse'));
    return;
  }

  if (visibleResults.length === 0) {
    resultsBody.replaceChildren(createEmptyResultRow('Keine Treffer für die aktiven Filter'));
    return;
  }

  resultsBody.replaceChildren(...visibleResults.map(createResultRow));
}

function renderResultControls() {
  const hasResults = results.length > 0;

  if (resultSearch) {
    resultSearch.disabled = !hasResults;
  }

  if (statusFilter) {
    statusFilter.disabled = !hasResults;
  }

  for (const button of sortButtons) {
    const column = button.dataset.sortKey;
    const indicator = button.querySelector('.sort-indicator');
    const isActive = sortState.column === column;

    button.disabled = !hasResults;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));

    if (indicator) {
      indicator.textContent = isActive ? (sortState.direction === 'asc' ? '▲' : '▼') : '';
    }
  }
}

function getVisibleResults() {
  const filteredResults = results.filter(matchesResultFilters);
  return sortResults(filteredResults);
}

function matchesResultFilters(result) {
  if (selectedStatus !== 'all' && result.status !== selectedStatus) {
    return false;
  }

  const normalizedFilterText = normalizeSearchText(filterText);

  if (!normalizedFilterText) {
    return true;
  }

  return getSearchableResultText(result).includes(normalizedFilterText);
}

function getSearchableResultText(result) {
  return normalizeSearchText([
    result.source_file,
    getStatusLabel(result.status),
    result.error,
    result.datum,
    result.einsatzstichwort,
    result.ort,
    result.priority,
    result.alarm_text,
    result.einheit,
    result.verfasser
  ].join(' '));
}

function normalizeSearchText(text) {
  return String(text || '').trim().toLocaleLowerCase('de-DE');
}

function sortResults(filteredResults) {
  if (!SORTABLE_COLUMNS.has(sortState.column)) {
    return filteredResults;
  }

  return [...filteredResults].sort((left, right) => {
    const comparison = compareResultValues(left, right, sortState.column);
    return sortState.direction === 'asc' ? comparison : -comparison;
  });
}

function compareResultValues(left, right, column) {
  const leftValue = getSortableValue(left, column);
  const rightValue = getSortableValue(right, column);

  return leftValue.localeCompare(rightValue, 'de-DE', {
    numeric: true,
    sensitivity: 'base'
  });
}

function getSortableValue(result, column) {
  if (column === 'status') {
    return getStatusLabel(result.status);
  }

  return String(result[column] || '');
}

function getStatusLabel(status) {
  if (status === 'ok') {
    return 'Erfolgreich';
  }

  if (status === 'error') {
    return 'Fehler';
  }

  return '';
}

function getResultCountLabel(visibleCount) {
  if (results.length === 0 || visibleCount === results.length) {
    return `${results.length} verarbeitet`;
  }

  return `${visibleCount} von ${results.length} verarbeitet`;
}

function createEmptyResultRow(message) {
  const row = document.createElement('tr');
  row.className = 'empty-row';
  const cell = document.createElement('td');
  cell.colSpan = 9;
  cell.textContent = message;
  row.append(cell);
  return row;
}

function createResultRow(result) {
  const row = document.createElement('tr');

  if (result.status === 'ok') {
    appendCell(row, result.source_file);
    appendStatusCell(row, 'Erfolgreich', 'success');
    appendCell(row, result.datum);
    appendCell(row, result.einsatzstichwort);
    appendCell(row, result.ort);
    appendCell(row, result.priority);
    appendCell(row, result.alarm_text, 'alarm-text');
    appendCell(row, result.einheit);
    appendCell(row, result.verfasser);
  } else {
    appendCell(row, result.source_file);
    appendStatusCell(row, 'Fehler', 'error', result.error);
    appendCell(row, '');
    appendCell(row, '');
    appendCell(row, '');
    appendCell(row, '');
    appendCell(row, '');
    appendCell(row, '');
    appendCell(row, '');
  }

  return row;
}

function appendCell(row, text, className = '') {
  const cell = document.createElement('td');
  cell.textContent = text;

  if (className) {
    cell.className = className;
  }

  row.append(cell);
}

function appendStatusCell(row, text, type, detail = '') {
  const cell = document.createElement('td');
  const badge = document.createElement('span');
  badge.className = `badge ${type}`;
  badge.textContent = text;
  cell.append(badge);

  if (detail) {
    const detailElement = document.createElement('div');
    detailElement.className = 'status-detail';
    detailElement.textContent = detail;
    cell.append(detailElement);
  }

  row.append(cell);
}

function getFileBadgeClass(entry) {
  if (!entry.supported) {
    return 'unsupported';
  }

  if (entry.status === 'parsing') {
    return 'pending';
  }

  if (entry.status === 'done') {
    return 'supported';
  }

  if (entry.status === 'error') {
    return 'unsupported';
  }

  return 'pending';
}

function getFileBadgeLabel(entry) {
  if (!entry.supported) {
    return 'Nicht unterstützt';
  }

  if (entry.status === 'parsing') {
    return 'Wird geparst';
  }

  if (entry.status === 'done') {
    return 'Geparst';
  }

  if (entry.status === 'error') {
    return 'Fehler';
  }

  return 'Bereit';
}

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
