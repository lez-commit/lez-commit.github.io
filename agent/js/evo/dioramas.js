import { mk } from "../core/utils.js";

/**
 * Builds the runway SVG canvas, editorial gradients/clips, all 5 solid-ink 2.5D
 * architectural dioramas (Era 1..5), ambient launch FX, and the Era 1 engineer.
 */
export function buildDioramas({ evoLayerEl, BASE_Y }) {
  const svg = mk("svg", { class: "evo-svg", "shape-rendering": "geometricPrecision" }, evoLayerEl);
  const defs = mk("defs", null, svg);

  // Soft translucent glass dome gradient (Era 2 Brain-in-a-Vat)
  const vatGlassGrad = mk("linearGradient", { id: "evo-vat-glass", x1: "0%", y1: "0%", x2: "100%", y2: "100%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#FAF8F4", "stop-opacity": "0.72" }, vatGlassGrad);
  mk("stop", { offset: "55%", "stop-color": "#E6EFE8", "stop-opacity": "0.34" }, vatGlassGrad);
  mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.14" }, vatGlassGrad);

  // Crisp dual-optic terminal scan cone gradient (Era 4 Computer Use Vision)
  const scanBeamGrad = mk("linearGradient", { id: "evo-scan-beam", x1: "0%", y1: "0%", x2: "100%", y2: "0%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#2D6A47", "stop-opacity": "0.48" }, scanBeamGrad);
  mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.18" }, scanBeamGrad);

  // Soft holographic alignment field gradient (Era 5)
  const padGrad = mk("linearGradient", { id: "evo-pad-grad", x1: "0%", y1: "100%", x2: "0%", y2: "0%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#2D6A47", "stop-opacity": "0.24" }, padGrad);
  mk("stop", { offset: "58%", "stop-color": "#2D6A47", "stop-opacity": "0.08" }, padGrad);
  mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, padGrad);

  // Bamboo Arc Core radial glow (Stage 5)
  const arcGlowGrad = mk("radialGradient", { id: "evo-arc-glow", cx: "50%", cy: "50%", r: "50%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#4FA072", "stop-opacity": "0.65" }, arcGlowGrad);
  mk("stop", { offset: "55%", "stop-color": "#2D6A47", "stop-opacity": "0.22" }, arcGlowGrad);
  mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, arcGlowGrad);

  // Luminous bamboo-mint repulsor plasma plume gradient (Stage 5 Iron Man launch)
  const jetGrad = mk("linearGradient", { id: "evo-jet-grad", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#B5F5D4", "stop-opacity": "0.95" }, jetGrad);
  mk("stop", { offset: "38%", "stop-color": "#2D6A47", "stop-opacity": "0.62" }, jetGrad);
  mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, jetGrad);

  // Unified matte porcelain ceramic gradients (matching airborne v4 mech material language 1:1!)
  const porcGrad = mk("linearGradient", { id: "evo-porcelain", x1: "12%", y1: "0%", x2: "88%", y2: "100%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#FFFDF9" }, porcGrad);
  mk("stop", { offset: "58%", "stop-color": "#F7F3EB" }, porcGrad);
  mk("stop", { offset: "100%", "stop-color": "#E3DACB" }, porcGrad);

  const porcBackGrad = mk("linearGradient", { id: "evo-porcelain-back", x1: "0%", y1: "0%", x2: "100%", y2: "100%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#EFEAE0" }, porcBackGrad);
  mk("stop", { offset: "100%", "stop-color": "#DCD3C4" }, porcBackGrad);

  // Antique warm brass gradient for Mark I's sculpted butterfly clockwork wind-up key!
  const brassGrad = mk("linearGradient", { id: "evo-brass", x1: "0%", y1: "0%", x2: "100%", y2: "100%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#FDF2CE" }, brassGrad);
  mk("stop", { offset: "52%", "stop-color": "#E8BF5B" }, brassGrad);
  mk("stop", { offset: "100%", "stop-color": "#C49133" }, brassGrad);

  // Ambient bamboo ground bounce light along timeline spine for Era 2/4/5 climax beats
  const groundGlowGrad = mk("radialGradient", { id: "evo-ground-glow", cx: "50%", cy: "50%", r: "50%" }, defs);
  mk("stop", { offset: "0%", "stop-color": "#4FA072", "stop-opacity": "0.42" }, groundGlowGrad);
  mk("stop", { offset: "55%", "stop-color": "#2D6A47", "stop-opacity": "0.14" }, groundGlowGrad);
  mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, groundGlowGrad);

  // Clip path for Era 3 brick barrier sinking cleanly into the ground seam (y <= 0)
  const wallClip = mk("clipPath", { id: "evo-wall-clip" }, defs);
  mk("rect", { x: "-24", y: "-38", width: "48", height: "38" }, wallClip);

  // =====================================================================
  // LAYER 1: 5 EDITORIAL INK-AND-WASH MILESTONE PROPS (behind robot)
  // =====================================================================
  const scenery = mk("g", null, svg);
  // Subtle ambient bamboo ground bounce light seated flush on timeline spine
  const groundBounceEl = mk("ellipse", { cx: "0", cy: String(BASE_Y), rx: "28", ry: "4.6", fill: "url(#evo-ground-glow)", opacity: "0" }, scenery);

  // --- PROP 1 (Era 1 · 按脚本跑，无大脑): Clean Iconic Faceted Stone Cluster ---
  const prop1 = mk("g", { class: "evo-prop-hit", color: "#1D1B18", opacity: "1" }, scenery);
  mk("rect", { x: "-14", y: "-14", width: "28", height: "16", fill: "transparent" }, prop1);
  mk("ellipse", { cx: "0.4", cy: "0.35", rx: "9.8", ry: "1.15", fill: "#1D1B18", "fill-opacity": "0.11" }, prop1);
  // Companion micro-pebble on left
  mk("polygon", {
    points: "-7.6,0 -6.6,-3.0 -4.3,-2.8 -3.5,0",
    fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.95", "stroke-linejoin": "round"
  }, prop1);
  // Main faceted stone
  mk("polygon", {
    points: "-4.8,0 -3.6,-5.4 -0.4,-7.3 3.8,-5.0 5.6,0",
    fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.15", "stroke-linejoin": "round"
  }, prop1);
  // Warm stone-wash shaded right 2.5D facet
  mk("polygon", {
    points: "-0.4,-7.3 3.8,-5.0 5.6,0 0.8,0 0.3,-3.6",
    fill: "#E4DDD0", "fill-opacity": "0.95"
  }, prop1);
  // Crisp top-left paper highlight hairline + facet ridge & tiny ink-hatching marks
  mk("line", { x1: "-3.1", y1: "-4.9", x2: "-0.6", y2: "-6.4", stroke: "#FAF8F4", "stroke-width": "0.9", "stroke-linecap": "round" }, prop1);
  mk("path", {
    d: "M -0.4,-7.3 L 0.3,-3.6 L 0.8,0 M -2.8,-2.8 L -1.4,-2.8 M 2.0,-2.0 L 3.3,-2.0",
    fill: "none", stroke: "currentColor", "stroke-width": "0.8", "stroke-linecap": "round"
  }, prop1);
  // Tiny chip pebble on far right
  mk("polygon", {
    points: "5.8,0 6.5,-1.8 7.8,-1.5 8.2,0",
    fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.85", "stroke-linejoin": "round"
  }, prop1);
  // Tiny vintage hardcoded "IF ->" wooden signpost right behind the stone (blind script humor!)
  const ifSign = mk("g", { transform: "translate(10.6, 0) rotate(5)" }, prop1);
  mk("line", { x1: "0", y1: "0", x2: "0", y2: "-10.8", stroke: "currentColor", "stroke-width": "1.05", "stroke-linecap": "round" }, ifSign);
  mk("path", {
    d: "M -4.2,-10.2 L 3.4,-10.2 L 5.2,-8.0 L 3.4,-5.8 L -4.2,-5.8 Z",
    fill: "url(#evo-porcelain)", stroke: "currentColor", "stroke-width": "0.88", "stroke-linejoin": "round"
  }, ifSign);
  // Crisp micro "IF →" vector glyph inside signpost
  mk("path", {
    d: "M -2.7,-9.0 L -2.7,-7.0 M -1.3,-9.0 L -1.3,-7.0 M -1.3,-9.0 L -0.1,-9.0 M -1.3,-8.0 L -0.3,-8.0 M 1.0,-8.0 L 3.1,-8.0 M 2.4,-8.7 L 3.2,-8.0 L 2.4,-7.3",
    fill: "none", stroke: "#B83B2A", "stroke-width": "0.68", "stroke-linecap": "round", "stroke-linejoin": "round"
  }, ifSign);
  // Trip kick dust puffs (Era 1)
  const pebbleDust = mk("g", { opacity: "0" }, prop1);
  mk("circle", { cx: "7.0", cy: "-2.4", r: "1.2", fill: "#E4DDD0", stroke: "#1D1B18", "stroke-width": "0.75" }, pebbleDust);
  mk("circle", { cx: "10.0", cy: "-4.4", r: "0.9", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.7" }, pebbleDust);
  mk("line", { x1: "5.6", y1: "-5.2", x2: "8.4", y2: "-7.2", stroke: "#1D1B18", "stroke-width": "0.85", "stroke-linecap": "round" }, pebbleDust);

  // --- PROP 2 (Era 2 · 缸中之脑，会推理): 2.5D Neural Lab Pod + Overhead Mechanical Crane Arm + Live EKG ---
  const prop2 = mk("g", { class: "evo-prop-hit", color: "#1D1B18", opacity: "1" }, scenery);
  mk("rect", { x: "-16", y: "-38", width: "36", height: "40", fill: "transparent" }, prop2);
  mk("ellipse", { cx: "0", cy: "0.4", rx: "13.2", ry: "1.2", fill: "#1D1B18", "fill-opacity": "0.11" }, prop2);
  // Overhead L-Shaped Lab Mechanical Suspension Crane Arm (physically lifts the glass bell-jar!)
  mk("path", {
    d: "M 12.2,0 L 12.2,-33.8 Q 12.2,-35.6 10.4,-35.6 L 0,-35.6",
    fill: "none", stroke: "#2B2825", "stroke-width": "1.55", "stroke-linecap": "round", "stroke-linejoin": "round"
  }, prop2);
  mk("path", { d: "M 10.4,0 L 14.0,0 L 13.4,-2.4 L 11.0,-2.4 Z", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.78", "stroke-linejoin": "round" }, prop2);
  mk("circle", { cx: "12.2", cy: "-35.4", r: "1.15", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.72" }, prop2);
  const vatCranePiston = mk("line", { x1: "0", y1: "-35.6", x2: "0", y2: "-30.4", stroke: "#2B2825", "stroke-width": "1.15", "stroke-linecap": "round" }, prop2);
  // Stepped 2.5D scientific neural pod pedestal + side curved dark-gunmetal power/nutrient conduit!
  mk("path", { d: "M 8.6,-5.4 C 10.8,-5.4 11.6,-4.2 12.0,-2.4", fill: "none", stroke: "#2B2825", "stroke-width": "1.1", "stroke-linecap": "round" }, prop2);
  mk("path", {
    d: "M -11.4,0 L -10.2,-2.4 L 10.2,-2.4 L 11.4,0 Z",
    fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "1.05", "stroke-linejoin": "round"
  }, prop2);
  mk("rect", {
    x: "-8.8", y: "-8.4", width: "17.6", height: "6.0", rx: "0.9",
    fill: "url(#evo-porcelain)", stroke: "currentColor", "stroke-width": "1.05"
  }, prop2);
  // Right-side 2.5D depth shade on pedestal body
  mk("rect", { x: "5.2", y: "-8.0", width: "3.2", height: "5.2", rx: "0.4", fill: "#E4DDD0", "fill-opacity": "0.85" }, prop2);
  // Pedestal dark-obsidian neural pulse oscilloscope (LIVE animated green EKG waveform!) + twin micro-conduits
  mk("rect", { x: "-7.0", y: "-7.1", width: "6.2", height: "3.4", rx: "0.55", fill: "#181715", stroke: "currentColor", "stroke-width": "0.65" }, prop2);
  const vatEkgWave = mk("path", { d: "M -6.3,-5.4 L -5.0,-5.4 L -4.4,-6.5 L -3.6,-4.4 L -2.9,-5.4 L -1.5,-5.4", fill: "none", stroke: "#5CE09B", "stroke-width": "0.75", "stroke-linecap": "round", "stroke-linejoin": "round" }, prop2);
  mk("path", { d: "M 0.4,-6.2 L 5.8,-6.2 M 0.4,-4.6 L 4.4,-4.6", fill: "none", stroke: "currentColor", "stroke-width": "0.75", "stroke-linecap": "round" }, prop2);
  // Vat rim collar & bamboo neural emitter strip
  mk("rect", { x: "-9.6", y: "-10.0", width: "19.2", height: "1.8", rx: "0.7", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.95" }, prop2);
  const vatGlow = mk("ellipse", { cx: "0", cy: "-15.5", rx: "6.8", ry: "5.2", fill: "url(#evo-arc-glow)", opacity: "0.35" }, prop2);
  // Bamboo-tinted swaying nutrient liquid + rising micro-bubbles inside the glass jar!
  const vatLiquidGroup = mk("g", { opacity: "0.95" }, prop2);
  const vatLiquidFill = mk("path", { d: "M -7.6,-10.3 L -7.6,-16.8 Q 0,-17.5 7.6,-16.8 L 7.6,-10.3 Z", fill: "#2D6A47", "fill-opacity": "0.10" }, vatLiquidGroup);
  const vatMeniscus = mk("path", { d: "M -7.4,-16.8 Q 0,-17.5 7.4,-16.8", fill: "none", stroke: "#2D6A47", "stroke-width": "0.7", "stroke-opacity": "0.42", "stroke-linecap": "round" }, vatLiquidGroup);
  const vatBubbles = [
    mk("circle", { cx: "-4.6", cy: "-12.2", r: "0.7", fill: "#FAF8F4", stroke: "#2D6A47", "stroke-width": "0.55", opacity: "0.75" }, vatLiquidGroup),
    mk("circle", { cx: "4.8", cy: "-14.8", r: "0.6", fill: "#FAF8F4", stroke: "#2D6A47", "stroke-width": "0.5", opacity: "0.70" }, vatLiquidGroup),
    mk("circle", { cx: "1.2", cy: "-12.8", r: "0.5", fill: "#FAF8F4", stroke: "#2D6A47", "stroke-width": "0.48", opacity: "0.65" }, vatLiquidGroup)
  ];
  const vatEmitter = mk("line", { x1: "-5.0", y1: "-10.0", x2: "5.0", y2: "-10.0", stroke: "#2D6A47", "stroke-width": "1.6", "stroke-linecap": "round", opacity: "0.65" }, prop2);
  // Floating CRT Brain Head inside the Glass Vat + 5 trailing bamboo neural light particles during transfer!
  const brainTrailDots = [];
  for (let i = 0; i < 5; i++) {
    brainTrailDots.push(mk("circle", { cx: "0", cy: "-20", r: (1.05 - i * 0.14).toFixed(2), fill: i % 2 === 0 ? "#5CE09B" : "#2D6A47", opacity: "0" }, prop2));
  }
  const vatBrainGroup = mk("g", { transform: "translate(0, -16.8)" }, prop2);
  mk("line", { x1: "-0.7", y1: "-4.4", x2: "-1.2", y2: "-7.6", stroke: "currentColor", "stroke-width": "1.05", "stroke-linecap": "round" }, vatBrainGroup);
  const vatAntTip = mk("circle", { cx: "-1.3", cy: "-8.3", r: "1.15", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "0.95" }, vatBrainGroup);
  mk("rect", { x: "-6.2", y: "-1.4", width: "1.4", height: "3.0", rx: "0.55", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.85" }, vatBrainGroup);
  mk("rect", { x: "4.8", y: "-1.4", width: "1.3", height: "2.8", rx: "0.5", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.85" }, vatBrainGroup);
  mk("rect", { x: "-5.2", y: "-4.3", width: "10.4", height: "8.2", rx: "2.4", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.2" }, vatBrainGroup);
  mk("rect", { x: "-1.6", y: "-2.5", width: "5.8", height: "4.3", rx: "1.3", fill: "#1D1B18" }, vatBrainGroup);
  const vatEyeSleep = mk("line", { x1: "0.4", y1: "-0.3", x2: "2.8", y2: "-0.3", stroke: "#B5F5D4", "stroke-width": "1.05", "stroke-linecap": "round", opacity: "0.85" }, vatBrainGroup);
  const vatEyeAwake = mk("circle", { cx: "1.8", cy: "-0.3", r: "1.1", fill: "#FAF8F4", opacity: "0" }, vatBrainGroup);
  // Scientific Bell-Jar Glass Dome (lifts smoothly when awakening)
  const vatDomeGroup = mk("g", null, prop2);
  mk("path", {
    d: "M -8.4,-10.0 L -8.4,-19.8 A 8.4,8.4 0 0,1 8.4,-19.8 L 8.4,-10.0 Z",
    fill: "url(#evo-vat-glass)", stroke: "currentColor", "stroke-width": "1.05", "stroke-linejoin": "round"
  }, vatDomeGroup);
  // Dual curved blown-glass reflection sheens + graduated lab volume ticks + top finial knob
  mk("path", {
    d: "M -5.8,-21.4 A 6.2,6.2 0 0,1 -1.8,-25.6 M 6.4,-18.8 L 6.4,-12.2",
    fill: "none", stroke: "#FAF8F4", "stroke-width": "1.15", "stroke-linecap": "round", "stroke-opacity": "0.82"
  }, vatDomeGroup);
  mk("path", {
    d: "M -7.7,-12.6 L -6.4,-12.6 M -7.7,-15.2 L -6.0,-15.2 M -7.7,-17.8 L -6.4,-17.8",
    fill: "none", stroke: "currentColor", "stroke-width": "0.58", "stroke-opacity": "0.55", "stroke-linecap": "round"
  }, vatDomeGroup);
  mk("circle", { cx: "0", cy: "-29.4", r: "1.2", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.9" }, vatDomeGroup);
  // Neck-dock bamboo flash burst when brain locks onto robot
  const brainDockSpark = mk("g", { opacity: "0" }, prop2);
  mk("path", {
    d: "M -26.5,-20 L -29.5,-22 M -26.5,-15 L -29.5,-14 M -16.5,-20 L -13.5,-22 M -16.5,-15 L -13.5,-14",
    fill: "none", stroke: "#2D6A47", "stroke-width": "1.2", "stroke-linecap": "round"
  }, brainDockSpark);
  // Sequential 3-step Chain-of-Thought node chain (○ -> ○ -> ●) cleanly clear of both antenna & Era 2 twig text
  const cotChainGroup = mk("g", { opacity: "0" }, prop2);
  const cotLink1 = mk("line", { x1: "-12.9", y1: "-36.2", x2: "-7.6", y2: "-36.2", stroke: "#2D6A47", "stroke-width": "1.05", opacity: "0" }, cotChainGroup);
  const cotLink2 = mk("line", { x1: "-4.4", y1: "-36.2", x2: "0.9", y2: "-36.2", stroke: "#2D6A47", "stroke-width": "1.05", opacity: "0" }, cotChainGroup);
  const cotNode1 = mk("circle", { cx: "-14.5", cy: "-36.2", r: "1.6", fill: "#FAF8F4", stroke: "#2D6A47", "stroke-width": "1.1", opacity: "0" }, cotChainGroup);
  const cotNode2 = mk("circle", { cx: "-6.0", cy: "-36.2", r: "1.6", fill: "#FAF8F4", stroke: "#2D6A47", "stroke-width": "1.1", opacity: "0" }, cotChainGroup);
  const cotNode3 = mk("circle", { cx: "2.5", cy: "-36.2", r: "1.85", fill: "#2D6A47", stroke: "#2D6A47", "stroke-width": "1.0", opacity: "0" }, cotChainGroup);
  const cotNode3Rays = mk("path", {
    d: "M 2.5,-39.4 L 2.5,-40.7 M 5.1,-38.0 L 6.3,-39.2 M -0.1,-38.0 L -1.3,-39.2",
    fill: "none", stroke: "#2D6A47", "stroke-width": "0.95", "stroke-linecap": "round", opacity: "0"
  }, cotChainGroup);

  // --- PROP 3 (Era 3 · 撞墙试错，接工具): 2.5D Side-Thickness Brick Wall + Deep Open Toolbox + Spiral Drill ---
  const prop3 = mk("g", { class: "evo-prop-hit", color: "#1D1B18", opacity: "1" }, scenery);
  mk("rect", { x: "-42", y: "-32", width: "58", height: "34", fill: "transparent" }, prop3);
  // Classic 2.5D Toolbox cleanly spaced left of drill stance (ZERO foot overlap!)
  const toolRackGroup = mk("g", { transform: "translate(-33.0, 0)" }, prop3);
  mk("ellipse", { cx: "0.5", cy: "0.35", rx: "7.2", ry: "1.0", fill: "#1D1B18", "fill-opacity": "0.11" }, toolRackGroup);
  // Open interior depth tray + glowing bamboo API tool-socket inner light when lid flips up!
  const toolBoxCavity = mk("g", { opacity: "0" }, toolRackGroup);
  mk("polygon", { points: "-5.2,-8.2 -3.6,-9.6 6.8,-9.6 5.4,-8.2", fill: "#D7CEC0", stroke: "currentColor", "stroke-width": "0.75", "stroke-linejoin": "round" }, toolBoxCavity);
  mk("polygon", { points: "-4.4,-8.2 -3.2,-9.2 5.4,-9.2 4.4,-8.2", fill: "#5CE09B", "fill-opacity": "0.35" }, toolBoxCavity);
  // 2.5D right-side thickness bevel on toolbox body
  mk("polygon", { points: "5.2,-8.2 7.0,-7.3 7.0,-0.8 5.2,0", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.9", "stroke-linejoin": "round" }, toolRackGroup);
  // Toolbox base body + reinforced dark-gunmetal corner brackets + front latch
  mk("rect", { x: "-5.4", y: "-8.2", width: "10.8", height: "8.2", rx: "1.0", fill: "url(#evo-porcelain)", stroke: "currentColor", "stroke-width": "1.0" }, toolRackGroup);
  mk("rect", { x: "-4.9", y: "-4.2", width: "9.8", height: "3.7", rx: "0.5", fill: "#E4DDD0" }, toolRackGroup);
  mk("path", { d: "M -5.4,-6.4 L -5.4,-8.2 L -3.6,-8.2 M 5.4,-6.4 L 5.4,-8.2 L 3.6,-8.2", fill: "none", stroke: "#2B2825", "stroke-width": "1.2", "stroke-linecap": "round" }, toolRackGroup);
  mk("rect", { x: "-1.3", y: "-7.2", width: "2.6", height: "2.2", rx: "0.4", fill: "#2B2825", stroke: "currentColor", "stroke-width": "0.7" }, toolRackGroup);
  const rackPortLed = mk("circle", { cx: "0", cy: "-6.1", r: "0.55", fill: "#5CE09B", opacity: "0.85" }, toolRackGroup);
  // Hinged toolbox lid + classic top carry handle (flips open on epiphany!)
  const toolBoxLid = mk("g", null, toolRackGroup);
  mk("path", { d: "M -2.2,-10.2 L -2.2,-11.7 Q -2.2,-12.5 -1.3,-12.5 L 1.3,-12.5 Q 2.2,-12.5 2.2,-11.7 L 2.2,-10.2", fill: "none", stroke: "currentColor", "stroke-width": "1.0", "stroke-linecap": "round" }, toolBoxLid);
  mk("rect", { x: "-5.8", y: "-10.3", width: "11.6", height: "2.4", rx: "0.7", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "1.0" }, toolBoxLid);
  // Big unmistakable conical Spiral Drill rising cleanly out of the open toolbox!
  const rackWrenchEl = mk("g", { opacity: "0" }, toolRackGroup);
  mk("rect", { x: "-2.2", y: "-14.2", width: "3.6", height: "3.8", rx: "0.8", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.95" }, rackWrenchEl);
  mk("polygon", { points: "1.4,-14.3 8.8,-12.3 1.4,-10.3", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.0", "stroke-linejoin": "round" }, rackWrenchEl);
  mk("path", { d: "M 3.0,-13.8 L 3.8,-10.8 M 5.2,-13.2 L 5.8,-11.4", fill: "none", stroke: "#2D6A47", "stroke-width": "0.85", "stroke-linecap": "round" }, rackWrenchEl);
  // Bamboo plug-in click flash when drill snaps onto robot forearm
  const toolSnapSpark = mk("g", { opacity: "0" }, toolRackGroup);
  mk("path", {
    d: "M 3.0,-16.8 L 3.0,-19.6 M 6.4,-15.6 L 8.6,-17.4 M -0.4,-15.6 L -2.6,-17.4",
    fill: "none", stroke: "#2D6A47", "stroke-width": "1.2", "stroke-linecap": "round"
  }, toolSnapSpark);

  // Ground AO contact shadow for 2.5D brick wall
  mk("ellipse", { cx: "1.4", cy: "0.4", rx: "12.4", ry: "1.25", fill: "#1D1B18", "fill-opacity": "0.12" }, prop3);

  // Intact 2.5D Solid Brick Wall (visible right masonry depth face — shatters when drilled through!)
  const wallBody = mk("g", null, prop3);
  // 2.5D right-hand masonry depth side face + brick course ticks
  mk("polygon", {
    points: "8.0,-26.2 11.0,-24.6 11.0,0 8.0,0",
    fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "1.05", "stroke-linejoin": "round"
  }, wallBody);
  mk("path", {
    d: "M 8.0,-21.0 L 11.0,-19.8 M 8.0,-16.0 L 11.0,-14.8 M 8.0,-10.8 L 11.0,-9.6 M 8.0,-5.5 L 11.0,-4.4",
    fill: "none", stroke: "currentColor", "stroke-width": "0.7", "stroke-opacity": "0.75"
  }, wallBody);
  mk("rect", {
    x: "-8", y: "-26.2", width: "16", height: "26.2", rx: "0.6",
    fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.2"
  }, wallBody);
  mk("rect", { x: "-7.5", y: "-25.7", width: "7.2", height: "4.6", fill: "#EDE8DE" }, wallBody);
  mk("rect", { x: "1.2", y: "-20.8", width: "6.3", height: "4.6", fill: "#EDE8DE" }, wallBody);
  mk("rect", { x: "-7.5", y: "-15.8", width: "6.0", height: "4.8", fill: "#EDE8DE" }, wallBody);
  mk("rect", { x: "0.8", y: "-10.6", width: "6.7", height: "4.8", fill: "#EDE8DE" }, wallBody);
  mk("rect", { x: "-7.5", y: "-5.4", width: "7.4", height: "5.0", fill: "#EDE8DE" }, wallBody);
  mk("path", {
    d: "M -8,-21.0 L 8,-21.0 M -8,-16.0 L 8,-16.0 M -8,-10.8 L 8,-10.8 M -8,-5.5 L 8,-5.5 M 0,-26.2 L 0,-21.0 M -3.6,-21.0 L -3.6,-16.0 M 3.8,-21.0 L 3.8,-16.0 M -1.4,-16.0 L -1.4,-10.8 M 3.6,-16.0 L 3.6,-10.8 M -4.2,-10.8 L -4.2,-5.5 M 0.8,-10.8 L 0.8,-5.5 M 0.2,-5.5 L 0.2,-2.2",
    fill: "none", stroke: "currentColor", "stroke-width": "0.75", "stroke-opacity": "0.8"
  }, wallBody);
  // Industrial hazard curb base along bottom of masonry barrier
  mk("rect", { x: "-8.3", y: "-2.3", width: "16.6", height: "2.3", rx: "0.35", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.85" }, wallBody);
  mk("path", { d: "M -6.8,-2.1 L -5.4,-0.2 M -3.2,-2.1 L -1.8,-0.2 M 0.4,-2.1 L 1.8,-0.2 M 4.0,-2.1 L 5.4,-0.2", fill: "none", stroke: "#2B2825", "stroke-width": "0.85", "stroke-linecap": "round" }, wallBody);
  // 2.5D coping stone cap (top bevel + right side depth)
  mk("polygon", {
    points: "8.7,-28.4 11.6,-26.9 11.6,-24.6 8.7,-26.0",
    fill: "#D7CEC0", stroke: "currentColor", "stroke-width": "0.95", "stroke-linejoin": "round"
  }, wallBody);
  mk("rect", {
    x: "-8.7", y: "-28.4", width: "17.4", height: "2.4", rx: "0.6",
    fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "1.1"
  }, wallBody);
  mk("line", { x1: "-7.6", y1: "-27.6", x2: "7.2", y2: "-27.6", stroke: "#FAF8F4", "stroke-width": "0.75", "stroke-linecap": "round", "stroke-opacity": "0.8" }, wallBody);
  // Steel barrier corner reinforcement + mini vermilion warning beacon perched atop brick bulkhead!
  mk("path", { d: "M -8.0,-26.2 L -8.0,-22.6 M 8.0,-26.2 L 8.0,-22.6", fill: "none", stroke: "#2B2825", "stroke-width": "1.25", "stroke-linecap": "round" }, wallBody);
  mk("rect", { x: "-2.2", y: "-30.6", width: "4.4", height: "2.2", rx: "0.7", fill: "#2B2825", stroke: "currentColor", "stroke-width": "0.68" }, wallBody);
  const wallBeacon = mk("circle", { cx: "0", cy: "-29.5", r: "0.85", fill: "#B83B2A" }, wallBody);
  // Dramatic jagged crack spreading from drill contact point during drilling!
  const wallCrack = mk("path", {
    d: "M -7.8,-13.6 L -3.2,-15.2 L -0.4,-12.6 L 3.6,-16.4 L 6.8,-13.2 M -0.4,-12.6 L -2.2,-7.6 L 1.4,-3.2 M -3.2,-15.2 L -1.6,-21.8 L 2.2,-25.4",
    fill: "none", stroke: "#1D1B18", "stroke-width": "1.25", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: "0"
  }, wallBody);

  // Permanently Smashed-Through 2.5D Brick Wall Rubble (left cleanly behind after breakthrough!)
  const wallBrokenG = mk("g", { opacity: "0" }, prop3);
  // Left jagged low brick stump
  mk("polygon", {
    points: "-8.2,0 -8.2,-10.2 -4.8,-10.2 -3.6,-6.2 -1.8,-4.6 -1.2,0",
    fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.1", "stroke-linejoin": "round"
  }, wallBrokenG);
  mk("path", { d: "M -8.0,-5.4 L -3.4,-5.4 M -5.0,-5.4 L -5.0,0", fill: "none", stroke: "currentColor", "stroke-width": "0.7", "stroke-opacity": "0.75" }, wallBrokenG);
  // Right jagged low brick stump with 2.5D side depth face
  mk("polygon", {
    points: "8.2,-12.6 10.8,-11.2 10.8,0 8.2,0",
    fill: "#D7CEC0", stroke: "currentColor", "stroke-width": "0.95", "stroke-linejoin": "round"
  }, wallBrokenG);
  mk("polygon", {
    points: "2.2,0 3.0,-5.0 4.8,-7.4 6.2,-12.6 8.2,-12.6 8.2,0",
    fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "1.1", "stroke-linejoin": "round"
  }, wallBrokenG);
  mk("path", { d: "M 3.2,-5.4 L 8.0,-5.4 M 5.8,-10.2 L 8.0,-10.2", fill: "none", stroke: "currentColor", "stroke-width": "0.7", "stroke-opacity": "0.75" }, wallBrokenG);
  // Tiny bent exposed rebar rods poking out of shattered masonry stumps!
  mk("path", { d: "M -6.2,-10.2 L -5.2,-12.6 M 6.8,-12.6 L 5.4,-15.0 M 7.6,-12.6 L 7.8,-14.4", fill: "none", stroke: "#2B2825", "stroke-width": "0.65", "stroke-linecap": "round" }, wallBrokenG);
  // Scattered broken bricks resting cleanly on ground
  mk("rect", { x: "-1.2", y: "-2.4", width: "3.2", height: "2.4", rx: "0.4", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.85", transform: "rotate(-12, 0.4, -1.2)" }, wallBrokenG);
  mk("rect", { x: "9.2", y: "-2.6", width: "3.4", height: "2.5", rx: "0.4", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "0.85", transform: "rotate(16, 10.9, -1.3)" }, wallBrokenG);
  mk("rect", { x: "-11.4", y: "-2.2", width: "2.8", height: "2.2", rx: "0.4", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.8", transform: "rotate(-18, -10.0, -1.1)" }, wallBrokenG);

  // Flying brick shards bursting outward during wall shatter!
  const wallShardsG = mk("g", { opacity: "0" }, prop3);
  const shard1 = mk("rect", { x: "-2", y: "-16", width: "4.0", height: "2.8", rx: "0.4", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.95" }, wallShardsG);
  const shard2 = mk("rect", { x: "1", y: "-20", width: "3.6", height: "2.6", rx: "0.4", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.95" }, wallShardsG);
  const shard3 = mk("rect", { x: "-4", y: "-22", width: "3.4", height: "2.4", rx: "0.4", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.9" }, wallShardsG);
  const shard4 = mk("rect", { x: "2", y: "-12", width: "3.8", height: "2.6", rx: "0.4", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.9" }, wallShardsG);

  // Drilling bamboo sparks + live spraying stone-chip particles at drill contact point!
  const wallTorqueArcs = mk("g", { opacity: "0" }, prop3);
  mk("path", {
    d: "M -8.6,-15.6 L -12.6,-18.8 M -8.8,-13.4 L -13.4,-13.8 M -8.6,-11.2 L -12.2,-8.4 M -6.8,-16.8 L -8.4,-20.6",
    fill: "none", stroke: "#2D6A47", "stroke-width": "1.15", "stroke-linecap": "round"
  }, wallTorqueArcs);
  const drillChips = [];
  for (let i = 0; i < 6; i++) {
    drillChips.push(mk("rect", { x: "-8", y: "-14", width: "1.4", height: "1.1", rx: "0.25", fill: i % 2 === 0 ? "#E4DDD0" : "#5CE09B", stroke: "#1D1B18", "stroke-width": "0.45", opacity: "0" }, prop3));
  }
  // Vermilion bonk impact star-sparks positioned cleanly at forehead collision zone
  const wallSparks = mk("g", { opacity: "0" }, prop3);
  mk("line", { x1: "-9.2", y1: "-24.8", x2: "-14.2", y2: "-28.8", stroke: "#B83B2A", "stroke-width": "1.4", "stroke-linecap": "round" }, wallSparks);
  mk("line", { x1: "-9.6", y1: "-22.2", x2: "-15.4", y2: "-23.0", stroke: "#B83B2A", "stroke-width": "1.4", "stroke-linecap": "round" }, wallSparks);
  mk("line", { x1: "-9.0", y1: "-19.6", x2: "-13.6", y2: "-17.6", stroke: "#B83B2A", "stroke-width": "1.3", "stroke-linecap": "round" }, wallSparks);
  mk("circle", { cx: "-8.2", cy: "-22.4", r: "1.45", fill: "#B83B2A" }, wallSparks);
  // Shatter dust puffs at ground seam
  const wallDust = mk("g", { opacity: "0" }, prop3);
  mk("circle", { cx: "-9.5", cy: "-2.2", r: "1.6", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.7" }, wallDust);
  mk("circle", { cx: "9.5", cy: "-2.4", r: "1.5", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.7" }, wallDust);
  mk("circle", { cx: "-12.0", cy: "-4.6", r: "1.0", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.65" }, wallDust);
  mk("circle", { cx: "11.8", cy: "-4.8", r: "0.95", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.65" }, wallDust);

  // --- PROP 4 (Era 4 · 手眼脑通，状态机): 2.5D Architect's Computer Desk + Steaming Coffee Mug + Live Code Typing -> Big ✓ ---
  const prop4 = mk("g", { class: "evo-prop-hit", color: "#1D1B18", opacity: "1" }, scenery);
  mk("rect", { x: "-20", y: "-36", width: "42", height: "38", fill: "transparent" }, prop4);
  // Crisp dual-optic vision scan cone projected from robot goggles onto the big desktop monitor!
  const gateScanBeam = mk("g", { opacity: "0" }, prop4);
  mk("polygon", { points: "-15.4,-25.2 -0.6,-22.2 -0.6,-15.2", fill: "url(#evo-scan-beam)" }, gateScanBeam);
  mk("line", { x1: "-15.4", y1: "-25.2", x2: "-0.6", y2: "-22.2", stroke: "#2D6A47", "stroke-width": "0.9", "stroke-opacity": "0.85" }, gateScanBeam);
  mk("line", { x1: "-15.4", y1: "-25.2", x2: "-0.6", y2: "-15.2", stroke: "#2D6A47", "stroke-width": "0.9", "stroke-opacity": "0.75" }, gateScanBeam);
  mk("line", { x1: "-15.4", y1: "-25.2", x2: "-0.6", y2: "-18.7", stroke: "#2D6A47", "stroke-width": "0.75", "stroke-dasharray": "2 2", "stroke-opacity": "0.85" }, gateScanBeam);
  // Subtle mint screen-glow wash cast leftward while actively typing/working!
  const deskScreenGlow = mk("polygon", { points: "-0.6,-23.2 -12.6,-21.0 -12.6,-12.2 -0.6,-15.2", fill: "#2D6A47", "fill-opacity": "0.09", opacity: "0" }, prop4);

  // 2.5D Dual-Screen AI Coding Workstation Desk + Blinking Mini Server Tower + Vertical Graph Side-Monitor + Coffee Mug!
  mk("ellipse", { cx: "3.4", cy: "0.4", rx: "18.2", ry: "1.2", fill: "#1D1B18", "fill-opacity": "0.11" }, prop4);
  mk("line", { x1: "-10.4", y1: "-10.4", x2: "-10.4", y2: "0", stroke: "currentColor", "stroke-width": "1.2", "stroke-linecap": "round" }, prop4);
  mk("line", { x1: "17.6", y1: "-10.4", x2: "17.6", y2: "0", stroke: "currentColor", "stroke-width": "1.2", "stroke-linecap": "round" }, prop4);
  mk("line", { x1: "-10.4", y1: "-3.6", x2: "17.6", y2: "-3.6", stroke: "currentColor", "stroke-width": "0.7", "stroke-opacity": "0.45" }, prop4);
  // Compact dark-gunmetal mini workstation tower tucked cleanly under right side of desk (live blinking disk/CPU LEDs!)
  mk("rect", { x: "11.2", y: "-6.6", width: "4.8", height: "6.6", rx: "0.65", fill: "#2B2825", stroke: "currentColor", "stroke-width": "0.75" }, prop4);
  mk("line", { x1: "12.2", y1: "-4.8", x2: "15.0", y2: "-4.8", stroke: "#FAF8F4", "stroke-width": "0.5", "stroke-opacity": "0.45", "stroke-linecap": "round" }, prop4);
  const towerLed1 = mk("circle", { cx: "12.6", cy: "-2.2", r: "0.52", fill: "#5CE09B" }, prop4);
  const towerLed2 = mk("circle", { cx: "14.4", cy: "-2.2", r: "0.52", fill: "#E4DDD0" }, prop4);
  mk("rect", { x: "-12.2", y: "-12.0", width: "33.0", height: "2.1", rx: "0.7", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "1.05" }, prop4);
  mk("line", { x1: "-11.4", y1: "-11.3", x2: "19.8", y2: "-11.3", stroke: "#FAF8F4", "stroke-width": "0.65", "stroke-linecap": "round", "stroke-opacity": "0.75" }, prop4);

  // Vertical Side-Monitor showing live miniature LangGraph vertical node flow!
  mk("line", { x1: "14.4", y1: "-12.0", x2: "14.4", y2: "-13.6", stroke: "currentColor", "stroke-width": "0.95" }, prop4);
  mk("rect", { x: "12.1", y: "-23.6", width: "5.2", height: "10.0", rx: "0.9", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "0.92" }, prop4);
  mk("rect", { x: "12.9", y: "-22.7", width: "3.6", height: "8.2", rx: "0.45", fill: "#181715" }, prop4);
  mk("line", { x1: "14.7", y1: "-21.3", x2: "14.7", y2: "-15.9", stroke: "#2D6A47", "stroke-width": "0.65" }, prop4);
  const sideGraphN1 = mk("circle", { cx: "14.7", cy: "-21.2", r: "0.78", fill: "#5CE09B" }, prop4);
  const sideGraphN2 = mk("circle", { cx: "14.7", cy: "-18.6", r: "0.78", fill: "#E4DDD0" }, prop4);
  const sideGraphN3 = mk("circle", { cx: "14.7", cy: "-16.0", r: "0.78", fill: "#E4DDD0" }, prop4);

  // Tiny Steaming Architect's Coffee Mug cleanly clear on far right corner of desk!
  mk("rect", { x: "18.1", y: "-14.7", width: "2.3", height: "2.7", rx: "0.5", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "0.78" }, prop4);
  mk("path", { d: "M 20.4,-14.1 Q 21.4,-14.1 21.4,-13.3 Q 21.4,-12.5 20.4,-12.5", fill: "none", stroke: "currentColor", "stroke-width": "0.7", "stroke-linecap": "round" }, prop4);
  const mugSteam1 = mk("path", { d: "M 18.8,-15.4 Q 18.3,-16.6 18.9,-17.7", fill: "none", stroke: "currentColor", "stroke-width": "0.6", "stroke-linecap": "round", opacity: "0.48" }, prop4);
  const mugSteam2 = mk("path", { d: "M 19.8,-15.3 Q 20.3,-16.4 19.7,-17.4", fill: "none", stroke: "currentColor", "stroke-width": "0.55", "stroke-linecap": "round", opacity: "0.42" }, prop4);

  // Angled Desktop Keyboard right where robot's hands rapidly type!
  mk("path", { d: "M -10.6,-12.0 L -9.8,-13.5 L -3.6,-13.5 L -3.0,-12.0 Z", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "0.9", "stroke-linejoin": "round" }, prop4);
  mk("line", { x1: "-9.0", y1: "-12.75", x2: "-4.4", y2: "-12.75", stroke: "currentColor", "stroke-width": "0.6", "stroke-dasharray": "1.2 1.0", "stroke-opacity": "0.65" }, prop4);
  // Tiny typing click-sparks above keyboard while typing!
  const typeSparks = mk("g", { opacity: "0" }, prop4);
  mk("path", { d: "M -8.6,-14.8 L -9.8,-16.6 M -6.6,-15.2 L -6.6,-17.4 M -4.6,-14.8 L -3.4,-16.6", fill: "none", stroke: "#2D6A47", "stroke-width": "0.95", "stroke-linecap": "round" }, typeSparks);

  // Big 2.5D Desktop Monitor (with subtle right bezel depth + live progressive typing code lines!)
  mk("path", { d: "M 2.8,-12.0 L 3.6,-14.4 L 6.2,-14.4 L 7.0,-12.0 Z", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.9", "stroke-linejoin": "round" }, prop4);
  // 2.5D right-side monitor housing depth
  mk("polygon", { points: "11.2,-24.6 12.6,-23.7 12.6,-13.8 11.2,-14.5", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.9", "stroke-linejoin": "round" }, prop4);
  mk("rect", { x: "-2.0", y: "-24.8", width: "13.4", height: "10.6", rx: "1.4", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.18" }, prop4);
  mk("rect", { x: "-0.7", y: "-23.5", width: "10.8", height: "8.0", rx: "0.9", fill: "#181715" }, prop4);
  // Live progressive code/terminal lines on screen (grow row-by-row while typing!)
  const gateScreenLines = mk("g", { opacity: "0.78" }, prop4);
  const codePrompt = mk("path", { d: "M 0.8,-21.7 L 1.9,-20.9 L 0.8,-20.1", fill: "none", stroke: "#7CE8B1", "stroke-width": "0.85", "stroke-linecap": "round", "stroke-linejoin": "round" }, gateScreenLines);
  const codeLine1 = mk("line", { x1: "3.1", y1: "-20.9", x2: "8.6", y2: "-20.9", stroke: "#FAF8F4", "stroke-width": "0.85", "stroke-linecap": "round" }, gateScreenLines);
  const codeLine2 = mk("line", { x1: "1.0", y1: "-19.0", x2: "7.2", y2: "-19.0", stroke: "#FAF8F4", "stroke-width": "0.85", "stroke-linecap": "round" }, gateScreenLines);
  const codeLine3 = mk("line", { x1: "1.0", y1: "-17.2", x2: "5.4", y2: "-17.2", stroke: "#B5F5D4", "stroke-width": "0.85", "stroke-linecap": "round" }, gateScreenLines);
  const codeCursor = mk("rect", { x: "6.0", y: "-17.8", width: "1.2", height: "1.2", rx: "0.2", fill: "#7CE8B1", opacity: "0" }, gateScreenLines);
  // Bold Luminous Bamboo-Green Checkmark ✓ (lights up when task finishes & stays permanently on screen!)
  const gateCheckEl = mk("path", {
    d: "M 1.9,-19.4 L 4.2,-17.1 L 8.5,-21.6",
    fill: "none", stroke: "#7CE8B1", "stroke-width": "1.65", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: "0"
  }, prop4);
  const gateSavedRipple = mk("circle", { cx: "14.2", cy: "-31.2", r: "2.4", fill: "none", stroke: "#2D6A47", "stroke-width": "0.95", opacity: "0" }, prop4);

  // Floating 3-Node State-Machine Chain cleanly above the monitor (○ -> || -> ●, with clean data tether!)
  const stateFlowGroup = mk("g", { opacity: "0" }, prop4);
  mk("line", { x1: "5.3", y1: "-24.8", x2: "5.3", y2: "-28.1", stroke: "#2D6A47", "stroke-width": "0.75", "stroke-dasharray": "1.5 1.5", "stroke-opacity": "0.75" }, stateFlowGroup);
  const gateLink1 = mk("line", { x1: "-2.0", y1: "-31.2", x2: "3.6", y2: "-31.2", stroke: "#2D6A47", "stroke-width": "1.0", opacity: "0" }, stateFlowGroup);
  const gateLink2 = mk("line", { x1: "7.0", y1: "-31.2", x2: "12.6", y2: "-31.2", stroke: "#2D6A47", "stroke-width": "1.0", opacity: "0" }, stateFlowGroup);
  const gateS1 = mk("circle", { cx: "-3.6", cy: "-31.2", r: "1.65", fill: "#FAF8F4", stroke: "#2D6A47", "stroke-width": "1.1" }, stateFlowGroup);
  const gateS2 = mk("circle", { cx: "5.3", cy: "-31.2", r: "1.65", fill: "#FAF8F4", stroke: "#2D6A47", "stroke-width": "1.1" }, stateFlowGroup);
  const gateS3 = mk("circle", { cx: "14.2", cy: "-31.2", r: "1.85", fill: "#2D6A47", stroke: "#2D6A47", "stroke-width": "1.0", opacity: "0" }, stateFlowGroup);
  const gateS3Rays = mk("path", {
    d: "M 14.2,-34.4 L 14.2,-36.0 M 16.8,-33.2 L 18.0,-34.4 M 11.6,-33.2 L 10.4,-34.4",
    fill: "none", stroke: "#2D6A47", "stroke-width": "0.95", "stroke-linecap": "round", opacity: "0"
  }, stateFlowGroup);
  // Pill-framed checkpoint freeze badge (||) right over S2 during the 0.28s state-machine pause!
  const gateFreezeBadge = mk("g", { opacity: "0" }, prop4);
  mk("rect", { x: "0.7", y: "-34.1", width: "9.2", height: "5.8", rx: "2.0", fill: "#FAF8F4", stroke: "#2D6A47", "stroke-width": "0.9", "stroke-opacity": "0.75" }, gateFreezeBadge);
  mk("line", { x1: "3.8", y1: "-32.6", x2: "3.8", y2: "-29.8", stroke: "#2D6A47", "stroke-width": "1.4", "stroke-linecap": "round" }, gateFreezeBadge);
  mk("line", { x1: "6.8", y1: "-32.6", x2: "6.8", y2: "-29.8", stroke: "#2D6A47", "stroke-width": "1.4", "stroke-linecap": "round" }, gateFreezeBadge);

  // --- PROP 5 (Era 5 · 卷马具，进生产): 2.5D Production Harness Launch Gantry with Swing-Open Clamps ---
  const prop5 = mk("g", { class: "evo-prop-hit", color: "#1D1B18", opacity: "1" }, scenery);
  mk("rect", { x: "-21", y: "-30", width: "42", height: "32", fill: "transparent" }, prop5);
  mk("ellipse", { cx: "0", cy: "0.45", rx: "19.6", ry: "1.35", fill: "#1D1B18", "fill-opacity": "0.12" }, prop5);
  // Soft holographic projection cone behind pad
  const padField = mk("polygon", {
    points: "-12.2,-3.6 -15.0,-29 15.0,-29 12.2,-3.6",
    fill: "url(#evo-pad-grad)",
    opacity: "0"
  }, prop5);
  // Aerospace Tall Cross-Braced Twin Launch Gantry Towers (SpaceX / Gundam Hangar Truss Lattice!)
  mk("path", {
    d: "M -15.4,-7.6 L -15.4,-29.2 M -18.0,-7.6 L -18.0,-27.4 M -18.0,-13.0 L -15.4,-13.0 M -18.0,-18.0 L -15.4,-18.0 M -18.0,-23.0 L -15.4,-23.0 M -18.0,-8.0 L -15.4,-13.0 M -15.4,-13.0 L -18.0,-18.0 M -18.0,-18.0 L -15.4,-23.0 M -15.4,-23.0 L -18.0,-27.4 M 15.2,-7.6 L 15.2,-29.2 M 17.8,-7.6 L 17.8,-27.4 M 15.2,-13.0 L 17.8,-13.0 M 15.2,-18.0 L 17.8,-18.0 M 15.2,-23.0 L 17.8,-23.0 M 17.8,-8.0 L 15.2,-13.0 M 15.2,-13.0 L 17.8,-18.0 M 17.8,-18.0 L 15.2,-23.0 M 15.2,-23.0 L 17.8,-27.4",
    fill: "none", stroke: "currentColor", "stroke-width": "0.78", "stroke-linecap": "round"
  }, prop5);
  // Tall aviation beacon masts atop twin towers
  mk("path", { d: "M -15.4,-31.4 L -15.4,-33.4 M 15.2,-31.4 L 15.2,-33.4", fill: "none", stroke: "currentColor", "stroke-width": "0.7", "stroke-linecap": "round" }, prop5);
  // Articulated Swing-Open Mechanical Launch Clamps (swing crisply outward like umbilical arms!)
  const gantryClampL = mk("g", null, prop5);
  mk("path", { d: "M -15.4,-18.2 L -11.4,-18.2 L -10.8,-16.7 L -15.4,-16.7 Z", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.8", "stroke-linejoin": "round" }, gantryClampL);
  mk("circle", { cx: "-15.4", cy: "-17.4", r: "0.85", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "0.75" }, gantryClampL);
  const gantryClampR = mk("g", null, prop5);
  mk("path", { d: "M 15.2,-18.2 L 11.2,-18.2 L 10.6,-16.7 L 15.2,-16.7 Z", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.8", "stroke-linejoin": "round" }, gantryClampR);
  mk("circle", { cx: "15.2", cy: "-17.4", r: "0.85", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "0.75" }, gantryClampR);
  const gantryBeaconL = mk("circle", { cx: "-15.4", cy: "-30.3", r: "1.18", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.8" }, prop5);
  const gantryBeaconR = mk("circle", { cx: "15.2", cy: "-30.3", r: "1.18", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.8" }, prop5);
  // Dedicated Side Status Housing for 3 Sequential Pre-Flight Check LEDs (ZERO truss line overlap!)
  mk("rect", { x: "18.3", y: "-23.4", width: "3.0", height: "14.4", rx: "0.75", fill: "#2B2825", stroke: "currentColor", "stroke-width": "0.68" }, prop5);
  const padCheck1 = mk("circle", { cx: "19.8", cy: "-11.4", r: "1.0", fill: "#EDE8DE" }, prop5);
  const padCheck2 = mk("circle", { cx: "19.8", cy: "-16.2", r: "1.0", fill: "#EDE8DE" }, prop5);
  const padCheck3 = mk("circle", { cx: "19.8", cy: "-21.0", r: "1.0", fill: "#EDE8DE" }, prop5);
  // Vertical alignment ticks + sweeping horizontal scan line + rising energy ellipse
  const padBeams = mk("g", { opacity: "0" }, prop5);
  mk("line", { x1: "-11.4", y1: "-6", x2: "-11.4", y2: "-29", stroke: "#2D6A47", "stroke-width": "0.8", "stroke-dasharray": "2 3" }, padBeams);
  mk("line", { x1: "11.4", y1: "-6", x2: "11.4", y2: "-29", stroke: "#2D6A47", "stroke-width": "0.8", "stroke-dasharray": "2 3" }, padBeams);
  const padScanLine = mk("line", { x1: "-12.4", y1: "-6", x2: "12.4", y2: "-6", stroke: "#2D6A47", "stroke-width": "1.05", "stroke-opacity": "0.75", "stroke-dasharray": "3 2", opacity: "0" }, prop5);
  const padEnergyRing = mk("ellipse", { cx: "0", cy: "-6", rx: "11.5", ry: "2.2", fill: "none", stroke: "#2D6A47", "stroke-width": "1.05", opacity: "0" }, prop5);
  const padEnergyRing2 = mk("ellipse", { cx: "0", cy: "-14", rx: "10.0", ry: "1.9", fill: "none", stroke: "#5CE09B", "stroke-width": "0.85", "stroke-dasharray": "3 2", opacity: "0" }, prop5);
  // Stepped aerospace launch deck + dark recessed flame trench exhaust pit + blinding overdrive core!
  mk("path", {
    d: "M -18.2,0 L -15.2,-3.6 L 15.2,-3.6 L 18.2,0 Z",
    fill: "url(#evo-porcelain)", stroke: "currentColor", "stroke-width": "1.05", "stroke-linejoin": "round"
  }, prop5);
  mk("path", {
    d: "M -11.4,-3.6 L -9.6,-1.1 L 9.6,-1.1 L 11.4,-3.6 Z",
    fill: "#2B2825", stroke: "currentColor", "stroke-width": "0.75", "stroke-linejoin": "round"
  }, prop5);
  const trenchGlow = mk("ellipse", { cx: "0", cy: "-2.3", rx: "9.8", ry: "1.65", fill: "#5CE09B", opacity: "0" }, prop5);
  const trenchCore = mk("ellipse", { cx: "0", cy: "-2.3", rx: "6.4", ry: "0.95", fill: "#FFFFFF", opacity: "0" }, prop5);
  // Multi-Layer Symmetrical High-Pressure Exhaust Steam Plumes blasting left & right out of launch trench!
  const launchSteamL = mk("g", { opacity: "0" }, prop5);
  mk("circle", { cx: "-18.2", cy: "-2.6", r: "2.6", fill: "#FAF8F4", stroke: "#2D6A47", "stroke-width": "0.68", "fill-opacity": "0.94" }, launchSteamL);
  mk("circle", { cx: "-22.0", cy: "-4.6", r: "3.4", fill: "#E6EFE8", stroke: "#2D6A47", "stroke-width": "0.58", "fill-opacity": "0.88" }, launchSteamL);
  mk("circle", { cx: "-26.4", cy: "-2.6", r: "2.4", fill: "#FAF8F4", stroke: "#2D6A47", "stroke-width": "0.52", "fill-opacity": "0.80" }, launchSteamL);
  mk("circle", { cx: "-24.5", cy: "-6.6", r: "2.1", fill: "#E6EFE8", stroke: "#5CE09B", "stroke-width": "0.45", "fill-opacity": "0.68" }, launchSteamL);
  const launchSteamR = mk("g", { opacity: "0" }, prop5);
  mk("circle", { cx: "18.2", cy: "-2.6", r: "2.6", fill: "#FAF8F4", stroke: "#2D6A47", "stroke-width": "0.68", "fill-opacity": "0.94" }, launchSteamR);
  mk("circle", { cx: "22.0", cy: "-4.6", r: "3.4", fill: "#E6EFE8", stroke: "#2D6A47", "stroke-width": "0.58", "fill-opacity": "0.88" }, launchSteamR);
  mk("circle", { cx: "26.4", cy: "-2.6", r: "2.4", fill: "#FAF8F4", stroke: "#2D6A47", "stroke-width": "0.52", "fill-opacity": "0.80" }, launchSteamR);
  mk("circle", { cx: "24.5", cy: "-6.6", r: "2.1", fill: "#E6EFE8", stroke: "#5CE09B", "stroke-width": "0.45", "fill-opacity": "0.68" }, launchSteamR);
  // Twin sculpted docking clamp pylons
  mk("path", {
    d: "M -16.8,0 L -17.6,-7.6 L -14.2,-7.6 L -13.2,-3.6 M 16.8,0 L 17.6,-7.6 L 14.2,-7.6 L 13.2,-3.6",
    fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "1.05", "stroke-linecap": "round", "stroke-linejoin": "round"
  }, prop5);
  mk("line", { x1: "-17.0", y1: "-5.2", x2: "-14.0", y2: "-5.2", stroke: "currentColor", "stroke-width": "0.75", "stroke-opacity": "0.55" }, prop5);
  mk("line", { x1: "14.0", y1: "-5.2", x2: "17.0", y2: "-5.2", stroke: "currentColor", "stroke-width": "0.75", "stroke-opacity": "0.55" }, prop5);
  const padPipL = mk("circle", { cx: "-15.8", cy: "-6.3", r: "0.95", fill: "#2D6A47", opacity: "0" }, prop5);
  const padPipR = mk("circle", { cx: "15.8", cy: "-6.3", r: "0.95", fill: "#2D6A47", opacity: "0" }, prop5);
  // Central bamboo-green summon emitter bar
  const padCore = mk("line", { x1: "-6.8", y1: "-3.6", x2: "6.8", y2: "-3.6", stroke: "#2D6A47", "stroke-width": "2.1", "stroke-linecap": "round", opacity: "0" }, prop5);

  // Era 5 Iron Man vertical takeoff FX: ground shockwave, sonic boom ring & contrails
  const launchShock = mk("g", { opacity: "0" }, scenery);
  const shockL = mk("line", { stroke: "#1D1B18", "stroke-width": "1.15", "stroke-linecap": "round" }, launchShock);
  const shockR = mk("line", { stroke: "#1D1B18", "stroke-width": "1.15", "stroke-linecap": "round" }, launchShock);
  const sonicRing = mk("ellipse", { cx: "0", cy: "0", rx: "6", ry: "2", fill: "none", stroke: "#2D6A47", "stroke-width": "1.2", opacity: "0" }, scenery);
  const launchTrail = mk("line", { stroke: "#2D6A47", "stroke-width": "1.3", "stroke-dasharray": "3 3", "stroke-linecap": "round", opacity: "0" }, scenery);
  const launchTrailL = mk("line", { stroke: "#1D1B18", "stroke-width": "0.85", "stroke-opacity": "0.35", "stroke-linecap": "round", opacity: "0" }, scenery);
  const launchTrailR = mk("line", { stroke: "#1D1B18", "stroke-width": "0.85", "stroke-opacity": "0.35", "stroke-linecap": "round", opacity: "0" }, scenery);

  // Era 5 Tracing evenly-spaced micro-dots (behind mech)
  const tracePool = [];
  for (let i = 0; i < 6; i++) {
    const c = mk("circle", { cx: "0", cy: String(BASE_Y - 0.9), r: "1.1", fill: "#2D6A47", opacity: "0" }, scenery);
    tracePool.push({ el: c, x: 0, life: 0 });
  }

  // Era 1 Mode B ink skid-dashes during long belly-slide
  const skidPool = [];
  for (let i = 0; i < 5; i++) {
    const ln = mk("line", { x1: "0", y1: String(BASE_Y - 1.2), x2: "0", y2: String(BASE_Y - 1.2), stroke: "#1D1B18", "stroke-width": "1.0", "stroke-linecap": "round", opacity: "0" }, scenery);
    skidPool.push({ el: ln, x: 0, yOff: 0, life: 0 });
  }

  // =====================================================================
  // LAYER 1B: ERA 1 ROBOTICS ENGINEER (Playful Cartoon-Stickman Engineer Style!)
  // Inspired by style-2a/2b: expressive big white head + amber engineer hardhat +
  // nerd glasses + bamboo-green short-sleeve engineer tee + crisp stickman limbs!
  // =====================================================================
  const humanGroup = mk("g", { opacity: "0" }, scenery);
  mk("ellipse", { cx: "0", cy: "0.35", rx: "5.4", ry: "1.0", fill: "#1D1B18", "fill-opacity": "0.11" }, humanGroup);
  // Clean stickman legs with crisp L-shaped shoe ticks (exact style-2a/2b silhouette!)
  const humanLegB = mk("path", { d: "M -0.9,-9.6 L -2.6,-4.8 L -3.2,0 L -1.2,0", fill: "none", stroke: "#1D1B18", "stroke-width": "1.38", "stroke-linecap": "round", "stroke-linejoin": "round" }, humanGroup);
  const humanLegF = mk("path", { d: "M 0.9,-9.6 L 2.2,-4.8 L 1.6,0 L 3.8,0", fill: "none", stroke: "#1D1B18", "stroke-width": "1.48", "stroke-linecap": "round", "stroke-linejoin": "round" }, humanGroup);
  // Upper engineer body (pivots cleanly at hip y = -9.6)
  const humanTorsoG = mk("g", { transform: "translate(0, -9.6)" }, humanGroup);
  // Back stickman arm + crisp white cartoon fist/hand
  const humanArmB = mk("path", { d: "M -2.2,-7.6 L -4.4,-4.4 L -2.6,-1.6", fill: "none", stroke: "#1D1B18", "stroke-width": "1.32", "stroke-linecap": "round", "stroke-linejoin": "round" }, humanTorsoG);
  const humanHandB = mk("circle", { cx: "-2.6", cy: "-1.6", r: "1.1", fill: "#FFFDF9", stroke: "#1D1B18", "stroke-width": "0.85" }, humanTorsoG);
  // Bamboo-green short-sleeve engineer shirt (tapered boxy tee + left/right short sleeves + pocket badge!)
  mk("path", {
    d: "M -2.4,-8.4 L -4.2,-6.8 L -3.1,-5.4 L -2.3,-6.0 L -2.7,-0.2 L 2.7,-0.2 L 2.5,-6.0 L 3.5,-5.3 L 4.4,-6.8 L 2.4,-8.4 Q 0,-9.0 -2.4,-8.4 Z",
    fill: "#3B7E58", stroke: "#1D1B18", "stroke-width": "0.95", "stroke-linejoin": "round"
  }, humanTorsoG);
  // White collar notch + engineer chest pocket + tiny pen clip
  mk("path", { d: "M -1.1,-8.4 Q 0,-7.4 1.1,-8.4", fill: "none", stroke: "#FAF8F4", "stroke-width": "0.75", "stroke-linecap": "round" }, humanTorsoG);
  mk("rect", { x: "0.3", y: "-5.7", width: "1.7", height: "1.9", rx: "0.3", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.55" }, humanTorsoG);
  mk("line", { x1: "1.4", y1: "-6.4", x2: "1.4", y2: "-5.5", stroke: "#B83B2A", "stroke-width": "0.65", "stroke-linecap": "round" }, humanTorsoG);
  // Iconic big expressive round white cartoon head (style-2a/2b ratio!)
  mk("circle", { cx: "0.3", cy: "-13.1", r: "3.95", fill: "#FFFDF9", stroke: "#1D1B18", "stroke-width": "1.02" }, humanTorsoG);
  // Engineer's rectangular nerd glasses + expressive eyes (smile -> exasperated when Mark I trips!)
  const engFaceHappy = mk("g", null, humanTorsoG);
  mk("ellipse", { cx: "1.0", cy: "-12.9", rx: "0.46", ry: "0.78", fill: "#1D1B18" }, engFaceHappy);
  mk("ellipse", { cx: "2.8", cy: "-12.9", rx: "0.46", ry: "0.78", fill: "#1D1B18" }, engFaceHappy);
  mk("path", { d: "M 0.9,-11.0 Q 2.0,-10.2 3.1,-11.1", fill: "none", stroke: "#1D1B18", "stroke-width": "0.72", "stroke-linecap": "round" }, engFaceHappy);
  const engFaceOops = mk("g", { opacity: "0" }, humanTorsoG);
  mk("line", { x1: "0.5", y1: "-12.9", x2: "1.5", y2: "-12.9", stroke: "#1D1B18", "stroke-width": "0.85", "stroke-linecap": "round" }, engFaceOops);
  mk("line", { x1: "2.3", y1: "-12.9", x2: "3.3", y2: "-12.9", stroke: "#1D1B18", "stroke-width": "0.85", "stroke-linecap": "round" }, engFaceOops);
  mk("line", { x1: "1.1", y1: "-10.9", x2: "2.7", y2: "-10.9", stroke: "#1D1B18", "stroke-width": "0.75", "stroke-linecap": "round" }, engFaceOops);
  // Subtle dark-rimmed engineer glasses perched cleanly across eyes
  mk("rect", { x: "0.1", y: "-14.0", width: "1.75", height: "2.0", rx: "0.45", fill: "none", stroke: "#1D1B18", "stroke-width": "0.52", "stroke-opacity": "0.78" }, humanTorsoG);
  mk("rect", { x: "2.05", y: "-14.0", width: "1.75", height: "2.0", rx: "0.45", fill: "none", stroke: "#1D1B18", "stroke-width": "0.52", "stroke-opacity": "0.78" }, humanTorsoG);
  mk("line", { x1: "-2.8", y1: "-13.2", x2: "0.1", y2: "-13.1", stroke: "#1D1B18", "stroke-width": "0.5", "stroke-opacity": "0.7" }, humanTorsoG);
  // Warm Amber-Gold Engineer Hardhat (safety helmet crown + top rib + front visor brim!)
  mk("path", {
    d: "M -3.9,-14.8 Q -3.6,-18.8 0.4,-18.7 Q 4.0,-18.6 4.1,-14.9 Z",
    fill: "#ECC054", stroke: "#1D1B18", "stroke-width": "0.95", "stroke-linejoin": "round"
  }, humanTorsoG);
  mk("path", { d: "M -0.4,-18.7 L -0.4,-15.3 M 1.1,-18.6 L 1.1,-15.3", fill: "none", stroke: "#1D1B18", "stroke-width": "0.62", "stroke-opacity": "0.45", "stroke-linecap": "round" }, humanTorsoG);
  mk("path", { d: "M -4.4,-14.8 Q 0.4,-15.4 5.5,-14.5 Q 5.6,-13.7 4.4,-13.9 L -4.1,-14.1 Z", fill: "#DFAB38", stroke: "#1D1B18", "stroke-width": "0.85", "stroke-linejoin": "round" }, humanTorsoG);
  // Front stickman arm + crisp white cartoon fist/hand (locks mathematically onto Mark I's key!)
  const humanArmF = mk("path", { d: "M 2.6,-6.6 L 5.6,-4.4 L 8.2,-3.8", fill: "none", stroke: "#1D1B18", "stroke-width": "1.42", "stroke-linecap": "round", "stroke-linejoin": "round" }, humanTorsoG);
  const humanHand = mk("circle", { cx: "8.2", cy: "-3.8", r: "1.18", fill: "#FFFDF9", stroke: "#1D1B18", "stroke-width": "0.88" }, humanTorsoG);
  // Mechanical ratchet crank arcs + golden full-wind sparkle star centered cleanly at (0,0) on Mark I's brass key!
  const windTicks = mk("g", { opacity: "0" }, humanGroup);
  mk("path", { d: "M -2.2,-4.0 A 4.4,4.4 0 0,1 3.6,-2.4 M -2.0,4.0 A 4.4,4.4 0 0,0 3.6,2.4", fill: "none", stroke: "#2D6A47", "stroke-width": "0.95", "stroke-linecap": "round" }, windTicks);
  const keyFullSpark = mk("g", { opacity: "0" }, humanGroup);
  mk("path", { d: "M 0,-5.4 L 1.0,-1.2 L 5.0,0 L 1.0,1.2 L 0,5.4 L -1.0,1.2 L -5.0,0 L -1.0,-1.2 Z", fill: "#F6D365", stroke: "#1D1B18", "stroke-width": "0.55", "stroke-linejoin": "round" }, keyFullSpark);
  // Comedic sweat-drop + "..." exasperation reaction cleanly above engineer's hardhat!
  const humanSweat = mk("g", { opacity: "0" }, humanGroup);
  mk("path", { d: "M 6.2,-27.4 Q 7.2,-25.4 6.2,-24.8 Q 5.2,-25.4 6.2,-27.4 Z", fill: "#B5F5D4", stroke: "#2D6A47", "stroke-width": "0.72" }, humanSweat);
  mk("circle", { cx: "-2.8", cy: "-30.6", r: "0.65", fill: "#1D1B18" }, humanSweat);
  mk("circle", { cx: "-0.4", cy: "-30.6", r: "0.65", fill: "#1D1B18" }, humanSweat);
  mk("circle", { cx: "2.0", cy: "-30.6", r: "0.65", fill: "#1D1B18" }, humanSweat);


  return {
    svg,
    groundBounceEl, prop1, pebbleDust, prop2, vatCranePiston, vatEkgWave, vatGlow, vatLiquidGroup, vatLiquidFill, vatMeniscus, vatBubbles, vatEmitter, brainTrailDots, vatBrainGroup, vatAntTip, vatEyeSleep, vatEyeAwake, vatDomeGroup, brainDockSpark, cotChainGroup, cotLink1, cotLink2, cotNode1, cotNode2, cotNode3, cotNode3Rays, prop3, toolBoxCavity, rackPortLed, toolBoxLid, rackWrenchEl, toolSnapSpark, wallBody, wallBeacon, wallCrack, wallBrokenG, wallShardsG, shard1, shard2, shard3, shard4, wallTorqueArcs, drillChips, wallSparks, wallDust, prop4, gateScanBeam, deskScreenGlow, towerLed1, towerLed2, sideGraphN1, sideGraphN2, sideGraphN3, mugSteam1, mugSteam2, typeSparks, gateScreenLines, codeLine1, codeLine2, codeLine3, codeCursor, gateCheckEl, gateSavedRipple, stateFlowGroup, gateLink1, gateLink2, gateS1, gateS2, gateS3, gateS3Rays, gateFreezeBadge, prop5, padField, gantryClampL, gantryClampR, gantryBeaconL, gantryBeaconR, padCheck1, padCheck2, padCheck3, padBeams, padScanLine, padEnergyRing, padEnergyRing2, trenchGlow, trenchCore, launchSteamL, launchSteamR, padPipL, padPipR, padCore, launchShock, shockL, shockR, sonicRing, launchTrail, launchTrailL, launchTrailR, tracePool, skidPool, humanGroup, humanLegB, humanLegF, humanTorsoG, humanArmB, humanHandB, engFaceHappy, engFaceOops, humanArmF, humanHand, windTicks, keyFullSpark, humanSweat
  };
}
