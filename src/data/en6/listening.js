// Englisch Klasse 6 – Hörverstehen (Wunsch des Nutzers, 2026-10-25): Teil der Schulaufgabe sind längere
// Listening-Aufgaben. Erst wird der Text vorgelesen, danach kommen die Fragen – nach dem Muster des
// Arbeitsblatts der Klasse (Right or wrong? · Complete the grid · Tick all the correct answers · Answer the
// questions). Texte und Fragen selbst formuliert, mit dem Wortschatz und der Grammatik von Unit 1.
// Diese Datei hat KEINE Importe: scripts/export-audio-manifest.mjs liest sie direkt mit Node (Audio als Dialog
// mit zwei Stimmen, siehe scripts/generate-audio.py, Art „listening“).

export const LISTENING_COURSE = 'en-6';

// Stimmen wie beim Wortschatz (vom Nutzer freigegeben): bf_emma, bm_george.
const TASKS = [
  {
    id: 'en6-l1',
    exam: 'en6-u1',
    title: "Sophie's first week",
    situation:
      'Sophie ist mit ihrer Familie von Chicago in eine kleine Stadt gezogen. Am Telefon erzählt sie ihrem Opa ' +
      'von ihrer ersten Woche an der neuen Schule.',
    speakers: { Grandpa: 'bm_george', Sophie: 'bf_emma' },
    lines: [
      ['Grandpa', "Hi Sophie, it's Grandpa! How was your first week at your new school?"],
      ['Sophie', "Hi Grandpa! It was OK, I think. On Monday I was really nervous. I didn't know anybody, and the school is huge!"],
      ['Grandpa', "I see. And what about the town? It's very different from Chicago, isn't it?"],
      ['Sophie', "Yes, it is! It's so quiet here. There's no noise, and there are no traffic jams. But everything is far away. The next mall is forty minutes by car, and the bus only comes once an hour."],
      ['Grandpa', "Oh, that's not great. Do you have any friends yet?"],
      ['Sophie', "Yes! There's a girl in my class. Her name is Ava. She's in a wheelchair, but she can ride a horse. And she's going to teach me!"],
      ['Grandpa', "Wow, that's amazing. Does she live close to you?"],
      ['Sophie', 'Yes, her family has a farm just five minutes from our house. They have three horses, two dogs and a lot of cats.'],
      ['Grandpa', 'And what about the other kids in your class?'],
      ['Sophie', 'Most of them are really nice. But on Tuesday a boy teased me because of my accent. I was so upset.'],
      ['Grandpa', 'Oh no! What did you do?'],
      ['Sophie', "Ava told him to stop, and our teacher, Mr Brown, talked to him. On Thursday he said sorry. Now we're actually friends."],
      ['Grandpa', "That's good news. So what are you going to do this weekend?"],
      ['Sophie', 'On Saturday Ava and I are going to watch a barrel race. Her big sister is in the competition. And on Sunday Dad is going to take me fishing at the lake.'],
      ['Grandpa', "That sounds wonderful. I'm proud of you, Sophie."],
      ['Sophie', 'Thanks, Grandpa! I miss you. Can you visit us in the fall?'],
      ['Grandpa', 'Of course I can. See you soon, Sophie!'],
    ],
    questions: [
      { kind: 'rw', text: 'Sophie was nervous on her first day.', right: true },
      { kind: 'rw', text: "Sophie's new school is very small.", right: false, why: 'Wrong – the school is huge.' },
      { kind: 'rw', text: 'The bus comes once an hour.', right: true },
      { kind: 'rw', text: 'Ava lives far away from Sophie.', right: false, why: "Wrong – Ava's farm is only five minutes from Sophie's house." },
      { kind: 'grid', text: 'The next mall: ___ minutes by car', answer: 'forty', alt: ['40'] },
      { kind: 'grid', text: "Animals on Ava's farm: three horses, two dogs and a lot of ___", answer: 'cats' },
      { kind: 'grid', text: "Sophie's teacher: Mr. ___", answer: 'Brown' },
      {
        kind: 'tick',
        text: 'What happened at school?',
        options: [
          ['A boy teased Sophie because of her accent.', true],
          ['Ava told the boy to stop.', true],
          ["Sophie's dad talked to the boy.", false],
          ['The boy said sorry on Thursday.', true],
          ['Sophie and the boy had a fight.', false],
        ],
      },
      { kind: 'answer', text: 'How did Sophie feel when the boy teased her?', answer: 'She was upset.', keywords: [['upset', 'sad', 'unhappy', 'angry']] },
      { kind: 'answer', text: 'What are Sophie and Ava going to do on Saturday?', answer: 'They are going to watch a barrel race.', keywords: [['barrel race', 'race']] },
      { kind: 'answer', text: 'When is Grandpa going to visit Sophie?', answer: 'In the fall.', keywords: [['fall', 'autumn']] },
      {
        kind: 'long',
        text: 'How is the new town different from Chicago?',
        answer: "It's very quiet – there's no noise and there are no traffic jams. But everything is far away, and the bus only comes once an hour.",
        keywords: [['quiet', 'noise', 'noisy', 'traffic', 'traffic jams'], ['far', 'far away', 'bus', 'mall', 'car']],
        minWords: 8,
      },
    ],
  },
  {
    id: 'en6-l2',
    exam: 'en6-u1',
    // Ausgemustert 2026-10-25: zu nah an den Mediationsaufgaben (Nutzer). Nur noch für alte Antworten im Lehrer-Bereich.
    retired: true,
    title: 'The talent show',
    situation:
      'Hannah und Max gehen in die 6. Klasse. Am Freitag ist die Talentshow ihrer Schule. Die beiden unterhalten ' +
      'sich in der Pause.',
    speakers: { Hannah: 'bf_emma', Max: 'bm_george' },
    lines: [
      ['Hannah', 'Max, are you ready for the talent show on Friday?'],
      ['Max', "Not really. I'm so nervous! What if I fall off the stage again?"],
      ['Hannah', 'Again? What happened?'],
      ['Max', "At the rehearsal yesterday I was dancing, and I didn't see the end of the stage. So I fell off! Everybody laughed. It was so embarrassing."],
      ['Hannah', 'Oh no! Did you hurt yourself?'],
      ['Max', "No, I was OK. But now I don't want to dance alone."],
      ['Hannah', "Then let's do it together! I can sing and you can dance. We could practise every day after school."],
      ['Max', "That's a brilliant idea! But we only have four days."],
      ['Hannah', "That's enough time. Mrs Clark from the drama club is going to help us. She says we can use the music room."],
      ['Max', 'Great. Who are the judges this year?'],
      ['Hannah', 'There are three judges: Mrs Clark, the principal and a girl from Year 9. They give points for every act, and the winner gets a prize.'],
      ['Max', "What's the prize?"],
      ['Hannah', 'Two tickets for the movie theater in town.'],
      ['Max', 'Cool! And how many acts are there?'],
      ['Hannah', "Twelve. There's a boy who does magic tricks, two girls who tell jokes, and Lena. She's going to draw a picture on stage in only three minutes."],
      ['Max', "Wow, that's amazing. OK, what song are we going to do?"],
      ['Hannah', 'What about "Happy Days"? Everybody knows it, and it isn\'t too difficult.'],
      ['Max', "Perfect. Let's meet in the music room at four o'clock, OK?"],
      ['Hannah', "OK! And Max – don't worry. You're going to be great!"],
    ],
    questions: [
      { kind: 'rw', text: 'Max fell off the stage at the rehearsal.', right: true },
      { kind: 'rw', text: 'After Max fell, everybody helped him.', right: false, why: 'Wrong – everybody laughed.' },
      { kind: 'rw', text: 'Hannah and Max are going to perform together.', right: true },
      { kind: 'rw', text: 'The talent show is on Thursday.', right: false, why: 'Wrong – the talent show is on Friday.' },
      { kind: 'grid', text: 'Number of judges: ___', answer: 'three', alt: ['3'] },
      { kind: 'grid', text: 'The prize: two tickets for the ___', answer: 'movie theater', alt: ['cinema', 'movie theatre', 'movies'] },
      { kind: 'grid', text: 'Where Hannah and Max are going to practise: in the ___', answer: 'music room' },
      {
        kind: 'tick',
        text: 'Which acts are in the show?',
        options: [
          ['a boy who does magic tricks', true],
          ['two girls who tell jokes', true],
          ['a girl who draws a picture on stage', true],
          ['a band from Year 9', false],
          ['a teacher who sings a song', false],
        ],
      },
      {
        kind: 'answer',
        text: "Why doesn't Max want to dance alone?",
        answer: 'Because he fell off the stage.',
        keywords: [['fell', 'fall', 'falls', 'laughed', 'laugh', 'embarrassed', 'embarrassing']],
      },
      { kind: 'answer', text: 'Who is going to help Hannah and Max?', answer: 'Mrs. Clark', keywords: [['clark']] },
      { kind: 'answer', text: 'When are Hannah and Max going to meet?', answer: "At four o'clock.", keywords: [['four', '4']] },
    ],
  },
  {
    id: 'en6-l3',
    exam: 'en6-u1',
    // Ausgemustert 2026-10-25: zu nah an den Mediationsaufgaben (Nutzer). Nur noch für alte Antworten im Lehrer-Bereich.
    retired: true,
    title: 'A Saturday at the lake',
    situation: 'Tom erzählt von einem Samstag, an dem er mit seinem Vater und seiner Schwester Lucy angeln war.',
    speakers: { Tom: 'bm_george', Lucy: 'bf_emma' },
    lines: [
      ['Tom', 'Last Saturday my dad, my sister Lucy and I went fishing at Pine Lake. We left the house at six o\'clock in the morning, so Lucy was in a really bad mood.'],
      ['Lucy', 'Why do we always have to get up so early? I hate fishing!'],
      ['Tom', "Because the fish are hungry in the morning. Come on, it's going to be fun!"],
      ['Tom', 'The lake was beautiful. The air was cold, and there was nobody there. After an hour Dad pointed at a big bird in a tree.'],
      ['Lucy', 'Look! Is that an eagle?'],
      ['Tom', "Yes, it is! Wow, it's huge!"],
      ['Tom', "Lucy wanted to take a photo, but she couldn't find her phone."],
      ['Lucy', "Tom, you took my phone, didn't you?"],
      ['Tom', "No, I didn't! I don't have your phone."],
      ['Lucy', "You always take my things! You're such an idiot!"],
      ['Tom', "She was really angry, and she pushed me. Then Dad said we should calm down and look for the phone together. We looked in the car and under the bench. Then Dad noticed something in the pocket of Lucy's dirty jacket."],
      ['Lucy', "Oh no … it's in my pocket. I'm sorry, Tom."],
      ['Tom', "That's OK."],
      ['Tom', "In the end we were both happy. I caught three fish, and Lucy took a lot of photos of the eagle. Next weekend we're going to go to the lake again – and this time Lucy wants to bring her friend Mia."],
    ],
    questions: [
      { kind: 'rw', text: 'They went fishing on Sunday.', right: false, why: 'Wrong – they went fishing on Saturday.' },
      { kind: 'rw', text: 'Lucy was in a bad mood because they left very early.', right: true },
      { kind: 'rw', text: 'There were a lot of people at the lake.', right: false, why: 'Wrong – there was nobody there.' },
      { kind: 'rw', text: 'Dad saw the eagle first.', right: true },
      { kind: 'grid', text: "They left the house at ___ o'clock.", answer: 'six', alt: ['6'] },
      { kind: 'grid', text: 'They looked for the phone in the car and under the ___', answer: 'bench' },
      { kind: 'grid', text: 'Number of fish Tom caught: ___', answer: 'three', alt: ['3'] },
      {
        kind: 'tick',
        text: 'What happened?',
        options: [
          ['Lucy thought that Tom took her phone.', true],
          ['Lucy pushed Tom.', true],
          ['Tom called Lucy an idiot.', false],
          ["The phone was in Lucy's jacket.", true],
          ['Dad was angry with Tom.', false],
        ],
      },
      { kind: 'answer', text: "Why couldn't Lucy take a photo of the eagle at first?", answer: "She couldn't find her phone.", keywords: [['phone']] },
      { kind: 'answer', text: 'What did Dad say?', answer: 'They should calm down and look for the phone together.', keywords: [['calm', 'look']] },
      { kind: 'answer', text: 'What are Tom and Lucy going to do next weekend?', answer: 'They are going to go to the lake again.', keywords: [['lake', 'fishing', 'fish']] },
    ],
  },
  {
    // Baut auf Mediation 1 auf (Talentshow → geplanter Film für die Partnerschule), keine Wiederholung.
    id: 'en6-l4',
    exam: 'en6-u1',
    title: 'The movie for Minneapolis',
    situation:
      'Nach der Talentshow drehen Mia und Noah aus der 6b einen kurzen Film für die Partnerschule in Minneapolis. ' +
      'In der Pause besprechen sie, was noch fehlt.',
    speakers: { Mia: 'bf_emma', Noah: 'bm_george' },
    lines: [
      ['Mia', 'Noah, how much of our movie is finished?'],
      ['Noah', "About half of it. We've got the songs from the talent show and the interview with our principal."],
      ['Mia', "Great. And what about Lena? She won the competition, so she should be in the movie, shouldn't she?"],
      ['Noah', "Yes, but she's really shy. When I asked her yesterday, she said no. She doesn't like cameras."],
      ['Mia', "What a shame! Maybe she could just sing, and we don't film her face. We could film her hands on the piano."],
      ['Noah', "That's a brilliant idea. I'm going to ask her again at lunch."],
      ['Mia', "OK. But there's another problem. The camera isn't working. The battery is old, and it always stops after five minutes."],
      ['Noah', 'My uncle can fix it. He works in an electronics shop.'],
      ['Mia', 'Cool. And we need a title for the movie. Any ideas?'],
      ['Noah', 'What about "A Day at Our School"?'],
      ['Mia', 'Hmm, that\'s a bit boring. What about "Hello from Germany"?'],
      ['Noah', 'I like that! The kids in Minneapolis are going to understand it at once.'],
      ['Mia', 'And we have to be quick. Mrs Weber wants to send the movie before the Christmas holidays.'],
      ['Noah', "That's in three weeks. No problem. Let's meet on Saturday and work on it together."],
      ['Mia', 'Saturday is bad. I have a drama rehearsal in the morning. Can we meet on Sunday afternoon?'],
      ['Noah', "Sure. Come to my house at two o'clock. My mum is going to make pizza."],
      ['Mia', "Perfect! I'm so excited. I hope they like it in Minneapolis."],
    ],
    questions: [
      { kind: 'rw', text: 'About half of the movie is finished.', right: true },
      { kind: 'rw', text: 'Lena wants to be in the movie.', right: false, why: "Wrong – she said no. She doesn't like cameras." },
      { kind: 'rw', text: 'The camera always stops after ten minutes.', right: false, why: 'Wrong – it stops after five minutes.' },
      { kind: 'rw', text: "Noah's uncle works in an electronics shop.", right: true },
      { kind: 'grid', text: 'Title of the movie: "___"', answer: 'Hello from Germany', alt: ['Hello from Germany!'] },
      { kind: 'grid', text: 'They have to send the movie before the ___ holidays.', answer: 'Christmas' },
      { kind: 'grid', text: "Mia and Noah meet on Sunday at ___ o'clock.", answer: 'two', alt: ['2'] },
      {
        kind: 'tick',
        text: 'What is already in the movie?',
        options: [
          ['the songs from the talent show', true],
          ['an interview with the principal', true],
          ['an interview with Lena', false],
          ['a song by Lena', false],
          ['photos of Minneapolis', false],
        ],
      },
      { kind: 'answer', text: "Why can't Mia meet on Saturday?", answer: 'She has a drama rehearsal.', keywords: [['drama', 'rehearsal']] },
      {
        kind: 'long',
        text: "What is Mia's idea for Lena?",
        answer: "Lena could just sing, and they don't film her face. They could film her hands on the piano.",
        keywords: [['sing', 'sings', 'singing', 'song', 'songs'], ['hand', 'hands', 'piano', 'face']],
        minWords: 6,
      },
      {
        kind: 'long',
        text: 'What is the problem with the camera, and who can help?',
        answer: "The battery is old, so the camera always stops after five minutes. Noah's uncle can fix it.",
        keywords: [['battery', 'stop', 'stops', 'stopped', 'old', 'five minutes', '5 minutes'], ['uncle', 'fix', 'fixes', 'repair']],
        minWords: 8,
      },
    ],
  },
  {
    // Baut auf Mediation 2 auf (Austausch nach Iowa → Gegenbesuch in Deutschland), keine Wiederholung.
    id: 'en6-l5',
    exam: 'en6-u1',
    title: "Kayla's visit",
    situation:
      'Kayla aus Decorah in Iowa kommt im Herbst mit ihrer Klasse nach Deutschland und wohnt dann bei Lukas und seiner ' +
      'Familie. Die beiden telefonieren per Video.',
    speakers: { Lukas: 'bm_george', Kayla: 'bf_emma' },
    lines: [
      ['Lukas', 'Hi Kayla! Can you hear me?'],
      ['Kayla', "Yes, I can! Hi Lukas! I've got great news. My mom says I can stay with your family for two weeks!"],
      ['Lukas', "That's wonderful! When are you going to arrive?"],
      ['Kayla', 'On October the third. Our plane lands in Munich at seven in the morning.'],
      ['Lukas', "Great. My dad and I are going to pick you up at the airport. Our house is close to the airport, so it's only twenty minutes by car."],
      ['Kayla', "Cool. Actually, I'm a bit worried about my wheelchair. Is your school OK for me?"],
      ['Lukas', "Yes, don't worry. There's a lift, and our classroom is on the ground floor."],
      ['Kayla', 'And what about your town? Is there a lot of traffic?'],
      ['Lukas', "In the morning, yes. There are always traffic jams. But we can take the tram. The trams here are really good, and they're cheap."],
      ['Kayla', "A tram! We don't have trams in Decorah.", "A tram! We don't have trams in de Cora."], // Betonung auf „co“
      ['Lukas', 'And there\'s a big mall in the city center with a movie theater. We could watch a movie there on Saturday.'],
      ['Kayla', 'Sounds great. What should I bring? Is it cold in October?'],
      ['Lukas', "Sometimes. Bring a warm jacket. We're going to visit a castle with my class. Don't worry, there's a path for wheelchairs."],
      // Gesprochen „Danka“: Kokoro liest „Danke“ sonst englisch ohne Schluss-e („dank“).
      ['Kayla', 'Awesome! Oh, and one more thing. My German is really bad. I only know "Hallo" and "Danke".',
        'Awesome! Oh, and one more thing. My German is really bad. I only know "Hallo" and "Danka".'],
      ['Lukas', "That's OK. My English isn't perfect either. We can help each other."],
      ['Kayla', "Deal! I'm so excited. See you in October!"],
      ['Lukas', 'See you, Kayla!'],
    ],
    questions: [
      { kind: 'rw', text: "Kayla is going to stay with Lukas's family for two weeks.", right: true },
      { kind: 'rw', text: "Kayla's plane lands in Frankfurt.", right: false, why: 'Wrong – it lands in Munich.' },
      { kind: 'rw', text: "Lukas's classroom is on the ground floor.", right: true },
      { kind: 'rw', text: "The trams in Lukas's town are expensive.", right: false, why: "Wrong – they're cheap." },
      { kind: 'grid', text: 'From the airport to Lukas\'s house: ___ minutes by car', answer: 'twenty', alt: ['20'] },
      { kind: 'grid', text: 'Kayla arrives on October ___.', answer: 'the third', alt: ['third', '3rd', '3', 'the 3rd'] },
      { kind: 'grid', text: 'Kayla knows two German words: "Hallo" and "___"', answer: 'Danke' },
      {
        kind: 'tick',
        text: 'What are Kayla and Lukas going to do or could they do?',
        options: [
          ['take the tram', true],
          ['watch a movie at the mall', true],
          ['visit a castle with the class', true],
          ['go skiing in the mountains', false],
          ['visit a farm in Germany', false],
        ],
      },
      { kind: 'answer', text: 'Who is going to pick Kayla up at the airport?', answer: 'Lukas and his dad.', keywords: [['dad', 'father']] },
      {
        kind: 'long',
        text: 'Why is Kayla a bit worried, and what does Lukas say?',
        answer: "She is worried about her wheelchair. Lukas says there's a lift and the classroom is on the ground floor.",
        keywords: [['wheelchair'], ['lift', 'elevator', 'ground floor', 'path', 'worry', 'ok', 'okay', 'fine']],
        minWords: 8,
      },
      {
        kind: 'long',
        text: 'How can Kayla and Lukas help each other?',
        answer: "Kayla's German is bad and Lukas's English isn't perfect, so they can help each other with the languages.",
        keywords: [['german', 'english', 'language', 'languages']],
        minWords: 5,
      },
    ],
  },
];

