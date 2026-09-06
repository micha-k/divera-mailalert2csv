import PostalMime from 'https://unpkg.com/postal-mime@3.0.0/src/postal-mime.js';
import {
  extractDiveraAlert,
  extractHeaderValue,
  formatMailDateHeader,
  htmlToText,
  normalizeBodyText
} from './parser-core.mjs';

const dropzone = document.querySelector('#dropzone');
const fileInput = document.querySelector('#file-input');
const parseButton = document.querySelector('#parse-button');
const clearButton = document.querySelector('#clear-button');
const fileList = document.querySelector('#file-list');
const selectionSummary = document.querySelector('#selection-summary');
const resultsBody = document.querySelector('#results-body');
const resultCount = document.querySelector('#result-count');

let selectedFiles = [];
let results = [];

dropzone.addEventListener('dragenter', handleDragEnter);
dropzone.addEventListener('dragover', handleDragOver);
dropzone.addEventListener('dragleave', handleDragLeave);
dropzone.addEventListener('drop', handleDrop);
dropzone.addEventListener('keydown', handleDropzoneKeydown);
fileInput.addEventListener('change', () => addFiles(fileInput.files));
parseButton.addEventListener('click', parseSelectedFiles);
clearButton.addEventListener('click', clearFiles);

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
  render();
}

async function parseSelectedFiles() {
  const supportedEntries = selectedFiles.filter((entry) => entry.supported);

  if (supportedEntries.length === 0) {
    selectionSummary.textContent = 'Bitte zuerst EML-Dateien auswählen';
    return;
  }

  parseButton.disabled = true;
  results = [];

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
  parseButton.disabled = supportedCount === 0;
  clearButton.disabled = selectedFiles.length === 0;
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
  resultCount.textContent = `${results.length} verarbeitet`;

  if (results.length === 0) {
    const row = document.createElement('tr');
    row.className = 'empty-row';
    const cell = document.createElement('td');
    cell.colSpan = 9;
    cell.textContent = 'Noch keine Ergebnisse';
    row.append(cell);
    resultsBody.replaceChildren(row);
    return;
  }

  resultsBody.replaceChildren(...results.map(createResultRow));
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
