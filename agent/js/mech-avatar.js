(function () {
  "use strict";

  const AgentBlog = (window.AgentBlog = window.AgentBlog || {});

  /* =======================================================================
     11. UNIFIED ORIGINAL ROBOT — IN-VIEWPORT LIFTOFF, AERIAL PATROL & DOCK AVATAR
         - Preserves the EXACT original Era 5 evolving ink-art robot identity
           (rounded CRT head + damped-spring antenna + ear-bolt pods + panoramic
           dual-optic visor + subtle V-crest + twin-nozzle Skills jetpack +
           chamfered shoulder pauldrons + X-harness Bamboo Arc Core + repulsor
           gauntlets + armored thruster boots!).
         - Never leaves the viewport: lifts seamlessly off the Era 5 pad at 1:1
           pixel scale, climbs straight up the open right corridor into the
           rice-paper sky, patrols all 5 Eras with independently turning/tilting
           head & swaying spring antenna, pauses curiously above Era 4 Flagship
           LangGraph card, glides into the top-left dock, folds cleanly into its
           refined CRT head avatar, and emits a 100% full-screen radial bamboo
           sonar wavefront.
         - Double-click the docked top-left head anytime to unfold its full body
           and launch a live aerial patrol!
     ======================================================================= */
  function initTopRightMechAvatar() {
    const btn = document.getElementById("mech-avatar-btn");
    const topNav = document.getElementById("top-nav");
    const scanOverlay = document.getElementById("mech-scan-overlay");
    const navLinksEl = document.getElementById("nav-links");
    const navBtns = navLinksEl ? Array.from(navLinksEl.querySelectorAll(".nav-btn")) : [];
    const skeletonGridEl = document.getElementById("skeleton-grid");
    const fpCanvasEl = document.getElementById("fp-canvas");
    if (!btn || !topNav) return;

    const NS = "http://www.w3.org/2000/svg";
    const mk = (tag, attrs, parent) => {
      const node = document.createElementNS(NS, tag);
      if (attrs) Object.keys(attrs).forEach((k) => node.setAttribute(k, attrs[k]));
      if (parent) parent.appendChild(node);
      return node;
    };

    // =====================================================================
    // FULL-VIEWPORT OVERLAY: SOFT VOLUMETRIC CONE + WAKE + RADIAL SONAR
    // =====================================================================
    let coneG = null;
    let conePoly = null;
    let coneCorePoly = null;
    let coneEdgeL = null;
    let coneEdgeR = null;
    let wakeDots = [];
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

      for (let i = 0; i < 12; i++) {
        const d = mk("circle", { r: "1.35", fill: "#2D6A47", opacity: "0" }, scanOverlay);
        wakeDots.push({ el: d, x: 0, y: 0, life: 0 });
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
    mk("stop", { offset: "0%", "stop-color": "#B5F5D4", "stop-opacity": "0.96" }, jetGrad);
    mk("stop", { offset: "40%", "stop-color": "#2D6A47", "stop-opacity": "0.60" }, jetGrad);
    mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, jetGrad);

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
    // ORIGINAL ERA 5 FULL ROBOT BODY (Retracts cleanly into CRT Head on Dock!)
    // Twin-Nozzle Jetpack + Chamfered Pauldrons + X-Harness Arc Core +
    // Articulated Repulsor Gauntlet Arms + Armored Thruster Boots!
    // =====================================================================
    const bodyRigG = mk("g", { class: "mech-body-rig", opacity: "0" }, craftG);

    // --- Twin-Nozzle Skills Jetpack peeking behind upper back (matches evo-walker.js!) ---
    const packG = mk("g", null, bodyRigG);
    const jetPackPlumeG = mk("g", { opacity: "0" }, packG);
    const jetPackL = mk("path", { fill: "url(#agent-jet-grad)", opacity: "0.75" }, jetPackPlumeG);
    const jetPackR = mk("path", { fill: "url(#agent-jet-grad)", opacity: "0.75" }, jetPackPlumeG);
    mk("rect", { x: "-7.6", y: "-1.0", width: "3.4", height: "7.4", rx: "1.0", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.85" }, packG);
    mk("rect", { x: "4.2", y: "-1.0", width: "3.4", height: "7.4", rx: "1.0", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.85" }, packG);
    mk("path", { d: "M -6.8,1.2 L -5.0,1.2 M -6.8,3.4 L -5.0,3.4 M 5.0,1.2 L 6.8,1.2 M 5.0,3.4 L 6.8,3.4", fill: "none", stroke: "#1D1B18", "stroke-width": "0.55", "stroke-opacity": "0.55", "stroke-linecap": "round" }, packG);
    mk("path", { d: "M -7.0,6.4 L -7.4,8.2 L -5.2,8.2 L -5.4,6.4 Z M 5.4,6.4 L 5.2,8.2 L 7.4,8.2 L 7.0,6.4 Z", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.75", "stroke-linejoin": "round" }, packG);

    // --- Articulated Mechanical Legs + Armored Thruster Boots (limb-locked plumes!) ---
    const legsG = mk("g", null, bodyRigG);

    // Left / Rear leg (staggered slightly higher for heroic Iron Man takeoff stance!)
    const legL = mk("g", null, legsG);
    const jetBootLG = mk("g", { opacity: "0" }, legL);
    const jetBootL = mk("path", { fill: "url(#agent-jet-grad)" }, jetBootLG);
    const jetBootLCore = mk("path", { fill: "#E6FFF1", "fill-opacity": "0.92" }, jetBootLG);
    mk("path", { d: "M -2.2,10.2 L -3.1,13.6 L -2.6,15.0", fill: "none", stroke: "#1D1B18", "stroke-width": "1.35", "stroke-linecap": "round", "stroke-linejoin": "round" }, legL);
    mk("circle", { cx: "-3.1", cy: "13.4", r: "0.85", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.75" }, legL);
    // Original beveled thruster boot (bootB)
    mk("path", {
      d: "M -4.2,14.2 L -1.0,14.2 L -0.4,18.0 L -4.5,18.0 Z",
      fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.92", "stroke-linejoin": "round"
    }, legL);
    mk("line", { x1: "-3.8", y1: "16.1", x2: "-1.1", y2: "16.1", stroke: "#1D1B18", "stroke-width": "0.52", "stroke-opacity": "0.45" }, legL);
    mk("ellipse", { cx: "-2.45", cy: "18.1", rx: "1.45", ry: "0.52", fill: "#B5F5D4", stroke: "#2D6A47", "stroke-width": "0.45" }, legL);

    // Right / Front leg (extended gracefully!)
    const legR = mk("g", null, legsG);
    const jetBootRG = mk("g", { opacity: "0" }, legR);
    const jetBootR = mk("path", { fill: "url(#agent-jet-grad)" }, jetBootRG);
    const jetBootRCore = mk("path", { fill: "#E6FFF1", "fill-opacity": "0.92" }, jetBootRG);
    mk("path", { d: "M 2.2,10.2 L 2.9,14.0 L 2.5,15.6", fill: "none", stroke: "#1D1B18", "stroke-width": "1.4", "stroke-linecap": "round", "stroke-linejoin": "round" }, legR);
    mk("circle", { cx: "2.9", cy: "13.8", r: "0.9", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.78" }, legR);
    // Original beveled thruster boot (bootF)
    mk("path", {
      d: "M 0.9,15.0 L 4.2,15.0 L 4.9,19.0 L 0.6,19.0 Z",
      fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.96", "stroke-linejoin": "round"
    }, legR);
    mk("line", { x1: "1.3", y1: "17.0", x2: "4.1", y2: "17.0", stroke: "#1D1B18", "stroke-width": "0.52", "stroke-opacity": "0.45" }, legR);
    mk("ellipse", { cx: "2.75", cy: "19.1", rx: "1.5", ry: "0.54", fill: "#B5F5D4", stroke: "#2D6A47", "stroke-width": "0.45" }, legR);

    // --- Articulated Mechanical Arms + Beveled Repulsor Gauntlets (limb-locked palm plumes!) ---
    const armL = mk("g", null, bodyRigG);
    const jetPalmLG = mk("g", { opacity: "0" }, armL);
    const jetPalmL = mk("path", { fill: "url(#agent-jet-grad)" }, jetPalmLG);
    const jetPalmLCore = mk("path", { fill: "#E6FFF1", "fill-opacity": "0.92" }, jetPalmLG);
    mk("path", { d: "M -5.4,1.2 L -8.4,4.2 L -10.5,7.4", fill: "none", stroke: "#1D1B18", "stroke-width": "1.35", "stroke-linecap": "round", "stroke-linejoin": "round" }, armL);
    mk("circle", { cx: "-8.4", cy: "4.2", r: "0.85", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.72" }, armL);
    // Original beveled repulsor gauntlet (gauntletB)
    mk("rect", { x: "-12.6", y: "6.4", width: "4.2", height: "3.2", rx: "0.85", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.92" }, armL);
    mk("line", { x1: "-11.5", y1: "8.0", x2: "-9.5", y2: "8.0", stroke: "#2D6A47", "stroke-width": "0.75", "stroke-linecap": "round" }, armL);
    mk("circle", { cx: "-10.5", cy: "9.8", r: "1.2", fill: "#B5F5D4", stroke: "#2D6A47", "stroke-width": "0.48" }, armL);
    mk("circle", { cx: "-10.5", cy: "9.8", r: "0.46", fill: "#FFFFFF" }, armL);

    const armR = mk("g", null, bodyRigG);
    const jetPalmRG = mk("g", { opacity: "0" }, armR);
    const jetPalmR = mk("path", { fill: "url(#agent-jet-grad)" }, jetPalmRG);
    const jetPalmRCore = mk("path", { fill: "#E6FFF1", "fill-opacity": "0.92" }, jetPalmRG);
    mk("path", { d: "M 5.4,1.2 L 8.4,4.2 L 10.5,7.4", fill: "none", stroke: "#1D1B18", "stroke-width": "1.35", "stroke-linecap": "round", "stroke-linejoin": "round" }, armR);
    mk("circle", { cx: "8.4", cy: "4.2", r: "0.85", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.75" }, armR);
    // Original beveled repulsor gauntlet (gauntletF)
    mk("rect", { x: "8.4", y: "6.4", width: "4.2", height: "3.2", rx: "0.85", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.96" }, armR);
    mk("line", { x1: "9.5", y1: "8.0", x2: "11.5", y2: "8.0", stroke: "#2D6A47", "stroke-width": "0.75", "stroke-linecap": "round" }, armR);
    mk("circle", { cx: "10.5", cy: "9.8", r: "1.2", fill: "#B5F5D4", stroke: "#2D6A47", "stroke-width": "0.48" }, armR);
    mk("circle", { cx: "10.5", cy: "9.8", r: "0.46", fill: "#FFFFFF" }, armR);

    // --- Original Sculpted Torso Chassis + Chamfered Shoulder Pauldrons + X-Harness Arc Core ---
    const torsoG = mk("g", null, bodyRigG);
    // Mechanical neck collar (matches evo-walker.js neckEl!)
    mk("rect", { x: "-2.1", y: "-3.6", width: "4.2", height: "2.6", rx: "0.65", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.85" }, torsoG);
    mk("line", { x1: "-1.5", y1: "-2.3", x2: "1.5", y2: "-2.3", stroke: "#1D1B18", "stroke-width": "0.6", "stroke-opacity": "0.55" }, torsoG);
    // Sleek mechanical pelvis band (matches evo-walker.js pelvisEl!)
    mk("path", {
      d: "M -3.5,9.6 L 3.5,9.6 L 2.6,11.2 L -2.6,11.2 Z",
      fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.88", "stroke-linejoin": "round"
    }, torsoG);
    // Main chassis torso + warm stone left bevel
    mk("rect", { x: "-4.7", y: "-0.8", width: "9.4", height: "10.6", rx: "1.2", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.05" }, torsoG);
    mk("rect", { x: "-4.2", y: "-0.3", width: "2.8", height: "9.6", rx: "0.5", fill: "#EDE8DE", "fill-opacity": "0.85" }, torsoG);
    // Chamfered Mech Shoulder Pauldrons (matches evo-walker.js shoulderArmorEl!)
    mk("path", {
      d: "M -6.1,-1.4 L 6.1,-1.4 L 7.2,1.3 L -7.2,1.3 Z",
      fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.96", "stroke-linejoin": "round"
    }, torsoG);
    mk("path", { d: "M -4.4,-1.2 L -5.0,1.1 M 4.4,-1.2 L 5.0,1.1", fill: "none", stroke: "#1D1B18", "stroke-width": "0.68", "stroke-opacity": "0.5" }, torsoG);
    // X-Shaped Harness straps + Luminous Bamboo Arc Core!
    mk("path", {
      d: "M -4.0,0.4 L 4.0,8.8 M 4.0,0.4 L -4.0,8.8",
      fill: "none", stroke: "#1D1B18", "stroke-width": "0.9", "stroke-linecap": "round"
    }, torsoG);
    mk("circle", { cx: "0", cy: "4.6", r: "4.8", fill: "url(#agent-core-glow)" }, torsoG);
    mk("circle", { cx: "0", cy: "4.6", r: "2.25", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.82" }, torsoG);
    const chestCore = mk("circle", { cx: "0", cy: "4.6", r: "1.4", fill: "#2D6A47" }, torsoG);
    mk("circle", { cx: "-0.4", cy: "4.2", r: "0.42", fill: "#EBFFF3", "fill-opacity": "0.85" }, torsoG);

    // =====================================================================
    // ORIGINAL ROBOT CRT HEAD (Independently Articulated + Spring Antenna + 2.5D Yaw!)
    // Clean, iconic, balanced — same robot from Era 2-5 runway to sky to top-left dock!
    // =====================================================================
    const DOCKED_HEAD_SCALE = 1.26;
    const FLIGHT_HEAD_SCALE = 0.86;
    const FLIGHT_HEAD_Y = -9.8;
    const LAUNCH_MATCH_SCALE = 1.08; // 1:1 height match (~34.6px) with Era 5 runway robot at liftoff!
    const FLY_SCALE = 1.32;

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

    // Subtle compact Mech V-Crest on brow (exact silhouette motif from Era 5, clean & restrained!)
    const crestEl = mk("path", {
      d: "M -4.2,-5.8 L 0,-7.8 L 4.2,-5.8",
      fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.95", "stroke-linecap": "round", "stroke-linejoin": "round"
    }, headG);

    // Compact warm-stone side ear-bolt pods (subtle 2.5D yaw parallax!)
    const earL = mk("rect", { x: "-9.1", y: "-2.1", width: "1.9", height: "4.2", rx: "0.75", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.9" }, headG);
    const earR = mk("rect", { x: "7.2", y: "-2.1", width: "1.9", height: "4.2", rx: "0.75", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.9" }, headG);

    // Iconic Rounded-Rectangle CRT Chassis Head (matches evo-walker.js headGroup!)
    mk("rect", {
      x: "-7.3", y: "-5.8", width: "14.6", height: "11.6", rx: "3.3",
      fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.08"
    }, headG);
    // Warm stone-wash lower bevel volume
    mk("path", {
      d: "M -6.4,2.8 Q -6.4,5.0 -4.0,5.0 L 4.0,5.0 Q 6.4,5.0 6.4,2.8 L 6.4,2.0 L -6.4,2.0 Z",
      fill: "#EDE8DE", "fill-opacity": "0.88"
    }, headG);
    // Crisp top paper highlight sheen
    mk("line", {
      x1: "-4.2", y1: "-4.8", x2: "4.2", y2: "-4.8",
      stroke: "#FFFFFF", "stroke-width": "0.65", "stroke-opacity": "0.85", "stroke-linecap": "round"
    }, headG);

    // 2.5D Faceplate Group (shifts smoothly with yaw/pitch so the CRT head truly turns in space!)
    const facePlateG = mk("g", null, headG);

    // Deep Obsidian Panoramic Dual-Optic Visor (matches evo-walker.js gogglesEl!)
    mk("rect", {
      x: "-5.6", y: "-3.4", width: "11.2", height: "6.6", rx: "2.1",
      fill: "#181715"
    }, facePlateG);

    const visorAura = mk("ellipse", { cx: "0", cy: "-0.1", rx: "4.8", ry: "2.4", fill: "url(#agent-eye-glow)", opacity: "0.48" }, facePlateG);
    const visorGlint = mk("path", {
      d: "M -4.4,-2.1 L -1.8,-2.1",
      fill: "none", stroke: "#FAF8F4", "stroke-width": "0.65", "stroke-opacity": "0.36", "stroke-linecap": "round"
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

    // =====================================================================
    // 2D AUTONOMOUS FLIGHT PHYSICS & ZERO-SNAP FOLD-TO-AVATAR ENGINE
    // =====================================================================
    let avPhase = "waiting"; // "waiting" | "unfolding" | "patrolling" | "folding" | "sonar" | "avatar"
    let patrolT = 0;
    let foldT = 0;
    let sonarT = 0;
    let syncTimer = 0;
    let lastTs = performance.now();
    let launchOrigin = { x: 0, y: 0 };

    const drone = {
      x: 0, y: 0,
      vx: 0, vy: 0,
      bodyBank: 0,
      headTilt: 0,
      headYaw: 0,
      headPitch: 0,
      antDeg: 0,
      antVel: 0,
      eyeX: 0, eyeY: 0,
      curious: 0
    };
    const foldStart = { dx: 0, dy: 0, bank: 0, headTilt: 0, headYaw: 0, headPitch: 0, scale: 1 };
    const unfoldStart = { hx: 0, hy: 0, hrot: 0 };
    const mouseGoal = { ex: 0, ey: 0, hx: 0, hy: 0, hrot: 0 };
    const headState = { ex: 0, ey: 0, hx: 0, hy: 0, hrot: 0 };

    let wakeIdx = 0;
    let wakeCooldown = 0;
    let pingedCols = [];
    let pingedHeatmapWeeks = [];
    let sonarColsDone = [];
    let sonarNavDone = [];
    let winkTimeout = null;
    let patrolIsReRun = false;

    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function smooth(a, b, x) {
      const t = clamp01((x - a) / (b - a));
      return t * t * (3 - 2 * t);
    }

    function getDockCenter() {
      const nr = topNav.getBoundingClientRect();
      const cs = getComputedStyle(topNav);
      const padL = parseFloat(cs.paddingLeft) || 24;
      return { x: nr.left + padL + 22, y: nr.top + nr.height * 0.5 + 2 };
    }

    // DOM-grounded open rice-paper airspace measurement (strictly clear of heatmap/Recent Posts & era twigs!)
    function getAirspaceMetrics(W, H) {
      const navH = topNav.getBoundingClientRect().height || 46;
      const dockBand = document.querySelector(".bottom-dock");
      const dockBottom = dockBand ? dockBand.getBoundingClientRect().bottom : navH + 136;
      const skyTop = Math.max(navH + 48, dockBottom + 38);

      let flagX = W * 0.695;
      let flagY = skyTop + 34;
      const flagEl = skeletonGridEl && skeletonGridEl.querySelector(".twig-item.is-flagship");
      if (flagEl) {
        const fr = flagEl.getBoundingClientRect();
        if (fr.width > 10 && fr.height > 10) {
          flagX = fr.left + fr.width * 0.5;
          flagY = Math.max(skyTop + 10, Math.min(fr.top - 52, skyTop + 62));
        }
      }
      return { skyTop, flagX, flagY };
    }

    function getPxPerUnit() {
      const r = svg.getBoundingClientRect();
      return (r.height > 0 ? r.height : 36) / VIEWBOX_H;
    }

    function setJetOpacity(op) {
      const val = op.toFixed(2);
      jetPalmLG.setAttribute("opacity", val);
      jetPalmRG.setAttribute("opacity", val);
      jetBootLG.setAttribute("opacity", val);
      jetBootRG.setAttribute("opacity", val);
      jetPackPlumeG.setAttribute("opacity", (op * 0.72).toFixed(2));
    }

    function hideFlightFX() {
      setJetOpacity(0);
      if (coneG) coneG.setAttribute("opacity", "0");
      wakeDots.forEach((d) => { d.life = 0; d.el.setAttribute("opacity", "0"); });
    }

    function hideSonarFX() {
      if (sonarG) sonarG.setAttribute("opacity", "0");
    }

    function applyFaceYaw(yaw, pitch) {
      facePlateG.setAttribute("transform", `translate(${yaw.toFixed(2)}, ${pitch.toFixed(2)})`);
      earL.setAttribute("transform", `translate(${(yaw * 0.22).toFixed(2)}, 0)`);
      earR.setAttribute("transform", `translate(${(yaw * 0.22).toFixed(2)}, 0)`);
      crestEl.setAttribute("transform", `translate(${(yaw * 0.35).toFixed(2)}, 0)`);
    }

    function stepSpringAntenna(dt, targetDeg) {
      const acc = (targetDeg - drone.antDeg) * 145 - drone.antVel * 13;
      drone.antVel += acc * dt;
      drone.antDeg = Math.max(-24, Math.min(24, drone.antDeg + drone.antVel * dt));
      antG.setAttribute("transform", `rotate(${drone.antDeg.toFixed(2)}, 0, -6.2)`);
    }

    function pingEraColumn(colEl) {
      if (!colEl) return;
      colEl.classList.add("is-scan-ping");
      setTimeout(() => colEl.classList.remove("is-scan-ping"), 540);
      // Cascade crisp dot-bloom across published twigs in this era so the Agent visibly inventories the graph!
      const pubTwigs = colEl.querySelectorAll(".twig-item.is-published");
      pubTwigs.forEach((tw, idx) => {
        setTimeout(() => {
          tw.classList.add("is-twig-ping");
          setTimeout(() => tw.classList.remove("is-twig-ping"), 420);
        }, idx * 55);
      });
    }

    function shimmerHeatmapCol(weekIdx) {
      if (!fpCanvasEl) return;
      const cells = fpCanvasEl.querySelectorAll(`.fp-col:nth-child(${weekIdx + 1}) .fp-cell`);
      cells.forEach((c) => {
        c.classList.add("is-sonar-shimmer");
        setTimeout(() => c.classList.remove("is-sonar-shimmer"), 320);
      });
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
      winkTimeout = setTimeout(() => btn.classList.remove("is-winking"), 380);
    }

    function scheduleBlink() {
      setTimeout(() => {
        if (avPhase === "avatar") triggerBlink(Math.random() < 0.25);
        scheduleBlink();
      }, 2800 + Math.random() * 3200);
    }
    scheduleBlink();

    // Animate limb-locked bamboo plumes & mechanical arm/leg lag (plumes stay 100% seated on emitters!)
    function updateFullBodyKinematics(now, thrust, bankDeg, curiousAmt, foldAmt) {
      const flick = 0.88 + 0.24 * Math.abs(Math.sin(now * 0.055));
      const pLen = (4.4 + thrust * 6.0) * flick;
      const pCore = pLen * 0.48;
      const bLen = (5.8 + thrust * 8.4) * flick;
      const bCore = bLen * 0.50;
      const pkLen = (3.8 + thrust * 5.2) * flick;

      const f = foldAmt || 0;
      const armSwing = -bankDeg * 0.34;
      const armLAngle = lerp(armSwing + 4 + curiousAmt * 8, -28, f);
      const armRAngle = lerp(armSwing - 4 - curiousAmt * 8, 28, f);
      armL.setAttribute("transform", `rotate(${armLAngle.toFixed(1)}, -5.4, 1.2)`);
      armR.setAttribute("transform", `rotate(${armRAngle.toFixed(1)}, 5.4, 1.2)`);

      const legLag = -bankDeg * 0.56 * (1 - f);
      const legRetractY = -f * 8.2;
      legL.setAttribute("transform", `translate(0, ${legRetractY.toFixed(2)}) rotate(${(legLag - 5 * (1 - f)).toFixed(1)}, -2.2, 10.2)`);
      legR.setAttribute("transform", `translate(0, ${legRetractY.toFixed(2)}) rotate(${(legLag + 4 * (1 - f)).toFixed(1)}, 2.2, 10.2)`);

      packG.setAttribute("transform", `scale(${(1 - 0.45 * f).toFixed(3)}, 1)`);

      if (thrust > 0.04) {
        setJetOpacity(clamp01(thrust * 1.15));
        jetPalmL.setAttribute("d", `M -11.8,9.9 Q -11.2,${(9.9 + pLen * 0.52).toFixed(1)} -10.5,${(9.9 + pLen).toFixed(1)} Q -9.8,${(9.9 + pLen * 0.52).toFixed(1)} -9.2,9.9 Z`);
        jetPalmLCore.setAttribute("d", `M -11.1,9.9 L -10.5,${(9.9 + pCore).toFixed(1)} L -9.9,9.9 Z`);
        jetPalmR.setAttribute("d", `M 9.2,9.9 Q 9.8,${(9.9 + pLen * 0.52).toFixed(1)} 10.5,${(9.9 + pLen).toFixed(1)} Q 11.2,${(9.9 + pLen * 0.52).toFixed(1)} 11.8,9.9 Z`);
        jetPalmRCore.setAttribute("d", `M 9.9,9.9 L 10.5,${(9.9 + pCore).toFixed(1)} L 11.1,9.9 Z`);
        jetBootL.setAttribute("d", `M -3.9,18.1 Q -3.3,${(18.1 + bLen * 0.5).toFixed(1)} -2.45,${(18.1 + bLen * 0.88).toFixed(1)} Q -1.6,${(18.1 + bLen * 0.5).toFixed(1)} -1.0,18.1 Z`);
        jetBootLCore.setAttribute("d", `M -3.1,18.1 L -2.45,${(18.1 + bCore * 0.88).toFixed(1)} L -1.8,18.1 Z`);
        jetBootR.setAttribute("d", `M 1.2,19.1 Q 1.9,${(19.1 + bLen * 0.5).toFixed(1)} 2.75,${(19.1 + bLen).toFixed(1)} Q 3.6,${(19.1 + bLen * 0.5).toFixed(1)} 4.3,19.1 Z`);
        jetBootRCore.setAttribute("d", `M 2.0,19.1 L 2.75,${(19.1 + bCore).toFixed(1)} L 3.5,19.1 Z`);
        jetPackL.setAttribute("d", `M -7.3,8.3 L -5.3,8.3 L -6.3,${(8.3 + pkLen).toFixed(1)} Z`);
        jetPackR.setAttribute("d", `M 5.3,8.3 L 7.3,8.3 L 6.3,${(8.3 + pkLen).toFixed(1)} Z`);
      } else {
        setJetOpacity(0);
      }
    }

    function startAutonomousPatrol(fromDock, origin) {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const dock = getDockCenter();
      patrolIsReRun = !!fromDock;
      patrolT = 0;
      pingedCols = [];
      pingedHeatmapWeeks = [];
      if (winkTimeout) { clearTimeout(winkTimeout); winkTimeout = null; }
      syncTimer = 0;
      dockRing.setAttribute("opacity", "0");
      btn.classList.remove("is-docked", "is-winking", "is-nodding", "is-blinking", "is-flagship-sense");
      btn.classList.add("is-visible");
      dockShadow.setAttribute("opacity", "0");
      bodyRigG.setAttribute("opacity", "1");
      bodyRigG.removeAttribute("transform");

      if (fromDock) {
        avPhase = "unfolding";
        foldT = 0;
        unfoldStart.hx = headState.hx;
        unfoldStart.hy = headState.hy;
        unfoldStart.hrot = headState.hrot;
        mouseGoal.ex = mouseGoal.ey = mouseGoal.hx = mouseGoal.hy = mouseGoal.hrot = 0;
        headState.ex = headState.ey = headState.hx = headState.hy = headState.hrot = 0;
        drone.x = dock.x;
        drone.y = dock.y;
        drone.vx = 180;
        drone.vy = 140;
      } else {
        avPhase = "patrolling";
        // Seamless single-robot continuous liftoff directly from Era 5 launch pad (NEVER leaves screen!)
        const startX = origin && typeof origin.x === "number" ? origin.x : W * 0.92;
        const startY = origin && typeof origin.y === "number" ? origin.y : H - 96;
        launchOrigin.x = startX;
        launchOrigin.y = startY;
        drone.x = startX;
        drone.y = startY;
        drone.vx = 0;
        drone.vy = -340;
      }
      drone.bodyBank = 0;
      drone.headTilt = fromDock ? 0 : -6;
      drone.headYaw = 0;
      drone.headPitch = fromDock ? 0 : -0.5;
      drone.antDeg = 0;
      drone.antVel = 0;
      drone.eyeX = 0;
      drone.eyeY = fromDock ? 0 : -0.7;
      drone.curious = 0;

      // Render handoff frame synchronously so there is ZERO 1-frame flash or teleport!
      if (!fromDock) {
        const dx = drone.x - dock.x;
        const dy = drone.y - dock.y;
        btn.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
        craftG.setAttribute("transform", `scale(${LAUNCH_MATCH_SCALE.toFixed(3)}) rotate(0)`);
        headG.setAttribute("transform", `translate(0, ${FLIGHT_HEAD_Y}) scale(${FLIGHT_HEAD_SCALE}) rotate(${drone.headTilt.toFixed(2)})`);
        applyFaceYaw(drone.headYaw, drone.headPitch);
        updateFullBodyKinematics(performance.now(), 1.0, 0, 0, 0);
      }
    }

    // 2.5D cursor tracking when docked (active immediately during sonar & idle!)
    window.addEventListener("mousemove", (e) => {
      if (avPhase !== "avatar" && avPhase !== "sonar") return;
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const ratio = Math.min(1, dist / 280);
      mouseGoal.ex = (dx / dist) * 1.45 * ratio;
      mouseGoal.ey = (dy / dist) * 0.95 * ratio;
      mouseGoal.hx = (dx / dist) * 0.80 * ratio;
      mouseGoal.hy = (dy / dist) * 0.55 * ratio;
      mouseGoal.hrot = (dx / dist) * 2.8 * ratio;
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      mouseGoal.ex = mouseGoal.ey = mouseGoal.hx = mouseGoal.hy = mouseGoal.hrot = 0;
    });

    if (skeletonGridEl) {
      skeletonGridEl.addEventListener("mouseover", (e) => {
        if (avPhase !== "avatar" && avPhase !== "sonar") return;
        const isFlagship = !!(e.target && e.target.closest && e.target.closest(".twig-item.is-flagship"));
        btn.classList.toggle("is-flagship-sense", isFlagship);
      }, { passive: true });
      skeletonGridEl.addEventListener("mouseleave", () => {
        btn.classList.remove("is-flagship-sense");
      }, { passive: true });
    }

    btn.addEventListener("click", () => {
      if (avPhase !== "avatar" && avPhase !== "sonar") return;
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

    // Double-click docked avatar -> unfolds full original robot body & launches live 2D patrol!
    btn.addEventListener("dblclick", (e) => {
      e.preventDefault();
      if (avPhase !== "avatar") return;
      if (AgentBlog.getView && AgentBlog.getView() !== "home") return;
      startAutonomousPatrol(true);
    });

    AgentBlog.isAvatarDocked = () => avPhase === "avatar" || avPhase === "sonar";

    AgentBlog.onMechLiftoff = (origin) => {
      if (avPhase === "waiting") {
        startAutonomousPatrol(false, origin);
      } else if (avPhase === "avatar") {
        syncTimer = 0.48;
        btn.classList.remove("is-nodding");
        void btn.offsetWidth;
        btn.classList.add("is-nodding");
        triggerBlink(true);
      }
    };

    AgentBlog.onMechExitedTop = () => {
      AgentBlog.onMechLiftoff();
    };

    function getPatrolTarget(t, W, H, dock) {
      const air = getAirspaceMetrics(W, H);
      const skyY = air.skyTop;

      if (patrolIsReRun) {
        if (t < 0.80) {
          return { x: W * 0.22, y: skyY + 56, lookX: 1.35, lookY: 0.9, curious: 0, beam: 0.85, stiffness: 28 };
        } else if (t < 1.75) {
          const u = (t - 0.80) / 0.95;
          return { x: lerp(W * 0.22, air.flagX, u), y: lerp(skyY + 56, air.flagY, u) + Math.sin(u * Math.PI) * 26, lookX: 1.15, lookY: 1.0, curious: 0, beam: 1.0, stiffness: 26 };
        } else if (t < 2.45) {
          const scanSwing = Math.sin(((t - 1.75) / 0.70) * Math.PI * 1.4) * 0.55;
          return { x: air.flagX, y: air.flagY, lookX: scanSwing, lookY: 1.15, curious: 1, beam: 0.95, stiffness: 22 };
        } else if (t < 3.20) {
          return { x: W * 0.86, y: skyY + 18, lookX: -1.1, lookY: 0.7, curious: 0, beam: 0.75, stiffness: 24 };
        } else if (t < 4.15) {
          const u = (t - 3.20) / 0.95;
          return { x: lerp(W * 0.86, dock.x + 28, u), y: lerp(skyY + 18, dock.y + 38, u), lookX: -1.3, lookY: 0.25, curious: 0, beam: 0.45 * (1 - u), stiffness: 32 };
        }
        return { x: dock.x, y: dock.y, lookX: 0, lookY: 0, curious: 0, beam: 0, stiffness: 58 };
      }

      // First-run single-robot continuous liftoff from Era 5 pad -> vertical climb straight up contrail -> open-sky patrol!
      const climbX = Math.max(W * 0.88, Math.min(W - 28, launchOrigin.x));
      if (t < 0.86) {
        return { x: climbX, y: skyY + 18, lookX: -0.25, lookY: -0.75, curious: 0, beam: 0, stiffness: 20 };
      }
      if (t < 1.66) {
        const u = clamp01((t - 0.86) / 0.42);
        return { x: air.flagX, y: air.flagY, lookX: -0.85, lookY: 1.1, curious: 0, beam: u, stiffness: 24 };
      }
      if (t < 2.38) {
        const u = (t - 1.66) / 0.72;
        const scanSwing = Math.sin(u * Math.PI * 1.5) * 0.55;
        return { x: air.flagX, y: air.flagY, lookX: scanSwing, lookY: 1.18, curious: 1, beam: 0.96, stiffness: 20 };
      }
      if (t < 3.64) {
        const u = (t - 2.38) / 1.26;
        return {
          x: lerp(air.flagX - 18, W * 0.14, u),
          y: lerp(air.flagY + 10, skyY + 72, u) - Math.sin(u * Math.PI) * 18,
          lookX: -1.35,
          lookY: 0.9,
          curious: 0,
          beam: 1.0,
          stiffness: 28
        };
      }
      if (t < 4.28) {
        return { x: dock.x + 28, y: skyY - 12, lookX: -0.75, lookY: 0.35, curious: 0, beam: 0.48, stiffness: 32 };
      }
      return { x: dock.x, y: dock.y, lookX: 0, lookY: 0, curious: 0, beam: 0, stiffness: 58 };
    }

    function tickAvatar(now) {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
      lastTs = now;

      if (avPhase === "unfolding") {
        foldT += dt;
        const u = clamp01(foldT / 0.40);
        const ease = 1 - Math.pow(1 - u, 3);
        const curHx = lerp(unfoldStart.hx, 0, ease);
        const curHy = lerp(unfoldStart.hy, 0, ease);
        const curHrot = lerp(unfoldStart.hrot, 0, ease);
        const curScale = lerp(1.0, FLY_SCALE, ease);

        craftG.setAttribute("transform", `translate(${curHx.toFixed(2)}, ${curHy.toFixed(2)}) scale(${curScale.toFixed(3)}) rotate(${curHrot.toFixed(2)})`);
        bodyRigG.setAttribute("opacity", ease.toFixed(2));
        bodyRigG.setAttribute("transform", `translate(0, ${lerp(-10, 0, ease).toFixed(2)}) scale(${lerp(0.45, 1, ease).toFixed(3)}, ${lerp(0.18, 1, ease).toFixed(3)})`);
        headG.setAttribute("transform", `translate(0, ${lerp(2.2, FLIGHT_HEAD_Y, ease).toFixed(2)}) scale(${lerp(DOCKED_HEAD_SCALE, FLIGHT_HEAD_SCALE, ease).toFixed(3)})`);
        updateFullBodyKinematics(now, ease * 0.85, 0, 0, 1 - ease);
        stepSpringAntenna(dt, 0);

        if (foldT >= 0.40) {
          avPhase = "patrolling";
          bodyRigG.removeAttribute("transform");
        }
      } else if (avPhase === "patrolling") {
        patrolT += dt;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const dock = getDockCenter();
        const totalDur = patrolIsReRun ? 4.65 : 5.05;
        const tgt = getPatrolTarget(patrolT, W, H, dock);

        // True damped spring-mass 2D flight physics
        const k = tgt.stiffness;
        const damp = Math.sqrt(k) * 1.48;
        const ax = (tgt.x - drone.x) * k - drone.vx * damp;
        const ay = (tgt.y - drone.y) * k - drone.vy * damp;
        drone.vx += ax * dt;
        drone.vy += ay * dt;
        drone.x += drone.vx * dt;
        drone.y += drone.vy * dt;

        const climbIn = patrolIsReRun ? 1 : clamp01(patrolT / 0.72);
        const bobFade = climbIn * (1 - clamp01((patrolT - (totalDur - 0.55)) / 0.55));
        const hoverBobY = (Math.sin(now * 0.0062) * 2.4 + Math.cos(now * 0.0037) * 1.1) * bobFade;

        // BODY banks smoothly with horizontal velocity; HEAD moves independently & antenna lags with inertia!
        drone.curious += (tgt.curious - drone.curious) * Math.min(1, dt * 8);
        const targetBank = Math.max(-18, Math.min(18, drone.vx * 0.034));
        drone.bodyBank += (targetBank - drone.bodyBank) * Math.min(1, dt * 8.5);

        const lookBobTilt = Math.sin(now * 0.0045) * 2.5 * bobFade;
        const targetHeadTilt = -drone.bodyBank * 0.42 + drone.curious * 11.0 + lookBobTilt;
        drone.headTilt += (targetHeadTilt - drone.headTilt) * Math.min(1, dt * 10);

        drone.eyeX += (tgt.lookX - drone.eyeX) * Math.min(1, dt * 10);
        drone.eyeY += (tgt.lookY - drone.eyeY) * Math.min(1, dt * 10);
        drone.headYaw += (drone.eyeX * 0.82 - drone.headYaw) * Math.min(1, dt * 9);
        drone.headPitch += (drone.eyeY * 0.42 - drone.headPitch) * Math.min(1, dt * 9);

        stepSpringAntenna(dt, -drone.vx * 0.045 - drone.headTilt * 0.35);

        const dx = drone.x - dock.x;
        const dy = drone.y + hoverBobY - dock.y;
        btn.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;

        const riseScale = patrolIsReRun ? FLY_SCALE : lerp(LAUNCH_MATCH_SCALE, FLY_SCALE, smooth(0.0, 0.75, patrolT));
        const flyScale = lerp(riseScale, 1.0, clamp01((patrolT - (totalDur - 0.65)) / 0.65));
        craftG.setAttribute("transform", `scale(${flyScale.toFixed(3)}) rotate(${drone.bodyBank.toFixed(2)})`);
        headG.setAttribute("transform", `translate(0, ${FLIGHT_HEAD_Y}) scale(${FLIGHT_HEAD_SCALE}) rotate(${drone.headTilt.toFixed(2)})`);
        applyFaceYaw(drone.headYaw, drone.headPitch);

        const speed = Math.hypot(drone.vx, drone.vy);
        const thrust = clamp01(0.55 + speed / 420);
        bodyRigG.setAttribute("opacity", "1");
        updateFullBodyKinematics(now, thrust, drone.bodyBank, drone.curious, 0);

        eyesTrackG.setAttribute("transform", `translate(${(drone.eyeX * 0.78).toFixed(2)}, ${(drone.eyeY * 0.65).toFixed(2)})`);
        visorGlint.setAttribute("transform", `translate(${(-drone.eyeX * 0.22).toFixed(2)}, ${(-drone.eyeY * 0.18).toFixed(2)})`);

        const lH = lerp(3.1, 2.35, drone.curious);
        const rH = lerp(3.1, 3.55, drone.curious);
        eyeL.setAttribute("height", lH.toFixed(2));
        eyeL.setAttribute("y", (-lH * 0.5).toFixed(2));
        eyeR.setAttribute("height", rH.toFixed(2));
        eyeR.setAttribute("y", (-rH * 0.5).toFixed(2));
        const isFlagHover = drone.curious > 0.35;
        const eyeFill = isFlagHover ? "#FFE8E3" : "#C9FCE0";
        eyeL.setAttribute("fill", eyeFill);
        eyeR.setAttribute("fill", eyeFill);
        statusTip.setAttribute("fill", isFlagHover ? "#B83B2A" : "#2D6A47");
        chestCore.setAttribute("fill", isFlagHover ? "#B83B2A" : "#2D6A47");
        visorAura.setAttribute("opacity", (0.50 + tgt.beam * 0.35).toFixed(2));

        // Soft volumetric inspection cone geometrically locked to the rotating CRT visor!
        const pxPerUnit = getPxPerUnit();
        const bankRad = (drone.bodyBank * Math.PI) / 180;
        const headCenterDist = -FLIGHT_HEAD_Y * flyScale * pxPerUnit;
        const visorWorldX = drone.x + Math.sin(bankRad) * headCenterDist + drone.headYaw * flyScale * pxPerUnit * 0.6;
        const visorWorldY = drone.y + hoverBobY - Math.cos(bankRad) * headCenterDist + 2.5;

        if (coneG && tgt.beam > 0.02) {
          const spineEl = skeletonGridEl && skeletonGridEl.querySelector(".timeline-spine");
          const floorY = spineEl ? spineEl.getBoundingClientRect().top : H - 56;
          const aimShiftX = drone.vx * 0.075 + drone.eyeX * 18;
          const targetCenterX = visorWorldX + aimShiftX;
          const halfSpread = lerp(74, 48, drone.curious);
          const coreSpread = halfSpread * 0.42;

          coneG.setAttribute("opacity", (tgt.beam * 0.88).toFixed(2));
          conePoly.setAttribute("fill", isFlagHover ? "url(#agent-beam-flag)" : "url(#agent-beam-grad)");
          coneCorePoly.setAttribute("fill", isFlagHover ? "url(#agent-beam-flag-core)" : "url(#agent-beam-core)");
          coneCorePoly.setAttribute("opacity", "1");
          conePoly.setAttribute("points", `${(visorWorldX - 6.5).toFixed(1)},${visorWorldY.toFixed(1)} ${(visorWorldX + 6.5).toFixed(1)},${visorWorldY.toFixed(1)} ${(targetCenterX + halfSpread).toFixed(1)},${floorY.toFixed(1)} ${(targetCenterX - halfSpread).toFixed(1)},${floorY.toFixed(1)}`);
          coneCorePoly.setAttribute("points", `${(visorWorldX - 3.2).toFixed(1)},${visorWorldY.toFixed(1)} ${(visorWorldX + 3.2).toFixed(1)},${visorWorldY.toFixed(1)} ${(targetCenterX + coreSpread).toFixed(1)},${floorY.toFixed(1)} ${(targetCenterX - coreSpread).toFixed(1)},${floorY.toFixed(1)}`);
          const edgeStroke = isFlagHover ? "url(#agent-edge-flag)" : "url(#agent-edge-grad)";
          coneEdgeL.setAttribute("stroke", edgeStroke);
          coneEdgeR.setAttribute("stroke", edgeStroke);
          coneEdgeL.setAttribute("x1", (visorWorldX - 6.5).toFixed(1));
          coneEdgeL.setAttribute("y1", visorWorldY.toFixed(1));
          coneEdgeL.setAttribute("x2", (targetCenterX - halfSpread).toFixed(1));
          coneEdgeL.setAttribute("y2", floorY.toFixed(1));
          coneEdgeR.setAttribute("x1", (visorWorldX + 6.5).toFixed(1));
          coneEdgeR.setAttribute("y1", visorWorldY.toFixed(1));
          coneEdgeR.setAttribute("x2", (targetCenterX + halfSpread).toFixed(1));
          coneEdgeR.setAttribute("y2", floorY.toFixed(1));

          if (skeletonGridEl && (!AgentBlog.getView || AgentBlog.getView() === "home")) {
            const cols = skeletonGridEl.querySelectorAll(".era-col");
            cols.forEach((col, idx) => {
              if (pingedCols[idx]) return;
              const cr = col.getBoundingClientRect();
              if (Math.abs(targetCenterX - (cr.left + cr.width * 0.5)) < cr.width * 0.28) {
                pingedCols[idx] = true;
                pingEraColumn(col);
              }
            });
          }
        } else if (coneG) {
          coneG.setAttribute("opacity", "0");
        }

        // Boot thruster wake micro-dots spawned cleanly below the rotated thruster boots!
        wakeCooldown -= dt;
        if (speed > 40 && wakeCooldown <= 0) {
          const p = wakeDots[wakeIdx % wakeDots.length];
          wakeIdx += 1;
          const bootDist = 20 * flyScale * pxPerUnit;
          p.x = drone.x - Math.sin(bankRad) * bootDist;
          p.y = drone.y + hoverBobY + Math.cos(bankRad) * bootDist;
          p.life = 0.55;
          wakeCooldown = 0.055;
        }

        wakeDots.forEach((p) => {
          if (p.life > 0) {
            p.life = Math.max(0, p.life - dt);
            const u = p.life / 0.55;
            p.el.setAttribute("cx", p.x.toFixed(1));
            p.el.setAttribute("cy", p.y.toFixed(1));
            p.el.setAttribute("r", (0.75 + u * 0.95).toFixed(2));
            p.el.setAttribute("opacity", (u * 0.42).toFixed(2));
          } else {
            p.el.setAttribute("opacity", "0");
          }
        });

        const leftHome = AgentBlog.getView && AgentBlog.getView() !== "home";
        const distToDock = Math.hypot(drone.x - dock.x, drone.y - dock.y);
        if (leftHome || patrolT >= totalDur || (patrolT > totalDur - 0.45 && distToDock < 4.5)) {
          avPhase = "folding";
          foldT = 0;
          foldStart.dx = dx;
          foldStart.dy = dy;
          foldStart.bank = drone.bodyBank;
          foldStart.headTilt = drone.headTilt;
          foldStart.headYaw = drone.headYaw;
          foldStart.headPitch = drone.headPitch;
          foldStart.scale = flyScale;
          if (coneG) coneG.setAttribute("opacity", "0");
        }
      } else if (avPhase === "folding") {
        foldT += dt;
        const u = clamp01(foldT / 0.58);
        const settleU = clamp01(u / 0.45);
        const settleEase = 1 - Math.pow(1 - settleU, 3);

        const curDx = lerp(foldStart.dx, 0, settleEase);
        const curDy = lerp(foldStart.dy, 0, settleEase);
        if (Math.abs(curDx) > 0.05 || Math.abs(curDy) > 0.05) {
          btn.style.transform = `translate3d(${curDx.toFixed(2)}px, ${curDy.toFixed(2)}px, 0)`;
        } else {
          btn.style.transform = "";
        }

        const curBank = lerp(foldStart.bank, 0, settleEase);
        const curScale = lerp(foldStart.scale, 1.0, settleEase);
        craftG.setAttribute("transform", `scale(${curScale.toFixed(3)}) rotate(${curBank.toFixed(2)})`);

        const bodyU = clamp01(u / 0.65);
        const bodyEase = bodyU * bodyU * (3 - 2 * bodyU);
        updateFullBodyKinematics(now, (1 - bodyEase) * 0.4, curBank, 0, bodyEase);
        bodyRigG.setAttribute("transform", `translate(0, ${(-10.5 * bodyEase).toFixed(2)}) scale(${(1 - 0.52 * bodyEase).toFixed(3)}, ${(1 - 0.84 * bodyEase).toFixed(3)})`);
        bodyRigG.setAttribute("opacity", (1 - bodyEase).toFixed(2));

        const headU = clamp01((u - 0.14) / 0.86);
        const headScale = headU < 0.78
          ? lerp(FLIGHT_HEAD_SCALE, DOCKED_HEAD_SCALE + 0.08, 1 - Math.pow(1 - headU / 0.78, 3))
          : lerp(DOCKED_HEAD_SCALE + 0.08, DOCKED_HEAD_SCALE, (headU - 0.78) / 0.22);
        const headY = lerp(FLIGHT_HEAD_Y, 2.2, 1 - Math.pow(1 - headU, 3));
        const curHeadTilt = lerp(foldStart.headTilt, 0, settleEase);
        headG.setAttribute("transform", `translate(0, ${headY.toFixed(2)}) scale(${headScale.toFixed(3)}) rotate(${curHeadTilt.toFixed(2)})`);
        applyFaceYaw(lerp(foldStart.headYaw, 0, settleEase), lerp(foldStart.headPitch, 0, settleEase));
        stepSpringAntenna(dt, 0);

        wakeDots.forEach((p) => {
          if (p.life > 0) {
            p.life = Math.max(0, p.life - dt);
            const wu = p.life / 0.55;
            p.el.setAttribute("opacity", (wu * 0.42).toFixed(2));
          } else {
            p.el.setAttribute("opacity", "0");
          }
        });

        if (u >= 0.64) {
          const su = (u - 0.64) / 0.36;
          foldSparks.setAttribute("opacity", ((1 - su) * 0.85).toFixed(2));
          dockRing.setAttribute("r", (9.5 + su * 10.5).toFixed(1));
          dockRing.setAttribute("opacity", ((1 - su) * 0.62).toFixed(2));
        }

        if (foldT >= 0.58) {
          avPhase = "sonar";
          sonarT = 0;
          sonarColsDone = [];
          sonarNavDone = [];
          btn.style.transform = "";
          craftG.setAttribute("transform", "translate(0, 0)");
          hideFlightFX();
          bodyRigG.setAttribute("opacity", "0");
          packG.removeAttribute("transform");
          foldSparks.setAttribute("opacity", "0");
          dockRing.setAttribute("opacity", "0");
          headG.setAttribute("transform", `translate(0, 2.2) scale(${DOCKED_HEAD_SCALE})`);
          applyFaceYaw(0, 0);
          eyeL.setAttribute("height", "3.1");
          eyeL.setAttribute("y", "-1.55");
          eyeR.setAttribute("height", "3.1");
          eyeR.setAttribute("y", "-1.55");
          eyeL.setAttribute("fill", "#EBFFF3");
          eyeR.setAttribute("fill", "#EBFFF3");
          statusTip.setAttribute("fill", "#2D6A47");
          chestCore.setAttribute("fill", "#2D6A47");
          eyesTrackG.setAttribute("transform", "translate(0, 0)");
          btn.classList.add("is-docked");
          dockShadow.setAttribute("opacity", "1");
          triggerBlink(false);
          if (typeof AgentBlog.onMechDocked === "function") {
            AgentBlog.onMechDocked();
          }
        }
      } else if (avPhase === "sonar") {
        sonarT += dt;
        const u = clamp01(sonarT / 1.25);
        const ease = 1 - Math.pow(1 - u, 2.2);
        const dock = getDockCenter();
        const W = window.innerWidth;
        const H = window.innerHeight;
        const maxR = Math.hypot(W, H) * 1.06;
        const curR = ease * maxR;
        const fade = u < 0.10 ? u / 0.10 : (1 - smooth(0.55, 1.0, u));

        if (sonarG) {
          sonarG.setAttribute("opacity", fade.toFixed(2));
          sonarOuterHalo.setAttribute("cx", dock.x.toFixed(1));
          sonarOuterHalo.setAttribute("cy", dock.y.toFixed(1));
          sonarOuterHalo.setAttribute("r", Math.max(2, curR - 14).toFixed(1));
          sonarRingMain.setAttribute("cx", dock.x.toFixed(1));
          sonarRingMain.setAttribute("cy", dock.y.toFixed(1));
          sonarRingMain.setAttribute("r", curR.toFixed(1));
          sonarRingEcho.setAttribute("cx", dock.x.toFixed(1));
          sonarRingEcho.setAttribute("cy", dock.y.toFixed(1));
          sonarRingEcho.setAttribute("r", Math.max(0, curR - 36).toFixed(1));
        }

        if (fpCanvasEl && (!AgentBlog.getView || AgentBlog.getView() === "home")) {
          const hmCols = fpCanvasEl.querySelectorAll(".fp-col");
          for (let wi = 0; wi < hmCols.length; wi += 2) {
            if (pingedHeatmapWeeks[wi]) continue;
            const hr = hmCols[wi].getBoundingClientRect();
            const dist = Math.hypot((hr.left + hr.width * 0.5) - dock.x, (hr.top + hr.height * 0.5) - dock.y);
            if (curR >= dist) {
              pingedHeatmapWeeks[wi] = true;
              shimmerHeatmapCol(wi);
            }
          }
        }

        navBtns.forEach((nb, idx) => {
          if (sonarNavDone[idx]) return;
          const nr = nb.getBoundingClientRect();
          const dist = Math.hypot((nr.left + nr.width * 0.5) - dock.x, (nr.top + nr.height * 0.5) - dock.y);
          if (curR >= dist) {
            sonarNavDone[idx] = true;
            wakeNavButton(nb);
          }
        });

        if (skeletonGridEl && (!AgentBlog.getView || AgentBlog.getView() === "home")) {
          const cols = skeletonGridEl.querySelectorAll(".era-col");
          cols.forEach((col, idx) => {
            if (sonarColsDone[idx]) return;
            const dot = col.querySelector(".spine-dot") || col;
            const dr = dot.getBoundingClientRect();
            const dist = Math.hypot(dr.left - dock.x, dr.top - dock.y);
            if (curR >= dist) {
              sonarColsDone[idx] = true;
              pingEraColumn(col);
            }
          });
        }

        const floatY = Math.sin(now * 0.0028) * 1.1;
        craftG.setAttribute("transform", `translate(0, ${floatY.toFixed(2)})`);
        stepSpringAntenna(dt, Math.sin(now * 0.0022) * 2.2);

        if (sonarT >= 1.25) {
          avPhase = "avatar";
          hideSonarFX();
        }
      } else if (avPhase === "avatar") {
        headState.ex += (mouseGoal.ex - headState.ex) * 0.16;
        headState.ey += (mouseGoal.ey - headState.ey) * 0.16;
        headState.hx += (mouseGoal.hx - headState.hx) * 0.11;
        headState.hy += (mouseGoal.hy - headState.hy) * 0.11;
        headState.hrot += (mouseGoal.hrot - headState.hrot) * 0.11;

        const floatY = Math.sin(now * 0.0028) * 1.1;
        craftG.setAttribute(
          "transform",
          `translate(${headState.hx.toFixed(2)}, ${(floatY + headState.hy).toFixed(2)}) rotate(${headState.hrot.toFixed(2)})`
        );
        applyFaceYaw(headState.ex * 0.50, headState.ey * 0.30);
        stepSpringAntenna(dt, -headState.hrot * 1.5 + Math.sin(now * 0.0021) * 1.8);
        dockShadow.setAttribute("rx", (8.2 - floatY * 0.42).toFixed(2));
        eyesTrackG.setAttribute("transform", `translate(${(headState.ex * 0.72).toFixed(2)}, ${(headState.ey * 0.72).toFixed(2)})`);
        visorGlint.setAttribute("transform", `translate(${(-headState.ex * 0.25).toFixed(2)}, ${(-headState.ey * 0.20).toFixed(2)})`);

        if (syncTimer > 0) {
          syncTimer = Math.max(0, syncTimer - dt);
          const su = 1 - syncTimer / 0.48;
          dockRing.setAttribute("r", (11.5 + su * 10).toFixed(1));
          dockRing.setAttribute("opacity", ((1 - su) * 0.58).toFixed(2));
        } else {
          dockRing.setAttribute("opacity", "0");
        }
      }

      requestAnimationFrame(tickAvatar);
    }

    requestAnimationFrame(tickAvatar);
  }

  initTopRightMechAvatar();
})();
