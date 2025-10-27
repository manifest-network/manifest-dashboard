import { quadtree } from 'd3-quadtree';
import type {GeoRecord} from "$lib/schemas/geo";

interface ClusterPoint {
  latitude: number;
  longitude: number;
  count: number;
  points: GeoRecord[];
}

/**
 * Clusters geographic points using a quadtree-based approach.
 * Points within `radiusThreshold` pixels are merged into a single cluster.
 */
export function clusterGeoPoints(
  points: GeoRecord[],
  projection: (coords: [number, number]) => [number, number] | null,
  radiusThreshold: number = 20
): ClusterPoint[] {
  // Project points to screen coordinates
  const projected = points
    .map(p => {
      const coords = projection([p.longitude, p.latitude]);
      return coords ? { x: coords[0], y: coords[1], original: p } : null;
    })
    // Filter out points that couldn't be projected
    .filter((p): p is { x: number; y: number; original: GeoRecord } => p !== null);

  if (projected.length === 0) return [];

  const tree = quadtree<{ x: number; y: number; original: GeoRecord }>()
    .x(d => d.x)
    .y(d => d.y)
    .addAll(projected);

  const clusters: ClusterPoint[] = [];
  const visited = new Set<GeoRecord>();

  // Find clusters
  for (const point of projected) {
    if (visited.has(point.original)) continue;

    const cluster: GeoRecord[] = [];
    let sumLat = 0;
    let sumLon = 0;

    // Find all nearby points within radius
    tree.visit((node, x1, y1, x2, y2) => {
      if (!node.length) {
        // Leaf node
        const p = node.data;
        if (p && !visited.has(p.original)) {
          const dx = p.x - point.x;
          const dy = p.y - point.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance <= radiusThreshold) {
            cluster.push(p.original);
            visited.add(p.original);
            sumLat += p.original.latitude;
            sumLon += p.original.longitude;
          }
        }
      }
      // Continue search if bounding box intersects circle
      return x1 > point.x + radiusThreshold ||
             x2 < point.x - radiusThreshold ||
             y1 > point.y + radiusThreshold ||
             y2 < point.y - radiusThreshold;
    });

    if (cluster.length > 0) {
      clusters.push({
        latitude: sumLat / cluster.length,
        longitude: sumLon / cluster.length,
        count: cluster.length,
        points: cluster
      });
    }
  }

  return clusters;
}