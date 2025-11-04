/**
 * Cost tracking module using Redis for API usage monitoring
 *
 * This module tracks API costs in Redis and enforces spending limits.
 * Uses Bun's native Redis client with pricing data from LiteLLM.
 */

import { redis, RedisClient } from "bun";
import modelPricingData from "./model-pricing.json";

const REDIS_KEY_PREFIX = "api_cost:";
const REDIS_TOTAL_COST_KEY = `${REDIS_KEY_PREFIX}total`;

// Current model being used (from quiz-generator.ts)
const CURRENT_MODEL = "gemini-2.5-flash";

export interface CostTrackingResult {
  allowed: boolean;
  currentCost: number;
  costLimit: number;
  requestCost: number;
  remainingBudget: number;
  error?: string;
}

export interface TokenUsage {
  inputTokens: number | undefined;
  outputTokens: number | undefined;
  model?: string;
}

/**
 * Validate token usage data
 */
function validateTokenUsage(usage: TokenUsage): { valid: boolean; inputTokens: number; outputTokens: number } {
  const inputTokens = typeof usage.inputTokens === 'number' && !isNaN(usage.inputTokens) ? usage.inputTokens : 0;
  const outputTokens = typeof usage.outputTokens === 'number' && !isNaN(usage.outputTokens) ? usage.outputTokens : 0;

  const valid = inputTokens >= 0 && outputTokens >= 0 && isFinite(inputTokens) && isFinite(outputTokens);

  return { valid, inputTokens, outputTokens };
}

/**
 * Calculate the cost of a request based on token usage
 * Uses pricing data from LiteLLM's official pricing JSON
 * Source: https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json
 */
export function calculateCost(usage: TokenUsage): number {
  // Validate and sanitize token counts
  const { valid, inputTokens, outputTokens } = validateTokenUsage(usage);

  if (!valid) {
    console.error("Invalid token usage data:", usage);
    return 0;
  }

  const model = usage.model || CURRENT_MODEL;
  const pricing = modelPricingData.models[model as keyof typeof modelPricingData.models];

  if (!pricing) {
    console.warn(`Unknown model: ${model}, using default Gemini 1.5 Flash pricing`);
    // Fallback to Gemini 1.5 Flash pricing (per token)
    const inputCost = inputTokens * 7.5e-8;  // $0.000000075 per token
    const outputCost = outputTokens * 3e-7;   // $0.0000003 per token
    return inputCost + outputCost;
  }

  // Calculate cost based on per-token pricing
  const inputCost = inputTokens * pricing.inputCostPerToken;
  const outputCost = outputTokens * pricing.outputCostPerToken;

  const totalCost = inputCost + outputCost;

  // Final validation
  if (!isFinite(totalCost) || isNaN(totalCost)) {
    console.error("Cost calculation resulted in invalid value:", {
      inputCost,
      outputCost,
      totalCost,
      pricing
    });
    return 0;
  }

  return totalCost;
}

// Cache the Redis client instance
let redisClient: RedisClient | null = null;
let redisInitialized = false;

/**
 * Get Redis connection URL from environment variables
 * Supports multiple common environment variable patterns
 */
function getRedisUrl(): string | null {
  // Priority order for Redis connection strings
  const urlCandidates = [
    process.env.REDIS_URL,
    process.env.REDIS_URI,
    process.env.REDIS_CONNECTION_STRING,
  ];

  // Check for full connection strings first
  for (const url of urlCandidates) {
    if (url) return url;
  }

  // Build connection string from individual components
  const host = process.env.REDIS_HOST;
  const port = process.env.REDIS_PORT || '6379';
  const password = process.env.REDIS_PASSWORD;

  if (host) {
    // Build redis:// URL from components
    if (password) {
      return `redis://:${password}@${host}:${port}`;
    }
    return `redis://${host}:${port}`;
  }

  return null;
}

/**
 * Get the Redis client instance
 * Returns null if Redis is not configured
 */
function getRedisClient(): RedisClient | null {
  const redisUrl = getRedisUrl();

  if (!redisUrl) {
    if (!redisInitialized) {
      console.warn("⚠️  Warning: No Redis configuration found. Cost tracking is disabled.");
      console.warn("    Set one of: REDIS_URL, REDIS_URI, REDIS_CONNECTION_STRING");
      console.warn("    Or set: REDIS_HOST (with optional REDIS_PORT, REDIS_PASSWORD)");
      redisInitialized = true;
    }
    return null;
  }

  // Return cached client if already initialized
  if (redisClient) {
    return redisClient;
  }

  try {
    // Use Bun's RedisClient with the URL
    redisClient = new RedisClient(redisUrl);
    redisInitialized = true;

    // Test connection asynchronously (don't wait for it)
    redisClient.connect().then(() => {
      console.log("✅ Connected to Redis for cost tracking");
    }).catch((err) => {
      console.error("❌ Failed to connect to Redis:", err);
      redisClient = null;
    });

    return redisClient;
  } catch (error) {
    console.error("❌ Failed to initialize Redis client:", error);
    redisInitialized = true;
    return null;
  }
}

