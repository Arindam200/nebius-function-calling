# Nebius AI Function Calling Example

This project demonstrates how to use function calling capabilities with the Nebius AI API using TypeScript and the OpenAI SDK. The example shows how to implement a weather information retrieval system using structured data validation with Zod.

## Features

- Integration with Nebius AI API
- Type-safe function calling with Zod schema validation
- Weather information retrieval example
- Structured conversation flow with AI

## Prerequisites

- Node.js
- TypeScript
- [Nebius API key](https://studio.nebius.ai/settings/api-keys)

## Setup

1. Install dependencies:

```bash
npm install openai zod dotenv
```

2. Set up your environment variables:

```bash
//.env
NEBIUS_API_KEY=your_api_key_here
```

## Usage

The example demonstrates:

- Defining function schemas using Zod
- Setting up the OpenAI client with Nebius API endpoint
- Implementing function calling with the AI model
- Handling AI responses and function results

## How It Works

1. Defines a schema for dummy data using Zod
2. Sets up the OpenAI client with Nebius API configuration
3. Creates a chat completion request with function calling capabilities
4. Handles the AI response and executes the appropriate function
5. Continues the conversation with the function results

## Models Used

- meta-llama/Meta-Llama-3.1-8B-Instruct-fast

You can use different Models Provided by Nebius: [Docs](https://docs.nebius.com/studio/inference/models)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
