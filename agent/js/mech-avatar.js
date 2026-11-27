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
    let trailPts = [];
    let trailGrad = null;
    let trailPathMain = null;
    let trailPathCore = null;
    let trailSampleCooldown = 0;
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

    // =====================================================================
    // 2D AUTONOMOUS FLIGHT PHYSICS & ZERO-SNAP FOLD-TO-AVATAR ENGINE
    // =====================================================================
    let avPhase = "waiting"; // "waiting" | "gantry" | "unfolding" | "patrolling" | "folding" | "sonar" | "avatar"
    let gantryT = 0;
    let gantryStandSec = 0.56;
    let gantryIgniteSec = 0.94;
    let launchMatchScale = LAUNCH_MATCH_SCALE;
    let flyTargetScale = FLY_SCALE;
    let launchStandY = 0;
    let launchScaleS = 1.44;
    let liveAnchorFn = null;
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
      return { x: nr.left + padL + 22, y: nr.top + nr.height * 0.5 };
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
      jetPalmLG.setAttribute("opacity", (op * 0.88).toFixed(2));
      jetPalmRG.setAttribute("opacity", (op * 0.88).toFixed(2));
      jetBootLG.setAttribute("opacity", val);
      jetBootRG.setAttribute("opacity", val);
    }

    function renderRibbonContrail(fadeMul) {
      if (!trailPathMain || !trailPathCore || !trailGrad) return;
      if (trailPts.length < 2) {
        trailPathMain.setAttribute("opacity", "0");
        trailPathCore.setAttribute("opacity", "0");
        return;
      }
      const p0 = trailPts[0];
      const pN = trailPts[trailPts.length - 1];
      let d = `M ${p0.x.toFixed(1)},${p0.y.toFixed(1)}`;
      for (let i = 1; i < trailPts.length - 1; i++) {
        const mx = (trailPts[i].x + trailPts[i + 1].x) * 0.5;
        const my = (trailPts[i].y + trailPts[i + 1].y) * 0.5;
        d += ` Q ${trailPts[i].x.toFixed(1)},${trailPts[i].y.toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
      }
      d += ` L ${pN.x.toFixed(1)},${pN.y.toFixed(1)}`;
      trailGrad.setAttribute("x1", p0.x.toFixed(1));
      trailGrad.setAttribute("y1", p0.y.toFixed(1));
      trailGrad.setAttribute("x2", pN.x.toFixed(1));
      trailGrad.setAttribute("y2", pN.y.toFixed(1));
      const f = clamp01(fadeMul);
      trailPathMain.setAttribute("d", d);
      trailPathMain.setAttribute("opacity", (f * 0.92).toFixed(2));
      trailPathCore.setAttribute("d", d);
      trailPathCore.setAttribute("opacity", (f * 0.72).toFixed(2));
    }

    function hideFlightFX() {
      setJetOpacity(0);
      if (coneG) coneG.setAttribute("opacity", "0");
      trailPts.length = 0;
      if (trailPathMain) trailPathMain.setAttribute("opacity", "0");
      if (trailPathCore) trailPathCore.setAttribute("opacity", "0");
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
      const allSquares = fpCanvasEl.querySelectorAll(".gh-grid .heat-sq");
      const start = weekIdx * 7;
      for (let i = start; i < start + 7 && i < allSquares.length; i++) {
        const c = allSquares[i];
        if (!c || c.classList.contains("is-future")) continue;
        c.classList.add("is-sonar-shimmer");
        setTimeout(() => c.classList.remove("is-sonar-shimmer"), 320);
      }
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

    // Animate 2.5D torso parallax, unfolding/sweeping wings, independent knee bend & Mach-diamond plumes!
    function updateFullBodyKinematics(now, thrust, bankDeg, curiousAmt, foldAmt, gantryOpts) {
      const flick = 0.90 + 0.20 * Math.abs(Math.sin(now * 0.055));
      const pLen = (3.4 + thrust * 4.4) * flick;
      const pCore = pLen * 0.46;
      const bLen = (6.0 + thrust * 8.8) * flick;
      const bCore = bLen * 0.50;

      const f = foldAmt || 0;
      const standPose = gantryOpts && typeof gantryOpts.standPose === "number" ? gantryOpts.standPose : 0;
      const yawNorm = Math.max(-1, Math.min(1, bankDeg / 16)); // -1 cruising left, +1 cruising right

      // 2.5D cylindrical torso parallax: Arc Core & harness shift subtly with flight heading!
      chestDetailG.setAttribute("transform", `translate(${(yawNorm * 0.85 * (1 - f)).toFixed(2)}, 0)`);

      // Aerodynamic arm sweep + heroic standing flare inside launch gantry
      const armSwing = -bankDeg * 0.34;
      const standArmFlare = gantryOpts && typeof gantryOpts.armFlare === "number" ? gantryOpts.armFlare : 0;
      const armLAngle = lerp(lerp(armSwing + 3 + curiousAmt * 7 - Math.max(0, yawNorm) * 6, -28, f), standArmFlare, standPose);
      const armRAngle = lerp(lerp(armSwing - 3 - curiousAmt * 7 - Math.min(0, yawNorm) * 6, 28, f), -standArmFlare, standPose);
      armL.setAttribute("transform", `rotate(${armLAngle.toFixed(1)}, -5.7, 0.4)`);
      armR.setAttribute("transform", `rotate(${armRAngle.toFixed(1)}, 5.7, 0.4)`);

      // 2-bone articulated legs: perfectly level upright heroic stance in gantry (both soles y=19.7) -> dynamic flight slipstream bend!
      const legLag = -bankDeg * 0.42 * (1 - f) * (1 - standPose);
      const kneeLag = -bankDeg * 0.58 * (1 - f) * (1 - standPose);
      const legRetractY = -f * 8.6;
      const legLY = legRetractY + 0.6 * standPose;
      const legRY = legRetractY - 0.6 * standPose;
      legL.setAttribute("transform", `translate(0, ${legLY.toFixed(2)}) rotate(${(legLag - 5 * (1 - f) * (1 - standPose)).toFixed(1)}, -2.6, 10.6)`);
      legR.setAttribute("transform", `translate(0, ${legRY.toFixed(2)}) rotate(${(legLag + 2 * (1 - f) * (1 - standPose)).toFixed(1)}, 2.6, 10.6)`);
      shinL.setAttribute("transform", `rotate(${(kneeLag - 6 * (1 - f) * (1 - standPose)).toFixed(1)}, -2.65, 14.1)`);
      shinR.setAttribute("transform", `rotate(${(kneeLag + 2 * (1 - f) * (1 - standPose)).toFixed(1)}, 2.65, 14.6)`);

      // Articulated aero wing-binders: unfold smoothly inside gantry right after armor lock-in, then stay 100% open in flight!
      const wingUnfold = gantryOpts && typeof gantryOpts.wingOpen === "number"
        ? gantryOpts.wingOpen
        : (!patrolIsReRun && avPhase === "patrolling" ? 1 : 1 - f);
      const openScale = lerp(0.55, 1.0, wingUnfold);
      const speedSweep = (1 - wingUnfold) * 24 + Math.abs(yawNorm) * 9 - curiousAmt * 6;
      const wingScaleL = openScale * (1 - yawNorm * 0.16);
      const wingScaleR = openScale * (1 + yawNorm * 0.16);
      wingL.setAttribute("transform", `translate(-3.8, 0.2) scale(${wingScaleL.toFixed(3)}, ${openScale.toFixed(3)}) rotate(${(-speedSweep).toFixed(1)}) translate(3.8, -0.2)`);
      wingR.setAttribute("transform", `translate(3.8, 0.2) scale(${wingScaleR.toFixed(3)}, ${openScale.toFixed(3)}) rotate(${(speedSweep).toFixed(1)}) translate(-3.8, -0.2)`);
      packG.setAttribute("transform", `translate(${(-yawNorm * 0.65).toFixed(2)}, 0)`);

      if (thrust > 0.04) {
        setJetOpacity(clamp01(thrust * 1.15));
        // Compact outward-angled palm stabilizer flames
        jetPalmL.setAttribute("d", `M -10.7,9.4 Q -10.6,${(9.4 + pLen * 0.55).toFixed(1)} -10.3,${(9.4 + pLen).toFixed(1)} Q -9.5,${(9.4 + pLen * 0.55).toFixed(1)} -8.9,9.4 Z`);
        jetPalmLCore.setAttribute("d", `M -10.3,9.4 L -10.1,${(9.4 + pCore).toFixed(1)} L -9.4,9.4 Z`);
        jetPalmR.setAttribute("d", `M 8.9,9.4 Q 9.5,${(9.4 + pLen * 0.55).toFixed(1)} 10.3,${(9.4 + pLen).toFixed(1)} Q 10.6,${(9.4 + pLen * 0.55).toFixed(1)} 10.7,9.4 Z`);
        jetPalmRCore.setAttribute("d", `M 9.4,9.4 L 10.1,${(9.4 + pCore).toFixed(1)} L 10.3,9.4 Z`);
        // Long sleek aerospace boot thruster plumes + pulsing Mach-diamond shock rings!
        jetBootL.setAttribute("d", `M -3.85,19.0 Q -3.3,${(19.0 + bLen * 0.5).toFixed(1)} -2.65,${(19.0 + bLen * 0.88).toFixed(1)} Q -2.0,${(19.0 + bLen * 0.5).toFixed(1)} -1.45,19.0 Z`);
        jetBootLCore.setAttribute("d", `M -3.2,19.0 L -2.65,${(19.0 + bCore * 0.88).toFixed(1)} L -2.1,19.0 Z`);
        jetBootR.setAttribute("d", `M 1.4,20.2 Q 2.0,${(20.2 + bLen * 0.5).toFixed(1)} 2.65,${(20.2 + bLen).toFixed(1)} Q 3.3,${(20.2 + bLen * 0.5).toFixed(1)} 3.9,20.2 Z`);
        jetBootRCore.setAttribute("d", `M 2.05,20.2 L 2.65,${(20.2 + bCore).toFixed(1)} L 3.25,20.2 Z`);
        const machCycle = (now * 0.0085) % 1;
        const mOp = (Math.sin(machCycle * Math.PI) * 0.85 * thrust).toFixed(2);
        machL1.setAttribute("cy", (19.9 + machCycle * bLen * 0.52).toFixed(1));
        machL1.setAttribute("rx", (1.05 * (1 - machCycle * 0.45)).toFixed(2));
        machL1.setAttribute("opacity", mOp);
        machR1.setAttribute("cy", (21.1 + machCycle * bLen * 0.55).toFixed(1));
        machR1.setAttribute("rx", (1.10 * (1 - machCycle * 0.45)).toFixed(2));
        machR1.setAttribute("opacity", mOp);
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
        flyTargetScale = Math.max(FLY_SCALE, launchMatchScale * 0.94);
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
        // 1:1 Pixel-Exact Single-Model Takeover right inside the Era 5 Launch Gantry at armor lock-in!
        liveAnchorFn = origin && typeof origin.getAnchor === "function" ? origin.getAnchor : null;
        const a = liveAnchorFn ? liveAnchorFn() : origin;
        const sVal = a && typeof a.scale === "number" ? a.scale : 1.44;
        launchScaleS = sVal;
        launchMatchScale = 1.2288 * sVal;
        flyTargetScale = Math.max(1.54, launchMatchScale * 0.95);
        const pxPerUnit = getPxPerUnit();
        const startX = a && typeof a.x === "number" ? a.x : W * 0.89;
        const deckY = a && typeof a.padDeckY === "number" ? a.padDeckY : H - 40;
        launchStandY = deckY - 19.7 * launchMatchScale * pxPerUnit;
        launchOrigin.x = startX;
        launchOrigin.y = launchStandY;
        drone.x = startX;
        drone.y = launchStandY;
        drone.vx = 0;
        drone.vy = 0;
        gantryStandSec = origin && typeof origin.standSec === "number" ? origin.standSec : 0.56;
        gantryIgniteSec = origin && typeof origin.igniteSec === "number" ? origin.igniteSec : 0.94;
        if (gantryStandSec + gantryIgniteSec > 0.05) {
          avPhase = "gantry";
          gantryT = 0;
        } else {
          avPhase = "patrolling";
          drone.vy = -360;
        }
      }
      drone.bodyBank = 0;
      drone.headTilt = 0;
      drone.headYaw = 0;
      drone.headPitch = fromDock ? 0 : -0.35;
      drone.antDeg = 0;
      drone.antVel = 0;
      drone.eyeX = 0;
      drone.eyeY = fromDock ? 0 : -0.45;
      drone.curious = 0;

      // Render takeover frame synchronously so there is ZERO 1-frame flash, shrink, or teleport!
      if (!fromDock) {
        const dx = drone.x - dock.x;
        const dy = drone.y - dock.y;
        btn.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
        craftG.setAttribute("transform", `scale(${launchMatchScale.toFixed(3)}) rotate(0)`);
        headG.setAttribute("transform", `translate(0, ${FLIGHT_HEAD_Y}) scale(${FLIGHT_HEAD_SCALE}) rotate(0)`);
        applyFaceYaw(drone.headYaw, drone.headPitch);
        updateFullBodyKinematics(performance.now(), avPhase === "gantry" ? 0 : 1.0, 0, 0, 0, { standPose: 1, wingOpen: 0.42, armFlare: 8 });
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

    // Double-click docked avatar -> unfolds full hardcore mech body & launches live 2D patrol!
    btn.addEventListener("dblclick", (e) => {
      e.preventDefault();
      if (avPhase !== "avatar") return;
      if (AgentBlog.getView && AgentBlog.getView() !== "home") return;
      btn.classList.add("has-flown-manual");
      startAutonomousPatrol(true);
    });

    AgentBlog.isAvatarDocked = () => avPhase === "avatar" || avPhase === "sonar";

    AgentBlog.onMechLiftoff = (origin) => {
      if (avPhase === "waiting") {
        startAutonomousPatrol(false, origin);
      } else if ((avPhase === "avatar" || avPhase === "sonar") && origin && origin.forcePatrol) {
        // Bidirectional replay loop: smoothly release docked top-left avatar and launch directly from Era 5 gantry!
        hideSonarFX();
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

      // Unified single-robot continuous liftoff straight up out of Era 5 launch gantry -> open-sky patrol!
      const climbX = Math.max(W * 0.84, Math.min(W - 28, launchOrigin.x));
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

      if (avPhase === "gantry") {
        // Unified Single-Model In-Gantry Sequence: Live-welded to Era 5 launch deck -> Wing Unfold -> Ignition -> Vertical Surge!
        gantryT += dt;
        const dock = getDockCenter();
        if (liveAnchorFn) {
          const a = liveAnchorFn();
          if (a && typeof a.padDeckY === "number") {
            launchScaleS = a.scale;
            launchMatchScale = 1.2288 * a.scale;
            flyTargetScale = Math.max(1.54, launchMatchScale * 0.95);
            launchOrigin.x = a.x;
            launchStandY = a.padDeckY - 19.7 * launchMatchScale * getPxPerUnit();
          }
        }
        const totalG = gantryStandSec + gantryIgniteSec;
        let liftPx = 0;
        let shudderX = 0;
        let thrust = 0;
        let standPose = 1;
        let wingOpen = 0.42;
        let armFlare = 8;
        let headLook = 0;

        if (gantryT < gantryStandSec) {
          const su = clamp01(gantryT / Math.max(0.01, gantryStandSec));
          const ease = 1 - Math.pow(1 - su, 3);
          wingOpen = lerp(0.42, 0.92, ease);
          armFlare = lerp(8, 12, ease);
          headLook = -ease * 7.5;
          drone.eyeY = lerp(-0.35, -0.85, ease);
        } else {
          const iu = clamp01((gantryT - gantryStandSec) / Math.max(0.01, gantryIgniteSec));
          wingOpen = lerp(0.92, 1.0, clamp01(iu * 2.5));
          armFlare = lerp(12, 18, clamp01(iu * 2.2));
          headLook = -7.5;
          drone.eyeY = -0.85;
          if (iu < 0.46) {
            const p = iu / 0.46;
            thrust = p * 1.15;
            shudderX = Math.sin(gantryT * 115) * p * 0.65;
            standPose = 1;
          } else {
            const lu = (iu - 0.46) / 0.54;
            const ease = 1 - Math.pow(1 - lu, 3);
            liftPx = ease * 20 * launchScaleS;
            thrust = 1.15 + lu * 0.35;
            standPose = 1 - ease;
          }
        }

        drone.x = launchOrigin.x + shudderX;
        drone.y = launchStandY - liftPx;
        const dx = drone.x - dock.x;
        const dy = drone.y - dock.y;
        btn.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
        craftG.setAttribute("transform", `scale(${launchMatchScale.toFixed(3)}) rotate(0)`);
        headG.setAttribute("transform", `translate(0, ${FLIGHT_HEAD_Y}) scale(${FLIGHT_HEAD_SCALE}) rotate(${headLook.toFixed(1)})`);
        applyFaceYaw(0, drone.eyeY * 0.45);
        eyesTrackG.setAttribute("transform", `translate(0, ${(drone.eyeY * 0.65).toFixed(2)})`);
        eyeL.setAttribute("fill", "#C9FCE0");
        eyeR.setAttribute("fill", "#C9FCE0");
        statusTip.setAttribute("fill", "#2D6A47");
        chestCore.setAttribute("fill", "#2D6A47");
        visorAura.setAttribute("opacity", (0.52 + thrust * 0.32).toFixed(2));
        bodyRigG.setAttribute("opacity", "1");
        updateFullBodyKinematics(now, thrust, 0, 0, 0, { standPose, wingOpen, armFlare });
        stepSpringAntenna(dt, -shudderX * 4 - headLook * 0.35);

        const leftHome = AgentBlog.getView && AgentBlog.getView() !== "home";
        if (leftHome || gantryT >= totalG) {
          avPhase = "patrolling";
          patrolT = 0;
          drone.vx = 0;
          drone.vy = -380;
          drone.headTilt = headLook;
          launchOrigin.y = drone.y;
        }
      } else if (avPhase === "unfolding") {
        foldT += dt;
        const u = clamp01(foldT / 0.40);
        const ease = 1 - Math.pow(1 - u, 3);
        const curHx = lerp(unfoldStart.hx, 0, ease);
        const curHy = lerp(unfoldStart.hy, 0, ease);
        const curHrot = lerp(unfoldStart.hrot, 0, ease);
        const curScale = lerp(1.0, flyTargetScale, ease);

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
        patrolT += dt * 0.80;
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

        const riseScale = patrolIsReRun ? flyTargetScale : lerp(launchMatchScale, flyTargetScale, smooth(0.0, 0.75, patrolT));
        const flyScale = lerp(riseScale, 1.0, clamp01((patrolT - (totalDur - 0.65)) / 0.65));
        // Subtle Pixar aerodynamic ascent stretch during vertical rocket surge!
        const ascentStretch = clamp01(-drone.vy / 560) * 0.072;
        const flySX = flyScale * (1 - ascentStretch * 0.55);
        const flySY = flyScale * (1 + ascentStretch);
        craftG.setAttribute("transform", `scale(${flySX.toFixed(3)}, ${flySY.toFixed(3)}) rotate(${drone.bodyBank.toFixed(2)})`);
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

        // Ink-wash bamboo ribbon contrail + delicate drifting thrust sparks below thruster boots!
        const bootDist = 20 * flyScale * pxPerUnit;
        const tailX = drone.x - Math.sin(bankRad) * bootDist;
        const tailY = drone.y + hoverBobY + Math.cos(bankRad) * bootDist;
        trailSampleCooldown -= dt;
        if (speed > 26 && trailSampleCooldown <= 0) {
          trailPts.push({ x: tailX, y: tailY, life: 0.56 });
          if (trailPts.length > 22) trailPts.shift();
          trailSampleCooldown = 0.024;
        }
        for (let i = trailPts.length - 1; i >= 0; i--) {
          trailPts[i].life -= dt;
          if (trailPts[i].life <= 0) trailPts.splice(i, 1);
        }
        renderRibbonContrail(speed > 20 ? 1 : 0.65);

        wakeCooldown -= dt;
        if (speed > 45 && wakeCooldown <= 0) {
          const p = wakeDots[wakeIdx % wakeDots.length];
          wakeIdx += 1;
          p.x = tailX + (Math.random() - 0.5) * 4;
          p.y = tailY + (Math.random() - 0.5) * 3;
          p.vx = -drone.vx * 0.08 + (Math.random() - 0.5) * 26;
          p.vy = 18 + Math.random() * 22;
          p.life = 0.44;
          wakeCooldown = 0.075;
        }

        wakeDots.forEach((p) => {
          if (p.life > 0) {
            p.life = Math.max(0, p.life - dt);
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            const u = p.life / 0.44;
            p.el.setAttribute("cx", p.x.toFixed(1));
            p.el.setAttribute("cy", p.y.toFixed(1));
            p.el.setAttribute("r", (0.55 + u * 0.85).toFixed(2));
            p.el.setAttribute("opacity", (u * 0.62).toFixed(2));
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

        for (let i = trailPts.length - 1; i >= 0; i--) {
          trailPts[i].life -= dt * 1.6;
          if (trailPts[i].life <= 0) trailPts.splice(i, 1);
        }
        renderRibbonContrail(1 - u);

        wakeDots.forEach((p) => {
          if (p.life > 0) {
            p.life = Math.max(0, p.life - dt);
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            const wu = p.life / 0.44;
            p.el.setAttribute("cx", p.x.toFixed(1));
            p.el.setAttribute("cy", p.y.toFixed(1));
            p.el.setAttribute("opacity", (wu * 0.55).toFixed(2));
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
          const allSquares = fpCanvasEl.querySelectorAll(".gh-grid .heat-sq");
          const weekCount = Math.floor(allSquares.length / 7);
          for (let wi = 0; wi < weekCount; wi += 2) {
            if (pingedHeatmapWeeks[wi]) continue;
            const anchorSq = allSquares[wi * 7 + 3] || allSquares[wi * 7];
            if (!anchorSq) continue;
            const hr = anchorSq.getBoundingClientRect();
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
