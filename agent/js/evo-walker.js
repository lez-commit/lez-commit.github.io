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

    const BASE_Y = 54;
    const S = 1.24; // Enlarged sculptural world scale (~41px tall robot, ~33px props — zero scroll!)
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

    // --- PROP 1 (Era 1 · 按脚本跑，无大脑): Clean Iconic Faceted Stone Cluster ---
    const prop1 = mk("g", { class: "evo-prop-hit", color: "#8A8275", opacity: "0.42" }, scenery);
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
    // Trip kick dust puffs (Era 1)
    const pebbleDust = mk("g", { opacity: "0" }, prop1);
    mk("circle", { cx: "7.0", cy: "-2.4", r: "1.2", fill: "#E4DDD0", stroke: "#1D1B18", "stroke-width": "0.75" }, pebbleDust);
    mk("circle", { cx: "10.0", cy: "-4.4", r: "0.9", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.7" }, pebbleDust);
    mk("line", { x1: "5.6", y1: "-5.2", x2: "8.4", y2: "-7.2", stroke: "#1D1B18", "stroke-width": "0.85", "stroke-linecap": "round" }, pebbleDust);

    // --- PROP 2 (Era 2 · 缸中之脑，会推理): 2.5D Glass Bell-Jar Brain-in-a-Vat with Swaying Nutrient Liquid & Bubbles ---
    const prop2 = mk("g", { class: "evo-prop-hit", color: "#8A8275", opacity: "0.42" }, scenery);
    mk("rect", { x: "-16", y: "-32", width: "32", height: "34", fill: "transparent" }, prop2);
    mk("ellipse", { cx: "0", cy: "0.4", rx: "12.8", ry: "1.2", fill: "#1D1B18", "fill-opacity": "0.11" }, prop2);
    // Stepped 2.5D scientific pedestal base
    mk("path", {
      d: "M -11.4,0 L -10.2,-2.4 L 10.2,-2.4 L 11.4,0 Z",
      fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "1.05", "stroke-linejoin": "round"
    }, prop2);
    mk("rect", {
      x: "-8.8", y: "-8.4", width: "17.6", height: "6.0", rx: "0.9",
      fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.1"
    }, prop2);
    // Right-side 2.5D depth shade on pedestal body
    mk("rect", { x: "5.2", y: "-8.0", width: "3.2", height: "5.2", rx: "0.4", fill: "#E4DDD0", "fill-opacity": "0.85" }, prop2);
    // Pedestal instrument vents & twin micro-conduits
    mk("rect", { x: "-6.6", y: "-6.8", width: "5.0", height: "2.8", rx: "0.5", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.7" }, prop2);
    mk("path", { d: "M 0.2,-6.2 L 5.8,-6.2 M 0.2,-4.6 L 4.4,-4.6", fill: "none", stroke: "currentColor", "stroke-width": "0.75", "stroke-linecap": "round" }, prop2);
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
    // Floating CRT Brain Head inside the Glass Vat (physically arcs onto the robot's neck in Era 2!)
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
    // Dual curved blown-glass reflection sheens + top brass finial knob
    mk("path", {
      d: "M -5.8,-21.4 A 6.2,6.2 0 0,1 -1.8,-25.6 M 6.4,-18.8 L 6.4,-12.2",
      fill: "none", stroke: "#FAF8F4", "stroke-width": "1.15", "stroke-linecap": "round", "stroke-opacity": "0.82"
    }, vatDomeGroup);
    mk("circle", { cx: "0", cy: "-29.4", r: "1.2", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.9" }, vatDomeGroup);
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

    // --- PROP 3 (Era 3 · 撞墙试错，接工具): 2.5D Side-Thickness Brick Wall + Deep Open Toolbox + Spiral Drill ---
    const prop3 = mk("g", { class: "evo-prop-hit", color: "#8A8275", opacity: "0.42" }, scenery);
    mk("rect", { x: "-36", y: "-32", width: "52", height: "34", fill: "transparent" }, prop3);
    // Classic 2.5D Toolbox cleanly spaced left of drill stance (ZERO foot overlap!)
    const toolRackGroup = mk("g", { transform: "translate(-27.0, 0)" }, prop3);
    mk("ellipse", { cx: "0.5", cy: "0.35", rx: "7.2", ry: "1.0", fill: "#1D1B18", "fill-opacity": "0.11" }, toolRackGroup);
    // Open interior depth tray visible when lid flips up!
    const toolBoxCavity = mk("polygon", { points: "-5.2,-8.2 -3.6,-9.6 6.8,-9.6 5.4,-8.2", fill: "#D7CEC0", stroke: "currentColor", "stroke-width": "0.75", "stroke-linejoin": "round", opacity: "0" }, toolRackGroup);
    // 2.5D right-side thickness bevel on toolbox body
    mk("polygon", { points: "5.2,-8.2 7.0,-7.3 7.0,-0.8 5.2,0", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.9", "stroke-linejoin": "round" }, toolRackGroup);
    // Toolbox base body + front latch
    mk("rect", { x: "-5.4", y: "-8.2", width: "10.8", height: "8.2", rx: "1.0", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "1.05" }, toolRackGroup);
    mk("rect", { x: "-4.9", y: "-4.2", width: "9.8", height: "3.7", rx: "0.5", fill: "#EDE8DE" }, toolRackGroup);
    mk("rect", { x: "-1.3", y: "-7.2", width: "2.6", height: "2.2", rx: "0.4", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.8" }, toolRackGroup);
    const rackPortLed = mk("circle", { cx: "0", cy: "-6.1", r: "0.55", fill: "#2D6A47", opacity: "0.85" }, toolRackGroup);
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
      d: "M -8,-21.0 L 8,-21.0 M -8,-16.0 L 8,-16.0 M -8,-10.8 L 8,-10.8 M -8,-5.5 L 8,-5.5 M 0,-26.2 L 0,-21.0 M -3.6,-21.0 L -3.6,-16.0 M 3.8,-21.0 L 3.8,-16.0 M -1.4,-16.0 L -1.4,-10.8 M 3.6,-16.0 L 3.6,-10.8 M -4.2,-10.8 L -4.2,-5.5 M 0.8,-10.8 L 0.8,-5.5 M 0.2,-5.5 L 0.2,0",
      fill: "none", stroke: "currentColor", "stroke-width": "0.75", "stroke-opacity": "0.8"
    }, wallBody);
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

    // Drilling bamboo sparks + dust puffs at drill contact point
    const wallTorqueArcs = mk("g", { opacity: "0" }, prop3);
    mk("path", {
      d: "M -8.6,-15.6 L -12.6,-18.8 M -8.8,-13.4 L -13.4,-13.8 M -8.6,-11.2 L -12.2,-8.4 M -6.8,-16.8 L -8.4,-20.6",
      fill: "none", stroke: "#2D6A47", "stroke-width": "1.15", "stroke-linecap": "round"
    }, wallTorqueArcs);
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
    const prop4 = mk("g", { class: "evo-prop-hit", color: "#8A8275", opacity: "0.42" }, scenery);
    mk("rect", { x: "-20", y: "-36", width: "42", height: "38", fill: "transparent" }, prop4);
    // Crisp dual-optic vision scan cone projected from robot goggles onto the big desktop monitor!
    const gateScanBeam = mk("g", { opacity: "0" }, prop4);
    mk("polygon", { points: "-15.4,-25.2 -0.6,-22.2 -0.6,-15.2", fill: "url(#evo-scan-beam)" }, gateScanBeam);
    mk("line", { x1: "-15.4", y1: "-25.2", x2: "-0.6", y2: "-22.2", stroke: "#2D6A47", "stroke-width": "0.9", "stroke-opacity": "0.85" }, gateScanBeam);
    mk("line", { x1: "-15.4", y1: "-25.2", x2: "-0.6", y2: "-15.2", stroke: "#2D6A47", "stroke-width": "0.9", "stroke-opacity": "0.75" }, gateScanBeam);
    mk("line", { x1: "-15.4", y1: "-25.2", x2: "-0.6", y2: "-18.7", stroke: "#2D6A47", "stroke-width": "0.75", "stroke-dasharray": "2 2", "stroke-opacity": "0.85" }, gateScanBeam);
    // Subtle mint screen-glow wash cast leftward while actively typing/working!
    const deskScreenGlow = mk("polygon", { points: "-0.6,-23.2 -12.6,-21.0 -12.6,-12.2 -0.6,-15.2", fill: "#2D6A47", "fill-opacity": "0.09", opacity: "0" }, prop4);

    // 2.5D Architectural Minimalist Desk (with grounded AO + subtle right-side leg depth + coffee mug corner!)
    mk("ellipse", { cx: "2.2", cy: "0.4", rx: "16.0", ry: "1.2", fill: "#1D1B18", "fill-opacity": "0.11" }, prop4);
    mk("line", { x1: "-10.4", y1: "-10.4", x2: "-10.4", y2: "0", stroke: "currentColor", "stroke-width": "1.2", "stroke-linecap": "round" }, prop4);
    mk("line", { x1: "14.4", y1: "-10.4", x2: "14.4", y2: "0", stroke: "currentColor", "stroke-width": "1.2", "stroke-linecap": "round" }, prop4);
    mk("line", { x1: "-10.4", y1: "-3.6", x2: "14.4", y2: "-3.6", stroke: "currentColor", "stroke-width": "0.7", "stroke-opacity": "0.45" }, prop4);
    mk("rect", { x: "-12.2", y: "-12.0", width: "29.4", height: "2.1", rx: "0.7", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "1.05" }, prop4);
    mk("line", { x1: "-11.4", y1: "-11.3", x2: "16.0", y2: "-11.3", stroke: "#FAF8F4", "stroke-width": "0.65", "stroke-linecap": "round", "stroke-opacity": "0.75" }, prop4);

    // Tiny Steaming Architect's Coffee Mug cleanly clear on far right corner of desk!
    mk("rect", { x: "13.3", y: "-14.7", width: "2.5", height: "2.7", rx: "0.5", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "0.8" }, prop4);
    mk("path", { d: "M 15.8,-14.1 Q 16.9,-14.1 16.9,-13.3 Q 16.9,-12.5 15.8,-12.5", fill: "none", stroke: "currentColor", "stroke-width": "0.72", "stroke-linecap": "round" }, prop4);
    const mugSteam1 = mk("path", { d: "M 14.0,-15.4 Q 13.5,-16.6 14.1,-17.7", fill: "none", stroke: "currentColor", "stroke-width": "0.6", "stroke-linecap": "round", opacity: "0.48" }, prop4);
    const mugSteam2 = mk("path", { d: "M 15.1,-15.3 Q 15.6,-16.4 15.0,-17.4", fill: "none", stroke: "currentColor", "stroke-width": "0.55", "stroke-linecap": "round", opacity: "0.42" }, prop4);

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

    // Floating 3-Node State-Machine Chain cleanly above the monitor (○ -> || -> ●, fades cleanly after completion!)
    const stateFlowGroup = mk("g", { opacity: "0" }, prop4);
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
    const prop5 = mk("g", { class: "evo-prop-hit", color: "#8A8275", opacity: "0.42" }, scenery);
    mk("rect", { x: "-21", y: "-30", width: "42", height: "32", fill: "transparent" }, prop5);
    mk("ellipse", { cx: "0", cy: "0.45", rx: "19.6", ry: "1.35", fill: "#1D1B18", "fill-opacity": "0.12" }, prop5);
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
    // Articulated Swing-Open Mechanical Launch Clamps (unlock & swing outward when harness locks in!)
    const gantryClampL = mk("g", null, prop5);
    mk("path", { d: "M -15.4,-17.2 L -11.4,-17.2 L -10.8,-15.6 L -15.4,-15.6 Z", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.8", "stroke-linejoin": "round" }, gantryClampL);
    mk("circle", { cx: "-15.4", cy: "-16.4", r: "0.9", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "0.75" }, gantryClampL);
    const gantryClampR = mk("g", null, prop5);
    mk("path", { d: "M 15.2,-17.2 L 11.2,-17.2 L 10.6,-15.6 L 15.2,-15.6 Z", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.8", "stroke-linejoin": "round" }, gantryClampR);
    mk("circle", { cx: "15.2", cy: "-16.4", r: "0.9", fill: "#FAF8F4", stroke: "currentColor", "stroke-width": "0.75" }, gantryClampR);
    const gantryBeaconL = mk("circle", { cx: "-15.4", cy: "-25.2", r: "1.15", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.8" }, prop5);
    const gantryBeaconR = mk("circle", { cx: "15.2", cy: "-25.2", r: "1.15", fill: "#E4DDD0", stroke: "currentColor", "stroke-width": "0.8" }, prop5);
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

    // Back volumetric mechanical leg (thigh + shin + knee joint) + capsule foot + Stage 5 back boot + back volumetric arm
    const backLegGroup = mk("g", { opacity: "0.78" }, botBody);
    const backThigh = mk("path", { fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.85", "stroke-linejoin": "round" }, backLegGroup);
    const backShin = mk("path", { fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.85", "stroke-linejoin": "round" }, backLegGroup);
    const kneeJoint2 = mk("circle", { r: "1.05", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.78", opacity: "0" }, backLegGroup);
    const backFoot = mk("path", { fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.95", "stroke-linejoin": "round" }, botBody);
    const bootB = mk("path", { d: "M -1.7,-4.0 L 1.6,-4.0 L 2.5,0 L -1.9,0 Z", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.95", "stroke-linejoin": "round", opacity: "0" }, botBody);
    const backArmGroup = mk("g", { opacity: "0.76" }, botBody);
    const backUpperArm = mk("path", { fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.82", "stroke-linejoin": "round" }, backArmGroup);
    const backForeArm = mk("path", { fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.82", "stroke-linejoin": "round" }, backArmGroup);
    const elbowJointB = mk("circle", { r: "0.85", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.72", opacity: "0" }, backArmGroup);
    const gauntletB = mk("rect", { x: "-2.0", y: "-2.1", width: "4.0", height: "3.1", rx: "0.85", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.95", opacity: "0" }, botBody);

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

    // Front volumetric mechanical leg (thigh + shin + knee joint rivet) + capsule front foot + Stage 5 front boot
    const frontThigh = mk("path", { fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.95", "stroke-linejoin": "round" }, botBody);
    const frontShin = mk("path", { fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.95", "stroke-linejoin": "round" }, botBody);
    const frontFoot = mk("path", { fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.0", "stroke-linejoin": "round" }, botBody);
    const kneeJoint1 = mk("circle", { r: "1.1", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.82", opacity: "0" }, botBody);
    const bootF = mk("path", { d: "M -1.7,-4.1 L 1.8,-4.1 L 2.8,0 L -1.9,0 Z", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.0", "stroke-linejoin": "round", opacity: "0" }, botBody);

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
    // Stage 1-3 single-eye visor screen + CRT boot scanline + expressive micro-expressions
    const visorScreen = mk("rect", { x: "-1.8", y: "-2.8", width: "6.6", height: "4.8", rx: "1.5", fill: "#1D1B18" }, headGroup);
    const visorGlint1 = mk("line", { x1: "-0.7", y1: "-1.8", x2: "0.2", y2: "-1.8", stroke: "#FAF8F4", "stroke-width": "0.7", "stroke-opacity": "0.35", "stroke-linecap": "round" }, headGroup);
    const crtBootLine = mk("line", { x1: "-1.2", y1: "-0.4", x2: "4.2", y2: "-0.4", stroke: "#B5F5D4", "stroke-width": "1.1", "stroke-linecap": "round", opacity: "0" }, headGroup);
    const eyeEl = mk("circle", { cx: "2.3", cy: "-0.4", r: "1.15", fill: "#FAF8F4" }, headGroup);
    // Determined narrowed focus eye during Era 3 drilling!
    const eyeFocus = mk("rect", { x: "0.9", y: "-0.95", width: "2.7", height: "1.15", rx: "0.55", fill: "#B5F5D4", opacity: "0" }, headGroup);
    // Expressive wince eye (> < / ×) for Era 1 trip & Era 3 bonk
    const eyeWince = mk("path", {
      d: "M 1.4,-1.2 L 3.1,0.4 M 3.1,-1.2 L 1.4,0.4",
      fill: "none", stroke: "#FAF8F4", "stroke-width": "1.0", "stroke-linecap": "round", opacity: "0"
    }, headGroup);
    // Orbiting mini dizzy stars above head right after Era 3 bonk!
    const dizzyStars = mk("g", { opacity: "0" }, headGroup);
    mk("path", { d: "M -4.2,-7.6 L -3.0,-7.6 M -3.6,-8.2 L -3.6,-7.0", stroke: "#B83B2A", "stroke-width": "0.9", "stroke-linecap": "round" }, dizzyStars);
    mk("path", { d: "M 3.0,-6.8 L 4.2,-6.8 M 3.6,-7.4 L 3.6,-6.2", stroke: "#1D1B18", "stroke-width": "0.85", "stroke-linecap": "round" }, dizzyStars);
    // Stage 4-5 panoramic dual-optic visor + expressive typing eyes + happy victory arcs!
    const gogglesEl = mk("rect", {
      x: "-2.4", y: "-3.1", width: "7.8", height: "5.2", rx: "1.7",
      fill: "#1D1B18", stroke: "#1D1B18", "stroke-width": "0.95", opacity: "0"
    }, headGroup);
    const visorGlint2 = mk("line", { x1: "-1.2", y1: "-2.0", x2: "-0.1", y2: "-2.0", stroke: "#FAF8F4", "stroke-width": "0.7", "stroke-opacity": "0.32", "stroke-linecap": "round", opacity: "0" }, headGroup);
    const goggleEye = mk("g", { opacity: "0" }, headGroup);
    const gEyeL = mk("circle", { cx: "0.3", cy: "-0.5", r: "1.1", fill: "#FAF8F4" }, goggleEye);
    const gEyeR = mk("circle", { cx: "3.4", cy: "-0.5", r: "1.1", fill: "#FAF8F4" }, goggleEye);
    const goggleHappy = mk("path", {
      d: "M -0.8,0.1 Q 0.3,-1.6 1.4,0.1 M 2.3,0.1 Q 3.4,-1.6 4.5,0.1",
      fill: "none", stroke: "#B5F5D4", "stroke-width": "1.15", "stroke-linecap": "round", opacity: "0"
    }, headGroup);
    // Stage 5: Sleek Mech V-Crest & Side Ear-Fin (original design preserved!)
    const headCrestEl = mk("g", { opacity: "0" }, headGroup);
    mk("path", { d: "M -4.4,-4.6 L 0.4,-7.3 L 5.0,-4.6 M -6.9,-2.2 L -8.8,-4.3 L -6.5,0.8", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.1", "stroke-linecap": "round", "stroke-linejoin": "round" }, headCrestEl);

    // Front volumetric mechanical arm (upper arm + forearm + elbow & shoulder bushings) + attachments + Stage 5 Repulsor Gauntlets
    const frontUpperArm = mk("path", { fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.9", "stroke-linejoin": "round" }, botBody);
    const frontForeArm = mk("path", { fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.9", "stroke-linejoin": "round" }, botBody);
    const elbowJointF = mk("circle", { r: "0.9", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.78", opacity: "0" }, botBody);
    const shoulderPin = mk("circle", { r: "1.15", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.85" }, botBody);
    const handTipB = mk("circle", { r: "1.05", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.85", opacity: "0" }, botBody);
    const handTipF = mk("circle", { r: "1.15", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.9", opacity: "0" }, botBody);
    const pincerEl = mk("path", { fill: "none", stroke: "#1D1B18", "stroke-width": "1.2", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: "1" }, botBody);
    // Era 3 Big Spiral Mechanical Drill attachment (snaps straight onto forearm!)
    const drillGroup = mk("g", { opacity: "0" }, botBody);
    mk("rect", { x: "-1.0", y: "-2.3", width: "3.8", height: "4.6", rx: "0.9", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "1.0" }, drillGroup);
    mk("polygon", { points: "2.8,-2.4 10.6,0 2.8,2.4", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.05", "stroke-linejoin": "round" }, drillGroup);
    const drillFlutes = mk("path", { d: "M 4.4,-1.9 L 5.2,1.9 M 6.8,-1.2 L 7.4,1.2", fill: "none", stroke: "#2D6A47", "stroke-width": "0.95", "stroke-linecap": "round" }, drillGroup);
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

    // Solid volumetric tapered mechanical limb capsule (replaces flat stick-figure lines!)
    function capsuleSegPath(x1, y1, x2, y2, r1, r2) {
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
    // Pixar walk-stop momentum lean-and-settle damped spring!
    let prevMoveSpeed = 0;
    let velLean = 0;
    let velLeanVel = 0;

    // 5-beat state machine per cycle
    let b1 = 0, b1t = 0; // Era 1 pebble: 0=jog, 1=trip, 2=long belly-slide into Era 2, 3=pop up, 4=done
    let b2 = 0, b2t = 0; // Era 2 desk:   0=approach, 1=read+CoT(0.95s), 2=done
    let b3 = 0, b3t = 0; // Era 3 wall:   0=approach, 1=bonk+recoil+wrench+turn+sink(1.42s), 2=done
    let b4 = 0, b4t = 0; // Era 4 gate:   0=approach, 1=press+0.25s freeze+lift(1.02s), 2=done
    let b5 = 0, b5t = 0; // Era 5 pad:    0=approach, 1=dock harness(1.22s), 2=walk to launch pad, 3=ignition & liftoff, 4=airborne handoff (waiting for dock)
    let waitingForDock = false;
    let handoffStarted = false;
    let handoffTrailT = 0;
    let restingCompleted = false; // Calm post-ceremony resting state (no distracting infinite loop; click any era prop/dot to replay!)

    const skeletonGridEl = document.getElementById("skeleton-grid");
    let lastActiveEra = -1;
    let lastBeatActive = false;

    function syncEraCaptions(activeIdx, isBeat) {
      if (activeIdx === lastActiveEra && isBeat === lastBeatActive) return;
      lastActiveEra = activeIdx;
      lastBeatActive = isBeat;
      if (!skeletonGridEl) return;
      const cols = skeletonGridEl.querySelectorAll(".era-col");
      cols.forEach((col, i) => {
        const isAct = i === activeIdx;
        col.classList.toggle("is-era-active", isAct);
        col.classList.toggle("is-era-beat", isAct && isBeat);
      });
    }

    AgentBlog.onMechDocked = () => {
      if (waitingForDock) {
        waitingForDock = false;
        restingCompleted = true;
        syncEraCaptions(-1, false);
      }
    };

    let wallBroken = false;  // Era 3 brick wall shattered cleanly into rubble stumps!
    let taskDone = false;    // Era 4 computer monitor shows permanent luminous bamboo ✓!
    let hasBrain = false;   // Physical brain docked from Era 2 Glass Vat!
    let hasWrench = false;  // Physical spiral drill equipped from Era 3 Toolbox!
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
      wallBroken = false;
      taskDone = false;
      hasBrain = false;
      hasWrench = false;
      isEquipped = false;
      claspRippleTimer = 0;
      lockSparkTimer = 0;
      gateRippleTimer = 0;
      brainDockTimer = 0;
      toolSnapTimer = 0;
      resetWaitTimer = 0;
      prevMoveSpeed = 0;
      velLean = 0;
      velLeanVel = 0;
      waitingForDock = false;
      handoffStarted = false;
      handoffTrailT = 0;
      restingCompleted = false;
      skidPool.forEach((p) => { p.life = 0; p.el.setAttribute("opacity", "0"); });
      launchShock.setAttribute("opacity", "0");
      sonicRing.setAttribute("opacity", "0");
      launchTrail.setAttribute("opacity", "0");
      launchTrailL.setAttribute("opacity", "0");
      launchTrailR.setAttribute("opacity", "0");
      assembleLayer.setAttribute("opacity", "0");
      lockSparks.setAttribute("opacity", "0");
    }

    // Interactive on-demand summon: click any Era prop or spine-dot to replay from that era!
    function summonWalkerAtEra(eraIdx) {
      const w = evoLayerEl.clientWidth || 1280;
      const startX = 14;
      const endX = Math.max(240, w - 18);
      const span = endX - startX;
      const anchors = [
        startX,
        startX + span * 0.31 - 56 * S,
        startX + span * 0.51 - 56 * S,
        startX + span * 0.71 - 56 * S,
        startX + span * 0.89 - 46 * S
      ];
      resetCycle(startX);
      const idx = Math.max(0, Math.min(4, eraIdx || 0));
      posX = Math.max(startX, anchors[idx]);
      if (idx >= 1) { b1 = 4; }
      if (idx >= 2) { b2 = 2; hasBrain = true; }
      if (idx >= 3) { b3 = 2; hasWrench = false; wallBroken = true; }
      if (idx >= 4) { b4 = 2; taskDone = true; }
      botGroup.setAttribute("opacity", "1");
    }

    [prop1, prop2, prop3, prop4, prop5].forEach((propEl, idx) => {
      propEl.setAttribute("data-era-idx", String(idx));
      const titleNode = mk("title", null, propEl);
      titleNode.textContent = "点击召唤机器人从此时代演进";
      propEl.addEventListener("click", (e) => {
        e.stopPropagation();
        summonWalkerAtEra(idx);
      });
    });

    if (skeletonGridEl) {
      const dots = skeletonGridEl.querySelectorAll(".spine-dot");
      dots.forEach((dot, idx) => {
        dot.setAttribute("title", "点击召唤机器人从此时代演进");
        dot.addEventListener("click", (e) => {
          e.stopPropagation();
          summonWalkerAtEra(idx);
        });
      });
    }

    AgentBlog.summonWalkerAtEra = summonWalkerAtEra;

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

        // Calm post-ceremony resting state: keep all 5 resolved props neatly positioned & quiet until user summons!
        if (restingCompleted) {
          botGroup.setAttribute("opacity", "0");
          syncEraCaptions(-1, false);
          const setRestProp = (el, px) => {
            el.setAttribute("transform", `translate(${px.toFixed(1)}, ${BASE_Y}) scale(${S})`);
            el.setAttribute("opacity", "0.52");
            el.setAttribute("color", "#7C7468");
          };
          setRestProp(prop1, x1);
          setRestProp(prop2, x2);
          setRestProp(prop3, x3);
          setRestProp(prop4, x4);
          setRestProp(prop5, x5);
          launchShock.setAttribute("opacity", "0");
          sonicRing.setAttribute("opacity", "0");
          launchTrail.setAttribute("opacity", "0");
          launchTrailL.setAttribute("opacity", "0");
          launchTrailR.setAttribute("opacity", "0");
          requestAnimationFrame(tick);
          return;
        }

        // End-of-cycle breath pause before settling cleanly
        if (resetWaitTimer > 0) {
          resetWaitTimer = Math.max(0, resetWaitTimer - dt);
          botGroup.setAttribute("opacity", "0");
          syncEraCaptions(-1, false);
          if (resetWaitTimer <= 0) restingCompleted = true;
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

        const launchX = Math.max(x5 + 34 * S, endX - 24 * S);

        // Trigger each era's silent-film beat once per cycle
        if (b1 === 0 && posX >= x1 - 7.5 * S) { b1 = 1; b1t = 0; }
        if (b2 === 0 && posX >= x2 - 18.0 * S){ b2 = 1; b2t = 0; }
        if (b3 === 0 && posX >= x3 - 13.0 * S){ b3 = 1; b3t = 0; }
        if (b4 === 0 && posX >= x4 - 16.5 * S){ b4 = 1; b4t = 0; }
        if (b5 === 0 && posX >= x5 - 1.0 * S) { b5 = 1; b5t = 0; }
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

        let activeEraIdx = Math.min(4, Math.floor(progress * 5));
        let isEraBeat = false;
        let epiphanyNow = false;
        let awakeNow = false;

        if (clickHopTimer > 0 && b5 !== 3) {
          clickHopTimer = Math.max(0, clickHopTimer - dt);
          moveSpeed = 0;
          beatHopH = Math.sin((clickHopTimer / 0.5) * Math.PI) * 7.5;
        } else if (b1 === 1) {
          // Era 1 Step 1 (Restored Original Snappy Beat!): Immediate jog-trip over stone into flat Superman belly-slide!
          b1t += dt;
          activeEraIdx = 0;
          isEraBeat = true;
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
          activeEraIdx = 0;
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
          activeEraIdx = 1;
          const u = clamp01(b1t / 0.34);
          const ease = u * u * (3 - 2 * u);
          posX += lerp(30, 54, ease) * dt;
          moveSpeed = lerp(30, 54, ease);
          bodyRollDeg = lerp(78, 0, ease);
          bodyDropY = lerp(-2.6, 0, ease);
          beatHopH = Math.sin(u * Math.PI) * 3.0;
          if (b1t >= 0.34) b1 = 4;
        } else if (b2 === 1) {
          // Era 2 Beat (缸中之脑，会推理): Bell-jar lifts -> Brain docks -> 0.26s awakening blink & glance at hands -> 3-step CoT!
          b2t += dt;
          activeEraIdx = 1;
          isEraBeat = true;
          moveSpeed = 0;
          if (b2t < 0.72) {
            extraLean = 4;
            armPose = "walk";
          } else if (b2t < 0.98) {
            if (!hasBrain) {
              hasBrain = true;
              brainDockTimer = 0.28;
            }
            awakeNow = true;
            armPose = "awake";
            extraLean = 5;
            headNodDeg = 11 * Math.sin(clamp01((b2t - 0.72) / 0.26) * Math.PI);
          } else {
            armPose = "cot";
            extraLean = 4;
            headNodDeg = b2t > 1.26 ? Math.sin((b2t - 1.26) * 18) * 9 : 4;
          }
          if (b2t >= 1.62) b2 = 2;
        } else if (b3 === 1) {
          // Era 3 Beat (撞墙试错，接工具): BONK -> recoil cleanly left of Toolbox -> pop open -> snap Spiral Drill -> kiss wall & SHATTER!
          b3t += dt;
          activeEraIdx = 2;
          isEraBeat = true;
          moveSpeed = 0;
          if (b3t < 0.34) {
            const u = b3t / 0.34;
            visualDX = -Math.sin(u * Math.PI * 0.5) * 23.0;
            extraLean = -44 * (1 - u * 0.35);
            beatHopH = Math.sin(u * Math.PI) * 1.8;
            armPose = "bonk";
          } else if (b3t < 0.58) {
            // Brief epiphany beat: head shake -> toolbox lid flips cleanly upright -> antenna flashes bamboo green!
            const u = (b3t - 0.34) / 0.24;
            visualDX = -23.0;
            extraLean = 4;
            armPose = "epiphany";
            epiphanyNow = u > 0.35;
            headNodDeg = u < 0.5 ? Math.sin(u * Math.PI * 4) * 8 : -5;
          } else if (b3t < 0.94) {
            // Reach cleanly into open toolbox & snap big Spiral Drill onto forearm!
            visualDX = -23.0;
            extraLean = 6;
            armPose = "grabTool";
            if (b3t >= 0.74 && !hasWrench) {
              hasWrench = true;
              toolSnapTimer = 0.28;
            }
          } else if (b3t < 1.18) {
            // Step confidently clear of toolbox right up to brick wall with Spiral Drill armed!
            const u = (b3t - 0.94) / 0.24;
            visualDX = lerp(-23.0, -5.2, u);
            extraLean = 6;
            armPose = "wrench";
          } else if (b3t < 1.56) {
            // DRILL INTO BRICK WALL! Drill cone kisses left brick face dead-on with vibration & jagged crack!
            visualDX = -5.2 + Math.sin(b3t * 85) * 0.9;
            extraLean = 9;
            armPose = "wrench";
          } else {
            // SHATTER! Wall bursts cleanly into jagged rubble with celebratory follow-through step & micro bounce!
            if (!wallBroken) wallBroken = true;
            const fu = clamp01((b3t - 1.56) / 0.24);
            const fEase = 1 - Math.pow(1 - fu, 3);
            visualDX = lerp(-5.2, -3.2, fEase);
            beatHopH = Math.sin(fu * Math.PI) * 1.4;
            extraLean = lerp(12, 3, fEase);
            armPose = "wrench";
          }
          if (b3t >= 1.92) {
            wallBroken = true;
            b3 = 2;
          }
        } else if (b4 === 1) {
          // Era 4 Beat (手眼脑通，状态机): Eye scans monitor (S1) -> Both hands rapidly type on keyboard (S2) -> 0.28s || freeze -> S3 & big ✓ on screen!
          b4t += dt;
          activeEraIdx = 3;
          isEraBeat = true;
          moveSpeed = 0;
          if (b4t < 0.34) {
            armPose = "scan";
          } else if (b4t < 0.82) {
            armPose = "type";
            extraLean = 7;
          } else if (b4t < 1.10) {
            armPose = "type";
            extraLean = 7;
            freezeAll = true;
          } else {
            if (!taskDone) {
              taskDone = true;
              gateRippleTimer = 0.52;
            }
            armPose = b4t < 1.24 ? "type" : "walk";
            extraLean = b4t < 1.24 ? 5 : 0;
            headNodDeg = b4t >= 1.24 ? Math.sin(clamp01((b4t - 1.24) / 0.30) * Math.PI) * 8 : 0;
          }
          if (b4t >= 1.56) {
            taskDone = true;
            b4 = 2;
          }
        } else if (b5 === 1) {
          // Era 5 Beat A: Modular Armor Convergence (7 pieces fly in & lock on!)
          b5t += dt;
          activeEraIdx = 4;
          isEraBeat = true;
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
          // Era 5 Beat B: Anticipation crouch (0..0.32s) -> Stabilized hover poise (0.32..0.68s) -> Snap liftoff inside viewport!
          b5t += dt;
          activeEraIdx = 4;
          isEraBeat = true;
          moveSpeed = 0;
          armPose = "launch";
          const alreadyDocked = !!(AgentBlog.isAvatarDocked && AgentBlog.isAvatarDocked());
          if (b5t < 0.32) {
            const u = clamp01(b5t / 0.32);
            crouchY = Math.sin(u * Math.PI * 0.5) * 3.1;
            // Subtle high-frequency thruster ignition shudder during anticipation crouch!
            visualDX = Math.sin(b5t * 115) * u * 0.45;
            jetPower = u * 0.95;
          } else if (b5t < 0.68) {
            const u = clamp01((b5t - 0.32) / 0.36);
            crouchY = lerp(3.1, 0, clamp01(u * 3.2));
            const ease = 1 - Math.pow(1 - Math.min(1, u * 1.45), 3);
            launchLiftY = ease * 13.5 + Math.sin(u * Math.PI * 2.4) * 0.55;
            jetPower = 1.05 + u * 0.35;
          } else if (!alreadyDocked) {
            // Cycle 1 Hero Liftoff: ZERO off-screen exit! Hand off exact screen coords to the SAME robot in mech-avatar.js!
            crouchY = 0;
            launchLiftY = 13.5;
            jetPower = 1.4;
            if (!handoffStarted) {
              handoffStarted = true;
              waitingForDock = true;
              handoffTrailT = 0;
              b5 = 4;
              syncEraCaptions(-1, false);
              const lr = evoLayerEl.getBoundingClientRect();
              const worldX = lr.left + posX;
              const worldY = lr.top + BASE_Y - (launchLiftY + 17.5) * S;
              botGroup.setAttribute("opacity", "0");
              if (typeof AgentBlog.onMechLiftoff === "function") {
                AgentBlog.onMechLiftoff({ x: worldX, y: worldY, padX: lr.left + launchX, padY: lr.top + BASE_Y });
              } else if (typeof AgentBlog.onMechExitedTop === "function") {
                AgentBlog.onMechExitedTop();
              }
            }
          } else {
            // Summoned replay (avatar already docked): graceful in-viewport ascent & sky dissolve sync pulse, then settle calm!
            const au = clamp01((b5t - 0.68) / 0.88);
            crouchY = 0;
            launchLiftY = 13.5 + Math.pow(au, 1.85) * 185;
            jetPower = 1.25 * (1 - au * 0.5);
            if (b5t >= 1.56) {
              resetWaitTimer = 0.6;
              syncEraCaptions(-1, false);
              if (typeof AgentBlog.onMechExitedTop === "function") {
                AgentBlog.onMechExitedTop();
              }
            }
          }
        } else if (b5 === 4) {
          // Single robot is airborne & patrolling -> keep runway quiet until docked!
          b5t += dt;
          handoffTrailT += dt;
          activeEraIdx = -1;
          moveSpeed = 0;
          if (!waitingForDock || b5t >= 9.5) {
            waitingForDock = false;
            restingCompleted = true;
            syncEraCaptions(-1, false);
          }
        } else {
          posX += baseSpeed * dt;
        }

        syncEraCaptions(activeEraIdx, isEraBeat);

        if (claspRippleTimer > 0) claspRippleTimer = Math.max(0, claspRippleTimer - dt);
        if (lockSparkTimer > 0) lockSparkTimer = Math.max(0, lockSparkTimer - dt);
        if (gateRippleTimer > 0) gateRippleTimer = Math.max(0, gateRippleTimer - dt);
        if (brainDockTimer > 0) brainDockTimer = Math.max(0, brainDockTimer - dt);
        if (toolSnapTimer > 0) toolSnapTimer = Math.max(0, toolSnapTimer - dt);

        if (posX >= endX && b5 !== 3 && b5 !== 4) {
          resetWaitTimer = 1.4;
        }

        const drawX = posX + visualDX * S;

        // =================================================================
        // SMOOTH SPOTLIGHT FOCUS: Muted ink (0.40, #8A8275) -> Crisp ink (0.96, #1D1B18)
        // =================================================================
        const setPropFocus = (el, px) => {
          const near = clamp01(1 - Math.abs(drawX - px) / (86 * S));
          const easedNear = near * near * (3 - 2 * near);
          el.setAttribute("transform", `translate(${px.toFixed(1)}, ${BASE_Y}) scale(${S})`);
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

        // Prop 2 updates (缸中之脑，会推理): Swaying bamboo nutrient liquid, rising micro-bubbles, bell-jar lift, brain arc, 3-step CoT
        const vatIdleBob = Math.sin(now * 0.0035) * 0.7;
        const reasoningNow = b2 === 1 && b2t >= 0.98;
        const brainInVat = b2 === 0 || (b2 === 1 && b2t < 0.34);
        const liqLevel = brainInVat ? -16.8 : (b2 === 1 && b2t < 0.72 ? lerp(-16.8, -12.6, clamp01((b2t - 0.34) / 0.38)) : -12.6);
        const waveAmp = brainInVat ? 0.75 : 0.28;
        const wL = (liqLevel + Math.sin(now * 0.0042) * waveAmp).toFixed(2);
        const wM = (liqLevel - Math.cos(now * 0.0042) * (waveAmp * 1.15)).toFixed(2);
        const wR = (liqLevel - Math.sin(now * 0.0042) * waveAmp).toFixed(2);
        vatLiquidFill.setAttribute("d", `M -7.6,-10.3 L -7.6,${wL} Q 0,${wM} 7.6,${wR} L 7.6,-10.3 Z`);
        vatMeniscus.setAttribute("d", `M -7.4,${wL} Q 0,${wM} 7.4,${wR}`);
        vatLiquidGroup.setAttribute("opacity", b2 === 2 ? "0.48" : "0.95");
        vatBubbles.forEach((bEl, bi) => {
          const cycle = ((now * 0.00055 + bi * 0.34) % 1);
          const by = -11.0 - cycle * (brainInVat ? 6.2 : 1.6);
          const bx = (bi === 0 ? -4.5 : bi === 1 ? 4.6 : 1.0) + Math.sin(now * 0.004 + bi * 2.1) * 0.55;
          bEl.setAttribute("cx", bx.toFixed(1));
          bEl.setAttribute("cy", by.toFixed(1));
          bEl.setAttribute("opacity", (Math.sin(cycle * Math.PI) * (brainInVat ? 0.78 : 0.22)).toFixed(2));
        });
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
            const rt = b2t - 0.98;
            const fadeOut = 1 - smooth(0.52, 0.64, rt);
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

        // Prop 3 updates (撞墙试错，接工具): Toolbox lid pop-open, drill rise/pickup, wall shudder & crack -> dramatic brick shatter!
        const boxOpen = (b3 === 1 && b3t >= 0.40) || b3 === 2;
        const lidAngle = b3 === 1
          ? -92 * smooth(0.40, 0.58, b3t)
          : b3 === 2
          ? -92
          : 0;
        toolBoxLid.setAttribute("transform", `rotate(${lidAngle.toFixed(1)}, -5.4, -8.0)`);
        toolBoxCavity.setAttribute("opacity", boxOpen ? "1" : "0");
        const drillPopU = b3 === 1 ? smooth(0.46, 0.64, b3t) : 0;
        rackWrenchEl.setAttribute("opacity", b3 === 1 && b3t >= 0.46 && !hasWrench ? drillPopU.toFixed(2) : "0");
        rackWrenchEl.setAttribute("transform", `translate(0, ${(5 * (1 - drillPopU)).toFixed(1)})`);
        rackPortLed.setAttribute("opacity", boxOpen ? "0.95" : "0.55");
        toolSnapSpark.setAttribute("opacity", toolSnapTimer > 0 ? (toolSnapTimer / 0.28).toFixed(2) : "0");

        const drillingNow = b3 === 1 && b3t >= 1.18 && b3t < 1.56;
        const wallShakeX = drillingNow ? Math.sin(b3t * 95) * 1.35 : 0;
        wallBody.setAttribute("opacity", wallBroken ? "0" : "1");
        wallBody.setAttribute("transform", `translate(${wallShakeX.toFixed(2)}, 0)`);
        wallCrack.setAttribute("opacity", drillingNow ? clamp01((b3t - 1.18) / 0.26).toFixed(2) : "0");
        wallBrokenG.setAttribute("opacity", wallBroken ? "1" : "0");

        const showBonk = b3 === 1 && b3t < 0.34;
        const bonkOp = showBonk ? (b3t < 0.17 ? 0.96 : (1 - (b3t - 0.17) / 0.17) * 0.96) : 0;
        wallSparks.setAttribute("opacity", bonkOp.toFixed(2));
        wallTorqueArcs.setAttribute("opacity", drillingNow ? (0.45 + 0.55 * Math.abs(Math.sin(b3t * 42))).toFixed(2) : "0");

        const shatteringNow = b3 === 1 && b3t >= 1.56 && b3t < 1.92;
        if (shatteringNow) {
          const su = clamp01((b3t - 1.56) / 0.36);
          const fade = 1 - Math.pow(su, 2.4);
          // Realistic gravity + ground bounce curve (shards peak, hit ground at u≈0.68, bounce with restitution 0.36!)
          const bounceArc = (u, peakH, groundDrop) => {
            if (u < 0.68) {
              const t = u / 0.68;
              return -Math.sin(t * Math.PI) * peakH + t * t * groundDrop;
            }
            const t = (u - 0.68) / 0.32;
            return groundDrop - Math.sin(t * Math.PI) * (peakH * 0.34);
          };
          wallShardsG.setAttribute("opacity", fade.toFixed(2));
          shard1.setAttribute("transform", `translate(${(-su * 14.5).toFixed(1)}, ${bounceArc(su, 11.5, 13.5).toFixed(1)}) rotate(${(-su * 84).toFixed(1)})`);
          shard2.setAttribute("transform", `translate(${(su * 16.5).toFixed(1)}, ${bounceArc(su, 14.5, 17.5).toFixed(1)}) rotate(${(su * 96).toFixed(1)})`);
          shard3.setAttribute("transform", `translate(${(-su * 9.5).toFixed(1)}, ${bounceArc(su, 15.5, 19.5).toFixed(1)}) rotate(${(-su * 66).toFixed(1)})`);
          shard4.setAttribute("transform", `translate(${(su * 13.5).toFixed(1)}, ${bounceArc(su, 9.0, 9.5).toFixed(1)}) rotate(${(su * 58).toFixed(1)})`);
          wallDust.setAttribute("opacity", (Math.sin(su * Math.PI) * 0.88).toFixed(2));
          wallDust.setAttribute("transform", `translate(0, ${(-su * 4.0).toFixed(1)})`);
        } else {
          wallShardsG.setAttribute("opacity", "0");
          wallDust.setAttribute("opacity", "0");
        }

        // Prop 4 updates (手眼脑通，状态机): Monitor scan -> progressive live code typing + mint glow + steaming mug -> bold bamboo ✓!
        const scanningTerminal = b4 === 1 && b4t < 0.34;
        const typingNow = b4 === 1 && b4t >= 0.34 && b4t < 0.82;
        const scanOp = scanningTerminal ? Math.sin(clamp01(b4t / 0.34) * Math.PI) : 0;
        gateScanBeam.setAttribute("opacity", (scanOp * 0.95).toFixed(2));
        deskScreenGlow.setAttribute("opacity", typingNow || freezeAll ? "0.95" : (scanningTerminal ? "0.55" : "0"));
        typeSparks.setAttribute("opacity", typingNow ? (0.35 + 0.65 * Math.abs(Math.sin(b4t * 48))).toFixed(2) : "0");
        // Gentle rising steam wisps above coffee mug
        const st1 = Math.sin(now * 0.0026) * 0.65;
        const st2 = Math.cos(now * 0.0022) * 0.55;
        mugSteam1.setAttribute("transform", `translate(${(st1 * 0.5).toFixed(2)}, ${(-Math.abs(st1) * 0.9).toFixed(2)})`);
        mugSteam2.setAttribute("transform", `translate(${(st2 * 0.5).toFixed(2)}, ${(-Math.abs(st2) * 0.8).toFixed(2)})`);

        gateScreenLines.setAttribute("opacity", taskDone ? "0" : (scanningTerminal || typingNow || freezeAll ? "1" : "0.78"));
        if (!taskDone) {
          const tu = typingNow ? clamp01((b4t - 0.34) / 0.48) : (freezeAll ? 1 : 0.45);
          const l1 = lerp(3.4, 8.6, clamp01(tu * 2.4));
          const l2 = lerp(1.2, 7.6, clamp01((tu - 0.22) * 2.2));
          const l3 = lerp(1.2, 6.4, clamp01((tu - 0.52) * 2.1));
          codeLine1.setAttribute("x2", l1.toFixed(1));
          codeLine2.setAttribute("x2", l2.toFixed(1));
          codeLine2.setAttribute("opacity", tu > 0.22 ? "1" : "0");
          codeLine3.setAttribute("x2", l3.toFixed(1));
          codeLine3.setAttribute("opacity", tu > 0.52 ? "1" : "0");
          const curY = tu > 0.52 ? -17.8 : (tu > 0.22 ? -19.6 : -21.5);
          const curX = tu > 0.52 ? l3 + 0.5 : (tu > 0.22 ? l2 + 0.5 : l1 + 0.5);
          codeCursor.setAttribute("x", curX.toFixed(1));
          codeCursor.setAttribute("y", curY.toFixed(1));
          codeCursor.setAttribute("opacity", typingNow || freezeAll ? (Math.sin(now * 0.018) > -0.2 ? "1" : "0.2") : "0");
          const lineCol = scanningTerminal || typingNow || freezeAll ? "#B5F5D4" : "#FAF8F4";
          codeLine1.setAttribute("stroke", lineCol);
          codeLine2.setAttribute("stroke", lineCol);
        }
        gateCheckEl.setAttribute("opacity", taskDone ? "1" : "0");

        // Floating 3-node state-machine chain above monitor during Era 4 work beat
        if (b4 === 1) {
          const flowFade = 1 - smooth(1.36, 1.54, b4t);
          stateFlowGroup.setAttribute("opacity", flowFade.toFixed(2));
          const s1On = b4t >= 0.08;
          const s2On = b4t >= 0.38;
          const s3On = b4t >= 1.10;
          gateS1.setAttribute("fill", s1On ? "#E6EFE8" : "#FAF8F4");
          gateLink1.setAttribute("opacity", s2On ? "1" : "0");
          gateS2.setAttribute("fill", s2On ? "#E6EFE8" : "#FAF8F4");
          gateS2.setAttribute("opacity", freezeAll ? "0" : "1");
          gateLink2.setAttribute("opacity", s3On ? "1" : "0");
          gateS3.setAttribute("opacity", s3On ? "1" : "0");
          gateS3Rays.setAttribute("opacity", s3On ? "1" : "0");
        } else {
          stateFlowGroup.setAttribute("opacity", "0");
        }
        gateFreezeBadge.setAttribute("opacity", freezeAll ? "0.96" : "0");
        if (gateRippleTimer > 0) {
          const gu = 1 - gateRippleTimer / 0.52;
          gateSavedRipple.setAttribute("r", (2.4 + gu * 5.2).toFixed(1));
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
        gantryBeaconL.setAttribute("fill", chk3 ? "#2D6A47" : "#E4DDD0");
        gantryBeaconR.setAttribute("fill", chk3 ? "#2D6A47" : "#E4DDD0");
        // Mechanical launch clamps swing cleanly UP & OUTWARD right as harness locks in for departure!
        const clampOpenU = b5 >= 2 ? 1 : (b5 === 1 ? smooth(0.84, 1.14, b5t) : 0);
        gantryClampL.setAttribute("transform", `rotate(${(-clampOpenU * 102).toFixed(1)}, -15.4, -16.4)`);
        gantryClampR.setAttribute("transform", `rotate(${(clampOpenU * 102).toFixed(1)}, 15.2, -16.4)`);
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
            const spread = (4 + su * 23) * S;
            const len = 6.0 * (1 - su * 0.45) * S;
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
          if (b5t >= 0.66 && b5t < 1.08) {
            const ru = (b5t - 0.66) / 0.42;
            sonicRing.setAttribute("cx", launchX.toFixed(1));
            sonicRing.setAttribute("cy", (BASE_Y - 13.5 * S).toFixed(1));
            sonicRing.setAttribute("rx", ((6 + ru * 20) * S).toFixed(1));
            sonicRing.setAttribute("ry", ((1.8 + ru * 4.2) * S).toFixed(1));
            sonicRing.setAttribute("opacity", ((1 - ru) * 0.78).toFixed(2));
          } else {
            sonicRing.setAttribute("opacity", "0");
          }
          const trailLift = b5 === 4 ? (13 + Math.min(260, handoffTrailT * 340)) * S : launchLiftY * S;
          if (trailLift > 8 && (b5 !== 4 || handoffTrailT < 0.78)) {
            const trailOp = b5 === 4
              ? clamp01(1 - handoffTrailT / 0.78) * 0.42
              : clamp01(1 - (trailLift / S - 45) / 145) * 0.46;
            const topY = (BASE_Y - trailLift - 4 * S).toFixed(1);
            launchTrail.setAttribute("x1", launchX.toFixed(1));
            launchTrail.setAttribute("x2", launchX.toFixed(1));
            launchTrail.setAttribute("y1", String(BASE_Y - 2));
            launchTrail.setAttribute("y2", topY);
            launchTrail.setAttribute("opacity", trailOp.toFixed(2));
            launchTrailL.setAttribute("x1", (launchX - 7.4 * S).toFixed(1));
            launchTrailL.setAttribute("x2", (launchX - 7.4 * S).toFixed(1));
            launchTrailL.setAttribute("y1", (BASE_Y - 6 * S).toFixed(1));
            launchTrailL.setAttribute("y2", (BASE_Y - trailLift - 12 * S).toFixed(1));
            launchTrailL.setAttribute("opacity", (trailOp * 0.7).toFixed(2));
            launchTrailR.setAttribute("x1", (launchX + 7.4 * S).toFixed(1));
            launchTrailR.setAttribute("x2", (launchX + 7.4 * S).toFixed(1));
            launchTrailR.setAttribute("y1", (BASE_Y - 6 * S).toFixed(1));
            launchTrailR.setAttribute("y2", (BASE_Y - trailLift - 12 * S).toFixed(1));
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
        const onPadDist = Math.abs(drawX - x5) / S;
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

        // Pixar inertia & follow-through: damped spring impulse on abrupt walk-stops / starts!
        const speedDelta = prevMoveSpeed - moveSpeed;
        if (!freezeAll && Math.abs(speedDelta) > 12 && b1 !== 1 && b1 !== 2 && b5 !== 3) {
          velLeanVel += Math.max(-180, Math.min(180, speedDelta * 2.1));
        }
        prevMoveSpeed = moveSpeed;
        if (!freezeAll) {
          const springAcc = -velLean * 165 - velLeanVel * 14.5;
          velLeanVel += springAcc * dt;
          velLean = Math.max(-9, Math.min(9, velLean + velLeanVel * dt));
        }

        // Spinal lean arc: +22° -> +5° -> +26° -> +6° -> 0° (+ Pixar inertia lean!)
        const baseLean =
          evo < 1
            ? lerp(22, 6, smooth(0.5, 1.0, evo))
            : evo < 2
            ? lerp(6, 24, smooth(1.45, 2.0, evo))
            : evo < 3
            ? lerp(24, 6, smooth(2.2, 2.9, evo))
            : lerp(6, 0, smooth(3.1, 3.65, evo));
        const leanDeg = b5 === 3 || armPose === "dock" ? 0 : baseLean + extraLean + velLean;
        const leanRad = (leanDeg * Math.PI) / 180;

        const bob = freezeAll || b5 === 3 ? 0 : kneeW * Math.abs(Math.sin(phase * Math.PI * 2)) * 1.35;
        const totalLift = beatHopH + launchLiftY + padStandY;
        const hipY = -lerp(6.4, 13.0, smooth(0.2, 3.4, evo)) - bob - totalLift + crouchY;
        const shoulderX = Math.sin(leanRad) * torsoH;
        const shoulderY = hipY - Math.cos(leanRad) * torsoH;

        // Pixar squash-and-stretch during Era 5 ignition crouch & vertical surge!
        let sx = S, sy = S;
        if (b5 === 3) {
          if (b5t < 0.32) {
            const su = clamp01(b5t / 0.32);
            sx = S * (1 + su * 0.045);
            sy = S * (1 - su * 0.048);
          } else {
            const lu = clamp01((b5t - 0.32) / 0.22);
            sx = S * lerp(1.045, 0.96, lu);
            sy = S * lerp(0.952, 1.05, lu);
          }
        }
        botGroup.setAttribute("transform", `translate(${drawX.toFixed(2)}, ${BASE_Y}) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`);
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

        // Legs: Era 1 jog/slide -> Era 2–5 articulated IK gait -> Era 3 bonk recoil stumble -> Heroic Iron Man flight pose
        const liftH = b1 === 0 ? 2.4 : lerp(0.5, 3.6, kneeW);
        const isFlying = b5 === 3 && launchLiftY > 2;
        const isBonkRecoil = b3 === 1 && b3t < 0.34;
        const bonkU = isBonkRecoil ? clamp01(b3t / 0.34) : 0;
        const f1 = isSliding
          ? { x: -1.8, y: -1.8, pitch: 0 }
          : isFlying
          ? { x: 2.5, y: 0.4, pitch: 0.28 }
          : isBonkRecoil
          ? { x: lerp(3.4, 1.8, bonkU), y: -Math.sin(bonkU * Math.PI) * 2.2, pitch: -0.22 }
          : armPose === "dock"
          ? { x: 3.1, y: 0, pitch: 0 }
          : moveSpeed > 0
          ? footPose(phase, strideLen, liftH)
          : { x: 2.2, y: 0, pitch: 0 };
        const f2 = isSliding
          ? { x: -0.4, y: -1.2, pitch: 0 }
          : isFlying
          ? { x: -2.8, y: -4.2, pitch: 0.40 }
          : isBonkRecoil
          ? { x: lerp(-1.2, -3.6, bonkU), y: -Math.sin(Math.max(0, bonkU - 0.25) / 0.75 * Math.PI) * 1.6, pitch: 0.14 }
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
          // Volumetric chunky knee-less RPA mechanical legs + capsule feet
          const f1x = f1.x + 1.5;
          const f1y = f1.y - totalLift;
          const f2x = f2.x - 1.5;
          const f2y = f2.y - totalLift;
          frontThigh.setAttribute("d", capsuleSegPath(1.5, hipY, f1x, f1y, 1.05, 0.88));
          frontShin.setAttribute("opacity", "0");
          backThigh.setAttribute("d", capsuleSegPath(-1.5, hipY, f2x, f2y, 1.0, 0.84));
          backShin.setAttribute("opacity", "0");
          frontFoot.setAttribute("d", capsuleFootPath(f1x, f1y, 2.3, f1.pitch));
          backFoot.setAttribute("d", capsuleFootPath(f2x, f2y, 2.1, f2.pitch));
          kneeJoint1.setAttribute("opacity", "0");
          kneeJoint2.setAttribute("opacity", "0");
        } else {
          const hipOffF = 1.0;
          const hipOffB = -1.0;
          const k1 = solveKnee(hipOffF, hipY + 0.6, f1.x, f1.y - totalLift, legSeg, legSeg);
          const k2 = solveKnee(hipOffB, hipY + 0.6, f2.x, f2.y - totalLift, legSeg, legSeg);
          frontThigh.setAttribute("d", capsuleSegPath(hipOffF, hipY + 0.6, k1.x, k1.y, 1.24, 0.96));
          frontShin.setAttribute("d", capsuleSegPath(k1.x, k1.y, f1.x, f1.y - totalLift, 0.98, 0.78));
          frontShin.setAttribute("opacity", "1");
          backThigh.setAttribute("d", capsuleSegPath(hipOffB, hipY + 0.6, k2.x, k2.y, 1.16, 0.90));
          backShin.setAttribute("d", capsuleSegPath(k2.x, k2.y, f2.x, f2.y - totalLift, 0.92, 0.74));
          backShin.setAttribute("opacity", "1");
          frontFoot.setAttribute("d", capsuleFootPath(f1.x, f1.y - totalLift, 2.9, f1.pitch));
          backFoot.setAttribute("d", capsuleFootPath(f2.x, f2.y - totalLift, 2.7, f2.pitch));
          kneeJoint1.setAttribute("cx", k1.x.toFixed(1));
          kneeJoint1.setAttribute("cy", k1.y.toFixed(1));
          kneeJoint1.setAttribute("opacity", kneeW.toFixed(2));
          kneeJoint2.setAttribute("cx", k2.x.toFixed(1));
          kneeJoint2.setAttribute("cy", k2.y.toFixed(1));
          kneeJoint2.setAttribute("opacity", (kneeW * 0.75).toFixed(2));
        }
        backLegGroup.setAttribute("opacity", "0.78");
        backFoot.setAttribute("opacity", hasBoots ? "0" : "0.75");
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
        antTip.setAttribute("fill", hasHeadCrest || reasoningNow || epiphanyNow || awakeNow ? "#2D6A47" : "#FAF8F4");
        cotHeadSpark.setAttribute("opacity", epiphanyNow ? "0.92" : "0");
        headCrestEl.setAttribute("opacity", hasHeadCrest ? "1" : "0");

        if (!freezeAll) {
          blinkTimer -= dt;
          if (blinkTimer <= 0) {
            isBlinking = !isBlinking;
            blinkTimer = isBlinking ? 0.11 : 2.6 + Math.random() * 2.6;
          }
        }

        const awakeBlink = awakeNow && ((b2t >= 0.77 && b2t < 0.82) || (b2t >= 0.87 && b2t < 0.92));
        const isWincing = (b3 === 1 && b3t < 0.34) || b1 === 1;
        const useGoggles = gogglesW > 0.5;
        visorScreen.setAttribute("opacity", useGoggles ? "0" : "1");
        visorGlint1.setAttribute("opacity", useGoggles ? "0" : "1");
        // Era 2 CRT boot-up horizontal scanline sweep right as brain docks!
        if (!useGoggles && b2 === 1 && b2t >= 0.72 && b2t < 0.85) {
          const bu = clamp01((b2t - 0.72) / 0.13);
          const scanY = (-2.2 + bu * 3.6).toFixed(2);
          crtBootLine.setAttribute("y1", scanY);
          crtBootLine.setAttribute("y2", scanY);
          crtBootLine.setAttribute("opacity", (Math.sin(bu * Math.PI) * 0.95).toFixed(2));
        } else {
          crtBootLine.setAttribute("opacity", "0");
        }
        // Era 3 focused narrowed visor squint while drilling into brick wall!
        const showFocus = !useGoggles && drillingNow;
        eyeFocus.setAttribute("opacity", showFocus ? "1" : "0");
        eyeEl.setAttribute("opacity", !useGoggles && !isWincing && !showFocus ? "1" : "0");
        eyeEl.setAttribute("cx", reasoningNow || epiphanyNow ? "2.6" : "2.3");
        eyeEl.setAttribute("cy", awakeNow ? "0.3" : (reasoningNow ? "-0.8" : "-0.4"));
        eyeEl.setAttribute("r", isBlinking || awakeBlink ? "0.18" : "1.15");
        eyeWince.setAttribute("opacity", !useGoggles && isWincing ? "1" : "0");
        // Era 3 orbiting dizzy stars immediately after wall bonk!
        if (b3 === 1 && b3t >= 0.08 && b3t < 0.44) {
          const du = clamp01((b3t - 0.08) / 0.36);
          dizzyStars.setAttribute("opacity", Math.min(1, Math.sin(du * Math.PI) * 1.4).toFixed(2));
          dizzyStars.setAttribute("transform", `translate(${(Math.sin(b3t * 18) * 1.4).toFixed(1)}, ${(Math.cos(b3t * 18) * 0.55).toFixed(1)}) rotate(${(Math.sin(b3t * 14) * 10).toFixed(1)}, 0, -7.2)`);
        } else {
          dizzyStars.setAttribute("opacity", "0");
        }

        // Era 4-5 dual-optic visor + typing eye-darting + happy victory ^ ^ smile arcs!
        const showHappy = useGoggles && b4 === 1 && taskDone && b4t >= 1.12 && b4t < 1.54;
        gogglesEl.setAttribute("opacity", gogglesW.toFixed(2));
        visorGlint2.setAttribute("opacity", useGoggles ? "1" : "0");
        goggleHappy.setAttribute("opacity", showHappy ? "1" : "0");
        goggleEye.setAttribute("opacity", useGoggles && !isBlinking && !showHappy ? "1" : "0");
        if (typingNow) {
          const lookScreen = Math.sin(b4t * 16) > 0;
          goggleEye.setAttribute("transform", lookScreen ? "translate(0.35, -0.35)" : "translate(0.15, 0.55)");
        } else {
          goggleEye.removeAttribute("transform");
        }
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
        } else if (armPose === "awake") {
          // Era 2 Awakening: raises hands slightly in front while glancing curiously down at them!
          fHX = fSX + 5.2;
          fHY = fSY + 2.2;
          bHX = bSX + 2.8;
          bHY = bSY + 3.0;
          fBend = 0.9;
          bBend = 0.8;
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
        } else if (armPose === "epiphany") {
          // Era 3 Epiphany: lowers hand slightly & spots the Tool Workbench ahead!
          fHX = fSX + 4.2;
          fHY = fSY + 3.6;
          bHX = bSX - 1.6;
          bHY = bSY + 5.4;
          fBend = 0.7;
        } else if (armPose === "grabTool") {
          // Era 3: reaches cleanly into the open toolbox to snap on the big Spiral Drill!
          fHX = fSX + 8.4;
          fHY = -12.4;
          bHX = bSX - 2.0;
          bHY = bSY + 5.6;
          fBend = 0.45;
        } else if (armPose === "wrench") {
          // Era 3: extends right forearm so Spiral Drill tip kisses the left brick face dead-on (ZERO wall clipping!)
          fHX = fSX + 1.2;
          fHY = -13.6;
          bHX = bSX - 2.4;
          bHY = bSY + 5.8;
          fBend = 0.25;
        } else if (armPose === "scan") {
          // Era 4: poised alert stance while dual-optic visor scans big desktop monitor
          fHX = fSX + 3.6;
          fHY = fSY + 5.6;
          bHX = bSX - 2.0;
          bHY = bSY + 6.2;
          fBend = 0.5;
        } else if (armPose === "type") {
          // Era 4: BOTH hands hover over desk keyboard rapidly alternating keystrokes (哒哒哒)!
          const tapL = freezeAll ? 0 : Math.sin(b4t * 42) * 1.35;
          const tapR = freezeAll ? 0 : -Math.sin(b4t * 42) * 1.35;
          fHX = fSX + 8.6;
          fHY = -13.4 + tapR;
          bHX = bSX + 7.2;
          bHY = -13.4 + tapL;
          fBend = 0.75;
          bBend = 0.75;
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
        const armThickF = lerp(0.88, 1.04, smooth(0.4, 3.2, evo));
        const armThickB = lerp(0.82, 0.96, smooth(0.4, 3.2, evo));
        frontUpperArm.setAttribute("d", capsuleSegPath(fSX, fSY, fElb.x, fElb.y, armThickF, armThickF * 0.82));
        frontForeArm.setAttribute("d", capsuleSegPath(fElb.x, fElb.y, fHX, fHY, armThickF * 0.84, armThickF * 0.72));
        elbowJointF.setAttribute("cx", fElb.x.toFixed(1));
        elbowJointF.setAttribute("cy", fElb.y.toFixed(1));
        elbowJointF.setAttribute("opacity", kneeW > 0.15 ? "1" : "0");
        backArmGroup.setAttribute("opacity", armPose === "cot" || armPose === "bonk" || armPose === "type" || isSymStance ? "0.95" : "0.74");
        backUpperArm.setAttribute("d", capsuleSegPath(bSX, bSY, bElb.x, bElb.y, armThickB, armThickB * 0.82));
        backForeArm.setAttribute("d", capsuleSegPath(bElb.x, bElb.y, bHX, bHY, armThickB * 0.82, armThickB * 0.70));
        elbowJointB.setAttribute("cx", bElb.x.toFixed(1));
        elbowJointB.setAttribute("cy", bElb.y.toFixed(1));
        elbowJointB.setAttribute("opacity", kneeW > 0.15 ? "0.85" : "0");
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

        // Era 3 Big Spiral Mechanical Drill attached to right forearm (spins flutes during drilling!)
        drillGroup.setAttribute("opacity", wrenchW.toFixed(2));
        if (wrenchW > 0.02) {
          drillGroup.setAttribute("transform", `translate(${fHX.toFixed(1)}, ${fHY.toFixed(1)})`);
          const spinShift = drillingNow ? Math.sin(b3t * 70) * 0.7 : 0;
          drillFlutes.setAttribute("d", `M ${(4.4 + spinShift).toFixed(1)},-1.9 L ${(5.2 + spinShift).toFixed(1)},1.9 M ${(6.8 + spinShift * 0.7).toFixed(1)},-1.2 L ${(7.4 + spinShift * 0.7).toFixed(1)},1.2`);
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
          s.x = drawX - 9 * S;
          s.yOff = (skidIdx % 2 === 0 ? -1.4 : -3.0) * S;
          s.life = 0.42;
          skidCooldown = 0.11;
        }
        skidPool.forEach((s) => {
          if (s.life > 0) {
            s.life = Math.max(0, s.life - dt);
            const y = (BASE_Y + s.yOff).toFixed(1);
            const len = (4.5 + (1 - s.life / 0.42) * 3.5) * S;
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
          p.x = drawX - 5 * S;
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
