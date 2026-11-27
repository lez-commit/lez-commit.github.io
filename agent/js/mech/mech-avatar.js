import { clamp01, lerp, smooth } from "../core/utils.js";
import { bus } from "../core/bus.js";
import { buildMechRig } from "./mech-svg.js";

/**
 * Unified Ver.Ka Gundam Controller:
 * Live-welded Era 5 gantry stand -> wing unfold -> Mach-diamond ignition ->
 * 2D damped-spring aerial patrol -> top-left dock fold -> full-screen sonar pulse.
 */
export function initMechAvatar({ getView, switchView }) {
  const btn = document.getElementById("mech-avatar-btn");
  const topNav = document.getElementById("top-nav");
  const scanOverlay = document.getElementById("mech-scan-overlay");
  const navLinksEl = document.getElementById("nav-links");
  const navBtns = navLinksEl ? Array.from(navLinksEl.querySelectorAll(".nav-btn")) : [];
  const skeletonGridEl = document.getElementById("skeleton-grid");
  const fpCanvasEl = document.getElementById("fp-canvas");
  if (!btn || !topNav) return null;

  const {
    coneG, conePoly, coneCorePoly, coneEdgeL, coneEdgeR, coneScanBar, coneScanTicks, coneEyeGlowL, coneEyeGlowR, beamGrad, flagBeamGrad, edgeBeamGrad, edgeFlagGrad, wakeDots, trailGrad, trailPathMain, trailPathCore,
    sonarG, sonarWedge, sonarLeadRay, sonarTrailRay, sonarAxisTicks, sonarFanGrad,
    VIEWBOX_H, svg, dockRing, foldSparks, dockShadow, craftG,
    awakeningG, awakeningHalo, awakeningRing, awakeningRing2, awakeningRays,
    machConeG, machConeOuter, machConeInner,
    bodyRigG, packG,
    wingL, wingLUpper, wingLMid, wingLLower, wingPlasmaL, jetWingLG, jetWingL,
    wingR, wingRUpper, wingRMid, wingRLower, wingPlasmaR, jetWingRG, jetWingR,
    funnelL, funnelJetL, funnelR, funnelJetR,
    psychoSlits, chestGlowEl, crestGem,
    legL, shinL, jetBootLG, jetBootL, jetBootLCore, machL1,
    legR, shinR, jetBootRG, jetBootR, jetBootRCore, machR1,
    armL, jetPalmLG, jetPalmL, jetPalmLCore,
    armR, jetPalmRG, jetPalmR, jetPalmRCore,
    chestDetailG, chestCore,
    DOCKED_HEAD_SCALE, FLIGHT_HEAD_SCALE, FLIGHT_HEAD_Y, LAUNCH_MATCH_SCALE, FLY_SCALE,
    headG, antG, statusTip, crestEl, earL, earR, facePlateG, visorAura, visorGlint, eyesTrackG, eyeL, eyeR
  } = buildMechRig({ btn, scanOverlay });

  let trailPts = [];
  let trailSampleCooldown = 0;
  let hasEverDocked = false;

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


  function getDockCenter() {
    const nr = topNav.getBoundingClientRect();
    const cs = getComputedStyle(topNav);
    const padL = parseFloat(cs.paddingLeft) || 24;
    return { x: nr.left + padL + 22, y: nr.top + (nr.height - 1) * 0.5 };
  }

  // DOM-grounded open rice-paper airspace measurement (strictly clear of heatmap/Recent Posts & era twigs!)
  function getAirspaceMetrics(W, H) {
    const navH = topNav.getBoundingClientRect().height || 46;
    const dockBand = document.querySelector(".bottom-dock");
    const dockBottom = dockBand ? dockBand.getBoundingClientRect().bottom : navH + 136;
    const skyTop = Math.max(navH + 48, dockBottom + 38);

    let flagX = W * 0.695;
    let flagY = skyTop + 34;
    let flagTargetY = skyTop + 170;
    const flagEl = skeletonGridEl && skeletonGridEl.querySelector(".twig-item.is-flagship");
    if (flagEl) {
      const fr = flagEl.getBoundingClientRect();
      if (fr.width > 10 && fr.height > 10) {
        flagX = fr.left + fr.width * 0.5;
        flagTargetY = fr.top + fr.height * 0.5;
        flagY = Math.max(skyTop + 4, Math.min(fr.top - 54, skyTop + 48));
      }
    }
    let midX = W * 0.30;
    let midTargetY = skyTop + 260;
    const era2Twig = skeletonGridEl && skeletonGridEl.querySelector(".era-col:nth-of-type(2) .twig-item.is-published");
    if (era2Twig) {
      const mr = era2Twig.getBoundingClientRect();
      if (mr.width > 10 && mr.height > 10) {
        midX = mr.left + mr.width * 0.5;
        midTargetY = mr.top + mr.height * 0.6;
      }
    }
    return { skyTop, flagX, flagY, flagTargetY, midX, midTargetY };
  }

  // Exact sub-pixel world coordinates for Left & Right glowing visor eyes!
  function getEyeWorldCoords(flySX, flySY, pxPerUnit, hoverBobY) {
    const hRot = (drone.headTilt * Math.PI) / 180;
    const bRot = (drone.bodyBank * Math.PI) / 180;
    const cosH = Math.cos(hRot), sinH = Math.sin(hRot);
    const cosB = Math.cos(bRot), sinB = Math.sin(bRot);
    const toWorld = (ex) => {
      // eyesTrackG -> facePlateG -> headG
      const hx0 = (ex + drone.eyeX * 0.78 + drone.headYaw) * FLIGHT_HEAD_SCALE;
      const hy0 = (drone.eyeY * 0.65 + drone.headPitch) * FLIGHT_HEAD_SCALE;
      const cx0 = hx0 * cosH - hy0 * sinH;
      const cy0 = FLIGHT_HEAD_Y + hx0 * sinH + hy0 * cosH;
      // craftG: scale(flySX, flySY) rotate(bodyBank)
      const rx = (cx0 * cosB - cy0 * sinB) * flySX;
      const ry = (cx0 * sinB + cy0 * cosB) * flySY;
      return {
        x: drone.x + rx * pxPerUnit,
        y: drone.y + hoverBobY + ry * pxPerUnit
      };
    };
    return { L: toWorld(-2.55), R: toWorld(2.55) };
  }

  function evalCubic(p0, p1, p2, p3, u) {
    const inv = 1 - u;
    return inv * inv * inv * p0 + 3 * inv * inv * u * p1 + 3 * inv * u * u * p2 + u * u * u * p3;
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
    jetWingLG.setAttribute("opacity", (op * 0.84).toFixed(2));
    jetWingRG.setAttribute("opacity", (op * 0.84).toFixed(2));
  }

  let overdriveMode = false;
  function setOverdriveColor(isFlag) {
    if (isFlag === overdriveMode) return;
    overdriveMode = isFlag;
    const accent = isFlag ? "#E85D4A" : "#5CE09B";
    const deep = isFlag ? "#B83B2A" : "#2D6A47";
    psychoSlits.forEach((el) => el.setAttribute("stroke", accent));
    crestGem.setAttribute("fill", deep);
    chestGlowEl.setAttribute("fill", isFlag ? "url(#agent-core-glow-red)" : "url(#agent-core-glow)");
    wingPlasmaL.setAttribute("fill", isFlag ? "url(#agent-wing-plasma-l-red)" : "url(#agent-wing-plasma-l)");
    wingPlasmaR.setAttribute("fill", isFlag ? "url(#agent-wing-plasma-r-red)" : "url(#agent-wing-plasma-r)");
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
    setOverdriveColor(false);
    awakeningG.setAttribute("opacity", "0");
    machConeG.setAttribute("opacity", "0");
    wingPlasmaL.setAttribute("opacity", "0");
    wingPlasmaR.setAttribute("opacity", "0");
    funnelL.setAttribute("opacity", "0");
    funnelR.setAttribute("opacity", "0");
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

    // 3-Tier Hi-MAT Articulated Aero Wing-Binders: fan open sequentially like Freedom Gundam!
    const wingUnfold = gantryOpts && typeof gantryOpts.wingOpen === "number"
      ? gantryOpts.wingOpen
      : (!patrolIsReRun && avPhase === "patrolling" ? 1 : 1 - f);
    const fanAmt = gantryOpts && typeof gantryOpts.wingFan === "number"
      ? gantryOpts.wingFan
      : clamp01((wingUnfold - 0.15) / 0.85);
    const funnelDeploy = gantryOpts && typeof gantryOpts.funnelDeploy === "number"
      ? gantryOpts.funnelDeploy
      : (1 - f) * clamp01(wingUnfold * 1.15);

    const openScale = lerp(0.50, 1.0, wingUnfold);
    const speedSweep = (1 - wingUnfold) * 28 + Math.abs(yawNorm) * 10 - curiousAmt * 10;
    const wingScaleL = openScale * (1 - yawNorm * 0.16);
    const wingScaleR = openScale * (1 + yawNorm * 0.16);
    wingL.setAttribute("transform", `translate(-3.8, 0.2) scale(${wingScaleL.toFixed(3)}, ${openScale.toFixed(3)}) rotate(${(-speedSweep).toFixed(1)}) translate(3.8, -0.2)`);
    wingR.setAttribute("transform", `translate(3.8, 0.2) scale(${wingScaleR.toFixed(3)}, ${openScale.toFixed(3)}) rotate(${(speedSweep).toFixed(1)}) translate(-3.8, -0.2)`);

    // Sequential 3-tier fan-out angles (upper sweeps heroically up, mid flares out, lower spreads down!)
    const uFan = clamp01(fanAmt * 1.25);
    const mFan = clamp01((fanAmt - 0.14) / 0.86);
    const lFan = clamp01((fanAmt - 0.28) / 0.72);
    const hiMatExtra = curiousAmt * 6.5;
    wingLUpper.setAttribute("transform", `rotate(${lerp(24, -6 - hiMatExtra, uFan).toFixed(1)}, -3.8, -0.4)`);
    wingRUpper.setAttribute("transform", `rotate(${lerp(-24, 6 + hiMatExtra, uFan).toFixed(1)}, 3.8, -0.4)`);
    wingLMid.setAttribute("transform", `rotate(${lerp(18, -2, mFan).toFixed(1)}, -3.8, 0.4)`);
    wingRMid.setAttribute("transform", `rotate(${lerp(-18, 2, mFan).toFixed(1)}, 3.8, 0.4)`);
    wingLLower.setAttribute("transform", `rotate(${lerp(-24, 5 + hiMatExtra * 0.6, lFan).toFixed(1)}, -4.0, 1.8)`);
    wingRLower.setAttribute("transform", `rotate(${lerp(24, -5 - hiMatExtra * 0.6, lFan).toFixed(1)}, 4.0, 1.8)`);

    // Luminous Bamboo Plasma Wing Feathers (shimmering softly with thrust & Hi-MAT flare!)
    const plasmaOp = clamp01((fanAmt * 0.72 + thrust * 0.22 + curiousAmt * 0.25) * (1 - f)) * (0.86 + 0.14 * Math.sin(now * 0.016));
    wingPlasmaL.setAttribute("opacity", plasmaOp.toFixed(2));
    wingPlasmaR.setAttribute("opacity", plasmaOp.toFixed(2));
    packG.setAttribute("transform", `translate(${(-yawNorm * 0.65).toFixed(2)}, 0)`);

    // Twin Multi-Agent Micro-Funnels: hover cleanly OUTSIDE & ABOVE the 3-tier wingtips across ALL stages!
    if (funnelDeploy > 0.03) {
      const fEase = 1 - Math.pow(1 - clamp01(funnelDeploy), 3);
      const orbitBobL = Math.sin(now * 0.0068) * 1.55 * fEase;
      const orbitBobR = Math.sin(now * 0.0068 + 1.8) * 1.55 * fEase;
      const orbitSwayL = Math.cos(now * 0.0046) * 0.65 * fEase;
      const orbitSwayR = Math.cos(now * 0.0046 + 1.8) * 0.65 * fEase;
      const fDistX = lerp(13.0, 26.8 + curiousAmt * 2.4, fEase);
      const fPosY = lerp(-4.8, -10.8 - curiousAmt * 1.8, fEase);
      const fTiltL = lerp(16, -9 - bankDeg * 0.36, fEase);
      const fTiltR = lerp(-16, 9 - bankDeg * 0.36, fEase);
      const fScale = lerp(0.45, 1.0, fEase);
      funnelL.setAttribute("opacity", clamp01(fEase * 1.25).toFixed(2));
      funnelR.setAttribute("opacity", clamp01(fEase * 1.25).toFixed(2));
      funnelL.setAttribute("transform", `translate(${(-fDistX + orbitSwayL).toFixed(2)}, ${(fPosY + orbitBobL).toFixed(2)}) scale(${fScale.toFixed(2)}) rotate(${fTiltL.toFixed(1)})`);
      funnelR.setAttribute("transform", `translate(${(fDistX + orbitSwayR).toFixed(2)}, ${(fPosY + orbitBobR).toFixed(2)}) scale(${fScale.toFixed(2)}) rotate(${fTiltR.toFixed(1)})`);
      const fjOp = (0.35 + thrust * 0.55).toFixed(2);
      funnelJetL.setAttribute("opacity", fjOp);
      funnelJetR.setAttribute("opacity", fjOp);
    } else {
      funnelL.setAttribute("opacity", "0");
      funnelR.setAttribute("opacity", "0");
    }

    if (thrust > 0.04) {
      setJetOpacity(clamp01(thrust * 1.15));
      // Compact outward-angled palm stabilizer flames
      jetPalmL.setAttribute("d", `M -10.7,9.4 Q -10.6,${(9.4 + pLen * 0.55).toFixed(1)} -10.3,${(9.4 + pLen).toFixed(1)} Q -9.5,${(9.4 + pLen * 0.55).toFixed(1)} -8.9,9.4 Z`);
      jetPalmLCore.setAttribute("d", `M -10.3,9.4 L -10.1,${(9.4 + pCore).toFixed(1)} L -9.4,9.4 Z`);
      jetPalmR.setAttribute("d", `M 8.9,9.4 Q 9.5,${(9.4 + pLen * 0.55).toFixed(1)} 10.3,${(9.4 + pLen).toFixed(1)} Q 10.6,${(9.4 + pLen * 0.55).toFixed(1)} 10.7,9.4 Z`);
      jetPalmRCore.setAttribute("d", `M 9.4,9.4 L 10.1,${(9.4 + pCore).toFixed(1)} L 10.3,9.4 Z`);
      // Twin mid-wing vernier thruster plumes (6-point propulsion!)
      const wLen = (4.2 + thrust * 6.5) * flick;
      jetWingL.setAttribute("d", `M -13.6,0.5 L -10.8,0.9 L ${(-13.8 - wLen * 0.28).toFixed(1)},${(1.0 + wLen).toFixed(1)} Z`);
      jetWingR.setAttribute("d", `M 10.8,0.9 L 13.6,0.5 L ${(13.8 + wLen * 0.28).toFixed(1)},${(1.0 + wLen).toFixed(1)} Z`);
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
      updateFullBodyKinematics(performance.now(), avPhase === "gantry" ? 0 : 1.0, 0, 0, 0, { standPose: 1, wingOpen: 0.72, wingFan: 0.15, funnelDeploy: 0, armFlare: 6 });
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
    if (getView() !== "home") {
      triggerBlink(false);
      switchView("home");
    } else {
      // Trigger crisp industrial angular laser sweep across the knowledge map from the avatar's visor!
      avPhase = "sonar";
      sonarT = 0;
      sonarColsDone = [];
      sonarNavDone = [];
      pingedHeatmapWeeks = [];
      triggerWink();
    }
  });

  // Double-click docked avatar -> unfolds full hardcore mech body & launches live 2D patrol!
  btn.addEventListener("dblclick", (e) => {
    e.preventDefault();
    if (avPhase !== "avatar") return;
    if (getView() !== "home") return;
    if (winkTimeout) { clearTimeout(winkTimeout); winkTimeout = null; }
    btn.classList.remove("is-nodding", "is-winking");
    btn.classList.add("has-flown-manual");
    startAutonomousPatrol(true);
  });

  function settleToDockQuietly() {
    hideFlightFX();
    hideSonarFX();
    liveAnchorFn = null;
    avPhase = "avatar";
    btn.style.transform = "";
    craftG.setAttribute("transform", "translate(0, 0)");
    bodyRigG.setAttribute("opacity", "0");
    bodyRigG.removeAttribute("transform");
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
    btn.classList.add("is-visible", "is-docked");
    dockShadow.setAttribute("opacity", "1");
    bus.emit("mech:docked");
  }

  function handleLiftoff(origin) {
    if (avPhase === "waiting") {
      startAutonomousPatrol(false, origin);
    } else if (origin && origin.forcePatrol) {
      // Clean takeover from ANY state (docked, sonar, mid-patrol, gantry, or folding)!
      hideFlightFX();
      hideSonarFX();
      startAutonomousPatrol(false, origin);
    } else if (avPhase === "avatar") {
      syncTimer = 0.48;
      btn.classList.remove("is-nodding");
      void btn.offsetWidth;
      btn.classList.add("is-nodding");
      triggerBlink(true);
    }
  }

  function abortGantry() {
    if (avPhase === "gantry") {
      hideFlightFX();
      liveAnchorFn = null;
      if (btn.classList.contains("has-flown-manual") || hasEverDocked) {
        settleToDockQuietly();
      } else {
        avPhase = "waiting";
        btn.classList.remove("is-visible", "is-docked");
        btn.style.transform = "";
      }
    }
  }

  bus.on("mech:liftoff", handleLiftoff);
  bus.on("mech:abort-gantry", abortGantry);
  bus.on("view:changed", (nextView) => {
    if (nextView !== "home" && (avPhase === "gantry" || avPhase === "patrolling" || avPhase === "unfolding" || avPhase === "folding")) {
      settleToDockQuietly();
    }
  });

  function getPatrolTarget(t, W, H, dock) {
    const air = getAirspaceMetrics(W, H);
    const skyY = air.skyTop;

    // Offset hover stations positioned UPPER-RIGHT of each scan target so twin-eye laser shoots diagonally DOWN-LEFT cleanly clear of body!
    const hover1X = Math.min(W - 64, air.flagX + 94);
    const hover1Y = Math.max(skyY + 6, air.flagY - 8);
    const scan1X = air.flagX - 8;
    const scan1Y = Math.min(H - 120, Math.max(hover1Y + 115, air.flagTargetY + 12));

    const hover2X = Math.min(W * 0.56, air.midX + 135);
    const hover2Y = Math.max(skyY + 26, Math.min(air.midTargetY - 125, skyY + 115));
    const scan2X = air.midX;
    const scan2Y = Math.min(H - 105, Math.max(hover2Y + 120, air.midTargetY + 14));

    if (patrolIsReRun) {
      // Smooth continuous re-run patrol: swoop out (laser OFF) -> glance Era 2-3 -> glide -> Vermilion scan Flagship -> swoop home!
      if (t < 0.85) {
        const u = smooth(0, 0.85, t);
        return {
          x: evalCubic(dock.x, dock.x + 120, hover2X - 90, hover2X, u),
          y: evalCubic(dock.y, skyY - 12, hover2Y - 18, hover2Y, u),
          lookX: 1.1, lookY: 0.35, curious: 0, beam: 0, scanX: scan2X, scanY: scan2Y, stiffness: 36
        };
      }
      if (t < 1.70) {
        const u = (t - 0.85) / 0.85;
        const beamEnv = smooth(0.08, 0.24, u) * (1 - smooth(0.76, 0.94, u));
        const sweepX = lerp(scan2X + 34, scan2X - 28, smooth(0.12, 0.86, u));
        return {
          x: hover2X, y: hover2Y,
          lookX: -1.15, lookY: 0.95, curious: 0.45 * beamEnv, beam: beamEnv, scanX: sweepX, scanY: scan2Y, stiffness: 28
        };
      }
      if (t < 2.55) {
        const u = smooth(1.70, 2.55, t);
        return {
          x: evalCubic(hover2X, lerp(hover2X, hover1X, 0.35), lerp(hover2X, hover1X, 0.72), hover1X, u),
          y: evalCubic(hover2Y, skyY - 10, hover1Y - 18, hover1Y, u),
          lookX: 1.05, lookY: 0.25, curious: 0, beam: 0, scanX: scan1X, scanY: scan1Y, stiffness: 34
        };
      }
      if (t < 3.55) {
        const u = (t - 2.55) / 1.00;
        const beamEnv = smooth(0.08, 0.22, u) * (1 - smooth(0.78, 0.94, u));
        const sweepX = lerp(scan1X + 36, scan1X - 24, smooth(0.10, 0.86, u));
        return {
          x: hover1X, y: hover1Y,
          lookX: -1.25, lookY: 0.95, curious: 1.0 * beamEnv, beam: beamEnv, scanX: sweepX, scanY: scan1Y, stiffness: 26
        };
      }
      if (t < 4.55) {
        const u = smooth(3.55, 4.55, t);
        return {
          x: evalCubic(hover1X, hover1X - 180, dock.x + 150, dock.x, u),
          y: evalCubic(hover1Y, skyY - 22, dock.y + 34, dock.y, u),
          lookX: -1.1 * (1 - u), lookY: 0.15 * (1 - u), curious: 0, beam: 0, scanX: scan1X, scanY: scan1Y, stiffness: 42
        };
      }
      return { x: dock.x, y: dock.y, lookX: 0, lookY: 0, curious: 0, beam: 0, scanX: dock.x, scanY: dock.y, stiffness: 62 };
    }

    // Unified continuous post-launch patrol: silky Bezier glide (laser OFF) -> offset hover & diagonal twin-eye scans!
    const climbX = Math.max(W * 0.84, Math.min(W - 36, launchOrigin.x));
    if (t < 0.92) {
      const u = smooth(0, 0.92, t);
      return {
        x: evalCubic(climbX, climbX, hover1X + 46, hover1X, u),
        y: evalCubic(skyY + 26, skyY - 16, hover1Y - 14, hover1Y, u),
        lookX: -0.75 * u, lookY: lerp(-0.55, 0.55, u), curious: 0, beam: 0, scanX: scan1X, scanY: scan1Y, stiffness: 32
      };
    }
    if (t < 1.98) {
      // Hover Beat 1: Offset upper-right of LangGraph Flagship -> Vermilion twin-eye diagonal optical scan!
      const u = (t - 0.92) / 1.06;
      const beamEnv = smooth(0.08, 0.22, u) * (1 - smooth(0.78, 0.94, u));
      const sweepX = lerp(scan1X + 38, scan1X - 24, smooth(0.10, 0.86, u));
      return {
        x: hover1X, y: hover1Y,
        lookX: -1.28, lookY: 0.96, curious: 1.0 * beamEnv, beam: beamEnv, scanX: sweepX, scanY: scan1Y, stiffness: 26
      };
    }
    if (t < 2.96) {
      // Silky S-curve banked glide toward mid-left airspace (laser cleanly OFF!)
      const u = smooth(1.98, 2.96, t);
      return {
        x: evalCubic(hover1X, lerp(hover1X, hover2X, 0.35), lerp(hover1X, hover2X, 0.72), hover2X, u),
        y: evalCubic(hover1Y, skyY - 12, hover2Y - 16, hover2Y, u),
        lookX: -1.15, lookY: 0.35, curious: 0, beam: 0, scanX: scan2X, scanY: scan2Y, stiffness: 34
      };
    }
    if (t < 3.86) {
      // Hover Beat 2: Offset upper-right of Era 02-03 -> Bamboo-green twin-eye diagonal optical scan!
      const u = (t - 2.96) / 0.90;
      const beamEnv = smooth(0.08, 0.24, u) * (1 - smooth(0.76, 0.94, u));
      const sweepX = lerp(scan2X + 34, scan2X - 26, smooth(0.12, 0.86, u));
      return {
        x: hover2X, y: hover2Y,
        lookX: -1.18, lookY: 0.92, curious: 0.32 * beamEnv, beam: beamEnv, scanX: sweepX, scanY: scan2Y, stiffness: 28
      };
    }
    if (t < 4.92) {
      // Graceful parabolic swoop straight home to top-left dock (laser OFF!)
      const u = smooth(3.86, 4.92, t);
      return {
        x: evalCubic(hover2X, hover2X - 110, dock.x + 110, dock.x, u),
        y: evalCubic(hover2Y, skyY - 14, dock.y + 30, dock.y, u),
        lookX: -1.05 * (1 - u), lookY: 0.15 * (1 - u), curious: 0, beam: 0, scanX: dock.x, scanY: dock.y, stiffness: 42
      };
    }
    return { x: dock.x, y: dock.y, lookX: 0, lookY: 0, curious: 0, beam: 0, scanX: dock.x, scanY: dock.y, stiffness: 62 };
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
      let wingOpen = 0.72;
      let wingFan = 0.15;
      let funnelDeploy = 0;
      let armFlare = 6;
      let headLook = 0;

      // Sakuga Awakening Burst (0..0.44s): crisp radial white-emerald halo + 8 anime rays + twin expanding shock rings!
      if (gantryT < 0.44) {
        const bu = clamp01(gantryT / 0.44);
        const bEase = 1 - Math.pow(1 - bu, 2.5);
        awakeningG.setAttribute("opacity", "1");
        awakeningHalo.setAttribute("r", (14 + bEase * 14).toFixed(1));
        awakeningHalo.setAttribute("opacity", ((1 - bu) * 0.92).toFixed(2));
        awakeningRing.setAttribute("r", (7 + bEase * 23).toFixed(1));
        awakeningRing.setAttribute("opacity", ((1 - bu) * 0.88).toFixed(2));
        awakeningRing2.setAttribute("r", (5 + bEase * 17).toFixed(1));
        awakeningRing2.setAttribute("opacity", ((1 - bu) * 0.65).toFixed(2));
        awakeningRays.setAttribute("transform", `scale(${(0.65 + bEase * 0.65).toFixed(2)}) rotate(${(bEase * 14).toFixed(1)}, 0, 2)`);
        awakeningRays.setAttribute("opacity", (Math.sin(bu * Math.PI) * 0.85).toFixed(2));
      } else {
        awakeningG.setAttribute("opacity", "0");
      }

      if (gantryT < gantryStandSec) {
        const su = clamp01(gantryT / Math.max(0.01, gantryStandSec));
        const ease = 1 - Math.pow(1 - su, 3);
        // Settle gracefully from anti-gravity hover (3.4*S) down onto the launch deck while 3-tier wings & Funnels fan open!
        liftPx = (1 - smooth(0.0, 0.38, su)) * 3.4 * launchScaleS;
        wingOpen = lerp(0.72, 1.0, ease);
        wingFan = smooth(0.08, 0.88, su);
        funnelDeploy = smooth(0.26, 0.96, su);
        armFlare = lerp(6, 13, ease);
        headLook = -ease * 8.5;
        drone.eyeY = lerp(-0.35, -0.88, ease);
        machConeG.setAttribute("opacity", "0");
      } else {
        const iu = clamp01((gantryT - gantryStandSec) / Math.max(0.01, gantryIgniteSec));
        wingOpen = 1.0;
        wingFan = 1.0;
        funnelDeploy = 1.0;
        armFlare = lerp(13, 19, clamp01(iu * 2.2));
        headLook = -8.5;
        drone.eyeY = -0.88;
        if (iu < 0.44) {
          const p = iu / 0.44;
          thrust = p * 1.25;
          shudderX = Math.sin(gantryT * 125) * p * 0.78;
          standPose = 1;
          machConeG.setAttribute("opacity", "0");
        } else {
          const lu = (iu - 0.44) / 0.56;
          const ease = 1 - Math.pow(1 - lu, 3);
          liftPx = ease * 24 * launchScaleS;
          thrust = 1.25 + lu * 0.40;
          standPose = 1 - ease;
          // BOOM! Supersonic Prandtl-Glauert Mach-Cone Vapor Ring snaps around waist on breakout!
          const mcU = clamp01((lu - 0.06) / 0.65);
          if (mcU > 0 && mcU < 1) {
            const mcEase = 1 - Math.pow(1 - mcU, 2.2);
            machConeG.setAttribute("opacity", (Math.sin(mcU * Math.PI) * 0.92).toFixed(2));
            machConeOuter.setAttribute("rx", (10 + mcEase * 17).toFixed(1));
            machConeOuter.setAttribute("ry", (2.6 + mcEase * 3.8).toFixed(1));
            machConeInner.setAttribute("rx", (7 + mcEase * 12).toFixed(1));
            machConeInner.setAttribute("ry", (1.6 + mcEase * 2.5).toFixed(1));
          } else {
            machConeG.setAttribute("opacity", "0");
          }
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
      setOverdriveColor(false);
      visorAura.setAttribute("opacity", (0.55 + thrust * 0.35).toFixed(2));
      bodyRigG.setAttribute("opacity", "1");
      updateFullBodyKinematics(now, thrust, 0, 0, 0, { standPose, wingOpen, wingFan, funnelDeploy, armFlare });
      stepSpringAntenna(dt, -shudderX * 4 - headLook * 0.35);

      const leftHome = getView() !== "home";
      if (leftHome || gantryT >= totalG) {
        awakeningG.setAttribute("opacity", "0");
        machConeG.setAttribute("opacity", "0");
        avPhase = "patrolling";
        patrolT = 0;
        drone.vx = 0;
        drone.vy = -400;
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
      const totalDur = patrolIsReRun ? 4.90 : 5.25;
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
      const isFlagHover = drone.curious > 0.52;
      const eyeFill = isFlagHover ? "#FFE8E3" : "#C9FCE0";
      eyeL.setAttribute("fill", eyeFill);
      eyeR.setAttribute("fill", eyeFill);
      statusTip.setAttribute("fill", isFlagHover ? "#B83B2A" : "#2D6A47");
      chestCore.setAttribute("fill", isFlagHover ? "#B83B2A" : "#2D6A47");
      setOverdriveColor(isFlagHover);
      visorAura.setAttribute("opacity", (0.50 + tgt.beam * 0.35).toFixed(2));

      // Stereo Twin-Eye Diagonal Optical Laser Scanner: shoots strictly from eyeL & eyeR diagonally onto target (ZERO body overlap!)
      const pxPerUnit = getPxPerUnit();
      const bankRad = (drone.bodyBank * Math.PI) / 180;

      if (coneG && tgt.beam > 0.02) {
        const eyes = getEyeWorldCoords(flySX, flySY, pxPerUnit, hoverBobY);
        const lx = eyes.L.x, ly = eyes.L.y;
        const rx = eyes.R.x, ry = eyes.R.y;
        const midX = (lx + rx) * 0.5;
        const midY = (ly + ry) * 0.5;
        const tx = typeof tgt.scanX === "number" ? tgt.scanX : midX - 75;
        const ty = typeof tgt.scanY === "number" ? tgt.scanY : midY + 140;
        const halfSpread = isFlagHover ? 34 : 42;
        const tLx = tx - halfSpread;
        const tRx = tx + halfSpread;
        const accentColor = isFlagHover ? "#B83B2A" : "#2D6A47";

        // Align diagonal gradients smoothly from eyes -> scan target!
        const activeFillG = isFlagHover ? flagBeamGrad : beamGrad;
        const activeEdgeG = isFlagHover ? edgeFlagGrad : edgeBeamGrad;
        if (activeFillG) {
          activeFillG.setAttribute("x1", midX.toFixed(1));
          activeFillG.setAttribute("y1", midY.toFixed(1));
          activeFillG.setAttribute("x2", tx.toFixed(1));
          activeFillG.setAttribute("y2", ty.toFixed(1));
        }
        if (activeEdgeG) {
          activeEdgeG.setAttribute("x1", midX.toFixed(1));
          activeEdgeG.setAttribute("y1", midY.toFixed(1));
          activeEdgeG.setAttribute("x2", tx.toFixed(1));
          activeEdgeG.setAttribute("y2", ty.toFixed(1));
        }

        coneG.setAttribute("opacity", (tgt.beam * 0.94).toFixed(2));
        conePoly.setAttribute("fill", isFlagHover ? "url(#agent-beam-flag)" : "url(#agent-beam-grad)");
        coneCorePoly.setAttribute("fill", isFlagHover ? "url(#agent-beam-flag)" : "url(#agent-beam-grad)");
        conePoly.setAttribute("points", `${lx.toFixed(1)},${ly.toFixed(1)} ${rx.toFixed(1)},${ry.toFixed(1)} ${tRx.toFixed(1)},${ty.toFixed(1)} ${tLx.toFixed(1)},${ty.toFixed(1)}`);
        coneCorePoly.setAttribute("points", `${lx.toFixed(1)},${ly.toFixed(1)} ${rx.toFixed(1)},${ry.toFixed(1)} ${(tx + halfSpread * 0.34).toFixed(1)},${ty.toFixed(1)} ${(tx - halfSpread * 0.34).toFixed(1)},${ty.toFixed(1)}`);

        const edgeStroke = isFlagHover ? "url(#agent-edge-flag)" : "url(#agent-edge-grad)";
        coneEdgeL.setAttribute("stroke", edgeStroke);
        coneEdgeR.setAttribute("stroke", edgeStroke);
        coneEdgeL.setAttribute("x1", lx.toFixed(1));
        coneEdgeL.setAttribute("y1", ly.toFixed(1));
        coneEdgeL.setAttribute("x2", tLx.toFixed(1));
        coneEdgeL.setAttribute("y2", ty.toFixed(1));
        coneEdgeR.setAttribute("x1", rx.toFixed(1));
        coneEdgeR.setAttribute("y1", ry.toFixed(1));
        coneEdgeR.setAttribute("x2", tRx.toFixed(1));
        coneEdgeR.setAttribute("y2", ty.toFixed(1));

        // Twin subtle glowing eye-emitter sparkles right on eyeL & eyeR!
        const glowFill = isFlagHover ? "#FFE8E3" : "#EBFFF3";
        if (coneEyeGlowL && coneEyeGlowR) {
          coneEyeGlowL.setAttribute("cx", lx.toFixed(1));
          coneEyeGlowL.setAttribute("cy", ly.toFixed(1));
          coneEyeGlowL.setAttribute("fill", glowFill);
          coneEyeGlowR.setAttribute("cx", rx.toFixed(1));
          coneEyeGlowR.setAttribute("cy", ry.toFixed(1));
          coneEyeGlowR.setAttribute("fill", glowFill);
        }

        // Crisp industrial laser caliper readout bar sweeping cleanly across target depth!
        const barFrac = 0.72 + 0.24 * (0.5 + 0.5 * Math.sin(now * 0.011));
        const bxL = lerp(lx, tLx, barFrac);
        const bxR = lerp(rx, tRx, barFrac);
        const barY = lerp(midY, ty, barFrac);
        const barMidX = (bxL + bxR) * 0.5;
        coneScanBar.setAttribute("stroke", accentColor);
        coneScanBar.setAttribute("x1", bxL.toFixed(1));
        coneScanBar.setAttribute("y1", barY.toFixed(1));
        coneScanBar.setAttribute("x2", bxR.toFixed(1));
        coneScanBar.setAttribute("y2", barY.toFixed(1));
        coneScanBar.setAttribute("opacity", (0.76 + 0.20 * Math.sin(now * 0.018)).toFixed(2));
        coneScanTicks.setAttribute("stroke", accentColor);
        coneScanTicks.setAttribute(
          "d",
          `M ${bxL.toFixed(1)},${(barY - 4.5).toFixed(1)} L ${bxL.toFixed(1)},${(barY + 4.5).toFixed(1)} M ${bxR.toFixed(1)},${(barY - 4.5).toFixed(1)} L ${bxR.toFixed(1)},${(barY + 4.5).toFixed(1)} M ${barMidX.toFixed(1)},${(barY - 2.8).toFixed(1)} L ${barMidX.toFixed(1)},${(barY + 2.8).toFixed(1)}`
        );

        if (skeletonGridEl && (getView() === "home")) {
          const cols = skeletonGridEl.querySelectorAll(".era-col");
          cols.forEach((col, idx) => {
            if (pingedCols[idx]) return;
            const cr = col.getBoundingClientRect();
            if (Math.abs(tx - (cr.left + cr.width * 0.5)) < cr.width * 0.42) {
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

      const leftHome = getView() !== "home";
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
        hasEverDocked = true;
        btn.classList.add("is-docked");
        dockShadow.setAttribute("opacity", "1");
        triggerBlink(false);
        bus.emit("mech:docked");
      }
    } else if (avPhase === "sonar") {
      // Industrial Angular LiDAR Fan Sweep from Docked Avatar Visor (sharp 15° V-angle sweeping left-to-right 84° -> 2°!)
      sonarT += dt;
      const sweepDur = 1.08;
      const u = clamp01(sonarT / sweepDur);
      const ease = u * u * (3 - 2 * u);
      const dock = getDockCenter();
      const ox = dock.x;
      const oy = dock.y + 1.5;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const rayLen = Math.hypot(W, H) * 1.12;

      const leadDeg = lerp(84, 2, ease);
      const trailDeg = Math.min(88, leadDeg + 15.5);
      const leadRad = (leadDeg * Math.PI) / 180;
      const trailRad = (trailDeg * Math.PI) / 180;
      const lx = ox + Math.cos(leadRad) * rayLen;
      const ly = oy + Math.sin(leadRad) * rayLen;
      const tx = ox + Math.cos(trailRad) * rayLen;
      const ty = oy + Math.sin(trailRad) * rayLen;
      const fade = u < 0.08 ? u / 0.08 : (1 - smooth(0.84, 1.0, u));

      if (sonarG) {
        sonarG.setAttribute("opacity", fade.toFixed(2));
        if (sonarFanGrad) {
          sonarFanGrad.setAttribute("cx", ox.toFixed(1));
          sonarFanGrad.setAttribute("cy", oy.toFixed(1));
          sonarFanGrad.setAttribute("r", (rayLen * 0.92).toFixed(1));
        }
        sonarWedge.setAttribute("points", `${ox.toFixed(1)},${oy.toFixed(1)} ${lx.toFixed(1)},${ly.toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)}`);
        sonarLeadRay.setAttribute("x1", ox.toFixed(1));
        sonarLeadRay.setAttribute("y1", oy.toFixed(1));
        sonarLeadRay.setAttribute("x2", lx.toFixed(1));
        sonarLeadRay.setAttribute("y2", ly.toFixed(1));
        sonarTrailRay.setAttribute("x1", ox.toFixed(1));
        sonarTrailRay.setAttribute("y1", oy.toFixed(1));
        sonarTrailRay.setAttribute("x2", tx.toFixed(1));
        sonarTrailRay.setAttribute("y2", ty.toFixed(1));
        // Calibrated perpendicular industrial range ticks along the leading laser ray!
        const nx = -Math.sin(leadRad) * 5.0;
        const ny = Math.cos(leadRad) * 5.0;
        let tickPath = "";
        for (const dist of [180, 360, 560, 780]) {
          const px = ox + Math.cos(leadRad) * dist;
          const py = oy + Math.sin(leadRad) * dist;
          tickPath += `M ${(px - nx).toFixed(1)},${(py - ny).toFixed(1)} L ${(px + nx).toFixed(1)},${(py + ny).toFixed(1)} `;
        }
        sonarAxisTicks.setAttribute("d", tickPath.trim());
      }

      // Docked mech's eyes smoothly track the sweeping industrial laser angle!
      const lookX = Math.cos(leadRad) * 1.45;
      const lookY = Math.sin(leadRad) * 0.95;
      eyesTrackG.setAttribute("transform", `translate(${(lookX * 0.72).toFixed(2)}, ${(lookY * 0.72).toFixed(2)})`);
      applyFaceYaw(lookX * 0.45, lookY * 0.28);

      if (fpCanvasEl && (getView() === "home")) {
        const allSquares = fpCanvasEl.querySelectorAll(".gh-grid .heat-sq");
        const weekCount = Math.floor(allSquares.length / 7);
        for (let wi = 0; wi < weekCount; wi += 2) {
          if (pingedHeatmapWeeks[wi]) continue;
          const anchorSq = allSquares[wi * 7 + 3] || allSquares[wi * 7];
          if (!anchorSq) continue;
          const hr = anchorSq.getBoundingClientRect();
          const deg = Math.atan2((hr.top + hr.height * 0.5) - oy, (hr.left + hr.width * 0.5) - ox) * (180 / Math.PI);
          if (leadDeg <= deg) {
            pingedHeatmapWeeks[wi] = true;
            shimmerHeatmapCol(wi);
          }
        }
      }

      navBtns.forEach((nb, idx) => {
        if (sonarNavDone[idx]) return;
        const nr = nb.getBoundingClientRect();
        const deg = Math.atan2((nr.top + nr.height * 0.5) - oy, (nr.left + nr.width * 0.5) - ox) * (180 / Math.PI);
        if (leadDeg <= deg + 4) {
          sonarNavDone[idx] = true;
          wakeNavButton(nb);
        }
      });

      if (skeletonGridEl && (getView() === "home")) {
        const cols = skeletonGridEl.querySelectorAll(".era-col");
        cols.forEach((col, idx) => {
          if (sonarColsDone[idx]) return;
          const cr = col.getBoundingClientRect();
          const deg = Math.atan2((cr.top + cr.height * 0.58) - oy, (cr.left + cr.width * 0.5) - ox) * (180 / Math.PI);
          if (leadDeg <= deg) {
            sonarColsDone[idx] = true;
            pingEraColumn(col);
          }
        });
      }

      const floatY = Math.sin(now * 0.0028) * 1.1;
      craftG.setAttribute("transform", `translate(0, ${floatY.toFixed(2)})`);
      stepSpringAntenna(dt, Math.sin(now * 0.0022) * 2.2);

      if (sonarT >= sweepDur) {
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

  return {
    isDocked: () => avPhase === "avatar" || avPhase === "sonar",
    onLiftoff: handleLiftoff,
    abortGantry
  };
}
