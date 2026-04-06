// src/hooks/useSubmissionPolling.ts
// Custom hook สำหรับ poll submission status หลังจากกด verify (lightweight)

import { useState, useEffect, useCallback, useRef } from 'react';
import { submissionService } from '@/services/submission.service';

export interface UseSubmissionPollingOptions {
    /** Polling interval in ms (default: 3000) */
    interval?: number;
    /** Enable/disable polling (default: true) */
    enabled?: boolean;
    /** Max polling attempts before giving up (default: 60 = ~3 minutes) */
    maxAttempts?: number;
    /** Callback when ALL jobs complete (inProgressCount = 0 after seeing > 0) */
    onAllComplete?: () => void;
    /** Callback when max attempts reached */
    onTimeout?: () => void;
}

export interface UseSubmissionPollingResult {
    /** Whether polling is currently active */
    isPolling: boolean;
    /** Number of submissions currently IN_PROGRESS */
    inProgressCount: number;
    /** Number of polling attempts made */
    attempts: number;
    /** Start polling */
    startPolling: () => void;
    /** Stop polling */
    stopPolling: () => void;
}

/**
 * useSubmissionPolling Hook
 * 
 * Poll lightweight /submissions/status-summary endpoint.
 * Waits for at least 1 IN_PROGRESS, then stops when count becomes 0.
 */
export function useSubmissionPolling(options: UseSubmissionPollingOptions = {}): UseSubmissionPollingResult {
    const {
        interval = 3000,
        enabled = true,
        maxAttempts = 60,
        onAllComplete,
        onTimeout,
    } = options;

    const [isPolling, setIsPolling] = useState(false);
    const [inProgressCount, setInProgressCount] = useState(0);
    const [attempts, setAttempts] = useState(0);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    // Track if we've seen at least 1 IN_PROGRESS job
    const hasSeenInProgressRef = useRef(false);
    // Store callbacks in refs to avoid dependency issues
    const onAllCompleteRef = useRef(onAllComplete);
    const onTimeoutRef = useRef(onTimeout);

    // Keep refs updated
    useEffect(() => {
        onAllCompleteRef.current = onAllComplete;
        onTimeoutRef.current = onTimeout;
    }, [onAllComplete, onTimeout]);

    /**
     * Clear polling interval
     */
    const clearPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsPolling(false);
        hasSeenInProgressRef.current = false;
    }, []);

    /**
     * Poll status summary once (lightweight ~100 bytes)
     */
    const pollOnce = useCallback(async () => {
        try {
            const { inProgressCount: count } = await submissionService.getStatusSummary();
            setInProgressCount(count);

            // If we see IN_PROGRESS > 0, mark that we've seen jobs
            if (count > 0) {
                hasSeenInProgressRef.current = true;
            }

            // Only stop if:
            // 1. We've seen at least 1 IN_PROGRESS before
            // 2. AND now count is 0
            if (hasSeenInProgressRef.current && count === 0) {
                clearPolling();
                onAllCompleteRef.current?.();
                return;
            }

            // Check max attempts
            setAttempts((prev) => {
                const next = prev + 1;
                if (next >= maxAttempts) {
                    clearPolling();
                    onTimeoutRef.current?.();
                }
                return next;
            });

        } catch (err) {
            console.error('Polling error:', err);
            // Don't stop polling on error, just try again next interval
        }
    }, [clearPolling, maxAttempts]);

    /**
     * Start polling
     */
    const startPolling = useCallback(() => {
        if (!enabled) return;

        // Clear any existing polling
        clearPolling();

        // Reset state
        setAttempts(0);
        setIsPolling(true);
        hasSeenInProgressRef.current = false;

        // Start polling interval
        intervalRef.current = setInterval(pollOnce, interval);

        // Poll immediately after a short delay (give backend time to update status)
        setTimeout(pollOnce, 500);
    }, [enabled, clearPolling, interval, pollOnce]);

    /**
     * Stop polling manually
     */
    const stopPolling = useCallback(() => {
        clearPolling();
    }, [clearPolling]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return {
        isPolling,
        inProgressCount,
        attempts,
        startPolling,
        stopPolling,
    };
}
