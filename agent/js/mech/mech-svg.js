import { mk } from "../core/utils.js";

/**
 * Builds the unified Ver.Ka Gundam SVG rig inside the top-left avatar button
 * plus the full-viewport scanner cone, contrail ribbon, wake particles, and sonar overlay.
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
    mk("stop", { offset: "11%", "stop-color": "#2D6A47", "stop-opacity": "0.19" }, beamGrad);
    mk("stop", { offset: "50%", "stop-color": "#2D6A47", "stop-opacity": "0.08" }, beamGrad);
    mk("stop", { offset: "88%", "stop-color": "#2D6A47", "stop-opacity": "0.016" }, beamGrad);
    mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, beamGrad);

    const coreBeamGrad = mk("linearGradient", { id: "agent-beam-core", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, sDefs);
    mk("stop", { offset: "0%", "stop-color": "#B5F5D4", "stop-opacity": "0.0" }, coreBeamGrad);
    mk("stop", { offset: "12%", "stop-color": "#B5F5D4", "stop-opacity": "0.28" }, coreBeamGrad);
    mk("stop", { offset: "52%", "stop-color": "#2D6A47", "stop-opacity": "0.07" }, coreBeamGrad);
    mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, coreBeamGrad);

    const flagBeamGrad = mk("linearGradient", { id: "agent-beam-flag", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, sDefs);
    mk("stop", { offset: "0%", "stop-color": "#B83B2A", "stop-opacity": "0.0" }, flagBeamGrad);
    mk("stop", { offset: "11%", "stop-color": "#B83B2A", "stop-opacity": "0.17" }, flagBeamGrad);
    mk("stop", { offset: "52%", "stop-color": "#B83B2A", "stop-opacity": "0.06" }, flagBeamGrad);
    mk("stop", { offset: "100%", "stop-color": "#B83B2A", "stop-opacity": "0.0" }, flagBeamGrad);

    const flagCoreGrad = mk("linearGradient", { id: "agent-beam-flag-core", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, sDefs);
    mk("stop", { offset: "0%", "stop-color": "#FFDCD4", "stop-opacity": "0.0" }, flagCoreGrad);
    mk("stop", { offset: "12%", "stop-color": "#FFDCD4", "stop-opacity": "0.34" }, flagCoreGrad);
    mk("stop", { offset: "52%", "stop-color": "#B83B2A", "stop-opacity": "0.065" }, flagCoreGrad);
    mk("stop", { offset: "100%", "stop-color": "#B83B2A", "stop-opacity": "0.0" }, flagCoreGrad);

    const edgeBeamGrad = mk("linearGradient", { id: "agent-edge-grad", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, sDefs);
    mk("stop", { offset: "0%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, edgeBeamGrad);
    mk("stop", { offset: "14%", "stop-color": "#2D6A47", "stop-opacity": "0.24" }, edgeBeamGrad);
    mk("stop", { offset: "82%", "stop-color": "#2D6A47", "stop-opacity": "0.08" }, edgeBeamGrad);
    mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, edgeBeamGrad);

    const edgeFlagGrad = mk("linearGradient", { id: "agent-edge-flag", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, sDefs);
    mk("stop", { offset: "0%", "stop-color": "#B83B2A", "stop-opacity": "0.0" }, edgeFlagGrad);
    mk("stop", { offset: "14%", "stop-color": "#B83B2A", "stop-opacity": "0.24" }, edgeFlagGrad);
    mk("stop", { offset: "82%", "stop-color": "#B83B2A", "stop-opacity": "0.08" }, edgeFlagGrad);
    mk("stop", { offset: "100%", "stop-color": "#B83B2A", "stop-opacity": "0.0" }, edgeFlagGrad);

    trailGrad = mk("linearGradient", { id: "agent-trail-grad", gradientUnits: "userSpaceOnUse", x1: "0", y1: "0", x2: "100", y2: "0" }, sDefs);
    mk("stop", { offset: "0%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, trailGrad);
    mk("stop", { offset: "45%", "stop-color": "#2D6A47", "stop-opacity": "0.14" }, trailGrad);
    mk("stop", { offset: "86%", "stop-color": "#4FA072", "stop-opacity": "0.34" }, trailGrad);
    mk("stop", { offset: "100%", "stop-color": "#B5F5D4", "stop-opacity": "0.52" }, trailGrad);

    // Calligraphic bamboo ink-wash ribbon contrail (wide translucent brush + bright mint core!)
    trailPathMain = mk("path", { fill: "none", stroke: "url(#agent-trail-grad)", "stroke-width": "4.2", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: "0" }, scanOverlay);
    trailPathCore = mk("path", { fill: "none", stroke: "url(#agent-trail-grad)", "stroke-width": "1.25", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: "0" }, scanOverlay);

    for (let i = 0; i < 8; i++) {
      const d = mk("circle", { r: "1.05", fill: i % 2 === 0 ? "#4FA072" : "#B5F5D4", opacity: "0" }, scanOverlay);
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
  // EXACT ORIGINAL ERA 5 EVOLVING ROBOT SVG (Unfolded Flight -> Docked CRT Head!)
  // =====================================================================
  const VIEWBOX_H = 44;
  const svg = mk("svg", { viewBox: "-24 -22 48 44", "shape-rendering": "geometricPrecision" }, btn);
  const defs = mk("defs", null, svg);

  const jetGrad = mk("linearGradient", { id: "agent-jet-grad", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#D4FFE8", "stop-opacity": "0.98" }, jetGrad);
  mk("stop", { offset: "34%", "stop-color": "#3A845B", "stop-opacity": "0.68" }, jetGrad);
  mk("stop", { offset: "78%", "stop-color": "#2D6A47", "stop-opacity": "0.22" }, jetGrad);
  mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, jetGrad);

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
  mk("stop", { offset: "0%", "stop-color": "#C9FFE2", "stop-opacity": "0.78" }, nozzleHaloGrad);
  mk("stop", { offset: "55%", "stop-color": "#2D6A47", "stop-opacity": "0.22" }, nozzleHaloGrad);
  mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, nozzleHaloGrad);

  const coreGlow = mk("radialGradient", { id: "agent-core-glow", cx: "50%", cy: "50%", r: "50%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#4FA072", "stop-opacity": "0.65" }, coreGlow);
  mk("stop", { offset: "60%", "stop-color": "#2D6A47", "stop-opacity": "0.18" }, coreGlow);
  mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, coreGlow);

  const eyeGlow = mk("radialGradient", { id: "agent-eye-glow", cx: "50%", cy: "50%", r: "50%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#B5F5D4", "stop-opacity": "0.40" }, eyeGlow);
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
  // HARDCORE TACTICAL MECH ARMOR (Ver.Ka / Mark-85 Ceramic + Gunmetal Frame)
  // Multi-layered angular wing-binders + chamfered shoulder pauldrons +
  // faceted pectoral chest & skirt armor + knee shields + vernier greaves!
  // =====================================================================
  const bodyRigG = mk("g", { class: "mech-body-rig", opacity: "0" }, craftG);

  // --- Hardcore Twin Aerospace Wing-Binders (swept angular blades + gunmetal sub-flaps + plasma vents!) ---
  const packG = mk("g", null, bodyRigG);
  // Left angular twin-blade wing-binder
  const wingL = mk("g", null, packG);
  // Lower dark-gunmetal stabilizer sub-wing
  mk("path", {
    d: "M -4.2,0.4 L -11.4,1.2 L -9.6,3.4 L -4.2,2.4 Z",
    fill: "url(#agent-gunmetal-grad)", stroke: "#1D1B18", "stroke-width": "0.68", "stroke-linejoin": "round"
  }, wingL);
  // Upper swept chamfered ceramic main wing-binder blade
  mk("path", {
    d: "M -3.8,-1.2 L -11.8,-5.2 L -13.0,-3.4 L -10.8,0.6 L -6.2,1.6 L -3.8,1.2 Z",
    fill: "url(#agent-armor-back)", stroke: "#1D1B18", "stroke-width": "0.78", "stroke-linejoin": "round"
  }, wingL);
  // Recessed dark thruster duct + glowing bamboo plasma edge slit
  mk("polygon", { points: "-5.2,-1.1 -11.2,-4.0 -10.4,-2.2 -5.4,0.1", fill: "#2B2825" }, wingL);
  mk("line", { x1: "-5.8", y1: "-0.8", x2: "-10.5", y2: "-3.1", stroke: "#5CE09B", "stroke-width": "0.72", "stroke-linecap": "round" }, wingL);

  // Right angular twin-blade wing-binder
  const wingR = mk("g", null, packG);
  mk("path", {
    d: "M 4.2,0.4 L 11.4,1.2 L 9.6,3.4 L 4.2,2.4 Z",
    fill: "url(#agent-gunmetal-grad)", stroke: "#1D1B18", "stroke-width": "0.68", "stroke-linejoin": "round"
  }, wingR);
  mk("path", {
    d: "M 3.8,-1.2 L 11.8,-5.2 L 13.0,-3.4 L 10.8,0.6 L 6.2,1.6 L 3.8,1.2 Z",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.78", "stroke-linejoin": "round"
  }, wingR);
  mk("line", { x1: "5.2", y1: "-1.5", x2: "11.5", y2: "-4.6", stroke: "#FFFFFF", "stroke-width": "0.55", "stroke-opacity": "0.85", "stroke-linecap": "round" }, wingR);
  mk("polygon", { points: "5.2,-1.1 11.2,-4.0 10.4,-2.2 5.4,0.1", fill: "#2B2825" }, wingR);
  mk("line", { x1: "5.8", y1: "-0.8", x2: "10.5", y2: "-3.1", stroke: "#5CE09B", "stroke-width": "0.72", "stroke-linecap": "round" }, wingR);

  // --- Heavy Armored 2-Bone Mecha Legs (Faceted Thighs + Angular Knee Shields + Flared Vernier Greaves!) ---
  const legsG = mk("g", null, bodyRigG);

  // Left / Rear heavy armored leg
  const legL = mk("g", null, legsG);
  mk("circle", { cx: "-2.6", cy: "10.6", r: "1.15", fill: "url(#agent-gunmetal-grad)" }, legL);
  // Faceted angular thigh armor plate
  mk("path", {
    d: "M -4.0,10.6 L -1.4,10.6 L -1.6,13.9 L -3.7,14.2 L -4.3,12.2 Z",
    fill: "url(#agent-armor-back)", stroke: "#1D1B18", "stroke-width": "0.76", "stroke-linejoin": "round"
  }, legL);
  mk("line", { x1: "-3.7", y1: "12.2", x2: "-1.8", y2: "12.0", stroke: "#1D1B18", "stroke-width": "0.42", "stroke-opacity": "0.4" }, legL);
  mk("circle", { cx: "-2.65", cy: "14.1", r: "1.1", fill: "url(#agent-gunmetal-grad)" }, legL);
  // Articulated lower greave + angular knee shield + vernier boot pivoted at knee (-2.65, 14.1)
  const shinL = mk("g", null, legL);
  const jetBootLG = mk("g", { opacity: "0" }, shinL);
  mk("ellipse", { cx: "-2.65", cy: "19.3", rx: "2.8", ry: "1.8", fill: "url(#agent-nozzle-halo)" }, jetBootLG);
  const jetBootL = mk("path", { fill: "url(#agent-jet-grad)" }, jetBootLG);
  const jetBootLCore = mk("path", { fill: "#EBFFF3", "fill-opacity": "0.95" }, jetBootLG);
  const machL1 = mk("ellipse", { cx: "-2.65", cy: "21.8", rx: "0.98", ry: "0.35", fill: "#EBFFF3", opacity: "0.86" }, jetBootLG);
  // Flared aerospace shin greave + outer vernier stabilizer fin
  mk("path", {
    d: "M -3.9,14.5 L -1.3,14.5 L -0.9,18.5 L -2.65,19.1 L -4.6,18.4 L -4.4,16.1 Z",
    fill: "url(#agent-armor-back)", stroke: "#1D1B18", "stroke-width": "0.80", "stroke-linejoin": "round"
  }, shinL);
  // Sharp angular knee armor guard jutting over knee joint
  mk("polygon", {
    points: "-3.6,13.4 -1.7,13.4 -1.9,15.3 -2.65,15.8 -3.4,15.3",
    fill: "url(#agent-gunmetal-grad)", stroke: "#1D1B18", "stroke-width": "0.65", "stroke-linejoin": "round"
  }, shinL);
  // Ankle armor seam + bamboo vent pip
  mk("path", { d: "M -4.2,17.2 L -1.2,17.2", fill: "none", stroke: "#1D1B18", "stroke-width": "0.5", "stroke-opacity": "0.45" }, shinL);
  mk("line", { x1: "-4.1", y1: "15.8", x2: "-4.1", y2: "16.7", stroke: "#2D6A47", "stroke-width": "0.65", "stroke-linecap": "round" }, shinL);
  mk("ellipse", { cx: "-2.65", cy: "18.85", rx: "1.40", ry: "0.50", fill: "#1D1B18" }, shinL);
  mk("ellipse", { cx: "-2.65", cy: "18.92", rx: "1.02", ry: "0.36", fill: "#C9FFE2" }, shinL);

  // Right / Front heavy armored leg (sunlit porcelain + crisp metallic specular edges!)
  const legR = mk("g", null, legsG);
  mk("circle", { cx: "2.6", cy: "10.6", r: "1.15", fill: "url(#agent-gunmetal-grad)" }, legR);
  mk("path", {
    d: "M 1.4,10.6 L 4.0,10.6 L 4.3,12.4 L 3.7,14.6 L 1.6,14.4 Z",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.78", "stroke-linejoin": "round"
  }, legR);
  mk("line", { x1: "2.0", y1: "11.1", x2: "2.0", y2: "13.5", stroke: "#FFFFFF", "stroke-width": "0.52", "stroke-opacity": "0.82", "stroke-linecap": "round" }, legR);
  mk("line", { x1: "1.8", y1: "12.4", x2: "3.8", y2: "12.6", stroke: "#1D1B18", "stroke-width": "0.42", "stroke-opacity": "0.38" }, legR);
  mk("circle", { cx: "2.65", cy: "14.6", r: "1.12", fill: "url(#agent-gunmetal-grad)" }, legR);
  // Articulated lower greave + angular knee shield + vernier boot pivoted at knee (2.65, 14.6)
  const shinR = mk("g", null, legR);
  const jetBootRG = mk("g", { opacity: "0" }, shinR);
  mk("ellipse", { cx: "2.65", cy: "20.4", rx: "3.0", ry: "1.9", fill: "url(#agent-nozzle-halo)" }, jetBootRG);
  const jetBootR = mk("path", { fill: "url(#agent-jet-grad)" }, jetBootRG);
  const jetBootRCore = mk("path", { fill: "#EBFFF3", "fill-opacity": "0.95" }, jetBootRG);
  const machR1 = mk("ellipse", { cx: "2.65", cy: "23.1", rx: "1.04", ry: "0.37", fill: "#EBFFF3", opacity: "0.88" }, jetBootRG);
  mk("path", {
    d: "M 1.3,15.0 L 3.9,15.0 L 4.5,16.8 L 4.65,19.6 L 2.65,20.3 L 0.85,19.6 Z",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.82", "stroke-linejoin": "round"
  }, shinR);
  mk("line", { x1: "1.6", y1: "16.0", x2: "1.35", y2: "18.8", stroke: "#FFFFFF", "stroke-width": "0.55", "stroke-opacity": "0.78", "stroke-linecap": "round" }, shinR);
  // Sharp angular knee armor shield (dark titanium centerpiece + white specular ridge)
  mk("polygon", {
    points: "1.7,13.8 3.6,13.8 3.4,15.8 2.65,16.3 1.9,15.8",
    fill: "url(#agent-gunmetal-grad)", stroke: "#1D1B18", "stroke-width": "0.68", "stroke-linejoin": "round"
  }, shinR);
  mk("line", { x1: "2.2", y1: "14.4", x2: "3.1", y2: "14.4", stroke: "#5CE09B", "stroke-width": "0.55", "stroke-linecap": "round" }, shinR);
  mk("path", { d: "M 1.2,17.8 L 4.2,17.8", fill: "none", stroke: "#1D1B18", "stroke-width": "0.5", "stroke-opacity": "0.42" }, shinR);
  mk("line", { x1: "4.1", y1: "16.4", x2: "4.1", y2: "17.3", stroke: "#2D6A47", "stroke-width": "0.65", "stroke-linecap": "round" }, shinR);
  mk("ellipse", { cx: "2.65", cy: "20.0", rx: "1.46", ry: "0.53", fill: "#1D1B18" }, shinR);
  mk("ellipse", { cx: "2.65", cy: "20.08", rx: "1.06", ry: "0.39", fill: "#C9FFE2" }, shinR);

  // --- Hardcore Layered Shoulder Pauldrons + Heavy Armored Repulsor Vambraces ---
  const armL = mk("g", null, bodyRigG);
  const jetPalmLG = mk("g", { opacity: "0" }, armL);
  mk("circle", { cx: "-9.9", cy: "9.4", r: "2.3", fill: "url(#agent-nozzle-halo)" }, jetPalmLG);
  const jetPalmL = mk("path", { fill: "url(#agent-jet-grad)" }, jetPalmLG);
  const jetPalmLCore = mk("path", { fill: "#EBFFF3", "fill-opacity": "0.95" }, jetPalmLG);
  // Heavy dark-gunmetal upper arm actuator & elbow block
  mk("line", { x1: "-5.8", y1: "0.5", x2: "-8.1", y2: "4.3", stroke: "#2B2825", "stroke-width": "2.0", "stroke-linecap": "round" }, armL);
  mk("rect", { x: "-9.1", y: "3.3", width: "2.1", height: "2.0", rx: "0.5", fill: "url(#agent-gunmetal-grad)", stroke: "#1D1B18", "stroke-width": "0.5" }, armL);
  // Layered angular Gundam-style Shoulder Pauldron (raised outer flange + gunmetal under-plate + bamboo stripe)
  mk("path", {
    d: "M -4.7,-1.5 L -7.6,-2.1 L -8.6,0.5 L -7.5,2.4 L -5.0,1.9 Z",
    fill: "url(#agent-armor-back)", stroke: "#1D1B18", "stroke-width": "0.80", "stroke-linejoin": "round"
  }, armL);
  mk("polygon", { points: "-7.6,-1.6 -8.3,0.4 -7.3,2.0 -6.6,1.6 -7.2,0.1", fill: "#2B2825" }, armL);
  mk("line", { x1: "-5.4", y1: "-0.7", x2: "-7.3", y2: "-1.1", stroke: "#2D6A47", "stroke-width": "0.62", "stroke-linecap": "round" }, armL);
  // Heavy angular armored forearm vambrace gauntlet
  mk("path", {
    d: "M -7.1,3.7 L -9.3,4.6 L -11.3,8.5 L -9.8,9.6 L -8.1,8.7 L -6.6,5.2 Z",
    fill: "url(#agent-armor-back)", stroke: "#1D1B18", "stroke-width": "0.80", "stroke-linejoin": "round"
  }, armL);
  mk("line", { x1: "-8.2", y1: "5.8", x2: "-10.1", y2: "6.6", stroke: "#2D6A47", "stroke-width": "0.68", "stroke-linecap": "round" }, armL);
  mk("line", { x1: "-8.8", y1: "7.1", x2: "-10.4", y2: "7.8", stroke: "#1D1B18", "stroke-width": "0.45", "stroke-opacity": "0.45" }, armL);
  mk("circle", { cx: "-9.8", cy: "9.2", r: "1.18", fill: "#1D1B18" }, armL);
  mk("circle", { cx: "-9.8", cy: "9.2", r: "0.78", fill: "#C9FFE2" }, armL);
  mk("circle", { cx: "-9.8", cy: "9.2", r: "0.35", fill: "#FFFFFF" }, armL);

  const armR = mk("g", null, bodyRigG);
  const jetPalmRG = mk("g", { opacity: "0" }, armR);
  mk("circle", { cx: "9.9", cy: "9.4", r: "2.3", fill: "url(#agent-nozzle-halo)" }, jetPalmRG);
  const jetPalmR = mk("path", { fill: "url(#agent-jet-grad)" }, jetPalmRG);
  const jetPalmRCore = mk("path", { fill: "#EBFFF3", "fill-opacity": "0.95" }, jetPalmRG);
  mk("line", { x1: "5.8", y1: "0.5", x2: "8.1", y2: "4.3", stroke: "#2B2825", "stroke-width": "2.0", "stroke-linecap": "round" }, armR);
  mk("rect", { x: "7.0", y: "3.3", width: "2.1", height: "2.0", rx: "0.5", fill: "url(#agent-gunmetal-grad)", stroke: "#1D1B18", "stroke-width": "0.5" }, armR);
  // Layered angular Gundam-style Shoulder Pauldron (right)
  mk("path", {
    d: "M 4.7,-1.5 L 7.6,-2.1 L 8.6,0.5 L 7.5,2.4 L 5.0,1.9 Z",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.82", "stroke-linejoin": "round"
  }, armR);
  mk("polygon", { points: "7.6,-1.6 8.3,0.4 7.3,2.0 6.6,1.6 7.2,0.1", fill: "#2B2825" }, armR);
  mk("line", { x1: "5.4", y1: "-0.7", x2: "7.3", y2: "-1.1", stroke: "#2D6A47", "stroke-width": "0.62", "stroke-linecap": "round" }, armR);
  // Heavy angular armored forearm vambrace gauntlet (right)
  mk("path", {
    d: "M 7.1,3.7 L 9.3,4.6 L 11.3,8.5 L 9.8,9.6 L 8.1,8.7 L 6.6,5.2 Z",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.82", "stroke-linejoin": "round"
  }, armR);
  mk("line", { x1: "8.2", y1: "5.8", x2: "10.1", y2: "6.6", stroke: "#2D6A47", "stroke-width": "0.68", "stroke-linecap": "round" }, armR);
  mk("line", { x1: "8.8", y1: "7.1", x2: "10.4", y2: "7.8", stroke: "#1D1B18", "stroke-width": "0.45", "stroke-opacity": "0.45" }, armR);
  mk("circle", { cx: "9.8", cy: "9.2", r: "1.18", fill: "#1D1B18" }, armR);
  mk("circle", { cx: "9.8", cy: "9.2", r: "0.78", fill: "#C9FFE2" }, armR);
  mk("circle", { cx: "9.8", cy: "9.2", r: "0.35", fill: "#FFFFFF" }, armR);

  // --- Hardcore Faceted Pectoral Chest Armor + High Collar + Segmented Abs + Armored Skirt Pelvis ---
  const torsoG = mk("g", null, bodyRigG);
  // Armored high mechanical collar + dark hydraulic neck piston (zero gap under chin!)
  mk("path", {
    d: "M -2.3,-4.4 L 2.3,-4.4 L 2.9,-1.2 L -2.9,-1.2 Z",
    fill: "url(#agent-gunmetal-grad)", stroke: "#1D1B18", "stroke-width": "0.6", "stroke-linejoin": "round"
  }, torsoG);
  mk("path", {
    d: "M -4.0,-1.5 L -3.2,-2.9 L -1.8,-2.5 L -1.8,-1.5 M 4.0,-1.5 L 3.2,-2.9 L 1.8,-2.5 L 1.8,-1.5",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.68", "stroke-linejoin": "round"
  }, torsoG);
  // Segmented gunmetal armored abdominal core with twin titanium rib plates
  mk("rect", { x: "-3.1", y: "6.3", width: "6.2", height: "3.2", rx: "0.7", fill: "url(#agent-gunmetal-grad)" }, torsoG);
  mk("path", {
    d: "M -2.4,7.3 L 2.4,7.3 M -2.2,8.4 L 2.2,8.4",
    fill: "none", stroke: "#FAF8F4", "stroke-width": "0.52", "stroke-opacity": "0.38", "stroke-linecap": "round"
  }, torsoG);
  // Hardcore Angular Mech Skirt Armor (Front codpiece + left/right hip tassets!)
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
  mk("line", { x1: "0", y1: "9.0", x2: "0", y2: "11.0", stroke: "#5CE09B", "stroke-width": "0.55", "stroke-linecap": "round" }, torsoG);

  // Multi-Faceted Angular Pectoral Chest Shell (broad heroic V-cut Gundam/Mark-85 armor!)
  mk("path", {
    d: "M -4.8,-1.7 L 4.8,-1.7 L 5.8,0.4 L 4.6,5.8 L 3.0,7.2 L -3.0,7.2 L -4.6,5.8 L -5.8,0.4 Z",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.86", "stroke-linejoin": "round"
  }, torsoG);
  // Crisp top specular bevel highlight
  mk("line", { x1: "-3.8", y1: "-0.95", x2: "3.2", y2: "-0.95", stroke: "#FFFFFF", "stroke-width": "0.70", "stroke-opacity": "0.88", "stroke-linecap": "round" }, torsoG);

  // 2.5D Tactical Chest Detail Group (Faceted intake vents + hexagonal armor bezel + Bamboo Arc Reactor!)
  const chestDetailG = mk("g", null, torsoG);
  // Left & right angular pectoral intake vents (dark titanium louvers)
  mk("polygon", { points: "-4.6,0.4 -2.5,0.8 -2.5,2.2 -4.3,1.8", fill: "#2B2825" }, chestDetailG);
  mk("polygon", { points: "4.6,0.4 2.5,0.8 2.5,2.2 4.3,1.8", fill: "#2B2825" }, chestDetailG);
  // Sharp chamfered X-armor panel seams
  mk("path", {
    d: "M -4.4,-0.8 L -1.8,1.2 M 4.4,-0.8 L 1.8,1.2 M -3.6,5.9 L -1.6,4.2 M 3.6,5.9 L 1.6,4.2",
    fill: "none", stroke: "#1D1B18", "stroke-width": "0.54", "stroke-opacity": "0.42", "stroke-linecap": "round"
  }, chestDetailG);
  // Hexagonal Armored Arc Reactor Core
  mk("circle", { cx: "0", cy: "2.8", r: "4.8", fill: "url(#agent-core-glow)" }, chestDetailG);
  mk("polygon", {
    points: "0,0.45 2.15,1.6 2.15,4.0 0,5.15 -2.15,4.0 -2.15,1.6",
    fill: "url(#agent-gunmetal-grad)", stroke: "#1D1B18", "stroke-width": "0.65", "stroke-linejoin": "round"
  }, chestDetailG);
  const chestCore = mk("polygon", {
    points: "0,1.25 1.38,2.0 1.38,3.6 0,4.35 -1.38,3.6 -1.38,2.0",
    fill: "#2D6A47"
  }, chestDetailG);
  mk("circle", { cx: "-0.38", cy: "2.35", r: "0.44", fill: "#EBFFF3", "fill-opacity": "0.94" }, chestDetailG);

  // =====================================================================
  // ORIGINAL ROBOT CRT HEAD (Independently Articulated + Spring Antenna + 2.5D Yaw!)
  // Clean, iconic, balanced — same robot from Era 2-5 runway to sky to top-left dock!
  // =====================================================================
  const DOCKED_HEAD_SCALE = 1.26;
  const FLIGHT_HEAD_SCALE = 0.88;
  const FLIGHT_HEAD_Y = -8.4;
  const LAUNCH_MATCH_SCALE = 1.32; // 1:1 height match with enlarged 1.24x Era 5 runway robot at liftoff!
  const FLY_SCALE = 1.46;

  const headG = mk("g", { transform: `translate(0, ${FLIGHT_HEAD_Y}) scale(${FLIGHT_HEAD_SCALE})` }, craftG);

  // Damped-Spring Upright Antenna (sways physically with flight banking & cursor movement!)
  const antG = mk("g", null, headG);
  mk("rect", { x: "-1.5", y: "-7.2", width: "3.0", height: "1.4", rx: "0.5", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.8" }, antG);
  mk("line", { x1: "0", y1: "-7.2", x2: "0", y2: "-10.5", stroke: "#1D1B18", "stroke-width": "1.1", "stroke-linecap": "round" }, antG);
  const statusTip = mk("circle", {
    class: "mech-status-slit",
    cx: "0", cy: "-11.4", r: "1.45",
    fill: "#2D6A47", stroke: "#1D1B18", "stroke-width": "0.85"
  }, antG);

  // Hardcore Swept Mech V-Fin Crest on brow (sharp twin blades + emerald central sensor gem!)
  const crestEl = mk("g", null, headG);
  mk("path", {
    d: "M -6.4,-7.4 L -1.4,-5.4 L 0,-7.8 L 1.4,-5.4 L 6.4,-7.4 L 1.6,-4.2 L -1.6,-4.2 Z",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "0.82", "stroke-linejoin": "round"
  }, crestEl);
  mk("polygon", { points: "0,-7.1 0.85,-5.5 0,-4.4 -0.85,-5.5", fill: "#2D6A47" }, crestEl);

  // Compact warm-stone side ear-bolt pods (subtle 2.5D yaw parallax!)
  const earL = mk("rect", { x: "-9.1", y: "-2.1", width: "1.9", height: "4.2", rx: "0.75", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.9" }, headG);
  const earR = mk("rect", { x: "7.2", y: "-2.1", width: "1.9", height: "4.2", rx: "0.75", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.9" }, headG);

  // Iconic Rounded-Rectangle CRT Chassis Head (matte porcelain gradient matching body!)
  mk("rect", {
    x: "-7.3", y: "-5.8", width: "14.6", height: "11.6", rx: "3.3",
    fill: "url(#agent-armor-grad)", stroke: "#1D1B18", "stroke-width": "1.02"
  }, headG);
  // Crisp top paper highlight sheen
  mk("line", {
    x1: "-4.4", y1: "-4.85", x2: "3.8", y2: "-4.85",
    stroke: "#FFFFFF", "stroke-width": "0.75", "stroke-opacity": "0.90", "stroke-linecap": "round"
  }, headG);

  // 2.5D Faceplate Group (shifts smoothly with yaw/pitch so the CRT head truly turns in space!)
  const facePlateG = mk("g", null, headG);

  // Deep Obsidian Panoramic Dual-Optic Visor with glass gradient & diagonal specular sheen!
  mk("rect", {
    x: "-5.6", y: "-3.4", width: "11.2", height: "6.6", rx: "2.1",
    fill: "url(#agent-visor-grad)"
  }, facePlateG);

  const visorAura = mk("ellipse", { cx: "0", cy: "-0.1", rx: "4.8", ry: "2.4", fill: "url(#agent-eye-glow)", opacity: "0.52" }, facePlateG);
  const visorGlint = mk("path", {
    d: "M -4.5,-2.15 Q -3.1,-2.35 -1.6,-2.15 M -4.2,-1.1 L -3.5,-1.1",
    fill: "none", stroke: "#FAF8F4", "stroke-width": "0.62", "stroke-opacity": "0.34", "stroke-linecap": "round"
  }, facePlateG);

  // Expressive Luminous OLED Eyes (crisp round-pill hybrid matching Era 4-5 dual optics!)
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
    coneG, conePoly, coneCorePoly, coneEdgeL, coneEdgeR, wakeDots, trailGrad, trailPathMain, trailPathCore, sonarG, sonarOuterHalo, sonarRingMain, sonarRingEcho, VIEWBOX_H, svg, dockRing, foldSparks, dockShadow, craftG, bodyRigG, packG, wingL, wingR, legL, shinL, jetBootLG, jetBootL, jetBootLCore, machL1, legR, shinR, jetBootRG, jetBootR, jetBootRCore, machR1, armL, jetPalmLG, jetPalmL, jetPalmLCore, armR, jetPalmRG, jetPalmR, jetPalmRCore, chestDetailG, chestCore, DOCKED_HEAD_SCALE, FLIGHT_HEAD_SCALE, FLIGHT_HEAD_Y, LAUNCH_MATCH_SCALE, FLY_SCALE, headG, antG, statusTip, crestEl, earL, earR, facePlateG, visorAura, visorGlint, eyesTrackG, eyeL, eyeR
  };
}
