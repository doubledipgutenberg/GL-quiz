// Englisch Klasse 6 – Vokabeln (Band 2 des Englisch-Lehrwerks; der Name steht nirgends im Repo).
// Quelle: Vokabelteil des Buchs (S. 195–199) + Vokabelheft der Kinder (siehe VOCAB_EN6_U1_review.md).
// Diese Datei hat KEINE Importe, damit scripts/export-audio-manifest.mjs sie direkt mit Node lesen kann.
//
// Aufbau wie src/data/fr6/vocab.js: Jede Lieferung ist ein BATCH mit dem Datum, an dem sie ins Quiz
// kam (`added`). „Nur neue Vokabeln“ filtert den Wortschatz auf den jüngsten Batch.
// Felder pro Eintrag: en, de, optional alt (weitere richtige engl. Antworten),
// altDe (weitere richtige dt. Antworten), minAnswers (Ausnahme von „mind. zwei Bedeutungen“ bei ≥ 3 Teilen, z. B.
// bei bloßen Formen wie sollte/solltest), say (gesprochener Text, falls abweichend), sayPhonemes (Laute
// direkt, wenn Kokoro falsch ausspricht – z. B. „what a“ sonst mit Buchstaben-A /eɪ/),
// ex (kurzer Beispielsatz, eigene Formulierung – wird bei Hör-Karten nach dem Wort vorgelesen;
// die [Klammer] markiert die Lücke für den Lückentext, siehe gapOf).
// tip (Tipp zum Lückentext, erst nach Tippen sichtbar; seit 2026-11-16 Pflicht zu jedem ex): inhaltlicher Kontext auf
// Englisch, eine Andeutung – nie das gesuchte Wort, nie die Übersetzung, keine direkte Beschreibung des Worts.

export const COURSE = 'en-6';

