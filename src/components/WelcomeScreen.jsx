import { useState } from 'react';
import { getDraftSession, getSavedRounds, getFullExportPayload } from '../utils/storage';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

function formatSavedAt(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day}.${month}. ${hours}:${mins}`;
}

export default function WelcomeScreen({ onStart, onAdmin, onRestoreDraft, onRestoreSavedRound, hasDraft, hasSavedRounds }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [quizMode, setQuizMode] = useState('normal');
  const [showRoundList, setShowRoundList] = useState(false);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onStart(name.trim(), quizMode);
  };

  const showResume = hasDraft || hasSavedRounds;

  if (showRoundList) {
    const draft = getDraftSession();
    const savedRounds = getSavedRounds();
    const hasAny = !!draft || savedRounds.length > 0;

    const handleExport = () => {
      try {
        const payload = getFullExportPayload();
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const ts = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `greenline-quiz-data-${ts}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    };
    return (
      <div className="max-w-[400px] mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Runde fortsetzen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasAny ? (
              <p className="text-sm text-muted-foreground">Keine gespeicherten Runden.</p>
            ) : (
              <ul className="space-y-3">
                {draft && (
                  <li className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-sm">Aktuelle Runde</span>
                      <span className="text-xs text-muted-foreground">{draft.name} · {formatSavedAt(draft.updatedAt)}</span>
                    </div>
                    <Button size="sm" onClick={() => onRestoreDraft()}>Fortsetzen</Button>
                  </li>
                )}
                {savedRounds.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-sm">{r.roundName}</span>
                      <span className="text-xs text-muted-foreground">{r.playerName} · {formatSavedAt(r.savedAt)}</span>
                    </div>
                    <Button size="sm" onClick={() => onRestoreSavedRound(r)}>Fortsetzen</Button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-between gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowRoundList(false)}>
                Zurück
              </Button>
              <Button variant="link" size="sm" className="text-muted-foreground px-0" onClick={handleExport}>
                Daten exportieren (JSON)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[400px] mx-auto space-y-8">
      <header className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">English Quiz Challenge</h1>
        <h2 className="text-lg text-muted-foreground font-medium">Green Line 1 — Units 2 & 3</h2>
        <p className="text-sm text-muted-foreground">Vorbereitung auf die 2. Schulaufgabe</p>
      </header>

      {step === 1 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Quiz-Modus</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={quizMode} onValueChange={setQuizMode} className="grid gap-3">
                <label className="flex items-start gap-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-accent/50 has-[:checked]:border-primary has-[:checked]:bg-accent/50">
                  <RadioGroupItem value="normal" className="mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">Normales Quiz</span>
                    <span className="text-sm text-muted-foreground">Gemischte Fragen (Grammar, Vokabeln, Reading, Mediation)</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-accent/50 has-[:checked]:border-primary has-[:checked]:bg-accent/50">
                  <RadioGroupItem value="vocabulary" className="mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">Wortschatz only</span>
                    <span className="text-sm text-muted-foreground">Nur Vokabeln aus dem Stoff – alle kommen dran</span>
                  </div>
                </label>
              </RadioGroup>
            </CardContent>
          </Card>
          <div className="flex justify-center">
            <Button onClick={() => setStep(2)}>Weiter</Button>
          </div>
        </>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Wie heißt du?</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="player-name">Name</Label>
                <Input
                  id="player-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dein Name..."
                  maxLength={20}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  Zurück
                </Button>
                <Button type="submit" className="flex-1" disabled={!name.trim()}>
                  Quiz starten
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <footer className="flex flex-wrap gap-4 justify-center pt-4">
        {showResume && (
          <Button variant="link" size="sm" className="text-muted-foreground" onClick={() => setShowRoundList(true)}>
            Letzte Runde weiterspielen
          </Button>
        )}
        <Button variant="link" size="sm" className="text-muted-foreground" onClick={onAdmin}>
          Lehrer-Bereich
        </Button>
      </footer>
    </div>
  );
}
