import { useCallback, useEffect, useRef, useState } from "react";


export default function useDebounceAction<T>(
    action: (arg: T) => void,
    delay: number = 300
): ((arg: T) => void) {

    const [counter, setCounter] = useState<T>();
    
    const isFirstRender = useRef(true);

    const debouncedAction = useCallback((arg: T) => {
        setCounter((prev) => arg);
    },[] )

    useEffect(()=>{
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const id = setTimeout(() => {
            action(counter);
        }, delay);

        return () => {
            clearTimeout(id);
        };
    }, [counter])

    return debouncedAction;
}