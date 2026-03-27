import { useState } from 'react';
import './App.css';
import { useWordBank } from './WordBankContext';
import WordGuess from './WordGuess';
import { matchesGuess } from './wordMatcher';

const EMPTY_TILES = () => Array.from({ length: 5 }, () => ({ letter: '', color: 'gray' }));

function App() {
  const wordBank = useWordBank();
  const [guesses, setGuesses] = useState([{ id: 0, tiles: EMPTY_TILES() }]);
  const [nextId, setNextId] = useState(1);
  const [solutions, setSolutions] = useState([]);

  function addGuess() {
    setGuesses(prev => [...prev, { id: nextId, tiles: EMPTY_TILES() }]);
    setNextId(prev => prev + 1);
  }

  function removeGuess(id) {
    setGuesses(prev => prev.filter(g => g.id !== id));
  }

  function updateTiles(id, newTiles) {
    setGuesses(prev => prev.map(g => g.id === id ? { ...g, tiles: newTiles } : g));
  }

  function filterSolutions() {
    const results = [];
    for (const word of wordBank) {
      if (guesses.every(g => matchesGuess(g.tiles, word))) {
        results.push(word);
        if (results.length === 10) break;
      }
    }
    setSolutions(results);
  }

  return (
    <div className="App">
      <h1>Wordle Solver</h1>
      <div className="solver">
        <div className="guesses">
          <h2>Guesses</h2>
          <ul>
            {guesses.map(g => (
              <li key={g.id} className="guess-row">
                <WordGuess tiles={g.tiles} onTilesChange={newTiles => updateTiles(g.id, newTiles)} />
                <button className="remove-btn" onClick={() => removeGuess(g.id)}>✕</button>
              </li>
            ))}
          </ul>
          <div className="guess-actions">
            <button className="add-btn" onClick={addGuess}>+ Add Guess</button>
            <button className="filter-btn" onClick={filterSolutions}>Filter Solutions</button>
          </div>
        </div>
        <div className="solutions">
          <h2>Possible Solutions</h2>
          <ul>
            {solutions.map((word, i) => (
              <li key={i}>{word}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
