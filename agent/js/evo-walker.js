(function () {
  "use strict";

  const AgentBlog = (window.AgentBlog = window.AgentBlog || {});

  /* =======================================================================
     10. EVOLVING INK-ART ROBOT ON THE TIMELINE SPINE
         Inspired by JDhruv14/line-art-animation: ink-on-paper SVG filter,
         2-bone IK gait solver, spring scarf & continuous 5-era morphology
     ======================================================================= */
  const evoLayerEl = document.getElementById("evo-walker-layer");

  function initEvoWalker() {
    if (!evoLayerEl) return;

    const NS = "http://www.w3.org/2000/svg";
    const mk = (tag, attrs, parent) => {
      const node = document.createElementNS(NS, tag);
      if (attrs) {
        Object.keys(attrs).forEach((k) => node.setAttribute(k, attrs[k]));
      }
      if (parent) parent.appendChild(node);
      return node;
    };

    const BASE_Y = 42;
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

    // Clip path for Era 3 brick barrier sinking cleanly into the ground seam (y <= 0)
    const wallClip = mk("clipPath", { id: "evo-wall-clip" }, defs);
    mk("rect", { x: "-24", y: "-38", width: "48", height: "38" }, wallClip);

    // =====================================================================
    // LAYER 1: 5 EDITORIAL INK-AND-WASH MILESTONE PROPS (behind robot)
    // =====================================================================
    const scenery = mk("g", null, svg);

    // --- PROP 1 (Era 1 · 按脚本跑，无大脑): Fixed Script Track Rail + Blocking Stone Cluster ---
    const prop1 = mk("g", { color: "#8A8275", opacity: "0.42" }, scenery);
    // Rigid miniature script rail leading right up to the blocking stone
    mk("line", { x1: "-35", y1: "-1.5", x2: "-4.5", y2: "-1.5", stroke: "currentColor", "stroke-width": "1.1", "stroke-linecap": "round" }, prop1);
    mk("path", {
      d: "M -34.5,-3.6 L -34.5,0 M -31,-1.5 L -31,0 M -26,-1.5 L -26,0 M -21,-1.5 L -21,0 M -16,-1.5 L -16,0 M -11,-1.5 L -11,0 M -6.2,-1.5 L -6.2,0",
      fill: "none", stroke: "currentColor", "stroke-width": "0.85", "stroke-linecap": "round"
    }, prop1);
    mk("circle", { cx: "-34.5", cy: "-4.2", r: "0.9", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.8" }, prop1);
    mk("line", { x1: "-9.2", y1: "0", x2: "8.4", y2: "0", stroke: "currentColor", "stroke-width": "0.95", "stroke-opacity": "0.35", "stroke-linecap": "round" }, prop1);
    // Companion micro-pebble on left
    mk("polygon", {
      points: "-7.6,0 -6.6,-3.0 -4.3,-2.8 -3.5,0",
      fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.95", "stroke-linejoin": "round"
    }, prop1);
    // Main faceted stone
    mk("polygon", {
      points: "-4.8,0 -3.6,-5.4 -0.4,-7.3 3.8,-5.0 5.6,0",
      fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.15", "stroke-linejoin": "round"
    }, prop1);
    // Warm stone-wash shaded right facet
    mk("polygon", {
      points: "-0.4,-7.3 3.8,-5.0 5.6,0 0.8,0 0.3,-3.6",
      fill: "#EDE8DE", "fill-opacity": "0.92"
    }, prop1);
    // Facet ridge & tiny ink-hatching marks
    mk("path", {
      d: "M -0.4,-7.3 L 0.3,-3.6 L 0.8,0 M -2.8,-2.8 L -1.4,-2.8 M 2.0,-2.0 L 3.3,-2.0",
      fill: "none", stroke: "currentColor", "stroke-width": "0.8", "stroke-linecap": "round"
    }, prop1);
    // Tiny chip pebble on far right
    mk("polygon", {
      points: "5.8,0 6.5,-1.8 7.8,-1.5 8.2,0",
      fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.85", "stroke-linejoin": "round"
    }, prop1);
    // Trip kick dust puffs (Era 1)
    const pebbleDust = mk("g", { opacity: "0" }, prop1);
    mk("circle", { cx: "7.0", cy: "-2.4", r: "1.2", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.75" }, pebbleDust);
    mk("circle", { cx: "10.0", cy: "-4.4", r: "0.9", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.7" }, pebbleDust);
    mk("line", { x1: "5.6", y1: "-5.2", x2: "8.4", y2: "-7.2", stroke: "#1D1B18", "stroke-width": "0.85", "stroke-linecap": "round" }, pebbleDust);

    // --- PROP 2 (Era 2 · 缸中之脑，会推理): Glass Bell-Jar Brain-in-a-Vat Pedestal + 3-Step CoT Chain ---
    const prop2 = mk("g", { color: "#8A8275", opacity: "0.42" }, scenery);
    mk("line", { x1: "-13.5", y1: "0", x2: "13.5", y2: "0", stroke: "currentColor", "stroke-width": "0.9", "stroke-opacity": "0.3", "stroke-linecap": "round" }, prop2);
    // Stepped scientific pedestal base
    mk("path", {
      d: "M -11.4,0 L -10.2,-2.4 L 10.2,-2.4 L 11.4,0 Z",
      fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "1.05", "stroke-linejoin": "round"
    }, prop2);
    mk("rect", {
      x: "-8.8", y: "-8.4", width: "17.6", height: "6.0", rx: "0.9",
      fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.1"
    }, prop2);
    // Pedestal instrument vents & twin micro-conduits
    mk("rect", { x: "-6.6", y: "-6.8", width: "5.0", height: "2.8", rx: "0.5", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.7" }, prop2);
    mk("path", { d: "M 0.8,-6.2 L 6.4,-6.2 M 0.8,-4.6 L 4.8,-4.6", fill: "none", stroke: "currentColor", "stroke-width": "0.75", "stroke-linecap": "round" }, prop2);
    // Vat rim collar & bamboo neural emitter strip
    mk("rect", { x: "-9.6", y: "-10.0", width: "19.2", height: "1.8", rx: "0.7", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.95" }, prop2);
    const vatGlow = mk("ellipse", { cx: "0", cy: "-15.5", rx: "6.8", ry: "5.2", fill: "url(#evo-arc-glow)", opacity: "0.35" }, prop2);
    const vatEmitter = mk("line", { x1: "-5.0", y1: "-10.0", x2: "5.0", y2: "-10.0", stroke: "#2D6A47", "stroke-width": "1.6", "stroke-linecap": "round", opacity: "0.65" }, prop2);
    // Floating CRT Brain Head inside the Glass Vat (physically arcs onto the robot's neck in Era 2!)
    const vatBrainGroup = mk("g", { transform: "translate(0, -16.8)" }, prop2);
    mk("line", { x1: "-0.7", y1: "-4.4", x2: "-1.2", y2: "-7.6", stroke: "currentColor", "stroke-width": "1.05", "stroke-linecap": "round" }, vatBrainGroup);
    const vatAntTip = mk("circle", { cx: "-1.3", cy: "-8.3", r: "1.15", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "0.95" }, vatBrainGroup);
    mk("rect", { x: "-6.2", y: "-1.4", width: "1.4", height: "3.0", rx: "0.55", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.85" }, vatBrainGroup);
    mk("rect", { x: "4.8", y: "-1.4", width: "1.3", height: "2.8", rx: "0.5", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.85" }, vatBrainGroup);
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
    // Curved glass reflection sheen + top brass finial knob
    mk("path", {
      d: "M -5.8,-21.4 A 6.2,6.2 0 0,1 -1.8,-25.6",
      fill: "none", stroke: "#FAF8F4", "stroke-width": "1.2", "stroke-linecap": "round", "stroke-opacity": "0.85"
    }, vatDomeGroup);
    mk("circle", { cx: "0", cy: "-29.4", r: "1.2", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.9" }, vatDomeGroup);
    // Neck-dock bamboo flash burst when brain locks onto robot
    const brainDockSpark = mk("g", { opacity: "0" }, prop2);
    mk("path", {
      d: "M -23,-20 L -26,-22 M -23,-15 L -26,-14 M -13,-20 L -10,-22 M -13,-15 L -10,-14",
      fill: "none", stroke: "#2D6A47", "stroke-width": "1.2", "stroke-linecap": "round"
    }, brainDockSpark);
    // Sequential 3-step Chain-of-Thought node chain (○ -> ○ -> ●) cleanly clear above robot antenna & dome
    const cotChainGroup = mk("g", { opacity: "0" }, prop2);
    const cotLink1 = mk("line", { x1: "-13.6", y1: "-38.6", x2: "-7.6", y2: "-38.6", stroke: "#2D6A47", "stroke-width": "1.05", opacity: "0" }, cotChainGroup);
    const cotLink2 = mk("line", { x1: "-4.4", y1: "-38.6", x2: "1.6", y2: "-38.6", stroke: "#2D6A47", "stroke-width": "1.05", opacity: "0" }, cotChainGroup);
    const cotNode1 = mk("circle", { cx: "-15.2", cy: "-38.6", r: "1.65", fill: "#FAF8F4", stroke: "#2D6A47", "stroke-width": "1.1", opacity: "0" }, cotChainGroup);
    const cotNode2 = mk("circle", { cx: "-6.0", cy: "-38.6", r: "1.65", fill: "#FAF8F4", stroke: "#2D6A47", "stroke-width": "1.1", opacity: "0" }, cotChainGroup);
    const cotNode3 = mk("circle", { cx: "3.2", cy: "-38.6", r: "1.9", fill: "#2D6A47", stroke: "#2D6A47", "stroke-width": "1.0", opacity: "0" }, cotChainGroup);
    const cotNode3Rays = mk("path", {
      d: "M 3.2,-42.0 L 3.2,-43.6 M 6.0,-40.6 L 7.2,-41.8 M 0.4,-40.6 L -0.8,-41.8",
      fill: "none", stroke: "#2D6A47", "stroke-width": "0.95", "stroke-linecap": "round", opacity: "0"
    }, cotChainGroup);

    // --- PROP 3 (Era 3 · 撞墙试错，接工具): Brick Barrier Wall + Wall-Side Function-Calling Tool Socket ---
    const prop3 = mk("g", { color: "#8A8275", opacity: "0.42" }, scenery);
    // Wall-side Function-Calling Tool Socket Stand (holding resting C-spanner wrench!)
    const toolRackGroup = mk("g", { transform: "translate(-21.5, 0)" }, prop3);
    mk("path", { d: "M -3.4,0 L -2.4,-2.0 L 2.4,-2.0 L 3.4,0 Z", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.95", "stroke-linejoin": "round" }, toolRackGroup);
    mk("rect", { x: "-1.5", y: "-13.6", width: "3.0", height: "11.6", rx: "0.6", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.0" }, toolRackGroup);
    mk("rect", { x: "-2.3", y: "-14.8", width: "4.6", height: "2.2", rx: "0.6", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.9" }, toolRackGroup);
    const rackPortLed = mk("circle", { cx: "0", cy: "-13.7", r: "0.75", fill: "#2D6A47", opacity: "0.75" }, toolRackGroup);
    // Resting C-spanner wrench docked horizontally on the socket stand
    const rackWrenchEl = mk("path", {
      d: "M 2.0,-14.8 L 5.6,-14.8 L 5.6,-13.6 L 3.6,-13.6 L 3.6,-11.6 L 5.6,-11.6 L 5.6,-10.4 L 2.0,-10.4 Z",
      fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.0", "stroke-linejoin": "round"
    }, toolRackGroup);
    // Bamboo plug-in click flash when robot snaps wrench onto forearm
    const toolSnapSpark = mk("g", { opacity: "0" }, toolRackGroup);
    mk("path", {
      d: "M 2,-16.8 L 2,-19.2 M 5.2,-15.8 L 7.2,-17.4 M -1.2,-15.8 L -3.2,-17.4",
      fill: "none", stroke: "#2D6A47", "stroke-width": "1.15", "stroke-linecap": "round"
    }, toolSnapSpark);
    // Slotted ground seam where wall retracts
    mk("line", { x1: "-10.5", y1: "0", x2: "10.5", y2: "0", stroke: "currentColor", "stroke-width": "1.1", "stroke-opacity": "0.45", "stroke-linecap": "round" }, prop3);
    const wallClipWrap = mk("g", { "clip-path": "url(#evo-wall-clip)" }, prop3);
    const wallBody = mk("g", null, wallClipWrap);
    // Main wall masonry mass
    mk("rect", {
      x: "-8", y: "-26.6", width: "16", height: "26.6", rx: "0.7",
      fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.2"
    }, wallBody);
    // Alternating warm stone-wash bricks for unmistakable masonry texture
    mk("rect", { x: "-7.5", y: "-26.1", width: "7.2", height: "4.4", fill: "#EDE8DE" }, wallBody);
    mk("rect", { x: "1.4", y: "-21.3", width: "6.1", height: "4.4", fill: "#EDE8DE" }, wallBody);
    mk("rect", { x: "-7.5", y: "-10.0", width: "5.8", height: "4.6", fill: "#EDE8DE" }, wallBody);
    mk("rect", { x: "0.6", y: "-5.1", width: "6.9", height: "4.8", fill: "#EDE8DE" }, wallBody);
    // Crisp staggered brick mortar courses
    mk("path", {
      d: "M -8,-21.4 L 8,-21.4 M -8,-16.7 L 8,-16.7 M -8,-10.2 L 8,-10.2 M -8,-5.2 L 8,-5.2 M 0,-26.6 L 0,-21.4 M -3.6,-21.4 L -3.6,-16.7 M 3.8,-21.4 L 3.8,-16.7 M -1.6,-10.2 L -1.6,-5.2 M 3.4,-10.2 L 3.4,-5.2 M -4.2,-5.2 L -4.2,0 M 0.6,-5.2 L 0.6,0",
      fill: "none", stroke: "currentColor", "stroke-width": "0.75", "stroke-opacity": "0.8"
    }, wallBody);
    // Beveled stone capstone header
    mk("rect", {
      x: "-8.7", y: "-28.6", width: "17.4", height: "2.3", rx: "0.6",
      fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "1.1"
    }, wallBody);
    // Recessed industrial cross-valve wheel at waist height (y = -13.6)
    mk("circle", { cx: "0", cy: "-13.6", r: "4.2", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.1" }, wallBody);
    mk("circle", { cx: "0", cy: "-13.6", r: "2.9", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.75", "stroke-opacity": "0.75" }, wallBody);
    const wallBolt = mk("g", null, wallBody);
    mk("line", { x1: "-2.7", y1: "-13.6", x2: "2.7", y2: "-13.6", stroke: "currentColor", "stroke-width": "1.2", "stroke-linecap": "round" }, wallBolt);
    mk("line", { x1: "0", y1: "-16.3", x2: "0", y2: "-10.9", stroke: "currentColor", "stroke-width": "1.2", "stroke-linecap": "round" }, wallBolt);
    mk("circle", { cx: "0", cy: "-13.6", r: "0.95", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "0.85" }, wallBolt);
    // Curved bamboo-green torque motion arcs with crisp arrowheads outside valve flange
    const wallTorqueArcs = mk("g", { opacity: "0" }, prop3);
    mk("path", {
      d: "M -4.6,-18.6 A 6.6,6.6 0 0,1 5.0,-18.2 M 3.6,-19.4 L 5.2,-18.0 L 3.4,-17.1 M 4.6,-8.6 A 6.6,6.6 0 0,1 -5.0,-9.0 M -3.6,-7.8 L -5.2,-9.2 L -3.4,-10.1",
      fill: "none", stroke: "#2D6A47", "stroke-width": "1.05", "stroke-linecap": "round", "stroke-linejoin": "round"
    }, wallTorqueArcs);
    // Vermilion bonk impact star-sparks positioned cleanly at forehead collision zone
    const wallSparks = mk("g", { opacity: "0" }, prop3);
    mk("line", { x1: "-9.2", y1: "-24.8", x2: "-14.2", y2: "-28.8", stroke: "#B83B2A", "stroke-width": "1.4", "stroke-linecap": "round" }, wallSparks);
    mk("line", { x1: "-9.6", y1: "-22.2", x2: "-15.4", y2: "-23.0", stroke: "#B83B2A", "stroke-width": "1.4", "stroke-linecap": "round" }, wallSparks);
    mk("line", { x1: "-9.0", y1: "-19.6", x2: "-13.6", y2: "-17.6", stroke: "#B83B2A", "stroke-width": "1.3", "stroke-linecap": "round" }, wallSparks);
    mk("circle", { cx: "-8.2", cy: "-22.4", r: "1.45", fill: "#B83B2A" }, wallSparks);
    // Retracting wall dust puffs at ground seam
    const wallDust = mk("g", { opacity: "0" }, prop3);
    mk("circle", { cx: "-9.5", cy: "-1.6", r: "1.35", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.7" }, wallDust);
    mk("circle", { cx: "9.5", cy: "-1.8", r: "1.25", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.7" }, wallDust);
    mk("circle", { cx: "-11.4", cy: "-3.2", r: "0.9", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.65" }, wallDust);
    mk("circle", { cx: "11.2", cy: "-3.4", r: "0.85", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.65" }, wallDust);

    // --- PROP 4 (Era 4 · 手眼脑通，状态机): State-Machine Terminal Gate (Micro-Screen + 3-State Flow + Boom) ---
    const prop4 = mk("g", { color: "#8A8275", opacity: "0.42" }, scenery);
    // Crisp dual-optic vision scan cone + twin laser rays projected from robot goggles to terminal screen
    const gateScanBeam = mk("g", { opacity: "0" }, prop4);
    mk("polygon", { points: "-13.2,-25.4 -3.8,-17.2 -3.8,-12.8", fill: "url(#evo-scan-beam)" }, gateScanBeam);
    mk("line", { x1: "-13.2", y1: "-25.4", x2: "-3.8", y2: "-17.2", stroke: "#2D6A47", "stroke-width": "0.9", "stroke-opacity": "0.85" }, gateScanBeam);
    mk("line", { x1: "-13.2", y1: "-25.4", x2: "-3.8", y2: "-12.8", stroke: "#2D6A47", "stroke-width": "0.9", "stroke-opacity": "0.75" }, gateScanBeam);
    mk("line", { x1: "-13.2", y1: "-25.4", x2: "-3.8", y2: "-15.0", stroke: "#2D6A47", "stroke-width": "0.75", "stroke-dasharray": "2 2", "stroke-opacity": "0.85" }, gateScanBeam);
    // Gate boom arm + counterweight pivoting cleanly at y = -11.0
    const gateArmGroup = mk("g", { transform: "rotate(0, 0, -11.0)" }, prop4);
    mk("rect", {
      x: "2.4", y: "-12.6", width: "3.8", height: "3.2", rx: "0.7",
      fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "1.0"
    }, gateArmGroup);
    mk("rect", {
      x: "-15.0", y: "-12.2", width: "17.4", height: "2.4", rx: "1.1",
      fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.05"
    }, gateArmGroup);
    mk("path", {
      d: "M -12.6,-12.1 L -11.2,-9.9 M -9.0,-12.1 L -7.6,-9.9 M -5.4,-12.1 L -4.0,-9.9",
      fill: "none", stroke: "currentColor", "stroke-width": "1.1", "stroke-linecap": "butt"
    }, gateArmGroup);
    // Ground plinth base
    mk("rect", {
      x: "-6.6", y: "-2.2", width: "13.2", height: "2.2", rx: "0.6",
      fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "1.05"
    }, prop4);
    // State-Machine Terminal housing
    mk("rect", {
      x: "-5.2", y: "-18.4", width: "10.4", height: "16.2", rx: "1.2",
      fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.15"
    }, prop4);
    mk("rect", {
      x: "2.6", y: "-17.7", width: "2.0", height: "14.8", rx: "0.4",
      fill: "#EDE8DE"
    }, prop4);
    // Embedded Computer-Use micro terminal screen (upper face)
    mk("rect", { x: "-3.8", y: "-17.1", width: "6.4", height: "4.2", rx: "0.8", fill: "#1D1B18" }, prop4);
    const gateScreenLines = mk("path", {
      d: "M -2.8,-15.6 L 1.4,-15.6 M -2.8,-14.3 L 0.2,-14.3",
      fill: "none", stroke: "#FAF8F4", "stroke-width": "0.85", "stroke-linecap": "round", opacity: "0.7"
    }, prop4);
    // Top plunger collar & depressible HITL checkpoint button
    mk("rect", {
      x: "-3.0", y: "-19.6", width: "6.0", height: "1.3", rx: "0.4",
      fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.85"
    }, prop4);
    const gateBtnEl = mk("rect", {
      x: "-2.2", y: "-21.6", width: "4.4", height: "2.1", rx: "0.8",
      fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.0"
    }, prop4);
    // Pivot axle pin
    mk("circle", { cx: "0", cy: "-11.0", r: "1.25", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "0.95" }, prop4);
    // 3-State Machine flow indicator (S1 — S2 — S3) in lower terminal window
    mk("line", { x1: "-2.8", y1: "-6.2", x2: "2.8", y2: "-6.2", stroke: "currentColor", "stroke-width": "0.75", "stroke-opacity": "0.55" }, prop4);
    const gateS1 = mk("circle", { cx: "-2.8", cy: "-6.2", r: "1.25", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.75" }, prop4);
    const gateS2 = mk("circle", { cx: "0", cy: "-6.2", r: "1.25", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.75" }, prop4);
    const gateS3 = mk("circle", { cx: "2.8", cy: "-6.2", r: "1.25", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.75" }, prop4);
    const gateSavedRipple = mk("circle", { cx: "2.8", cy: "-6.2", r: "2.2", fill: "none", stroke: "#2D6A47", "stroke-width": "0.95", opacity: "0" }, prop4);
    // Pill-framed stateless-interrupt freeze cue (||) above checkpoint button
    const gateFreezeBadge = mk("g", { opacity: "0" }, prop4);
    mk("rect", { x: "-4.6", y: "-28.8", width: "9.2", height: "5.8", rx: "2.0", fill: "#FAF8F4", stroke: "#2D6A47", "stroke-width": "0.85", "stroke-opacity": "0.6" }, gateFreezeBadge);
    mk("line", { x1: "-1.5", y1: "-27.4", x2: "-1.5", y2: "-24.4", stroke: "#2D6A47", "stroke-width": "1.4", "stroke-linecap": "round" }, gateFreezeBadge);
    mk("line", { x1: "1.5", y1: "-27.4", x2: "1.5", y2: "-24.4", stroke: "#2D6A47", "stroke-width": "1.4", "stroke-linecap": "round" }, gateFreezeBadge);

    // --- PROP 5 (Era 5 · 卷马具，进生产): Production Harness Launch Gantry (Docking Pad + Twin Rails + 3 Pre-Flight LEDs) ---
    const prop5 = mk("g", { color: "#8A8275", opacity: "0.42" }, scenery);
    // Soft holographic projection cone behind pad
    const padField = mk("polygon", {
      points: "-12.2,-3.6 -15.0,-29 15.0,-29 12.2,-3.6",
      fill: "url(#evo-pad-grad)",
      opacity: "0"
    }, prop5);
    // Ultra-slim twin vertical production launch gantry rails flanking docking pad
    mk("path", {
      d: "M -15.4,-7.6 L -15.4,-24.2 M -17.8,-7.6 L -17.8,-22.2 M -17.8,-13.0 L -15.4,-13.0 M -17.8,-18.0 L -15.4,-18.0 M 15.2,-7.6 L 15.2,-24.2 M 18.2,-7.6 L 18.2,-22.4 M 15.2,-13.0 L 18.2,-13.0 M 15.2,-18.0 L 18.2,-18.0",
      fill: "none", stroke: "currentColor", "stroke-width": "0.85", "stroke-linecap": "round"
    }, prop5);
    const gantryBeaconL = mk("circle", { cx: "-15.4", cy: "-25.2", r: "1.15", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.8" }, prop5);
    const gantryBeaconR = mk("circle", { cx: "15.2", cy: "-25.2", r: "1.15", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.8" }, prop5);
    // 3 Sequential Production Pre-Flight Check LEDs (Sandbox -> Evals -> HITL) centered in right gantry rail
    const padCheck1 = mk("circle", { cx: "16.7", cy: "-10.5", r: "1.15", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.75" }, prop5);
    const padCheck2 = mk("circle", { cx: "16.7", cy: "-15.5", r: "1.15", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.75" }, prop5);
    const padCheck3 = mk("circle", { cx: "16.7", cy: "-20.5", r: "1.15", fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.75" }, prop5);
    // Vertical alignment ticks + sweeping horizontal scan line + rising energy ellipse
    const padBeams = mk("g", { opacity: "0" }, prop5);
    mk("line", { x1: "-11.4", y1: "-6", x2: "-11.4", y2: "-27", stroke: "#2D6A47", "stroke-width": "0.8", "stroke-dasharray": "2 3" }, padBeams);
    mk("line", { x1: "11.4", y1: "-6", x2: "11.4", y2: "-27", stroke: "#2D6A47", "stroke-width": "0.8", "stroke-dasharray": "2 3" }, padBeams);
    const padScanLine = mk("line", { x1: "-12.4", y1: "-6", x2: "12.4", y2: "-6", stroke: "#2D6A47", "stroke-width": "1.05", "stroke-opacity": "0.75", "stroke-dasharray": "3 2", opacity: "0" }, prop5);
    const padEnergyRing = mk("ellipse", { cx: "0", cy: "-6", rx: "11.5", ry: "2.2", fill: "none", stroke: "#2D6A47", "stroke-width": "1.0", opacity: "0" }, prop5);
    // Stepped architectural docking deck
    mk("path", {
      d: "M -18.2,0 L -15.2,-3.6 L 15.2,-3.6 L 18.2,0 Z",
      fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.15", "stroke-linejoin": "round"
    }, prop5);
    mk("path", {
      d: "M -11.2,-3.6 L -9.6,-1.6 L 9.6,-1.6 L 11.2,-3.6 Z",
      fill: "#EDE8DE", stroke: "currentColor", "stroke-width": "0.8", "stroke-linejoin": "round"
    }, prop5);
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
    let traceIdx = 0;
    let traceCooldown = 0;

    // Era 1 Mode B ink skid-dashes during long belly-slide
    const skidPool = [];
    for (let i = 0; i < 5; i++) {
      const ln = mk("line", { x1: "0", y1: String(BASE_Y - 1.2), x2: "0", y2: String(BASE_Y - 1.2), stroke: "#1D1B18", "stroke-width": "1.0", "stroke-linecap": "round", opacity: "0" }, scenery);
      skidPool.push({ el: ln, x: 0, yOff: 0, life: 0 });
    }
    let skidIdx = 0;
    let skidCooldown = 0;

    // =====================================================================
    // LAYER 2: THE EVOLVING INK-AND-WASH ROBOT (Crisp Mechanical Anatomy)
    // =====================================================================
    const botGroup = mk("g", { class: "evo-bot-hit" }, svg);
    mk("rect", { x: "-17", y: "-40", width: "34", height: "42", fill: "transparent" }, botGroup);

    const shadowEl = mk("ellipse", { cx: "0", cy: "0.4", rx: "6.8", ry: "1.35", fill: "#1D1B18", "fill-opacity": "0.14" }, botGroup);

    // Stage 1 Vermilion trip `!` burst (stays upright with crisp clearance above tumbling body)
    const stuckBang = mk("g", { opacity: "0" }, botGroup);
    mk("line", { x1: "0", y1: "-27.0", x2: "0", y2: "-21.8", stroke: "#B83B2A", "stroke-width": "1.65", "stroke-linecap": "round" }, stuckBang);
    mk("circle", { cx: "0", cy: "-19.5", r: "1.05", fill: "#B83B2A" }, stuckBang);

    // Rotatable body wrapper (enables clean belly-slide & recovery)
    const botBody = mk("g", null, botGroup);

    // Stage 1: Compact vintage wind-up key on back (with collar + sculpted bow)
    const keyGroup = mk("g", { opacity: "1" }, botBody);
    mk("rect", { x: "-6.4", y: "-5.2", width: "1.4", height: "2.0", rx: "0.45", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.85" }, keyGroup);
    mk("line", { x1: "-6.4", y1: "-4.2", x2: "-8.9", y2: "-4.2", stroke: "#1D1B18", "stroke-width": "1.1", "stroke-linecap": "round" }, keyGroup);
    const keyLoop = mk("ellipse", { cx: "-10.1", cy: "-4.2", rx: "1.45", ry: "2.65", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.05" }, keyGroup);
    const keyInner = mk("ellipse", { cx: "-10.1", cy: "-4.2", rx: "0.6", ry: "1.25", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.65", "stroke-opacity": "0.55" }, keyGroup);

    // Back leg + capsule back foot + Stage 5 back boot + back arm
    const backLeg = mk("path", { fill: "none", stroke: "#1D1B18", "stroke-width": "1.25", "stroke-linecap": "round", "stroke-linejoin": "round" }, botBody);
    const backFoot = mk("path", { fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "1.0", "stroke-linejoin": "round" }, botBody);
    const bootB = mk("path", { d: "M -1.7,-4.0 L 1.6,-4.0 L 2.5,0 L -1.9,0 Z", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "1.0", "stroke-linejoin": "round", opacity: "0" }, botBody);
    const backArm = mk("path", { fill: "none", stroke: "#1D1B18", "stroke-width": "1.15", "stroke-linecap": "round", "stroke-linejoin": "round" }, botBody);
    const gauntletB = mk("rect", { x: "-2.0", y: "-2.1", width: "4.0", height: "3.1", rx: "0.85", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "1.0", opacity: "0" }, botBody);

    // Torso group (neck + pelvis + sculpted chassis with warm stone bevel + Stage 5 Modular Armor)
    const torsoGroup = mk("g", null, botBody);
    // Stage 5: Modular Skills Jetpack mounted behind torso
    const jetpackEl = mk("g", { opacity: "0" }, torsoGroup);
    mk("rect", { x: "-8.6", y: "-10.1", width: "4.6", height: "8.2", rx: "1.2", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.1" }, jetpackEl);
    mk("rect", { x: "-8.2", y: "-9.6", width: "1.7", height: "7.2", rx: "0.5", fill: "#EDE8DE" }, jetpackEl);
    mk("path", { d: "M -7.4,-7.5 L -5.0,-7.5 M -7.4,-5.1 L -5.0,-5.1 M -7.8,-1.9 L -8.4,0.6 L -6.5,0.6 L -6.3,-1.9 M -5.9,-1.9 L -5.7,0.6 L -4.1,0.6 L -4.6,-1.9", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.85", "stroke-linecap": "round", "stroke-linejoin": "round" }, jetpackEl);
    // Stage 1: Retro tin-toy top lid + micro gauge (fades smoothly as CRT head emerges in Era 2)
    const rpaTopCap = mk("g", { opacity: "1" }, torsoGroup);
    mk("rect", { x: "-4.6", y: "-9.1", width: "9.2", height: "1.5", rx: "0.65", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "1.0" }, rpaTopCap);
    mk("circle", { cx: "0", cy: "-9.6", r: "0.9", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.85" }, rpaTopCap);
    // Mechanical neck collar connecting torso to CRT head
    const neckEl = mk("g", { opacity: "0" }, torsoGroup);
    mk("rect", { x: "-1.9", y: "-12.2", width: "3.8", height: "2.4", rx: "0.6", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.95" }, neckEl);
    mk("line", { x1: "-1.4", y1: "-11.0", x2: "1.4", y2: "-11.0", stroke: "#1D1B18", "stroke-width": "0.65", "stroke-opacity": "0.55" }, neckEl);
    // Sleek mechanical waist / hip band (grounds IK legs cleanly without crowding knees)
    const pelvisEl = mk("path", { fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.95", "stroke-linejoin": "round" }, torsoGroup);
    // Sculpted main chassis torso + subtle warm stone bevel
    const torsoEl = mk("path", { fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.25", "stroke-linejoin": "round" }, torsoGroup);
    const torsoShade = mk("path", { fill: "#EDE8DE", "fill-opacity": "0.85" }, torsoGroup);
    const chestPanel = mk("path", { fill: "none", stroke: "#1D1B18", "stroke-width": "0.8", "stroke-opacity": "0.58", "stroke-linecap": "round" }, torsoGroup);
    const chestLed = mk("circle", { cx: "1.6", cy: "-5.2", r: "0.8", fill: "#2D6A47", opacity: "0" }, torsoGroup);
    // Stage 5: Chamfered Mech Shoulder Pauldrons
    const shoulderArmorEl = mk("g", { opacity: "0" }, torsoGroup);
    mk("path", { d: "M -5.8,-10.8 L 5.8,-10.8 L 6.8,-8.2 L -6.8,-8.2 Z", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.1", "stroke-linejoin": "round" }, shoulderArmorEl);
    mk("path", { d: "M -4.2,-10.6 L -4.8,-8.4 M 4.2,-10.6 L 4.8,-8.4", fill: "none", stroke: "#1D1B18", "stroke-width": "0.75", "stroke-opacity": "0.5" }, shoulderArmorEl);
    // Stage 5: X-shaped Harness straps + Bamboo Arc Core Glow + Double Ripple
    const harnessGroup = mk("g", { opacity: "0" }, torsoGroup);
    const harnessX1 = mk("line", { stroke: "#1D1B18", "stroke-width": "1.0", "stroke-linecap": "round" }, harnessGroup);
    const harnessX2 = mk("line", { stroke: "#1D1B18", "stroke-width": "1.0", "stroke-linecap": "round" }, harnessGroup);
    const harnessGlow = mk("circle", { r: "5.2", fill: "url(#evo-arc-glow)" }, harnessGroup);
    const harnessClaspOuter = mk("circle", { r: "2.3", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.85" }, harnessGroup);
    const harnessClasp = mk("circle", { r: "1.45", fill: "#2D6A47" }, harnessGroup);
    const harnessRipple = mk("circle", { r: "2", fill: "none", stroke: "#2D6A47", "stroke-width": "1.05", opacity: "0" }, harnessGroup);
    const harnessRipple2 = mk("circle", { r: "2", fill: "none", stroke: "#1D1B18", "stroke-width": "0.75", opacity: "0" }, harnessGroup);

    // Front leg + subtle mechanical knee joint rivets + sleek capsule front foot + Stage 5 front boot
    const kneeJoint2 = mk("circle", { r: "0.85", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.8", opacity: "0" }, botBody);
    const frontLeg = mk("path", { fill: "none", stroke: "#1D1B18", "stroke-width": "1.3", "stroke-linecap": "round", "stroke-linejoin": "round" }, botBody);
    const frontFoot = mk("path", { fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.05", "stroke-linejoin": "round" }, botBody);
    const kneeJoint1 = mk("circle", { r: "0.95", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.85", opacity: "0" }, botBody);
    const bootF = mk("path", { d: "M -1.7,-4.1 L 1.8,-4.1 L 2.8,0 L -1.9,0 Z", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.05", "stroke-linejoin": "round", opacity: "0" }, botBody);

    // Robot Head group (boxy CRT chassis + expressive visor + antenna + Stage 5 Mech Crest)
    const headGroup = mk("g", { opacity: "0" }, botBody);
    const antGroup = mk("g", null, headGroup);
    mk("rect", { x: "-1.9", y: "-5.5", width: "2.2", height: "1.1", rx: "0.4", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.8" }, antGroup);
    mk("line", { x1: "-0.8", y1: "-5.5", x2: "-1.4", y2: "-8.9", stroke: "#1D1B18", "stroke-width": "1.15", "stroke-linecap": "round" }, antGroup);
    const antTip = mk("circle", { cx: "-1.5", cy: "-9.6", r: "1.3", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.05" }, antGroup);
    // Era 2 CoT antenna idea-rays
    const cotHeadSpark = mk("g", { opacity: "0" }, antGroup);
    mk("path", {
      d: "M -1.5,-12.0 L -1.5,-13.6 M -4.0,-11.0 L -5.2,-12.2 M 1.0,-11.0 L 2.2,-12.2",
      fill: "none", stroke: "#2D6A47", "stroke-width": "1.05", "stroke-linecap": "round"
    }, cotHeadSpark);
    // Ear-bolt pods
    mk("rect", { x: "-6.9", y: "-1.6", width: "1.7", height: "3.4", rx: "0.65", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.95" }, headGroup);
    mk("rect", { x: "5.2", y: "-1.6", width: "1.4", height: "3.2", rx: "0.6", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.9" }, headGroup);
    // Boxy CRT head dome + subtle bottom-left warm stone shading
    mk("rect", { x: "-5.7", y: "-4.7", width: "11.4", height: "9.0", rx: "2.6", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.3" }, headGroup);
    mk("path", { d: "M -5.0,2.2 Q -5.0,3.8 -3.0,3.8 L 3.4,3.8 Q 4.8,3.8 5.0,2.6 L 5.0,1.8 L -5.0,1.8 Z", fill: "#EDE8DE", "fill-opacity": "0.7" }, headGroup);
    // Stage 1-3 single-eye visor screen + glass glint
    const visorScreen = mk("rect", { x: "-1.8", y: "-2.8", width: "6.6", height: "4.8", rx: "1.5", fill: "#1D1B18" }, headGroup);
    const visorGlint1 = mk("line", { x1: "-0.7", y1: "-1.8", x2: "0.2", y2: "-1.8", stroke: "#FAF8F4", "stroke-width": "0.7", "stroke-opacity": "0.35", "stroke-linecap": "round" }, headGroup);
    const eyeEl = mk("circle", { cx: "2.3", cy: "-0.4", r: "1.15", fill: "#FAF8F4" }, headGroup);
    // Expressive wince eye (> < / ×) for Era 1 trip & Era 3 bonk
    const eyeWince = mk("path", {
      d: "M 1.4,-1.2 L 3.1,0.4 M 3.1,-1.2 L 1.4,0.4",
      fill: "none", stroke: "#FAF8F4", "stroke-width": "1.0", "stroke-linecap": "round", opacity: "0"
    }, headGroup);
    // Stage 4-5 panoramic dual-optic visor
    const gogglesEl = mk("rect", {
      x: "-2.4", y: "-3.1", width: "7.8", height: "5.2", rx: "1.7",
      fill: "#1D1B18", stroke: "#1D1B18", "stroke-width": "0.95", opacity: "0"
    }, headGroup);
    const visorGlint2 = mk("line", { x1: "-1.2", y1: "-2.0", x2: "-0.1", y2: "-2.0", stroke: "#FAF8F4", "stroke-width": "0.7", "stroke-opacity": "0.32", "stroke-linecap": "round", opacity: "0" }, headGroup);
    const goggleEye = mk("g", { opacity: "0" }, headGroup);
    const gEyeL = mk("circle", { cx: "0.3", cy: "-0.5", r: "1.1", fill: "#FAF8F4" }, goggleEye);
    const gEyeR = mk("circle", { cx: "3.4", cy: "-0.5", r: "1.1", fill: "#FAF8F4" }, goggleEye);
    // Stage 5: Sleek Mech V-Crest & Side Ear-Fin (original design preserved!)
    const headCrestEl = mk("g", { opacity: "0" }, headGroup);
    mk("path", { d: "M -4.4,-4.6 L 0.4,-7.3 L 5.0,-4.6 M -6.9,-2.2 L -8.8,-4.3 L -6.5,0.8", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.1", "stroke-linecap": "round", "stroke-linejoin": "round" }, headCrestEl);

    // Front arm + shoulder socket rivet + mechanical hand caps + attachments + Stage 5 Repulsor Gauntlets + Luminous Jets
    const frontArm = mk("path", { fill: "none", stroke: "#1D1B18", "stroke-width": "1.25", "stroke-linecap": "round", "stroke-linejoin": "round" }, botBody);
    const shoulderPin = mk("circle", { r: "1.1", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.85" }, botBody);
    const handTipB = mk("circle", { r: "1.05", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.85", opacity: "0" }, botBody);
    const handTipF = mk("circle", { r: "1.15", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.9", opacity: "0" }, botBody);
    const pincerEl = mk("path", { fill: "none", stroke: "#1D1B18", "stroke-width": "1.2", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: "1" }, botBody);
    const wrenchEl = mk("path", { fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.1", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: "0" }, botBody);
    const gauntletF = mk("g", { opacity: "0" }, botBody);
    mk("rect", { x: "-2.0", y: "-2.1", width: "4.0", height: "3.1", rx: "0.85", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.05" }, gauntletF);
    mk("line", { x1: "-1.0", y1: "-0.5", x2: "1.0", y2: "-0.5", stroke: "#2D6A47", "stroke-width": "0.85", "stroke-linecap": "round" }, gauntletF);
    const repulsorJets = mk("g", { opacity: "0" }, botBody);
    const leftPalmJet = mk("path", { fill: "url(#evo-jet-grad)" }, repulsorJets);
    const leftPalmCore = mk("path", { fill: "#E6FFF1", "fill-opacity": "0.92" }, repulsorJets);
    const rightPalmJet = mk("path", { fill: "url(#evo-jet-grad)" }, repulsorJets);
    const rightPalmCore = mk("path", { fill: "#E6FFF1", "fill-opacity": "0.92" }, repulsorJets);
    const packJet = mk("path", { fill: "url(#evo-jet-grad)", opacity: "0.75" }, repulsorJets);
    const bootJetF = mk("path", { fill: "url(#evo-jet-grad)" }, repulsorJets);
    const bootJetB = mk("path", { fill: "url(#evo-jet-grad)", opacity: "0.8" }, repulsorJets);
    const palmEmitterL = mk("circle", { r: "1.5", fill: "#B5F5D4", stroke: "#2D6A47", "stroke-width": "0.6" }, repulsorJets);
    const palmEmitterR = mk("circle", { r: "1.5", fill: "#B5F5D4", stroke: "#2D6A47", "stroke-width": "0.6" }, repulsorJets);

    // Stage 5 Converging Modular Parts Layer (7 sculpted pieces flying in from all directions!)
    const assembleLayer = mk("g", { opacity: "0" }, botGroup);
    const FLY_SPECS = [
      // Wave 1: Sculpted Thruster Boots from lower-left & lower-right
      { t0: 0.06, t1: 0.34, sx: -44, sy: -8,  cx: -22, cy: -16, tx: -3.0, ty: -4,   rot0: -38, d: "M -2.0,-4.0 L 1.8,-4.0 L 2.6,0 L -2.0,0 Z M -1.2,-2.0 L 1.4,-2.0" },
      { t0: 0.08, t1: 0.36, sx: 44,  sy: -8,  cx: 22,  cy: -16, tx: 3.0,  ty: -4,   rot0: 38,  d: "M -2.0,-4.0 L 2.0,-4.0 L 2.8,0 L -2.0,0 Z M -1.2,-2.0 L 1.6,-2.0" },
      // Wave 2: Beveled Repulsor Gauntlets from mid-left & mid-right
      { t0: 0.22, t1: 0.52, sx: -48, sy: -19, cx: -24, cy: -24, tx: -6.8, ty: -18,  rot0: -48, d: "M -2.4,-2.1 L 2.4,-2.1 L 2.0,1.4 L -2.0,1.4 Z M -1.2,-0.5 L 1.2,-0.5" },
      { t0: 0.24, t1: 0.54, sx: 48,  sy: -19, cx: 24,  cy: -24, tx: 6.8,  ty: -18,  rot0: 48,  d: "M -2.4,-2.1 L 2.4,-2.1 L 2.0,1.4 L -2.0,1.4 Z M -1.2,-0.5 L 1.2,-0.5" },
      // Wave 3: Twin-Nozzle Skills Jetpack (upper-left) + Chamfered Shoulder Pauldrons (upper-right)
      { t0: 0.40, t1: 0.72, sx: -38, sy: -42, cx: -21, cy: -34, tx: -6.2, ty: -22,  rot0: -26, d: "M -2.4,-4.2 L 2.4,-4.2 L 2.4,3.4 L -2.4,3.4 Z M -1.4,-1.8 L 1.4,-1.8 M -1.4,0.8 L 1.4,0.8 M -2.0,3.4 L -2.5,5.2 L -0.6,5.2 L -0.4,3.4 M 0.4,3.4 L 0.6,5.2 L 2.5,5.2 L 2.0,3.4" },
      { t0: 0.42, t1: 0.72, sx: 38,  sy: -44, cx: 20,  cy: -35, tx: 0,    ty: -25.5,rot0: 24,  d: "M -5.8,-1.5 L 5.8,-1.5 L 6.8,1.3 L -6.8,1.3 Z M -4.2,-1.4 L -4.8,1.2 M 4.2,-1.4 L 4.8,1.2" },
      // Wave 4: Mech Head V-Crest from straight above!
      { t0: 0.60, t1: 0.88, sx: 0,   sy: -58, cx: 4,   cy: -45, tx: 0.4,  ty: -36.5,rot0: 0,   d: "M -4.6,1.3 L 0.4,-1.8 L 5.2,1.3" }
    ];
    const flyParts = FLY_SPECS.map((sp, idx) => {
      const trail = mk("line", { stroke: "#2D6A47", "stroke-width": "1.15", "stroke-opacity": "0.62", "stroke-dasharray": "4 2", "stroke-linecap": "round", opacity: "0" }, assembleLayer);
      const piece = mk("g", { opacity: "0" }, assembleLayer);
      mk("path", { d: sp.d, fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.1", "stroke-linejoin": "round", "stroke-linecap": "round" }, piece);
      if (idx === 2 || idx === 3 || idx === 5) {
        mk("circle", { cx: "0", cy: idx === 5 ? "0" : "-0.4", r: "0.95", fill: "#2D6A47" }, piece);
      }
      return { sp, trail, piece };
    });
    // System-Online 4-corner lock flash ticks
    const lockSparks = mk("g", { opacity: "0" }, botGroup);
    mk("path", {
      d: "M -12,-28 L -15,-31 M 12,-28 L 15,-31 M -12,-10 L -15,-7 M 12,-10 L 15,-7",
      fill: "none", stroke: "#2D6A47", "stroke-width": "1.25", "stroke-linecap": "round"
    }, lockSparks);

    // Click happy hop spark
    const clickSpark = mk("g", { opacity: "0" }, botGroup);
    mk("line", { x1: "0", y1: "-35", x2: "0", y2: "-39", stroke: "#2D6A47", "stroke-width": "1.2", "stroke-linecap": "round" }, clickSpark);
    mk("line", { x1: "-4.5", y1: "-34", x2: "-7.5", y2: "-37", stroke: "#2D6A47", "stroke-width": "1.2", "stroke-linecap": "round" }, clickSpark);
    mk("line", { x1: "4.5", y1: "-34", x2: "7.5", y2: "-37", stroke: "#2D6A47", "stroke-width": "1.2", "stroke-linecap": "round" }, clickSpark);

    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const smooth = (a, b, x) => {
      const t = clamp01((x - a) / (b - a));
      return t * t * (3 - 2 * t);
    };
    const lerp = (a, b, t) => a + (b - a) * t;

    // Smooth RGB ink color interpolation (#8A8275 muted -> #1D1B18 primary ink)
    const lerpInk = (t) => {
      const r = Math.round(lerp(138, 29, t));
      const g = Math.round(lerp(130, 27, t));
      const b = Math.round(lerp(117, 24, t));
      return `rgb(${r},${g},${b})`;
    };

    function solveKnee(hx, hy, fx, fy, l1, l2) {
      const dx = fx - hx;
      const dy = fy - hy;
      const d = Math.max(0.5, Math.min(l1 + l2 - 0.1, Math.hypot(dx, dy)));
      const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
      const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
      const mx = hx + (a * dx) / d;
      const my = hy + (a * dy) / d;
      return { x: mx + (h * dy) / d, y: my - (h * dx) / d };
    }

    // 2-bone elbow solver (bends slightly backward/downward for crisp mechanical arm silhouette)
    function solveElbow(sx, sy, hx, hy, bendDir) {
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

    function footPose(phase, strideLen, liftH) {
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

    // Solid capsule mechanical foot path seated cleanly on y = ground
    function capsuleFootPath(fx, fy, len, pitch) {
      const dy = pitch * len;
      const backX = fx - 0.9;
      const toeX = fx + len;
      const toeY = fy + dy;
      const topY = fy - 1.25;
      const toeTopY = toeY - 1.1;
      return `M ${backX.toFixed(1)},${fy.toFixed(1)} L ${toeX.toFixed(1)},${toeY.toFixed(1)} Q ${(toeX + 0.6).toFixed(1)},${(toeY - 0.55).toFixed(1)} ${(toeX - 0.4).toFixed(1)},${toeTopY.toFixed(1)} L ${(backX + 0.2).toFixed(1)},${topY.toFixed(1)} Z`;
    }

    // Cycle state
    let posX = 16;
    let phase = 0;
    let keyPhase = 0;
    let lastTime = performance.now();
    let blinkTimer = 3.0;
    let isBlinking = false;
    let clickHopTimer = 0;
    let resetWaitTimer = 0;

    // 5-beat state machine per cycle
    let b1 = 0, b1t = 0; // Era 1 pebble: 0=jog, 1=trip, 2=long belly-slide into Era 2, 3=pop up, 4=done
    let b2 = 0, b2t = 0; // Era 2 desk:   0=approach, 1=read+CoT(0.95s), 2=done
    let b3 = 0, b3t = 0; // Era 3 wall:   0=approach, 1=bonk+recoil+wrench+turn+sink(1.42s), 2=done
    let b4 = 0, b4t = 0; // Era 4 gate:   0=approach, 1=press+0.25s freeze+lift(1.02s), 2=done
    let b5 = 0, b5t = 0; // Era 5 pad:    0=approach, 1=dock harness(1.22s), 2=walk to launch pad, 3=ignition & liftoff, 4=airborne handoff (waiting for dock)
    let waitingForDock = false;
    let handoffStarted = false;
    let handoffTrailT = 0;

    AgentBlog.onMechDocked = () => {
      if (waitingForDock) {
        waitingForDock = false;
        resetWaitTimer = 2.6;
      }
    };

    let wallSink = 0;    // 0..27px sunk into ground (persists until cycle reset)
    let wallBoltDeg = 0; // 0..90 deg
    let gateAngle = 0;   // 0..76 deg raised (persists until cycle reset)
    let hasBrain = false;   // Physical brain docked from Era 2 Glass Vat!
    let hasWrench = false;  // Physical C-spanner plugged from Era 3 Tool Socket!
    let isEquipped = false;
    let claspRippleTimer = 0;
    let lockSparkTimer = 0;
    let gateRippleTimer = 0;
    let brainDockTimer = 0;
    let toolSnapTimer = 0;

    function resetCycle(startX) {
      posX = startX;
      phase = 0;
      b1 = b2 = b3 = b4 = b5 = 0;
      b1t = b2t = b3t = b4t = b5t = 0;
      wallSink = 0;
      wallBoltDeg = 0;
      gateAngle = 0;
      hasBrain = false;
      hasWrench = false;
      isEquipped = false;
      claspRippleTimer = 0;
      lockSparkTimer = 0;
      gateRippleTimer = 0;
      brainDockTimer = 0;
      toolSnapTimer = 0;
      resetWaitTimer = 0;
      waitingForDock = false;
      handoffStarted = false;
      handoffTrailT = 0;
      skidPool.forEach((p) => { p.life = 0; p.el.setAttribute("opacity", "0"); });
      launchShock.setAttribute("opacity", "0");
      sonicRing.setAttribute("opacity", "0");
      launchTrail.setAttribute("opacity", "0");
      launchTrailL.setAttribute("opacity", "0");
      launchTrailR.setAttribute("opacity", "0");
      assembleLayer.setAttribute("opacity", "0");
      lockSparks.setAttribute("opacity", "0");
    }

    botGroup.addEventListener("click", (e) => {
      e.stopPropagation();
      clickHopTimer = 0.5;
    });

    function tick(now) {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      if (!AgentBlog.getView || AgentBlog.getView() === "home") {
        const w = evoLayerEl.clientWidth || 1280;
        const startX = 14;
        const endX = Math.max(240, w - 18);
        const span = endX - startX;

        // 5 Concrete prop anchor X positions (centered in each era column)
        const x1 = startX + span * 0.11; // Stone Cluster
        const x2 = startX + span * 0.31; // Study Desk
        const x3 = startX + span * 0.51; // Brick Barrier Wall
        const x4 = startX + span * 0.71; // Checkpoint Gate
        const x5 = startX + span * 0.89; // Harness Docking Pad

        // End-of-cycle breath pause before respawning cleanly
        if (resetWaitTimer > 0) {
          resetWaitTimer = Math.max(0, resetWaitTimer - dt);
          botGroup.setAttribute("opacity", "0");
          if (resetWaitTimer <= 0) resetCycle(startX);
          requestAnimationFrame(tick);
          return;
        }

        const progress = clamp01((posX - startX) / span);
        const evo = progress * 4.0; // 0..4 across 5 eras

        // Dramatic speed curve (Era 1 brisk jog -> Era 2 steady -> Era 3 sprint -> Era 4 measured -> Era 5 heroic stride)
        const baseSpeed =
          evo < 0.85
            ? 74
            : evo < 1.75
            ? 54
            : evo < 2.65
            ? 82
            : evo < 3.45
            ? 64
            : 58;

        const launchX = Math.max(x5 + 34, endX - 24);

        // Trigger each era's silent-film beat once per cycle
        if (b1 === 0 && posX >= x1 - 7.5) { b1 = 1; b1t = 0; }
        if (b2 === 0 && posX >= x2 - 18.0){ b2 = 1; b2t = 0; }
        if (b3 === 0 && posX >= x3 - 13.0){ b3 = 1; b3t = 0; }
        if (b4 === 0 && posX >= x4 - 17.0){ b4 = 1; b4t = 0; }
        if (b5 === 0 && posX >= x5 - 1)   { b5 = 1; b5t = 0; }
        if (b5 === 2 && posX >= launchX)  { b5 = 3; b5t = 0; }

        let moveSpeed = baseSpeed;
        let visualDX = 0;
        let beatHopH = 0;
        let extraLean = 0;
        let freezeAll = false;
        let headNodDeg = 0;
        let armPose = "walk"; // "walk" | "cot" | "bonk" | "wrench" | "press" | "dock" | "launch"
        let pincerSnap = 0;
        let bodyRollDeg = 0;
        let bodyDropY = 0;
        let isSliding = false;
        let launchLiftY = 0;
        let crouchY = 0;
        let jetPower = 0;

        if (b1 === 0) {
          // Era 1: brisk light jog approach
          extraLean = 10;
        }

        if (clickHopTimer > 0 && b5 !== 3) {
          clickHopTimer = Math.max(0, clickHopTimer - dt);
          moveSpeed = 0;
          beatHopH = Math.sin((clickHopTimer / 0.5) * Math.PI) * 7.5;
        } else if (b1 === 1) {
          // Era 1 Step 1: Jog-trip over stone cluster, pitching cleanly into flat Superman belly-slide above spine
          b1t += dt;
          const u = clamp01(b1t / 0.22);
          posX += 116 * dt;
          moveSpeed = 0;
          beatHopH = Math.sin(u * Math.PI) * 6.8;
          bodyRollDeg = u * 78;
          bodyDropY = -u * 2.4;
          pincerSnap = 0.9;
          if (b1t >= 0.22) { b1 = 2; b1t = 0; }
        } else if (b1 === 2) {
          // Era 1 Step 2: Long friction belly-slide strictly flush atop the timeline spine (never below y=0!)
          b1t += dt;
          const slideTargetX = startX + span * 0.225;
          const u = clamp01(b1t / 1.15);
          const slideSpeed = lerp(142, 36, u * u);
          posX += slideSpeed * dt;
          moveSpeed = 0;
          bodyRollDeg = 78;
          bodyDropY = -2.6;
          isSliding = true;
          if (posX >= slideTargetX || b1t >= 1.20) { b1 = 3; b1t = 0; }
        } else if (b1 === 3) {
          // Era 1 Step 3: Pop cleanly upright inside Era 2
          b1t += dt;
          const u = clamp01(b1t / 0.34);
          const ease = u * u * (3 - 2 * u);
          posX += lerp(30, 54, ease) * dt;
          moveSpeed = lerp(30, 54, ease);
          bodyRollDeg = lerp(78, 0, ease);
          bodyDropY = lerp(-2.6, 0, ease);
          beatHopH = Math.sin(u * Math.PI) * 3.0;
          if (b1t >= 0.34) b1 = 4;
        } else if (b2 === 1) {
          // Era 2 Beat (缸中之脑，会推理): Bell-jar opens -> CRT brain arcs onto neck -> 3-step CoT chain lights up!
          b2t += dt;
          moveSpeed = 0;
          if (b2t < 0.72) {
            extraLean = 4;
            armPose = "walk";
          } else {
            if (!hasBrain) {
              hasBrain = true;
              brainDockTimer = 0.28;
            }
            armPose = "cot";
            extraLean = 4;
            headNodDeg = b2t > 1.04 ? Math.sin((b2t - 1.04) * 18) * 9 : 4;
          }
          if (b2t >= 1.38) b2 = 2;
        } else if (b3 === 1) {
          // Era 3 Beat (撞墙试错，接工具): BONK -> recoil cleanly LEFT of Tool Socket -> snap C-spanner -> turn valve 90° -> wall sinks!
          b3t += dt;
          moveSpeed = 0;
          if (b3t < 0.36) {
            const u = b3t / 0.36;
            visualDX = -Math.sin(u * Math.PI * 0.5) * 16.5;
            extraLean = -44 * (1 - u * 0.35);
            beatHopH = Math.sin(u * Math.PI) * 1.8;
            armPose = "bonk";
          } else if (b3t < 0.74) {
            // Stand cleanly LEFT of Tool Socket (x3 - 29.5 vs rack at x3 - 21.5) & reach forward to plug in C-spanner!
            visualDX = -16.5;
            extraLean = 6;
            armPose = "grabTool";
            if (b3t >= 0.54 && !hasWrench) {
              hasWrench = true;
              toolSnapTimer = 0.28;
            }
          } else if (b3t < 1.00) {
            // Step forward up to brick wall with newly plugged wrench
            const u = (b3t - 0.74) / 0.26;
            visualDX = lerp(-16.5, -4.0, u);
            extraLean = 5;
            armPose = "wrench";
          } else if (b3t < 1.32) {
            // Turn cross-valve 90°
            const u = (b3t - 1.00) / 0.32;
            visualDX = -4.0;
            extraLean = 5;
            armPose = "wrench";
            wallBoltDeg = u * 90;
          } else {
            // Brick wall sinks cleanly into ground seam
            const u = clamp01((b3t - 1.32) / 0.38);
            const ease = u * u * (3 - 2 * u);
            visualDX = -4.0;
            extraLean = 2;
            armPose = "wrench";
            wallBoltDeg = 90;
            wallSink = ease * 27;
          }
          if (b3t >= 1.70) {
            wallSink = 27;
            b3 = 2;
          }
        } else if (b4 === 1) {
          // Era 4 Beat (手眼脑通，状态机): Dual-optic scan terminal (S1) -> press plunger (S2) -> 0.28s || freeze -> S3 & boom lift 76°
          b4t += dt;
          moveSpeed = 0;
          if (b4t < 0.34) {
            armPose = "scan";
          } else if (b4t < 0.56) {
            armPose = "press";
          } else if (b4t < 0.84) {
            armPose = "press";
            freezeAll = true;
          } else {
            if (gateRippleTimer <= 0 && b4t < 0.92) gateRippleTimer = 0.52;
            const u = clamp01((b4t - 0.84) / 0.44);
            const ease = 1 - Math.pow(1 - u, 3);
            gateAngle = ease * 76;
            armPose = "walk";
          }
          if (b4t >= 1.28) {
            gateAngle = 76;
            b4 = 2;
          }
        } else if (b5 === 1) {
          // Era 5 Beat A: Modular Armor Convergence (7 pieces fly in & lock on!)
          b5t += dt;
          moveSpeed = 0;
          armPose = "dock";
          const waveImpacts = [0.34, 0.52, 0.72, 0.88];
          let recoil = 0;
          for (let i = 0; i < waveImpacts.length; i++) {
            const d = b5t - waveImpacts[i];
            if (d >= 0 && d < 0.12) recoil += Math.sin((d / 0.12) * Math.PI) * 1.35;
          }
          crouchY = recoil;
          if (b5t >= 0.88 && !isEquipped) {
            isEquipped = true;
            claspRippleTimer = 0.72;
            lockSparkTimer = 0.28;
          }
          if (b5t >= 0.88) {
            headNodDeg = Math.sin(clamp01((b5t - 0.88) / 0.30) * Math.PI) * 9;
          }
          if (b5t >= 1.22) b5 = 2;
        } else if (b5 === 3) {
          // Era 5 Beat B: Palms-down repulsor ignition -> hover -> seamless single-robot liftoff inside viewport!
          b5t += dt;
          moveSpeed = 0;
          armPose = "launch";
          const alreadyDocked = !!(AgentBlog.isAvatarDocked && AgentBlog.isAvatarDocked());
          if (b5t < 0.34) {
            const u = clamp01(b5t / 0.34);
            crouchY = Math.sin(u * Math.PI * 0.5) * 2.8;
            jetPower = u * 0.9;
          } else if (b5t < 0.64) {
            const u = clamp01((b5t - 0.34) / 0.30);
            crouchY = lerp(2.8, 0, clamp01(u * 3));
            const ease = 1 - Math.pow(1 - u, 3);
            launchLiftY = ease * 13.0 + Math.sin(u * Math.PI * 2.5) * 0.5;
            jetPower = 1.0 + u * 0.35;
          } else if (!alreadyDocked) {
            // Cycle 1 Hero Liftoff: ZERO off-screen exit! Hand off exact screen coords to the SAME robot in mech-avatar.js!
            crouchY = 0;
            launchLiftY = 13.0;
            jetPower = 1.35;
            if (!handoffStarted) {
              handoffStarted = true;
              waitingForDock = true;
              handoffTrailT = 0;
              b5 = 4;
              const lr = evoLayerEl.getBoundingClientRect();
              const worldX = lr.left + posX;
              const worldY = lr.top + BASE_Y - launchLiftY - 17.5;
              botGroup.setAttribute("opacity", "0");
              if (typeof AgentBlog.onMechLiftoff === "function") {
                AgentBlog.onMechLiftoff({ x: worldX, y: worldY, padX: lr.left + launchX, padY: lr.top + BASE_Y });
              } else if (typeof AgentBlog.onMechExitedTop === "function") {
                AgentBlog.onMechExitedTop();
              }
            }
          } else {
            // Cycle 2+ (avatar already docked): graceful in-viewport ascent & sky dissolve sync pulse (never flies off top!)
            const au = clamp01((b5t - 0.64) / 0.92);
            crouchY = 0;
            launchLiftY = 13.0 + Math.pow(au, 1.85) * 185;
            jetPower = 1.25 * (1 - au * 0.5);
            if (b5t >= 1.56) {
              resetWaitTimer = 2.6;
              if (typeof AgentBlog.onMechExitedTop === "function") {
                AgentBlog.onMechExitedTop();
              }
            }
          }
        } else if (b5 === 4) {
          // Single robot is currently airborne & patrolling the open sky -> keep runway quiet until it docks!
          b5t += dt;
          handoffTrailT += dt;
          moveSpeed = 0;
          if (!waitingForDock || b5t >= 9.5) {
            waitingForDock = false;
            resetWaitTimer = 2.4;
          }
        } else {
          posX += baseSpeed * dt;
        }

        if (claspRippleTimer > 0) claspRippleTimer = Math.max(0, claspRippleTimer - dt);
        if (lockSparkTimer > 0) lockSparkTimer = Math.max(0, lockSparkTimer - dt);
        if (gateRippleTimer > 0) gateRippleTimer = Math.max(0, gateRippleTimer - dt);
        if (brainDockTimer > 0) brainDockTimer = Math.max(0, brainDockTimer - dt);
        if (toolSnapTimer > 0) toolSnapTimer = Math.max(0, toolSnapTimer - dt);

        if (posX >= endX && b5 !== 3 && b5 !== 4) {
          resetWaitTimer = 1.4;
        }

        const drawX = posX + visualDX;

        // =================================================================
        // SMOOTH SPOTLIGHT FOCUS: Muted ink (0.40, #8A8275) -> Crisp ink (0.96, #1D1B18)
        // =================================================================
        const setPropFocus = (el, px) => {
          const near = clamp01(1 - Math.abs(drawX - px) / 86);
          const easedNear = near * near * (3 - 2 * near);
          el.setAttribute("transform", `translate(${px.toFixed(1)}, ${BASE_Y})`);
          el.setAttribute("opacity", (0.40 + easedNear * 0.56).toFixed(2));
          el.setAttribute("color", lerpInk(easedNear));
          return easedNear;
        };

        setPropFocus(prop1, x1);
        setPropFocus(prop2, x2);
        setPropFocus(prop3, x3);
        setPropFocus(prop4, x4);
        const near5 = setPropFocus(prop5, x5);

        // Prop 1 updates: pebble kick dust burst during trip
        if (b1 === 1 || (b1 === 2 && b1t < 0.24)) {
          const du = b1 === 1 ? clamp01(b1t / 0.22) * 0.55 : 0.55 + clamp01(b1t / 0.24) * 0.45;
          pebbleDust.setAttribute("transform", `translate(${(du * 4.5).toFixed(1)}, ${(-du * 2.5).toFixed(1)})`);
          pebbleDust.setAttribute("opacity", ((1 - du) * 0.85).toFixed(2));
        } else {
          pebbleDust.setAttribute("opacity", "0");
        }

        // Prop 2 updates (缸中之脑，会推理): Bell-jar lift, brain arc-transfer, 3-step CoT chain
        const vatIdleBob = Math.sin(now * 0.0035) * 0.7;
        const reasoningNow = b2 === 1 && b2t >= 0.72;
        if (b2 === 0) {
          vatDomeGroup.setAttribute("transform", "translate(0, 0)");
          vatDomeGroup.setAttribute("opacity", "1");
          vatBrainGroup.setAttribute("transform", `translate(0, ${(-16.8 + vatIdleBob).toFixed(2)})`);
          vatBrainGroup.setAttribute("opacity", "1");
          vatEyeSleep.setAttribute("opacity", "0.85");
          vatEyeAwake.setAttribute("opacity", "0");
          vatAntTip.setAttribute("fill", "#FAF8F4");
          vatGlow.setAttribute("opacity", (0.28 + 0.14 * Math.sin(now * 0.004)).toFixed(2));
          vatEmitter.setAttribute("opacity", "0.65");
          cotChainGroup.setAttribute("opacity", "0");
        } else if (b2 === 1) {
          // Dome lifts cleanly (0..0.34s), hovers open (0.34..0.72s), settles back (0.72..1.04s)
          let domeLift = 0;
          if (b2t < 0.34) {
            const u = clamp01(b2t / 0.34);
            domeLift = -(1 - Math.pow(1 - u, 3)) * 10.5;
          } else if (b2t < 0.72) {
            domeLift = -10.5;
          } else {
            const u = clamp01((b2t - 0.72) / 0.32);
            domeLift = -(1 - u * u * (3 - 2 * u)) * 10.5;
          }
          vatDomeGroup.setAttribute("transform", `translate(0, ${domeLift.toFixed(1)})`);
          vatDomeGroup.setAttribute("opacity", (1 + domeLift / 26).toFixed(2));

          // Brain wakes up (0.14s) and smoothly arcs from vat (0, -16.8) to robot neck (-15.4, -22.2)!
          if (b2t < 0.72) {
            vatBrainGroup.setAttribute("opacity", "1");
            const awake = b2t >= 0.16;
            vatEyeSleep.setAttribute("opacity", awake ? "0" : "0.85");
            vatEyeAwake.setAttribute("opacity", awake ? "1" : "0");
            vatAntTip.setAttribute("fill", awake ? "#2D6A47" : "#FAF8F4");
            if (b2t < 0.34) {
              const u = clamp01(b2t / 0.34);
              vatBrainGroup.setAttribute("transform", `translate(0, ${(-16.8 - u * 4.2).toFixed(1)})`);
            } else {
              const u = clamp01((b2t - 0.34) / 0.38);
              const e = u * u * (3 - 2 * u);
              const inv = 1 - e;
              const bx = inv * inv * 0 + 2 * inv * e * -8.8 + e * e * -17.4;
              const by = inv * inv * -21.0 + 2 * inv * e * -29.2 + e * e * -22.2;
              vatBrainGroup.setAttribute("transform", `translate(${bx.toFixed(1)}, ${by.toFixed(1)})`);
            }
          } else {
            vatBrainGroup.setAttribute("opacity", "0");
          }

          vatGlow.setAttribute("opacity", b2t < 0.72 ? "0.75" : "0.18");
          vatEmitter.setAttribute("opacity", b2t < 0.72 ? "1" : "0.25");

          // Sequential 3-step Chain-of-Thought reasoning nodes (○ -> ○ -> ●)
          if (reasoningNow) {
            const rt = b2t - 0.72;
            const fadeOut = 1 - smooth(0.54, 0.66, rt);
            cotChainGroup.setAttribute("opacity", fadeOut.toFixed(2));
            cotNode1.setAttribute("opacity", smooth(0.02, 0.10, rt).toFixed(2));
            cotLink1.setAttribute("opacity", smooth(0.10, 0.18, rt).toFixed(2));
            cotNode2.setAttribute("opacity", smooth(0.16, 0.24, rt).toFixed(2));
            cotLink2.setAttribute("opacity", smooth(0.24, 0.32, rt).toFixed(2));
            cotNode3.setAttribute("opacity", smooth(0.30, 0.38, rt).toFixed(2));
            cotNode3Rays.setAttribute("opacity", smooth(0.34, 0.44, rt).toFixed(2));
          } else {
            cotChainGroup.setAttribute("opacity", "0");
          }
        } else {
          // Empty glass vat remains cleanly behind on the timeline spine
          vatDomeGroup.setAttribute("transform", "translate(0, 0)");
          vatDomeGroup.setAttribute("opacity", "1");
          vatBrainGroup.setAttribute("opacity", "0");
          vatGlow.setAttribute("opacity", "0");
          vatEmitter.setAttribute("opacity", "0.2");
          cotChainGroup.setAttribute("opacity", "0");
        }
        brainDockSpark.setAttribute("opacity", brainDockTimer > 0 ? (brainDockTimer / 0.28).toFixed(2) : "0");

        // Prop 3 updates (撞墙试错，接工具): Tool socket wrench pickup, bonk sparks, cross-valve rotation, wall sink
        rackWrenchEl.setAttribute("opacity", hasWrench ? "0" : "1");
        rackPortLed.setAttribute("opacity", hasWrench ? "0.25" : "0.85");
        toolSnapSpark.setAttribute("opacity", toolSnapTimer > 0 ? (toolSnapTimer / 0.28).toFixed(2) : "0");
        wallBody.setAttribute("transform", `translate(0, ${wallSink.toFixed(1)})`);
        wallBolt.setAttribute("transform", `rotate(${wallBoltDeg.toFixed(1)}, 0, -13.6)`);
        const showBonk = b3 === 1 && b3t < 0.36;
        const bonkOp = showBonk ? (b3t < 0.18 ? 0.96 : (1 - (b3t - 0.18) / 0.18) * 0.96) : 0;
        wallSparks.setAttribute("opacity", bonkOp.toFixed(2));
        const turningValve = b3 === 1 && b3t >= 1.00 && b3t < 1.32;
        wallTorqueArcs.setAttribute("opacity", turningValve ? (Math.sin(((b3t - 1.00) / 0.32) * Math.PI) * 0.85).toFixed(2) : "0");
        const wallSinkingNow = b3 === 1 && b3t >= 1.32 && b3t < 1.70;
        if (wallSinkingNow) {
          const wu = clamp01((b3t - 1.32) / 0.38);
          wallDust.setAttribute("opacity", (Math.sin(wu * Math.PI) * 0.75).toFixed(2));
          wallDust.setAttribute("transform", `translate(0, ${(-wu * 3.2).toFixed(1)})`);
        } else {
          wallDust.setAttribute("opacity", "0");
        }

        // Prop 4 updates (手眼脑通，状态机): Dual-optic scan beam, terminal screen glow, S1->S2->S3 state machine, freeze & boom lift
        const scanningTerminal = b4 === 1 && b4t < 0.34;
        const scanOp = scanningTerminal ? Math.sin(clamp01(b4t / 0.34) * Math.PI) : 0;
        gateScanBeam.setAttribute("opacity", (scanOp * 0.95).toFixed(2));
        gateScreenLines.setAttribute("stroke", scanningTerminal || (b4 === 1 && b4t < 0.84) ? "#B5F5D4" : "#FAF8F4");
        gateScreenLines.setAttribute("opacity", scanningTerminal ? "1" : "0.72");

        const btnPressed = b4 === 1 && b4t >= 0.44 && b4t <= 0.84;
        gateBtnEl.setAttribute("y", btnPressed ? "-20.4" : "-21.6");
        gateArmGroup.setAttribute("transform", `rotate(${gateAngle.toFixed(1)}, 0, -11.0)`);
        gateFreezeBadge.setAttribute("opacity", freezeAll ? "0.96" : "0");

        const s1Lit = (b4 === 1 && b4t >= 0.12) || b4 === 2;
        const s2Lit = (b4 === 1 && b4t >= 0.46) || b4 === 2;
        const s3Lit = (b4 === 1 && b4t >= 0.84) || b4 === 2;
        gateS1.setAttribute("fill", s1Lit ? "#2D6A47" : "#EDE8DE");
        gateS2.setAttribute("fill", s2Lit ? "#2D6A47" : "#EDE8DE");
        gateS3.setAttribute("fill", s3Lit ? "#2D6A47" : "#EDE8DE");
        if (gateRippleTimer > 0) {
          const gu = 1 - gateRippleTimer / 0.52;
          gateSavedRipple.setAttribute("r", (2.2 + gu * 6.2).toFixed(1));
          gateSavedRipple.setAttribute("opacity", ((1 - gu) * 0.85).toFixed(2));
        } else {
          gateSavedRipple.setAttribute("opacity", "0");
        }

        // Prop 5 updates (卷马具，进生产): Pre-flight self-check LEDs (1->2->3), gantry beacons, holographic field
        const padActive = b5 === 1 || isEquipped;
        const chk1 = isEquipped || (b5 === 1 && b5t >= 0.34);
        const chk2 = isEquipped || (b5 === 1 && b5t >= 0.52);
        const chk3 = isEquipped || (b5 === 1 && b5t >= 0.88);
        padCheck1.setAttribute("fill", chk1 ? "#2D6A47" : "#EDE8DE");
        padCheck2.setAttribute("fill", chk2 ? "#2D6A47" : "#EDE8DE");
        padCheck3.setAttribute("fill", chk3 ? "#2D6A47" : "#EDE8DE");
        gantryBeaconL.setAttribute("fill", chk3 ? "#2D6A47" : "#EDE8DE");
        gantryBeaconR.setAttribute("fill", chk3 ? "#2D6A47" : "#EDE8DE");
        padCore.setAttribute("opacity", padActive ? "1" : (near5 > 0.3 ? (near5 * 0.45).toFixed(2) : "0"));
        const pipOp = padActive ? "1" : (near5 > 0.2 ? (near5 * 0.7).toFixed(2) : "0");
        padPipL.setAttribute("opacity", pipOp);
        padPipR.setAttribute("opacity", pipOp);
        if (b5 === 1 && b5t < 0.94) {
          const fu = clamp01(b5t / 0.94);
          padField.setAttribute("opacity", (Math.sin(fu * Math.PI) * 0.95).toFixed(2));
          padBeams.setAttribute("opacity", (0.45 + 0.35 * Math.sin(b5t * 24)).toFixed(2));
          const scanY = -4.5 - ((b5t * 28) % 22);
          padScanLine.setAttribute("y1", scanY.toFixed(1));
          padScanLine.setAttribute("y2", scanY.toFixed(1));
          padScanLine.setAttribute("opacity", "0.78");
          const ringU = (b5t * 1.9) % 1;
          padEnergyRing.setAttribute("cy", (-5.0 - ringU * 20).toFixed(1));
          padEnergyRing.setAttribute("rx", (12.2 - ringU * 2.0).toFixed(1));
          padEnergyRing.setAttribute("opacity", (Math.sin(ringU * Math.PI) * 0.65).toFixed(2));
        } else {
          padField.setAttribute("opacity", "0");
          padBeams.setAttribute("opacity", "0");
          padScanLine.setAttribute("opacity", "0");
          padEnergyRing.setAttribute("opacity", "0");
        }

        // Stage 5 Flying Modular Parts convergence animation (during b5 === 1)
        if (b5 === 1 && b5t < 0.94) {
          assembleLayer.setAttribute("opacity", "1");
          flyParts.forEach(({ sp, trail, piece }) => {
            if (b5t >= sp.t0 && b5t < sp.t1) {
              const rawU = clamp01((b5t - sp.t0) / (sp.t1 - sp.t0));
              const u = Math.pow(rawU, 1.65);
              const inv = 1 - u;
              const px = inv * inv * sp.sx + 2 * inv * u * sp.cx + u * u * sp.tx;
              const py = inv * inv * sp.sy + 2 * inv * u * sp.cy + u * u * sp.ty;
              const rot = sp.rot0 * (1 - u);
              const fadeIn = clamp01(rawU * 4.5);
              piece.setAttribute("transform", `translate(${px.toFixed(1)}, ${py.toFixed(1)}) rotate(${rot.toFixed(1)})`);
              piece.setAttribute("opacity", fadeIn.toFixed(2));
              const prevU = Math.max(0, u - 0.22);
              const pinv = 1 - prevU;
              const tx0 = pinv * pinv * sp.sx + 2 * pinv * prevU * sp.cx + prevU * prevU * sp.tx;
              const ty0 = pinv * pinv * sp.sy + 2 * pinv * prevU * sp.cy + prevU * prevU * sp.ty;
              trail.setAttribute("x1", tx0.toFixed(1));
              trail.setAttribute("y1", ty0.toFixed(1));
              trail.setAttribute("x2", px.toFixed(1));
              trail.setAttribute("y2", py.toFixed(1));
              trail.setAttribute("opacity", (fadeIn * 0.55).toFixed(2));
            } else {
              piece.setAttribute("opacity", "0");
              trail.setAttribute("opacity", "0");
            }
          });
        } else {
          assembleLayer.setAttribute("opacity", "0");
        }
        lockSparks.setAttribute("opacity", lockSparkTimer > 0 ? (lockSparkTimer / 0.28).toFixed(2) : "0");

        // Ground shockwave, sonic boom ring & triple contrails during liftoff (continues smoothly after handoff in b5 === 4!)
        if ((b5 === 3 || b5 === 4) && b5t > 0.12) {
          const su = clamp01((b5t - 0.12) / 0.52);
          if (su < 1) {
            const spread = 4 + su * 23;
            const len = 6.0 * (1 - su * 0.45);
            shockL.setAttribute("x1", (launchX - spread - len).toFixed(1));
            shockL.setAttribute("x2", (launchX - spread).toFixed(1));
            shockL.setAttribute("y1", String(BASE_Y - 1));
            shockL.setAttribute("y2", String(BASE_Y - 1));
            shockR.setAttribute("x1", (launchX + spread).toFixed(1));
            shockR.setAttribute("x2", (launchX + spread + len).toFixed(1));
            shockR.setAttribute("y1", String(BASE_Y - 1));
            shockR.setAttribute("y2", String(BASE_Y - 1));
            launchShock.setAttribute("opacity", ((1 - su) * 0.72).toFixed(2));
          } else {
            launchShock.setAttribute("opacity", "0");
          }
          if (b5t >= 0.62 && b5t < 1.04) {
            const ru = (b5t - 0.62) / 0.42;
            sonicRing.setAttribute("cx", launchX.toFixed(1));
            sonicRing.setAttribute("cy", String(BASE_Y - 13.5));
            sonicRing.setAttribute("rx", (6 + ru * 20).toFixed(1));
            sonicRing.setAttribute("ry", (1.8 + ru * 4.2).toFixed(1));
            sonicRing.setAttribute("opacity", ((1 - ru) * 0.78).toFixed(2));
          } else {
            sonicRing.setAttribute("opacity", "0");
          }
          const trailLift = b5 === 4 ? 13 + Math.min(260, handoffTrailT * 340) : launchLiftY;
          if (trailLift > 8 && (b5 !== 4 || handoffTrailT < 0.78)) {
            const trailOp = b5 === 4
              ? clamp01(1 - handoffTrailT / 0.78) * 0.42
              : clamp01(1 - (trailLift - 45) / 145) * 0.46;
            const topY = (BASE_Y - trailLift - 4).toFixed(1);
            launchTrail.setAttribute("x1", launchX.toFixed(1));
            launchTrail.setAttribute("x2", launchX.toFixed(1));
            launchTrail.setAttribute("y1", String(BASE_Y - 2));
            launchTrail.setAttribute("y2", topY);
            launchTrail.setAttribute("opacity", trailOp.toFixed(2));
            launchTrailL.setAttribute("x1", (launchX - 7.4).toFixed(1));
            launchTrailL.setAttribute("x2", (launchX - 7.4).toFixed(1));
            launchTrailL.setAttribute("y1", String(BASE_Y - 6));
            launchTrailL.setAttribute("y2", (BASE_Y - trailLift - 12).toFixed(1));
            launchTrailL.setAttribute("opacity", (trailOp * 0.7).toFixed(2));
            launchTrailR.setAttribute("x1", (launchX + 7.4).toFixed(1));
            launchTrailR.setAttribute("x2", (launchX + 7.4).toFixed(1));
            launchTrailR.setAttribute("y1", String(BASE_Y - 6));
            launchTrailR.setAttribute("y2", (BASE_Y - trailLift - 12).toFixed(1));
            launchTrailR.setAttribute("opacity", (trailOp * 0.7).toFixed(2));
          } else {
            launchTrail.setAttribute("opacity", "0");
            launchTrailL.setAttribute("opacity", "0");
            launchTrailR.setAttribute("opacity", "0");
          }
        } else {
          launchShock.setAttribute("opacity", "0");
          sonicRing.setAttribute("opacity", "0");
          launchTrail.setAttribute("opacity", "0");
          launchTrailL.setAttribute("opacity", "0");
          launchTrailR.setAttribute("opacity", "0");
        }

        // =================================================================
        // CONTINUOUS MORPHOLOGY EVOLUTION (17px -> 23px -> 26px -> 29px -> 33px)
        // =================================================================
        // Physical morphology unlocked by actual narrative milestones (Brain from Vat, Wrench from Socket!)
        const headW = hasBrain ? 1 : 0;              // CRT head physically docks from Era 2 Glass Vat!
        const kneeW = smooth(0.75, 1.25, evo);       // Articulated knees unfold in Era 2
        const wrenchW = hasWrench
          ? (b3 === 1 ? 1 : !isEquipped ? 1 - smooth(2.35, 2.62, evo) : 0)
          : 0;
        const gogglesW = smooth(2.65, 3.05, evo);    // Era 4–5 dual-optic visor
        const keyW = hasBrain ? 0 : 1 - smooth(0.95, 1.22, evo); // Wind-up key fades as brain takes over!
        const edgeFade = b5 === 4
          ? 0
          : b5 === 3
          ? (b5t > 0.64 ? 1 - smooth(1.05, 1.54, b5t) : 1)
          : smooth(0, 0.03, progress) * (1 - smooth(0.96, 1, progress));

        // Smooth vertical step-up onto Era 5 architectural docking pad deck (height 3.5px)
        const onPadDist = Math.abs(drawX - x5);
        const padStandY = b5 === 3 ? 0 : (1 - smooth(10, 17, onPadDist)) * 3.5;

        // Proportions: total height scales smoothly 17 -> 23 -> 26 -> 29 -> 33px
        const legSeg = lerp(3.4, 7.2, smooth(0.2, 3.4, evo));
        const strideLen = lerp(6.0, 14.0, smooth(0.2, 3.6, evo));
        const torsoH = lerp(7.8, 10.6, smooth(0.4, 3.4, evo));
        const torsoW = lerp(11.6, 8.4, smooth(0.5, 3.2, evo));

        if (!freezeAll && moveSpeed > 0) {
          phase += (moveSpeed / Math.max(9, strideLen * 1.95)) * dt;
          keyPhase += 5.2 * dt;
        }

        // Spinal lean arc: +22° -> +5° -> +26° -> +6° -> 0°
        const baseLean =
          evo < 1
            ? lerp(22, 6, smooth(0.5, 1.0, evo))
            : evo < 2
            ? lerp(6, 24, smooth(1.45, 2.0, evo))
            : evo < 3
            ? lerp(24, 6, smooth(2.2, 2.9, evo))
            : lerp(6, 0, smooth(3.1, 3.65, evo));
        const leanDeg = b5 === 3 || armPose === "dock" ? 0 : baseLean + extraLean;
        const leanRad = (leanDeg * Math.PI) / 180;

        const bob = freezeAll || b5 === 3 ? 0 : kneeW * Math.abs(Math.sin(phase * Math.PI * 2)) * 1.35;
        const totalLift = beatHopH + launchLiftY + padStandY;
        const hipY = -lerp(6.4, 13.0, smooth(0.2, 3.4, evo)) - bob - totalLift + crouchY;
        const shoulderX = Math.sin(leanRad) * torsoH;
        const shoulderY = hipY - Math.cos(leanRad) * torsoH;

        botGroup.setAttribute("transform", `translate(${drawX.toFixed(2)}, ${BASE_Y})`);
        botGroup.setAttribute("opacity", edgeFade.toFixed(3));
        if (Math.abs(bodyRollDeg) > 0.1 || Math.abs(bodyDropY) > 0.1) {
          const pivotY = isSliding ? -6.2 : -8.0;
          botBody.setAttribute("transform", `translate(0, ${bodyDropY.toFixed(2)}) rotate(${bodyRollDeg.toFixed(1)}, 0, ${pivotY})`);
        } else {
          botBody.removeAttribute("transform");
        }
        const shadowBaseRx = lerp(7.4, 6.2, smooth(0.5, 3.2, evo));
        const shadowScale = clamp01(1 - (beatHopH + launchLiftY) / 48);
        shadowEl.setAttribute("cy", (0.4 - padStandY).toFixed(1));
        shadowEl.setAttribute("rx", ((isSliding ? 9.8 : shadowBaseRx) * (0.4 + 0.6 * shadowScale)).toFixed(1));
        shadowEl.setAttribute("fill-opacity", (0.14 * shadowScale).toFixed(3));

        // Era 1 wind-up key on back + retro tin-toy cap + trip vermilion `!`
        keyGroup.setAttribute("opacity", keyW.toFixed(2));
        rpaTopCap.setAttribute("opacity", (1 - headW).toFixed(2));
        if (keyW > 0.02) {
          const keyShudder = b1 === 1 ? Math.sin(b1t * 48) * 1.1 : 0;
          keyGroup.setAttribute("transform", `translate(${keyShudder.toFixed(1)}, ${hipY.toFixed(1)}) rotate(${leanDeg.toFixed(1)})`);
          const ryOuter = 1.0 + Math.abs(Math.cos(keyPhase)) * 1.85;
          keyLoop.setAttribute("ry", ryOuter.toFixed(2));
          keyInner.setAttribute("ry", (ryOuter * 0.46).toFixed(2));
        }
        stuckBang.setAttribute("opacity", b1 === 1 ? "0.95" : "0");

        // Legs: Era 1 jog/slide -> Era 2–5 articulated IK gait -> Heroic Iron Man flight pose
        const liftH = b1 === 0 ? 2.4 : lerp(0.5, 3.6, kneeW);
        const isFlying = b5 === 3 && launchLiftY > 2;
        const f1 = isSliding
          ? { x: -1.8, y: -1.8, pitch: 0 }
          : isFlying
          ? { x: 2.5, y: 0.4, pitch: 0.28 }
          : armPose === "dock"
          ? { x: 3.1, y: 0, pitch: 0 }
          : moveSpeed > 0
          ? footPose(phase, strideLen, liftH)
          : { x: 2.2, y: 0, pitch: 0 };
        const f2 = isSliding
          ? { x: -0.4, y: -1.2, pitch: 0 }
          : isFlying
          ? { x: -2.8, y: -4.2, pitch: 0.40 }
          : armPose === "dock"
          ? { x: -3.1, y: 0, pitch: 0 }
          : moveSpeed > 0
          ? footPose(phase + 0.5, strideLen, liftH)
          : { x: -2.2, y: 0, pitch: 0 };

        // Era 5 Staggered Modular Armor Lock-in Flags (Boots -> Gauntlets -> Torso/Pack -> Head Crest)
        const hasBoots = isEquipped || (b5 === 1 && b5t >= 0.34);
        const hasGauntlets = isEquipped || (b5 === 1 && b5t >= 0.52);
        const hasTorsoArmor = isEquipped || (b5 === 1 && b5t >= 0.72);
        const hasHeadCrest = isEquipped || (b5 === 1 && b5t >= 0.88);

        if (kneeW < 0.15) {
          // Stiff knee-less RPA stick legs + capsule feet
          const f1x = f1.x + 1.5;
          const f1y = f1.y - totalLift;
          const f2x = f2.x - 1.5;
          const f2y = f2.y - totalLift;
          frontLeg.setAttribute("d", `M 1.5,${hipY.toFixed(1)} L ${f1x.toFixed(1)},${f1y.toFixed(1)}`);
          backLeg.setAttribute("d", `M -1.5,${hipY.toFixed(1)} L ${f2x.toFixed(1)},${f2y.toFixed(1)}`);
          frontFoot.setAttribute("d", capsuleFootPath(f1x, f1y, 2.3, f1.pitch));
          backFoot.setAttribute("d", capsuleFootPath(f2x, f2y, 2.1, f2.pitch));
          kneeJoint1.setAttribute("opacity", "0");
          kneeJoint2.setAttribute("opacity", "0");
        } else {
          const hipOffF = 1.0;
          const hipOffB = -1.0;
          const k1 = solveKnee(hipOffF, hipY + 0.6, f1.x, f1.y - totalLift, legSeg, legSeg);
          const k2 = solveKnee(hipOffB, hipY + 0.6, f2.x, f2.y - totalLift, legSeg, legSeg);
          frontLeg.setAttribute("d", `M ${hipOffF},${(hipY + 0.6).toFixed(1)} L ${k1.x.toFixed(1)},${k1.y.toFixed(1)} L ${f1.x.toFixed(1)},${(f1.y - totalLift).toFixed(1)}`);
          backLeg.setAttribute("d", `M ${hipOffB},${(hipY + 0.6).toFixed(1)} L ${k2.x.toFixed(1)},${k2.y.toFixed(1)} L ${f2.x.toFixed(1)},${(f2.y - totalLift).toFixed(1)}`);
          frontFoot.setAttribute("d", capsuleFootPath(f1.x, f1.y - totalLift, 2.9, f1.pitch));
          backFoot.setAttribute("d", capsuleFootPath(f2.x, f2.y - totalLift, 2.7, f2.pitch));
          kneeJoint1.setAttribute("cx", k1.x.toFixed(1));
          kneeJoint1.setAttribute("cy", k1.y.toFixed(1));
          kneeJoint1.setAttribute("opacity", kneeW.toFixed(2));
          kneeJoint2.setAttribute("cx", k2.x.toFixed(1));
          kneeJoint2.setAttribute("cy", k2.y.toFixed(1));
          kneeJoint2.setAttribute("opacity", (kneeW * 0.62).toFixed(2));
        }
        backLeg.setAttribute("opacity", "0.66");
        backFoot.setAttribute("opacity", hasBoots ? "0" : "0.70");
        frontFoot.setAttribute("opacity", hasBoots ? "0" : "1");

        // Torso (neck + sleek waist band + sculpted chassis with warm stone bevel + vents)
        const hw = torsoW * 0.5;
        const topW = lerp(hw * 0.90, hw * 0.98, smooth(0.8, 3.2, evo));
        pelvisEl.setAttribute("d", `M ${(-hw * 0.68).toFixed(1)},-0.1 L ${(hw * 0.68).toFixed(1)},-0.1 L ${(hw * 0.50).toFixed(1)},1.35 L ${(-hw * 0.50).toFixed(1)},1.35 Z`);
        torsoEl.setAttribute("d", `M ${(-hw).toFixed(1)},0 L ${hw.toFixed(1)},0 L ${topW.toFixed(1)},${(-torsoH + 1.0).toFixed(1)} Q ${topW.toFixed(1)},${(-torsoH).toFixed(1)} ${(topW - 1.0).toFixed(1)},${(-torsoH).toFixed(1)} L ${(-topW + 1.0).toFixed(1)},${(-torsoH).toFixed(1)} Q ${(-topW).toFixed(1)},${(-torsoH).toFixed(1)} ${(-topW).toFixed(1)},${(-torsoH + 1.0).toFixed(1)} Z`);
        torsoShade.setAttribute("d", `M ${(-hw + 0.5).toFixed(1)},-0.5 L ${(-hw * 0.35).toFixed(1)},-0.5 L ${(-topW * 0.35).toFixed(1)},${(-torsoH + 0.7).toFixed(1)} L ${(-topW + 0.6).toFixed(1)},${(-torsoH + 0.7).toFixed(1)} Z`);
        chestPanel.setAttribute("d", `M ${(-hw * 0.42).toFixed(1)},${(-torsoH * 0.66).toFixed(1)} L ${(hw * 0.42).toFixed(1)},${(-torsoH * 0.66).toFixed(1)} M ${(-hw * 0.32).toFixed(1)},${(-torsoH * 0.42).toFixed(1)} L ${(hw * 0.24).toFixed(1)},${(-torsoH * 0.42).toFixed(1)}`);
        chestPanel.setAttribute("opacity", hasTorsoArmor ? "0" : "0.62");
        chestLed.setAttribute("cx", (hw * 0.36).toFixed(1));
        chestLed.setAttribute("cy", (-torsoH * 0.42).toFixed(1));
        chestLed.setAttribute("opacity", !hasTorsoArmor && evo > 1.0 ? "0.85" : "0");
        neckEl.setAttribute("transform", `translate(0, ${(10.6 - torsoH).toFixed(2)})`);
        neckEl.setAttribute("opacity", headW.toFixed(2));
        torsoGroup.setAttribute("transform", `translate(0, ${hipY.toFixed(2)}) rotate(${leanDeg.toFixed(1)})`);

        // Armored Thruster Boots track front & back feet
        bootF.setAttribute("opacity", hasBoots ? "1" : "0");
        bootB.setAttribute("opacity", hasBoots ? "0.80" : "0");
        if (hasBoots) {
          bootF.setAttribute("transform", `translate(${f1.x.toFixed(1)}, ${(f1.y - totalLift).toFixed(1)})`);
          bootB.setAttribute("transform", `translate(${f2.x.toFixed(1)}, ${(f2.y - totalLift).toFixed(1)})`);
        }

        // Modular Skills Jetpack + Shoulder Pauldrons + X-Harness + Bamboo Arc Core
        jetpackEl.setAttribute("opacity", hasTorsoArmor ? "1" : "0");
        shoulderArmorEl.setAttribute("opacity", hasTorsoArmor ? "1" : "0");
        harnessGroup.setAttribute("opacity", hasTorsoArmor ? "1" : "0");
        if (hasTorsoArmor) {
          harnessX1.setAttribute("x1", (-topW + 0.7).toFixed(1));
          harnessX1.setAttribute("y1", (-torsoH + 0.9).toFixed(1));
          harnessX1.setAttribute("x2", (hw - 0.7).toFixed(1));
          harnessX1.setAttribute("y2", "-1.1");
          harnessX2.setAttribute("x1", (topW - 0.7).toFixed(1));
          harnessX2.setAttribute("y1", (-torsoH + 0.9).toFixed(1));
          harnessX2.setAttribute("x2", (-hw + 0.7).toFixed(1));
          harnessX2.setAttribute("y2", "-1.1");
          const cy = (-torsoH * 0.52).toFixed(1);
          harnessGlow.setAttribute("cx", "0");
          harnessGlow.setAttribute("cy", cy);
          harnessClaspOuter.setAttribute("cx", "0");
          harnessClaspOuter.setAttribute("cy", cy);
          harnessClasp.setAttribute("cx", "0");
          harnessClasp.setAttribute("cy", cy);
          if (claspRippleTimer > 0) {
            const rp = 1 - claspRippleTimer / 0.72;
            harnessRipple.setAttribute("cx", "0");
            harnessRipple.setAttribute("cy", cy);
            harnessRipple.setAttribute("r", (2.0 + rp * 7.6).toFixed(1));
            harnessRipple.setAttribute("opacity", ((1 - rp) * 0.92).toFixed(2));
            const rp2 = clamp01((rp - 0.18) / 0.82);
            harnessRipple2.setAttribute("cx", "0");
            harnessRipple2.setAttribute("cy", cy);
            harnessRipple2.setAttribute("r", (1.8 + rp2 * 11.0).toFixed(1));
            harnessRipple2.setAttribute("opacity", (rp2 > 0 ? (1 - rp2) * 0.55 : 0).toFixed(2));
          } else {
            harnessRipple.setAttribute("opacity", "0");
            harnessRipple2.setAttribute("opacity", "0");
          }
        }

        // Robot Head (boxy CRT chassis + proud upright antenna + expressive visor + Stage 5 Mech V-Crest)
        headGroup.setAttribute("opacity", headW.toFixed(3));
        const hScale = lerp(0.35, 0.96, headW) * lerp(1.04, 0.92, smooth(1.3, 3.5, evo));
        const headX = shoulderX + 0.5;
        const headY = shoulderY - 4.7 * hScale - 1.1;
        const walkTilt = freezeAll || b5 === 3 ? 0 : Math.sin(phase * Math.PI * 2) * 1.8;
        const launchLookUp = b5 === 3 && launchLiftY > 2 ? -8 : 0;
        headGroup.setAttribute("transform", `translate(${headX.toFixed(2)}, ${headY.toFixed(2)}) scale(${hScale.toFixed(3)}) rotate(${(walkTilt + headNodDeg + launchLookUp).toFixed(1)})`);

        antGroup.setAttribute("transform", `rotate(${(Math.sin(phase * Math.PI * 2) * 5).toFixed(1)}, -0.8, -5.0)`);
        antTip.setAttribute("fill", hasHeadCrest || reasoningNow ? "#2D6A47" : "#FAF8F4");
        cotHeadSpark.setAttribute("opacity", "0");
        headCrestEl.setAttribute("opacity", hasHeadCrest ? "1" : "0");

        if (!freezeAll) {
          blinkTimer -= dt;
          if (blinkTimer <= 0) {
            isBlinking = !isBlinking;
            blinkTimer = isBlinking ? 0.11 : 2.6 + Math.random() * 2.6;
          }
        }

        const isWincing = (b3 === 1 && b3t < 0.36) || b1 === 1;
        const useGoggles = gogglesW > 0.5;
        visorScreen.setAttribute("opacity", useGoggles ? "0" : "1");
        visorGlint1.setAttribute("opacity", useGoggles ? "0" : "1");
        eyeEl.setAttribute("opacity", !useGoggles && !isWincing ? "1" : "0");
        eyeEl.setAttribute("cx", reasoningNow ? "2.6" : "2.3");
        eyeEl.setAttribute("cy", reasoningNow ? "-0.8" : "-0.4");
        eyeEl.setAttribute("r", isBlinking ? "0.18" : "1.15");
        eyeWince.setAttribute("opacity", !useGoggles && isWincing ? "1" : "0");

        gogglesEl.setAttribute("opacity", gogglesW.toFixed(2));
        visorGlint2.setAttribute("opacity", useGoggles ? "1" : "0");
        goggleEye.setAttribute("opacity", useGoggles && !isBlinking ? "1" : "0");
        const twinEyeFill = freezeAll || scanningTerminal || hasHeadCrest ? "#B5F5D4" : "#FAF8F4";
        gEyeL.setAttribute("fill", twinEyeFill);
        gEyeR.setAttribute("fill", twinEyeFill);

        // Articulated 2-segment Arms & Props (Pincer / CoT Chin / Forehead Bonk / Wrench / Gate Press / Suit-Up / Launch)
        const swing = moveSpeed > 0 ? Math.sin(phase * Math.PI * 2) * lerp(1.6, 5.4, kneeW) : 0;
        const armLen = lerp(5.8, 8.8, smooth(0.4, 3.4, evo));
        const isSymStance = armPose === "dock" || armPose === "launch";
        const fSX = isSymStance ? shoulderX + 3.6 : shoulderX + 0.6;
        const fSY = shoulderY + 2.0;
        const bSX = isSymStance ? shoulderX - 3.6 : shoulderX - 1.2;
        const bSY = shoulderY + 2.0;

        let fHX = fSX + swing + 1.8;
        let fHY = fSY + armLen - Math.abs(swing) * 0.25;
        let bHX = bSX - swing;
        let bHY = bSY + armLen - Math.abs(swing) * 0.25;
        let fBend = 1;
        let bBend = 1;

        if (evo < 0.8) {
          // Era 1: rigid C-pincer arm (during belly-slide, stretches UP-locally -> horizontal FORWARD along spine!)
          if (isSliding || b1 === 1) {
            fHX = fSX + 1.0;
            fHY = fSY - 5.2;
            bHX = bSX - 1.2;
            bHY = bSY + 2.8;
            fBend = 0.2;
          } else {
            fHX = fSX + 6.4;
            fHY = fSY + 0.4;
            bHX = bSX - 1.5;
            bHY = bSY + 4.0;
            fBend = 0.2;
          }
        } else if (armPose === "cot") {
          // Era 2: visible foreground arm props chin while 3-step CoT chain lights up above!
          fHX = headX + 3.0;
          fHY = headY + 4.0;
          bHX = bSX - 1.2;
          bHY = bSY + 5.6;
          fBend = 1.25;
        } else if (armPose === "bonk") {
          // Era 3: foreground hand clutches bonked forehead cleanly
          fHX = headX + 3.2;
          fHY = headY - 1.0;
          bHX = bSX + 3.5;
          bHY = bSY + 4.8;
          fBend = 1.0;
        } else if (armPose === "grabTool") {
          // Era 3: stands cleanly left of Tool Socket (x3 - 29.5) and reaches straight to rack socket (x3 - 21.5)!
          fHX = fSX + 7.4;
          fHY = -12.8;
          bHX = bSX - 2.0;
          bHY = bSY + 5.6;
          fBend = 0.45;
        } else if (armPose === "wrench") {
          // Era 3: right wrench arm reaches straight out to grip left outer spoke of cross-valve
          fHX = fSX + 8.0;
          fHY = -13.6;
          bHX = bSX - 2.4;
          bHY = bSY + 5.8;
          fBend = 0.35;
        } else if (armPose === "scan") {
          // Era 4: poised alert stance while dual-optic visor scans terminal screen
          fHX = fSX + 3.6;
          fHY = fSY + 5.6;
          bHX = bSX - 2.0;
          bHY = bSY + 6.2;
          fBend = 0.5;
        } else if (armPose === "press") {
          // Era 4: right hand arcs cleanly OVER lowered boom to land dead-center on checkpoint plunger
          fHX = fSX + 15.8;
          fHY = -20.8;
          bHX = bSX - 2.0;
          bHY = bSY + 6.2;
          fBend = -0.85;
        } else if (armPose === "dock") {
          // Era 5 Suit-Up Stance: arms held heroically outward while modules converge!
          fHX = shoulderX + 7.2;
          fHY = fSY + armLen - 1.5;
          bHX = shoulderX - 7.2;
          bHY = bSY + armLen - 1.5;
          fBend = -0.55;
          bBend = 0.55;
        } else if (armPose === "launch") {
          // Era 5 Iron Man Takeoff: wide heroic flare outward so palm repulsor plumes have clean negative space!
          fHX = shoulderX + 10.6;
          fHY = fSY + armLen - 2.2;
          bHX = shoulderX - 10.6;
          bHY = bSY + armLen - 2.2;
          fBend = -0.45;
          bBend = 0.45;
        }

        const fElb = solveElbow(fSX, fSY, fHX, fHY, fBend);
        const bElb = solveElbow(bSX, bSY, bHX, bHY, bBend);
        frontArm.setAttribute("d", `M ${fSX.toFixed(1)},${fSY.toFixed(1)} L ${fElb.x.toFixed(1)},${fElb.y.toFixed(1)} L ${fHX.toFixed(1)},${fHY.toFixed(1)}`);
        backArm.setAttribute("opacity", armPose === "cot" || armPose === "bonk" || isSymStance ? "0.95" : "0.60");
        backArm.setAttribute("d", `M ${bSX.toFixed(1)},${bSY.toFixed(1)} L ${bElb.x.toFixed(1)},${bElb.y.toFixed(1)} L ${bHX.toFixed(1)},${bHY.toFixed(1)}`);
        shoulderPin.setAttribute("cx", fSX.toFixed(1));
        shoulderPin.setAttribute("cy", fSY.toFixed(1));
        shoulderPin.setAttribute("opacity", hasTorsoArmor ? "0" : "1");

        // Stage 5 Repulsor Gauntlets track wrists
        gauntletF.setAttribute("opacity", hasGauntlets ? "1" : "0");
        gauntletB.setAttribute("opacity", hasGauntlets ? (isSymStance ? "0.95" : "0.68") : "0");
        if (hasGauntlets) {
          gauntletF.setAttribute("transform", `translate(${fHX.toFixed(1)}, ${fHY.toFixed(1)})`);
          gauntletB.setAttribute("transform", `translate(${bHX.toFixed(1)}, ${bHY.toFixed(1)})`);
        }

        // Era 1 C-pincer claw (aligns forward along arm vector during belly-slide so it never pokes downward!)
        const pincerW = 1 - smooth(0.65, 0.95, evo);
        pincerEl.setAttribute("opacity", pincerW.toFixed(2));
        if (pincerW > 0.02) {
          const gap = 1.9 - pincerSnap * 1.35;
          if (isSliding || b1 === 1) {
            pincerEl.setAttribute("d", `M ${fHX.toFixed(1)},${fHY.toFixed(1)} l ${(-gap).toFixed(1)},-2.2 l 0,-1.4 M ${fHX.toFixed(1)},${fHY.toFixed(1)} l ${gap.toFixed(1)},-2.2 l 0,-1.4`);
          } else {
            pincerEl.setAttribute("d", `M ${fHX.toFixed(1)},${fHY.toFixed(1)} l 2.3,${(-gap).toFixed(1)} l 1.5,0 M ${fHX.toFixed(1)},${fHY.toFixed(1)} l 2.3,${gap.toFixed(1)} l 1.5,0`);
          }
        }

        // Crisp mechanical wrist/hand caps whenever bare robotic hands are visible (Era 2–4)
        const showBareHandF = !hasGauntlets && pincerW < 0.15 && wrenchW < 0.15;
        const showBareHandB = !hasGauntlets && headW > 0.3;
        handTipF.setAttribute("cx", fHX.toFixed(1));
        handTipF.setAttribute("cy", fHY.toFixed(1));
        handTipF.setAttribute("opacity", showBareHandF ? "1" : "0");
        handTipB.setAttribute("cx", bHX.toFixed(1));
        handTipB.setAttribute("cy", bHY.toFixed(1));
        handTipB.setAttribute("opacity", showBareHandB ? (armPose === "cot" ? "0.95" : "0.62") : "0");

        // Era 3 Sculpted open-end C-spanner wrench with warm-paper fill (reads cleanly over valve)
        wrenchEl.setAttribute("opacity", wrenchW.toFixed(2));
        if (wrenchW > 0.02) {
          wrenchEl.setAttribute("d", `M ${(fHX - 0.5).toFixed(1)},${(fHY - 2.3).toFixed(1)} L ${(fHX + 3.2).toFixed(1)},${(fHY - 2.3).toFixed(1)} L ${(fHX + 3.2).toFixed(1)},${(fHY - 1.1).toFixed(1)} L ${(fHX + 1.2).toFixed(1)},${(fHY - 1.1).toFixed(1)} L ${(fHX + 1.2).toFixed(1)},${(fHY + 1.1).toFixed(1)} L ${(fHX + 3.2).toFixed(1)},${(fHY + 1.1).toFixed(1)} L ${(fHX + 3.2).toFixed(1)},${(fHY + 2.3).toFixed(1)} L ${(fHX - 0.5).toFixed(1)},${(fHY + 2.3).toFixed(1)} Z`);
        }

        // Era 5 Iron Man luminous gradient palm repulsor plumes + jetpack + boot thrusters
        if (jetPower > 0.02) {
          const flick = 0.88 + 0.24 * Math.abs(Math.sin(now * 0.05));
          const jLen = (7.0 + jetPower * 11.5) * flick;
          const jW = 2.1 + jetPower * 0.65;
          const cLen = jLen * 0.52;
          const cW = jW * 0.42;
          repulsorJets.setAttribute("opacity", clamp01(jetPower * 1.25).toFixed(2));
          palmEmitterR.setAttribute("cx", fHX.toFixed(1));
          palmEmitterR.setAttribute("cy", (fHY + 1.0).toFixed(1));
          palmEmitterL.setAttribute("cx", bHX.toFixed(1));
          palmEmitterL.setAttribute("cy", (bHY + 1.0).toFixed(1));
          // Slight outward-angled Iron Man palm thrust plumes
          rightPalmJet.setAttribute("d", `M ${(fHX - jW).toFixed(1)},${(fHY + 1.0).toFixed(1)} Q ${(fHX + 1.4).toFixed(1)},${(fHY + jLen * 0.55).toFixed(1)} ${(fHX + 2.2).toFixed(1)},${(fHY + jLen).toFixed(1)} Q ${(fHX + 0.6).toFixed(1)},${(fHY + jLen * 0.55).toFixed(1)} ${(fHX + jW).toFixed(1)},${(fHY + 1.0).toFixed(1)} Z`);
          rightPalmCore.setAttribute("d", `M ${(fHX - cW).toFixed(1)},${(fHY + 1.0).toFixed(1)} L ${(fHX + cW).toFixed(1)},${(fHY + 1.0).toFixed(1)} L ${(fHX + 1.0).toFixed(1)},${(fHY + cLen).toFixed(1)} Z`);
          leftPalmJet.setAttribute("d", `M ${(bHX - jW).toFixed(1)},${(bHY + 1.0).toFixed(1)} Q ${(bHX - 0.6).toFixed(1)},${(bHY + jLen * 0.55).toFixed(1)} ${(bHX - 2.2).toFixed(1)},${(bHY + jLen).toFixed(1)} Q ${(bHX - 1.4).toFixed(1)},${(bHY + jLen * 0.55).toFixed(1)} ${(bHX + jW).toFixed(1)},${(bHY + 1.0).toFixed(1)} Z`);
          leftPalmCore.setAttribute("d", `M ${(bHX - cW).toFixed(1)},${(bHY + 1.0).toFixed(1)} L ${(bHX + cW).toFixed(1)},${(bHY + 1.0).toFixed(1)} L ${(bHX - 1.0).toFixed(1)},${(bHY + cLen).toFixed(1)} Z`);
          const pX = -6.2;
          const pY = hipY + 0.8;
          const pLen = (4.8 + jetPower * 10.5) * flick;
          packJet.setAttribute("d", `M ${(pX - 1.8).toFixed(1)},${pY.toFixed(1)} L ${(pX + 1.8).toFixed(1)},${pY.toFixed(1)} L ${pX.toFixed(1)},${(pY + pLen).toFixed(1)} Z`);
          const bLen = (4.5 + jetPower * 8.5) * flick;
          const fy1 = f1.y - totalLift + 0.2;
          const fy2 = f2.y - totalLift + 0.2;
          bootJetF.setAttribute("d", `M ${(f1.x - 1.4).toFixed(1)},${fy1.toFixed(1)} L ${(f1.x + 1.6).toFixed(1)},${fy1.toFixed(1)} L ${(f1.x + 0.1).toFixed(1)},${(fy1 + bLen).toFixed(1)} Z`);
          bootJetB.setAttribute("d", `M ${(f2.x - 1.2).toFixed(1)},${fy2.toFixed(1)} L ${(f2.x + 1.4).toFixed(1)},${fy2.toFixed(1)} L ${(f2.x + 0.1).toFixed(1)},${(fy2 + bLen * 0.82).toFixed(1)} Z`);
        } else {
          repulsorJets.setAttribute("opacity", "0");
        }

        // Era 1 Mode B ink skid-dashes behind sliding robot
        skidCooldown -= dt;
        if (isSliding && skidCooldown <= 0) {
          const s = skidPool[skidIdx % skidPool.length];
          skidIdx += 1;
          s.x = drawX - 9;
          s.yOff = (skidIdx % 2 === 0 ? -1.4 : -3.0);
          s.life = 0.42;
          skidCooldown = 0.11;
        }
        skidPool.forEach((s) => {
          if (s.life > 0) {
            s.life = Math.max(0, s.life - dt);
            const y = (BASE_Y + s.yOff).toFixed(1);
            const len = 4.5 + (1 - s.life / 0.42) * 3.5;
            s.el.setAttribute("x1", (s.x - len).toFixed(1));
            s.el.setAttribute("x2", s.x.toFixed(1));
            s.el.setAttribute("y1", y);
            s.el.setAttribute("y2", y);
            s.el.setAttribute("opacity", ((s.life / 0.42) * 0.36).toFixed(2));
          } else {
            s.el.setAttribute("opacity", "0");
          }
        });

        // Era 5 Evenly-spaced Tracing micro-dots behind engineer
        traceCooldown -= dt;
        if (isEquipped && moveSpeed > 10 && traceCooldown <= 0 && edgeFade > 0.4) {
          const p = tracePool[traceIdx % tracePool.length];
          traceIdx += 1;
          p.x = drawX - 5;
          p.life = 1.0;
          traceCooldown = 0.26;
        }
        tracePool.forEach((p) => {
          if (p.life > 0) {
            p.life = Math.max(0, p.life - dt);
            p.el.setAttribute("cx", p.x.toFixed(1));
            p.el.setAttribute("opacity", (p.life * 0.48).toFixed(2));
          } else {
            p.el.setAttribute("opacity", "0");
          }
        });

        // Click celebration spark
        clickSpark.setAttribute("opacity", clickHopTimer > 0.12 ? ((clickHopTimer - 0.12) / 0.38).toFixed(2) : "0");
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  initEvoWalker();
})();
