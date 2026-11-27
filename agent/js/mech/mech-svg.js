import { mk } from "../core/utils.js";

/**
 * Builds the Flagship "Freedom Hi-MAT x Mark 85" Ver.Ka Gundam SVG rig:
 * - 3-tier individually articulated swept wing-binders + luminous bamboo plasma feathers
 * - Twin hovering Multi-Agent Micro-Funnels (Bit Staves)
 * - Psycho-frame luminous slits + 6-point thruster array (boots + Mach rings + palms + wing verniers)
 * - Sakuga awakening burst rays/ring + supersonic Mach-cone vapor ring
 * - Full-viewport scanner cone, calligraphic contrail ribbon, wake particles & radial sonar overlay
 */
export function buildMechRig({ btn, scanOverlay }) {
  // =====================================================================
  // FULL-VIEWPORT OVERLAY: SOFT VOLUMETRIC CONE + WAKE + RADIAL SONAR
  // =====================================================================
  let coneG = null;
  let conePoly = null;
  let coneCorePoly = null;
  let coneEdgeL = null;
  let coneEdgeR = null;
  let wakeDots = [];
  let trailGrad = null;
  let trailPathMain = null;
  let trailPathCore = null;
  let sonarG = null;
  let sonarOuterHalo = null;
  let sonarRingMain = null;
  let sonarRingEcho = null;

  if (scanOverlay) {
    scanOverlay.setAttribute("shape-rendering", "geometricPrecision");
    const sDefs = mk("defs", null, scanOverlay);

    const beamGrad = mk("linearGradient", { id: "agent-beam-grad", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, sDefs);
    mk("stop", { offset: "0%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, beamGrad);
    mk("stop", { offset: "11%", "stop-color": "#2D6A47", "stop-opacity": "0.20" }, beamGrad);
    mk("stop", { offset: "50%", "stop-color": "#2D6A47", "stop-opacity": "0.085" }, beamGrad);
    mk("stop", { offset: "88%", "stop-color": "#2D6A47", "stop-opacity": "0.016" }, beamGrad);
    mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, beamGrad);

    const coreBeamGrad = mk("linearGradient", { id: "agent-beam-core", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, sDefs);
    mk("stop", { offset: "0%", "stop-color": "#B5F5D4", "stop-opacity": "0.0" }, coreBeamGrad);
    mk("stop", { offset: "12%", "stop-color": "#B5F5D4", "stop-opacity": "0.30" }, coreBeamGrad);
    mk("stop", { offset: "52%", "stop-color": "#2D6A47", "stop-opacity": "0.075" }, coreBeamGrad);
    mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, coreBeamGrad);

    const flagBeamGrad = mk("linearGradient", { id: "agent-beam-flag", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, sDefs);
    mk("stop", { offset: "0%", "stop-color": "#B83B2A", "stop-opacity": "0.0" }, flagBeamGrad);
    mk("stop", { offset: "11%", "stop-color": "#B83B2A", "stop-opacity": "0.18" }, flagBeamGrad);
    mk("stop", { offset: "52%", "stop-color": "#B83B2A", "stop-opacity": "0.065" }, flagBeamGrad);
    mk("stop", { offset: "100%", "stop-color": "#B83B2A", "stop-opacity": "0.0" }, flagBeamGrad);

    const flagCoreGrad = mk("linearGradient", { id: "agent-beam-flag-core", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, sDefs);
    mk("stop", { offset: "0%", "stop-color": "#FFDCD4", "stop-opacity": "0.0" }, flagCoreGrad);
    mk("stop", { offset: "12%", "stop-color": "#FFDCD4", "stop-opacity": "0.36" }, flagCoreGrad);
    mk("stop", { offset: "52%", "stop-color": "#B83B2A", "stop-opacity": "0.07" }, flagCoreGrad);
    mk("stop", { offset: "100%", "stop-color": "#B83B2A", "stop-opacity": "0.0" }, flagCoreGrad);

    const edgeBeamGrad = mk("linearGradient", { id: "agent-edge-grad", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, sDefs);
    mk("stop", { offset: "0%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, edgeBeamGrad);
    mk("stop", { offset: "14%", "stop-color": "#2D6A47", "stop-opacity": "0.26" }, edgeBeamGrad);
    mk("stop", { offset: "82%", "stop-color": "#2D6A47", "stop-opacity": "0.08" }, edgeBeamGrad);
    mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, edgeBeamGrad);

    const edgeFlagGrad = mk("linearGradient", { id: "agent-edge-flag", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, sDefs);
    mk("stop", { offset: "0%", "stop-color": "#B83B2A", "stop-opacity": "0.0" }, edgeFlagGrad);
    mk("stop", { offset: "14%", "stop-color": "#B83B2A", "stop-opacity": "0.26" }, edgeFlagGrad);
    mk("stop", { offset: "82%", "stop-color": "#B83B2A", "stop-opacity": "0.08" }, edgeFlagGrad);
    mk("stop", { offset: "100%", "stop-color": "#B83B2A", "stop-opacity": "0.0" }, edgeFlagGrad);

    trailGrad = mk("linearGradient", { id: "agent-trail-grad", gradientUnits: "userSpaceOnUse", x1: "0", y1: "0", x2: "100", y2: "0" }, sDefs);
    mk("stop", { offset: "0%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, trailGrad);
    mk("stop", { offset: "42%", "stop-color": "#2D6A47", "stop-opacity": "0.16" }, trailGrad);
    mk("stop", { offset: "84%", "stop-color": "#5CE09B", "stop-opacity": "0.38" }, trailGrad);
    mk("stop", { offset: "100%", "stop-color": "#C9FFE2", "stop-opacity": "0.62" }, trailGrad);

    // Calligraphic bamboo ink-wash ribbon contrail (wide translucent brush + bright mint core!)
    trailPathMain = mk("path", { fill: "none", stroke: "url(#agent-trail-grad)", "stroke-width": "4.8", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: "0" }, scanOverlay);
    trailPathCore = mk("path", { fill: "none", stroke: "url(#agent-trail-grad)", "stroke-width": "1.45", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: "0" }, scanOverlay);

    for (let i = 0; i < 10; i++) {
      const d = mk("circle", { r: "1.1", fill: i % 2 === 0 ? "#5CE09B" : "#C9FFE2", opacity: "0" }, scanOverlay);
      wakeDots.push({ el: d, x: 0, y: 0, vx: 0, vy: 0, life: 0 });
    }

    coneG = mk("g", { opacity: "0" }, scanOverlay);
    conePoly = mk("polygon", { fill: "url(#agent-beam-grad)" }, coneG);
    coneCorePoly = mk("polygon", { fill: "url(#agent-beam-core)" }, coneG);
    coneEdgeL = mk("line", { stroke: "url(#agent-edge-grad)", "stroke-width": "0.7" }, coneG);
    coneEdgeR = mk("line", { stroke: "url(#agent-edge-grad)", "stroke-width": "0.7" }, coneG);

    sonarG = mk("g", { opacity: "0" }, scanOverlay);
    sonarOuterHalo = mk("circle", { fill: "none", stroke: "#2D6A47", "stroke-width": "28", "stroke-opacity": "0.055" }, sonarG);
    sonarRingMain = mk("circle", { fill: "none", stroke: "#2D6A47", "stroke-width": "1.35", "stroke-opacity": "0.58" }, sonarG);
    sonarRingEcho = mk("circle", { fill: "none", stroke: "#2D6A47", "stroke-width": "0.75", "stroke-dasharray": "4 4", "stroke-opacity": "0.34" }, sonarG);
  }

  // =====================================================================
  // FLAGSHIP "FREEDOM HI-MAT x MARK 85" SVG RIG (overflow: visible!)
  // =====================================================================
  const VIEWBOX_H = 44;
  const svg = mk("svg", { viewBox: "-24 -22 48 44", "shape-rendering": "geometricPrecision" }, btn);
  const defs = mk("defs", null, svg);

  const jetGrad = mk("linearGradient", { id: "agent-jet-grad", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#E6FFF3", "stop-opacity": "0.98" }, jetGrad);
  mk("stop", { offset: "32%", "stop-color": "#45A370", "stop-opacity": "0.74" }, jetGrad);
  mk("stop", { offset: "76%", "stop-color": "#2D6A47", "stop-opacity": "0.24" }, jetGrad);
  mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, jetGrad);

  // Luminous Bamboo Plasma Wing Feather Gradients (Left & Right + Vermilion Overdrive!)
  const wingPlasmaLGrad = mk("linearGradient", { id: "agent-wing-plasma-l", x1: "100%", y1: "50%", x2: "0%", y2: "0%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#C9FFE2", "stop-opacity": "0.78" }, wingPlasmaLGrad);
  mk("stop", { offset: "48%", "stop-color": "#5CE09B", "stop-opacity": "0.38" }, wingPlasmaLGrad);
  mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, wingPlasmaLGrad);

  const wingPlasmaRGrad = mk("linearGradient", { id: "agent-wing-plasma-r", x1: "0%", y1: "50%", x2: "100%", y2: "0%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#C9FFE2", "stop-opacity": "0.78" }, wingPlasmaRGrad);
  mk("stop", { offset: "48%", "stop-color": "#5CE09B", "stop-opacity": "0.38" }, wingPlasmaRGrad);
  mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, wingPlasmaRGrad);

  const wingPlasmaLRed = mk("linearGradient", { id: "agent-wing-plasma-l-red", x1: "100%", y1: "50%", x2: "0%", y2: "0%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#FFDCD4", "stop-opacity": "0.80" }, wingPlasmaLRed);
  mk("stop", { offset: "48%", "stop-color": "#E06352", "stop-opacity": "0.40" }, wingPlasmaLRed);
  mk("stop", { offset: "100%", "stop-color": "#B83B2A", "stop-opacity": "0.0" }, wingPlasmaLRed);

  const wingPlasmaRRed = mk("linearGradient", { id: "agent-wing-plasma-r-red", x1: "0%", y1: "50%", x2: "100%", y2: "0%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#FFDCD4", "stop-opacity": "0.80" }, wingPlasmaRRed);
  mk("stop", { offset: "48%", "stop-color": "#E06352", "stop-opacity": "0.40" }, wingPlasmaRRed);
  mk("stop", { offset: "100%", "stop-color": "#B83B2A", "stop-opacity": "0.0" }, wingPlasmaRRed);

  const awakeningGlow = mk("radialGradient", { id: "agent-awakening-glow", cx: "50%", cy: "50%", r: "50%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#FFFFFF", "stop-opacity": "0.95" }, awakeningGlow);
  mk("stop", { offset: "38%", "stop-color": "#B5F5D4", "stop-opacity": "0.52" }, awakeningGlow);
  mk("stop", { offset: "72%", "stop-color": "#2D6A47", "stop-opacity": "0.14" }, awakeningGlow);
  mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, awakeningGlow);

  const armorGrad = mk("linearGradient", { id: "agent-armor-grad", x1: "12%", y1: "0%", x2: "88%", y2: "100%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#FFFDF9" }, armorGrad);
  mk("stop", { offset: "58%", "stop-color": "#F7F3EB" }, armorGrad);
  mk("stop", { offset: "100%", "stop-color": "#E2DACB" }, armorGrad);

  const armorBackGrad = mk("linearGradient", { id: "agent-armor-back", x1: "0%", y1: "0%", x2: "100%", y2: "100%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#F1ECE2" }, armorBackGrad);
  mk("stop", { offset: "100%", "stop-color": "#DCD3C4" }, armorBackGrad);

  const visorGrad = mk("linearGradient", { id: "agent-visor-grad", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#2A2825" }, visorGrad);
  mk("stop", { offset: "45%", "stop-color": "#181715" }, visorGrad);
  mk("stop", { offset: "100%", "stop-color": "#11100F" }, visorGrad);

  const gunmetalGrad = mk("linearGradient", { id: "agent-gunmetal-grad", x1: "0%", y1: "0%", x2: "100%", y2: "100%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#45413C" }, gunmetalGrad);
  mk("stop", { offset: "55%", "stop-color": "#2B2825" }, gunmetalGrad);
  mk("stop", { offset: "100%", "stop-color": "#1A1816" }, gunmetalGrad);

  const nozzleHaloGrad = mk("radialGradient", { id: "agent-nozzle-halo", cx: "50%", cy: "50%", r: "50%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#C9FFE2", "stop-opacity": "0.82" }, nozzleHaloGrad);
  mk("stop", { offset: "55%", "stop-color": "#2D6A47", "stop-opacity": "0.24" }, nozzleHaloGrad);
  mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, nozzleHaloGrad);

  const coreGlow = mk("radialGradient", { id: "agent-core-glow", cx: "50%", cy: "50%", r: "50%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#5CE09B", "stop-opacity": "0.72" }, coreGlow);
  mk("stop", { offset: "58%", "stop-color": "#2D6A47", "stop-opacity": "0.20" }, coreGlow);
  mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, coreGlow);

  const coreGlowRed = mk("radialGradient", { id: "agent-core-glow-red", cx: "50%", cy: "50%", r: "50%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#FF9482", "stop-opacity": "0.72" }, coreGlowRed);
  mk("stop", { offset: "58%", "stop-color": "#B83B2A", "stop-opacity": "0.22" }, coreGlowRed);
  mk("stop", { offset: "100%", "stop-color": "#B83B2A", "stop-opacity": "0.0" }, coreGlowRed);

  const eyeGlow = mk("radialGradient", { id: "agent-eye-glow", cx: "50%", cy: "50%", r: "50%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#B5F5D4", "stop-opacity": "0.42" }, eyeGlow);
  mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, eyeGlow);

  // Dock confirmation ripple & subtle floating shadow
  const dockRing = mk("circle", { cx: "0", cy: "1", r: "10", fill: "none", stroke: "#2D6A47", "stroke-width": "1.0", opacity: "0" }, svg);
  const foldSparks = mk("g", { opacity: "0" }, svg);
  mk("path", {
    d: "M -14,-11 L -18,-14 M 14,-11 L 18,-14 M -14,11 L -18,14 M 14,11 L 18,14",
    fill: "none", stroke: "#2D6A47", "stroke-width": "1.1", "stroke-linecap": "round"
  }, foldSparks);
  const dockShadow = mk("ellipse", { cx: "0", cy: "15.2", rx: "8.2", ry: "1.25", fill: "#1D1B18", "fill-opacity": "0.095", opacity: "0" }, svg);

  // Whole-craft root (handles aerodynamic body banking & weightless float)
  const craftG = mk("g", null, svg);

  // =====================================================================
  // SAKUGA AWAKENING BURST FX (behind mech body: flash halo + burst rays + shockwave!)
  // =====================================================================
  const awakeningG = mk("g", { opacity: "0" }, craftG);
  const awakeningHalo = mk("circle", { cx: "0", cy: "2", r: "22", fill: "url(#agent-awakening-glow)" }, awakeningG);
  const awakeningRing = mk("circle", { cx: "0", cy: "2", r: "8", fill: "none", stroke: "#5CE09B", "stroke-width": "1.5", opacity: "0" }, awakeningG);
  const awakeningRing2 = mk("circle", { cx: "0", cy: "2", r: "5", fill: "none", stroke: "#2D6A47", "stroke-width": "0.85", "stroke-dasharray": "3 2", opacity: "0" }, awakeningG);
  const awakeningRays = mk("g", { opacity: "0" }, awakeningG);
  const rayAngles = [0, 38, 90, 142, 180, 218, 270, 322];
  rayAngles.forEach((deg, idx) => {
    const rad = (deg * Math.PI) / 180;
    const r0 = idx % 2 === 0 ? 11 : 13;
    const r1 = idx % 2 === 0 ? 25 : 21;
    mk("line", {
      x1: (Math.cos(rad) * r0).toFixed(1),
      y1: (2 + Math.sin(rad) * r0).toFixed(1),
      x2: (Math.cos(rad) * r1).toFixed(1),
      y2: (2 + Math.sin(rad) * r1).toFixed(1),
      stroke: idx % 2 === 0 ? "#2D6A47" : "#5CE09B",
      "stroke-width": idx % 2 === 0 ? "1.05" : "0.75",
      "stroke-linecap": "round"
    }, awakeningRays);
  });

  // Track all luminous psycho-frame / plasma accent elements for Bamboo <-> Vermilion Overdrive!
  const psychoSlits = [];

  // =====================================================================
  // FLAGSHIP TACTICAL MECH BODY (Freedom Hi-MAT 3-Tier Wings + Twin Funnels!)
  // =====================================================================
  const bodyRigG = mk("g", { class: "mech-body-rig", opacity: "0" }, craftG);

  // --- 3-Tier Hi-MAT Articulated Aero Wing-Binders + Luminous Plasma Feathers ---
  const packG = mk("g", null, bodyRigG);

  // LEFT 3-TIER WING-BINDER (Upper ceramic blade + Mid titanium railgun fin + Lower stabilizer!)
  const wingL = mk("g", null, packG);
  const wingPlasmaL = mk("path", {
    d: "M -4.2,-1.2 Q -12.6,-7.6 -22.2,-11.2 Q -18.0,-4.4 -13.6,0.2 Q -17.4,2.8 -19.2,4.8 Q -11.4,4.2 -4.2,2.4 Z",
    fill: "url(#agent-wing-plasma-l)",
    opacity: "0"
  }, wingL);
  // Lower swept stabilizer winglet
  const wingLLower = mk("g", null, wingL);
  mk("path", {
    d: "M -4.0,1.2 L -12.4,4.6 L -10.0,6.2 L -4.0,3.2 Z",
    fill: "url(#agent-armor-back)", stroke: "#1D1B18", "stroke-width": "0.68", "stroke-linejoin": "round"
  }, wingLLower);
  const slitWLL = mk("line", { x1: "-5.2", y1: "2.3", x2: "-10.6", y2: "4.6", stroke: "#5CE09B", "stroke-width": "0.62", "stroke-linecap": "round" }, wingLLower);
  psychoSlits.push(slitWLL);
  // Mid dark-titanium vernier rail-blade + wing thruster plume!
  const wingLMid = mk("g", null, wingL);
  const jetWingLG = mk("g", { opacity: "0" }, wingLMid);
  const jetWingL = mk("path", { fill: "url(#agent-jet-grad)" }, jetWingLG);
  mk("path", {
    d: "M -3.8,-0.3 L -15.4,-2.4 L -14.2,0.8 L -4.2,1.6 Z",
    fill: "url(#agent-gunmetal-grad)", stroke: "#1D1B18", "stroke-width": "0.72", "stroke-linejoin": "round"
  }, wingLMid);
  const slitWLM = mk("line", { x1: "-5.2", y1: "0.2", x2: "-13.6", y2: "-1.1", stroke: "#5CE09B", "stroke-width": "0.72", "stroke-linecap": "round" }, wingLMid);
  psychoSlits.push(slitWLM);
  // Upper razor-swept porcelain main aero wing-blade
  const wingLUpper = mk("g", null, wingL);
  mk("path", {
    d: "M -3.6,-1.6 L -16.4,-9.8 L -18.2,-7.6 L -14.8,-1.8 L -6.8,0.4 L -3.6,0.2 Z",
    fill: "url(#agent-armor-back)", stroke: "#1D1B18", "stroke-width": "0.78", "stroke-linejoin": "round"
  }, wingLUpper);
  mk("polygon", { points: "-5.2,-1.6 -15.2,-7.8 -14.2,-5.4 -5.4,-0.2", fill: "#2B2825" }, wingLUpper);
  const slitWLU = mk("line", { x1: "-6.0", y1: "-1.4", x2: "-14.4", y2: "-6.6", stroke: "#5CE09B", "stroke-width": "0.82", "stroke-linecap": "round" }, wingLUpper);
  psychoSlits.push(slitWLU);

  // RIGHT 3-TIER WING-BINDER (Exact sunlit mirror!)
  const wingR = mk("g", null, packG);
  const wingPlasmaR = mk("path", {
    d: "M 4.2,-1.2 Q 12.6,-7.6 22.2,-11.2 Q 18.0,-4.4 13.6,0.2 Q 17.4,2.8 19.2,4.8 Q 11.4,4.2 4.2,2.4 Z",
    fill: "url(#agent-wing-plasma-r)",
    opacity: "0"
  }, wingR);
  const wingRLower = mk("g", null, wingR);
  mk("path", {
    d: "M 4.0,1.2 L 12.4,4.6 L 10.0,6.2 L 4.0,3.2 Z",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.68", "stroke-linejoin": "round"
  }, wingRLower);
  const slitWRL = mk("line", { x1: "5.2", y1: "2.3", x2: "10.6", y2: "4.6", stroke: "#5CE09B", "stroke-width": "0.62", "stroke-linecap": "round" }, wingRLower);
  psychoSlits.push(slitWRL);
  const wingRMid = mk("g", null, wingR);
  const jetWingRG = mk("g", { opacity: "0" }, wingRMid);
  const jetWingR = mk("path", { fill: "url(#agent-jet-grad)" }, jetWingRG);
  mk("path", {
    d: "M 3.8,-0.3 L 15.4,-2.4 L 14.2,0.8 L 4.2,1.6 Z",
    fill: "url(#agent-gunmetal-grad)", stroke: "#1D1B18", "stroke-width": "0.72", "stroke-linejoin": "round"
  }, wingRMid);
  const slitWRM = mk("line", { x1: "5.2", y1: "0.2", x2: "13.6", y2: "-1.1", stroke: "#5CE09B", "stroke-width": "0.72", "stroke-linecap": "round" }, wingRMid);
  psychoSlits.push(slitWRM);
  const wingRUpper = mk("g", null, wingR);
  mk("path", {
    d: "M 3.6,-1.6 L 16.4,-9.8 L 18.2,-7.6 L 14.8,-1.8 L 6.8,0.4 L 3.6,0.2 Z",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.78", "stroke-linejoin": "round"
  }, wingRUpper);
  mk("line", { x1: "5.0", y1: "-2.0", x2: "15.8", y2: "-8.7", stroke: "#FFFFFF", "stroke-width": "0.58", "stroke-opacity": "0.88", "stroke-linecap": "round" }, wingRUpper);
  mk("polygon", { points: "5.2,-1.6 15.2,-7.8 14.2,-5.4 5.4,-0.2", fill: "#2B2825" }, wingRUpper);
  const slitWRU = mk("line", { x1: "6.0", y1: "-1.4", x2: "14.4", y2: "-6.6", stroke: "#5CE09B", "stroke-width": "0.82", "stroke-linecap": "round" }, wingRUpper);
  psychoSlits.push(slitWRU);

  // --- Twin Floating Multi-Agent Micro-Funnels (Bit Staves symbolizing Multi-Agent Orchestration!) ---
  const funnelL = mk("g", { opacity: "0" }, bodyRigG);
  const funnelJetL = mk("path", { d: "M -0.8,2.2 L 0.8,2.2 L 0,5.2 Z", fill: "url(#agent-jet-grad)", opacity: "0.75" }, funnelL);
  mk("polygon", {
    points: "0,-3.4 2.1,-0.6 1.5,2.4 -1.5,2.4 -2.1,-0.6",
    fill: "url(#agent-armor-back)", stroke: "#1D1B18", "stroke-width": "0.65", "stroke-linejoin": "round"
  }, funnelL);
  mk("polygon", { points: "0,-2.0 1.0,-0.4 0.7,1.4 -0.7,1.4 -1.0,-0.4", fill: "#2B2825" }, funnelL);
  const funnelCoreL = mk("line", { x1: "0", y1: "-1.4", x2: "0", y2: "0.9", stroke: "#5CE09B", "stroke-width": "0.75", "stroke-linecap": "round" }, funnelL);
  psychoSlits.push(funnelCoreL);

  const funnelR = mk("g", { opacity: "0" }, bodyRigG);
  const funnelJetR = mk("path", { d: "M -0.8,2.2 L 0.8,2.2 L 0,5.2 Z", fill: "url(#agent-jet-grad)", opacity: "0.75" }, funnelR);
  mk("polygon", {
    points: "0,-3.4 2.1,-0.6 1.5,2.4 -1.5,2.4 -2.1,-0.6",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.65", "stroke-linejoin": "round"
  }, funnelR);
  mk("polygon", { points: "0,-2.0 1.0,-0.4 0.7,1.4 -0.7,1.4 -1.0,-0.4", fill: "#2B2825" }, funnelR);
  const funnelCoreR = mk("line", { x1: "0", y1: "-1.4", x2: "0", y2: "0.9", stroke: "#5CE09B", "stroke-width": "0.75", "stroke-linecap": "round" }, funnelR);
  psychoSlits.push(funnelCoreR);

  // --- Heavy Armored 2-Bone Mecha Legs (Faceted Thighs + Angular Knee Shields + Flared Vernier Greaves!) ---
  const legsG = mk("g", null, bodyRigG);

  // Left / Rear heavy armored leg
  const legL = mk("g", null, legsG);
  mk("circle", { cx: "-2.6", cy: "10.6", r: "1.15", fill: "url(#agent-gunmetal-grad)" }, legL);
  mk("path", {
    d: "M -4.0,10.6 L -1.4,10.6 L -1.6,13.9 L -3.7,14.2 L -4.3,12.2 Z",
    fill: "url(#agent-armor-back)", stroke: "#1D1B18", "stroke-width": "0.76", "stroke-linejoin": "round"
  }, legL);
  mk("line", { x1: "-3.7", y1: "12.2", x2: "-1.8", y2: "12.0", stroke: "#1D1B18", "stroke-width": "0.42", "stroke-opacity": "0.4" }, legL);
  mk("circle", { cx: "-2.65", cy: "14.1", r: "1.1", fill: "url(#agent-gunmetal-grad)" }, legL);
  const shinL = mk("g", null, legL);
  const jetBootLG = mk("g", { opacity: "0" }, shinL);
  mk("ellipse", { cx: "-2.65", cy: "19.3", rx: "3.0", ry: "1.9", fill: "url(#agent-nozzle-halo)" }, jetBootLG);
  const jetBootL = mk("path", { fill: "url(#agent-jet-grad)" }, jetBootLG);
  const jetBootLCore = mk("path", { fill: "#EBFFF3", "fill-opacity": "0.96" }, jetBootLG);
  const machL1 = mk("ellipse", { cx: "-2.65", cy: "21.8", rx: "1.02", ry: "0.36", fill: "#EBFFF3", opacity: "0.88" }, jetBootLG);
  mk("path", {
    d: "M -3.9,14.5 L -1.3,14.5 L -0.9,18.5 L -2.65,19.1 L -4.6,18.4 L -4.4,16.1 Z",
    fill: "url(#agent-armor-back)", stroke: "#1D1B18", "stroke-width": "0.80", "stroke-linejoin": "round"
  }, shinL);
  mk("polygon", {
    points: "-3.6,13.4 -1.7,13.4 -1.9,15.3 -2.65,15.8 -3.4,15.3",
    fill: "url(#agent-gunmetal-grad)", stroke: "#1D1B18", "stroke-width": "0.65", "stroke-linejoin": "round"
  }, shinL);
  const slitKneeL = mk("line", { x1: "-3.1", y1: "14.0", x2: "-2.2", y2: "14.0", stroke: "#5CE09B", "stroke-width": "0.55", "stroke-linecap": "round" }, shinL);
  psychoSlits.push(slitKneeL);
  mk("path", { d: "M -4.2,17.2 L -1.2,17.2", fill: "none", stroke: "#1D1B18", "stroke-width": "0.5", "stroke-opacity": "0.45" }, shinL);
  mk("line", { x1: "-4.1", y1: "15.8", x2: "-4.1", y2: "16.7", stroke: "#2D6A47", "stroke-width": "0.65", "stroke-linecap": "round" }, shinL);
  mk("ellipse", { cx: "-2.65", cy: "18.85", rx: "1.40", ry: "0.50", fill: "#1D1B18" }, shinL);
  mk("ellipse", { cx: "-2.65", cy: "18.92", rx: "1.02", ry: "0.36", fill: "#C9FFE2" }, shinL);

  // Right / Front heavy armored leg
  const legR = mk("g", null, legsG);
  mk("circle", { cx: "2.6", cy: "10.6", r: "1.15", fill: "url(#agent-gunmetal-grad)" }, legR);
  mk("path", {
    d: "M 1.4,10.6 L 4.0,10.6 L 4.3,12.4 L 3.7,14.6 L 1.6,14.4 Z",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.78", "stroke-linejoin": "round"
  }, legR);
  mk("line", { x1: "2.0", y1: "11.1", x2: "2.0", y2: "13.5", stroke: "#FFFFFF", "stroke-width": "0.52", "stroke-opacity": "0.82", "stroke-linecap": "round" }, legR);
  mk("line", { x1: "1.8", y1: "12.4", x2: "3.8", y2: "12.6", stroke: "#1D1B18", "stroke-width": "0.42", "stroke-opacity": "0.38" }, legR);
  mk("circle", { cx: "2.65", cy: "14.6", r: "1.12", fill: "url(#agent-gunmetal-grad)" }, legR);
  const shinR = mk("g", null, legR);
  const jetBootRG = mk("g", { opacity: "0" }, shinR);
  mk("ellipse", { cx: "2.65", cy: "20.4", rx: "3.2", ry: "2.0", fill: "url(#agent-nozzle-halo)" }, jetBootRG);
  const jetBootR = mk("path", { fill: "url(#agent-jet-grad)" }, jetBootRG);
  const jetBootRCore = mk("path", { fill: "#EBFFF3", "fill-opacity": "0.96" }, jetBootRG);
  const machR1 = mk("ellipse", { cx: "2.65", cy: "23.1", rx: "1.06", ry: "0.38", fill: "#EBFFF3", opacity: "0.90" }, jetBootRG);
  mk("path", {
    d: "M 1.3,15.0 L 3.9,15.0 L 4.5,16.8 L 4.65,19.6 L 2.65,20.3 L 0.85,19.6 Z",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.82", "stroke-linejoin": "round"
  }, shinR);
  mk("line", { x1: "1.6", y1: "16.0", x2: "1.35", y2: "18.8", stroke: "#FFFFFF", "stroke-width": "0.55", "stroke-opacity": "0.78", "stroke-linecap": "round" }, shinR);
  mk("polygon", {
    points: "1.7,13.8 3.6,13.8 3.4,15.8 2.65,16.3 1.9,15.8",
    fill: "url(#agent-gunmetal-grad)", stroke: "#1D1B18", "stroke-width": "0.68", "stroke-linejoin": "round"
  }, shinR);
  const slitKneeR = mk("line", { x1: "2.2", y1: "14.4", x2: "3.1", y2: "14.4", stroke: "#5CE09B", "stroke-width": "0.55", "stroke-linecap": "round" }, shinR);
  psychoSlits.push(slitKneeR);
  mk("path", { d: "M 1.2,17.8 L 4.2,17.8", fill: "none", stroke: "#1D1B18", "stroke-width": "0.5", "stroke-opacity": "0.42" }, shinR);
  mk("line", { x1: "4.1", y1: "16.4", x2: "4.1", y2: "17.3", stroke: "#2D6A47", "stroke-width": "0.65", "stroke-linecap": "round" }, shinR);
  mk("ellipse", { cx: "2.65", cy: "20.0", rx: "1.46", ry: "0.53", fill: "#1D1B18" }, shinR);
  mk("ellipse", { cx: "2.65", cy: "20.08", rx: "1.06", ry: "0.39", fill: "#C9FFE2" }, shinR);

  // --- Ace-Spec Layered Shoulder Pauldrons + Repulsor Vambraces ---
  const armL = mk("g", null, bodyRigG);
  const jetPalmLG = mk("g", { opacity: "0" }, armL);
  mk("circle", { cx: "-9.9", cy: "9.4", r: "2.4", fill: "url(#agent-nozzle-halo)" }, jetPalmLG);
  const jetPalmL = mk("path", { fill: "url(#agent-jet-grad)" }, jetPalmLG);
  const jetPalmLCore = mk("path", { fill: "#EBFFF3", "fill-opacity": "0.95" }, jetPalmLG);
  mk("line", { x1: "-5.8", y1: "0.5", x2: "-8.1", y2: "4.3", stroke: "#2B2825", "stroke-width": "1.75", "stroke-linecap": "round" }, armL);
  mk("rect", { x: "-9.0", y: "3.3", width: "1.95", height: "1.9", rx: "0.5", fill: "url(#agent-gunmetal-grad)", stroke: "#1D1B18", "stroke-width": "0.5" }, armL);
  // Sharper swept Ace-Gundam Shoulder Pauldron with raised outer thruster cowl
  mk("path", {
    d: "M -4.7,-1.6 L -8.4,-2.6 L -9.3,0.4 L -7.6,2.5 L -5.0,1.9 Z",
    fill: "url(#agent-armor-back)", stroke: "#1D1B18", "stroke-width": "0.80", "stroke-linejoin": "round"
  }, armL);
  mk("polygon", { points: "-8.2,-2.0 -8.9,0.3 -7.4,2.1 -6.7,1.6 -7.4,0.0", fill: "#2B2825" }, armL);
  const slitShL = mk("line", { x1: "-5.4", y1: "-0.8", x2: "-7.8", y2: "-1.5", stroke: "#5CE09B", "stroke-width": "0.68", "stroke-linecap": "round" }, armL);
  psychoSlits.push(slitShL);
  mk("path", {
    d: "M -7.1,3.7 L -9.3,4.6 L -11.3,8.5 L -9.8,9.6 L -8.1,8.7 L -6.6,5.2 Z",
    fill: "url(#agent-armor-back)", stroke: "#1D1B18", "stroke-width": "0.80", "stroke-linejoin": "round"
  }, armL);
  const slitArmL = mk("line", { x1: "-8.2", y1: "5.8", x2: "-10.1", y2: "6.6", stroke: "#5CE09B", "stroke-width": "0.68", "stroke-linecap": "round" }, armL);
  psychoSlits.push(slitArmL);
  mk("line", { x1: "-8.8", y1: "7.1", x2: "-10.4", y2: "7.8", stroke: "#1D1B18", "stroke-width": "0.45", "stroke-opacity": "0.45" }, armL);
  mk("circle", { cx: "-9.8", cy: "9.2", r: "1.18", fill: "#1D1B18" }, armL);
  mk("circle", { cx: "-9.8", cy: "9.2", r: "0.78", fill: "#C9FFE2" }, armL);
  mk("circle", { cx: "-9.8", cy: "9.2", r: "0.35", fill: "#FFFFFF" }, armL);

  const armR = mk("g", null, bodyRigG);
  const jetPalmRG = mk("g", { opacity: "0" }, armR);
  mk("circle", { cx: "9.9", cy: "9.4", r: "2.4", fill: "url(#agent-nozzle-halo)" }, jetPalmRG);
  const jetPalmR = mk("path", { fill: "url(#agent-jet-grad)" }, jetPalmRG);
  const jetPalmRCore = mk("path", { fill: "#EBFFF3", "fill-opacity": "0.95" }, jetPalmRG);
  mk("line", { x1: "5.8", y1: "0.5", x2: "8.1", y2: "4.3", stroke: "#2B2825", "stroke-width": "1.75", "stroke-linecap": "round" }, armR);
  mk("rect", { x: "7.05", y: "3.3", width: "1.95", height: "1.9", rx: "0.5", fill: "url(#agent-gunmetal-grad)", stroke: "#1D1B18", "stroke-width": "0.5" }, armR);
  mk("path", {
    d: "M 4.7,-1.6 L 8.4,-2.6 L 9.3,0.4 L 7.6,2.5 L 5.0,1.9 Z",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.82", "stroke-linejoin": "round"
  }, armR);
  mk("polygon", { points: "8.2,-2.0 8.9,0.3 7.4,2.1 6.7,1.6 7.4,0.0", fill: "#2B2825" }, armR);
  const slitShR = mk("line", { x1: "5.4", y1: "-0.8", x2: "7.8", y2: "-1.5", stroke: "#5CE09B", "stroke-width": "0.68", "stroke-linecap": "round" }, armR);
  psychoSlits.push(slitShR);
  mk("path", {
    d: "M 7.1,3.7 L 9.3,4.6 L 11.3,8.5 L 9.8,9.6 L 8.1,8.7 L 6.6,5.2 Z",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.82", "stroke-linejoin": "round"
  }, armR);
  const slitArmR = mk("line", { x1: "8.2", y1: "5.8", x2: "10.1", y2: "6.6", stroke: "#5CE09B", "stroke-width": "0.68", "stroke-linecap": "round" }, armR);
  psychoSlits.push(slitArmR);
  mk("line", { x1: "8.8", y1: "7.1", x2: "10.4", y2: "7.8", stroke: "#1D1B18", "stroke-width": "0.45", "stroke-opacity": "0.45" }, armR);
  mk("circle", { cx: "9.8", cy: "9.2", r: "1.18", fill: "#1D1B18" }, armR);
  mk("circle", { cx: "9.8", cy: "9.2", r: "0.78", fill: "#C9FFE2" }, armR);
  mk("circle", { cx: "9.8", cy: "9.2", r: "0.35", fill: "#FFFFFF" }, armR);

  // --- Heroic V-Taper Pectoral Chest Armor + Psycho-Frame Slits + Segmented Abs + Skirt Armor ---
  const torsoG = mk("g", null, bodyRigG);
  mk("path", {
    d: "M -2.3,-4.4 L 2.3,-4.4 L 2.9,-1.2 L -2.9,-1.2 Z",
    fill: "url(#agent-gunmetal-grad)", stroke: "#1D1B18", "stroke-width": "0.6", "stroke-linejoin": "round"
  }, torsoG);
  mk("path", {
    d: "M -4.0,-1.5 L -3.2,-2.9 L -1.8,-2.5 L -1.8,-1.5 M 4.0,-1.5 L 3.2,-2.9 L 1.8,-2.5 L 1.8,-1.5",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.68", "stroke-linejoin": "round"
  }, torsoG);
  mk("rect", { x: "-3.1", y: "6.3", width: "6.2", height: "3.2", rx: "0.7", fill: "url(#agent-gunmetal-grad)" }, torsoG);
  mk("path", {
    d: "M -2.4,7.3 L 2.4,7.3 M -2.2,8.4 L 2.2,8.4",
    fill: "none", stroke: "#FAF8F4", "stroke-width": "0.52", "stroke-opacity": "0.38", "stroke-linecap": "round"
  }, torsoG);
  mk("polygon", {
    points: "-4.4,8.6 -1.5,8.6 -1.8,11.1 -4.7,10.5",
    fill: "url(#agent-armor-back)", stroke: "#1D1B18", "stroke-width": "0.74", "stroke-linejoin": "round"
  }, torsoG);
  mk("polygon", {
    points: "1.5,8.6 4.4,8.6 4.7,10.5 1.8,11.1",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.74", "stroke-linejoin": "round"
  }, torsoG);
  mk("polygon", {
    points: "-1.6,8.4 1.6,8.4 1.2,11.3 0,11.8 -1.2,11.3",
    fill: "url(#agent-gunmetal-grad)", stroke: "#1D1B18", "stroke-width": "0.74", "stroke-linejoin": "round"
  }, torsoG);
  const slitCod = mk("line", { x1: "0", y1: "9.0", x2: "0", y2: "11.0", stroke: "#5CE09B", "stroke-width": "0.58", "stroke-linecap": "round" }, torsoG);
  psychoSlits.push(slitCod);

  mk("path", {
    d: "M -4.8,-1.7 L 4.8,-1.7 L 5.8,0.4 L 4.6,5.8 L 3.0,7.2 L -3.0,7.2 L -4.6,5.8 L -5.8,0.4 Z",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.86", "stroke-linejoin": "round"
  }, torsoG);
  mk("line", { x1: "-3.8", y1: "-0.95", x2: "3.2", y2: "-0.95", stroke: "#FFFFFF", "stroke-width": "0.70", "stroke-opacity": "0.88", "stroke-linecap": "round" }, torsoG);

  const chestDetailG = mk("g", null, torsoG);
  mk("polygon", { points: "-4.6,0.4 -2.5,0.8 -2.5,2.2 -4.3,1.8", fill: "#2B2825" }, chestDetailG);
  mk("polygon", { points: "4.6,0.4 2.5,0.8 2.5,2.2 4.3,1.8", fill: "#2B2825" }, chestDetailG);
  const slitChestL = mk("line", { x1: "-4.1", y1: "1.2", x2: "-2.8", y2: "1.45", stroke: "#5CE09B", "stroke-width": "0.52", "stroke-linecap": "round" }, chestDetailG);
  const slitChestR = mk("line", { x1: "4.1", y1: "1.2", x2: "2.8", y2: "1.45", stroke: "#5CE09B", "stroke-width": "0.52", "stroke-linecap": "round" }, chestDetailG);
  psychoSlits.push(slitChestL, slitChestR);
  mk("path", {
    d: "M -4.4,-0.8 L -1.8,1.2 M 4.4,-0.8 L 1.8,1.2 M -3.6,5.9 L -1.6,4.2 M 3.6,5.9 L 1.6,4.2",
    fill: "none", stroke: "#1D1B18", "stroke-width": "0.54", "stroke-opacity": "0.42", "stroke-linecap": "round"
  }, chestDetailG);
  const chestGlowEl = mk("circle", { cx: "0", cy: "2.8", r: "5.2", fill: "url(#agent-core-glow)" }, chestDetailG);
  mk("polygon", {
    points: "0,0.45 2.15,1.6 2.15,4.0 0,5.15 -2.15,4.0 -2.15,1.6",
    fill: "url(#agent-gunmetal-grad)", stroke: "#1D1B18", "stroke-width": "0.65", "stroke-linejoin": "round"
  }, chestDetailG);
  const chestCore = mk("polygon", {
    points: "0,1.25 1.38,2.0 1.38,3.6 0,4.35 -1.38,3.6 -1.38,2.0",
    fill: "#2D6A47"
  }, chestDetailG);
  mk("circle", { cx: "-0.38", cy: "2.35", r: "0.44", fill: "#EBFFF3", "fill-opacity": "0.94" }, chestDetailG);

  // --- Supersonic Mach-Cone Vapor Ring (snaps around waist during rocket liftoff!) ---
  const machConeG = mk("g", { opacity: "0" }, craftG);
  const machConeOuter = mk("ellipse", {
    cx: "0", cy: "7.5", rx: "16", ry: "4.2",
    fill: "#FAF8F4", "fill-opacity": "0.34", stroke: "#2D6A47", "stroke-width": "1.15"
  }, machConeG);
  const machConeInner = mk("ellipse", {
    cx: "0", cy: "7.5", rx: "11", ry: "2.6",
    fill: "none", stroke: "#C9FFE2", "stroke-width": "0.95", "stroke-opacity": "0.9"
  }, machConeG);

  // =====================================================================
  // ICONIC ROBOT CRT HEAD + SHARP DOUBLE-BLADE V-FIN CREST + SPRING ANTENNA
  // =====================================================================
  const DOCKED_HEAD_SCALE = 1.26;
  const FLIGHT_HEAD_SCALE = 0.94;
  const FLIGHT_HEAD_Y = -8.8;
  const LAUNCH_MATCH_SCALE = 1.32;
  const FLY_SCALE = 1.46;

  const headG = mk("g", { transform: `translate(0, ${FLIGHT_HEAD_Y}) scale(${FLIGHT_HEAD_SCALE})` }, craftG);

  const antG = mk("g", null, headG);
  mk("rect", { x: "-1.5", y: "-7.2", width: "3.0", height: "1.4", rx: "0.5", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.8" }, antG);
  mk("line", { x1: "0", y1: "-7.2", x2: "0", y2: "-10.5", stroke: "#1D1B18", "stroke-width": "1.1", "stroke-linecap": "round" }, antG);
  const statusTip = mk("circle", {
    class: "mech-status-slit",
    cx: "0", cy: "-11.4", r: "1.45",
    fill: "#2D6A47", stroke: "#1D1B18", "stroke-width": "0.85"
  }, antG);

  // Sharp Double-Blade Ace V-Fin Crest + Luminous Sensor Diamond
  const crestEl = mk("g", null, headG);
  mk("path", {
    d: "M -7.6,-8.0 L -1.5,-5.5 L 0,-8.2 L 1.5,-5.5 L 7.6,-8.0 L 2.0,-4.1 L -2.0,-4.1 Z",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.82", "stroke-linejoin": "round"
  }, crestEl);
  mk("path", {
    d: "M -5.4,-8.6 L -1.6,-6.2 M 5.4,-8.6 L 1.6,-6.2",
    fill: "none", stroke: "#1D1B18", "stroke-width": "0.72", "stroke-linecap": "round"
  }, crestEl);
  const crestGem = mk("polygon", { points: "0,-7.4 0.9,-5.6 0,-4.4 -0.9,-5.6", fill: "#2D6A47" }, crestEl);

  const earL = mk("rect", { x: "-9.1", y: "-2.1", width: "1.9", height: "4.2", rx: "0.75", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.9" }, headG);
  const earR = mk("rect", { x: "7.2", y: "-2.1", width: "1.9", height: "4.2", rx: "0.75", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.9" }, headG);

  mk("rect", {
    x: "-7.3", y: "-5.8", width: "14.6", height: "11.6", rx: "3.3",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "1.02"
  }, headG);
  mk("line", {
    x1: "-4.4", y1: "-4.85", x2: "3.8", y2: "-4.85",
    stroke: "#FFFFFF", "stroke-width": "0.75", "stroke-opacity": "0.90", "stroke-linecap": "round"
  }, headG);

  const facePlateG = mk("g", null, headG);
  mk("rect", {
    x: "-5.6", y: "-3.4", width: "11.2", height: "6.6", rx: "2.1",
    fill: "url(#agent-visor-grad)"
  }, facePlateG);

  const visorAura = mk("ellipse", { cx: "0", cy: "-0.1", rx: "4.8", ry: "2.4", fill: "url(#agent-eye-glow)", opacity: "0.52" }, facePlateG);
  const visorGlint = mk("path", {
    d: "M -4.5,-2.15 Q -3.1,-2.35 -1.6,-2.15 M -4.2,-1.1 L -3.5,-1.1",
    fill: "none", stroke: "#FAF8F4", "stroke-width": "0.62", "stroke-opacity": "0.34", "stroke-linecap": "round"
  }, facePlateG);

  const eyesIdleG = mk("g", { class: "mech-eyes-idle" }, facePlateG);
  const eyesTrackG = mk("g", null, eyesIdleG);
  const eyeL = mk("rect", { x: "-3.65", y: "-1.55", width: "2.2", height: "3.1", rx: "1.1", fill: "#EBFFF3" }, eyesTrackG);
  const eyeR = mk("rect", { x: "1.45", y: "-1.55", width: "2.2", height: "3.1", rx: "1.1", fill: "#EBFFF3" }, eyesTrackG);

  const eyesHappyG = mk("g", { class: "mech-eyes-happy" }, facePlateG);
  mk("path", {
    d: "M -3.9,0.7 Q -2.55,-1.4 -1.2,0.7 M 1.2,0.7 Q 2.55,-1.4 3.9,0.7",
    fill: "none", stroke: "#B5F5D4", "stroke-width": "1.15", "stroke-linecap": "round"
  }, eyesHappyG);

  const eyesWinkG = mk("g", { class: "mech-eyes-wink" }, facePlateG);
  mk("rect", { x: "-3.65", y: "-1.55", width: "2.2", height: "3.1", rx: "1.1", fill: "#B5F5D4" }, eyesWinkG);
  mk("path", {
    d: "M 1.2,0.7 Q 2.55,-1.3 3.9,0.7",
    fill: "none", stroke: "#B5F5D4", "stroke-width": "1.15", "stroke-linecap": "round"
  }, eyesWinkG);

  return {
    coneG, conePoly, coneCorePoly, coneEdgeL, coneEdgeR, wakeDots, trailGrad, trailPathMain, trailPathCore,
    sonarG, sonarOuterHalo, sonarRingMain, sonarRingEcho,
    VIEWBOX_H, svg, dockRing, foldSparks, dockShadow, craftG,
    awakeningG, awakeningHalo, awakeningRing, awakeningRing2, awakeningRays,
    machConeG, machConeOuter, machConeInner,
    bodyRigG, packG,
    wingL, wingLUpper, wingLMid, wingLLower, wingPlasmaL, jetWingLG, jetWingL,
    wingR, wingRUpper, wingRMid, wingRLower, wingPlasmaR, jetWingRG, jetWingR,
    funnelL, funnelJetL, funnelR, funnelJetR,
    psychoSlits, chestGlowEl, crestGem,
    legL, shinL, jetBootLG, jetBootL, jetBootLCore, machL1,
    legR, shinR, jetBootRG, jetBootR, jetBootRCore, machR1,
    armL, jetPalmLG, jetPalmL, jetPalmLCore,
    armR, jetPalmRG, jetPalmR, jetPalmRCore,
    chestDetailG, chestCore,
    DOCKED_HEAD_SCALE, FLIGHT_HEAD_SCALE, FLIGHT_HEAD_Y, LAUNCH_MATCH_SCALE, FLY_SCALE,
    headG, antG, statusTip, crestEl, earL, earR, facePlateG, visorAura, visorGlint, eyesTrackG, eyeL, eyeR
  };
}
