import { useCounterStore } from "../stores/counter.store"

const Button = ():React.JSX.Element => {

    const counter = useCounterStore( state => state.counter );
    const setCounter = useCounterStore( state => state.setCounter );

    return (
        <div className="flex gap-2">
            <button 
                className="h-[40px] flex items-center justify-center bg-primary text-white w-[40px] rounded-md"
                onClick={ ()=> setCounter(counter - 1) }
            >
                -
            </button>
            <button 
                className="h-[40px] bg-primary text-white px-5 rounded-md border border-white transition-all"
            >
                Couter zustand { counter }
            </button>
            <button 
                className="h-[40px] flex items-center justify-center bg-primary text-white w-[40px] rounded-md"
                onClick={ ()=> setCounter(counter + 1) }
            >
                +
            </button>
        </div>
    )
}

export { Button }