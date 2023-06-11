# Chat with PDF Example

A very simple example of how to ask questions to a PDF document using Langchain and OpenAI

This demo uses

- [SvelteKit](https://kit.svelte.dev)
- [OpenProps](https://open-props.style)
- [Langchain JS/TS](https://js.langchain.com)

## How it works

Upload a PDF document and ask questions about it. The questions are sent to OpenAI and the answers are extracted from the PDF using Langchain.

The PDF and embeddings are stored locally in the `static` directory. There is no need to sign up for a vector database like Pinecone.

<iframe src="https://link.excalidraw.com/readonly/fCDFVJaFjpRzYa1EJREP?darkMode=true" width="100%" height="100%" style="border: none;"></iframe>

## Getting Started

```bash
# clone this repo
git clone https://github.com/mark3labs/chat-with-pdf.git

# change directory to the cloned repo
cd chat-with-pdf

# copy the example env file
cp .env.example .env

# add yout OpenAI API key to the .env file

# install dependencies
pnpm i

# start the dev server
pnpm run dev
```
