// Distance filter options (meters) offered by the packages UI: 100 m to 1000 m.
export const DISTANCE_FILTER_OPTIONS = [
  100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
];

export function normalizeMaxDistance(value: unknown): number | null {
  const meters = Number(value);

  if (value === null || value === undefined || value === "") {
    return null;
  }

  return Number.isFinite(meters) && meters > 0 ? Math.floor(meters) : null;
}
