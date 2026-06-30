import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = Redis.fromEnv();

export const loginRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
        5,
        "1 m"
    ),
});

export const signupRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
        3,
        "1 m"
    ),
});

export const joinGroupRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(
        10,
        "1 m"
    ),
});