const BATCHES = [
  {
    exam: 'en6-u1',
    added: '2026-10-11',
    sections: [
      {
        section: 'Unit 1 – Check-in',
        items: [
          { en: 'embarrassing', de: 'peinlich', ex: 'Oh no, this photo is so [embarrassing]!', tip: 'Everybody at school can see you with chocolate all over your face.' },
          { en: 'to end up', de: 'enden; landen', ex: 'Our ball [ended up] in the river.', tip: "We kicked it too hard – splash! Now it's in the water." },
          { en: 'yearbook', de: 'Jahrbuch', ex: "There's a funny photo of me in the [yearbook].", tip: 'In June, every pupil gets one with all the class photos, and friends write messages in it.' },
          { en: 'real', de: 'echt; richtig; wirklich', ex: 'Is that a [real] eagle?', tip: "It's not a toy and not a photo – it's alive and it's flying!" },
          { en: 'show-off', de: 'Angeber/-in', say: 'show-off', ex: "Don't be such a [show-off]!", tip: "Look at me! I'm the best! My phone is the best!" },
          { en: 'art', de: 'Kunst', ex: '[Art] is my favourite subject.', tip: 'I love painting and drawing pictures at school.' },
          { en: 'what a …', de: 'was für ein/-e …; welch ein/-e …', alt: ['what a'], say: 'what a', sayPhonemes: 'wˈɒt ə', ex: '[What a] nice surprise!', tip: "Grandma is here! I didn't know she was coming!" },
          { en: 'home town', de: 'Heimatstadt', alt: ['hometown'], ex: 'My [home town] is small but nice.', tip: "I was born there and I've lived there all my life." },
          { en: 'likes and dislikes', de: 'Vorlieben und Abneigungen', ex: 'Tell me about your [likes and dislikes].', tip: 'What do you love? What do you hate?' },
          { en: 'huge', de: 'riesig; riesengroß; gewaltig', ex: 'Their new house is [huge]!', tip: 'It has twelve bedrooms and a swimming pool!' },
          { en: 'field', de: 'Feld; Wiese; Weide; Acker', ex: 'There are three horses in the [field].', tip: 'Grass, a fence and lots of space on a farm.' },
          { en: 'hill', de: 'Berg; Hügel', ex: 'We walked up the [hill].', tip: "It's not a mountain, but our legs were tired at the top!" },
          { en: 'outdoors', de: 'draußen; im Freien', ex: 'In summer we often eat [outdoors].', tip: 'When the sun is shining, we have lunch in the garden.' },
          { en: 'indoors', de: 'drinnen; im Haus', ex: "It's raining, so let's play [indoors].", tip: "We can't go into the garden, so we stay in the living room." },
          { en: 'to hang out (with) (infml)', de: 'rumhängen (mit); sich herumtreiben (mit); sich treffen (mit)', alt: ['to hang out with'], say: 'to hang out with', ex: 'I like [to hang out] with my friends at the weekend.', tip: 'We just sit in the park, talk and have fun together.' },
          { en: 'mall', de: 'Einkaufszentrum', alt: ['shopping mall'], ex: "Let's meet at the [mall].", tip: 'We want to go shopping and eat ice cream there.' },
          { en: 'eagle', de: 'Adler', ex: 'The [eagle] is flying over the hill.', tip: "It's a big bird, and it's looking for a mouse from the sky." },
          { en: 'feeling', de: 'Gefühl', ex: 'I have a good [feeling] about the race.', tip: 'I think we can win today – I just know it!' },
          { en: 'embarrassed', de: 'verlegen', ex: 'I was so [embarrassed] when I fell.', tip: 'Everybody laughed, and my face went red.' },
          { en: 'nervous', de: 'nervös; aufgeregt', ex: "I'm always [nervous] before a test.", tip: "My hands are shaking and I can't eat breakfast." },
          { en: 'proud (of)', de: 'stolz (auf)', say: 'proud of', ex: 'My mum is [proud] of me.', tip: 'I got the best mark in the class, and she told everybody!' },
          { en: 'report', de: 'Bericht; Meldung', ex: 'We have to write a [report] about our trip.', tip: 'Write about where we went, what we saw and what we did.' },
          { en: 'during (+ noun)', de: 'während (+ Nomen)', say: 'during', ex: "Please don't talk [during] the film.", tip: 'The cinema is dark and everybody is watching – shhh!' },
        ],
      },
      {
        section: 'Unit 1 – Station 1',
        items: [
          { en: 'actually', de: 'tatsächlich; wirklich; eigentlich', ex: "[Actually], I don't like pizza.", tip: "Everybody thinks I love it, but that's not true!" },
          { en: 'barrel', de: 'Fass; Tonne', ex: 'The [barrel] is full of apples.', tip: 'On the farm, the apples go into a big wooden thing – you can roll it!' },
          { en: 'race', de: 'Wettlauf; Rennen', ex: 'Who won the [race]?', tip: 'Ready, steady, go! The runners start.' },
          { en: 'daughter', de: 'Tochter', ex: 'Mrs Smith has two [daughters].', tip: "Their names are Emma and Lily, and they're both girls." },
          { en: 'wheelchair', de: 'Rollstuhl', ex: 'My grandpa is in a [wheelchair].', tip: "He can't walk any more, so he moves around on wheels." },
          { en: 'to teach', de: 'unterrichten; lehren; beibringen', ex: 'Can you [teach] me to swim?', tip: "I can't swim yet. You're a good swimmer – please show me how!" },
          { en: 'to tease sb', de: 'jmdn. aufziehen; jmdn. hänseln; jmdn. ärgern', alt: ['to tease'], say: 'to tease somebody', ex: 'Please stop [teasing] your little brother!', tip: "Stop laughing at him and calling him 'baby'!" },
          { en: 'latest', de: 'neueste/-r/-s', altDe: ['neuste/-r/-s'], ex: 'Have you heard their [latest] song?', tip: "The band only finished it last week – it's brand new!" },
          { en: 'movie (AE)', de: 'Film', alt: ['film'], say: 'movie', ex: "Let's watch a [movie] tonight.", tip: "Let's get popcorn and turn on the TV." },
          { en: 'movie theater (AE)', de: 'Kino (amerik.)', alt: ['cinema'], say: 'movie theater', ex: 'We went to the [movie theater] on Saturday.', tip: 'We bought popcorn and watched a film on a really big screen.' },
          { en: "There's nothing more exciting than …", de: 'Es gibt nichts Spannenderes als …', alt: ['There is nothing more exciting than'], say: "There's nothing more exciting than", ex: "[There's nothing more exciting than] a horse race.", tip: 'For me, horse races are the best thing in the world – so thrilling!' },
          { en: 'bird', de: 'Vogel', ex: 'A little [bird] is sitting on the bench.', tip: "It's singing in the tree and it has feathers." },
          { en: 'air', de: 'Luft', ex: 'The [air] in the mountains is so fresh.', tip: "Take a deep breath up there – it's so clean!" },
          { en: 'a bit', de: 'ein bisschen; ein wenig', ex: "I'm [a bit] tired today.", tip: "I went to bed late, but I'm OK." },
          { en: 'worried', de: 'beunruhigt; besorgt', ex: "Mum is [worried] because it's late.", tip: "It's late and my brother isn't home yet. Where is he?" },
          { en: 'to move (house)', de: 'umziehen', say: 'to move house', ex: "We're going [to move] house next year.", tip: "We're packing boxes because we want to live in a new place." },
          { en: 'to worry', de: 'sich Sorgen machen', ex: "Don't [worry], everything is OK.", tip: "It's going to be fine – relax!" },
          { en: 'plan', de: 'Plan; Entwurf', ex: 'What are your [plans] for the holidays?', tip: 'Are you going to the beach? Visiting grandma? What will you do?' },
          { en: 'life (pl lives)', de: 'Leben', alt: ['lives'], say: 'life, lives', ex: 'I love my [life] in the country.', tip: 'Every day: animals, fields and fresh air on the farm.' },
          { en: 'to have to', de: 'müssen', ex: 'I [have to] do my homework now.', tip: "Mum says I can't play before it's done." },
          { en: 'to tell', de: 'erkennen; wissen', ex: 'Can you [tell] which twin is Lucy?', tip: 'They look the same! Who is who?' },
          { en: 'to point', de: 'zeigen', ex: "It isn't nice [to point] at people.", tip: "Don't use your finger to show everybody that man!" },
          { en: 'bench', de: 'Bank; Sitzbank', ex: "Let's sit on that [bench].", tip: "We're tired. Look, there's a seat for two in the park." },
          { en: 'to grow up', de: 'aufwachsen; erwachsen werden', ex: 'I [grew up] in a small town.', tip: 'I lived there from when I was a baby until I was ten.' },
        ],
      },
      {
        // Kasten „Numbers“ (S. 197), im Heft am 09.10. eingetragen.
        section: 'Unit 1 – Numbers',
        items: [
          { en: 'one thousand', de: 'eintausend', alt: ['a thousand'], altDe: ['tausend', '1000', '1.000'], ex: '[One thousand] people came to the concert.', tip: '10 × 100' },
          { en: 'ten thousand', de: 'zehntausend', altDe: ['10000', '10.000'], ex: '[Ten thousand] fans watched the match.', tip: '10 × 1,000' },
          { en: 'one hundred thousand', de: 'hunderttausend', alt: ['a hundred thousand'], altDe: ['einhunderttausend', '100000', '100.000'], ex: '[One hundred thousand] people live in this city.', tip: '100 × 1,000' },
          { en: 'one million', de: 'eine Million', alt: ['a million'], altDe: ['1000000', '1.000.000'], ex: '[One million] people visit this museum every year.', tip: '1,000 × 1,000' },
          // Kein '1,5' als Alternative: Komma trennt im Antwort-Check Alternativen.
          { en: 'one point five', de: 'eins Komma fünf', ex: 'The bottle has [one point five] litres of water.', tip: 'A big bottle and half a bottle more.' },
        ],
      },
      {
        // Kasten „City and country“ (S. 197).
        section: 'Unit 1 – City and country',
        items: [
          { en: 'noise', de: 'Lärm', ex: "What's that [noise]?", tip: 'Bang! Crash! Boom! What was that?' },
          { en: 'pollution', de: 'Verschmutzung', ex: 'Cars cause a lot of [pollution].', tip: 'Dirty air and smoke from the exhausts.' },
          { en: 'traffic jam', de: 'Stau', ex: 'We were late because of a [traffic jam].', tip: 'Hundreds of cars on the motorway, and nobody was moving.' },
          { en: 'shopping mall', de: 'Einkaufszentrum', alt: ['mall'], ex: 'The new [shopping mall] has fifty shops.', tip: 'You can buy clothes, shoes and games there – all under one roof.' },
          { en: 'event', de: 'Veranstaltung', ex: 'The school party is a big [event].', tip: 'Music, food, games – everybody is coming!' },
          { en: 'public transport', de: 'öffentlicher Nahverkehr', ex: 'In the city I always use [public transport].', tip: 'I take the bus, the tram and the underground.' },
          { en: 'cheap', de: 'billig', ex: 'This T-shirt was really [cheap].', tip: 'It only cost two pounds!' },
          { en: 'expensive', de: 'teuer', ex: 'The new phone is too [expensive].', tip: "It costs a thousand euros! I can't buy it." },
          { en: 'far away', de: 'weit entfernt', ex: 'My grandma lives [far away].', tip: 'It takes eight hours by car to visit her.' },
          { en: 'space', de: 'Platz', ex: "There isn't enough [space] in my room.", tip: "My bed, my desk and my wardrobe – I can't move!" },
          { en: 'pet', de: 'Haustier', ex: 'Have you got a [pet]?', tip: 'A dog, a cat or a hamster at home?' },
          { en: 'outdoor activity', de: 'Freiluftaktivität', ex: 'Hiking is my favourite [outdoor activity].', tip: 'I love walking in the mountains in the fresh air.' },
        ],
      },
      {
        section: 'Unit 1 – Station 2 (bis „to fix“)',
        items: [
          { en: 'youth', de: 'Jugend', ex: 'My grandpa often talks about his [youth].', tip: 'When he was a teenager, many years ago …' },
          { en: 'close', de: 'nahe', ex: 'Our school is [close] to the park.', tip: 'We can walk there in two minutes.' },
          { en: 'almost', de: 'fast; beinahe', ex: "It's [almost] eight o'clock!", tip: "It's 7:58 – we're late!" },
          { en: 'judge', de: 'Juror/-in; Richter/-in', ex: 'The [judges] liked her song.', tip: 'On the TV show, three people give points to the singers.' },
          { en: 'point', de: 'Punkt; Komma (bei Zahlenangaben)', ex: 'Our team got ten [points].', tip: 'The scoreboard says: Red team 10 – Blue team 8.' },
          { en: 'second', de: 'Sekunde', ex: 'Wait a [second]!', tip: 'Not a minute – just one tick of the clock!' },
          { en: 'turn', de: 'Wendung; Drehung', ex: 'The horse made a fast [turn].', tip: 'It ran straight, then suddenly went left!' },
          { en: 'poor', de: 'arm', ex: 'The [poor] dog is wet and cold.', tip: "Oh, look at him! He has no home and it's raining. I feel sorry for him." },
          { en: 'to get', de: 'werden', ex: 'I always [get] tired after school.', tip: "After school I'm always sleepy." },
          { en: 'to fall off', de: 'herunterfallen; hinunterfallen', ex: "Be careful, don't [fall off] your bike!", tip: 'Ouch! The bike stops and you land on the street.' },
          { en: 'mad', de: 'verrückt; wütend', ex: 'Dad was [mad] because I was late.', tip: 'His face went red and he shouted at me.' },
          { en: 'What a shame!', de: 'Wie schade!', ex: "You can't come? [What a shame!]", tip: "Oh no, I'm sad you won't be at my party." },
          { en: 'to train', de: 'trainieren', ex: 'Our team [trains] every Tuesday.', tip: 'Every Tuesday the players run and play together to get better.' },
          { en: 'to fix', de: 'reparieren; befestigen', ex: 'Can you [fix] my bike, please?', tip: 'My bike is broken. Can you make it work again?' },
        ],
      },
    ],
  },
  {
    exam: 'en6-u1',
    added: '2026-10-12',
    sections: [
      {
        // Vokabelheft, Eintrag vom 12.10. – die Wörter nach „to fix“.
        section: 'Unit 1 – Heft 12.10.',
        items: [
          { en: 'positive', de: 'positiv', ex: 'Her answer was [positive].', tip: "She said: 'Yes! Great idea!'" },
          { en: 'negative', de: 'negativ; verneint', ex: "Don't be so [negative], we can win!", tip: "Stop saying 'We can't! We'll lose!'" },
          { en: 'up', de: 'hinauf; (nach) oben', ex: 'The cat ran [up] the tree.', tip: 'The dog was barking, so the cat climbed to the top.' },
          { en: 'watch', de: 'Armbanduhr', ex: 'My new [watch] was a present from my grandma.', tip: "Now I always know the time – it's on my arm!" },
          { en: 'to be interested (in)', de: 'interessiert sein (an); sich interessieren (für)', alt: ['to be interested in'], say: 'to be interested in', ex: 'Are you [interested] in horses?', tip: 'Do you like reading about horses and watching them?' },
          { en: 'I see.', de: 'Ich verstehe; Aha; Ach so!', ex: 'Oh, [I see]! Now I understand.', tip: "Ah, OK – now it's clear!" },
          { en: 'I mean', de: 'ich meine', ex: '[I mean], he is really nice.', tip: 'Let me say it again in other words …' },
          { en: 'both', de: 'beide', ex: '[Both] of my brothers play football.', tip: 'My two brothers: Tom plays football, and Sam plays too.' },
        ],
      },
    ],
  },
  {
    exam: 'en6-u1',
    added: '2026-10-16',
    sections: [
      {
        // Buch S. 199 (Fotos vom 16.10.), vom Nutzer geprüft; zusätzliche Antworten mit ihm abgestimmt.
        section: 'Unit 1 – Skills: How to use a dictionary',
        items: [
          { en: 'electronic', de: 'elektronisch', ex: 'My little sister has an [electronic] toy that can talk.', tip: 'It has batteries and buttons.' },
          { en: 'search', de: 'Suche; Such-', ex: 'Use the [search] button to find the song.', tip: 'Type the name and the app finds it for you.' },
          { en: 'to look up', de: 'nachschlagen; nachschauen', ex: "Can you [look up] the word 'yearbook' for me?", tip: 'Open the dictionary and find the word.' },
          { en: 'meaning', de: 'Bedeutung; Sinn', ex: 'Do you know the [meaning] of this word?', tip: 'What does this word say in German?' },
          { en: 'time', de: 'Mal', altDe: ['Zeit'], ex: 'We went to London two [times] last year.', tip: 'We went in May and again in August.' },
        ],
      },
      {
        section: 'Unit 1 – Story: What a wonderful world',
        items: [
          { en: 'wonderful', de: 'wunderbar', ex: 'We had a [wonderful] day at the beach.', tip: 'Sun, sea, ice cream – it was perfect!' },
          { en: 'news (sg)', de: 'Nachricht(en); Neuigkeit(en)', altDe: ['Nachrichten', 'Neuigkeiten'], ex: 'Have you heard the [news]? We have a new teacher!', tip: "Guess what? Everybody's talking about it!" },
          { en: 'competition', de: 'Wettbewerb; Turnier', ex: 'Emma won the dance [competition].', tip: 'Twenty girls danced, and Emma got first prize.' },
          { en: 'title', de: 'Titel; Überschrift', ex: 'What is the [title] of your favourite book?', tip: "It's on the cover, in big letters: 'Harry Potter and the …'" },
          { en: 'to feel', de: 'sich anfühlen', altDe: ['anfühlen', 'fühlen', 'sich fühlen'], ex: 'The water [feels] cold today.', tip: 'Put your hand in the lake – brrr!' },
          { en: 'to share', de: 'teilen', ex: 'My brother and I [share] a room.', tip: "There's one room, but two beds – one for me and one for him." },
          { en: 'to enter', de: 'hineingehen; betreten; eintreten; hier: mitmachen', altDe: ['mitmachen'], ex: 'Are you going to [enter] the competition?', tip: 'Will you put your name on the list and join?' },
          { en: 'to be surprised', de: 'überrascht sein', altDe: ['überrascht'], ex: 'Mum was very [surprised] about her birthday party.', tip: "She didn't know about it – all her friends jumped out and shouted 'Happy birthday!'" },
          { en: 'himself', de: 'er/sich (selbst); selber', altDe: ['er selbst', 'sich selbst', 'selbst'], ex: 'Max made the cake all by [himself].', tip: 'Nobody helped him – not Mum, not Dad.' },
          { en: 'dirty', de: 'dreckig; schmutzig', ex: 'Take off your [dirty] shoes, please!', tip: 'You walked in the mud!' },
          { en: 'flower', de: 'Blume', ex: 'Grandpa has lots of [flowers] in his garden.', tip: 'Roses, tulips and daisies.' },
          { en: 'to notice', de: 'bemerken; wahrnehmen', ex: 'Nobody [noticed] the cat under the table.', tip: 'The cat was very quiet, so nobody saw it.' },
          { en: 'drawing', de: 'Zeichnung', ex: 'Your [drawing] of the horse is really good!', tip: 'You made it with a pencil, and it looks just like the horse!' },
          { en: 'could', de: 'konnte/-n; könnte/-n', ex: 'When I was four, I [could] already ride a bike.', tip: 'I learnt to ride a bike very early – at four!' },
          { en: 'confident', de: 'selbstsicher; selbstbewusst', ex: 'Lena is always [confident] before a test.', tip: 'She has learnt everything and she knows she can do it.' },
          { en: 'moment', de: 'Moment; Augenblick', ex: 'Can you wait a [moment]? I need my jacket.', tip: "I'm just getting my jacket – I'll be really quick!" },
        ],
      },
    ],
  },
  {
    // Stoffplan der Schulaufgabe am 26.10.2026: S. 195–201 („embarrassing“ bis „fishing“) inklusive der
    // grünen Kästen. Buch S. 200–201 (Fotos vom 19.10.) + Kasten „American English“ (S. 196, Scan vom 11.10.).
    exam: 'en6-u1',
    added: '2026-10-19',
    sections: [
      {
        section: 'Unit 1 – Story: What a wonderful world (S. 200)',
        items: [
          { en: 'brilliant', de: 'toll; prima; leuchtend', ex: 'Your idea is [brilliant]!', tip: "Wow, that's the best idea ever!" },
          { en: 'to leave', de: 'lassen; verlassen; abfahren; losgehen', ex: "Our bus [leaves] at eight o'clock.", tip: "At 8:00 the bus goes from the bus stop – don't be late!" },
          { en: 'quickly', de: 'schnell', ex: 'Come here [quickly]!', tip: 'Run! Hurry up!' },
          { en: 'eye', de: 'Auge', ex: 'Close your [eyes] and listen.', tip: "Don't look – just listen!" },
          { en: 'bee', de: 'Biene', ex: 'A [bee] is sitting on the flower.', tip: 'Buzz, buzz! It makes honey.' },
          { en: 'clever', de: 'schlau; klug', ex: 'My little sister is very [clever].', tip: "She can read at three and she's great at maths." },
          { en: 'amazing', de: 'unglaublich; toll; erstaunlich', ex: 'The view from the hill is [amazing]!', tip: 'You can see the whole town and the sea from up there – wow!' },
          { en: 'finished', de: 'fertig', ex: 'Are you [finished] with your homework?', tip: 'Is it all done? Can we go out and play now?' },
          { en: 'shocked', de: 'schockiert; geschockt', ex: 'We were [shocked] when we saw the accident.', tip: 'Two cars crashed right in front of us!' },
          { en: 'to steal', de: 'stehlen', ex: 'Did that boy [steal] your phone?', tip: "He took it and ran away – it isn't his!" },
          { en: 'to calm down', de: 'sich beruhigen', altDe: ['beruhigen'], ex: "Please [calm down], it's only a game!", tip: 'Take a deep breath and relax – no shouting!' },
          { en: 'to push', de: 'stoßen; schieben; schubsen', ex: "Don't [push] me!", tip: 'Stop it! I almost fell over!' },
          { en: 'to turn (a)round', de: '(sich) umdrehen; wenden', alt: ['to turn around'], say: 'to turn around', ex: 'Emily [turned around|turned round] when she heard her name.', tip: "Someone called 'Emily!' behind her." },
          { en: 'fight', de: 'Kampf; Streit', ex: 'The two brothers had a [fight] about the TV.', tip: 'They both wanted the remote control, and they shouted at each other.' },
          { en: 'upset', de: 'aufgebracht; bestürzt', ex: 'Lisa is [upset] because she lost her cat.', tip: "She's crying and she's very sad." },
          { en: 'idiot', de: 'Idiot/-in', ex: "Don't call your brother an [idiot]!", tip: "That's rude! He isn't stupid!" },
          { en: 'should', de: 'sollte; solltest; sollten; solltet', minAnswers: 1, ex: 'You [should] go to bed early tonight.', tip: "It's a good idea – tomorrow is a school day!" },
          { en: 'each other', de: 'einander; sich; sich gegenseitig', ex: 'Tom and Max help [each other] with their homework.', tip: 'Tom helps Max, and Max helps Tom.' },
          { en: 'to take out', de: 'herausnehmen', ex: 'Can you [take out] the milk, please?', tip: "Open the fridge – it's on the top shelf." },
          { en: 'paper', de: 'Papier', ex: 'I need a piece of [paper] for my drawing.', tip: 'My pencils are ready – but what do I draw on?' },
          { en: 'ready', de: 'fertig; bereit', ex: "Are you [ready]? Let's go!", tip: 'Have you got your shoes and your jacket on?' },
          { en: 'beginning', de: 'Anfang; Beginn', ex: "I didn't see the [beginning] of the movie.", tip: 'I was late, so I missed the first ten minutes.' },
          { en: 'related', de: 'verwandt; bezogen', ex: "The words 'teach' and 'teacher' are [related].", tip: "They're in the same word family." },
          { en: 'strong', de: 'stark', ex: 'My dad is very [strong].', tip: 'He can carry the heavy sofa on his own!' },
          { en: 'drama', de: 'Theater; Drama', ex: 'We have [drama] club after school.', tip: 'We act in plays on a stage.' },
          { en: 'to hate', de: 'hassen; nicht mögen', ex: 'I [hate] rainy days!', tip: "I really don't like them – grey skies and wet shoes, yuck!" },
        ],
      },
      {
        // Grüner Kasten „Feelings and reactions“ (S. 201) – nervous, embarrassed, surprised, upset, shocked sind schon drin.
        section: 'Unit 1 – Kasten: Feelings and reactions',
        items: [
          { en: 'excited', de: 'aufgeregt', ex: "I'm so [excited] about my birthday!", tip: "Only two more days – I can't wait!" },
          { en: 'angry', de: 'verärgert', altDe: ['wütend', 'sauer'], ex: "Dad is [angry] because I'm late again.", tip: "He's shouting: 'Late again?!'" },
          { en: 'in a good mood', de: 'guter Laune', altDe: ['gute Laune', 'gut gelaunt'], ex: 'Grandma is always [in a good mood].', tip: "She's always smiling and singing." },
          { en: 'in a bad mood', de: 'schlechter Laune', altDe: ['schlechte Laune', 'schlecht gelaunt'], ex: "Leave me alone, I'm [in a bad mood]!", tip: "Everything is terrible today, and I don't want to talk!" },
        ],
      },
      {
        section: 'Unit 1 – Check-out',
        items: [{ en: 'fishing', de: 'Angeln; Fischen; Fischerei', ex: 'My grandpa often goes [fishing] at the lake.', tip: 'He sits by the water with a rod and waits for a bite.' }],
      },
      {
        // Grüner Kasten „American English“ (S. 196): movie, movie theater, mall und hometown sind schon drin.
        // Karte = amerikanisches Wort; das britische Wort zählt beim Schreiben auf Englisch auch.
        section: 'Unit 1 – Kasten: American English',
        items: [
          { en: 'fall (AE)', de: 'Herbst', alt: ['autumn'], ex: 'My birthday is in [fall].', tip: "The leaves are red and brown – it's September or October." },
          { en: 'trash (AE)', de: 'Müll', alt: ['rubbish'], ex: 'Can you take out the [trash], please?', tip: 'Banana peels, empty bottles and old paper – out to the bin!' },
          { en: 'Math (AE)', de: 'Mathe', alt: ['Maths'], ex: 'We have [Math] on Monday and Friday.', tip: 'Numbers and sums: 2 + 2 = 4!' },
          { en: 'program (AE)', de: 'Programm; Sendung', alt: ['programme'], ex: "What's your favorite TV [program]?", tip: 'Do you like cartoons or quiz shows on TV?' },
          { en: 'dialog (AE)', de: 'Dialog', alt: ['dialogue'], ex: 'Read the [dialog] with a partner.', tip: 'Two people are talking: A says something, B answers.' },
          { en: 'organize (AE)', de: 'organisieren', alt: ['organise'], ex: "Let's [organize] a party for Emily!", tip: 'We need music, food and invitations – who does it all?' },
          { en: 'practice (AE)', de: 'üben; trainieren', alt: ['practise'], ex: 'I [practice] the piano every day.', tip: '30 minutes every day, so I get better and better.' },
          { en: 'not anymore (AE)', de: 'nicht mehr', alt: ['not any more'], ex: "We don't live in Berlin [anymore|any more].", tip: 'We lived there before, but now we live in Munich.' },
          { en: 'meter (AE)', de: 'Meter', alt: ['metre'], ex: 'The tree is ten [meters|metres] tall.', tip: "It's as tall as a house with three floors." },
        ],
      },
    ],
  },
];

