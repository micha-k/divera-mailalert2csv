import assert from 'node:assert/strict';
import { extractDiveraAlert } from './parser-core.mjs';

const suizidAlert = extractDiveraAlert(`
Notfallseelsorge/Krisenintervention Berlin - Neue Alarmierung

Stichwort: Suizid

Adresse: Konkordia [Spandau 13595]

Sonderrechte/Priorität: Ja

Mann hat sich das Leben genommen.
Zu Betreuen 35-jährige Frau
Rückmeldung:
Yves 0160 215 01 87      030 2332 71 800

Gruppen: Region 1, Region 2, Region 3

Verfasst von: Yves Wittmann

Unser Support-Team ist für Sie da!
`);

assert.deepEqual(suizidAlert, {
  einsatzstichwort: 'Suizid',
  ort: 'Konkordia [Spandau 13595]',
  priority: 'Ja',
  alarm_text: [
    'Mann hat sich das Leben genommen.',
    'Zu Betreuen 35-jährige Frau',
    'Rückmeldung:',
    'Yves 0160 215 01 87      030 2332 71 800'
  ].join('\n'),
  einheit: '',
  gruppe: 'Region 1, Region 2, Region 3',
  verfasser: 'Yves Wittmann'
});

const allOptionalSections = extractDiveraAlert(`
Stichwort: Betreuung

Adresse: Berlin

Sonderrechte/Prioritaet: Nein

Alarmtext

Einheiten: NFS Berlin

Gruppen: Region 2, Region 4

Verfasst von: Beispiel
`);

assert.deepEqual(allOptionalSections, {
  einsatzstichwort: 'Betreuung',
  ort: 'Berlin',
  priority: 'Nein',
  alarm_text: 'Alarmtext',
  einheit: 'NFS Berlin',
  gruppe: 'Region 2, Region 4',
  verfasser: 'Beispiel'
});

const singularGroupWithoutAuthor = extractDiveraAlert(`
Stichwort: Betreuung

Sonderrechte/Priorität: Nein

Alarmtext

Einheiten: NFS Berlin

Gruppe: Region Nord
`);

assert.deepEqual(singularGroupWithoutAuthor, {
  einsatzstichwort: 'Betreuung',
  ort: '',
  priority: 'Nein',
  alarm_text: 'Alarmtext',
  einheit: 'NFS Berlin',
  gruppe: 'Region Nord',
  verfasser: ''
});

const withoutGroups = extractDiveraAlert(`
Stichwort: Testalarm

Sonderrechte/Priorität: Nein

Nur ein Test.

Einheiten: NFS Berlin

Verfasst von: Leitstelle
`);

assert.deepEqual(withoutGroups, {
  einsatzstichwort: 'Testalarm',
  ort: '',
  priority: 'Nein',
  alarm_text: 'Nur ein Test.',
  einheit: 'NFS Berlin',
  gruppe: '',
  verfasser: 'Leitstelle'
});

assert.throws(() => extractDiveraAlert(`
Stichwort: Falsche Reihenfolge

Sonderrechte/Priorität: Nein

Gruppen: Region 1

Einheiten: NFS Berlin
`), /erwarteten Reihenfolge/);

console.log('Parser core tests passed');
