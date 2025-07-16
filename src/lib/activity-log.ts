
'use client';

export type Activity = {
    id: string;
    message: string;
    timestamp: string;
};

const ACTIVITY_LOG_KEY = 'eduarchive_activity_log';
const MAX_LOG_ENTRIES = 5;

export const getActivities = (): Activity[] => {
    if (typeof window === 'undefined') {
        return [];
    }
    try {
        const storedActivities = localStorage.getItem(ACTIVITY_LOG_KEY);
        return storedActivities ? JSON.parse(storedActivities) : [];
    } catch (error) {
        console.error("Failed to get activities from localStorage", error);
        return [];
    }
};

export const logActivity = (message: string): void => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        const newActivity: Activity = {
            id: crypto.randomUUID(),
            message,
            timestamp: new Date().toISOString(),
        };

        const currentActivities = getActivities();
        const updatedActivities = [newActivity, ...currentActivities].slice(0, MAX_LOG_ENTRIES);
        
        localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(updatedActivities));
    } catch (error) {
         console.error("Failed to log activity to localStorage", error);
    }
};
