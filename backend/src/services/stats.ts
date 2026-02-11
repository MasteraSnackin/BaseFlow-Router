
interface PlatformStats {
    totalRequests: number;
    successfulQuotes: number;
    failedQuotes: number;
    totalVolumeUSD: number;
    startTime: string;
}

// In-memory store (would be Redis in production)
let stats: PlatformStats = {
    totalRequests: 0,
    successfulQuotes: 0,
    failedQuotes: 0,
    totalVolumeUSD: 0,
    startTime: new Date().toISOString()
};

export const statsService = {
    getStats: () => ({ ...stats }),

    incrementTotalRequests: () => {
        stats.totalRequests++;
    },

    recordQuote: (success: boolean, volumeUSD: number = 0) => {
        if (success) {
            stats.successfulQuotes++;
            stats.totalVolumeUSD += volumeUSD;
        } else {
            stats.failedQuotes++;
        }
    },

    reset: () => {
        stats = {
            totalRequests: 0,
            successfulQuotes: 0,
            failedQuotes: 0,
            totalVolumeUSD: 0,
            startTime: new Date().toISOString()
        };
    }
};
