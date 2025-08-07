import { useEffect, useState } from "react"


export const useLockedState = <T>(initialValue: T, lock: (state: T, setter: React.Dispatch<React.SetStateAction<T>>) => void, deps: any[] = [] ): T  => {
    const [localState, setLocalState] = useState(initialValue)
    useEffect(() => {
        lock(initialValue, setLocalState)
    }, [initialValue ,...deps])

    return localState
}