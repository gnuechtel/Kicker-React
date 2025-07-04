export function WinningLogic(matches, goalsToWin = 4) {
  const stats = {};

  const storedWinningForm = JSON.parse(localStorage.getItem('form') || "{}");
  const pointsPerWin = parseInt(storedWinningForm.points, 10) || 3;

  matches.forEach(match => {
    if (!match.result) return;

    // Gesamtsummen aus den einzelnen Satz-Ergebnissen
    const total = match.result.reduce(
      ([sumA, sumB], res) => {
        const [gA, gB] = res.split(":").map(Number);
        return [sumA + gA, sumB + gB];
      }, [0, 0]
    );

    const [goalsA, goalsB] = total;

    // Teams direkt aus dem verschachtelten Array
    const TeamA = match.players[0]; // [playerA1, playerA2]
    const TeamB = match.players[1]; // [playerB1, playerB2]

    TeamA.forEach(player => {
      if (!stats[player]) stats[player] = { games: 0, wins: 0, losses: 0, points: 0, goalDiff: 0 };
      stats[player].games++;
      stats[player].goalDiff += goalsA - goalsB;
      if (goalsA > goalsB) {
        stats[player].wins++;
        stats[player].points += pointsPerWin;
      } else {
        stats[player].losses++;
      }
    });

    TeamB.forEach(player => {
      if (!stats[player]) stats[player] = { games: 0, wins: 0, losses: 0, points: 0, goalDiff: 0 };
      stats[player].games++;
      stats[player].goalDiff += goalsB - goalsA;
      if (goalsB > goalsA) {
        stats[player].wins++;
        stats[player].points += pointsPerWin;
      } else {
        stats[player].losses++;
      }
    });
  });

  return stats;
}
