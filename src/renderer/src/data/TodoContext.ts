import { sampleState } from './TodoData';
import { createContext } from 'react';
import { TahiState } from './TahiState';

export const TodoContext = createContext<{
  tahiState: TahiState;
  setTahiState: React.Dispatch<React.SetStateAction<TahiState>>;
}>({ tahiState: sampleState, setTahiState: () => {} });
