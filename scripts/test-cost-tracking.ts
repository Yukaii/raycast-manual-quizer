#!/usr/bin/env bun
/**
 * Test script for Redis cost tracking
 */

import { calculateCost, recordApiCost, getCostStats } from "../src/cost-tracker";

async function testCostTracking() {
  console.log("🧪 Testing cost tracking...\n");

  // Test 1: Calculate cost
  console.log("Test 1: Calculate cost");
  const usage = {
    inputTokens: 1000,
    outputTokens: 500,
  };
  const cost = calculateCost(usage);
  console.log(`  Input: ${usage.inputTokens} tokens, Output: ${usage.outputTokens} tokens`);
  console.log(`  Calculated cost: $${cost.toFixed(6)}\n`);

  // Test 2: Record cost (requires Redis)
  if (process.env.REDIS_URL) {
    console.log("Test 2: Record API cost");
    await recordApiCost(usage);

    // Wait a bit for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log("\nTest 3: Get cost statistics");
    const stats = await getCostStats();
    console.log(`  Total cost: $${stats.totalCost.toFixed(6)}`);
    console.log(`  Cost limit: $${stats.costLimit.toFixed(2)}`);
    console.log(`  Remaining budget: $${stats.remainingBudget.toFixed(6)}`);
    console.log(`  Percentage used: ${stats.percentageUsed.toFixed(2)}%`);
  } else {
    console.log("Test 2: Skipped (REDIS_URL not set)");
  }

  console.log("\n✅ Cost tracking tests completed!");
  process.exit(0);
}

testCostTracking();
