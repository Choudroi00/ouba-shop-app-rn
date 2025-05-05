import { useCallback, useRef } from "react";


export default function useDebounceAction<T>(
    action: (arg: T) => void,
    delay: number = 300
): ((arg: T) => void) {

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedAction = useCallback((arg: T) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            action(arg);
        }, delay);
    }, [action, delay]);

    return debouncedAction;
}