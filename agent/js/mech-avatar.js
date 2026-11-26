(function () {
  "use strict";

  const AgentBlog = (window.AgentBlog = window.AgentBlog || {});

  /* =======================================================================
     11. TOP-RIGHT CYBER-INK MECHA AVATAR & FULL-SCREEN ARCHITECTURAL SCANNER
         - Descends with luminous bamboo-mint repulsor braking plumes
         - Morphs into a sharp faceted Gundam-inspired cyber-ink mecha helmet
           with swept V-fin crest, forehead jewel sensor, wrap-around obsidian
           visor, glowing angled cyber-optics & tactical HUD lock brackets
         - Sweeps a TRUE full-screen vertical optical curtain + micro-blueprint
           grid + frontier telemetry ticks + live readout across 100% viewport
           while pinging every era column in sequence
         - Glides smoothly to top-left & lives on as a 2.5D parallax mascot
     ======================================================================= */
  function initTopRightMechAvatar() {
    const btn = document.getElementById("mech-avatar-btn");
    const topNav = document.getElementById("top-nav");
    const scanOverlay = document.getElementById("mech-scan-overlay");
    const navLinksEl = document.getElementById("nav-links");
    const navBtns = navLinksEl ? Array.from(navLinksEl.querySelectorAll(".nav-btn")) : [];
    const skeletonGridEl = document.getElementById("skeleton-grid");
    if (!btn || !topNav) return;

    const NS = "http://www.w3.org/2000/svg";
    const mk = (tag, attrs, parent) => {
      const node = document.createElementNS(NS, tag);
      if (attrs) Object.keys(attrs).forEach((k) => node.setAttribute(k, attrs[k]));
      if (parent) parent.appendChild(node);
      return node;
    };

    // =====================================================================
    // FULL-VIEWPORT ARCHITECTURAL BLUEPRINT SCANNER OVERLAY
    // =====================================================================
    let scanRoot = null;
    let scanCurtain = null;
    let scanGridRect = null;
    let scanGlowEdge = null;
    let scanFrontLine = null;
    let scanTetherTop = null;
    let scanTetherBot = null;
    let scanTicksG = null;
    let scanHudBadgeG = null;
    let scanHudText = null;
    let scanSpineTick = null;
    let scanCurtainGradRTL = null;
    let scanCurtainGradLTR = null;

    if (scanOverlay) {
      scanOverlay.setAttribute("shape-rendering", "geometricPrecision");
      const sDefs = mk("defs", null, scanOverlay);

      // Right-to-left trailing curtain gradient (leading edge on LEFT = 0%, fading RIGHT = 100%)
      scanCurtainGradRTL = mk("linearGradient", { id: "mech-curtain-rtl", x1: "0%", y1: "0%", x2: "100%", y2: "0%" }, sDefs);
      mk("stop", { offset: "0%", "stop-color": "#2D6A47", "stop-opacity": "0.22" }, scanCurtainGradRTL);
      mk("stop", { offset: "18%", "stop-color": "#2D6A47", "stop-opacity": "0.11" }, scanCurtainGradRTL);
      mk("stop", { offset: "65%", "stop-color": "#2D6A47", "stop-opacity": "0.03" }, scanCurtainGradRTL);
      mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, scanCurtainGradRTL);

      // Left-to-right trailing curtain gradient (leading edge on RIGHT = 100%, fading LEFT = 0%)
      scanCurtainGradLTR = mk("linearGradient", { id: "mech-curtain-ltr", x1: "100%", y1: "0%", x2: "0%", y2: "0%" }, sDefs);
      mk("stop", { offset: "0%", "stop-color": "#2D6A47", "stop-opacity": "0.22" }, scanCurtainGradLTR);
      mk("stop", { offset: "18%", "stop-color": "#2D6A47", "stop-opacity": "0.11" }, scanCurtainGradLTR);
      mk("stop", { offset: "65%", "stop-color": "#2D6A47", "stop-opacity": "0.03" }, scanCurtainGradLTR);
      mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, scanCurtainGradLTR);

      // Crisp architectural blueprint crosshair micro-grid revealed inside scan curtain!
      const gridPat = mk("pattern", { id: "mech-scan-grid", width: "28", height: "28", patternUnits: "userSpaceOnUse" }, sDefs);
      mk("path", {
        d: "M 28 0 L 0 0 0 28",
        fill: "none", stroke: "#2D6A47", "stroke-width": "0.55", "stroke-opacity": "0.22"
      }, gridPat);
      mk("path", {
        d: "M 12.5 14 L 15.5 14 M 14 12.5 L 14 15.5",
        fill: "none", stroke: "#2D6A47", "stroke-width": "0.65", "stroke-opacity": "0.34", "stroke-linecap": "round"
      }, gridPat);

      // Soft horizontal fade mask so blueprint grid dissolves smoothly behind frontier
      const gridMaskRTL = mk("mask", { id: "mech-grid-mask-rtl", maskContentUnits: "objectBoundingBox" }, sDefs);
      const gmGradRTL = mk("linearGradient", { id: "mech-gm-rtl", x1: "0%", y1: "0%", x2: "100%", y2: "0%" }, sDefs);
      mk("stop", { offset: "0%", "stop-color": "#FFFFFF", "stop-opacity": "0.95" }, gmGradRTL);
      mk("stop", { offset: "45%", "stop-color": "#FFFFFF", "stop-opacity": "0.45" }, gmGradRTL);
      mk("stop", { offset: "100%", "stop-color": "#FFFFFF", "stop-opacity": "0" }, gmGradRTL);
      mk("rect", { x: "0", y: "0", width: "1", height: "1", fill: "url(#mech-gm-rtl)" }, gridMaskRTL);

      const gridMaskLTR = mk("mask", { id: "mech-grid-mask-ltr", maskContentUnits: "objectBoundingBox" }, sDefs);
      const gmGradLTR = mk("linearGradient", { id: "mech-gm-ltr", x1: "100%", y1: "0%", x2: "0%", y2: "0%" }, sDefs);
      mk("stop", { offset: "0%", "stop-color": "#FFFFFF", "stop-opacity": "0.95" }, gmGradLTR);
      mk("stop", { offset: "45%", "stop-color": "#FFFFFF", "stop-opacity": "0.45" }, gmGradLTR);
      mk("stop", { offset: "100%", "stop-color": "#FFFFFF", "stop-opacity": "0" }, gmGradLTR);
      mk("rect", { x: "0", y: "0", width: "1", height: "1", fill: "url(#mech-gm-ltr)" }, gridMaskLTR);

      // Soft glow band hugging the leading optical frontier
      const edgeGlowGrad = mk("linearGradient", { id: "mech-edge-glow", x1: "0%", y1: "0%", x2: "100%", y2: "0%" }, sDefs);
      mk("stop", { offset: "0%", "stop-color": "#2D6A47", "stop-opacity": "0" }, edgeGlowGrad);
      mk("stop", { offset: "50%", "stop-color": "#7AD9A3", "stop-opacity": "0.52" }, edgeGlowGrad);
      mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0" }, edgeGlowGrad);

      scanRoot = mk("g", { opacity: "0" }, scanOverlay);
      scanCurtain = mk("rect", { fill: "url(#mech-curtain-rtl)" }, scanRoot);
      scanGridRect = mk("rect", { fill: "url(#mech-scan-grid)", mask: "url(#mech-grid-mask-rtl)" }, scanRoot);
      scanTetherTop = mk("line", { stroke: "#2D6A47", "stroke-width": "0.8", "stroke-opacity": "0.32", "stroke-dasharray": "4 3" }, scanRoot);
      scanTetherBot = mk("line", { stroke: "#2D6A47", "stroke-width": "0.65", "stroke-opacity": "0.18", "stroke-dasharray": "4 4" }, scanRoot);
      scanGlowEdge = mk("rect", { width: "14", fill: "url(#mech-edge-glow)" }, scanRoot);
      scanFrontLine = mk("line", { stroke: "#2D6A47", "stroke-width": "1.6", "stroke-opacity": "0.92" }, scanRoot);
      scanTicksG = mk("g", { stroke: "#2D6A47", "stroke-width": "1.0", "stroke-opacity": "0.65", "stroke-linecap": "round" }, scanRoot);
      for (let i = 0; i < 9; i++) {
        mk("line", { x1: "-4", y1: "0", x2: "4", y2: "0" }, scanTicksG);
      }
      scanSpineTick = mk("g", null, scanRoot);
      mk("circle", { r: "5.2", fill: "none", stroke: "#2D6A47", "stroke-width": "1.0", "stroke-opacity": "0.55" }, scanSpineTick);
      mk("circle", { r: "2.2", fill: "#B5F5D4", stroke: "#2D6A47", "stroke-width": "0.9" }, scanSpineTick);

      // Minimal editorial telemetry pill riding the scan frontier
      scanHudBadgeG = mk("g", null, scanRoot);
      mk("rect", { x: "0", y: "0", width: "92", height: "19", rx: "3", fill: "#FAF8F4", "fill-opacity": "0.94", stroke: "#2D6A47", "stroke-width": "0.9", "stroke-opacity": "0.65" }, scanHudBadgeG);
      mk("circle", { cx: "9", cy: "9.5", r: "2.3", fill: "#2D6A47" }, scanHudBadgeG);
      scanHudText = mk("text", {
        x: "16", y: "13",
        fill: "#1D1B18",
        "font-family": '"JetBrains Mono", "SF Mono", monospace',
        "font-size": "9.5",
        "font-weight": "500",
        "letter-spacing": "0.04em"
      }, scanHudBadgeG);
      scanHudText.textContent = "SCAN 00%";
    }

    // =====================================================================
    // HERO CYBER-INK MECHA AVATAR SVG
    // =====================================================================
    const svg = mk("svg", { viewBox: "-26 -24 52 44", "shape-rendering": "geometricPrecision" }, btn);
    const defs = mk("defs", null, svg);

    const jetGrad = mk("linearGradient", { id: "mech-jet-grad", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, defs);
    mk("stop", { offset: "0%", "stop-color": "#B5F5D4", "stop-opacity": "0.95" }, jetGrad);
    mk("stop", { offset: "40%", "stop-color": "#2D6A47", "stop-opacity": "0.62" }, jetGrad);
    mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, jetGrad);

    const coreGlow = mk("radialGradient", { id: "mech-core-glow", cx: "50%", cy: "50%", r: "50%" }, defs);
    mk("stop", { offset: "0%", "stop-color": "#4FA072", "stop-opacity": "0.65" }, coreGlow);
    mk("stop", { offset: "60%", "stop-color": "#2D6A47", "stop-opacity": "0.20" }, coreGlow);
    mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, coreGlow);

    const opticGlow = mk("radialGradient", { id: "mech-optic-glow", cx: "50%", cy: "50%", r: "50%" }, defs);
    mk("stop", { offset: "0%", "stop-color": "#B5F5D4", "stop-opacity": "0.55" }, opticGlow);
    mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, opticGlow);

    // Braking ring, slipstream trail, tactical HUD brackets & lock ring
    const brakeRing = mk("ellipse", { cx: "0", cy: "14.5", rx: "6", ry: "1.6", fill: "none", stroke: "#2D6A47", "stroke-width": "1.05", opacity: "0" }, svg);
    const glideTrail = mk("g", { opacity: "0" }, svg);
    mk("line", { x1: "16", y1: "-2.0", x2: "31", y2: "-2.0", stroke: "#2D6A47", "stroke-width": "1.2", "stroke-linecap": "round" }, glideTrail);
    mk("line", { x1: "17", y1: "2.4", x2: "27", y2: "2.4", stroke: "#2D6A47", "stroke-width": "0.95", "stroke-opacity": "0.65", "stroke-linecap": "round" }, glideTrail);
    mk("line", { x1: "16", y1: "6.8", x2: "23", y2: "6.8", stroke: "#1D1B18", "stroke-width": "0.8", "stroke-opacity": "0.35", "stroke-linecap": "round" }, glideTrail);

    // 4-Corner Tactical HUD Brackets around docked helmet (appear on hover & during scan!)
    const hudBrackets = mk("g", { class: "mech-hud-brackets" }, svg);
    mk("path", {
      d: "M -19,-13 L -19,-17 L -15,-17 M 15,-17 L 19,-17 L 19,-13 M -19,11 L -19,15 L -15,15 M 15,15 L 19,15 L 19,11",
      fill: "none", stroke: "#2D6A47", "stroke-width": "1.15", "stroke-linecap": "round", "stroke-linejoin": "round"
    }, hudBrackets);

    const morphSparks = mk("g", { opacity: "0" }, svg);
    mk("path", {
      d: "M -16,-11 L -20,-15 M 16,-11 L 20,-15 M -16,12 L -20,16 M 16,12 L 20,16",
      fill: "none", stroke: "#2D6A47", "stroke-width": "1.25", "stroke-linecap": "round"
    }, morphSparks);
    const morphRing = mk("circle", { cx: "0", cy: "1.5", r: "10", fill: "none", stroke: "#2D6A47", "stroke-width": "1.05", opacity: "0" }, svg);

    // Root group for descending vertical travel
    const rootG = mk("g", { transform: "translate(0, -64)" }, svg);

    // --- Retractable Body Subgroups (descending full mech) ---
    const legsG = mk("g", null, rootG);
    mk("path", { d: "M -2.2,6.2 L -3.5,12.2 L -1.4,12.2 M 2.2,6.2 L 2.8,13.6 L 4.8,13.6", fill: "none", stroke: "#1D1B18", "stroke-width": "1.25", "stroke-linecap": "round", "stroke-linejoin": "round" }, legsG);
    mk("path", { d: "M -5.0,10.2 L -1.8,10.2 L -1.1,13.4 L -5.2,13.4 Z", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.95", "stroke-linejoin": "round" }, legsG);
    mk("path", { d: "M 1.3,11.2 L 4.5,11.2 L 5.4,14.6 L 1.1,14.6 Z", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.0", "stroke-linejoin": "round" }, legsG);

    const armsG = mk("g", null, rootG);
    mk("path", { d: "M -5.0,-2.4 L -8.6,0.4 L -11.2,4.6 M 5.0,-2.4 L 8.6,0.4 L 11.2,4.6", fill: "none", stroke: "#1D1B18", "stroke-width": "1.25", "stroke-linecap": "round", "stroke-linejoin": "round" }, armsG);
    mk("rect", { x: "-13.2", y: "3.4", width: "4.0", height: "3.1", rx: "0.85", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "1.0" }, armsG);
    mk("rect", { x: "9.2", y: "3.4", width: "4.0", height: "3.1", rx: "0.85", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.0" }, armsG);
    mk("line", { x1: "10.2", y1: "4.9", x2: "12.2", y2: "4.9", stroke: "#2D6A47", "stroke-width": "0.85", "stroke-linecap": "round" }, armsG);

    const torsoG = mk("g", null, rootG);
    mk("rect", { x: "-8.6", y: "-2.8", width: "4.4", height: "7.6", rx: "1.1", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.05" }, torsoG);
    mk("rect", { x: "-8.2", y: "-2.3", width: "1.6", height: "6.6", rx: "0.4", fill: "#EDE8DE" }, torsoG);
    mk("path", { d: "M -5.8,-4.0 L 5.8,-4.0 L 6.7,-1.6 L -6.7,-1.6 Z", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.05", "stroke-linejoin": "round" }, torsoG);
    mk("rect", { x: "-4.6", y: "-3.2", width: "9.2", height: "9.4", rx: "1.2", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.2" }, torsoG);
    mk("rect", { x: "-4.1", y: "-2.7", width: "2.4", height: "8.4", rx: "0.6", fill: "#EDE8DE", "fill-opacity": "0.85" }, torsoG);
    mk("path", { d: "M -3.8,-2.4 L 3.8,5.4 M 3.8,-2.4 L -3.8,5.4", fill: "none", stroke: "#1D1B18", "stroke-width": "0.95", "stroke-linecap": "round" }, torsoG);
    mk("circle", { cx: "0", cy: "1.5", r: "4.4", fill: "url(#mech-core-glow)" }, torsoG);
    mk("circle", { cx: "0", cy: "1.5", r: "2.15", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.85" }, torsoG);
    mk("circle", { cx: "0", cy: "1.5", r: "1.35", fill: "#2D6A47" }, torsoG);

    const jetsG = mk("g", { opacity: "0" }, rootG);
    const jetL = mk("path", { fill: "url(#mech-jet-grad)" }, jetsG);
    const jetLCore = mk("path", { fill: "#E6FFF1", "fill-opacity": "0.9" }, jetsG);
    const jetR = mk("path", { fill: "url(#mech-jet-grad)" }, jetsG);
    const jetRCore = mk("path", { fill: "#E6FFF1", "fill-opacity": "0.9" }, jetsG);
    const jetB = mk("path", { fill: "url(#mech-jet-grad)", opacity: "0.82" }, jetsG);
    mk("circle", { cx: "-11.2", cy: "6.7", r: "1.45", fill: "#B5F5D4", stroke: "#2D6A47", "stroke-width": "0.55" }, jetsG);
    mk("circle", { cx: "11.2", cy: "6.7", r: "1.45", fill: "#B5F5D4", stroke: "#2D6A47", "stroke-width": "0.55" }, jetsG);

    // =====================================================================
    // BADASS SCULPTED CYBER-INK MECHA HELMET (Pure Symmetrical V-Fin + Side Comms Blade)
    // =====================================================================
    const headG = mk("g", { transform: "translate(0, -8.8) scale(1)" }, rootG);

    // Side-mounted tactical comms blade rising cleanly from right ear wing (keeps V-Fin 100% pure!)
    const antG = mk("g", null, headG);
    mk("path", { d: "M 7.1,-2.2 L 8.2,-8.6 L 9.0,-8.5 L 8.1,-2.0 Z", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.58", "stroke-linejoin": "round" }, antG);
    mk("circle", { class: "mech-ant-tip", cx: "8.65", cy: "-9.1", r: "0.95", fill: "#2D6A47", stroke: "#1D1B18", "stroke-width": "0.58" }, antG);

    // Swept-back aerodynamic ear sensor wings (dual-layer mecha comms fins)
    mk("path", {
      d: "M -5.8,-2.4 L -8.4,-4.2 L -8.8,-1.8 L -7.6,1.6 L -5.6,1.8 Z",
      fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.72", "stroke-linejoin": "round"
    }, headG);
    mk("line", { x1: "-7.6", y1: "-2.3", x2: "-6.6", y2: "0.8", stroke: "#1D1B18", "stroke-width": "0.48", "stroke-opacity": "0.55", "stroke-linecap": "round" }, headG);
    mk("path", {
      d: "M 5.8,-2.4 L 8.4,-4.2 L 8.8,-1.8 L 7.6,1.6 L 5.6,1.8 Z",
      fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.72", "stroke-linejoin": "round"
    }, headG);
    mk("line", { x1: "7.6", y1: "-2.3", x2: "6.6", y2: "0.8", stroke: "#1D1B18", "stroke-width": "0.48", "stroke-opacity": "0.55", "stroke-linecap": "round" }, headG);

    // Sculpted faceted mecha helmet shell (chamfered crown, angular cheek plates & chin guard)
    mk("path", {
      d: "M -4.2,-5.0 L 4.2,-5.0 L 6.2,-2.6 L 5.8,2.2 L 3.4,4.7 L -3.4,4.7 L -5.8,2.2 L -6.2,-2.6 Z",
      fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.86", "stroke-linejoin": "round"
    }, headG);
    // Warm stone-wash lower cheek armor shading + chin faceplate bevel
    mk("path", {
      d: "M -5.6,1.6 L -3.3,4.4 L 3.3,4.4 L 5.6,1.6 L 4.2,2.2 L -4.2,2.2 Z",
      fill: "#EDE8DE", "fill-opacity": "0.9"
    }, headG);
    // Chin guard central armor plate + twin micro intake vents
    mk("path", {
      d: "M -2.2,2.5 L 2.2,2.5 L 1.5,4.6 L -1.5,4.6 Z",
      fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.62", "stroke-linejoin": "round"
    }, headG);
    mk("path", {
      d: "M -1.0,3.4 L 1.0,3.4 M -0.7,4.0 L 0.7,4.0",
      fill: "none", stroke: "#1D1B18", "stroke-width": "0.48", "stroke-opacity": "0.6", "stroke-linecap": "round"
    }, headG);
    // Subtle crown panel seam lines
    mk("path", {
      d: "M -3.8,-4.7 L -2.6,-3.2 M 3.8,-4.7 L 2.6,-3.2",
      fill: "none", stroke: "#1D1B18", "stroke-width": "0.48", "stroke-opacity": "0.42", "stroke-linecap": "round"
    }, headG);

    // Wrap-around obsidian cyber-visor with aggressive brow chamfer
    mk("path", {
      d: "M -5.1,-1.8 L -1.4,-2.6 L 0,-1.9 L 1.4,-2.6 L 5.1,-1.8 L 4.7,1.4 L 2.2,2.1 L -2.2,2.1 L -4.7,1.4 Z",
      fill: "#1D1B18"
    }, headG);
    // Subtle inner bamboo optic aura inside visor
    const visorAura = mk("ellipse", { cx: "0", cy: "-0.1", rx: "4.6", ry: "2.0", fill: "url(#mech-optic-glow)", opacity: "0.45" }, headG);
    // Parallax curved glass reflection tucked cleanly at upper-left brow edge
    const visorGlint = mk("path", {
      d: "M -4.4,-1.3 L -2.1,-1.85",
      fill: "none", stroke: "#FAF8F4", "stroke-width": "0.46", "stroke-opacity": "0.36", "stroke-linecap": "round"
    }, headG);

    // Expressive Cyber-Optics (Sharp glowing chamfered optical eyes + scan sweep bar!)
    const eyesIdleG = mk("g", { class: "mech-eyes-idle" }, headG);
    const eyesTrackG = mk("g", null, eyesIdleG);
    const eyeDotL = mk("path", {
      d: "M -3.5,-0.5 L -1.1,-0.9 L -0.9,0.5 L -3.1,0.75 Z",
      fill: "#E6FFF1"
    }, eyesTrackG);
    const eyeDotR = mk("path", {
      d: "M 1.1,-0.9 L 3.5,-0.5 L 3.1,0.75 L 0.9,0.5 Z",
      fill: "#E6FFF1"
    }, eyesTrackG);
    // Razor-thin scanning visor laser hairline (preserves twin-optic silhouette during scan!)
    const visorScanBar = mk("line", {
      x1: "-3.9", y1: "0.0", x2: "3.9", y2: "0.0",
      stroke: "#7AD9A3", "stroke-width": "0.45", "stroke-linecap": "round", opacity: "0"
    }, headG);

    // Hover confident cyber-smile arcs
    const eyesHappyG = mk("g", { class: "mech-eyes-happy" }, headG);
    mk("path", {
      d: "M -3.4,0.45 L -2.15,-0.75 L -0.9,0.35 M 0.9,0.35 L 2.15,-0.75 L 3.4,0.45",
      fill: "none", stroke: "#B5F5D4", "stroke-width": "0.95", "stroke-linecap": "round", "stroke-linejoin": "round"
    }, eyesHappyG);

    // Click cheeky cyber-wink (sharp left optic + curved right arc)
    const eyesWinkG = mk("g", { class: "mech-eyes-wink" }, headG);
    mk("path", { d: "M -3.5,-0.5 L -1.1,-0.9 L -0.9,0.5 L -3.1,0.75 Z", fill: "#B5F5D4" }, eyesWinkG);
    mk("path", {
      d: "M 0.9,0.4 L 2.15,-0.75 L 3.4,0.45",
      fill: "none", stroke: "#B5F5D4", "stroke-width": "0.95", "stroke-linecap": "round", "stroke-linejoin": "round"
    }, eyesWinkG);

    // Iconic Swept-Back Gundam V-Fin Crest + Central Glowing Forehead Diamond Sensor (drawn over brow!)
    mk("path", {
      d: "M 0,-3.4 L -7.4,-8.2 L -6.0,-5.3 L -1.2,-2.7 Z",
      fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.72", "stroke-linejoin": "round"
    }, headG);
    mk("path", {
      d: "M 0,-3.4 L 7.4,-8.2 L 6.0,-5.3 L 1.2,-2.7 Z",
      fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.72", "stroke-linejoin": "round"
    }, headG);
    // Inner V-fin warm stone shadow bevels
    mk("path", {
      d: "M -0.8,-3.1 L -5.7,-5.7 L -5.1,-4.8 L -1.1,-2.7 Z M 0.8,-3.1 L 5.7,-5.7 L 5.1,-4.8 L 1.1,-2.7 Z",
      fill: "#EDE8DE"
    }, headG);
    // Central forehead diamond sensor housing + glowing bamboo jewel
    const foreheadGem = mk("polygon", {
      class: "mech-forehead-gem",
      points: "0,-5.2 1.35,-3.6 0,-2.0 -1.35,-3.6",
      fill: "#2D6A47", stroke: "#1D1B18", "stroke-width": "0.68", "stroke-linejoin": "round"
    }, headG);

    // =====================================================================
    // STATE MACHINE & 2.5D SPRING PARALLAX PHYSICS
    // =====================================================================
    let avPhase = "waiting"; // "waiting" | "delay" | "descending" | "morphing" | "scanning" | "gliding" | "avatar" | "rescan"
    let avT = 0;
    let syncTimer = 0;
    let glideStartX = 0;
    let lastTs = performance.now();
    const eyePos = { tx: 0, ty: 0, cx: 0, cy: 0 };
    const headSpring = { tx: 0, ty: 0, cx: 0, cy: 0, trot: 0, rot: 0 };
    const antSpring = { angle: 0, vel: 0 };
    let scannedColFlags = [];
    let navWakeFlags = [];
    let winkTimeout = null;

    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function lerp(a, b, t) { return a + (b - a) * t; }

    function getRightOffsetX() {
      const navRect = topNav.getBoundingClientRect();
      const style = getComputedStyle(topNav);
      const padL = parseFloat(style.paddingLeft) || 24;
      const padR = parseFloat(style.paddingRight) || 24;
      return Math.max(0, navRect.width - padL - padR - 44);
    }

    function hideScanOverlay() {
      btn.classList.remove("is-scanning");
      visorScanBar.setAttribute("opacity", "0");
      visorAura.setAttribute("opacity", "0.45");
      if (scanRoot) scanRoot.setAttribute("opacity", "0");
    }

    function pingEraColumn(colEl) {
      if (!colEl) return;
      colEl.classList.add("is-scan-ping");
      setTimeout(() => colEl.classList.remove("is-scan-ping"), 480);
    }

    function wakeNavButton(nb) {
      if (!nb) return;
      nb.classList.add("is-scan-wake");
      setTimeout(() => nb.classList.remove("is-scan-wake"), 380);
    }

    function triggerBlink(doubleBlink) {
      btn.classList.add("is-blinking");
      setTimeout(() => {
        btn.classList.remove("is-blinking");
        if (doubleBlink) setTimeout(() => triggerBlink(false), 140);
      }, 115);
    }

    function triggerWink() {
      if (winkTimeout) clearTimeout(winkTimeout);
      btn.classList.add("is-winking");
      antSpring.vel += 210;
      winkTimeout = setTimeout(() => {
        btn.classList.remove("is-winking");
      }, 360);
    }

    function scheduleBlink() {
      setTimeout(() => {
        if (avPhase === "avatar") triggerBlink(Math.random() < 0.25);
        scheduleBlink();
      }, 2900 + Math.random() * 3200);
    }
    scheduleBlink();

    // 2.5D cursor tracking + subtle parallax tilt
    window.addEventListener("mousemove", (e) => {
      if (avPhase !== "avatar") return;
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const ratio = Math.min(1, dist / 260);
      eyePos.tx = (dx / dist) * 1.15 * ratio;
      eyePos.ty = (dy / dist) * 0.72 * ratio;
      headSpring.tx = (dx / dist) * 0.9 * ratio;
      headSpring.ty = (dy / dist) * 0.55 * ratio;
      headSpring.trot = (dx / dist) * 2.8 * ratio;
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      eyePos.tx = 0;
      eyePos.ty = 0;
      headSpring.tx = 0;
      headSpring.ty = 0;
      headSpring.trot = 0;
    });

    btn.addEventListener("mouseenter", () => {
      if (avPhase === "avatar") antSpring.vel += 150;
    });

    // Subtle flagship-node vermilion sensor sense when exploring the map
    if (skeletonGridEl) {
      skeletonGridEl.addEventListener("mouseover", (e) => {
        if (avPhase !== "avatar") return;
        const isFlagship = !!(e.target && e.target.closest && e.target.closest(".twig-item.is-flagship"));
        btn.classList.toggle("is-flagship-sense", isFlagship);
      }, { passive: true });
      skeletonGridEl.addEventListener("mouseleave", () => {
        btn.classList.remove("is-flagship-sense");
      }, { passive: true });
    }

    // Click: return home from subpages, OR cheeky cyber-wink + pulse ring when on home!
    btn.addEventListener("click", () => {
      if (avPhase !== "avatar") return;
      btn.classList.remove("is-nodding");
      void btn.offsetWidth;
      btn.classList.add("is-nodding");
      syncTimer = 0.48;
      if (AgentBlog.getView && AgentBlog.getView() !== "home" && AgentBlog.switchView) {
        triggerBlink(false);
        AgentBlog.switchView("home");
      } else {
        triggerWink();
      }
    });

    // Double-click on homepage replays the TRUE full-screen architectural scan from left -> right!
    btn.addEventListener("dblclick", (e) => {
      e.preventDefault();
      if (avPhase !== "avatar") return;
      if (AgentBlog.getView && AgentBlog.getView() !== "home") return;
      avPhase = "rescan";
      avT = 0;
      scannedColFlags = [];
      btn.classList.remove("is-winking");
    });

    AgentBlog.onMechExitedTop = () => {
      if (avPhase === "waiting") {
        avPhase = "delay";
        avT = 0;
      } else if (avPhase === "avatar") {
        syncTimer = 0.48;
        antSpring.vel += 160;
        btn.classList.remove("is-nodding");
        void btn.offsetWidth;
        btn.classList.add("is-nodding");
        triggerBlink(true);
      }
    };

    // =====================================================================
    // TRUE FULL-SCREEN ARCHITECTURAL BLUEPRINT SWEEP (100% Viewport Coverage)
    // =====================================================================
    function renderFullScreenScan(u, leftToRight) {
      btn.classList.add("is-scanning");
      const alpha = u < 0.08 ? u / 0.08 : u > 0.90 ? (1 - u) / 0.10 : 1;
      const sweepU = clamp01((u - 0.05) / 0.87);
      const sweepEase = sweepU < 0.5 ? 2 * sweepU * sweepU : 1 - Math.pow(-2 * sweepU + 2, 2) / 2;

      // Intense cyber-optic glow + subtle visor hairline + forehead gem flare
      eyeDotL.setAttribute("fill", "#B5F5D4");
      eyeDotR.setAttribute("fill", "#B5F5D4");
      visorAura.setAttribute("opacity", (0.50 + alpha * 0.38).toFixed(2));
      visorScanBar.setAttribute("opacity", (alpha * 0.62).toFixed(2));
      foreheadGem.setAttribute("fill", "#7AD9A3");
      const lookX = leftToRight ? lerp(-1.1, 1.15, sweepEase) : lerp(0.9, -1.15, sweepEase);
      eyesTrackG.setAttribute("transform", `translate(${lookX.toFixed(2)}, 0.45)`);

      if (!scanRoot) return;
      const r = btn.getBoundingClientRect();
      const navH = topNav.getBoundingClientRect().height || 46;
      const exMid = r.left + r.width * 0.50;
      const ey = r.top + r.height * 0.55;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const curtainH = Math.max(100, H - navH);
      const curtainW = Math.min(300, Math.max(190, W * 0.20));

      const frontX = leftToRight
        ? lerp(-6, W + 10, sweepEase)
        : lerp(W + 6, -10, sweepEase);

      scanRoot.setAttribute("opacity", alpha.toFixed(2));

      // Full-height sweeping optical curtain + blueprint crosshair micro-grid inside curtain
      const cx = leftToRight ? frontX - curtainW : frontX;
      scanCurtain.setAttribute("x", cx.toFixed(1));
      scanCurtain.setAttribute("y", navH.toFixed(1));
      scanCurtain.setAttribute("width", curtainW.toFixed(1));
      scanCurtain.setAttribute("height", curtainH.toFixed(1));
      scanCurtain.setAttribute("fill", leftToRight ? "url(#mech-curtain-ltr)" : "url(#mech-curtain-rtl)");

      scanGridRect.setAttribute("x", cx.toFixed(1));
      scanGridRect.setAttribute("y", navH.toFixed(1));
      scanGridRect.setAttribute("width", curtainW.toFixed(1));
      scanGridRect.setAttribute("height", curtainH.toFixed(1));
      scanGridRect.setAttribute("mask", leftToRight ? "url(#mech-grid-mask-ltr)" : "url(#mech-grid-mask-rtl)");

      // Glowing frontier aura & razor-sharp vertical scan line spanning 100% height below nav
      scanGlowEdge.setAttribute("x", (frontX - 7).toFixed(1));
      scanGlowEdge.setAttribute("y", navH.toFixed(1));
      scanGlowEdge.setAttribute("height", curtainH.toFixed(1));

      scanFrontLine.setAttribute("x1", frontX.toFixed(1));
      scanFrontLine.setAttribute("y1", navH.toFixed(1));
      scanFrontLine.setAttribute("x2", frontX.toFixed(1));
      scanFrontLine.setAttribute("y2", String(H));

      // Optical tether rays linking mecha eyes cleanly to the advancing full-height frontier
      scanTetherTop.setAttribute("x1", exMid.toFixed(1));
      scanTetherTop.setAttribute("y1", ey.toFixed(1));
      scanTetherTop.setAttribute("x2", frontX.toFixed(1));
      scanTetherTop.setAttribute("y2", (navH + 14).toFixed(1));

      scanTetherBot.setAttribute("x1", exMid.toFixed(1));
      scanTetherBot.setAttribute("y1", ey.toFixed(1));
      scanTetherBot.setAttribute("x2", frontX.toFixed(1));
      scanTetherBot.setAttribute("y2", (navH + curtainH * 0.52).toFixed(1));

      // Sliding architectural calibration ticks along the frontier
      const tickLines = scanTicksG.children;
      const tickStep = curtainH / (tickLines.length + 1);
      for (let i = 0; i < tickLines.length; i++) {
        const ty = navH + tickStep * (i + 1);
        const half = i % 2 === 0 ? 5.5 : 3.0;
        tickLines[i].setAttribute("x1", (frontX - half).toFixed(1));
        tickLines[i].setAttribute("x2", (frontX + half).toFixed(1));
        tickLines[i].setAttribute("y1", ty.toFixed(1));
        tickLines[i].setAttribute("y2", ty.toFixed(1));
      }

      // Live HUD telemetry pill riding neatly beside the top of the scan wave
      const pct = Math.min(100, Math.round(sweepEase * 100));
      scanHudText.textContent = pct >= 99 ? "INDEX OK" : `SCAN ${String(pct).padStart(2, "0")}%`;
      const badgeX = leftToRight
        ? Math.max(12, Math.min(W - 104, frontX - 102))
        : Math.max(12, Math.min(W - 104, frontX + 10));
      scanHudBadgeG.setAttribute("transform", `translate(${badgeX.toFixed(1)}, ${(navH + 12).toFixed(1)})`);

      // Glowing reticle riding directly along the horizontal timeline spine + pinging each era column!
      const spineEl = skeletonGridEl && skeletonGridEl.querySelector(".timeline-spine");
      if (spineEl) {
        const sr = spineEl.getBoundingClientRect();
        scanSpineTick.setAttribute("transform", `translate(${frontX.toFixed(1)}, ${sr.top.toFixed(1)})`);
        scanSpineTick.setAttribute("opacity", "1");

        if (!AgentBlog.getView || AgentBlog.getView() === "home") {
          const cols = skeletonGridEl.querySelectorAll(".era-col");
          cols.forEach((col, idx) => {
            if (scannedColFlags[idx]) return;
            const cr = col.getBoundingClientRect();
            const colCenter = cr.left + cr.width * 0.5;
            const crossed = leftToRight ? frontX >= colCenter : frontX <= colCenter;
            if (crossed) {
              scannedColFlags[idx] = true;
              pingEraColumn(col);
            }
          });
        }
      } else {
        scanSpineTick.setAttribute("opacity", "0");
      }
    }

    function tickAvatar(now) {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
      lastTs = now;

      if (avPhase === "delay") {
        avT += dt;
        if (avT >= 0.22) {
          avPhase = "descending";
          avT = 0;
          topNav.classList.add("is-mech-landing");
          glideStartX = getRightOffsetX();
          btn.style.transform = `translateX(${glideStartX.toFixed(1)}px)`;
          btn.classList.add("is-visible");
        }
      } else if (avPhase === "descending") {
        avT += dt;
        const u = clamp01(avT / 0.86);
        const easeOut = 1 - Math.pow(1 - u, 3);
        const y = lerp(-62, 1, easeOut);
        rootG.setAttribute("transform", `translate(0, ${y.toFixed(2)})`);
        headG.setAttribute("transform", "translate(0, -8.8) scale(1)");
        legsG.setAttribute("opacity", "1");
        armsG.setAttribute("opacity", "1");
        torsoG.setAttribute("opacity", "1");
        legsG.removeAttribute("transform");
        armsG.removeAttribute("transform");
        torsoG.removeAttribute("transform");

        const brakePower = Math.sin(u * Math.PI) * (1 - u * 0.22);
        if (brakePower > 0.04) {
          const flick = 0.88 + 0.24 * Math.abs(Math.sin(now * 0.055));
          const jLen = (5.0 + brakePower * 10.5) * flick;
          const cLen = jLen * 0.52;
          jetsG.setAttribute("opacity", clamp01(brakePower * 1.45).toFixed(2));
          jetL.setAttribute("d", `M -13.1,6.7 Q -11.4,${(6.7 + jLen * 0.55).toFixed(1)} -11.8,${(6.7 + jLen).toFixed(1)} Q -10.8,${(6.7 + jLen * 0.55).toFixed(1)} -9.3,6.7 Z`);
          jetLCore.setAttribute("d", `M -12.0,6.7 L -10.4,6.7 L -11.4,${(6.7 + cLen).toFixed(1)} Z`);
          jetR.setAttribute("d", `M 9.3,6.7 Q 10.8,${(6.7 + jLen * 0.55).toFixed(1)} 11.8,${(6.7 + jLen).toFixed(1)} Q 11.4,${(6.7 + jLen * 0.55).toFixed(1)} 13.1,6.7 Z`);
          jetRCore.setAttribute("d", `M 10.4,6.7 L 12.0,6.7 L 11.4,${(6.7 + cLen).toFixed(1)} Z`);
          jetB.setAttribute("d", `M -2.2,13.6 L 3.8,13.6 L 0.8,${(13.6 + jLen * 0.82).toFixed(1)} Z`);
        } else {
          jetsG.setAttribute("opacity", "0");
        }

        if (u > 0.55) {
          const bu = (u - 0.55) / 0.45;
          brakeRing.setAttribute("rx", (6 + bu * 14).toFixed(1));
          brakeRing.setAttribute("ry", (1.4 + bu * 2.2).toFixed(1));
          brakeRing.setAttribute("opacity", ((1 - bu) * 0.58).toFixed(2));
        } else {
          brakeRing.setAttribute("opacity", "0");
        }

        if (avT >= 0.86) {
          avPhase = "morphing";
          avT = 0;
          jetsG.setAttribute("opacity", "0");
          brakeRing.setAttribute("opacity", "0");
        }
      } else if (avPhase === "morphing") {
        avT += dt;
        const u = clamp01(avT / 0.72);
        rootG.setAttribute("transform", "translate(0, 0)");

        const foldU = clamp01(u / 0.58);
        const foldEase = foldU * foldU * (3 - 2 * foldU);
        legsG.setAttribute("transform", `translate(0, ${(-13 * foldEase).toFixed(1)}) scale(${(1 - 0.35 * foldEase).toFixed(2)}, ${(1 - 0.88 * foldEase).toFixed(2)})`);
        legsG.setAttribute("opacity", (1 - foldEase).toFixed(2));
        armsG.setAttribute("transform", `translate(0, ${(-6 * foldEase).toFixed(1)}) scale(${(1 - 0.85 * foldEase).toFixed(2)}, ${(1 - 0.4 * foldEase).toFixed(2)})`);
        armsG.setAttribute("opacity", (1 - foldEase).toFixed(2));
        const torsoU = clamp01((u - 0.12) / 0.50);
        const torsoEase = torsoU * torsoU * (3 - 2 * torsoU);
        torsoG.setAttribute("transform", `translate(0, ${(-9 * torsoEase).toFixed(1)}) scale(${(1 - 0.35 * torsoEase).toFixed(2)}, ${(1 - 0.9 * torsoEase).toFixed(2)})`);
        torsoG.setAttribute("opacity", (1 - torsoEase).toFixed(2));

        const headU = clamp01((u - 0.24) / 0.76);
        const overshoot = headU < 0.78
          ? lerp(1.0, 1.94, 1 - Math.pow(1 - headU / 0.78, 3))
          : lerp(1.94, 1.84, (headU - 0.78) / 0.22);
        const headY = lerp(-8.8, 3.0, 1 - Math.pow(1 - headU, 3));
        headG.setAttribute("transform", `translate(0, ${headY.toFixed(2)}) scale(${overshoot.toFixed(3)})`);

        if (u >= 0.72) {
          const su = (u - 0.72) / 0.28;
          morphSparks.setAttribute("opacity", ((1 - su) * 0.9).toFixed(2));
          morphRing.setAttribute("r", (9 + su * 11).toFixed(1));
          morphRing.setAttribute("opacity", ((1 - su) * 0.65).toFixed(2));
        }

        if (avT >= 0.72) {
          avPhase = "scanning";
          avT = 0;
          scannedColFlags = [];
          legsG.setAttribute("opacity", "0");
          armsG.setAttribute("opacity", "0");
          torsoG.setAttribute("opacity", "0");
          morphSparks.setAttribute("opacity", "0");
          morphRing.setAttribute("opacity", "0");
          headG.setAttribute("transform", "translate(0, 3.0) scale(1.84)");
        }
      } else if (avPhase === "scanning") {
        avT += dt;
        const u = clamp01(avT / 1.38);
        renderFullScreenScan(u, false);

        if (avT >= 1.38) {
          avPhase = "gliding";
          avT = 0;
          navWakeFlags = [];
          topNav.classList.remove("is-mech-landing");
          glideStartX = getRightOffsetX();
          hideScanOverlay();
          eyeDotL.setAttribute("fill", "#E6FFF1");
          eyeDotR.setAttribute("fill", "#E6FFF1");
          foreheadGem.setAttribute("fill", "#2D6A47");
          triggerBlink(false);
        }
      } else if (avPhase === "rescan") {
        // Double-click replays the full-screen architectural blueprint sweep left -> right!
        avT += dt;
        const u = clamp01(avT / 1.28);
        renderFullScreenScan(u, true);

        if (avT >= 1.28) {
          avPhase = "avatar";
          avT = 0;
          hideScanOverlay();
          eyeDotL.setAttribute("fill", "#E6FFF1");
          eyeDotR.setAttribute("fill", "#E6FFF1");
          foreheadGem.setAttribute("fill", "#2D6A47");
          triggerBlink(false);
        }
      } else if (avPhase === "gliding") {
        avT += dt;
        const u = clamp01(avT / 0.90);
        const ease = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
        const curX = lerp(glideStartX, 0, ease);
        btn.style.transform = `translateX(${curX.toFixed(1)}px)`;

        const glideBell = Math.sin(u * Math.PI);
        const tilt = -glideBell * 7.5;
        headG.setAttribute("transform", `translate(0, 3.0) scale(1.84) rotate(${tilt.toFixed(1)})`);
        antG.setAttribute("transform", `rotate(${(glideBell * 12).toFixed(1)}, 7.6, -2.1)`);
        eyesTrackG.setAttribute("transform", `translate(${(-1.1 * glideBell).toFixed(2)}, 0)`);
        glideTrail.setAttribute("opacity", (glideBell * 0.68).toFixed(2));

        const revCount = navBtns.length;
        for (let i = 0; i < revCount; i++) {
          const revIdx = revCount - 1 - i;
          const wakeAt = 0.08 + revIdx * 0.12;
          if (!navWakeFlags[i] && u >= wakeAt) {
            navWakeFlags[i] = true;
            wakeNavButton(navBtns[i]);
          }
        }

        if (avT >= 0.90) {
          avPhase = "avatar";
          btn.style.transform = "";
          headG.setAttribute("transform", "translate(0, 3.0) scale(1.84)");
          antG.setAttribute("transform", "rotate(0, 7.6, -2.1)");
          eyesTrackG.setAttribute("transform", "translate(0, 0)");
          glideTrail.setAttribute("opacity", "0");
          btn.classList.add("is-docked");
          syncTimer = 0.45;
          antSpring.vel = -180;
          triggerBlink(false);
        }
      } else if (avPhase === "avatar") {
        // 2.5D Living Cyber-Mecha Parallax (Optics + Subtle Helmet Tilt + Spring Comms Blade + Counter-Glint)
        const prevRot = headSpring.rot;
        eyePos.cx += (eyePos.tx - eyePos.cx) * 0.18;
        eyePos.cy += (eyePos.ty - eyePos.cy) * 0.18;
        headSpring.cx += (headSpring.tx - headSpring.cx) * 0.12;
        headSpring.cy += (headSpring.ty - headSpring.cy) * 0.12;
        headSpring.rot += (headSpring.trot - headSpring.rot) * 0.12;

        const rotVel = (headSpring.rot - prevRot) / Math.max(0.008, dt);
        const k = 155;
        const damp = 10.5;
        const accel = -k * antSpring.angle - damp * antSpring.vel - rotVel * 1.1;
        antSpring.vel += accel * dt;
        antSpring.angle = Math.max(-18, Math.min(18, antSpring.angle + antSpring.vel * dt));

        headG.setAttribute(
          "transform",
          `translate(${headSpring.cx.toFixed(2)}, ${(3.0 + headSpring.cy).toFixed(2)}) scale(1.84) rotate(${headSpring.rot.toFixed(2)})`
        );
        antG.setAttribute("transform", `rotate(${antSpring.angle.toFixed(2)}, 7.6, -2.1)`);
        eyesTrackG.setAttribute("transform", `translate(${eyePos.cx.toFixed(2)}, ${eyePos.cy.toFixed(2)})`);
        visorGlint.setAttribute("transform", `translate(${(-eyePos.cx * 0.30).toFixed(2)}, ${(-eyePos.cy * 0.22).toFixed(2)})`);

        if (syncTimer > 0) {
          syncTimer = Math.max(0, syncTimer - dt);
          const su = 1 - syncTimer / 0.48;
          morphRing.setAttribute("r", (10 + su * 10.5).toFixed(1));
          morphRing.setAttribute("opacity", ((1 - su) * 0.58).toFixed(2));
        } else {
          morphRing.setAttribute("opacity", "0");
        }
      }

      requestAnimationFrame(tickAvatar);
    }

    requestAnimationFrame(tickAvatar);
  }

  initTopRightMechAvatar();
})();
