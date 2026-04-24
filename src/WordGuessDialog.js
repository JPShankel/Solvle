import { useEffect, useRef, useState } from 'react';
import './WordGuessDialog.css';

const COLORS = ['gray', 'yellow', 'green'];
const QWERTY = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map(r => r.split(''));

export default function WordGuessDialog({ tiles, onSave, onClose }) {
  const dialogRef = useRef(null);
  const inputRefs = useRef([]);
  const [draft, setDraft] = useState(tiles.map(t => ({ ...t })));
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    dialogRef.current.showModal();
  }, []);

  function updateDraft(index, patch) {
    setDraft(prev => prev.map((t, i) => i === index ? { ...t, ...patch } : t));
  }

  function focusNextTile(index) {
    inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(e, index) {
    if (/^[a-zA-Z]$/.test(e.key)) {
      updateDraft(index, { letter: e.key.toUpperCase() });
      focusNextTile(index);
      e.preventDefault();
    }
    if (e.key === 'Backspace') {
      updateDraft(index, { letter: '' });
      if (index > 0)
      {
        inputRefs.current[index-1]?.focus();
      }
      e.preventDefault();
    }
  }

  function handleInputChange(e, index) {
    const letters = e.target.value.toUpperCase().match(/[A-Z]/g);

    if (!letters) {
      updateDraft(index, { letter: '' });
      return;
    }

    updateDraft(index, { letter: letters[letters.length - 1] });
    focusNextTile(index);
  }

  function cycleColor(index) {
    const current = draft[index].color;
    const next = COLORS[(COLORS.indexOf(current) + 1) % COLORS.length];
    updateDraft(index, { color: next });
  }

  function handleLetterClick(letter) {
    updateDraft(focusedIndex, { letter });
    inputRefs.current[focusedIndex + 1]?.focus();
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
          <div key={i} className={`dialog-tile ${focusedIndex === i ? 'focused' : ''}`}>
            <div className={`dialog-letter ${tile.color}`} onClick={() => cycleColor(i)}>
              <input
                ref={el => inputRefs.current[i] = el}
                type="text"
                inputMode="text"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                aria-label={`Letter ${i + 1}`}
                value={tile.letter}
                onKeyDown={e => handleKeyDown(e, i)}
                onChange={e => handleInputChange(e, i)}
                onClick={e => e.stopPropagation()}
                onFocus={() => setFocusedIndex(i)}
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
      <div className="letter-selector">
        {QWERTY.map((row, r) => (
          <div key={r} className="letter-row">
            {row.map(l => (
              <button key={l} className="letter-key" onClick={() => handleLetterClick(l)}>{l}</button>
            ))}
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
