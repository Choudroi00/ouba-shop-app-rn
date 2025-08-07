/**
 * Example usage of the improved useMutationTracker hook
 * 
 * This demonstrates how to use the new listener-based API
 */

import { useEffect } from "react";
import { useMutationTracker } from "./useMutationTracker";

export const ExampleComponent = () => {
    const mutationTracker = useMutationTracker<{ id: string; name: string }, Error>('create-product');

    useEffect(() => {
        // Add a listener for mutation state changes
        const removeListener = mutationTracker.addListener((state) => {
            if (state.isSuccess) {
                console.log('Product created successfully:', state.data);
                // Show success notification
            } else if (state.isError) {
                console.error('Failed to create product:', state.error);
                // Show error notification
            }
        });

        // Cleanup listener on unmount
        return removeListener;
    }, [mutationTracker]);

    useEffect(() => {
        // Add another listener for analytics tracking
        const removeAnalyticsListener = mutationTracker.addListener((state) => {
            if (state.isSuccess) {
                // Track successful product creation
                // analytics.track('product_created', { productId: state.data?.id });
            }
        });

        return removeAnalyticsListener;
    }, [mutationTracker]);

    // Example of JSX usage (commented out since this is a .ts file)
    /*
    return (
        <div>
            <button disabled={mutationTracker.isPending}>
                {mutationTracker.isPending ? 'Creating...' : 'Create Product'}
            </button>
            
            {mutationTracker.isError && (
                <div className="error">
                    Error: {mutationTracker.error?.message}
                </div>
            )}
        </div>
    );
    */
};

/**
 * Alternative pattern: Using listeners in custom hooks
 */
export const useProductCreationNotifications = () => {
    const mutationTracker = useMutationTracker<{ id: string; name: string }, Error>('create-product');

    useEffect(() => {
        const removeListener = mutationTracker.addListener((state) => {
            if (state.isSuccess) {
                // Show toast notification
                console.log('✅ Product created successfully!');
            } else if (state.isError) {
                // Show error notification
                console.log('❌ Failed to create product');
            }
        });

        return removeListener;
    }, [mutationTracker]);

    return mutationTracker;
};
