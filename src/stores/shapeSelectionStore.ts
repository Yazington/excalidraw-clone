import { create } from 'zustand';

export type Item = 'Pointer' | 'Circle' | 'Square' | 'Arrow';

interface ShapeSelectionStore {
  selectedItem: Item;
  selectItem: (newShape: Item) => void;
}

const useItemSelectionStore = create<ShapeSelectionStore>((set) => ({
  selectedItem: 'Pointer',
  selectItem: (newItem: Item) => set(() => ({ selectedItem: newItem })),
}));

export default useItemSelectionStore;