/**
 * Get the current total API cost from Redis
 */
async function getCurrentCost(): Promise<number> {
  const redis = getRedisClient();
  if (!redis) return 0;

  try {
    const cost = await redis.get(REDIS_TOTAL_COST_KEY);
    return cost ? parseFloat(cost as string) : 0;
  } catch (error) {
    console.error("Error getting current cost from Redis:", error);
    return 0;
  }
}

/**
 * Get the configured cost limit in USD
 */
function getCostLimit(): number {
  const limit = process.env.MAX_API_COST_USD;
  return limit ? parseFloat(limit) : 10.0; // Default to $10
}

/**
 * Check if a request with the given token usage would exceed the cost limit
 * Returns tracking result with allowed status
 */
export async function checkCostLimit(usage: TokenUsage): Promise<CostTrackingResult> {
  const costLimit = getCostLimit();
  const requestCost = calculateCost(usage);
  const currentCost = await getCurrentCost();
  const projectedCost = currentCost + requestCost;
  const remainingBudget = costLimit - currentCost;

  const result: CostTrackingResult = {
    allowed: projectedCost <= costLimit,
    currentCost,
    costLimit,
    requestCost,
    remainingBudget,
  };

  if (!result.allowed) {
    result.error = `API cost limit exceeded. Current: $${currentCost.toFixed(4)}, Limit: $${costLimit.toFixed(2)}`;
  }

  return result;
}

/**
 * Record API usage and update the total cost in Redis
 */
export async function recordApiCost(usage: TokenUsage): Promise<void> {
  const redis = getRedisClient();
  if (!redis) {
    console.log("Cost tracking disabled - Redis not configured");
    return;
  }

  const cost = calculateCost(usage);

  // Validate cost
  if (isNaN(cost) || !isFinite(cost)) {
    console.error("Invalid cost calculated:", {
      cost,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      model: usage.model
    });
    return;
  }

  try {
    // Ensure the key exists and is initialized to 0 if not
    const exists = await redis.exists(REDIS_TOTAL_COST_KEY);
    if (!exists) {
      await redis.set(REDIS_TOTAL_COST_KEY, "0");
    }

    // Skip if cost is 0 (free model)
    if (cost === 0) {
      console.log(`💰 API Cost: $0.000000 (free model, not tracked)`);
      return;
    }

    // Increment the total cost atomically using raw INCRBYFLOAT command
    const costStr = cost.toString();
    const newTotalRaw = await redis.send("INCRBYFLOAT", [REDIS_TOTAL_COST_KEY, costStr]);
    const newTotal = parseFloat(newTotalRaw as string);

    // Also record individual request with timestamp
    const timestamp = new Date().toISOString();
    const requestKey = `${REDIS_KEY_PREFIX}request:${timestamp}`;
    await redis.send("SETEX", [requestKey, (86400 * 30).toString(), JSON.stringify({ // Keep for 30 days
      timestamp,
      inputTokens: usage.inputTokens || 0,
      outputTokens: usage.outputTokens || 0,
      cost,
    })]);

    console.log(`💰 API Cost: $${cost.toFixed(6)} (Total: $${newTotal.toFixed(4)})`);
  } catch (error) {
    console.error("Error recording API cost:", error);
    console.error("Usage data:", usage);
    console.error("Cost value:", cost, "Type:", typeof cost);
  }
}

/**
 * Get cost tracking statistics
 */
export async function getCostStats(): Promise<{
  totalCost: number;
  costLimit: number;
  remainingBudget: number;
  percentageUsed: number;
}> {
  const totalCost = await getCurrentCost();
  const costLimit = getCostLimit();
  const remainingBudget = costLimit - totalCost;
  const percentageUsed = (totalCost / costLimit) * 100;

  return {
    totalCost,
    costLimit,
    remainingBudget,
    percentageUsed,
  };
}

/**
 * Reset the cost counter (use with caution!)
 */
export async function resetCostCounter(): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.del(REDIS_TOTAL_COST_KEY);
    console.log("✅ Cost counter has been reset");
  } catch (error) {
    console.error("Error resetting cost counter:", error);
  }
}
