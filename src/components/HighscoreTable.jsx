import { getHighscores } from '../utils/storage';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export default function HighscoreTable() {
  const highscores = getHighscores();

  if (highscores.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Highscore-Tabelle</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            Noch keine Highscores. Sei der Erste!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-base">Highscore-Tabelle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase">
                <th className="py-2 pr-2 text-left">#</th>
                <th className="py-2 pr-2 text-left">Name</th>
                <th className="py-2 pr-2 text-left">Score</th>
                <th className="py-2 pr-2 text-left">%</th>
                <th className="py-2 text-left">Datum</th>
              </tr>
            </thead>
            <tbody>
              {highscores.slice(0, 10).map((entry, i) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-0 hover:bg-muted/40"
                >
                  <td className="py-2 pr-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-2 pr-2">{entry.name}</td>
                  <td className="py-2 pr-2">
                    {entry.score}/{entry.maxScore}
                  </td>
                  <td className="py-2 pr-2">{entry.percentage}%</td>
                  <td className="py-2">
                    {new Date(entry.date).toLocaleDateString('de-DE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
