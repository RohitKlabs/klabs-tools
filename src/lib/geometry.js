export function polygonArea(points) {
  if (points.length < 3) return 0;
  return Math.abs(points.reduce((area, point, index) => { const next = points[(index + 1) % points.length]; return area + point[0] * next[1] - next[0] * point[1]; }, 0)) / 2;
}

export function convexHull(points) {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (sorted.length <= 2) return sorted;
  const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const build = (list) => { const result = []; for (const point of list) { while (result.length >= 2 && cross(result.at(-2), result.at(-1), point) <= 0) result.pop(); result.push(point); } return result; };
  const lower = build(sorted), upper = build([...sorted].reverse()); lower.pop(); upper.pop(); return lower.concat(upper);
}

export function concaveHull(points, concavity = 30, lengthThreshold = 0) {
  if (points.length < 4) return convexHull(points);
  const convex = convexHull(points);
  if (concavity >= 55) return convex;
  const xs = points.map(([x]) => x), ys = points.map(([, y]) => y);
  const diagonal = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) || 1;
  const radius = diagonal * (0.025 + concavity / 100 * 0.16), threshold = Math.max(0, lengthThreshold) * diagonal / 60;
  const start = points.reduce((best, point, index) => point[0] < best.point[0] ? { point, index } : best, { point: points[0], index: 0 });
  const used = new Set([start.index]), hull = [start.point]; let current = start.point, previousAngle = 0;
  for (let step = 0; step < points.length * 2; step += 1) {
    const candidates = points.map((point, index) => ({ point, index, dx: point[0] - current[0], dy: point[1] - current[1] })).filter(({ index, dx, dy }) => !used.has(index) && Math.hypot(dx, dy) >= threshold).sort((a, b) => Math.hypot(a.dx, a.dy) - Math.hypot(b.dx, b.dy));
    if (!candidates.length) break;
    let next = candidates.find(({ dx, dy }) => Math.hypot(dx, dy) <= radius) || candidates[0];
    const angle = Math.atan2(next.dy, next.dx), turn = Math.abs(Math.atan2(Math.sin(angle - previousAngle), Math.cos(angle - previousAngle)));
    if (hull.length > 2 && turn < 0.035 && candidates.length > 1) next = candidates[1];
    if (next.index === start.index) break;
    used.add(next.index); hull.push(next.point); current = next.point; previousAngle = angle;
    if (hull.length > 3 && Math.hypot(current[0] - start.point[0], current[1] - start.point[1]) < radius * 0.75) break;
  }
  return hull.length >= 3 && polygonArea(hull) >= polygonArea(convex) * 0.16 ? hull : convex;
}

export function fitToCanvas(points, width, height, margin = 42) {
  if (!points.length) return { scale: 1, ox: margin, oy: margin };
  const xs = points.map(([x]) => x), ys = points.map(([, y]) => y), minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const scale = Math.min((width - margin * 2) / Math.max(maxX - minX, 1e-6), (height - margin * 2) / Math.max(maxY - minY, 1e-6));
  return { scale, ox: margin + (width - margin * 2 - (maxX - minX) * scale) / 2 - minX * scale, oy: margin + (height - margin * 2 - (maxY - minY) * scale) / 2 - minY * scale };
}
export const toCanvas = (transform, [x, y]) => [x * transform.scale + transform.ox, y * transform.scale + transform.oy];
