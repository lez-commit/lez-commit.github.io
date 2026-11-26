(function () {
  "use strict";

  const AgentBlog = (window.AgentBlog = window.AgentBlog || {});

  /* =======================================================================
     11. AUTONOMOUS PRODUCTION AGENT — SCULPTURAL MINIMALIST AERIAL DRONE
         - Inspired by EVE (WALL-E) × Braun × Teenage Engineering × Ink-on-Paper
         - Free-space 2D aerodynamic flight physics (damped spring velocity,
           natural banking into turns, organic hover bobbing, curious pause &
           head-tilt over the Flagship Era 4 LangGraph card)
         - Projects a soft feathered downward optical cone directly beneath its
           visor during flight, waking columns & heatmap squares underneath
         - Docks seamlessly at top-left & emits a full-screen radial bamboo
           sonar wavefront sweeping 100% of the viewport
         - Lives on as a weightless floating 2.5D eye-tracking mascot;
           double-click anytime to undock & fly a live autonomous patrol!
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
    // FULL-VIEWPORT OVERLAY: DOWNWARD OPTICAL CONE + WAKE + RADIAL SONAR WAVE
    // =====================================================================
    let coneG = null;
    let conePoly = null;
    let coneCorePoly = null;
    let coneEdgeL = null;
    let coneEdgeR = null;
    let groundFocusRing = null;
    let wakeDots = [];
    let sonarG = null;
    let sonarOuterHalo = null;
    let sonarRingMain = null;
    let sonarRingEcho = null;

    if (scanOverlay) {
      scanOverlay.setAttribute("shape-rendering", "geometricPrecision");
      const sDefs = mk("defs", null, scanOverlay);

      // Soft downward vertical optical inspection beam (bamboo green)
      const beamGrad = mk("linearGradient", { id: "agent-beam-grad", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, sDefs);
      mk("stop", { offset: "0%", "stop-color": "#2D6A47", "stop-opacity": "0.24" }, beamGrad);
      mk("stop", { offset: "45%", "stop-color": "#2D6A47", "stop-opacity": "0.10" }, beamGrad);
      mk("stop", { offset: "85%", "stop-color": "#2D6A47", "stop-opacity": "0.025" }, beamGrad);
      mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, beamGrad);

      const coreBeamGrad = mk("linearGradient", { id: "agent-beam-core", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, sDefs);
      mk("stop", { offset: "0%", "stop-color": "#B5F5D4", "stop-opacity": "0.34" }, coreBeamGrad);
      mk("stop", { offset: "48%", "stop-color": "#2D6A47", "stop-opacity": "0.09" }, coreBeamGrad);
      mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, coreBeamGrad);

      // Warm vermilion inspection cone gradient when curiously inspecting the Flagship card
      const flagBeamGrad = mk("linearGradient", { id: "agent-beam-flag", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, sDefs);
      mk("stop", { offset: "0%", "stop-color": "#B83B2A", "stop-opacity": "0.20" }, flagBeamGrad);
      mk("stop", { offset: "48%", "stop-color": "#B83B2A", "stop-opacity": "0.08" }, flagBeamGrad);
      mk("stop", { offset: "100%", "stop-color": "#B83B2A", "stop-opacity": "0.0" }, flagBeamGrad);

      // Subtle trailing aerodynamic wake particles along 2D flight path
      for (let i = 0; i < 10; i++) {
        const d = mk("circle", { r: "1.35", fill: "#2D6A47", opacity: "0" }, scanOverlay);
        wakeDots.push({ el: d, x: 0, y: 0, life: 0 });
      }

      // Downward inspection cone group (pure feathered light veil, zero clutter over typography!)
      coneG = mk("g", { opacity: "0" }, scanOverlay);
      conePoly = mk("polygon", { fill: "url(#agent-beam-grad)" }, coneG);
      coneCorePoly = mk("polygon", { fill: "url(#agent-beam-core)" }, coneG);
      coneEdgeL = mk("line", { stroke: "#2D6A47", "stroke-width": "0.7", "stroke-opacity": "0.22" }, coneG);
      coneEdgeR = mk("line", { stroke: "#2D6A47", "stroke-width": "0.7", "stroke-opacity": "0.22" }, coneG);

      // Full-screen radial bamboo sonar wavefront (emitted cleanly from docked Agent across 100% viewport!)
      sonarG = mk("g", { opacity: "0" }, scanOverlay);
      sonarOuterHalo = mk("circle", { fill: "none", stroke: "#2D6A47", "stroke-width": "28", "stroke-opacity": "0.05" }, sonarG);
      sonarRingMain = mk("circle", { fill: "none", stroke: "#2D6A47", "stroke-width": "1.4", "stroke-opacity": "0.62" }, sonarG);
      sonarRingEcho = mk("circle", { fill: "none", stroke: "#2D6A47", "stroke-width": "0.75", "stroke-dasharray": "4 4", "stroke-opacity": "0.35" }, sonarG);
    }

    // =====================================================================
    // SCULPTURAL MINIMALIST MONO-SHELL AGENT SVG (EVE × Braun × Ink-on-Paper)
    // =====================================================================
    const svg = mk("svg", { viewBox: "-24 -22 48 44", "shape-rendering": "geometricPrecision" }, btn);
    const defs = mk("defs", null, svg);

    const hoverGlow = mk("radialGradient", { id: "agent-hover-glow", cx: "50%", cy: "50%", r: "50%" }, defs);
    mk("stop", { offset: "0%", "stop-color": "#7AD9A3", "stop-opacity": "0.65" }, hoverGlow);
    mk("stop", { offset: "55%", "stop-color": "#2D6A47", "stop-opacity": "0.22" }, hoverGlow);
    mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, hoverGlow);

    const eyeGlow = mk("radialGradient", { id: "agent-eye-glow", cx: "50%", cy: "50%", r: "50%" }, defs);
    mk("stop", { offset: "0%", "stop-color": "#B5F5D4", "stop-opacity": "0.42" }, eyeGlow);
    mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.0" }, eyeGlow);

    // Local dock confirmation ripple ring
    const dockRing = mk("circle", { cx: "0", cy: "0", r: "10", fill: "none", stroke: "#2D6A47", "stroke-width": "1.0", opacity: "0" }, svg);

    // Main floating body wrapper (handles smooth levitation + aerodynamic banking)
    const craftG = mk("g", null, svg);

    // Subtle anti-gravity levitation field underneath shell (only visible while flying!)
    const antiGravG = mk("g", { opacity: "0" }, craftG);
    mk("ellipse", { cx: "0", cy: "13.2", rx: "8.2", ry: "3.0", fill: "url(#agent-hover-glow)" }, antiGravG);
    const antiGravRing = mk("ellipse", { cx: "0", cy: "12.2", rx: "5.2", ry: "1.2", fill: "none", stroke: "#2D6A47", "stroke-width": "0.95", "stroke-opacity": "0.75" }, antiGravG);

    // Subtle soft ground shadow when docked & floating peacefully at top-left
    const dockShadow = mk("ellipse", { cx: "0", cy: "13.6", rx: "7.2", ry: "1.25", fill: "#1D1B18", "fill-opacity": "0.09", opacity: "0" }, svg);

    // --- Sculptural Mono-Shell Head (Zero spikes, pure aerodynamic elegance!) ---
    const headG = mk("g", { transform: "scale(1.22)" }, craftG);

    // Flush-mounted recessed side acoustic rings (subtle architectural contour, zero protruding blocks)
    mk("path", { d: "M -10.5,-1.8 Q -11.4,0 -10.5,1.8", fill: "none", stroke: "#1D1B18", "stroke-width": "0.9", "stroke-linecap": "round", "stroke-opacity": "0.65" }, headG);
    mk("path", { d: "M 10.5,-1.8 Q 11.4,0 10.5,1.8", fill: "none", stroke: "#1D1B18", "stroke-width": "0.9", "stroke-linecap": "round", "stroke-opacity": "0.65" }, headG);

    // Seamless aerodynamic mono-shell silhouette (smooth crown curving gracefully to sculpted chin)
    mk("path", {
      d: "M 0,-9.2 C 6.6,-9.2 10.4,-5.4 10.4,-0.4 C 10.4,4.8 6.8,8.6 0,8.6 C -6.8,8.6 -10.4,4.8 -10.4,-0.4 C -10.4,-5.4 -6.6,-9.2 0,-9.2 Z",
      fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.05"
    }, headG);

    // Warm rice-paper stone-wash lower underside contour shadow (subtle 3D sculptural volume)
    mk("path", {
      d: "M -8.6,3.8 C -6.4,6.8 -3.4,7.9 0,7.9 C 3.4,7.9 6.4,6.8 8.6,3.8 C 6.2,5.6 3.2,6.3 0,6.3 C -3.2,6.3 -6.2,5.6 -8.6,3.8 Z",
      fill: "#EDE8DE", "fill-opacity": "0.92"
    }, headG);

    // Crisp crown highlight sheen
    mk("path", {
      d: "M -4.2,-7.9 Q 0,-8.6 4.2,-7.9",
      fill: "none", stroke: "#FFFFFF", "stroke-width": "0.7", "stroke-opacity": "0.85", "stroke-linecap": "round"
    }, headG);

    // Single Signature Industrial Detail: flush-inlaid micro crown status slit (bamboo idle / vermilion flagship)
    const statusSlit = mk("rect", {
      class: "mech-status-slit",
      x: "-2.4", y: "-7.0", width: "4.8", height: "1.15", rx: "0.58",
      fill: "#2D6A47"
    }, headG);

    // Deep Edge-to-Edge Obsidian OLED Wrap Visor (the unmistakable hero focus!)
    mk("path", {
      d: "M 0,-4.7 C 5.4,-4.7 8.4,-2.7 8.4,0.2 C 8.4,3.1 5.4,5.0 0,5.0 C -5.4,5.0 -8.4,3.1 -8.4,0.2 C -8.4,-2.7 -5.4,-4.7 0,-4.7 Z",
      fill: "#181715"
    }, headG);

    // Soft inner OLED luminance glow inside visor
    const visorAura = mk("ellipse", { cx: "0", cy: "0.2", rx: "6.4", ry: "3.2", fill: "url(#agent-eye-glow)", opacity: "0.5" }, headG);

    // Curved glass reflection tucked smoothly along upper-left visor rim
    const visorGlint = mk("path", {
      d: "M -6.4,-1.3 Q -4.6,-3.4 -1.4,-3.7",
      fill: "none", stroke: "#FAF8F4", "stroke-width": "0.55", "stroke-opacity": "0.32", "stroke-linecap": "round"
    }, headG);

    // Expressive Luminous OLED Pill Eyes (EVE / Astro Bot clarity!)
    const eyesIdleG = mk("g", { class: "mech-eyes-idle" }, headG);
    const eyesTrackG = mk("g", null, eyesIdleG);
    const eyeL = mk("rect", { x: "-4.5", y: "-1.75", width: "2.35", height: "3.7", rx: "1.18", fill: "#EBFFF3" }, eyesTrackG);
    const eyeR = mk("rect", { x: "2.15", y: "-1.75", width: "2.35", height: "3.7", rx: "1.18", fill: "#EBFFF3" }, eyesTrackG);

    // Hover delighted OLED arcs (^ ^)
    const eyesHappyG = mk("g", { class: "mech-eyes-happy" }, headG);
    mk("path", {
      d: "M -4.7,1.0 Q -3.3,-1.6 -1.9,1.0 M 1.9,1.0 Q 3.3,-1.6 4.7,1.0",
      fill: "none", stroke: "#B5F5D4", "stroke-width": "1.2", "stroke-linecap": "round"
    }, eyesHappyG);

    // Click playful wink (left glowing pill + right curved arc)
    const eyesWinkG = mk("g", { class: "mech-eyes-wink" }, headG);
    mk("rect", { x: "-4.5", y: "-1.75", width: "2.35", height: "3.7", rx: "1.18", fill: "#B5F5D4" }, eyesWinkG);
    mk("path", {
      d: "M 1.9,1.0 Q 3.3,-1.5 4.7,1.0",
      fill: "none", stroke: "#B5F5D4", "stroke-width": "1.2", "stroke-linecap": "round"
    }, eyesWinkG);

    // =====================================================================
    // 2D AUTONOMOUS FLIGHT PHYSICS & INTELLIGENT PATROL ENGINE
    // =====================================================================
    let avPhase = "waiting"; // "waiting" | "delay" | "patrolling" | "sonar" | "avatar"
    let avT = 0;
    let patrolT = 0;
    let sonarT = 0;
    let syncTimer = 0;
    let lastTs = performance.now();

    // True 2D physical drone state (world coordinates relative to viewport)
    const drone = {
      x: 0, y: 0,
      vx: 0, vy: 0,
      rot: 0,
      scale: 1.0,
      eyeX: 0, eyeY: 0,
      curious: 0
    };
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

    // Stable resting dock center in viewport coordinates (immune to btn's own transform!)
    function getDockCenter() {
      const nr = topNav.getBoundingClientRect();
      const cs = getComputedStyle(topNav);
      const padL = parseFloat(cs.paddingLeft) || 24;
      return {
        x: nr.left + padL + 22,
        y: nr.top + nr.height * 0.5
      };
    }

    function hideFlightFX() {
      antiGravG.setAttribute("opacity", "0");
      if (coneG) coneG.setAttribute("opacity", "0");
      wakeDots.forEach((d) => { d.life = 0; d.el.setAttribute("opacity", "0"); });
    }

    function hideSonarFX() {
      if (sonarG) sonarG.setAttribute("opacity", "0");
    }

    function pingEraColumn(colEl) {
      if (!colEl) return;
      colEl.classList.add("is-scan-ping");
      setTimeout(() => colEl.classList.remove("is-scan-ping"), 520);
    }

    function shimmerHeatmapCol(weekIdx) {
      if (!fpCanvasEl) return;
      const cells = fpCanvasEl.querySelectorAll(`.fp-cell[data-week="${weekIdx}"], .fp-col:nth-child(${weekIdx + 1}) .fp-cell`);
      if (cells.length) {
        cells.forEach((c) => {
          c.classList.add("is-sonar-shimmer");
          setTimeout(() => c.classList.remove("is-sonar-shimmer"), 320);
        });
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

    // Launch a smooth 2D autonomous patrol across the entire viewport!
    function startAutonomousPatrol(fromDock) {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const dock = getDockCenter();
      patrolIsReRun = !!fromDock;
      avPhase = "patrolling";
      patrolT = 0;
      pingedCols = [];
      pingedHeatmapWeeks = [];
      btn.classList.remove("is-docked", "is-winking", "is-flagship-sense");
      btn.classList.add("is-visible");
      dockShadow.setAttribute("opacity", "0");

      if (fromDock) {
        drone.x = dock.x;
        drone.y = dock.y;
        drone.vx = 180;
        drone.vy = 120;
      } else {
        // Enters gracefully from upper-right sky right after Era 5 vertical blastoff!
        drone.x = W * 0.91;
        drone.y = -28;
        drone.vx = -65;
        drone.vy = 210;
      }
      drone.rot = 0;
      drone.curious = 0;
    }

    // 2.5D cursor tracking when docked
    window.addEventListener("mousemove", (e) => {
      if (avPhase !== "avatar") return;
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const ratio = Math.min(1, dist / 280);
      mouseGoal.ex = (dx / dist) * 1.55 * ratio;
      mouseGoal.ey = (dy / dist) * 1.05 * ratio;
      mouseGoal.hx = (dx / dist) * 0.85 * ratio;
      mouseGoal.hy = (dy / dist) * 0.60 * ratio;
      mouseGoal.hrot = (dx / dist) * 3.0 * ratio;
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      mouseGoal.ex = mouseGoal.ey = mouseGoal.hx = mouseGoal.hy = mouseGoal.hrot = 0;
    });

    // Subtle flagship-node vermilion crown slit sense
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

    // Click: return home from subpages, OR playful wink + local pulse when on home!
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

    // Double-click on homepage: UNDOCK & FLY A LIVE 2D AERIAL PATROL!
    btn.addEventListener("dblclick", (e) => {
      e.preventDefault();
      if (avPhase !== "avatar") return;
      if (AgentBlog.getView && AgentBlog.getView() !== "home") return;
      startAutonomousPatrol(true);
    });

    AgentBlog.onMechExitedTop = () => {
      if (avPhase === "waiting") {
        avPhase = "delay";
        avT = 0;
      } else if (avPhase === "avatar") {
        syncTimer = 0.48;
        btn.classList.remove("is-nodding");
        void btn.offsetWidth;
        btn.classList.add("is-nodding");
        triggerBlink(true);
      }
    };

    // Compute intelligent autonomous 2D target waypoint & curiosity behavior at time t
    function getPatrolTarget(t, W, H, dock) {
      const navH = topNav.getBoundingClientRect().height || 46;
      const safeTop = navH + 34;

      if (patrolIsReRun) {
        // Re-patrol from top-left dock -> swoops right across Era 1..5 -> pauses curiously over Flagship -> arcs smoothly back to dock!
        if (t < 0.75) {
          return { x: W * 0.24, y: safeTop + H * 0.08, lookX: 1.4, lookY: 0.9, curious: 0, beam: 0.85, stiffness: 28 };
        } else if (t < 1.70) {
          const u = (t - 0.75) / 0.95;
          return { x: lerp(W * 0.24, W * 0.71, u), y: safeTop + H * (0.08 + Math.sin(u * Math.PI) * 0.09), lookX: 1.1, lookY: 1.0, curious: 0, beam: 1.0, stiffness: 26 };
        } else if (t < 2.35) {
          // Curious hover pause right over Flagship Era 4 LangGraph card!
          return { x: W * 0.70, y: safeTop + H * 0.13, lookX: -0.2, lookY: 1.1, curious: 1, beam: 0.9, stiffness: 22 };
        } else if (t < 3.15) {
          return { x: W * 0.84, y: safeTop + H * 0.06, lookX: -1.1, lookY: 0.7, curious: 0, beam: 0.75, stiffness: 24 };
        } else if (t < 4.10) {
          const u = (t - 3.15) / 0.95;
          return { x: lerp(W * 0.84, dock.x + 18, u), y: safeTop + H * 0.03 * (1 - u), lookX: -1.3, lookY: 0.3, curious: 0, beam: 0.45 * (1 - u), stiffness: 32 };
        }
        return { x: dock.x, y: dock.y, lookX: 0, lookY: 0, curious: 0, beam: 0, stiffness: 58 };
      }

      // First arrival after Stage 5 takeoff (total ~4.55s organic autonomous patrol):
      // 0.00–0.65s: Graceful sky drop into Era 5 upper airspace
      if (t < 0.65) {
        return { x: W * 0.86, y: safeTop + H * 0.07, lookX: -0.9, lookY: 0.95, curious: 0, beam: clamp01(t / 0.45), stiffness: 26 };
      }
      // 0.65–1.35s: Sweeps inward toward Flagship Era 4 (LangGraph 状态机)
      if (t < 1.35) {
        return { x: W * 0.69, y: safeTop + H * 0.15, lookX: -0.8, lookY: 1.1, curious: 0, beam: 1.0, stiffness: 24 };
      }
      // 1.35–1.95s: Intelligent Curious Hover Pause over Era 4 Flagship! (head tilts curiously, crown slit turns vermilion)
      if (t < 1.95) {
        return { x: W * 0.68, y: safeTop + H * 0.15, lookX: 0.1, lookY: 1.15, curious: 1, beam: 0.95, stiffness: 20 };
      }
      // 1.95–3.15s: Graceful S-curve cruise leftward across Era 3 → Era 2 → Era 1
      if (t < 3.15) {
        const u = (t - 1.95) / 1.20;
        return {
          x: lerp(W * 0.66, W * 0.16, u),
          y: safeTop + H * (0.14 - Math.sin(u * Math.PI) * 0.065),
          lookX: -1.35,
          lookY: 0.9,
          curious: 0,
          beam: 1.0,
          stiffness: 28
        };
      }
      // 3.15–3.75s: Glances across GitHub Heatmap upper-left zone & rises cleanly toward top-left dock
      if (t < 3.75) {
        return { x: dock.x + 28, y: safeTop + H * 0.03, lookX: -0.8, lookY: 0.45, curious: 0, beam: 0.55, stiffness: 32 };
      }
      // 3.75–4.55s: Effortless precision hover-dock into top-left home slot!
      return { x: dock.x, y: dock.y, lookX: 0, lookY: 0, curious: 0, beam: 0, stiffness: 58 };
    }

    function tickAvatar(now) {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
      lastTs = now;

      if (avPhase === "delay") {
        avT += dt;
        if (avT >= 0.18) {
          startAutonomousPatrol(false);
        }
      } else if (avPhase === "patrolling") {
        patrolT += dt;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const dock = getDockCenter();
        const totalDur = patrolIsReRun ? 4.65 : 4.45;
        const tgt = getPatrolTarget(patrolT, W, H, dock);

        // True damped spring-mass 2D flight physics (smooth organic acceleration & momentum!)
        const k = tgt.stiffness;
        const damp = Math.sqrt(k) * 1.48;
        const ax = (tgt.x - drone.x) * k - drone.vx * damp;
        const ay = (tgt.y - drone.y) * k - drone.vy * damp;
        drone.vx += ax * dt;
        drone.vy += ay * dt;
        drone.x += drone.vx * dt;
        drone.y += drone.vy * dt;

        // Subtle organic aerial hover bobbing (multi-frequency, zero robotic rigidity!)
        const bobFade = 1 - clamp01((patrolT - (totalDur - 0.55)) / 0.55);
        const hoverBobY = (Math.sin(now * 0.0062) * 2.4 + Math.cos(now * 0.0037) * 1.1) * bobFade;

        // Natural drone aerodynamic banking into horizontal velocity + curious head-tilt!
        drone.curious += (tgt.curious - drone.curious) * Math.min(1, dt * 8);
        const velBank = Math.max(-16, Math.min(16, drone.vx * 0.032));
        const curiousTilt = drone.curious * 9.5;
        const targetRot = velBank + curiousTilt;
        drone.rot += (targetRot - drone.rot) * Math.min(1, dt * 9);

        // Position btn cleanly anywhere in 2D viewport via GPU translate3d relative to dock center
        const dx = drone.x - dock.x;
        const dy = drone.y + hoverBobY - dock.y;
        btn.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;

        // Scale slightly larger while airborne patrolling (1.16 -> 1.00 as it lands cleanly in dock)
        const flyScale = lerp(1.16, 1.0, clamp01((patrolT - (totalDur - 0.7)) / 0.7));
        craftG.setAttribute("transform", `scale(${flyScale.toFixed(3)}) rotate(${drone.rot.toFixed(2)})`);

        // Expressive OLED Eyes: look toward patrol gaze + curious asymmetric eye sizing!
        drone.eyeX += (tgt.lookX - drone.eyeX) * Math.min(1, dt * 10);
        drone.eyeY += (tgt.lookY - drone.eyeY) * Math.min(1, dt * 10);
        eyesTrackG.setAttribute("transform", `translate(${drone.eyeX.toFixed(2)}, ${drone.eyeY.toFixed(2)})`);
        visorGlint.setAttribute("transform", `translate(${(-drone.eyeX * 0.25).toFixed(2)}, ${(-drone.eyeY * 0.20).toFixed(2)})`);

        // Curious asymmetric OLED eye expression when hovering over Flagship Era 4!
        const lH = lerp(3.7, 2.75, drone.curious);
        const rH = lerp(3.7, 4.15, drone.curious);
        eyeL.setAttribute("height", lH.toFixed(2));
        eyeL.setAttribute("y", (-lH * 0.5).toFixed(2));
        eyeR.setAttribute("height", rH.toFixed(2));
        eyeR.setAttribute("y", (-rH * 0.5).toFixed(2));
        const eyeFill = drone.curious > 0.35 ? "#FFE8E3" : "#C9FCE0";
        eyeL.setAttribute("fill", eyeFill);
        eyeR.setAttribute("fill", eyeFill);
        statusSlit.setAttribute("fill", drone.curious > 0.35 ? "#B83B2A" : "#2D6A47");
        visorAura.setAttribute("opacity", (0.55 + tgt.beam * 0.35).toFixed(2));

        // Anti-gravity levitation ring pulsing softly underneath shell while flying
        const agAlpha = bobFade * 0.92;
        antiGravG.setAttribute("opacity", agAlpha.toFixed(2));
        antiGravRing.setAttribute("rx", (4.8 + Math.sin(now * 0.015) * 0.7).toFixed(2));

        // Downward optical inspection cone physically anchored right beneath the flying Agent!
        if (coneG && tgt.beam > 0.02) {
          const originX = drone.x;
          const originY = drone.y + hoverBobY + 12;
          const spineEl = skeletonGridEl && skeletonGridEl.querySelector(".timeline-spine");
          const floorY = spineEl ? spineEl.getBoundingClientRect().top : H - 56;
          const beamH = Math.max(80, floorY - originY);
          // Cone tilts slightly with drone's gaze & velocity!
          const aimShiftX = drone.vx * 0.08 + drone.eyeX * 16;
          const targetCenterX = originX + aimShiftX;
          const halfSpread = lerp(74, 48, drone.curious); // Tightens into focused inspection beam when curious!
          const coreSpread = halfSpread * 0.42;

          const isFlagHover = drone.curious > 0.35;
          coneG.setAttribute("opacity", (tgt.beam * 0.92).toFixed(2));
          conePoly.setAttribute("fill", isFlagHover ? "url(#agent-beam-flag)" : "url(#agent-beam-grad)");
          coneCorePoly.setAttribute("opacity", isFlagHover ? "0.25" : "1");
          conePoly.setAttribute("points", `${(originX - 8).toFixed(1)},${originY.toFixed(1)} ${(originX + 8).toFixed(1)},${originY.toFixed(1)} ${(targetCenterX + halfSpread).toFixed(1)},${floorY.toFixed(1)} ${(targetCenterX - halfSpread).toFixed(1)},${floorY.toFixed(1)}`);
          coneCorePoly.setAttribute("points", `${(originX - 4).toFixed(1)},${originY.toFixed(1)} ${(originX + 4).toFixed(1)},${originY.toFixed(1)} ${(targetCenterX + coreSpread).toFixed(1)},${floorY.toFixed(1)} ${(targetCenterX - coreSpread).toFixed(1)},${floorY.toFixed(1)}`);
          const edgeColor = isFlagHover ? "#B83B2A" : "#2D6A47";
          coneEdgeL.setAttribute("stroke", edgeColor);
          coneEdgeR.setAttribute("stroke", edgeColor);
          coneEdgeL.setAttribute("x1", (originX - 8).toFixed(1));
          coneEdgeL.setAttribute("y1", originY.toFixed(1));
          coneEdgeL.setAttribute("x2", (targetCenterX - halfSpread).toFixed(1));
          coneEdgeL.setAttribute("y2", floorY.toFixed(1));
          coneEdgeR.setAttribute("x1", (originX + 8).toFixed(1));
          coneEdgeR.setAttribute("y1", originY.toFixed(1));
          coneEdgeR.setAttribute("x2", (targetCenterX + halfSpread).toFixed(1));
          coneEdgeR.setAttribute("y2", floorY.toFixed(1));

          // Live Page Reactivity: ping each era column as the downward optical cone sweeps across it!
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

          // Subtle wake dots trailing behind flight path
          wakeCooldown -= dt;
          const speed = Math.hypot(drone.vx, drone.vy);
          if (speed > 45 && wakeCooldown <= 0) {
            const p = wakeDots[wakeIdx % wakeDots.length];
            wakeIdx += 1;
            p.x = drone.x - (drone.vx / speed) * 14;
            p.y = drone.y + hoverBobY - (drone.vy / speed) * 10;
            p.life = 0.55;
            wakeCooldown = 0.065;
          }
        } else if (coneG) {
          coneG.setAttribute("opacity", "0");
        }

        // Update trailing flight wake particles
        wakeDots.forEach((p) => {
          if (p.life > 0) {
            p.life = Math.max(0, p.life - dt);
            const u = p.life / 0.55;
            p.el.setAttribute("cx", p.x.toFixed(1));
            p.el.setAttribute("cy", p.y.toFixed(1));
            p.el.setAttribute("r", (0.7 + u * 0.9).toFixed(2));
            p.el.setAttribute("opacity", (u * 0.38).toFixed(2));
          } else {
            p.el.setAttribute("opacity", "0");
          }
        });

        // Finish patrol once landed smoothly in dock -> emit full-screen radial sonar confirmation wave!
        const distToDock = Math.hypot(drone.x - dock.x, drone.y - dock.y);
        if (patrolT >= totalDur || (patrolT > totalDur - 0.45 && distToDock < 3.5)) {
          avPhase = "sonar";
          sonarT = 0;
          sonarColsDone = [];
          sonarNavDone = [];
          btn.style.transform = "";
          craftG.setAttribute("transform", "scale(1) rotate(0)");
          eyeL.setAttribute("height", "3.7");
          eyeL.setAttribute("y", "-1.75");
          eyeR.setAttribute("height", "3.7");
          eyeR.setAttribute("y", "-1.75");
          eyeL.setAttribute("fill", "#EBFFF3");
          eyeR.setAttribute("fill", "#EBFFF3");
          statusSlit.setAttribute("fill", "#2D6A47");
          eyesTrackG.setAttribute("transform", "translate(0, 0)");
          hideFlightFX();
          btn.classList.add("is-docked");
          dockShadow.setAttribute("opacity", "1");
          triggerBlink(false);
        }
      } else if (avPhase === "sonar") {
        // =================================================================
        // FULL-SCREEN RADIAL BAMBOO SONAR WAVEFRONT (100% Viewport Coverage!)
        // =================================================================
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

        // Radial wavefront kisses GitHub heatmap columns smoothly as it expands!
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

        // Radial wavefront kisses nav links & era spine-dots by true 2D Euclidean distance!
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

        // Gentle breathing levitation already active while sonar expands
        const floatY = Math.sin(now * 0.0028) * 1.1;
        craftG.setAttribute("transform", `translate(0, ${floatY.toFixed(2)})`);

        if (sonarT >= 1.25) {
          avPhase = "avatar";
          hideSonarFX();
        }
      } else if (avPhase === "avatar") {
        // Weightless floating 2.5D sculptural mascot with smooth OLED eye tracking!
        headState.ex += (mouseGoal.ex - headState.ex) * 0.16;
        headState.ey += (mouseGoal.ey - headState.ey) * 0.16;
        headState.hx += (mouseGoal.hx - headState.hx) * 0.11;
        headState.hy += (mouseGoal.hy - headState.hy) * 0.11;
        headState.hrot += (mouseGoal.hrot - headState.hrot) * 0.11;

        const floatY = Math.sin(now * 0.0028) * 1.15;
        craftG.setAttribute(
          "transform",
          `translate(${headState.hx.toFixed(2)}, ${(floatY + headState.hy).toFixed(2)}) rotate(${headState.hrot.toFixed(2)})`
        );
        dockShadow.setAttribute("rx", (7.2 - floatY * 0.45).toFixed(2));
        eyesTrackG.setAttribute("transform", `translate(${headState.ex.toFixed(2)}, ${headState.ey.toFixed(2)})`);
        visorGlint.setAttribute("transform", `translate(${(-headState.ex * 0.28).toFixed(2)}, ${(-headState.ey * 0.22).toFixed(2)})`);

        if (syncTimer > 0) {
          syncTimer = Math.max(0, syncTimer - dt);
          const su = 1 - syncTimer / 0.48;
          dockRing.setAttribute("r", (11 + su * 10).toFixed(1));
          dockRing.setAttribute("opacity", ((1 - su) * 0.58).toFixed(2));
        } else {
          dockRing.setAttribute("opacity", "0");
        }
      }

      requestAnimationFrame(tickAvatar);
    }

    function smooth(a, b, x) {
      const t = clamp01((x - a) / (b - a));
      return t * t * (3 - 2 * t);
    }

    requestAnimationFrame(tickAvatar);
  }

  initTopRightMechAvatar();
})();
