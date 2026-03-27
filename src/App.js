import { useState } from 'react';
import './App.css';
import { useWordBank } from './WordBankContext';
import WordGuess from './WordGuess';

function App() {
  const wordBank = useWordBank();
  const solutions = wordBank.slice(0, 10);
  const [guesses, setGuesses] = useState([{ id: 0 }]);
  const [nextId, setNextId] = useState(1);

  function addGuess() {
    setGuesses(prev => [...prev, { id: nextId }]);
    setNextId(prev => prev + 1);
  }

  function removeGuess(id) {
    setGuesses(prev => prev.filter(g => g.id !== id));
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
                <WordGuess />
                <button className="remove-btn" onClick={() => removeGuess(g.id)}>✕</button>
              </li>
            ))}
          </ul>
          <button className="add-btn" onClick={addGuess}>+ Add Guess</button>
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
