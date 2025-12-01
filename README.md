# Backend Engineering Task: The "Smart Analytics" API

## Objective
We are evaluating your ability to build robust backend systems and your intuition for applying Large Language Models (LLMs) to solve real user problems.

Your goal is to build a backend service that serves time-series data and uses an LLM to act as a "Data Analyst," explaining that data to the user in plain English.

**Deadline:** 07-12-2025 23:59PM

> **A Note on Experimentation:**
> We value bold ideas over safe, cookie-cutter code. Feel free to "break things" or attempt extraordinary architectural decisions. We appreciate a failed, ambitious attempt (with a post-mortem on why it failed) more than a perfect but boring implementation.

---

## The Scenario
Imagine we are building a dashboard for a user who is not data-savvy. They see a line chart, but they don't know if the trends are good, bad, or anomalous. Your backend will power both the visualization and the explanation.

### Part 1: The Data API (The "Hard" Skills)
You may choose any dataset you like. (Examples: Crypto prices, Server CPU usage, Weather data, or Website traffic). *Bonus points for data that is realistic (contains noise, seasonality, or multiple series).*

**Requirements:**
* **Ingest/Mock Data:** Create a mechanism to load or generate this time-series data.
* **Endpoint:** Create a REST endpoint (e.g., `GET /metrics`) that returns data formatted for a frontend charting library (like Recharts or Chart.js).
* **Filtering:** The endpoint must accept query parameters, such as:
    * `start_date` / `end_date`
    * `granularity` (e.g., daily, hourly)

### Part 2: The Insight Engine (The "AI" Skills)
Create an endpoint (e.g., `POST /analyze`) that looks at the same data currently being viewed and generates a text summary.

**The Challenge:**
Raw data is heavy. You cannot simply dump 10,000 JSON rows into a prompt and hope for the best (it is slow and expensive). You must design a way to pass the *essence* of the chart to the LLM to get high-quality insights.

**The Output should answer:**
* What is the overall trend?
* Were there any sudden spikes or anomalies?
* *(Optional)* Potential reasons for these changes based on the context of your data.

---

## What We Are Looking For (Grading Criteria)
We are grading this on two axes: Technical Execution and Product/AI Intuition.

### 1. Technical Execution
* **Architecture:** Clean separation of concerns (Routes, Controllers, Services).
* **Data Handling:** Efficient filtering and aggregation of time-series data.
* **Code Quality:** Type safety, error handling, and environment variable management.

### 2. Product & AI Intuition (Crucial)
* **Prompt Engineering:** How do you instruct the LLM? Do you give it a persona? Do you format the output?
* **Context Management:** How do you handle the token limit? (e.g., Do you send every single data point, or do you calculate statistics before sending to the LLM?)
* **Insight Quality:** Does the LLM output generic fluff ("The data went up"), or does it provide value ("Traffic spiked by 40% on weekends, suggesting a correlation with...")?

---

## Submission Guidelines

1.  **Fork & PR:** Fork this repository and open a **Pull Request** when finished.
2.  **The Setup:** Include a `docker-compose.yml` or clear `README.md` instructions to run the server locally.
3.  **The "Why":** A short paragraph in your PR description or README explaining your LLM Strategy.
    * Why did you feed the data to the LLM the way you did?
    * How would you scale this if the dataset had 1 million rows?

**Questions?**
Contact via Telegram: `@lukalortk`

---

## Tech Stack
* **Language:** Open to any language (Python, Node.js, Go, Rust, Java, etc.) – please use whatever you are most productive in.
* **LLM:** OpenAI API, Anthropic, or a local model (via Ollama).
* **Database:** SQLite, MongoDB, or simple in-memory storage is fine for this scope. We mainly use MongoDB for production

## Bonus Points
* **Multi-Series Comparison:** Can your API explain the relationship between two lines? (e.g., "CPU usage went up because Request count increased").
* **Streaming Responses:** Streaming the LLM text back to the client for a better UX.
