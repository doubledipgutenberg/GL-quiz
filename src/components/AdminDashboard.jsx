import { useState, useEffect, useRef } from 'react';
import {
  getStudentHistory,
  clearAllData,
  getFullExportPayload,
  importFullPayload,
  getAnswerFlags,
  getFlagReviews,
  getAnswerReviewExport,
} from '../utils/storage';
import { getAllStudentOverview } from '../utils/analytics';
import { regradeHistory } from '../utils/regrade';
import { api, getParentToken, setParentToken, getKidSession } from '../lib/api';
import { flush, pull } from '../utils/sync';
import { coursesForDashboard, filterHistoryByCourse } from '../utils/courseOf';
import StudentDetail from './StudentDetail';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

function errorText(err) {
  if (err?.status === 423 && err.data?.retryInSeconds) {
    return `Zu viele Versuche – bitte in ${Math.ceil(err.data.retryInSeconds / 60)} Min. nochmal.`;
  }
  if (err?.status === 401 && typeof err.data?.remaining === 'number') {
    return `Falsche PIN. Noch ${err.data.remaining} Versuch${err.data.remaining === 1 ? '' : 'e'}.`;
  }
  return err?.message || 'Das hat nicht geklappt.';
}

export default function AdminDashboard({ onBack, onCreateVocabReviewQuiz, onCreateNormalReviewQuiz }) {
  const [authenticated, setAuthenticated] = useState(() => !!getParentToken());
  const [parentPinSet, setParentPinSet] = useState(null); // null = lädt noch
  const [kids, setKids] = useState([]);
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [pinError, setPinError] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const fileInputRef = useRef(null);

  const kidName = getKidSession()?.name;
  const refresh = () => setRefreshKey((k) => k + 1);

  const loadKids = () =>
    api
      .kids()
      .then((d) => {
        setKids(d.kids || []);
        setParentPinSet(!!d.parentPinSet);
      })
      .catch(() => {});

  useEffect(() => {
    loadKids();
  }, []);

  // Nach dem Login (oder mit gültigem Token) den neuesten Stand aller Kinder holen.
  useEffect(() => {
    if (!authenticated) return;
    flush()
      .then(() => pull(kidName))
      .then(() => setNotice(''))
      .catch((err) => {
        if (err?.status === 401) {
          setParentToken(null);
          setAuthenticated(false);
        } else {
          setNotice('Keine Verbindung – angezeigt wird der Stand auf diesem Gerät.');
        }
      })
      .finally(refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setPinError('');
    if (!/^\d{4,8}$/.test(pin)) {
      setPinError('Die Eltern-PIN besteht aus 4 bis 8 Ziffern.');
      return;
    }
    if (parentPinSet === false && pin !== pin2) {
      setPinError('Die beiden PINs sind nicht gleich.');
      return;
    }
    setBusy(true);
    try {
      const res = await api.parentLogin(pin);
      setParentToken(res.token);
      setPin('');
      setPin2('');
      setParentPinSet(true);
      setAuthenticated(true);
    } catch (err) {
      setPinError(errorText(err));
      setPin('');
      setPin2('');
    } finally {
      setBusy(false);
    }
  };

  const handleParentLogout = () => {
    setParentToken(null);
    setAuthenticated(false);
  };

  if (!authenticated) {
    const pinProps = {
      type: 'password',
      inputMode: 'numeric',
      autoComplete: 'off',
      maxLength: 8,
      placeholder: 'PIN',
    };
    return (
      <div className="max-w-md mx-auto py-10">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Lehrer-Bereich</CardTitle>
            <p className="text-sm text-muted-foreground">
              {parentPinSet === null
                ? 'Einen Moment …'
                : parentPinSet
                ? 'Bitte die Eltern-PIN eingeben.'
                : 'Erster Start: Lege eine Eltern-PIN fest (4–8 Ziffern). Die Kinder sollten sie nicht kennen.'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  {...pinProps}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value.replace(/\D/g, ''));
                    setPinError('');
                  }}
                  autoFocus
                />
                {parentPinSet === false && (
                  <Input
                    {...pinProps}
                    placeholder="PIN wiederholen"
                    value={pin2}
                    onChange={(e) => setPin2(e.target.value.replace(/\D/g, ''))}
                  />
                )}
                {pinError && <p className="text-sm text-destructive font-medium">{pinError}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onBack}>
                  Zurück
                </Button>
                <Button type="submit" disabled={busy}>
                  {busy ? '…' : parentPinSet === false ? 'PIN festlegen' : 'Einloggen'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleClearData = async () => {
    if (!window.confirm('Wirklich ALLE Quiz-Daten aller Kinder löschen – auf dem Server und auf diesem Gerät? Das kann nicht rückgängig gemacht werden!')) return;
    try {
      await api.clearAll(getParentToken());
      clearAllData();
      refresh();
    } catch (err) {
      window.alert(`Löschen fehlgeschlagen: ${err.message}`);
    }
  };

  const handleResetPin = async (name) => {
    if (!window.confirm(`PIN von ${name} zurücksetzen? ${name} legt beim nächsten Login eine neue PIN fest.`)) return;
    try {
      await api.resetPin(name, getParentToken());
      await loadKids();
      window.alert(`Die PIN von ${name} wurde zurückgesetzt.`);
    } catch (err) {
      window.alert(`Zurücksetzen fehlgeschlagen: ${err.message}`);
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
        flush().finally(() => {
          window.alert(
            parts.length
              ? `Import erfolgreich und gespeichert:\n${parts.join('\n')}.`
              : 'Import erfolgreich – alle Daten waren schon vorhanden.'
          );
          refresh();
        });
      } catch {
        window.alert('Import fehlgeschlagen: Die Datei ist keine gültige Quiz-Datensicherung.');
      }
    };
    reader.readAsText(file);
  };

  // Für den Coding-Agent: alle „fast richtig“-Meldungen mit Urteil (Auswertung: scripts/review-flags.mjs).
  const handleExportReview = () => {
    const blob = new Blob([JSON.stringify(getAnswerReviewExport(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `antwort-review-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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

  // Jedes Kind hat sein eigenes Dashboard: erst Schüler wählen, dann – getrennt nach Fach – seine Inhalte.
  // Mit dem aktuellen Antwort-Check neu bewertet (z. B. „fast, beinahe“ = „fast; beinahe“), siehe utils/regrade.js.
  const allHistory = regradeHistory(getStudentHistory());
  const names = [...new Set([...kids.map((k) => k.name), ...Object.keys(allHistory)])];
  const overviewByName = new Map(getAllStudentOverview(allHistory).map((o) => [o.name, o]));
  const allFlags = getAnswerFlags();
  const flagReviews = getFlagReviews();
  const openFlagCount = (name) => (allFlags[name] || []).filter((f) => !flagReviews[f.id]).length;

  if (selectedStudent) {
    const ownHistory = allHistory[selectedStudent] ? { [selectedStudent]: allHistory[selectedStudent] } : {};
    const courseTabs = coursesForDashboard(ownHistory);
    const activeCourse =
      courseTabs.find((c) => c.id === courseId) || courseTabs.find((c) => c.hasData) || courseTabs[0];
    const sessions = activeCourse ? filterHistoryByCourse(ownHistory, activeCourse.id)[selectedStudent]?.sessions || [] : [];
    const backToList = () => {
      setSelectedStudent(null);
      setCourseId(null);
    };
    return (
      <div className="space-y-6" key={refreshKey}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">Lehrer-Bereich · {selectedStudent}</h2>
          <Button variant="outline" size="sm" onClick={backToList}>
            ← Alle Schüler
          </Button>
        </div>
        {courseTabs.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
            <span className="text-sm font-semibold mr-1">Fach:</span>
            {courseTabs.map((c) => (
              <Button
                key={c.id}
                size="sm"
                variant={c.id === activeCourse?.id ? 'default' : 'outline'}
                onClick={() => setCourseId(c.id)}
              >
                {c.label}
                {!c.hasData && <span className="ml-1 text-xs opacity-70">(noch leer)</span>}
              </Button>
            ))}
          </div>
        )}
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              {selectedStudent} hat in {activeCourse?.label ?? 'diesem Fach'} noch nicht geübt.
            </CardContent>
          </Card>
        ) : (
          <StudentDetail
            key={`${selectedStudent}-${activeCourse?.id}`}
            name={selectedStudent}
            courseId={activeCourse?.id}
            courseLabel={activeCourse?.label}
            sessions={sessions}
            onCreateVocabReviewQuiz={onCreateVocabReviewQuiz}
            onCreateNormalReviewQuiz={onCreateNormalReviewQuiz}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6" key={refreshKey}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Lehrer-Bereich</h2>
        <div className="flex flex-wrap gap-2">
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
          <Button variant="outline" size="sm" onClick={handleExportReview}>
            Antwort-Review exportieren
          </Button>
          <Button variant="destructive" size="sm" onClick={handleClearData}>
            🗑️ Alle Daten löschen
          </Button>
          <Button variant="ghost" size="sm" onClick={handleParentLogout}>
            Abmelden
          </Button>
        </div>
      </div>

      {notice && <p className="text-sm text-destructive">{notice}</p>}

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base">Welches Kind?</CardTitle>
          <p className="text-sm text-muted-foreground">Jedes Kind hat sein eigenes Dashboard, getrennt nach Fach.</p>
        </CardHeader>
        <CardContent className="grid gap-3 px-3 pb-3 sm:grid-cols-2 sm:px-6 sm:pb-6">
          {names.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Profile.</p>}
          {names.map((name) => {
            const kid = kids.find((k) => k.name === name);
            const o = overviewByName.get(name);
            return (
              <div key={name} className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:p-4">
                <button type="button" className="text-left space-y-1" onClick={() => setSelectedStudent(name)}>
                  <span className="flex items-center gap-2 text-lg font-semibold">
                    {name}
                    {openFlagCount(name) > 0 && (
                      <span className="vx-pill vx-pill--lamp">{openFlagCount(name)} zur Prüfung</span>
                    )}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {o
                      ? `${o.totalSessions} ${o.totalSessions === 1 ? 'Runde' : 'Runden'} · zuletzt ${new Date(o.lastPlayed).toLocaleDateString('de-DE')}`
                      : 'Noch keine Runden'}
                  </span>
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={() => setSelectedStudent(name)}>
                    Dashboard öffnen →
                  </Button>
                  {kid && (
                    <>
                      <span className="text-xs text-muted-foreground">{kid.hasPin ? 'PIN gesetzt' : 'noch keine PIN'}</span>
                      {kid.hasPin && (
                        <Button variant="outline" size="sm" onClick={() => handleResetPin(name)}>
                          PIN zurücksetzen
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
