import { create } from 'zustand'

interface UiState {
  loading: boolean
  error: string
  setLoading: (value: boolean) => void
  setError: (message: string) => void
  clearError: () => void
}

export const useUiStore = create<UiState>((set) => ({
  loading: false,
  error: '',
  setLoading: (value) => set({ loading: value }),
  setError: (message) => set({ error: message }),
  clearError: () => set({ error: '' }),
}))
