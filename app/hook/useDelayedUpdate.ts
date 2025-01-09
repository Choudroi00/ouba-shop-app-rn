import { DependencyList, useEffect } from "react";



export const useDelayedEffect = (effect: () => void, delay: number, deps: DependencyList) => {
    useEffect(() => {
        const timer = setTimeout(effect, delay);
        return () => clearTimeout(timer);
    }, [effect, delay, ...deps]);
}