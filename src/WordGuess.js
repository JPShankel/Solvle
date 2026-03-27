import { useState } from 'react';
import './WordGuess.css';
import WordGuessDialog from './WordGuessDialog';

function LetterTile({ letter, color }) {
  return (
    <div className={`letter-tile ${color}`}>
      <span>{letter}</span>
    </div>
  );
}

export default function WordGuess({ onChange }) {
  const [tiles, setTiles] = useState(
    Array.from({ length: 5 }, () => ({ letter: '', color: 'gray' }))
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleSave(newTiles) {
    setTiles(newTiles);
    onChange?.(newTiles);
  }

  return (
    <>
      <div className="word-guess" onClick={() => setDialogOpen(true)}>
        {tiles.map((tile, i) => (
          <LetterTile key={i} letter={tile.letter} color={tile.color} />
        ))}
      </div>
      {dialogOpen && (
        <WordGuessDialog
          tiles={tiles}
          onSave={handleSave}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
}
