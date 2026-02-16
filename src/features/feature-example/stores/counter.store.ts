import { create, type StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface CounterState {
    counter: number;
}

interface Actions {
    setCounter: (value: number) => void;
}

const storeAPI: StateCreator<CounterState & Actions, [["zustand/devtools", never]]> = (set) =>({
    counter: 0,
    
    setCounter: (value: number) => set(({
        counter: value
    }), false, 'setCounter' )
});

export const useCounterStore = create<CounterState & Actions>()(
    persist(
        devtools(storeAPI, { name: "counter-store" }),
        { name: "counter-store" }
    )
);