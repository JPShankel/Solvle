import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { useWordBank } from './WordBankContext';
import WordGuess from './WordGuess';
import { matchesGuess } from './wordMatcher';

const EMPTY_TILES = () => Array.from({ length: 5 }, () => ({ letter: '', color: 'gray' }));
const SOLUTION_ROW_HEIGHT = 38;
const SOLUTION_LIST_HEIGHT = 320;
const SOLUTION_OVERSCAN = 5;

function VirtualizedSolutions({ solutions, onSolutionClick }) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef(null);
  const visibleCount = Math.ceil(SOLUTION_LIST_HEIGHT / SOLUTION_ROW_HEIGHT);
  const startIndex = Math.max(0, Math.floor(scrollTop / SOLUTION_ROW_HEIGHT) - SOLUTION_OVERSCAN);
  const endIndex = Math.min(
    solutions.length,
    startIndex + visibleCount + SOLUTION_OVERSCAN * 2
  );
  const visibleSolutions = solutions.slice(startIndex, endIndex);

  useEffect(() => {
    setScrollTop(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [solutions]);

  return (
    <div
      ref={scrollRef}
      className="solutions-scroll"
      onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div
        className="solutions-spacer"
        style={{ height: solutions.length * SOLUTION_ROW_HEIGHT }}
      >
        {visibleSolutions.map((word, i) => {
          const index = startIndex + i;

          return (
            <button
              key={word}
              className="solution-btn"
              style={{ transform: `translateY(${index * SOLUTION_ROW_HEIGHT}px)` }}
              value={word}
              onClick={onSolutionClick}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
      }
    }
    setSolutions(results);
  }

  const cachedFilter = useCallback(filterSolutions,[guesses,wordBank]);

  useEffect(()=>
  {
    cachedFilter();
  }
  ,[cachedFilter]);

  const handleSolutionClick = (e) =>
  {
    const {value} = e.currentTarget;
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
              <p className="solution-count">{solutions.length} suggestions</p>
              {solutions.length === 0
                ? <p className="no-solutions">No possible solutions found.</p>
                : <VirtualizedSolutions solutions={solutions} onSolutionClick={handleSolutionClick} />
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
