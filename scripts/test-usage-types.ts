#!/usr/bin/env bun
/**
 * Test to verify usage data types from the AI SDK
 */

import { generateText } from "ai";
import { google } from "@ai-sdk/google";

async function testUsageTypes() {
  console.log("🧪 Testing AI SDK usage types...\n");

  try {
    const { text, usage } = await generateText({
      model: google("gemini-2.0-flash-exp"),
      prompt: "Say hello in one word",
      maxTokens: 10,
    });

    console.log("Response:", text);
    console.log("\nUsage object:");
    console.log("  Type:", typeof usage);
    console.log("  Value:", usage);
    console.log("  Keys:", usage ? Object.keys(usage) : "undefined");

    if (usage) {
      console.log("\nToken counts:");
      console.log("  promptTokens:", usage.promptTokens, `(type: ${typeof usage.promptTokens})`);
      console.log("  completionTokens:", usage.completionTokens, `(type: ${typeof usage.completionTokens})`);
      console.log("  totalTokens:", usage.totalTokens, `(type: ${typeof usage.totalTokens})`);
    }

    console.log("\n✅ Test completed!");
  } catch (error) {
    console.error("❌ Error:", error);
  }

  process.exit(0);
}

testUsageTypes();
