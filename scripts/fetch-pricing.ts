#!/usr/bin/env bun
/**
 * Fetch model pricing data from LiteLLM repository
 * This script downloads the latest pricing information and extracts Gemini models
 */

const LITELLM_PRICING_URL = "https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json";
const OUTPUT_FILE = "./src/model-pricing.json";

interface ModelPricing {
  input_cost_per_token?: number;
  output_cost_per_token?: number;
  [key: string]: any;
}

interface LiteLLMPricing {
  [model: string]: ModelPricing;
}

async function fetchPricing() {
  console.log("📥 Fetching latest pricing data from LiteLLM...");

  try {
    const response = await fetch(LITELLM_PRICING_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch pricing data: ${response.statusText}`);
    }

    const allPricing: LiteLLMPricing = await response.json();

    // Extract Gemini models we care about
    const geminiModels = [
      "gemini-2.0-flash-exp",
      "gemini/gemini-2.0-flash-exp",
      "gemini-1.5-flash",
      "gemini/gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini/gemini-1.5-pro",
    ];

    const extractedPricing: Record<string, any> = {};

    for (const modelKey of geminiModels) {
      const pricing = allPricing[modelKey];
      if (pricing) {
        // Normalize model name (remove provider prefix)
        const normalizedName = modelKey.replace("gemini/", "");

        extractedPricing[normalizedName] = {
          name: modelKey,
          inputCostPerToken: pricing.input_cost_per_token || 0,
          outputCostPerToken: pricing.output_cost_per_token || 0,
        };
      }
    }

    const outputData = {
      source: LITELLM_PRICING_URL,
      updated: new Date().toISOString().split('T')[0],
      models: extractedPricing,
    };

    // Write to file
    await Bun.write(OUTPUT_FILE, JSON.stringify(outputData, null, 2));

    console.log(`✅ Pricing data saved to ${OUTPUT_FILE}`);
    console.log(`📊 Extracted ${Object.keys(extractedPricing).length} Gemini models:`);

    for (const [model, pricing] of Object.entries(extractedPricing)) {
      const inputCost = pricing.inputCostPerToken * 1_000_000;
      const outputCost = pricing.outputCostPerToken * 1_000_000;
      console.log(`   - ${model}: $${inputCost.toFixed(3)}/M input, $${outputCost.toFixed(3)}/M output`);
    }

  } catch (error) {
    console.error("❌ Error fetching pricing data:", error);
    console.log("⚠️  Using fallback pricing values");

    // Create fallback pricing file
    const fallbackPricing = {
      source: "Fallback pricing (manual)",
      updated: new Date().toISOString().split('T')[0],
      models: {
        "gemini-2.0-flash-exp": {
          name: "Gemini 2.0 Flash (Experimental)",
          inputCostPerToken: 0,
          outputCostPerToken: 0,
          note: "Free experimental model"
        },
        "gemini-1.5-flash": {
          name: "Gemini 1.5 Flash",
          inputCostPerToken: 7.5e-8,
          outputCostPerToken: 3e-7
        },
        "gemini-1.5-pro": {
          name: "Gemini 1.5 Pro",
          inputCostPerToken: 1.25e-6,
          outputCostPerToken: 5e-6
        }
      }
    };

    await Bun.write(OUTPUT_FILE, JSON.stringify(fallbackPricing, null, 2));
    console.log(`✅ Fallback pricing data saved to ${OUTPUT_FILE}`);
  }
}

fetchPricing();
