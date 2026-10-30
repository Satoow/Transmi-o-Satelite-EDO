export const duration = 25;
export type Parameters = {
  initial: number;
  damping: number;
  frequency: number;
};
/** Exact homogeneous response, initial angular velocity zero. Angles in radians. */
export function angle(t: number, p: Parameters): number {
  const { initial: a, damping: z, frequency: w } = p;
  if (![t, a, z, w].every(Number.isFinite) || t < 0 || z <= 0 || w <= 0)
    throw new Error("Parâmetros inválidos");
  if (Math.abs(z - 1) < 1e-8) return a * (1 + w * t) * Math.exp(-w * t);
  if (z < 1) {
    const d = w * Math.sqrt(1 - z * z);
    return (
      a *
      Math.exp(-z * w * t) *
      (Math.cos(d * t) + ((z * w) / d) * Math.sin(d * t))
    );
  }
  const root = Math.sqrt(z * z - 1),
    r1 = -w / (z + root),
    r2 = -w * (z + root);
  return (a * (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t))) / (r2 - r1);
}
export const degrees = (r: number) => (r * 180) / Math.PI;
export const radians = (d: number) => (d * Math.PI) / 180;
