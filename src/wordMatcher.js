/**
 * Returns true if the solution is consistent with the guess.
 * - Green tiles: letter must match the solution at the same position.
 * - Yellow tiles: letter must appear somewhere in the solution.
 * - Letter counts: solution must contain at least as many copies of a letter
 *   as its green + yellow tiles, and gray duplicates make that count exact.
 *
 * @param {Array<{letter: string, color: string}>} tiles
 * @param {string} solution
 * @returns {boolean}
 */
export function matchesGuess(tiles, solution) {
  const upper = solution.toUpperCase();
  const letterCounts = new Map();

  for (let i = 0; i < tiles.length; i++) {
    const { letter, color } = tiles[i];
    if (!letter) continue;

    if (!letterCounts.has(letter)) {
      letterCounts.set(letter, { matched: 0, hasGray: false });
    }

    const counts = letterCounts.get(letter);
    if (color === 'gray') {
      counts.hasGray = true;
    } else {
      counts.matched += 1;
    }

    if (color === 'green' && upper[i] !== letter) return false;
    if (color === 'yellow' && (!upper.includes(letter) || upper[i] === letter)) return false;
  }

  for (const [letter, counts] of letterCounts) {
    const inSolution = upper.split('').filter(c => c === letter).length;
    if (inSolution < counts.matched) return false;
    if (counts.hasGray && inSolution > counts.matched) return false;
  }

  return true;
}
