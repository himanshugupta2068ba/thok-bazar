const buckets = new Map();

const rateLimit = ({ windowMs = 60_000, max = 60, message = 'Too many requests. Please try again later.' } = {}) =>
    (req, res, next) => {
        const now = Date.now();
        const key = `${req.ip}:${req.baseUrl}:${req.route?.path || req.path}`;
        const current = buckets.get(key);
        const bucket = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;
        bucket.count += 1;
        buckets.set(key, bucket);
        res.setHeader('RateLimit-Limit', max);
        res.setHeader('RateLimit-Remaining', Math.max(0, max - bucket.count));
        res.setHeader('RateLimit-Reset', Math.ceil(bucket.resetAt / 1000));
        if (bucket.count > max) {
            res.setHeader('Retry-After', Math.ceil((bucket.resetAt - now) / 1000));
            return res.status(429).json({ message });
        }
        next();
    };

setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets.entries()) if (bucket.resetAt <= now) buckets.delete(key);
}, 5 * 60_000).unref();

module.exports = rateLimit;
