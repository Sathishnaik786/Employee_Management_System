const { redis } = require('@lib/redis');
const logger = require('@lib/logger');

class CacheService {
    /**
     * Get data from cache or fetch from source and cache it.
     * @param {string} key - Cache key
     * @param {number} ttl - Time to live in seconds (default 3600)
     * @param {function} fetchFn - Async function to fetch data if not in cache
     * @returns {any} Cached or fetched data
     */
    async getOrSet(key, ttl = 3600, fetchFn) {
        try {
            // 1. Try to get from Redis
            const cachedData = await redis.get(key);
            if (cachedData) {
                logger.info('Cache hit', { key });
                return JSON.parse(cachedData);
            }

            // 2. Cache miss -> Fetch from source
            logger.info('Cache miss', { key });
            const freshData = await fetchFn();

            // 3. Save to Redis
            if (freshData !== undefined && freshData !== null) {
                await redis.set(key, JSON.stringify(freshData), 'EX', ttl);
            }

            return freshData;
        } catch (error) {
            logger.error('Cache service error', { key, error: error.message });
            // Fallback to fetch on redis error
            return await fetchFn();
        }
    }

    /**
     * Invalidate a cache key.
     * @param {string} key - Cache key
     */
    async invalidate(key) {
        try {
            await redis.del(key);
            logger.info('Cache invalidated', { key });
        } catch (error) {
            logger.error('Cache invalidation error', { key, error: error.message });
        }
    }

    /**
     * Invalidate keys matching a pattern.
     * @param {string} pattern - Redis pattern (e.g. iers:student:*)
     */
    async invalidatePattern(pattern) {
        try {
            const keys = await redis.keys(pattern);
            if (keys.length > 0) {
                await redis.del(...keys);
                logger.info('Cache pattern invalidated', { pattern, count: keys.length });
            }
        } catch (error) {
            logger.error('Cache pattern invalidation error', { pattern, error: error.message });
        }
    }
}

module.exports = new CacheService();