const SECTIONS = {
  rw: 'Right or wrong?',
  grid: 'Complete the grid.',
  tick: 'Tick all the correct answers.',
  answer: "Answer the questions. You needn't write complete sentences.",
  long: 'Answer the questions in one or two sentences.',
};

/** Text zum Mitlesen (Lehrer-Bereich, Ersatzstimme) – mit Sprechernamen. */
export function listeningText(task) {
  return task.lines.map(([who, text]) => `${who}: ${text}`).join('\n');
}

/** Abschnitte fürs Audio: jede Zeile mit der Stimme ihres Sprechers. Optional 3. Eintrag = gesprochene Fassung
 *  (Schreibweise nur für die Aussprache, z. B. „Danka“ statt „Danke“). */
export function listeningSegments(task) {
  return task.lines.map(([who, text, spoken]) => ({ voice: task.speakers[who], text: spoken || text }));
}

/** Audio-Angabe für den Player (public/audio/en-6/<id>.m4a). */
export const listeningAudio = (task) => ({ course: LISTENING_COURSE, id: task.id, text: listeningText(task), lang: 'en' });

function buildQuestions(task) {
  return task.questions.map((q, i) => {
    const base = {
      id: `${task.id}-${String(i + 1).padStart(2, '0')}`,
      exam: task.exam,
      course: LISTENING_COURSE,
      topic: 'en_listening',
      topicLabel: 'Hörverstehen',
      category: 'listening',
      listening: task.id,
      difficulty: q.kind === 'answer' ? 2 : 1,
      instruction: SECTIONS[q.kind],
    };
    if (q.kind === 'rw') {
      return {
        ...base,
        type: 'reading_true_false',
        question: q.text,
        correct: q.right ? 'true' : 'false',
        tfLabels: ['Right', 'Wrong'],
        explanation: q.why || (q.right ? 'Right.' : 'Wrong.'),
      };
    }
    if (q.kind === 'grid') {
      return { ...base, type: 'fill_gap', question: q.text, correct: q.answer, alternativeCorrect: q.alt || [], explanation: q.text.replace('___', q.answer) };
    }
    if (q.kind === 'tick') {
      const correctOptions = q.options.filter(([, ok]) => ok).map(([o]) => o);
      return {
        ...base,
        type: 'multi_select',
        question: q.text,
        options: q.options.map(([o]) => o),
        correctOptions,
        correct: correctOptions.join(' | '),
        explanation: `Richtig: ${correctOptions.join(' · ')}`,
      };
    }
    // „answer“ = Kurzantwort, „long“ = längere offene Frage (ein bis zwei Sätze, mehrzeilig, Mindestlänge).
    return {
      ...base,
      type: 'short_answer',
      question: q.text,
      correct: q.answer,
      alternativeCorrect: q.alt || [],
      keywords: q.keywords,
      ...(q.kind === 'long' ? { multiline: true, minWords: q.minWords || 6, difficulty: 3 } : {}),
      explanation: `Zum Beispiel: ${q.answer}`,
    };
  });
}

// Alle Hörtexte (auch ausgemusterte – für alte Antworten); zur Auswahl nur die aktiven (siehe questions.js).
export const EN6_LISTENING = TASKS.map((t) => ({ ...t, questions: buildQuestions(t) }));
export const EN6_LISTENING_QUESTIONS = EN6_LISTENING.flatMap((t) => t.questions);
