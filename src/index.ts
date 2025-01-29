import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import * as dotenv from 'dotenv';

dotenv.config();

// Define schema for product information requests
const ProductQuery = z.object({
  plan: z.enum(["basic", "premium", "enterprise"]),
  infoType: z.enum(["features", "pricing", "support"]),
});

const client = new OpenAI({
  baseURL: "https://api.studio.nebius.ai/v1/",
  apiKey: process.env.NEBIUS_API_KEY,
});

const tools = [
  {
    type: "function" as const,
    function: {
      name: "get_product_information",
      description: "Get information about product plans including features, pricing, and support details",
      parameters: zodResponseFormat(ProductQuery, "product_query").json_schema.schema,
    },
  }
];

async function getProductInformation(args: z.infer<typeof ProductQuery>) {
  // Mock product database
  const productInfo = {
    basic: {
      features: ["5 users", "Basic reporting", "Email support"],
      pricing: "$10/month",
      support: "Email support with 24h response time"
    },
    premium: {
      features: ["Unlimited users", "Advanced reporting", "Priority support"],
      pricing: "$50/month",
      support: "Priority email and chat support with 4h response time"
    },
    enterprise: {
      features: ["Custom solutions", "Dedicated account manager", "24/7 support"],
      pricing: "Contact sales",
      support: "24/7 phone and email support with 1h response time"
    }
  };

  return {
    plan: args.plan,
    infoType: args.infoType,
    information: productInfo[args.plan][args.infoType]
  };
}

async function handleCustomerQuery(userQuery: string) {
  const response = await client.chat.completions.create({
    model: "meta-llama/Meta-Llama-3.1-8B-Instruct-fast",
    messages: [{
      role: "system",
      content: "You are a helpful customer support agent. Use the available function to fetch accurate product information."
    }, {
      role: "user",
      content: userQuery
    }],
    tools: tools,
    tool_choice: "auto",
  });

  const toolCall = response.choices[0].message.tool_calls?.[0];
  if (toolCall && toolCall.function) {
    const functionArgs = JSON.parse(toolCall.function.arguments);
    const result = await getProductInformation(functionArgs);

    // Get AI to format the response nicely
    const finalResponse = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-fast",
      messages: [
        {
          role: "system",
          content: "You are a helpful customer support agent. Format the information in a friendly, clear way."
        },
        {
          role: "user",
          content: userQuery
        },
        {
          role: "assistant",
          tool_calls: [toolCall]
        },
        {
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result)
        }
      ]
    });

    return finalResponse.choices[0].message.content;
  }

  return response.choices[0].message.content;
}

// Example usage
async function main() {
  const customerQuery = "What are the features of your premium plan?";
  const response = await handleCustomerQuery(customerQuery);
  console.log("Customer: " + customerQuery);
  console.log("AI Agent: " + response);
}

main();