import { useEffect, useRef, useState } from 'react';
import './WordGuessDialog.css';

const COLORS = ['gray', 'yellow', 'green'];

export default function WordGuessDialog({ tiles, onSave, onClose }) {
  const dialogRef = useRef(null);
  const [draft, setDraft] = useState(tiles.map(t => ({ ...t })));

  useEffect(() => {
    dialogRef.current.showModal();
  }, []);

  function updateDraft(index, patch) {
    setDraft(prev => prev.map((t, i) => i === index ? { ...t, ...patch } : t));
  }

  function handleKeyDown(e, index) {
    if (/^[a-zA-Z]$/.test(e.key)) {
      updateDraft(index, { letter: e.key.toUpperCase() });
      e.preventDefault();
    }
    if (e.key === 'Backspace') {
      updateDraft(index, { letter: '' });
      e.preventDefault();
    }
  }

  function cycleColor(index) {
    const current = draft[index].color;
    const next = COLORS[(COLORS.indexOf(current) + 1) % COLORS.length];
    updateDraft(index, { color: next });
  }

  function handleSave() {
    onSave(draft);
    onClose();
  }

  return (
    <dialog ref={dialogRef} className="guess-dialog" onClose={onClose}>
      <h3>Edit Guess</h3>
      <div className="dialog-tiles">
        {draft.map((tile, i) => (
          <div key={i} className="dialog-tile">
            <div className={`dialog-letter ${tile.color}`} onClick={() => cycleColor(i)}>
              <input
                maxLength={1}
                value={tile.letter}
                onKeyDown={e => handleKeyDown(e, i)}
                onChange={() => {}}
                onClick={e => e.stopPropagation()}
                autoFocus={i === 0}
              />
            </div>
            <div className="color-buttons">
              {COLORS.map(c => (
                <button
                  key={c}
                  className={`color-btn ${c} ${tile.color === c ? 'active' : ''}`}
                  onClick={() => updateDraft(i, { color: c })}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="dialog-actions">
        <button onClick={onClose}>Cancel</button>
        <button className="save-btn" onClick={handleSave}>Save</button>
      </div>
    </dialog>
  );
}
