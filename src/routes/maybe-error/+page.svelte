<!--<script lang="ts">-->
<!--function getPromise() {-->
<!--  return new Promise((resolve, reject) => {-->
<!--    if (Math.random() < 0.5) {-->
<!--      resolve(Math.random());-->
<!--    } else {-->
<!--      reject(new Error("Error occurred"));-->
<!--    }-->
<!--  });-->
<!--}-->

<!--let data = $state(getPromise());-->

<!--let tick = $state(Date.now());-->
<!--$effect(() => {-->
<!--	const x = setInterval(() => {-->
<!--		tick = Date.now();-->
<!--	}, 1000);-->
<!--	return () => clearInterval(x);-->
<!--})-->

<!--$effect(() => {-->
<!--	if (tick) {-->
<!--		data = getPromise();-->
<!--  }-->
<!--});-->

<!--</script>-->

<!--<main>-->
<!--  <svelte:boundary>-->
<!--    <p>{JSON.stringify((await data), null, 2)}</p>-->

<!--    {#snippet pending()}-->
<!--      <p>loading...</p>-->
<!--    {/snippet}-->

<!--    {#snippet failed(error, reset)}-->
<!--      <p>error...</p>-->
<!--    {/snippet}-->
<!--  </svelte:boundary>-->
<!--</main>-->


<script lang="ts">
  function getPromise() {
    return new Promise((resolve, reject) => {
      if (Math.random() < 0.5) {
        resolve(Math.random());
      } else {
        reject(new Error("Error occurred"));
      }
    });
  }

  let data = $state(getPromise());
  let error = $state(null);
  let reset = $state(() => {});

  function failed(e, r) {
    error = e;
    reset = r;
    console.log("Error occurred:", e);
  }

  let tick = $state(Date.now());
  $effect(() => {
    const x = setInterval(() => {
      tick = Date.now();
    }, 1000);
    return () => clearInterval(x);
  })

  $effect(() => {
    if (tick) {
      if (error) {
        console.log("Resetting due to error");
        error = null;
        reset();
      } else {
        data = getPromise();
      }
    }
  });

</script>

<main>
  <svelte:boundary {failed}>
    <p>{JSON.stringify((await data), null, 2)}</p>

    {#snippet pending()}
      <p>loading...</p>
    {/snippet}

  </svelte:boundary>
</main>
