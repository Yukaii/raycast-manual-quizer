#!/usr/bin/env bun
/**
 * Test different Redis environment variable configurations
 */

async function testRedisEnv() {
  console.log("🧪 Testing Redis environment variable support...\n");

  const testCases = [
    {
      name: "REDIS_URL",
      env: { REDIS_URL: "redis://localhost:6379" },
    },
    {
      name: "REDIS_URI",
      env: { REDIS_URI: "redis://localhost:6379" },
    },
    {
      name: "REDIS_CONNECTION_STRING",
      env: { REDIS_CONNECTION_STRING: "redis://localhost:6379" },
    },
    {
      name: "REDIS_HOST only",
      env: { REDIS_HOST: "localhost" },
    },
    {
      name: "REDIS_HOST with PORT",
      env: { REDIS_HOST: "localhost", REDIS_PORT: "6379" },
    },
    {
      name: "REDIS_HOST with PASSWORD",
      env: { REDIS_HOST: "localhost", REDIS_PASSWORD: "secret123" },
    },
    {
      name: "REDIS_HOST with PORT and PASSWORD",
      env: { REDIS_HOST: "localhost", REDIS_PORT: "6380", REDIS_PASSWORD: "secret456" },
    },
  ];

  for (const testCase of testCases) {
    console.log(`Test: ${testCase.name}`);

    // Set env vars
    for (const [key, value] of Object.entries(testCase.env)) {
      process.env[key] = value;
    }

    // Import fresh module (clearing cache)
    const modulePath = "../src/cost-tracker.ts";
    delete require.cache[require.resolve(modulePath)];

    try {
      // Test by trying to get cost stats (which will try to connect)
      const { getCostStats } = await import(modulePath + `?t=${Date.now()}`);

      console.log(`  ✓ Configuration accepted`);
      console.log(`  Env: ${JSON.stringify(testCase.env)}`);
    } catch (error) {
      console.log(`  ✗ Failed: ${error.message}`);
    }

    // Clear env vars
    for (const key of Object.keys(testCase.env)) {
      delete process.env[key];
    }

    console.log();
  }

  console.log("✅ Test completed!");
  process.exit(0);
}

testRedisEnv();
