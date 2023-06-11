import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { HNSWLib } from 'langchain/vectorstores/hnswlib'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { OpenAI } from 'langchain/llms/openai'
import { RetrievalQAChain } from 'langchain/chains'
import { OPENAI_API_KEY } from '$env/static/private'
import path from 'path'
import fs from 'fs'
import { error, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async () => {
  const indexFilePath = path.join(process.cwd(), 'static', 'embeddings', 'hnswlib.index')
  return {
    hasEmbeddings: fs.existsSync(indexFilePath),
  }
}) satisfies PageServerLoad

export const actions: Actions = {
  loadPDF: async ({ request }) => {
    const { pdf } = Object.fromEntries(await request.formData())

    const pdfFilePath = path.join(process.cwd(), 'static', 'data.pdf')
    fs.writeFileSync(pdfFilePath, Buffer.from(await (pdf as Blob).arrayBuffer()))

    const loader = new PDFLoader(pdfFilePath, { splitPages: true })
    const docs = await loader.load()

    const vectorFilePath = path.join(process.cwd(), 'static', 'embeddings')
    const vectorstore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
    )
    await vectorstore.save(vectorFilePath)

    return {
      success: true,
    }
  },

  search: async ({ request }) => {
    try {
      const { query } = Object.fromEntries(await request.formData())

      const vectorFilePath = path.join(process.cwd(), 'static', 'embeddings')
      const vectorstore = await HNSWLib.load(
        vectorFilePath,
        new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
      )
      const model = new OpenAI({ openAIApiKey: OPENAI_API_KEY })
      const chain = RetrievalQAChain.fromLLM(model, vectorstore.asRetriever())
      const res = await chain.call({ query })

      return {
        answer: res.text,
      }
    } catch (e) {
      console.error(e)
      return error(400, 'Unable to process query')
    }
  },
}
