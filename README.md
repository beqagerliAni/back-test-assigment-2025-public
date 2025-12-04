# Crypto Agent
Lightweight agent that analyzes crypto market data, reports trends, and helps users decide where to buy/sell. It exposes simple endpoints and uses OpenAI function-calling + streaming to combine model reasoning with deterministic data fetchers.

## HOW TO START THE APP 
Install dependencies:
npm install

Create a .env file, copy env.example

install dep: npm i
run build: npm run  build
start: npm run start:dev

The server will run on:
http://localhost:3000

## Quick overview
- API entrypoints implemented by [`BaseAgentController`](src/base-agent/base-agent.controller.ts) and extended by [`CryptoController`](src/crypto/crypto.controller.ts) to create threads and stream responses.
- LLM integration is in [`OpenaiService`](src/openai/openai.service.ts), which streams model output and handles function calls.
- Agent definition and system prompt live in [`cryptoAgentDefinition`](src/agents/crypto-agent/crypto.agent-def.ts).
- Available tool functions are listed in [`cryptoAgentFunctions`](src/agents/crypto-agent/agentFunctions.ts) and implemented by processors such as [`CoinFunctionProcessor`](src/agents/crypto-agent/functions/coin/coin.function-processor.ts) and [`TrendingCoinFunctionProcessor`](src/agents/crypto-agent/functions/trending-coin/trendingCoin.function.processor.ts).
- Thread lifecycle and SSE streaming are handled by [`BaseAgentService`](src/base-agent/base-agent.service.ts).

## How it feeds data to the LLM — "Why" (LLM Strategy)
- System-first prompt: the agent uses a clear system prompt (see [`cryptoAgentDefinition`](src/agents/crypto-agent/crypto.agent-def.ts)) to set role, output rules, and available metrics. This reduces hallucination and enforces summary-first outputs.
- Tooling + function calls: concrete data retrieval is implemented as functions (FunctionTool objects) wired into the model via [`OpenaiService.responseStreamMessage`](src/openai/openai.service.ts). The model decides when to call a function; that function returns structured JSON from deterministic APIs (CoinGecko client in [`crypto.api-client.ts`](src/agents/crypto-agent/apiClient/crypto.api-client.ts)).
- Streaming + incremental assembly: we stream deltas to the client (SSE) while buffering function call outputs (see arg buffer logic in [`OpenaiService`](src/openai/openai.service.ts) and SSE publishing in [`BaseAgentService`](src/base-agent/base-agent.service.ts)). This keeps UX responsive and allows progressive UI updates.
- Small, validated function payloads: function inputs are minimal (e.g., coin name), validated using utilities like [`checkProperty`](src/shared/util/checkProperty.util.ts) to avoid malformed API calls and to keep the model’s function arguments simple and predictable.
- Deterministic post-processing: processors return JSON strings (not free-form text) so the system can combine and format results reliably before presenting them to users.

Referenced files and symbols:
- [`OpenaiService`](src/openai/openai.service.ts)
- [`BaseAgentService`](src/base-agent/base-agent.service.ts)
- [`BaseAgentController`](src/base-agent/base-agent.controller.ts)
- [`cryptoAgentDefinition`](src/agents/crypto-agent/crypto.agent-def.ts)
- [`cryptoAgentFunctions`](src/agents/crypto-agent/agentFunctions.ts)
- [`CoinFunctionProcessor`](src/agents/crypto-agent/functions/coin/coin.function-processor.ts)
- [`TrendingCoinFunctionProcessor`](src/agents/crypto-agent/functions/trending-coin/trendingCoin.function.processor.ts)
- [`crypto.api-client.ts`](src/agents/crypto-agent/apiClient/crypto.api-client.ts)
- [`checkProperty`](src/shared/util/checkProperty.util.ts)

## Scaling to 1,000,000+ rows — Elasticsearch-first plan
Rationale: for queries like "give me the best crypto" or "which coins are trending", you want deterministic, fast retrieval and aggregations. Elasticsearch is ideal because it supports full-text search, filters, aggregations, and scoring — so the model only receives the exact small set of results it needs.

Key steps
- Index design
  - Use explicit mappings, appropriate analyzers, and keyword vs text fields.
  - Index commonly queried metrics (price, volume, market_cap, tags) and store precomputed aggregates when possible.
- Sharding & replicas
  - Choose shard count by expected index size and node resources; use replicas for read throughput.
- Ingest & pipelines
  - Use ingest pipelines to normalize data, add enrichments, and drop PII.
  - Use data streams & ILM (hot-warm) for time-series retention and rollover.
- Aggregations & rollups
  - Precompute rollups (daily/weekly) and materialized aggregates for trending detection.
  - Use ES aggregations for top-k, percentiles, correlations.
- Candidate reduction
  - Run precise ES queries + filters to produce a small candidate set (10–50 rows) that the LLM will evaluate.
- Deterministic function outputs
  - LLM calls a function that returns JSON (strict schema). The app uses that JSON to fetch full records or trigger actions (e.g., place orders).
- Caching & hot paths
  - Cache frequent queries/results (Redis) and use TTLs for freshness.
- Backpressure & async
  - Offload heavy analytics (correlation, anomaly detection) to background workers; surface quick summaries synchronously and deeper reports via async jobs.
- Monitoring & ops
  - Monitor search latency, recall, index size, shard health, cache hit rates, and model usage/costs.

## Example usage (endpoints)
- Create thread: POST /createThread (implemented by [`BaseAgentController.createThread`](src/base-agent/base-agent.controller.ts))
- Stream response: SSE /:threadId?message=... (see [`BaseAgentController.sendStreamMessage`](src/base-agent/base-agent.controller.ts))
- Get messages/history: GET /messages/:threadId (see [`BaseAgentController.getMessages`](src/base-agent/base-agent.controller.ts))

## Notes
- Keep function interfaces small and return deterministic JSON from processors. See [`CoinGptFunction`](src/agents/crypto-agent/functions/coin/coin.gpt-function.ts) and [`TrendingCoinGptFunction`](src/agents/crypto-agent/functions/trending-coin/trendingCoin.gpt-function.ts).
- For production, secure API keys (already loaded by `ConfigModule.forRoot()` in [`AppModule`](src/app.module.ts)) and add rate-limits and auth.

## Files to inspect
- [src/openai/openai.service.ts](src/openai/openai.service.ts)
- [src/agents/crypto-agent/crypto.agent-def.ts](src/agents/crypto-agent/crypto.agent-def.ts)
- [src/agents/crypto-agent/agentFunctions.ts](src/agents/crypto-agent/agentFunctions.ts)
- [src/agents/crypto-agent/functions/coin/coin.function-processor.ts](src/agents/crypto-agent/functions/coin/coin.function-processor.ts)
- [src/agents/crypto-agent/functions/trending-coin/trendingCoin.function.processor.ts](src/agents/crypto-agent/functions/trending-coin/trendingCoin.function.processor.ts)
- [src/base-agent/base-agent.service.ts](src/base-agent/base-agent.service.ts)
- [src/base-agent/base-agent.controller.ts](src/base-agent/base-agent.controller.ts)

