
import { useState, useEffect } from 'react';
import { getStats, getVenues, type PlatformStats, type Venue } from '../lib/api';

export function usePlatformData() {
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial fetch
    useEffect(() => {
        const init = async () => {
            try {
                const [statsRes, venuesRes] = await Promise.all([
                    getStats(),
                    getVenues()
                ]);

                if (statsRes.success) setStats(statsRes.data);
                if (venuesRes.success) setVenues(venuesRes.data);
            } catch (e) {
                console.error('Failed to fetch platform data', e);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    // Poll stats every 5 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await getStats();
                if (res.success) setStats(res.data);
            } catch (e) {
                console.error('Failed to poll stats', e);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return { stats, venues, loading };
}
