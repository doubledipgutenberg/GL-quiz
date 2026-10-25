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
    ],
  },
  {
    id: 'en6-l2',
    exam: 'en6-u1',
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
];

const SECTIONS = {
  rw: 'Right or wrong?',
  grid: 'Complete the grid.',
  tick: 'Tick all the correct answers.',
  answer: "Answer the questions. You needn't write complete sentences.",
};

/** Text zum Mitlesen (Lehrer-Bereich, Ersatzstimme) – mit Sprechernamen. */
export function listeningText(task) {
  return task.lines.map(([who, text]) => `${who}: ${text}`).join('\n');
}

/** Abschnitte fürs Audio: jede Zeile mit der Stimme ihres Sprechers. */
export function listeningSegments(task) {
  return task.lines.map(([who, text]) => ({ voice: task.speakers[who], text }));
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
    return {
      ...base,
      type: 'short_answer',
      question: q.text,
      correct: q.answer,
      alternativeCorrect: q.alt || [],
      keywords: q.keywords,
      explanation: `Zum Beispiel: ${q.answer}`,
    };
  });
}

export const EN6_LISTENING = TASKS.map((t) => ({ ...t, questions: buildQuestions(t) }));
export const EN6_LISTENING_QUESTIONS = EN6_LISTENING.flatMap((t) => t.questions);
