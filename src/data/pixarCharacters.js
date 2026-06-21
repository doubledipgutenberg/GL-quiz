// Pixar character motivation – quotes in the spirit of known Pixar films

const avatarUrl = (name) =>
  `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(name)}&size=80`;

// Richtig – lustige, charakteristische Sprüche (angelehnt an Toy Story, Findet Nemo, Cars, etc.)
const correctList = [
  { name: "Woody", quotes: ["Du hast einen Freund in mir — und offenbar auch Vokabeln im Kopf!", "Reach for the sky! So hoch kannst du nur mit so einer Antwort!", "Das war nicht nur richtig — das war Sheriff-Level!"] },
  { name: "Buzz Lightyear", quotes: ["To infinity and beyond! Deine Antwort war … unendlich gut!", "Das war kein Zufall — das war eine Weltraum-Mission, und du hast gewonnen!", "Ranger, ich lese dich fünf von fünf. Perfekt!"] },
  { name: "Nemo", quotes: ["Einfach weiter so — du schwimmst besser als ich mit meiner Flosse!", "Das war fintastisch! Verstehst du? Fin … egal, war super!", "Papa würde sagen: Du bist ein richtiger Ozean-Held!"] },
  { name: "Lightning McQueen", quotes: ["Ka-chow! So schnell und so richtig — ich bin beeindruckt!", "Erster Platz! Du hast gerade die Konkurrenz abgehängt!", "Respekt. Das war Formel-1-Niveau."] },
  { name: "Dory", quotes: ["Ich hab schon wieder vergessen, was die Frage war — aber deine Antwort war richtig!", "Weiter so! … Was machen wir nochmal? Egal, du warst gut!", "Whale hello there! Deine Antwort hat mich gerettet — im Kopf."] },
  { name: "Mike Wazowski", quotes: ["Ich habe nur ein Auge — und selbst ich sehe: Das war perfekt!", "Schrecklich gut! Bei uns Monstern ist das das höchste Kompliment!", "Du bist nicht nur gut — du bist Bühnen-reif!"] },
  { name: "Remy", quotes: ["Magnifique! Diese Antwort schmeckt wie ein Sterne-Menü!", "Jeder kann kochen — und du kannst offenbar auch Englisch. Chapeau!", "Bon appétit! So eine Antwort könnte ich mir jeden Tag servieren."] },
  { name: "Sulley", quotes: ["Boa! So was von richtig — da krieg ich fast Angst … vor deiner Stärke!", "Das war nicht nur gut — das war Monster-Energy im Kopf!", "Weiter so, dann brauchst du keine Tür mehr — du fliegst so!"] }
];

// Falsch – aufmunternd und lustig, im Pixar-Ton
const incorrectList = [
  { name: "Dory", quotes: ["Ich vergesse ständig Sachen — und trotzdem geht’s weiter. Du schaffst das!", "Nächstes Mal merkst du’s dir. Oder ich. Einer von uns. Weiter!", "Whale … das war knapp. Beim nächsten Mal klappt’s!"] },
  { name: "Woody", quotes: ["Jeder Cowboy fällt mal vom Pferd. Wichtig: wieder aufstehen — du packst das!", "Kopf hoch, Partner! Beim nächsten Mal holen wir die richtige Antwort!", "Du bist trotzdem mein Lieblings-Ranger. Nächstes Mal sitzt’s!"] },
  { name: "Buzz Lightyear", quotes: ["Auch Raum-Ranger verfehlen mal das Ziel. Nächster Versuch!", "Kleine Kurskorrektur — und du bist wieder auf Kurs. Weiter!", "Fall nicht in Panik. Wir landen beim nächsten Mal sicher!"] },
  { name: "Nemo", quotes: ["Das Meer ist groß — und voller zweiter Chancen. Schwimm weiter!", "Papa hat mich auch gefunden. Du findest die richtige Antwort auch!", "Kein Fisch ist beim ersten Mal perfekt. Du schon fast!"] },
  { name: "Lightning McQueen", quotes: ["Boxenstopp! Kurz nachdenken, Tank füllen — und wieder raus!", "Ich hab auch schon Rennen verloren. Beim nächsten Mal gewinnst du!", "Jede Kurve macht dich besser. Nächste Runde!"] },
  { name: "Mike Wazowski", quotes: ["Ich wurde auch mal rausgeworfen — und schau mich jetzt an! Du schaffst das!", "Fehler? Egal. Beim nächsten Mal zeigst du’s allen!", "Ein Auge reicht — und du siehst beim nächsten Mal die richtige Antwort!"] },
  { name: "Remy", quotes: ["Auch das beste Rezept braucht Übung. Du bist auf dem richtigen Herd!", "Ein Sternekoch probiert immer wieder. Genau wie du jetzt!", "Nicht jedes Gericht gelingt beim ersten Mal — aber das nächste!"] },
  { name: "Sulley", quotes: ["Manchmal muss man zweimal brüllen — dann sitzt’s. Du schaffst das!", "Keine Angst vor Fehlern. Die machen dich stärker — echt!", "Beim nächsten Mal zeigst du’s. Ich glaub an dich!"] }
];

export function getRandomCharacter(isCorrect) {
  const list = isCorrect ? correctList : incorrectList;
  const character = list[Math.floor(Math.random() * list.length)];
  const quote = character.quotes[Math.floor(Math.random() * character.quotes.length)];
  return { name: character.name, imageUrl: avatarUrl(character.name), quote };
}

export default { correct: correctList, incorrect: incorrectList };
