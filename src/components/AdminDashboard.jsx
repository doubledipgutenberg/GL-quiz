import { useState, useEffect, useRef } from 'react';
import { getStudentHistory, clearAllData, getFullExportPayload, importFullPayload } from '../utils/storage';
import { getAllStudentOverview } from '../utils/analytics';
import StudentDetail from './StudentDetail';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

const ADMIN_PASSWORD = 'lehrer2024';
const ADMIN_AUTH_KEY = 'english_topic_quiz_admin_auth_until';

export default function AdminDashboard({ onBack, onCreateVocabReviewQuiz, onCreateNormalReviewQuiz }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ADMIN_AUTH_KEY);
      if (!stored) return;
      const until = Number(stored);
      if (Number.isFinite(until) && until > Date.now()) {
        setAuthenticated(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
      try {
        const until = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem(ADMIN_AUTH_KEY, String(until));
      } catch {
        // ignore
      }
    } else {
      setPasswordError(true);
    }
  };

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto py-10">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Lehrer-Bereich</CardTitle>
            <p className="text-sm text-muted-foreground">
              Bitte Passwort eingeben, um das Dashboard zu öffnen.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="Passwort..."
                  autoFocus
                />
                {passwordError && (
                  <p className="text-sm text-destructive font-medium">
                    Falsches Passwort!
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onBack}>
                  Zurück
                </Button>
                <Button type="submit">Einloggen</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const history = getStudentHistory();
  const overview = getAllStudentOverview(history);

  if (selectedStudent) {
    const studentData = history[selectedStudent];
    return (
      <StudentDetail
        name={selectedStudent}
        sessions={studentData?.sessions || []}
        onBack={() => setSelectedStudent(null)}
        onCreateVocabReviewQuiz={onCreateVocabReviewQuiz}
        onCreateNormalReviewQuiz={onCreateNormalReviewQuiz}
      />
    );
  }

  const handleClearData = () => {
    if (window.confirm('Wirklich ALLE Daten löschen? Das kann nicht rückgängig gemacht werden!')) {
      clearAllData();
      setRefreshKey((k) => k + 1);
    }
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result));
        const s = importFullPayload(payload);
        const parts = [];
        if (s.students) parts.push(`${s.students} neue Schüler`);
        if (s.sessions) parts.push(`${s.sessions} neue Runden`);
        if (s.savedRounds) parts.push(`${s.savedRounds} gespeicherte Runden`);
        if (s.highscores) parts.push(`${s.highscores} Highscores`);
        if (s.draft) parts.push('aktuelle Runde übernommen');
        window.alert(
          parts.length
            ? `Import erfolgreich:\n${parts.join('\n')}.`
            : 'Import erfolgreich – alle Daten waren schon vorhanden.'
        );
        setRefreshKey((k) => k + 1);
      } catch {
        window.alert('Import fehlgeschlagen: Die Datei ist keine gültige Quiz-Datensicherung.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportData = () => {
    try {
      const payload = getFullExportPayload();
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const ts = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `english-topic-quiz-data-${ts}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // ignore for now
    }
  };

  return (
    <div className="space-y-6 py-6" key={refreshKey}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Lehrer-Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            Zurück zum Quiz
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImportData}
          />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            Daten importieren
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData}>
            Daten exportieren
          </Button>
          <Button variant="destructive" size="sm" onClick={handleClearData}>
            🗑️ Alle Daten löschen
          </Button>
        </div>
      </div>

      {overview.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            <p>Noch keine Schüler-Daten vorhanden.</p>
            <p>Sobald Schüler das Quiz spielen, erscheinen hier die Ergebnisse.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Schüler-Übersicht</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground uppercase">
                      <th className="py-2 pr-2 text-left">Name</th>
                      <th className="py-2 pr-2 text-left">Versuche</th>
                      <th className="py-2 pr-2 text-left">Durchschnitt</th>
                      <th className="py-2 pr-2 text-left">Vokabeln gekonnt</th>
                      <th className="py-2 pr-2 text-left">Schwächen</th>
                      <th className="py-2 pr-2 text-left">Zuletzt</th>
                      <th className="py-2 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.map((student) => {
                      const pct = student.overallPercentage;
                      const badgeColor =
                        pct >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : pct >= 50
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800';
                      return (
                        <tr
                          key={student.name}
                          className="border-b border-border last:border-0 hover:bg-muted/40"
                        >
                          <td className="py-2 pr-2 font-medium">{student.name}</td>
                          <td className="py-2 pr-2">{student.totalSessions}</td>
                          <td className="py-2 pr-2">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${badgeColor}`}>
                              {pct}%
                            </span>
                          </td>
                          <td className="py-2 pr-2 text-xs text-muted-foreground">
                            {student.vocabMastery?.mastered ?? 0} /{' '}
                            {student.vocabMastery?.total ?? 0}
                          </td>
                          <td className="py-2 pr-2 text-xs">
                            {student.weaknesses.length > 0 ? (
                              <span className="text-red-700 font-semibold">
                                {student.weaknesses.length} Thema
                                {student.weaknesses.length > 1 ? 'en' : ''}
                              </span>
                            ) : (
                              <span className="text-emerald-700">Keine</span>
                            )}
                          </td>
                          <td className="py-2 pr-2 text-xs text-muted-foreground">
                            {new Date(student.lastPlayed).toLocaleDateString('de-DE')}
                          </td>
                          <td className="py-2 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedStudent(student.name)}
                            >
                              Details →
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Schwächen-Heatmap</CardTitle>
              <p className="text-xs text-muted-foreground">
                Schwach (&lt;50%) · Okay (50–79%) · Stark (≥80%)
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="py-2 pr-2 text-left">Thema</th>
                      {overview.map((s) => (
                        <th key={s.name} className="py-2 px-2 text-center">
                          {s.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const allTopics = new Map();
                      overview.forEach((s) => {
                        s.topicResults.forEach((t) => {
                          if (!allTopics.has(t.topic)) allTopics.set(t.topic, t.label);
                        });
                      });
                      return Array.from(allTopics.entries()).map(([topic, label]) => (
                        <tr key={topic} className="border-t border-border">
                          <td className="py-1.5 pr-2 text-left font-medium">{label}</td>
                          {overview.map((s) => {
                            const topicResult = s.topicResults.find((t) => t.topic === topic);
                            if (!topicResult) {
                              return (
                                <td
                                  key={s.name}
                                  className="py-1.5 px-2 text-center text-muted-foreground"
                                >
                                  —
                                </td>
                              );
                            }
                            const cls =
                              topicResult.strength === 'strong'
                                ? 'bg-emerald-100 text-emerald-800'
                                : topicResult.strength === 'medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800';
                            return (
                              <td
                                key={s.name}
                                className={`py-1.5 px-2 text-center font-semibold ${cls}`}
                              >
                                {topicResult.percentage}%
                              </td>
                            );
                          })}
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
