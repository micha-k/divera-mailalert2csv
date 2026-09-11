export function normalizeSearchText(text) {
  return String(text || '').trim().toLocaleLowerCase('de-DE');
}

export function getSearchableResultText(result) {
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
    result.gruppe,
    result.verfasser
  ].join(' '));
}

export function sortResults(results, sortState, sortableColumns) {
  if (!sortableColumns.has(sortState.column)) {
    return results;
  }

  return [...results].sort((left, right) => {
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
