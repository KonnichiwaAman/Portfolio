/**
 * Calculate position on an orbit ring using polar coordinates
 */
export interface OrbitPosition {
  x: number;
  y: number;
  angle: number;
}

export function getOrbitPosition(
  index: number,
  total: number,
  radiusRem: number
): OrbitPosition {
  // Distribute evenly around the circle, starting from top (270deg in standard coords)
  const angle = (index / total) * 360 - 90;
  const angleRad = (angle * Math.PI) / 180;
  
  const x = Math.cos(angleRad) * radiusRem;
  const y = Math.sin(angleRad) * radiusRem;
  
  return { x, y, angle: angle + 90 }; // Return normalized angle for rotation
}

/**
 * Get ring configuration per category
 */
export const ringConfig = {
  Core: { radius: 6, color: 'from-blue-500 to-cyan-500' },
  'AI/ML': { radius: 10, color: 'from-orange-500 to-rose-500' },
  GenAI: { radius: 14, color: 'from-indigo-500 to-purple-500' },
  Infra: { radius: 18, color: 'from-green-500 to-teal-500' },
} as const;
