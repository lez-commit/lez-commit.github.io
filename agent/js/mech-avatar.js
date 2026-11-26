(function () {
  "use strict";

  const AgentBlog = (window.AgentBlog = window.AgentBlog || {});

  /* =======================================================================
     11. TOP-RIGHT LIVE MECH HEAD AVATAR & OPTICAL PAGE SCANNER
         Descends from top edge after Stage 5 takeoff, brakes with luminous
         bamboo-mint plumes, folds into studio-grade CRT mech head, sweeps
         an optical scan that pings each era column, glides smoothly to
         top-left, and lives on as a 2.5D spring-parallax eye-tracking mascot.
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
    // FULL-VIEWPORT ARCHITECTURAL OPTICAL SCANNER OVERLAY
    // =====================================================================
    let scanFan = null, scanCoreFan = null, scanLeadRay = null, scanTrailRay = null, scanSpineTick = null;
    if (scanOverlay) {
      scanOverlay.setAttribute("shape-rendering", "geometricPrecision");
      const sDefs = mk("defs", null, scanOverlay);

      const fanGrad = mk("linearGradient", { id: "mech-scan-fan-grad", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, sDefs);
      mk("stop", { offset: "0%", "stop-color": "#2D6A47", "stop-opacity": "0.26" }, fanGrad);
      mk("stop", { offset: "52%", "stop-color": "#2D6A47", "stop-opacity": "0.09" }, fanGrad);
      mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.01" }, fanGrad);

      const coreGrad = mk("linearGradient", { id: "mech-scan-core-grad", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, sDefs);
      mk("stop", { offset: "0%", "stop-color": "#B5F5D4", "stop-opacity": "0.34" }, coreGrad);
      mk("stop", { offset: "55%", "stop-color": "#2D6A47", "stop-opacity": "0.10" }, coreGrad);
      mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, coreGrad);

      scanFan = mk("polygon", { fill: "url(#mech-scan-fan-grad)", opacity: "0" }, scanOverlay);
      scanCoreFan = mk("polygon", { fill: "url(#mech-scan-core-grad)", opacity: "0" }, scanOverlay);
      scanLeadRay = mk("line", { stroke: "#2D6A47", "stroke-width": "1.15", "stroke-opacity": "0.62", "stroke-linecap": "round", opacity: "0" }, scanOverlay);
      scanTrailRay = mk("line", { stroke: "#2D6A47", "stroke-width": "0.75", "stroke-opacity": "0.26", "stroke-dasharray": "3 3", opacity: "0" }, scanOverlay);
      scanSpineTick = mk("circle", { r: "3.2", fill: "#2D6A47", "fill-opacity": "0.35", stroke: "#2D6A47", "stroke-width": "1.0", opacity: "0" }, scanOverlay);
    }

    // =====================================================================
    // HERO MECH AVATAR SVG (Consistent Editorial Ink-and-Wash Craft)
    // =====================================================================
    const svg = mk("svg", { viewBox: "-26 -24 52 44", "shape-rendering": "geometricPrecision" }, btn);
    const defs = mk("defs", null, svg);

    const jetGrad = mk("linearGradient", { id: "mech-jet-grad", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, defs);
    mk("stop", { offset: "0%", "stop-color": "#B5F5D4", "stop-opacity": "0.95" }, jetGrad);
    mk("stop", { offset: "40%", "stop-color": "#2D6A47", "stop-opacity": "0.62" }, jetGrad);
    mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, jetGrad);

    const coreGlow = mk("radialGradient", { id: "mech-core-glow", cx: "50%", cy: "50%", r: "50%" }, defs);
    mk("stop", { offset: "0%", "stop-color": "#4FA072", "stop-opacity": "0.62" }, coreGlow);
    mk("stop", { offset: "60%", "stop-color": "#2D6A47", "stop-opacity": "0.18" }, coreGlow);
    mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, coreGlow);

    // Braking air-puff ring, aerodynamic glide slipstream & dock lock-in sparks
    const brakeRing = mk("ellipse", { cx: "0", cy: "14.5", rx: "6", ry: "1.6", fill: "none", stroke: "#2D6A47", "stroke-width": "1.05", opacity: "0" }, svg);
    const glideTrail = mk("g", { opacity: "0" }, svg);
    mk("line", { x1: "15", y1: "-1.5", x2: "29", y2: "-1.5", stroke: "#2D6A47", "stroke-width": "1.15", "stroke-linecap": "round" }, glideTrail);
    mk("line", { x1: "16", y1: "2.8", x2: "26", y2: "2.8", stroke: "#2D6A47", "stroke-width": "0.95", "stroke-opacity": "0.65", "stroke-linecap": "round" }, glideTrail);
    mk("line", { x1: "15", y1: "7.0", x2: "22", y2: "7.0", stroke: "#1D1B18", "stroke-width": "0.8", "stroke-opacity": "0.35", "stroke-linecap": "round" }, glideTrail);

    const morphSparks = mk("g", { opacity: "0" }, svg);
    mk("path", {
      d: "M -15,-11 L -19,-15 M 15,-11 L 19,-15 M -15,12 L -19,16 M 15,12 L 19,16",
      fill: "none", stroke: "#2D6A47", "stroke-width": "1.25", "stroke-linecap": "round"
    }, morphSparks);
    const morphRing = mk("circle", { cx: "0", cy: "2", r: "10", fill: "none", stroke: "#2D6A47", "stroke-width": "1.05", opacity: "0" }, svg);

    // Root group for descending vertical travel
    const rootG = mk("g", { transform: "translate(0, -64)" }, svg);

    // --- Retractable Body Subgroups (matching evo-walker.js ink-and-wash mech!) ---
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
    // Twin-nozzle Skills Jetpack
    mk("rect", { x: "-8.6", y: "-2.8", width: "4.4", height: "7.6", rx: "1.1", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.05" }, torsoG);
    mk("rect", { x: "-8.2", y: "-2.3", width: "1.6", height: "6.6", rx: "0.4", fill: "#EDE8DE" }, torsoG);
    // Chamfered Shoulder Pauldrons
    mk("path", { d: "M -5.8,-4.0 L 5.8,-4.0 L 6.7,-1.6 L -6.7,-1.6 Z", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.05", "stroke-linejoin": "round" }, torsoG);
    mk("path", { d: "M -4.2,-3.8 L -4.7,-1.8 M 4.2,-3.8 L 4.7,-1.8", fill: "none", stroke: "#1D1B18", "stroke-width": "0.7", "stroke-opacity": "0.5" }, torsoG);
    // Sculpted Chassis + Warm Stone Bevel + X-Harness + Glowing Arc Core
    mk("rect", { x: "-4.6", y: "-3.2", width: "9.2", height: "9.4", rx: "1.2", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.2" }, torsoG);
    mk("rect", { x: "-4.1", y: "-2.7", width: "2.4", height: "8.4", rx: "0.6", fill: "#EDE8DE", "fill-opacity": "0.85" }, torsoG);
    mk("path", { d: "M -3.8,-2.4 L 3.8,5.4 M 3.8,-2.4 L -3.8,5.4", fill: "none", stroke: "#1D1B18", "stroke-width": "0.95", "stroke-linecap": "round" }, torsoG);
    mk("circle", { cx: "0", cy: "1.5", r: "4.4", fill: "url(#mech-core-glow)" }, torsoG);
    mk("circle", { cx: "0", cy: "1.5", r: "2.15", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.85" }, torsoG);
    mk("circle", { cx: "0", cy: "1.5", r: "1.35", fill: "#2D6A47" }, torsoG);

    // Luminous zero-outline braking repulsor plumes (consistent with evo-walker.js!)
    const jetsG = mk("g", { opacity: "0" }, rootG);
    const jetL = mk("path", { fill: "url(#mech-jet-grad)" }, jetsG);
    const jetLCore = mk("path", { fill: "#E6FFF1", "fill-opacity": "0.9" }, jetsG);
    const jetR = mk("path", { fill: "url(#mech-jet-grad)" }, jetsG);
    const jetRCore = mk("path", { fill: "#E6FFF1", "fill-opacity": "0.9" }, jetsG);
    const jetB = mk("path", { fill: "url(#mech-jet-grad)", opacity: "0.82" }, jetsG);
    mk("circle", { cx: "-11.2", cy: "6.7", r: "1.45", fill: "#B5F5D4", stroke: "#2D6A47", "stroke-width": "0.55" }, jetsG);
    mk("circle", { cx: "11.2", cy: "6.7", r: "1.45", fill: "#B5F5D4", stroke: "#2D6A47", "stroke-width": "0.55" }, jetsG);

    // --- Hero Mech Head Group (2.5D studio-grade CRT mascot — calibrated strokes for 1.86x editorial crispness) ---
    const headG = mk("g", { transform: "translate(0, -8.8) scale(1)" }, rootG);

    // Spring-mounted antenna subgroup
    const antG = mk("g", null, headG);
    mk("rect", { x: "-1.9", y: "-5.5", width: "2.2", height: "1.1", rx: "0.45", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.62" }, antG);
    mk("line", { x1: "-0.8", y1: "-5.4", x2: "-1.4", y2: "-8.8", stroke: "#1D1B18", "stroke-width": "0.85", "stroke-linecap": "round" }, antG);
    const antTip = mk("circle", { class: "mech-ant-tip", cx: "-1.5", cy: "-9.5", r: "1.35", fill: "#2D6A47", stroke: "#1D1B18", "stroke-width": "0.72" }, antG);

    // Sculpted ear-bolt pods with stone wash + seam
    mk("rect", { x: "-7.0", y: "-1.7", width: "1.7", height: "3.5", rx: "0.65", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.72" }, headG);
    mk("line", { x1: "-6.1", y1: "-0.9", x2: "-6.1", y2: "1.0", stroke: "#1D1B18", "stroke-width": "0.45", "stroke-opacity": "0.45" }, headG);
    mk("rect", { x: "5.3", y: "-1.7", width: "1.7", height: "3.5", rx: "0.65", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.72" }, headG);
    mk("line", { x1: "6.1", y1: "-0.9", x2: "6.1", y2: "1.0", stroke: "#1D1B18", "stroke-width": "0.45", "stroke-opacity": "0.45" }, headG);

    // Mech V-Crest
    mk("path", { d: "M -4.7,-4.4 L 0,-7.1 L 4.7,-4.4", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.78", "stroke-linecap": "round", "stroke-linejoin": "round" }, headG);
    mk("path", { d: "M -2.6,-4.6 L 0,-6.1 L 2.6,-4.6", fill: "#EDE8DE" }, headG);

    // CRT Head Shell + Warm Stone Lower Chin Bevel + Subtle Top Rim Highlight
    mk("rect", { x: "-5.8", y: "-4.6", width: "11.6", height: "9.0", rx: "2.6", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.86" }, headG);
    mk("path", { d: "M -5.2,2.1 Q -5.2,3.9 -3.0,3.9 L 3.0,3.9 Q 5.2,3.9 5.2,2.1 L 5.2,1.6 L -5.2,1.6 Z", fill: "#EDE8DE", "fill-opacity": "0.84" }, headG);
    mk("line", { x1: "-3.6", y1: "-3.95", x2: "3.6", y2: "-3.95", stroke: "#FFFFFF", "stroke-width": "0.55", "stroke-opacity": "0.8", "stroke-linecap": "round" }, headG);

    // Recessed Dark Ink Visor + Corner Curved Glass Reflection (never collides with eyes!)
    mk("rect", { x: "-4.4", y: "-2.7", width: "8.8", height: "5.2", rx: "1.75", fill: "#1D1B18" }, headG);
    const visorGlint = mk("path", {
      d: "M -3.55,-1.65 Q -3.55,-2.18 -2.35,-2.18",
      fill: "none", stroke: "#FAF8F4", "stroke-width": "0.46", "stroke-opacity": "0.38", "stroke-linecap": "round"
    }, headG);

    // Expressive Eye Layers (Idle Tracking / Hover Happy / Click Playful Wink)
    const eyesIdleG = mk("g", { class: "mech-eyes-idle" }, headG);
    const eyesTrackG = mk("g", null, eyesIdleG);
    const eyeDotL = mk("circle", { cx: "-1.85", cy: "-0.05", r: "1.2", fill: "#FAF8F4" }, eyesTrackG);
    const eyeDotR = mk("circle", { cx: "1.85", cy: "-0.05", r: "1.2", fill: "#FAF8F4" }, eyesTrackG);

    const eyesHappyG = mk("g", { class: "mech-eyes-happy" }, headG);
    mk("path", { d: "M -3.05,0.45 Q -1.85,-1.25 -0.65,0.45 M 0.65,0.45 Q 1.85,-1.25 3.05,0.45", fill: "none", stroke: "#B5F5D4", "stroke-width": "0.92", "stroke-linecap": "round" }, eyesHappyG);

    const eyesWinkG = mk("g", { class: "mech-eyes-wink" }, headG);
    mk("circle", { cx: "-1.85", cy: "-0.05", r: "1.2", fill: "#B5F5D4" }, eyesWinkG);
    mk("path", { d: "M 0.65,0.45 Q 1.85,-1.2 3.05,0.45", fill: "none", stroke: "#B5F5D4", "stroke-width": "0.92", "stroke-linecap": "round" }, eyesWinkG);

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

    function hideScanBeams() {
      if (!scanFan) return;
      scanFan.setAttribute("opacity", "0");
      scanCoreFan.setAttribute("opacity", "0");
      scanLeadRay.setAttribute("opacity", "0");
      scanTrailRay.setAttribute("opacity", "0");
      scanSpineTick.setAttribute("opacity", "0");
    }

    function pingEraColumn(colEl) {
      if (!colEl) return;
      colEl.classList.add("is-scan-ping");
      setTimeout(() => colEl.classList.remove("is-scan-ping"), 460);
    }

    function wakeNavButton(nb) {
      if (!nb) return;
      nb.classList.add("is-scan-wake");
      setTimeout(() => nb.classList.remove("is-scan-wake"), 360);
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
      antSpring.vel += 190;
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
      eyePos.tx = (dx / dist) * 1.35 * ratio;
      eyePos.ty = (dy / dist) * 0.95 * ratio;
      headSpring.tx = (dx / dist) * 0.85 * ratio;
      headSpring.ty = (dy / dist) * 0.55 * ratio;
      headSpring.trot = (dx / dist) * 2.6 * ratio;
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      eyePos.tx = 0;
      eyePos.ty = 0;
      headSpring.tx = 0;
      headSpring.ty = 0;
      headSpring.trot = 0;
    });

    btn.addEventListener("mouseenter", () => {
      if (avPhase === "avatar") antSpring.vel += 140;
    });

    // Subtle flagship-node vermilion antenna sense when exploring the map
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

    // Click: return home from subpages, OR playful wink + pulse ring when already on home!
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

    // Double-click on homepage replays a quick lightweight optical re-scan from top-left!
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

    // Helper: render optical sweep fan & ping columns crossed by leadX
    function renderOpticalScan(u, leftToRight) {
      const beamAlpha = u < 0.12 ? u / 0.12 : u > 0.86 ? (1 - u) / 0.14 : 1;
      const sweepU = clamp01((u - 0.08) / 0.80);
      const sweepEase = sweepU < 0.5 ? 2 * sweepU * sweepU : 1 - Math.pow(-2 * sweepU + 2, 2) / 2;

      // Harmonious bamboo-mint glowing eyes tracking the sweep
      eyeDotL.setAttribute("fill", "#B5F5D4");
      eyeDotR.setAttribute("fill", "#B5F5D4");
      const lookX = leftToRight ? lerp(-1.2, 1.35, sweepEase) : lerp(0.85, -1.35, sweepEase);
      const lookY = lerp(0.85, 0.35, sweepEase);
      eyesTrackG.setAttribute("transform", `translate(${lookX.toFixed(2)}, ${lookY.toFixed(2)})`);

      if (!scanFan) return;
      const r = btn.getBoundingClientRect();
      const exMid = r.left + r.width * 0.50;
      const ey = r.top + r.height * 0.56;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const fanW = Math.max(110, W * 0.11);

      const leadX = leftToRight
        ? lerp(W * 0.03, W * 1.02, sweepEase)
        : lerp(W * 0.97, -W * 0.03, sweepEase);
      const trailX = leftToRight
        ? Math.max(0, leadX - fanW)
        : Math.min(W, leadX + fanW);
      const coreTrailX = leftToRight
        ? Math.max(0, leadX - fanW * 0.36)
        : Math.min(W, leadX + fanW * 0.36);

      scanFan.setAttribute("points", `${(exMid - 5).toFixed(1)},${ey.toFixed(1)} ${(exMid + 5).toFixed(1)},${ey.toFixed(1)} ${trailX.toFixed(1)},${H} ${leadX.toFixed(1)},${H}`);
      scanFan.setAttribute("opacity", (beamAlpha * 0.92).toFixed(2));

      scanCoreFan.setAttribute("points", `${(exMid - 3).toFixed(1)},${ey.toFixed(1)} ${(exMid + 3).toFixed(1)},${ey.toFixed(1)} ${coreTrailX.toFixed(1)},${H} ${leadX.toFixed(1)},${H}`);
      scanCoreFan.setAttribute("opacity", (beamAlpha * 0.85).toFixed(2));

      scanLeadRay.setAttribute("x1", exMid.toFixed(1));
      scanLeadRay.setAttribute("y1", ey.toFixed(1));
      scanLeadRay.setAttribute("x2", leadX.toFixed(1));
      scanLeadRay.setAttribute("y2", String(H));
      scanLeadRay.setAttribute("opacity", (beamAlpha * 0.78).toFixed(2));

      scanTrailRay.setAttribute("x1", exMid.toFixed(1));
      scanTrailRay.setAttribute("y1", ey.toFixed(1));
      scanTrailRay.setAttribute("x2", trailX.toFixed(1));
      scanTrailRay.setAttribute("y2", String(H));
      scanTrailRay.setAttribute("opacity", (beamAlpha * 0.5).toFixed(2));

      // Delicate glowing reticle tracking along the horizontal timeline spine
      const spineEl = skeletonGridEl && skeletonGridEl.querySelector(".timeline-spine");
      if (spineEl) {
        const sr = spineEl.getBoundingClientRect();
        const t = clamp01((sr.top - ey) / Math.max(1, H - ey));
        const spineX = lerp(exMid, leadX, t);
        scanSpineTick.setAttribute("cx", spineX.toFixed(1));
        scanSpineTick.setAttribute("cy", sr.top.toFixed(1));
        scanSpineTick.setAttribute("opacity", (beamAlpha * 0.85).toFixed(2));

        // Ping each era column gently as the optical beam passes over it!
        if (!AgentBlog.getView || AgentBlog.getView() === "home") {
          const cols = skeletonGridEl.querySelectorAll(".era-col");
          cols.forEach((col, idx) => {
            if (scannedColFlags[idx]) return;
            const cr = col.getBoundingClientRect();
            const cx = cr.left + cr.width * 0.5;
            const crossed = leftToRight ? spineX >= cx : spineX <= cx;
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
          ? lerp(1.0, 1.96, 1 - Math.pow(1 - headU / 0.78, 3))
          : lerp(1.96, 1.86, (headU - 0.78) / 0.22);
        const headY = lerp(-8.8, 3.2, 1 - Math.pow(1 - headU, 3));
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
          headG.setAttribute("transform", "translate(0, 3.2) scale(1.86)");
        }
      } else if (avPhase === "scanning") {
        avT += dt;
        const u = clamp01(avT / 1.18);
        renderOpticalScan(u, false);

        if (avT >= 1.18) {
          avPhase = "gliding";
          avT = 0;
          navWakeFlags = [];
          glideStartX = getRightOffsetX();
          hideScanBeams();
          eyeDotL.setAttribute("fill", "#FAF8F4");
          eyeDotR.setAttribute("fill", "#FAF8F4");
          triggerBlink(false);
        }
      } else if (avPhase === "rescan") {
        // Lightweight interactive re-scan triggered by double-clicking the docked top-left avatar!
        avT += dt;
        const u = clamp01(avT / 1.05);
        renderOpticalScan(u, true);

        if (avT >= 1.05) {
          avPhase = "avatar";
          avT = 0;
          hideScanBeams();
          eyeDotL.setAttribute("fill", "#FAF8F4");
          eyeDotR.setAttribute("fill", "#FAF8F4");
          triggerBlink(false);
        }
      } else if (avPhase === "gliding") {
        // Silky 60fps glide from top-right to top-left (zero CSS transition conflict!)
        avT += dt;
        const u = clamp01(avT / 0.92);
        const ease = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
        const curX = lerp(glideStartX, 0, ease);
        btn.style.transform = `translateX(${curX.toFixed(1)}px)`;

        // Aerodynamic tilt + eyes looking ahead left + slipstream trail + trailing antenna lean
        const glideBell = Math.sin(u * Math.PI);
        const tilt = -glideBell * 7.2;
        headG.setAttribute("transform", `translate(0, 3.2) scale(1.86) rotate(${tilt.toFixed(1)})`);
        antG.setAttribute("transform", `rotate(${(glideBell * 12).toFixed(1)}, -0.8, -5.0)`);
        eyesTrackG.setAttribute("transform", `translate(${(-1.25 * glideBell).toFixed(2)}, 0)`);
        glideTrail.setAttribute("opacity", (glideBell * 0.65).toFixed(2));

        // Gently shimmer each already-clickable nav button as the mech glides past it!
        const revCount = navBtns.length;
        for (let i = 0; i < revCount; i++) {
          const revIdx = revCount - 1 - i; // 0 = 关于 (rightmost), 1 = 全部文章, 2 = 图谱首页
          const wakeAt = 0.08 + revIdx * 0.12;
          if (!navWakeFlags[i] && u >= wakeAt) {
            navWakeFlags[i] = true;
            wakeNavButton(navBtns[i]);
          }
        }

        if (avT >= 0.92) {
          avPhase = "avatar";
          btn.style.transform = "";
          headG.setAttribute("transform", "translate(0, 3.2) scale(1.86)");
          antG.setAttribute("transform", "rotate(0, -0.8, -5.0)");
          eyesTrackG.setAttribute("transform", "translate(0, 0)");
          glideTrail.setAttribute("opacity", "0");
          btn.classList.add("is-docked");
          syncTimer = 0.45;
          antSpring.vel = -180;
          triggerBlink(false);
        }
      } else if (avPhase === "avatar") {
        // 2.5D Living Desk-Toy Parallax (Eyes + Subtle Head Tilt + Damped Spring Antenna + Counter-Glint)
        const prevRot = headSpring.rot;
        eyePos.cx += (eyePos.tx - eyePos.cx) * 0.18;
        eyePos.cy += (eyePos.ty - eyePos.cy) * 0.18;
        headSpring.cx += (headSpring.tx - headSpring.cx) * 0.12;
        headSpring.cy += (headSpring.ty - headSpring.cy) * 0.12;
        headSpring.rot += (headSpring.trot - headSpring.rot) * 0.12;

        // Antenna spring physics driven by head angular velocity
        const rotVel = (headSpring.rot - prevRot) / Math.max(0.008, dt);
        const k = 150;
        const damp = 10.5;
        const accel = -k * antSpring.angle - damp * antSpring.vel - rotVel * 1.1;
        antSpring.vel += accel * dt;
        antSpring.angle = Math.max(-18, Math.min(18, antSpring.angle + antSpring.vel * dt));

        headG.setAttribute(
          "transform",
          `translate(${headSpring.cx.toFixed(2)}, ${(3.2 + headSpring.cy).toFixed(2)}) scale(1.86) rotate(${headSpring.rot.toFixed(2)})`
        );
        antG.setAttribute("transform", `rotate(${antSpring.angle.toFixed(2)}, -0.8, -5.0)`);
        eyesTrackG.setAttribute("transform", `translate(${eyePos.cx.toFixed(2)}, ${eyePos.cy.toFixed(2)})`);
        visorGlint.setAttribute("transform", `translate(${(-eyePos.cx * 0.32).toFixed(2)}, ${(-eyePos.cy * 0.24).toFixed(2)})`);

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
