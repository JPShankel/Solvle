# Solvle

A Wordle solver that narrows down possible answers based on your guesses and their results.

## How to use

1. Click **+ Add Guess** to add a guess row.
2. Click the guess row to open the edit dialog.
3. Enter each letter using the on-screen QWERTY keyboard or your physical keyboard.
4. Set the color of each tile to match the result Wordle gave you:
   - **Green** — correct letter, correct position
   - **Yellow** — correct letter, wrong position
   - **Gray** — letter not in the word (at this frequency)
5. Click **Save**. Possible solutions update automatically below your guesses.
6. Click any solution to add it as your next guess.
7. Keep adding guesses until the solution is found.

## Tile colors

You can change a tile's color two ways inside the edit dialog:

- Click the tile itself to cycle through gray → yellow → green.
- Click one of the three colored dots below the tile to set it directly.

## Running locally

```bash
npm install
npm start
```

Opens at `http://localhost:3000`.

## Running tests

```bash
npm test
```

## Building for production

```bash
npm run build
```

Output is placed in the `build/` folder.
