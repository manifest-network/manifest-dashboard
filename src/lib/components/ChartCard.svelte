<script lang="ts">
  import type { ChartDataPoint } from "$lib/schemas/charts";
  import { AreaChart, LinearGradient, Area, ChartClipPath } from "layerchart";
  import { formatLargeNumber } from "$lib/utils/format";
  import {cubicInOut} from "svelte/easing";
  import BigInt from "bignumber.js";

  const { config, data }: { config: ChartConfig; data: ChartDataPoint[] } = $props();

  const title = $derived(
    typeof config.title === "function"
      ? config.title(data?.[0])
      : `${config.title}: ${data?.[0]?.value ?? "N/A"}`
  );
</script>

<main>
  <div class="relative h-[300px] p-4 rounded-sm">
    <h3 class="absolute top-2 left-4 card-title">
      {title}
    </h3>
    <AreaChart
      data={data}
      x="date"
      y={(p) => BigInt(p.value)}
      yNice={true}
      yDomain={[0, Math.ceil(Math.max(...data.map((p) => Number(p.value))) * 1.1)]}
      padding={{ left: 50, bottom: 50, top: 28 }}
      props={{
        xAxis: {
          label: "Timestamp",
        },
        yAxis: {
          label: config.yAxisTitle,
          format: (v) => formatLargeNumber(v, 0),
        },
        highlight: { points: { r: 3, class: "stroke-2 stroke-surface-100" } }
      }}
    >
      {#snippet marks()}
        {#key `${data?.[0]?.date}-${data?.[data.length-1]?.date}-${data.length}`}
          <ChartClipPath
                initialWidth={0}
                motion={{
                  width: { type: "tween", duration: 1000, easing: cubicInOut },
                }}
          >
            <LinearGradient class="from-primary/50 to-primary/1" vertical>
              {#snippet children({ gradient })}
                <Area line={{ class: "stroke-primary" }} fill={gradient} />
              {/snippet}
            </LinearGradient>
          </ChartClipPath>
        {/key}
      {/snippet}
    </AreaChart>
  </div>
</main>
