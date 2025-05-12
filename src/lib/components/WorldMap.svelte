<script lang="ts">
  import {getColorFromCSS} from "$lib/utils/colors";
  import * as d3 from 'd3';
  import * as topojson from 'topojson-client';
  import {worldTopoJson} from "$lib/utils/worldTopology";
  import type {PageProps} from "../../../.svelte-kit/types/src/routes/world/$types";

  let svgEl: SVGSVGElement;
  let containerEl: HTMLDivElement;
  let width = $state(0);
  let height = $state(0);

  const fillColor = getColorFromCSS('--color-primary-900-100')
  const strokeColor = getColorFromCSS('--color-primary-100-900')
  const pointColor = getColorFromCSS('--color-secondary-600-400')

  const {data}: PageProps = $props()
  const coordinates: { lat: number; lon: number, size: 6, label: string }[] = data.geo.map(
    (geo: GeoRecord) => ({
      lat: geo.latitude,
      lon: geo.longitude,
      size: 6,
      label: geo.city,
    })
  );


  // Render the map and points
  $effect(() => {
    d3.select(svgEl).selectAll('*').remove();

    const svg = d3.select(svgEl).attr('viewBox', `0 0 ${width} ${height}`);

    // Create the map projection
    const projection = d3.geoMercator()
      .scale(width / 2 / Math.PI)
      .translate([width / 2, height / 2]);

    // Create the path generator and render the map
    // The TopoJSON is converted to GeoJSON to be used with D3
    const path = d3.geoPath(projection)
    const geojson = topojson.feature(worldTopoJson, worldTopoJson.objects.countries);
    if (geojson.type !== "Feature") {
      svg.selectAll("path")
        .data(geojson.features)
        .enter().append("path")
        .attr("d", path)
        .attr('fill', fillColor)
        .attr('stroke', strokeColor)
        .attr('stroke-width', 0.5);
    }

    // Create a tooltip for the points
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'fixed')
      .style('pointer-events', 'none')
      .style('padding', '4px 8px')
      .style('background', 'rgba(0,0,0,0.7)')
      .style('color', '#fff')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('opacity', 0);

    // Create the circles for the points
    const circles = svg.append('g')
      .attr('class', 'point-layer')
      .selectAll('circle')
      .data(coordinates)
      .join('circle')
      .attr('cx', d => projection([d.lon, d.lat])![0])
      .attr('cy', d => projection([d.lon, d.lat])![1])
      .attr('r', d => d.size)
      .attr('fill', pointColor)
      .attr('opacity', 0.7)
      .style('pointer-events', 'all');

    // Add mouse events to the circles for the tooltip
    circles
      .on('mouseover', (_, d) => {
        tooltip
          .style('opacity', 1)
          .html(d.label);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', `${event.clientX + 10}px`)
          .style('top', `${event.clientY + 10}px`);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });
  })
</script>

<div bind:this={containerEl} bind:clientWidth={width} bind:clientHeight={height} class="map-root overflow-hidden">
  <svg bind:this={svgEl}></svg>
</div>

<style>
  .map-root {
    width: 100%;
    height: 400px;
    overflow: hidden;
  }

 svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
