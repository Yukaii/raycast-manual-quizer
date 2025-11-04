#!/usr/bin/env bun
/**
 * Test the full API cost tracking flow
 */

import { checkCostLimit, recordApiCost, getCostStats } from "../src/cost-tracker";

async function testApiFlow() {
  console.log("🧪 Testing API cost tracking flow...\n");

  // Simulate quiz generation request
  console.log("1. Check cost limit before generation");
  const estimatedUsage = {
    inputTokens: 5000,
    outputTokens: 2000,
  };

  const costCheck = await checkCostLimit(estimatedUsage);
  console.log(`   Allowed: ${costCheck.allowed}`);
  console.log(`   Current cost: $${costCheck.currentCost.toFixed(6)}`);
  console.log(`   Request cost: $${costCheck.requestCost.toFixed(6)}`);

  if (!costCheck.allowed) {
    console.log(`   ❌ ${costCheck.error}`);
    return;
  }

  console.log("\n2. Simulate quiz generation (free model)");
  const actualUsage = {
    inputTokens: 4523,
    outputTokens: 1876,
  };

  await recordApiCost(actualUsage);

  console.log("\n3. Get final cost statistics");
  const stats = await getCostStats();
  console.log(`   Total cost: $${stats.totalCost.toFixed(6)}`);
  console.log(`   Cost limit: $${stats.costLimit.toFixed(2)}`);
  console.log(`   Remaining: $${stats.remainingBudget.toFixed(6)}`);
  console.log(`   Used: ${stats.percentageUsed.toFixed(2)}%`);

  console.log("\n✅ API flow test completed!");
  process.exit(0);
}

testApiFlow();
