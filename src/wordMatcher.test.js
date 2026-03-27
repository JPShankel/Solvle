import { matchesGuess } from './wordMatcher';

function tiles(str, colors) {
  return str.split('').map((letter, i) => ({
    letter: letter.toUpperCase(),
    color: colors[i],
  }));
}

describe('matchesGuess', () => {
  describe('green tiles', () => {
    test('passes when green letter matches exact position', () => {
      // C green at 0; R/A/N/E gray — solution must start with C and contain none of R,A,N,E
      expect(matchesGuess(tiles('crane', ['green', 'gray', 'gray', 'gray', 'gray']), 'cubic')).toBe(true);
    });

    test('fails when green letter does not match position', () => {
      expect(matchesGuess(tiles('crane', ['green', 'gray', 'gray', 'gray', 'gray']), 'brine')).toBe(false);
    });

    test('passes when all green letters match their positions', () => {
      expect(matchesGuess(tiles('crane', ['green', 'green', 'green', 'green', 'green']), 'crane')).toBe(true);
    });

    test('fails when one green letter is in wrong position', () => {
      expect(matchesGuess(tiles('crane', ['green', 'green', 'green', 'green', 'green']), 'crank')).toBe(false);
    });
  });

  describe('yellow tiles', () => {
    test('passes when yellow letter appears somewhere in solution', () => {
      // C yellow; R/A/N/E gray — solution must contain C and none of R,A,N,E
      expect(matchesGuess(tiles('crane', ['yellow', 'gray', 'gray', 'gray', 'gray']), 'thick')).toBe(true);
    });

    test('fails when yellow letter does not appear in solution', () => {
      expect(matchesGuess(tiles('crane', ['yellow', 'gray', 'gray', 'gray', 'gray']), 'bliss')).toBe(false);
    });
  });

  describe('gray tiles', () => {
    test('passes when gray letter does not appear in solution', () => {
      expect(matchesGuess(tiles('crane', ['gray', 'gray', 'gray', 'gray', 'gray']), 'bliss')).toBe(true);
    });

    test('fails when gray letter appears in solution and has no green/yellow entries', () => {
      // 'c' is gray — solution must have 0 c's
      expect(matchesGuess(tiles('crane', ['gray', 'gray', 'gray', 'gray', 'gray']), 'clock')).toBe(false);
    });

    test('passes when solution has exactly as many of the letter as green+yellow count', () => {
      // guess: A is green once, A is gray once — solution may have at most 1 A
      const t = [
        { letter: 'A', color: 'green' },
        { letter: 'A', color: 'gray' },
        { letter: 'B', color: 'gray' },
        { letter: 'C', color: 'gray' },
        { letter: 'D', color: 'gray' },
      ];
      expect(matchesGuess(t, 'axles')).toBe(true);  // 1 A — ok
    });

    test('fails when solution has more of the letter than green+yellow count allows', () => {
      // guess: A is green once, A is gray once — solution must have at most 1 A
      const t = [
        { letter: 'A', color: 'green' },
        { letter: 'A', color: 'gray' },
        { letter: 'B', color: 'gray' },
        { letter: 'C', color: 'gray' },
        { letter: 'D', color: 'gray' },
      ];
      expect(matchesGuess(t, 'allay')).toBe(false); // 3 A's — too many
    });

    test('fails when solution has any of a fully-gray letter', () => {
      // guess: no green/yellow A, one gray A — solution must have 0 A's
      const t = [
        { letter: 'A', color: 'gray' },
        { letter: 'B', color: 'gray' },
        { letter: 'C', color: 'gray' },
        { letter: 'D', color: 'gray' },
        { letter: 'E', color: 'gray' },
      ];
      expect(matchesGuess(t, 'alarm')).toBe(false); // has A
      expect(matchesGuess(t, 'skill')).toBe(true);  // no A, B, C, D, E
    });

    test('green+yellow+gray: solution has exactly green+yellow count of that letter', () => {
      // green A + yellow A + gray A => solution must have exactly 2 A's
      const t = [
        { letter: 'A', color: 'green' },
        { letter: 'A', color: 'yellow' },
        { letter: 'A', color: 'gray' },
        { letter: 'X', color: 'gray' },
        { letter: 'Y', color: 'gray' },
      ];
      expect(matchesGuess(t, 'abaca')).toBe(false); // 3 A's — too many
      expect(matchesGuess(t, 'allay')).toBe(false); // 3 A's — too many
    });
  });

  describe('mixed colors', () => {
    test('fails when a yellow is in exact place', () => {
      // C is green at 0, R is yellow (appears somewhere), rest gray
      expect(matchesGuess(tiles('crane', ['green', 'yellow', 'gray', 'gray', 'gray']), 'crimp')).toBe(false);
    });

    test('fails when green passes but yellow fails', () => {
      expect(matchesGuess(tiles('crane', ['green', 'yellow', 'gray', 'gray', 'gray']), 'clock')).toBe(false);
    });

    test('fails when yellow passes but green fails', () => {
      expect(matchesGuess(tiles('crane', ['green', 'yellow', 'gray', 'gray', 'gray']), 'brace')).toBe(false);
    });
  });

  describe('empty tiles', () => {
    test('skips tiles with no letter', () => {
      const partial = [
        { letter: 'C', color: 'green' },
        { letter: '', color: 'gray' },
        { letter: '', color: 'gray' },
        { letter: '', color: 'gray' },
        { letter: '', color: 'gray' },
      ];
      expect(matchesGuess(partial, 'crane')).toBe(true);
      expect(matchesGuess(partial, 'crimp')).toBe(true);
      expect(matchesGuess(partial, 'brine')).toBe(false);
    });
  });
});
