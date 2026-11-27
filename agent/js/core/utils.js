/**
 * Shared SVG, DOM, formatting, and kinematic math utilities.
 */
export const SVG_NS = "http://www.w3.org/2000/svg";

export function mk(tag, attrs, parent) {
  const node = document.createElementNS(SVG_NS, tag);
  if (attrs) {
    Object.keys(attrs).forEach((k) => node.setAttribute(k, attrs[k]));
  }
  if (parent) parent.appendChild(node);
  return node;
}

export function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function toISO(dt) {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const smooth = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export const lerp = (a, b, t) => a + (b - a) * t;

/** Smooth RGB ink color interpolation (#8A8275 muted -> #1D1B18 primary ink) */
export const lerpInk = (t) => {
  const r = Math.round(lerp(138, 29, t));
  const g = Math.round(lerp(130, 27, t));
  const b = Math.round(lerp(117, 24, t));
  return `rgb(${r},${g},${b})`;
};

/** 2-bone knee IK solver */
export function solveKnee(hx, hy, fx, fy, l1, l2) {
  const dx = fx - hx;
  const dy = fy - hy;
  const d = Math.max(0.5, Math.min(l1 + l2 - 0.1, Math.hypot(dx, dy)));
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const mx = hx + (a * dx) / d;
  const my = hy + (a * dy) / d;
  return { x: mx + (h * dy) / d, y: my - (h * dx) / d };
}

/** 2-bone elbow solver (bends cleanly for mechanical arm silhouette) */
export function solveElbow(sx, sy, hx, hy, bendDir) {
  const dx = hx - sx;
  const dy = hy - sy;
  const d = Math.max(1.2, Math.hypot(dx, dy));
  const mx = (sx + hx) * 0.5;
  const my = (sy + hy) * 0.5;
  const bend = Math.min(2.4, Math.max(0.6, (10.5 - d) * 0.35));
  const nx = -dy / d;
  const ny = dx / d;
  return { x: mx + nx * bend * bendDir, y: my + ny * bend * bendDir };
}

/** Minimum-jerk bipedal stride foot pose */
export function footPose(phase, strideLen, liftH) {
  const p = ((phase % 1) + 1) % 1;
  if (p < 0.5) {
    const s = p / 0.5;
    return { x: lerp(strideLen * 0.5, -strideLen * 0.5, s), y: 0, pitch: 0 };
  }
  const s = (p - 0.5) / 0.5;
  const mj = s * s * s * (10 + s * (-15 + 6 * s));
  return {
    x: lerp(-strideLen * 0.5, strideLen * 0.5, mj),
    y: -Math.sin(s * Math.PI) * liftH,
    pitch: -Math.sin(s * Math.PI) * 0.28
  };
}

/** Solid volumetric tapered mechanical limb capsule path */
export function capsuleSegPath(x1, y1, x2, y2, r1, r2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 0.2) {
    const r = Math.max(0.4, r1);
    return `M ${(x1 - r).toFixed(1)},${y1.toFixed(1)} A ${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(x1 + r).toFixed(1)},${y1.toFixed(1)} A ${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(x1 - r).toFixed(1)},${y1.toFixed(1)} Z`;
  }
  const nx = -dy / len;
  const ny = dx / len;
  const p1Lx = x1 + nx * r1, p1Ly = y1 + ny * r1;
  const p1Rx = x1 - nx * r1, p1Ry = y1 - ny * r1;
  const p2Lx = x2 + nx * r2, p2Ly = y2 + ny * r2;
  const p2Rx = x2 - nx * r2, p2Ry = y2 - ny * r2;
  return `M ${p1Lx.toFixed(1)},${p1Ly.toFixed(1)} L ${p2Lx.toFixed(1)},${p2Ly.toFixed(1)} A ${r2.toFixed(2)},${r2.toFixed(2)} 0 0,1 ${p2Rx.toFixed(1)},${p2Ry.toFixed(1)} L ${p1Rx.toFixed(1)},${p1Ry.toFixed(1)} A ${r1.toFixed(2)},${r1.toFixed(2)} 0 0,1 ${p1Lx.toFixed(1)},${p1Ly.toFixed(1)} Z`;
}

/** Solid capsule mechanical foot path seated cleanly on y = ground */
export function capsuleFootPath(fx, fy, len, pitch) {
  const dy = pitch * len;
  const backX = fx - 0.9;
  const toeX = fx + len;
  const toeY = fy + dy;
  const topY = fy - 1.25;
  const toeTopY = toeY - 1.1;
  return `M ${backX.toFixed(1)},${fy.toFixed(1)} L ${toeX.toFixed(1)},${toeY.toFixed(1)} Q ${(toeX + 0.6).toFixed(1)},${(toeY - 0.55).toFixed(1)} ${(toeX - 0.4).toFixed(1)},${toeTopY.toFixed(1)} L ${(backX + 0.2).toFixed(1)},${topY.toFixed(1)} Z`;
}
