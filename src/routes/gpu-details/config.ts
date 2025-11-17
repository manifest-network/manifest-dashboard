import {formatBinaryUnit} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'gpu_total',
    title: 'Total GPU',
    yAxisTitle: '# of GPU',
    category: 'ai',
    type: "common"
  },
  {
    id: 'gpu_memory',
    title: (latest) => `Total GPU Memory: ${latest ? formatBinaryUnit(latest.value, "B") : "N/A"}`,
    yAxisTitle: 'Total Memory',
    category: 'ai',
    type: "common",
    tooltipValueFormatter: (value: string) => formatBinaryUnit(value, "B"),
    yAxisFormatter: (value: string) => formatBinaryUnit(value, "B", 0),
  },
  {
    id: 'gpu_nvidia_total',
    title: 'Total NVIDIA GPU',
    yAxisTitle: '# of GPU',
    category: 'ai',
    type: "common"
  },
  {
    id: 'gpu_nvidia_memory',
    title: (latest) => `Total NVIDIA Memory: ${latest ? formatBinaryUnit(latest.value, "B") : "N/A"}`,
    yAxisTitle: 'Total Memory',
    category: 'ai',
    type: "common",
    tooltipValueFormatter: (value: string) => formatBinaryUnit(value, "B"),
    yAxisFormatter: (value: string) => formatBinaryUnit(value, "B", 0),
  },
  {
    id: 'gpu_amd_total',
    title: 'Total AMD GPU',
    yAxisTitle: '# of GPU',
    category: 'ai',
    type: "common"
  },
  {
    id: 'gpu_amd_memory',
    title: (latest) => `Total AMD Memory: ${latest ? formatBinaryUnit(latest.value, "B") : "N/A"}`,
    yAxisTitle: 'Total Memory',
    category: 'ai',
    type: "common",
    tooltipValueFormatter: (value: string) => formatBinaryUnit(value, "B"),
    yAxisFormatter: (value: string) => formatBinaryUnit(value, "B", 0),
  },
]
