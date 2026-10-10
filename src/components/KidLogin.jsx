import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const SPACE_TITLE = 'Klasse 6d';

function errorText(err) {
  if (err?.status === 423 && err.data?.retryInSeconds) {
    const min = Math.ceil(err.data.retryInSeconds / 60);
    return `Zu viele Versuche – bitte in ${min} Minute${min === 1 ? '' : 'n'} nochmal probieren.`;
  }
  if (err?.status === 401 && typeof err.data?.remaining === 'number') {
    return `Falsche PIN. Noch ${err.data.remaining} Versuch${err.data.remaining === 1 ? '' : 'e'}.`;
  }
  return err?.message || 'Das hat nicht geklappt.';
}

export default function KidLogin({ onLogin }) {
  const [kids, setKids] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [selected, setSelected] = useState(null);
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoadError('');
    api
      .kids()
      .then((d) => setKids(d.kids))
      .catch((e) => setLoadError(e.message));
  };

  useEffect(load, []);

  const firstTime = selected && !selected.hasPin;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^\d{4}$/.test(pin)) {
      setError('Die PIN besteht aus 4 Ziffern.');
      return;
    }
    if (firstTime && pin !== pin2) {
      setError('Die beiden PINs sind nicht gleich.');
      return;
    }
    setBusy(true);
    try {
      const res = await api.login(selected.name, pin);
      await onLogin({ name: res.name, token: res.token });
    } catch (err) {
      setError(errorText(err));
      setPin('');
      setPin2('');
    } finally {
      setBusy(false);
    }
  };

  const pinInputProps = {
    type: 'password',
    inputMode: 'numeric',
    autoComplete: 'off',
    maxLength: 4,
    placeholder: '••••',
    className: 'text-center text-2xl tracking-[0.5em]',
  };

  return (
    <div className="max-w-[400px] mx-auto space-y-8">
      <header className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Quiz Challenge</h1>
        <p className="text-sm text-muted-foreground">{SPACE_TITLE}</p>
      </header>

      {!selected && (
        <Card>
          <CardHeader>
            <CardTitle>Wer übt heute?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadError && (
              <div className="space-y-3">
                <p className="text-sm text-destructive">{loadError}</p>
                <Button variant="outline" onClick={load}>Nochmal versuchen</Button>
              </div>
            )}
            {!kids && !loadError && <p className="text-sm text-muted-foreground">Lade …</p>}
            {kids?.map((k) => (
              <Button
                key={k.name}
                variant="outline"
                className="w-full h-14 text-lg justify-start px-5"
                onClick={() => {
                  setSelected(k);
                  setError('');
                  setPin('');
                  setPin2('');
                }}
              >
                {k.name}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle>
              {firstTime ? `Hallo ${selected.name}! Lege deine PIN fest` : `Hallo ${selected.name}!`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kid-pin">{firstTime ? 'Neue PIN (4 Ziffern)' : 'Deine PIN'}</Label>
                <Input
                  id="kid-pin"
                  {...pinInputProps}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
              </div>
              {firstTime && (
                <div className="space-y-2">
                  <Label htmlFor="kid-pin2">PIN wiederholen</Label>
                  <Input
                    id="kid-pin2"
                    {...pinInputProps}
                    value={pin2}
                    onChange={(e) => setPin2(e.target.value.replace(/\D/g, ''))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Merk dir die PIN gut. Vergessen? Mama oder Papa können sie zurücksetzen.
                  </p>
                </div>
              )}
              {error && <p className="text-sm text-destructive font-medium">{error}</p>}
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setSelected(null)}>
                  Zurück
                </Button>
                <Button type="submit" className="flex-1" disabled={busy || pin.length !== 4 || (firstTime && pin2.length !== 4)}>
                  {busy ? '…' : 'Los geht’s'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
