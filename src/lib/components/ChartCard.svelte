<script lang="ts">
  import type { ChartDataPoint } from "$lib/schemas/charts";
  import { AreaChart, LinearGradient, Area, ChartClipPath, Tooltip } from "layerchart";
  import { formatLargeNumber, formatChartDate } from "$lib/utils/format";
  import {cubicInOut} from "svelte/easing";

  const { config, data }: { config: ChartConfig; data: ChartDataPoint[] } = $props();

  const title = $derived(
    typeof config.title === "function"
      ? config.title(data?.[0])
      : `${config.title}: ${data?.[0]?.value ?? "N/A"}`
  );
</script>

<section>
  <div class="relative h-[300px] p-4 rounded-sm">
    <h3 class="absolute top-2 left-4 card-title">
      {title}
    </h3>
    <AreaChart
      data={data}
      x="date"
      y={(v) => Number(v.value)}
      yNice={true}
      padding={{ left: 50, bottom: 50, top: 28 }}
      props={{
        xAxis: {
          label: "Timestamp",
        },
        yAxis: {
          label: config.yAxisTitle,
          format: (v) => config.yAxisFormatter ? config.yAxisFormatter(String(v)) : formatLargeNumber(String(v), 0),
        },
        highlight: { points: { r: 3, class: "stroke-2 stroke-surface-100" } }
      }}
    >
      {#snippet tooltip({context})}
        <Tooltip.Root>
          <Tooltip.Item
            label="Date"
            value={context.tooltip.data?.date}
            format={formatChartDate}
          />
          <Tooltip.Item
              label={config.yAxisTitle}
              value={context.tooltip.data?.value}
              format={config.tooltipValueFormatter ?? ((v) => v)}
            />
        </Tooltip.Root>
      {/snippet}
      {#snippet marks()}
        <!-- The key is used so the animation is re-rendered when the time interval changed -->
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
</section>
