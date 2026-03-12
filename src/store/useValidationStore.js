import { create } from 'zustand';

const useValidationStore = create((set) => ({
  messages: [],
  lastValidatedAt: null,

  setMessages: (messages) =>
    set({
      messages,
      lastValidatedAt: Date.now(),
    }),
}));

export default useValidationStore;