function slug(s) {
  return s
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40);
}

// Beispielsatz `ex`: Die Lücke für den Lückentext steht in [eckigen Klammern], Alternativen mit |:
//   'Our ball [ended up] in the river.'  ·  'Malabar est un chien de la [S.P.A.|SPA]'
const GAP = /\[([^\]]+)\]/;

/** Beispielsatz zum Vorlesen (ohne Klammern und Alternativen). */
export function exampleText(entry) {
  return (entry.ex || '').replace(/\[([^\]|]*)(\|[^\]]*)?\]/g, '$1');
}

/** Lückentext aus dem Beispielsatz: { sentence: '… ___ …', answer, alternatives } oder null. */
export function gapOf(entry) {
  const m = (entry.ex || '').match(GAP);
  if (!m) return null;
  const [answer, ...alternatives] = m[1].split('|');
  return { sentence: entry.ex.replace(GAP, '___').replace(/\[([^\]|]*)(\|[^\]]*)?\]/g, '$1'), answer, alternatives };
}

// Was gesprochen wird: ohne Hinweise in Klammern und ohne „…“.
export function speechText(entry) {
  if (entry.say) return entry.say;
  return entry.en.replace(/\([^)]*\)/g, '').replace(/…/g, '').replace(/\s+/g, ' ').trim();
}

export const EN6_VOCAB = BATCHES.flatMap((batch) =>
  batch.sections.flatMap((sec) =>
    sec.items.map((item) => ({
      ...item,
      id: `en6_${slug(item.en)}`,
      exam: batch.exam,
      added: batch.added,
      section: sec.section,
    })),
  ),
);

// Doppelte IDs würden Lernhistorie und Audio vermischen → sofort laut scheitern.
const seen = new Set();
for (const v of EN6_VOCAB) {
  if (seen.has(v.id)) throw new Error(`Doppelte Vokabel-ID: ${v.id}`);
  seen.add(v.id);
}
