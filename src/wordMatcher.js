/**
 * Returns true if the solution is consistent with the guess.
 * - Green tiles: letter must match the solution at the same position.
 * - Yellow tiles: letter must appear somewhere in the solution.
 * - Gray tiles: solution must not contain the letter more times than the
 *   combined count of green + yellow tiles for that same letter.
 *
 * @param {Array<{letter: string, color: string}>} tiles
 * @param {string} solution
 * @returns {boolean}
 */
export function matchesGuess(tiles, solution) {
  const upper = solution.toUpperCase();

  for (let i = 0; i < tiles.length; i++) {
    const { letter, color } = tiles[i];
    if (!letter) continue;

    if (color === 'green' && upper[i] !== letter) return false;
    if (color === 'yellow' && (!upper.includes(letter) || upper[i] === letter)) return false;
  }

  // For letters with a gray tile, the solution may contain that letter at most
  // as many times as it appears as green or yellow in the guess.
  const grayLetters = new Set(
    tiles.filter(t => t.letter && t.color === 'gray').map(t => t.letter)
  );

  for (const letter of grayLetters) {
    const required = tiles.filter(
      t => t.letter === letter && (t.color === 'green' || t.color === 'yellow')
    ).length;
    const inSolution = upper.split('').filter(c => c === letter).length;
    if (inSolution > required) return false;
  }

  return true;
}
