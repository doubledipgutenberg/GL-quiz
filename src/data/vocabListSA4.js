// Vokabeln 4. Schulaufgabe (Green Line 1) — Units 5–6, Across Cultures 2, Focus 2
// Bereich laut Stoffzettel: S.229 (answering machine) – S.237 (ago).
// NICHT enthalten (Absprache): die Wörter oben auf S.229 (a couple of … guitar)
//   sowie die Kästen Ordinal numbers / Months / American English (S.234 + 237).
//   Datum/Ordnungszahlen werden stattdessen in der Grammatik ("Saying the date") geübt.
// Quelle: VOCAB_SA4_review.md (vom Nutzer geprüft).
// Format pro Zeile: english – deutsch   (mehrere Bedeutungen mit ";" getrennt)

function slug(s) {
  return 's4_' + (s.toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[’']/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40) || 'voc');
}

const raw = `
answering machine – Anrufbeantworter
message – Botschaft; Nachricht
to call – anrufen; rufen
to leave a message – eine Nachricht hinterlassen
caller – Anrufer/-in
phone call – Anruf; Telefonanruf
to answer the phone – einen Anruf entgegennehmen
to put through – verbinden
left – übrig
I'd like to – ich möchte; ich würde gern
to take a message – eine Nachricht entgegennehmen
to set up – einrichten; aufbauen
dictionary – Wörterbuch
buyer – Käufer/-in
seller – Verkäufer/-in
half – die Hälfte; halb
goal – Tor; Ziel
lucky – glücklich
wine – Wein
raffle – Tombola
prize – Preis; Gewinn
ticket – Los; Ticket; Eintrittskarte
each – pro Person; pro Stück
to hope – hoffen
to think – glauben
still – noch; immer noch
to pull – ziehen
piece – Stück
broken – gebrochen; kaputt
horrified – entsetzt
rubbish – Müll; Gerümpel
coin – Münze
head – Kopf
to believe – glauben
to hug – umarmen
disappointed – enttäuscht
helpful – hilfsbereit; hilfreich
thankful – dankbar
excited – aufgeregt; begeistert
helpless – hilflos
tomato – Tomate
yoghurt – Joghurt
part – Teil; Stadtteil
culture – Kultur
quick – schnell
contest – Wettkampf; Wettbewerb
bacon – Schinkenspeck; Speck
bread – Brot
cake – Kuchen; Torte
egg – Ei
fish – Fisch
fruit – Frucht; Obst
pie – Kuchen; Pastete
strange – fremd; seltsam; merkwürdig
apple – Apfel
butter – Butter
cereal – Frühstückszerealie; Getreideprodukt
chocolate – Schokolade
crisp – Kartoffelchip
ham – Schinken
nut – Nuss
plum – Pflaume
strawberry – Erdbeere
sweet – süß
healthy – gesund
hot – heiß
supermarket – Supermarkt
to go together – zueinander passen; zueinander gehören
baked beans – weiße Bohnen in Tomatensoße
banana – Banane
ready meal – Fertiggericht
salad – Salat
Indian – Inder/-in; indisch
chicken tikka masala – indisches Hühnchengericht
milk – Milch
young – jung
world – Erde; Welt
kind – Art; Sorte
as – wie
to make friends – Freundschaft schließen
independent – unabhängig
American – amerikanisch; Amerikaner/-in
government – Regierung
official language – Amtssprache
all around – überall; rundherum
million – Million
first language – Muttersprache
technology – Technologie
to communicate – kommunizieren; sich verständigen
although – obwohl
not any more – nicht mehr
the USA – die USA
what else – was sonst; was noch
costume – Kostüm
at the same time – zur selben Zeit; gleichzeitig
bowling alley – Bowlingbahn
to give the bumps – hochleben lassen
to celebrate – feiern
birthday – Geburtstag
ice rink – Eisbahn; Schlittschuhbahn
to blow out – ausblasen; auspusten
candle – Kerze
to make a wish – sich etwas wünschen
wish – Wunsch
Happy Birthday – Alles Gute zum Geburtstag; Herzlichen Glückwunsch zum Geburtstag
date – Datum
spring – Frühling
summer – Sommer
autumn – Herbst
winter – Winter
to plan – planen
sleepover – Übernachtung
mustn't – nicht dürfen
like that – so
holidays – Ferien
that – dass
theme – Thema; Motto
decorations – Dekoration; Schmuck
needn't – nicht brauchen; nicht müssen
to invite – einladen
to decorate – dekorieren; verzieren; schmücken
trifle – Trifle
ice cream – Eis; Eiscreme
all night – die ganze Nacht
to clean – säubern; reinigen
to get – besorgen; kaufen
to do our hair – uns frisieren; unsere Haare machen
invitation – Einladung
size – Größe; Kleidergröße
locker – Schließfach; Spind
without – ohne
glove – Handschuh
to move – sich bewegen; bewegen
at all – überhaupt
out – außerhalb; heraus; draußen
to win – gewinnen; siegen
to prepare – vorbereiten; zubereiten
sponge – Rührteig; Biskuit
jelly – Götterspeise; Wackelpudding; Gelee
custard – Vanillesoße; Vanillepudding
fresh – frisch
tinned – aus der Dose
cream – Creme; Sahne
to break – brechen; zerbrechen
bowl – Schale; Schüssel
to slice – in Scheiben schneiden
on top – oben; obendrauf
to leave it to cool – kalt stellen
to pour – einschenken; eingießen; schütten
to whip – (Sahne) schlagen
to go wrong – schiefgehen
in the end – schließlich; zum Schluss
to trip (over) – stolpern (über)
to hurt – verletzen; weh tun
yummy – lecker
bad luck – Pech; Unglück
month – Monat
yesterday – gestern
postcard – Postkarte
vacation – Ferien; Urlaub
barbecue – Grill; Grillparty
fireworks – Feuerwerk
awesome – super; spitze; beeindruckend
pancake – Pfannkuchen
normal – normal
yard – Garten
cookie – Keks
fries – Pommes frites
candy – Süßigkeiten
guy – Typ; Kerl; Leute
to want somebody to do something – wollen, dass jemand etwas tut
instead of – statt; anstatt
Christmas – Weihnachten
Easter – Ostern
New Year's Eve – Silvester
to stay up – aufbleiben
midnight – Mitternacht
ago – vor
`;

const entries = raw.trim().split('\n').map((line) => {
  const idx = line.indexOf('–');
  if (idx === -1) return null;
  const en = line.slice(0, idx).trim();
  const de = line.slice(idx + 1).trim();
  if (!en || !de) return null;
  return { id: slug(en), en, de };
}).filter(Boolean);

// Doppelte englische Stichwörter zusammenführen (deutsche Bedeutungen vereinen)
const byId = new Map();
for (const e of entries) {
  if (byId.has(e.id)) {
    const ex = byId.get(e.id);
    if (!ex.de.includes(e.de)) ex.de = `${ex.de}; ${e.de}`;
  } else {
    byId.set(e.id, { ...e });
  }
}
const unique = [...byId.values()];

const INSTRUCTIONS_EN = [
  'Wie heißt das auf Englisch?',
  'Übersetze ins Englische:',
  'Schreib das englische Wort:',
  'Auf Englisch?',
];
const INSTRUCTIONS_DE = [
  'Was heißt das auf Deutsch?',
  'Übersetze ins Deutsche:',
  'Schreib das deutsche Wort:',
  'Auf Deutsch?',
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Wortschatz-Quiz SA4: je eine EN- und eine DE-Frage pro Vokabel. */
export function getVocabularyQuestionsSA4() {
  const bucketEn = [];
  const bucketDe = [];

  unique.forEach((v, i) => {
    bucketEn.push({
      id: `${v.id}_en`,
      vocabId: v.id,
      exam: 'sa4',
      topic: 'vocabulary',
      topicLabel: 'Wortschatz',
      category: 'vocabulary',
      type: 'vocab_card',
      difficulty: 1,
      instruction: INSTRUCTIONS_EN[i % INSTRUCTIONS_EN.length],
      word: v.de,
      correct: v.en,
      hint: v.en,
      explanation: `${v.en} = ${v.de}`,
    });

    bucketDe.push({
      id: `${v.id}_de`,
      vocabId: v.id,
      exam: 'sa4',
      topic: 'vocabulary',
      topicLabel: 'Wortschatz',
      category: 'vocabulary',
      type: 'vocab_card',
      difficulty: 1,
      instruction: INSTRUCTIONS_DE[i % INSTRUCTIONS_DE.length],
      word: v.en,
      correct: v.de,
      hint: v.de,
      explanation: `${v.de} = ${v.en}`,
    });
  });

  return [...shuffle(bucketEn), ...shuffle(bucketDe)];
}

export const vocabCountSA4 = unique.length;
