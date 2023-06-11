<script lang="ts">
  import { enhance } from '$app/forms'
  import type { PageData, SubmitFunction } from './$types'
  import { Stretch } from 'svelte-loading-spinners'

  export let data: PageData

  let busy = false
  let answer = ''

  $: {
    console.log(data)
  }

  let pdf: FileList

  const search: SubmitFunction = async () => {
    busy = true
    answer = ''
    return async ({ result }) => {
      busy = false
      answer = result.data.answer
    }
  }
</script>

<section>
  <div class="card">
    <h3>Upload a PDF</h3>
    <form method="post" action="?/loadPDF" enctype="multipart/form-data" use:enhance>
      <input type="file" name="pdf" bind:files={pdf} disabled={busy} />
      {#if pdf}
        <button type="submit" disabled={busy}>Load PDF</button>
      {/if}
    </form>
  </div>
  {#if data.hasEmbeddings}
    <div class="card">
      <h3>Search PDF</h3>
      <form method="post" action="?/search" use:enhance={search}>
        <input
          type="text"
          placeholder="What is the meaning of the universe?"
          name="query"
          class="search-query"
          disabled={busy}
        />
        <button type="submit" disabled={busy}>Search</button>
      </form>
    </div>
  {/if}

  {#if answer}
    <div class="card">
      <h3>Result</h3>
      <p>{answer}</p>
    </div>
  {/if}
</section>
<dialog open={busy}>
  <Stretch />
</dialog>

<style>
  .search-query {
    margin-top: var(--size-2);
    padding: var(--size-2);
    width: 50%;
  }
</style>
