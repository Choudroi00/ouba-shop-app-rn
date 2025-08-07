import { useMutationState, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

type MutationListener<TData = unknown, TError = unknown> = (state: {
    status: 'idle' | 'pending' | 'success' | 'error';
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    data: TData | null;
    error: TError | null;
}) => void;

type MutationTrackerState<TData = unknown, TError = unknown> = {
    status: 'idle' | 'pending' | 'success' | 'error';
    addListener: (listener: MutationListener<TData, TError>) => () => void;
    removeListener: (listener: MutationListener<TData, TError>) => void;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    data: TData | null;
    error: TError | null;
};

export const useMutationTracker = <TData = unknown, TError = unknown>(key: string): MutationTrackerState<TData, TError> => {
    const queryClient = useQueryClient();
    const listenersRef = useRef<Set<MutationListener<TData, TError>>>(new Set());
    const [currentState, setCurrentState] = useState<{
        status: 'idle' | 'pending' | 'success' | 'error';
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        data: TData | null;
        error: TError | null;
    }>({
        status: 'idle',
        isPending: false,
        isSuccess: false,
        isError: false,
        data: null,
        error: null
    });

    const state = useMutationState({
        filters: { mutationKey: [key] },
        select: (mutation) => {
            
            const latest = mutation.state;
            return {
                status: latest?.status || 'idle',
                isPending: latest?.status === 'pending',
                isSuccess: latest?.status === 'success',
                isError: latest?.status === 'error',
                data: (latest?.data as TData) ?? null,
                error: (latest?.error as TError) ?? null
            };
        }
    });

    // Listener management functions
    const addListener = useCallback((listener: MutationListener<TData, TError>) => {
        listenersRef.current.add(listener);
        
        // Return cleanup function
        return () => {
            listenersRef.current.delete(listener);
        };
    }, []);

    const removeListener = useCallback((listener: MutationListener<TData, TError>) => {
        listenersRef.current.delete(listener);
    }, []);

    // Notify all listeners when state changes
    const notifyListeners = useCallback((newState: typeof currentState) => {
        listenersRef.current.forEach(listener => {
            try {
                listener(newState);
            } catch (error) {
                console.error('Error in mutation listener:', error);
            }
        });
    }, []);

    const reset = useCallback(() => {
        queryClient.getMutationCache().findAll({ mutationKey: [key] }).forEach((mutation) => {
            if (mutation.state.status !== 'idle') {
                mutation.state.status = 'idle';
                mutation.state.data = undefined;
                mutation.state.error = null;
            }
        });
    }, [queryClient, key]);

    // Update current state and notify listeners when mutation state changes
    useEffect(() => {
        const latestState = state[state.length - 1];
        if (latestState) {
            const newState = {
                status: latestState.status,
                isPending: latestState.isPending,
                isSuccess: latestState.isSuccess,
                isError: latestState.isError,
                data: latestState.data,
                error: latestState.error
            };
            console.log('state changed');
            
            
            // Only update and notify if state actually changed
            if (JSON.stringify(newState) !== JSON.stringify(currentState)) {
                setCurrentState(newState);
                notifyListeners(newState);
            }
        }
    }, [state, currentState, notifyListeners]);

    // Auto-reset after success or error
    useEffect(() => {
        if (Array.isArray(state) && state.some(m => m.status === 'success' || m.status === 'error')) {
            const timeoutId = setTimeout(() => {
                reset();
            }, 1000);
            
            return () => clearTimeout(timeoutId);
        }
    }, [state, reset]);

    // Cleanup listeners on unmount
    useEffect(() => {
        return () => {
            listenersRef.current.clear();
        };
    }, []);

    return {
        ...currentState,
        addListener,
        removeListener
    };
};