(function () {
  "use strict";

  const AgentBlog = (window.AgentBlog = window.AgentBlog || {});

  /* =======================================================================
     11. TOP-RIGHT LIVE MECH HEAD AVATAR
         Descends from top edge after Stage 5 takeoff, brakes with palm jets,
         folds limbs/torso into the head, and stays as a live eye-tracking avatar
     ======================================================================= */
  function initTopRightMechAvatar() {
    const btn = document.getElementById("mech-avatar-btn");
    const topNav = document.getElementById("top-nav");
    const scanOverlay = document.getElementById("mech-scan-overlay");
    const navLinksEl = document.getElementById("nav-links");
    const navBtns = navLinksEl ? Array.from(navLinksEl.querySelectorAll(".nav-btn")) : [];
    if (!btn || !topNav) return;

    const NS = "http://www.w3.org/2000/svg";
    const mk = (tag, attrs, parent) => {
      const node = document.createElementNS(NS, tag);
      if (attrs) Object.keys(attrs).forEach((k) => node.setAttribute(k, attrs[k]));
      if (parent) parent.appendChild(node);
      return node;
    };

    // Full-viewport twin-eye scanner overlay elements
    let scanConeL = null, scanConeR = null, scanRay1 = null, scanRay2 = null, scanBand = null;
    if (scanOverlay) {
      const sDefs = mk("defs", null, scanOverlay);
      const lg = mk("linearGradient", { id: "mech-scan-grad", x1: "0%", y1: "0%", x2: "0%", y2: "100%" }, sDefs);
      mk("stop", { offset: "0%", "stop-color": "#2D6A47", "stop-opacity": "0.28" }, lg);
      mk("stop", { offset: "65%", "stop-color": "#2D6A47", "stop-opacity": "0.10" }, lg);
      mk("stop", { offset: "100%", "stop-color": "#2D6A47", "stop-opacity": "0.02" }, lg);
      scanConeL = mk("polygon", { fill: "url(#mech-scan-grad)", opacity: "0" }, scanOverlay);
      scanConeR = mk("polygon", { fill: "url(#mech-scan-grad)", opacity: "0" }, scanOverlay);
      scanRay1 = mk("line", { stroke: "#2D6A47", "stroke-width": "1.0", "stroke-opacity": "0.55", opacity: "0" }, scanOverlay);
      scanRay2 = mk("line", { stroke: "#2D6A47", "stroke-width": "1.0", "stroke-opacity": "0.55", opacity: "0" }, scanOverlay);
      scanBand = mk("line", { stroke: "#2D6A47", "stroke-width": "1.4", "stroke-opacity": "0.45", "stroke-dasharray": "4 3", opacity: "0" }, scanOverlay);
    }

    const svg = mk("svg", { viewBox: "-26 -24 52 44" }, btn);

    // Braking air-puff ring, glide whisp & lock-in spark FX
    const brakeRing = mk("ellipse", { cx: "0", cy: "14", rx: "6", ry: "1.6", fill: "none", stroke: "#2D6A47", "stroke-width": "1.1", opacity: "0" }, svg);
    const glideTrail = mk("path", { d: "M 16,1 L 28,1 M 15,5 L 24,5", fill: "none", stroke: "#2D6A47", "stroke-width": "1.2", "stroke-linecap": "round", opacity: "0" }, svg);
    const morphSparks = mk("g", { opacity: "0" }, svg);
    mk("path", {
      d: "M -16,-12 L -20,-16 M 16,-12 L 20,-16 M -16,12 L -20,16 M 16,12 L 20,16",
      fill: "none", stroke: "#2D6A47", "stroke-width": "1.35", "stroke-linecap": "round"
    }, morphSparks);
    const morphRing = mk("circle", { cx: "0", cy: "1", r: "10", fill: "none", stroke: "#2D6A47", "stroke-width": "1.1", opacity: "0" }, svg);

    // Root group for descending Y motion
    const rootG = mk("g", { transform: "translate(0, -64)" }, svg);

    // --- Retractable Body Subgroups (fold cleanly up into the head!) ---
    const legsG = mk("g", null, rootG);
    mk("path", { d: "M -2.2,6 L -3.4,12.5 L -1.2,12.5 M 2.2,6 L 2.8,14 L 5.0,14", fill: "none", stroke: "#1D1B18", "stroke-width": "1.35", "stroke-linecap": "round", "stroke-linejoin": "round" }, legsG);
    mk("path", { d: "M -4.8,10.5 L -1.8,10.5 L -1.2,13.5 L -5.0,13.5 Z", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.0", "stroke-linejoin": "round" }, legsG);
    mk("path", { d: "M 1.4,11.5 L 4.4,11.5 L 5.2,14.8 L 1.2,14.8 Z", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.05", "stroke-linejoin": "round" }, legsG);

    const armsG = mk("g", null, rootG);
    mk("path", { d: "M -4.8,-2.5 Q -8.8,0.5 -10.4,4.8 M 4.8,-2.5 Q 8.8,0.5 10.4,4.8", fill: "none", stroke: "#1D1B18", "stroke-width": "1.3", "stroke-linecap": "round" }, armsG);
    mk("rect", { x: "-12.4", y: "3.4", width: "4.0", height: "3.2", rx: "0.8", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.05" }, armsG);
    mk("rect", { x: "8.4", y: "3.4", width: "4.0", height: "3.2", rx: "0.8", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.05" }, armsG);

    const torsoG = mk("g", null, rootG);
    mk("rect", { x: "-8.4", y: "-2.6", width: "4.2", height: "7.4", rx: "1.0", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.1" }, torsoG);
    mk("path", { d: "M -5.4,-3.8 L 5.4,-3.8 L 6.2,-1.6 L -6.2,-1.6 Z", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.1", "stroke-linejoin": "round" }, torsoG);
    mk("rect", { x: "-4.6", y: "-3.2", width: "9.2", height: "9.4", rx: "1.1", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.25" }, torsoG);
    mk("path", { d: "M -3.8,-2.4 L 3.8,5.4 M 3.8,-2.4 L -3.8,5.4", fill: "none", stroke: "#1D1B18", "stroke-width": "0.95", "stroke-linecap": "round" }, torsoG);
    mk("circle", { cx: "0", cy: "1.5", r: "1.7", fill: "#2D6A47" }, torsoG);

    const jetsG = mk("g", { opacity: "0" }, rootG);
    const jetL = mk("path", { fill: "#2D6A47", "fill-opacity": "0.28", stroke: "#1D1B18", "stroke-width": "0.95", "stroke-linejoin": "round" }, jetsG);
    const jetR = mk("path", { fill: "#2D6A47", "fill-opacity": "0.28", stroke: "#1D1B18", "stroke-width": "0.95", "stroke-linejoin": "round" }, jetsG);
    const jetB = mk("path", { fill: "#2D6A47", "fill-opacity": "0.32", stroke: "#2D6A47", "stroke-width": "0.85" }, jetsG);

    // --- Hero Mech Head Group (morphs, scans whole page, glides to top-left!) ---
    const headG = mk("g", { transform: "translate(0, -8.8) scale(1)" }, rootG);
    mk("line", { x1: "-0.8", y1: "-4.6", x2: "-1.4", y2: "-8.4", stroke: "#1D1B18", "stroke-width": "1.15", "stroke-linecap": "round" }, headG);
    mk("circle", { class: "mech-ant-tip", cx: "-1.5", cy: "-9.1", r: "1.35", fill: "#2D6A47", stroke: "#1D1B18", "stroke-width": "0.95" }, headG);
    mk("rect", { x: "-6.9", y: "-1.6", width: "1.6", height: "3.4", rx: "0.6", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.95" }, headG);
    mk("rect", { x: "5.3", y: "-1.6", width: "1.6", height: "3.4", rx: "0.6", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.95" }, headG);
    mk("path", { d: "M -4.6,-4.4 L 0,-7.0 L 4.6,-4.4", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.05", "stroke-linecap": "round", "stroke-linejoin": "round" }, headG);
    mk("rect", { x: "-5.8", y: "-4.6", width: "11.6", height: "9.0", rx: "2.5", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.2" }, headG);
    mk("rect", { x: "-4.3", y: "-2.7", width: "8.6", height: "5.2", rx: "1.7", fill: "#1D1B18" }, headG);
    const eyesIdleG = mk("g", { class: "mech-eyes-idle" }, headG);
    const eyesTrackG = mk("g", null, eyesIdleG);
    const eyeDotL = mk("circle", { cx: "-1.8", cy: "-0.1", r: "1.25", fill: "#FAF8F4" }, eyesTrackG);
    const eyeDotR = mk("circle", { cx: "1.8", cy: "-0.1", r: "1.25", fill: "#FAF8F4" }, eyesTrackG);
    const eyesHappyG = mk("g", { class: "mech-eyes-happy" }, headG);
    mk("path", { d: "M -3.1,0.5 Q -1.8,-1.3 -0.5,0.5 M 0.5,0.5 Q 1.8,-1.3 3.1,0.5", fill: "none", stroke: "#B5F5D4", "stroke-width": "1.05", "stroke-linecap": "round" }, eyesHappyG);

    let avPhase = "waiting"; // "waiting" | "delay" | "descending" | "morphing" | "scanning" | "gliding" | "avatar"
    let avT = 0;
    let syncTimer = 0;
    let glideStartX = 0;
    let lastTs = performance.now();
    const eyePos = { tx: 0, ty: 0, cx: 0, cy: 0 };

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
      if (!scanConeL) return;
      scanConeL.setAttribute("opacity", "0");
      scanConeR.setAttribute("opacity", "0");
      scanRay1.setAttribute("opacity", "0");
      scanRay2.setAttribute("opacity", "0");
      scanBand.setAttribute("opacity", "0");
    }

    function triggerBlink(doubleBlink) {
      btn.classList.add("is-blinking");
      setTimeout(() => {
        btn.classList.remove("is-blinking");
        if (doubleBlink) setTimeout(() => triggerBlink(false), 140);
      }, 120);
    }

    function scheduleBlink() {
      setTimeout(() => {
        if (avPhase === "avatar") triggerBlink(Math.random() < 0.25);
        scheduleBlink();
      }, 2900 + Math.random() * 3200);
    }
    scheduleBlink();

    window.addEventListener("mousemove", (e) => {
      if (avPhase !== "avatar") return;
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const ratio = Math.min(1, dist / 240);
      eyePos.tx = (dx / dist) * 1.35 * ratio;
      eyePos.ty = (dy / dist) * 0.95 * ratio;
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      eyePos.tx = 0;
      eyePos.ty = 0;
    });

    btn.addEventListener("click", () => {
      if (avPhase !== "avatar") return;
      btn.classList.remove("is-nodding");
      void btn.offsetWidth;
      btn.classList.add("is-nodding");
      triggerBlink(false);
      if (AgentBlog.getView && AgentBlog.getView() !== "home" && AgentBlog.switchView) AgentBlog.switchView("home");
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

        const brakePower = Math.sin(u * Math.PI) * (1 - u * 0.25);
        if (brakePower > 0.04) {
          const flick = 0.85 + 0.3 * Math.abs(Math.sin(now * 0.055));
          const jLen = (4 + brakePower * 9) * flick;
          jetsG.setAttribute("opacity", clamp01(brakePower * 1.4).toFixed(2));
          jetL.setAttribute("d", `M -12.0,6.8 L -8.8,6.8 L -10.4,${(6.8 + jLen).toFixed(1)} Z`);
          jetR.setAttribute("d", `M 8.8,6.8 L 12.0,6.8 L 10.4,${(6.8 + jLen).toFixed(1)} Z`);
          jetB.setAttribute("d", `M -2.2,13.8 L 3.8,13.8 L 0.8,${(13.8 + jLen * 0.85).toFixed(1)} Z`);
        } else {
          jetsG.setAttribute("opacity", "0");
        }

        if (u > 0.55) {
          const bu = (u - 0.55) / 0.45;
          brakeRing.setAttribute("rx", (6 + bu * 14).toFixed(1));
          brakeRing.setAttribute("ry", (1.4 + bu * 2.2).toFixed(1));
          brakeRing.setAttribute("opacity", ((1 - bu) * 0.55).toFixed(2));
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
          ? lerp(1.0, 1.98, 1 - Math.pow(1 - headU / 0.78, 3))
          : lerp(1.98, 1.86, (headU - 0.78) / 0.22);
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
          legsG.setAttribute("opacity", "0");
          armsG.setAttribute("opacity", "0");
          torsoG.setAttribute("opacity", "0");
          morphSparks.setAttribute("opacity", "0");
          morphRing.setAttribute("opacity", "0");
          headG.setAttribute("transform", "translate(0, 3.2) scale(1.86)");
        }
      } else if (avPhase === "scanning") {
        // Twin eyes glow bamboo-cyan & sweep scanner cones across the entire webpage (right -> left)
        avT += dt;
        const u = clamp01(avT / 1.12);
        const beamAlpha = u < 0.12 ? u / 0.12 : u > 0.86 ? (1 - u) / 0.14 : 1;
        const sweepU = clamp01((u - 0.10) / 0.78);
        const sweepEase = sweepU < 0.5 ? 2 * sweepU * sweepU : 1 - Math.pow(-2 * sweepU + 2, 2) / 2;

        // Eyes glow bright scanning cyan-green & track the sweep across the page
        eyeDotL.setAttribute("fill", "#9CEBE6");
        eyeDotR.setAttribute("fill", "#9CEBE6");
        const lookX = lerp(0.8, -1.35, sweepEase);
        const lookY = lerp(0.85, 0.35, sweepEase);
        eyesTrackG.setAttribute("transform", `translate(${lookX.toFixed(2)}, ${lookY.toFixed(2)})`);

        if (scanConeL) {
          const r = btn.getBoundingClientRect();
          const ex1 = r.left + r.width * 0.43;
          const ex2 = r.left + r.width * 0.57;
          const ey = r.top + r.height * 0.57;
          const W = window.innerWidth;
          const H = window.innerHeight;

          // Leading & trailing edge of the sweeping full-page scan cone
          const leadX = lerp(W * 0.98, -W * 0.04, sweepEase);
          const trailX = Math.min(W, leadX + Math.max(150, W * 0.15));
          const targetY = lerp(H, H * 0.72, Math.pow(sweepEase, 2));

          scanConeL.setAttribute("points", `${ex1.toFixed(1)},${ey.toFixed(1)} ${leadX.toFixed(1)},${targetY.toFixed(1)} ${trailX.toFixed(1)},${H}`);
          scanConeR.setAttribute("points", `${ex2.toFixed(1)},${ey.toFixed(1)} ${(leadX + 24).toFixed(1)},${targetY.toFixed(1)} ${Math.min(W, trailX + 24).toFixed(1)},${H}`);
          scanConeL.setAttribute("opacity", (beamAlpha * 0.85).toFixed(2));
          scanConeR.setAttribute("opacity", (beamAlpha * 0.55).toFixed(2));

          scanRay1.setAttribute("x1", ex1.toFixed(1));
          scanRay1.setAttribute("y1", ey.toFixed(1));
          scanRay1.setAttribute("x2", leadX.toFixed(1));
          scanRay1.setAttribute("y2", targetY.toFixed(1));
          scanRay1.setAttribute("opacity", (beamAlpha * 0.75).toFixed(2));

          scanRay2.setAttribute("x1", ex2.toFixed(1));
          scanRay2.setAttribute("y1", ey.toFixed(1));
          scanRay2.setAttribute("x2", trailX.toFixed(1));
          scanRay2.setAttribute("y2", String(H));
          scanRay2.setAttribute("opacity", (beamAlpha * 0.45).toFixed(2));

          scanBand.setAttribute("x1", leadX.toFixed(1));
          scanBand.setAttribute("y1", "46");
          scanBand.setAttribute("x2", leadX.toFixed(1));
          scanBand.setAttribute("y2", String(H));
          scanBand.setAttribute("opacity", (beamAlpha * 0.35).toFixed(2));
        }

        if (avT >= 1.12) {
          avPhase = "gliding";
          avT = 0;
          glideStartX = getRightOffsetX();
          hideScanBeams();
          eyeDotL.setAttribute("fill", "#FAF8F4");
          eyeDotR.setAttribute("fill", "#FAF8F4");
          triggerBlink(false);
        }
      } else if (avPhase === "gliding") {
        // Glide smoothly from top-right to top-left while gradually revealing the nav links at top-right!
        avT += dt;
        const u = clamp01(avT / 0.96);
        const ease = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
        const curX = lerp(glideStartX, 0, ease);
        btn.style.transform = `translateX(${curX.toFixed(1)}px)`;

        // Subtle forward-left aerodynamic tilt + eyes looking left + delicate glide trail
        const tilt = -Math.sin(u * Math.PI) * 6.5;
        headG.setAttribute("transform", `translate(0, 3.2) scale(1.86) rotate(${tilt.toFixed(1)})`);
        eyesTrackG.setAttribute("transform", `translate(${(-1.25 * Math.sin(u * Math.PI)).toFixed(2)}, 0)`);
        glideTrail.setAttribute("opacity", (Math.sin(u * Math.PI) * 0.55).toFixed(2));

        // Gradually reveal nav links right-to-left (关于 -> 全部文章 -> 图谱首页) behind the gliding head!
        const revCount = navBtns.length;
        for (let i = 0; i < revCount; i++) {
          const revIdx = revCount - 1 - i; // 0 = 关于 (rightmost), 1 = 全部文章, 2 = 图谱首页
          const startU = 0.14 + revIdx * 0.16;
          const btnU = clamp01((u - startU) / 0.38);
          const btnEase = 1 - Math.pow(1 - btnU, 3);
          navBtns[i].style.opacity = btnEase.toFixed(2);
          navBtns[i].style.transform = `translateX(${lerp(8, 0, btnEase).toFixed(1)}px)`;
        }

        if (avT >= 0.96) {
          avPhase = "avatar";
          btn.style.transform = "";
          headG.setAttribute("transform", "translate(0, 3.2) scale(1.86)");
          eyesTrackG.setAttribute("transform", "translate(0, 0)");
          glideTrail.setAttribute("opacity", "0");
          navBtns.forEach((nb) => {
            nb.style.opacity = "1";
            nb.style.transform = "translateX(0)";
          });
          navLinksEl.classList.add("is-revealed");
          btn.classList.add("is-docked");
          syncTimer = 0.42;
          triggerBlink(false);
        }
      } else if (avPhase === "avatar") {
        eyePos.cx += (eyePos.tx - eyePos.cx) * 0.16;
        eyePos.cy += (eyePos.ty - eyePos.cy) * 0.16;
        eyesTrackG.setAttribute("transform", `translate(${eyePos.cx.toFixed(2)}, ${eyePos.cy.toFixed(2)})`);

        if (syncTimer > 0) {
          syncTimer = Math.max(0, syncTimer - dt);
          const su = 1 - syncTimer / 0.48;
          morphRing.setAttribute("r", (10 + su * 10).toFixed(1));
          morphRing.setAttribute("opacity", ((1 - su) * 0.55).toFixed(2));
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
