import { fireEvent, render, screen } from '@testing-library/react';
import WordGuessDialog from './WordGuessDialog';

const EMPTY_TILES = Array.from({ length: 5 }, () => ({ letter: '', color: 'gray' }));

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = jest.fn();
});

test('sets a tile letter from input change events', () => {
  const handleSave = jest.fn();

  render(
    <WordGuessDialog
      tiles={EMPTY_TILES}
      onSave={handleSave}
      onClose={() => {}}
    />
  );

  fireEvent.change(screen.getByLabelText('Letter 1'), { target: { value: 's' } });
  fireEvent.click(screen.getByText('Save'));

  expect(handleSave).toHaveBeenCalledWith([
    { letter: 'S', color: 'gray' },
    { letter: '', color: 'gray' },
    { letter: '', color: 'gray' },
    { letter: '', color: 'gray' },
    { letter: '', color: 'gray' },
  ]);
});
