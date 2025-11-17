import {formatBinaryUnit} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'kube_nodes',
    title: 'Total K8 Nodes',
    yAxisTitle: '# of K8 Nodes',
    category: 'kube',
    type: "common"
  },
  {
    id: 'kube_memory',
    title: (latest) => `Total K8 Memory: ${latest ? formatBinaryUnit(latest.value, "MB") : "N/A"}`,
    yAxisTitle: 'Total Memory (MB)',
    category: 'kube',
    type: "common",
    tooltipValueFormatter: (value: string) => formatBinaryUnit(value, "MB"),
    yAxisFormatter: (value: string) => formatBinaryUnit(value, "MB", 0),
  },
  {
    id: 'kube_pods',
    title: 'Total K8 Pods',
    yAxisTitle: '# of K8 Pods',
    category: 'kube',
    type: "common"
  },
]
