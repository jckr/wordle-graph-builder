<script>
   import { page } from '$app/stores'
   import {validWords, solutions} from '../data/words.json';

   const words = $page.url.searchParams.get('word')?.split(',') || ['bonjbonj'];
   
</script>
<h1>Welcome to SvelteKit</h1>
<ul>
  {#each words as word}
  <li>{word}</li>
  {/each}
</ul>
<p>{validWords.length}</p>
<p>{solutions.length}</p>
