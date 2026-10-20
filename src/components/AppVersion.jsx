// Versionsnummer klein unten auf der Seite (2026-10-19, Wunsch des Nutzers): Daran sieht man, ob ein Update
// schon angekommen ist. Nummer = Spacefast-Version, gesetzt von scripts/publish-spacefast.sh beim Bauen.
const VERSION = import.meta.env.VITE_APP_VERSION;
const BUILT = import.meta.env.VITE_APP_BUILT;

export default function AppVersion({ className = '' }) {
  const text = VERSION ? `Version ${VERSION}${BUILT ? ` · ${BUILT}` : ''}` : 'Version lokal';
  return <p className={`text-center text-[11px] text-muted-foreground/70 select-none ${className}`}>{text}</p>;
}
