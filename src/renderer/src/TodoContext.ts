import { sampleState, TahiState } from './TodoData'
import { createContext } from 'react'

export const TodoContext = createContext<{
  tahiState: TahiState
  setTahiState: React.Dispatch<React.SetStateAction<TahiState>>
}>({ tahiState: sampleState, setTahiState: () => {} })
