import { useEffect, useState } from 'react';
import './App.css';
import { useWordBank } from './WordBankContext';
import WordGuess from './WordGuess';
import { matchesGuess } from './wordMatcher';

const EMPTY_TILES = () => Array.from({ length: 5 }, () => ({ letter: '', color: 'gray' }));

function App() {
  const wordBank = useWordBank();
  const [guesses, setGuesses] = useState([]);
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

  useEffect(()=>
  {
    filterSolutions();
  }
  ,[guesses]);

  const handleSolutionClick = (e) =>
  {
    const {value} = e.target;
    console.log(value);
    const tiles = value.toUpperCase().split('').map(l => ({ letter: l, color: 'gray' }));
    setGuesses(prev => [...prev, { id: nextId, tiles: tiles }]);
    setNextId(prev => prev + 1);
  }


  return (
    <div className="App">
      <h1>Wordle Solver</h1>
      <div className="solver">
        <div className="guesses">
          <h2>Guesses</h2>
          <ul>
            {guesses.length === 0
              ? <li className="empty-guesses">Click <strong>+ Add Guess</strong> to get started</li>
              : guesses.map(g => (
                  <li key={g.id} className="guess-row">
                    <WordGuess tiles={g.tiles} onTilesChange={newTiles => updateTiles(g.id, newTiles)} showDialog={true} />
                    <button className="remove-btn" onClick={() => removeGuess(g.id)}>✕</button>
                  </li>
                ))
            }
          </ul>
          <div className="guess-actions">
            <button className="add-btn" onClick={addGuess}>+ Add Guess</button>
          </div>
          {guesses.length > 0 && (
            <div className="solutions">
              <h2>Possible Solutions</h2>
              {solutions.length === 0
                ? <p className="no-solutions">No possible solutions found.</p>
                : <ul>
                    {solutions.map((word, i) => (
                      <button key={i} className="solution-btn" value={word} onClick={handleSolutionClick}>{word}</button>
                    ))}
                  </ul>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
