import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

const WordBankContext = createContext([]);

async function fetchWordBank() {
  const res = await fetch('/word-bank.csv');
  const text = await res.text();
  return text.split('\n').map(w => w.trim()).filter(Boolean);
}

export function WordBankProvider({ children }) {
  const { data: wordBank = [] } = useQuery({
    queryKey: ['wordBank'],
    queryFn: fetchWordBank,
  });

  return (
    <WordBankContext.Provider value={wordBank}>
      {children}
    </WordBankContext.Provider>
  );
}

export function useWordBank() {
  return useContext(WordBankContext);
}
