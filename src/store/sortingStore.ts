import { create } from 'zustand';
import { generateMergeSortFrames } from '../algorithms/mergeSortGenerator';
import type { SortingFrame } from '../algorithms/mergeSortGenerator';

type SortingStore = {
  arraySize: number;
  speed: number;
  isPlaying: boolean;
  currentStep: number;
  history: SortingFrame[];

  // Actions
  setArraySize: (size: number) => void;
  setSpeed: (speed: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  jumpToStep: (step: number) => void;
  reset: () => void;
};

const generateRandomArray = (size: number) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
};

export const useSortingStore = create<SortingStore>((set, get) => ({
  arraySize: 16,
  speed: 300,
  isPlaying: false,
  currentStep: 0,
  history: generateMergeSortFrames(generateRandomArray(16)),

  setArraySize: (size) => {
    const newArray = generateRandomArray(size);
    const newHistory = generateMergeSortFrames(newArray);
    set({
      arraySize: size,
      history: newHistory,
      currentStep: 0,
      isPlaying: false
    });
  },

  setSpeed: (speed) => set({ speed }),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  nextStep: () => {
    const { currentStep, history } = get();
    if (currentStep < history.length - 1) {
      set({ currentStep: currentStep + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  jumpToStep: (step) => {
    const { history } = get();
    if (step >= 0 && step < history.length) {
       set({ currentStep: step });
    }
  },

  reset: () => {
    const { arraySize } = get();
    const newArray = generateRandomArray(arraySize);
    const newHistory = generateMergeSortFrames(newArray);
    set({
      history: newHistory,
      currentStep: 0,
      isPlaying: false
    });
  }
}));
