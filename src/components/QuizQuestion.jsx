import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { playAudio, playSequence } from '@/lib/audio';
import { requiredMeanings, MULTI_SEPARATOR, wordCount } from '@/utils/scoring';
import { listeningTaskById } from '@/data/questions';
import { listeningAudio } from '@/data/en6/listening';
import ListeningPlayer from './ListeningPlayer';

// Akzent-Tasten für französische Antworten (Akzente zählen streng).
const FR_ACCENTS = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ç', 'î', 'ï', 'ô', 'û', 'ù', 'œ'];

function SpeakerButton({ audio, sequence, size = 'sm', label = 'Anhören' }) {
  if (!audio && !sequence) return null;
  const play = () => (sequence ? playSequence(sequence) : playAudio(audio));
  return (
    <Button type="button" variant="outline" size={size} onClick={play} aria-label={label}>
      🔊 {label}
    </Button>
  );
}

export default function QuizQuestion({ question, onSubmit }) {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  // Hörverstehen „Tick all the correct answers“: angekreuzte Optionen (neue Frage → leer).
  const [selected, setSelected] = useState([]);
  const [selectedFor, setSelectedFor] = useState(question.id);
  if (selectedFor !== question.id) {
    setSelectedFor(question.id);
    setSelected([]);
  }
  const listeningTask = question.listening ? listeningTaskById(question.listening) : null;
  const inputRef = useRef(null);
  const isListen = question.type === 'listen_card';
  const isCard = question.type === 'vocab_card' || isListen;

  // Hör-Karte im Wortschatz: beim Erscheinen erst das Wort, kurz danach den Beispielsatz abspielen.
  const listenSequence = isListen ? [question.audio, question.exampleAudio] : null;
  useEffect(() => {
    if (question.type === 'listen_card') playSequence([question.audio, question.exampleAudio]);
  }, [question.id, question.type, question.audio, question.exampleAudio]);

  const insertChar = (ch) => {
    const el = inputRef.current;
    const start = el?.selectionStart ?? answer.length;
    const end = el?.selectionEnd ?? answer.length;
    const next = answer.slice(0, start) + ch + answer.slice(end);
    setAnswer(next);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + ch.length, start + ch.length);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer.trim());
      setAnswer('');
      setShowHint(false);
    }
  };

  const toggleOption = (option) =>
    setSelected((list) => (list.includes(option) ? list.filter((o) => o !== option) : [...list, option]));

  const submitSelected = () => {
    if (!selected.length) return;
    onSubmit(selected.join(MULTI_SEPARATOR));
    setSelected([]);
  };

  const handleOptionClick = (option) => {
    onSubmit(option);
    setAnswer('');
    setShowHint(false);
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Antwort ist amerikanisches Englisch (data: ae) – deutlich sagen, damit niemand „autumn“ statt „fall“ schreibt. */}
        {question.ae && (
          <p className="flex justify-center">
            <span className="vx-pill">AE · amerikanisches Englisch</span>
          </p>
        )}
        {!isCard && (
          <div className="flex items-center justify-between gap-2">
            <span className={cn(
              'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border',
              question.category === 'grammar' && 'bg-muted text-muted-foreground border-border',
              question.category === 'vocabulary' && 'bg-muted text-muted-foreground border-border',
              question.category === 'reading' && 'bg-muted text-muted-foreground border-border',
              question.category === 'mediation' && 'bg-muted text-muted-foreground border-border'
            )}>
              {question.topicLabel}
            </span>
            <span className="flex gap-0.5" aria-label={`Schwierigkeit: ${question.difficulty} von 3`}>
              {[1, 2, 3].map((d) => (
                <span key={d} className={cn('h-1.5 w-1.5 rounded-full', d <= question.difficulty ? 'bg-foreground' : 'bg-muted')} />
              ))}
            </span>
          </div>
        )}

        {question.text && (
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm whitespace-pre-line">{question.text}</p>
          </div>
        )}

        {question.type === 'picture_vocab' && question.imageUrl && (
          <div className="flex justify-center">
            <img src={question.imageUrl} alt="" className="max-h-48 rounded-lg object-contain" />
          </div>
        )}

        {question.type === 'vocab_card' && (
          <div className="rounded-xl border border-border bg-muted/30 p-8 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {question.instruction}
              {(() => {
                const raw = String(question.correct || '');
                const tokens = raw
                  .split(/[,/]/)
                  .map((s) => s.trim())
                  .filter(Boolean);
                // Zähle nur „echte“ Begriffe, nicht Flexionsendungen wie -r/-s/-in
                const terms = tokens.filter((tok, idx) => {
                  if (idx === 0) return true;
                  const simple = tok.replace(/\s+/g, '');
                  return !/^-\w{1,3}$/.test(simple);
                });
                return terms.length > 1
                  ? ` · Hinweis: Es gibt ${terms.length} Begriffe.`
                  : '';
              })()}
            </p>
            <p className="text-3xl font-bold tracking-tight">{question.word}</p>
            {question.promptAudio && (
              <div className="pt-2">
                <SpeakerButton audio={question.audio} />
              </div>
            )}
          </div>
        )}

        {isListen && (
          <div className="rounded-xl border border-border bg-muted/30 p-8 text-center space-y-4">
            <p className="text-sm text-muted-foreground">{question.instruction}</p>
            <SpeakerButton sequence={listenSequence} size="lg" label="Nochmal anhören" />
            {question.exampleAudio && (
              <p className="text-xs text-muted-foreground">Erst das Wort, dann ein Beispielsatz.</p>
            )}
          </div>
        )}

        {/* Hörverstehen: Hörtext noch einmal anhören + Aufgabenform wie im Arbeitsblatt („Right or wrong?“ …) */}
        {listeningTask && (
          <div className="space-y-3 rounded-[var(--radius-md)] border border-border bg-muted/30 p-3">
            <p className="text-sm font-semibold">{listeningTask.title}</p>
            <ListeningPlayer compact audio={listeningAudio(listeningTask)} />
          </div>
        )}
        {question.listening && question.instruction && (
          <p className="text-sm font-semibold text-muted-foreground">{question.instruction}</p>
        )}

        {!isCard && (
          <h2 className="text-lg font-semibold leading-tight">{question.question}</h2>
        )}

        {question.type === 'multi_select' && question.options && (
          <div className="grid gap-2">
            {question.options.map((option) => {
              const on = selected.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  className={cn('vx-option vx-option--check', on && 'is-on')}
                  onClick={() => toggleOption(option)}
                >
                  {/* Großes, eckiges Kästchen (2026-10-25, Wunsch des Nutzers) – Stil in App.css */}
                  <span className="vx-check" aria-hidden="true">
                    {on ? '✓' : ''}
                  </span>
                  <span className="vx-option__text">{option}</span>
                </button>
              );
            })}
            <Button type="button" className="mt-1" disabled={!selected.length} onClick={submitSelected}>
              Antworten
            </Button>
          </div>
        )}

        {question.type === 'word_order' && (
          <div className="flex flex-wrap gap-2">
            {question.words.map((word, i) => (
              <span key={i} className="inline-flex items-center rounded-md border border-border bg-muted px-3 py-1.5 text-sm">
                {word}
              </span>
            ))}
          </div>
        )}

        {question.type === 'multiple_choice' && question.options && (
          <div className="grid gap-2">
            {question.options.map((option, i) => (
              <Button
                key={i}
                variant="outline"
                className="h-auto justify-start py-3 text-left font-normal"
                onClick={() => handleOptionClick(option)}
              >
                {String.fromCharCode(65 + i)}) {option}
              </Button>
            ))}
          </div>
        )}

        {question.type === 'reading_true_false' && (
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="py-6" onClick={() => handleOptionClick('true')}>
              {question.tfLabels?.[0] || 'True'}
            </Button>
            <Button variant="outline" className="py-6" onClick={() => handleOptionClick('false')}>
              {question.tfLabels?.[1] || 'False'}
            </Button>
          </div>
        )}

        {/* Längere offene Frage (Hörverstehen): mehrzeiliges Feld, Enter schickt ab, Umschalt+Enter = neue Zeile. */}
        {question.multiline && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <textarea
              ref={inputRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) handleSubmit(e);
              }}
              placeholder="Deine Antwort in ein bis zwei Sätzen ..."
              rows={3}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="sentences"
              spellCheck={false}
              lang={question.answerLang || undefined}
              className="w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-base leading-relaxed shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Schreib <strong>ein bis zwei Sätze</strong>
                {question.minWords ? ` (mindestens ${question.minWords} Wörter · bisher ${wordCount(answer)})` : ''}.
              </p>
              <Button type="submit" disabled={!answer.trim()}>
                Antworten
              </Button>
            </div>
          </form>
        )}

        {!question.multiline && !['multiple_choice', 'reading_true_false', 'multi_select'].includes(question.type) && (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <Input
              ref={inputRef}
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Deine Antwort..."
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              lang={question.answerLang || undefined}
              className="flex-1"
            />
            <Button type="submit" disabled={!answer.trim()}>
              Antworten
            </Button>
          </form>
        )}

        {/* Vokabeln mit drei oder mehr Bedeutungen: mindestens zwei nennen (utils/scoring.js). */}
        {requiredMeanings(question) >= 2 && (
          <p className="text-sm text-muted-foreground">
            Dieses Wort hat mehrere Bedeutungen – gib <strong>mindestens zwei</strong> an, mit Komma getrennt.
          </p>
        )}

        {question.answerLang === 'fr' && !['multiple_choice', 'reading_true_false'].includes(question.type) && (
          <div className="flex flex-wrap gap-1.5" aria-label="Akzente einfügen">
            {FR_ACCENTS.map((ch) => (
              <Button
                key={ch}
                type="button"
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 text-base"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insertChar(ch)}
              >
                {ch}
              </Button>
            ))}
          </div>
        )}

        {!isCard && question.hint && (
          <div className="pt-2">
            {!showHint ? (
              <Button variant="ghost" size="sm" onClick={() => setShowHint(true)}>
                Tipp anzeigen
              </Button>
            ) : (
              <div className="rounded-lg border border-border bg-muted/50 p-3 text-sm">
                <strong>Tipp:</strong> {question.hint}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
