const FOOTER_MARKERS = [
  'Unser Support-Team ist',
  'DIVERA GmbH',
  'Sie erhalten diese E-Mail'
];

const MONTHS = new Map([
  ['jan', '01'],
  ['feb', '02'],
  ['mar', '03'],
  ['apr', '04'],
  ['may', '05'],
  ['jun', '06'],
  ['jul', '07'],
  ['aug', '08'],
  ['sep', '09'],
  ['oct', '10'],
  ['nov', '11'],
  ['dec', '12']
]);

export function extractHeaderValue(rawEmail, headerName) {
  const raw = String(rawEmail || '');
  const normalized = raw.replace(/\r\n/g, '\n');
  const headerEnd = normalized.indexOf('\n\n');
  const headerBlock = headerEnd === -1 ? normalized : normalized.slice(0, headerEnd);
  const lines = headerBlock.split('\n');
  const headers = [];

  for (const line of lines) {
    if (/^[ \t]/.test(line) && headers.length > 0) {
      headers[headers.length - 1] += ` ${line.trim()}`;
    } else {
      headers.push(line);
    }
  }

  const prefix = `${headerName.toLowerCase()}:`;
  const found = headers.find((line) => line.toLowerCase().startsWith(prefix));

  return found ? found.slice(prefix.length).trim() : '';
}

export function formatMailDateHeader(dateHeader) {
  const value = String(dateHeader || '').replace(/\s+/g, ' ').trim();

  if (!value) {
    throw new Error('Date-Header fehlt');
  }

  const rfcMatch = value.match(/^(?:[A-Za-z]{3},\s*)?(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?\s+([+-]\d{4})/);

  if (rfcMatch) {
    const [, day, monthName, year, hours, minutes, seconds = '00', offset] = rfcMatch;
    const month = MONTHS.get(monthName.toLowerCase());

    if (month) {
      const paddedDay = day.padStart(2, '0');
      const offsetWithColon = `${offset.slice(0, 3)}:${offset.slice(3)}`;
      const isoDate = `${year}-${month}-${paddedDay}T${hours}:${minutes}:${seconds}${offsetWithColon}`;

      if (!Number.isNaN(Date.parse(isoDate))) {
        return isoDate;
      }
    }
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Date-Header ist ungueltig');
  }

  return parsed.toISOString();
}

export function htmlToText(html) {
  const document = new DOMParser().parseFromString(String(html || ''), 'text/html');
  return document.body.textContent || '';
}

export function normalizeBodyText(body) {
  return String(body || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u00a0/g, ' ')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function stripDiveraFooter(body) {
  const normalized = normalizeBodyText(body);
  const indexes = FOOTER_MARKERS
    .map((marker) => normalized.indexOf(marker))
    .filter((index) => index >= 0);

  if (indexes.length === 0) {
    return normalized;
  }

  return normalized.slice(0, Math.min(...indexes)).trim();
}

export function extractDiveraAlert(body) {
  const text = stripDiveraFooter(body);
  const markers = {
    stichwort: findMarker(text, /^Stichwort\s*:/imu),
    adresse: findMarker(text, /^Adresse\s*:/imu),
    priority: findMarker(text, /^Sonderrechte\/Priorit(?:ä|ae)t\s*:/imu),
    einheiten: findMarker(text, /^Einheiten?\s*:/imu),
    verfasser: findMarker(text, /^Verfasst von\s*:/imu)
  };
  const requiredMarkers = {
    stichwort: markers.stichwort,
    priority: markers.priority
  };

  for (const [name, marker] of Object.entries(requiredMarkers)) {
    if (!marker) {
      throw new Error(`Pflichtfeld fehlt: ${name}`);
    }
  }

  validateMarkerOrder(markers);

  const stichwortEnd = markers.adresse ? markers.adresse.start : markers.priority.start;
  const priorityAndAlarmTextEnd = findEarliestMarkerStart(
    text.length,
    markers.einheiten,
    markers.verfasser
  );
  const priorityAndAlarmText = text.slice(markers.priority.after, priorityAndAlarmTextEnd);
  const { priority, alarmText } = splitPriorityAndAlarmText(priorityAndAlarmText);
  const hasVerfasser = Boolean(markers.verfasser);
  const einheitEnd = hasVerfasser ? markers.verfasser.start : text.length;

  return {
    einsatzstichwort: cleanSingleLine(text.slice(markers.stichwort.after, stichwortEnd)),
    ort: markers.adresse ? cleanSingleLine(text.slice(markers.adresse.after, markers.priority.start)) : '',
    priority: cleanSingleLine(priority),
    alarm_text: cleanAlarmText(alarmText),
    einheit: markers.einheiten ? cleanSingleLine(text.slice(markers.einheiten.after, einheitEnd)) : '',
    verfasser: hasVerfasser ? cleanSingleLine(text.slice(markers.verfasser.after)) : ''
  };
}

function validateMarkerOrder(markers) {
  const orderedMarkers = [
    ['stichwort', markers.stichwort],
    ['adresse', markers.adresse],
    ['priority', markers.priority],
    ['einheiten', markers.einheiten],
    ['verfasser', markers.verfasser]
  ].filter(([, marker]) => marker);

  for (let index = 1; index < orderedMarkers.length; index += 1) {
    const [, previousMarker] = orderedMarkers[index - 1];
    const [, marker] = orderedMarkers[index];

    if (previousMarker.after > marker.start) {
      throw new Error('DIVERA-Felder stehen nicht in der erwarteten Reihenfolge');
    }
  }
}

function findEarliestMarkerStart(fallback, ...markers) {
  const starts = markers
    .filter(Boolean)
    .map((marker) => marker.start);

  if (starts.length === 0) {
    return fallback;
  }

  return Math.min(...starts);
}

function findMarker(text, pattern) {
  const match = pattern.exec(text);

  if (!match) {
    return null;
  }

  return {
    start: match.index,
    after: match.index + match[0].length
  };
}

function splitPriorityAndAlarmText(block) {
  const cleaned = normalizeBodyText(block);
  const blankLineSplit = cleaned.match(/\n\s*\n/);

  if (blankLineSplit && typeof blankLineSplit.index === 'number') {
    return {
      priority: cleaned.slice(0, blankLineSplit.index),
      alarmText: cleaned.slice(blankLineSplit.index + blankLineSplit[0].length)
    };
  }

  const lines = cleaned.split('\n');

  return {
    priority: lines.shift() || '',
    alarmText: lines.join('\n')
  };
}

function cleanSingleLine(value) {
  return normalizeBodyText(value)
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanAlarmText(value) {
  return normalizeBodyText(value)
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
