# NeuralVault — Enterprise RAG Frontend

A production-grade React dashboard for the NeuralVault Enterprise RAG System.
Built with Vite, TailwindCSS 4, and shadcn/ui — fully connected to the NeuralVault backend API.

## What it does

NeuralVault gives enterprises a clean interface to upload documents, ask grounded questions,
evaluate answer quality, and monitor system health — all in one workspace.

Every answer the system gives is sourced from your actual uploaded documents,
not from an LLM guessing from training data. That's what makes it enterprise-grade.

## Pages

- **Dashboard** — real-time metrics: document count, tenant count, RAG score, API status
- **Documents** — upload PDF, DOCX, TXT, MD files with collection tagging and chunk preview
- **Query Studio** — chat interface with HyDE toggle, cross-encoder reranking toggle, source citations
- **Tenants** — create and manage isolated knowledge workspaces per organization
- **Evaluation** — trigger RAGAs evaluation runs, view faithfulness/relevancy/precision/recall scores
- **Monitoring** — live service health for PostgreSQL, Redis, ChromaDB, Ollama with latency
- **Settings** — configure embedding model, LLM, reranker, chunk size, cache TTL

## Tech stack

- React 18 + Vite 6
- TailwindCSS 4
- TypeScript
- lucide-react (icons)
- Fetch API (no axios — keeps it lean)

## Getting started

### Prerequisites

- Node.js 18+
- NeuralVault backend running on `http://localhost:8000`

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/neuralvault-frontend
cd neuralvault-frontend
npm install
npm run dev
```

Open `http://localhost:5173`

### Environment variables

Create a `.env` file in the root:
