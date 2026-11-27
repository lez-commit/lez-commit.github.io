import {
  mk,
  clamp01,
  smooth,
  lerp,
  lerpInk,
  solveKnee,
  solveElbow,
  footPose,
  capsuleSegPath,
  capsuleFootPath
} from "../core/utils.js";
import { bus } from "../core/bus.js";
import { buildDioramas } from "./dioramas.js";
import { buildBotRig } from "./bot-rig.js";

/**
 * Evolving Ink-Art Robot Choreography Engine (Era 1 -> Era 5):
 * 2-bone IK bipedal gait, Pixar walk-stop momentum & hit-stop, 5-era story beats,
 * DOM-centered diorama anchors, and 1:1 Ver.Ka Gundam lock-in handoff via event bus.
 */
export function initEvoWalker({ getView }) {
  const evoLayerEl = document.getElementById("evo-walker-layer");
  if (!evoLayerEl) return null;

  const BASE_Y = 76;
  const getScale = (span) => {
    const t = Math.max(0, Math.min(1, (span - 600) / 620));
    return 1.32 + t * 0.32;
  };
  let S = 1.56;

  /**
   * Centers all 5 architectural dioramas cleanly inside each column's open runway space
   * — strictly clear of the left .spine-dot and the right timeline arrow!
   */
  function computeEraAnchors(startX, span, scale) {
    const colW = (evoLayerEl.clientWidth || (startX + span + 18)) / 5;
    const x1 = Math.max(startX + 46 * scale, colW * 0.56);
    const x2 = Math.max(colW * 1.54, colW * 1 + 20.5 + 16 * scale);
    // Era 3 toolbox extends ~26*S left of x3: keep strictly clear of Era 3's .spine-dot!
    const x3 = Math.max(colW * 2.56, colW * 2 + 20.5 + 29 * scale);
    const x4 = Math.max(colW * 3.54, colW * 3 + 20.5 + 18 * scale);
    // Era 5 gantry (~21*S half-width + horizontal steam): center cleanly between col 4's dot & right edge!
    const minX5 = colW * 4 + 20.5 + 24 * scale;
    const maxX5 = colW * 5 - 16 - 21 * scale;
    const x5 = minX5 < maxX5 ? (minX5 + maxX5) * 0.5 : colW * 4.58;
    return [x1, x2, x3, x4, x5];
  }

  const {
    svg,
    groundBounceEl, prop1, pebbleDust, prop2, vatCranePiston, vatEkgWave, vatGlow, vatLiquidGroup, vatLiquidFill, vatMeniscus, vatBubbles, vatEmitter, brainTrailDots, vatBrainGroup, vatAntTip, vatEyeSleep, vatEyeAwake, vatDomeGroup, brainDockSpark, cotChainGroup, cotLink1, cotLink2, cotNode1, cotNode2, cotNode3, cotNode3Rays, prop3, toolBoxCavity, rackPortLed, toolBoxLid, rackWrenchEl, toolSnapSpark, wallBody, wallBeacon, wallCrack, wallBrokenG, wallShardsG, shard1, shard2, shard3, shard4, wallTorqueArcs, drillChips, wallSparks, wallDust, prop4, gateScanBeam, deskScreenGlow, towerLed1, towerLed2, sideGraphN1, sideGraphN2, sideGraphN3, mugSteam1, mugSteam2, typeSparks, gateScreenLines, codeLine1, codeLine2, codeLine3, codeCursor, gateCheckEl, gateSavedRipple, stateFlowGroup, gateLink1, gateLink2, gateS1, gateS2, gateS3, gateS3Rays, gateFreezeBadge, prop5, padField, gantryClampL, gantryClampR, gantryBeaconL, gantryBeaconR, padCheck1, padCheck2, padCheck3, padBeams, padScanLine, padEnergyRing, trenchGlow, launchSteamL, launchSteamR, padPipL, padPipR, padCore, launchShock, shockL, shockR, sonicRing, launchTrail, launchTrailL, launchTrailR, tracePool, skidPool, humanGroup, humanLegB, humanLegF, humanTorsoG, humanArmB, humanHandB, engFaceHappy, engFaceOops, humanArmF, humanHand, windTicks, keyFullSpark, humanSweat
  } = buildDioramas({ evoLayerEl, BASE_Y });

  const {
    botGroup, shadowEl, stuckBang, botBody, keyGroup, keyBowG, backLegGroup, backThigh, backShin, kneeJoint2, backFoot, bootB, backArmGroup, backUpperArm, backForeArm, elbowJointB, gauntletB, torsoGroup, jetpackEl, groundWingL, groundWingR, rpaTopCap, mk1Lamp, mk3BackEl, mk3StowedDrill, mk4BackEl, neckEl, pelvisEl, skirtArmorEl, torsoEl, torsoShade, chestPanel, chestLed, mk1FrontDial, mk1Needle, mk2ProtoEl, mk2CoreAura, mk2PulseBar, mk3RigEl, mk4TactEl, mk4Led1, mk4Led2, mk4Led3, shoulderArmorEl, harnessGroup, harnessX1, harnessX2, harnessGlow, harnessHexG, harnessRipple, harnessRipple2, frontThigh, frontShin, frontFoot, kneeJoint1, bootF, headGroup, antGroup, antTip, cotHeadSpark, mk2HeadFins, mk4EarWings, crtEarsEl, visorScreen, visorGlint1, crtBootLine, eyeEl, eyeFocus, eyeWince, dizzyStars, gogglesEl, visorGlint2, goggleEye, gEyeL, gEyeR, goggleHappy, headCrestEl, frontUpperArm, frontForeArm, elbowJointF, shoulderPin, handTipB, handTipF, pincerEl, mk3ArmCuff, drillGroup, drillFlutes, gauntletF, repulsorJets, leftPalmJet, leftPalmCore, rightPalmJet, rightPalmCore, packJetL, packJetR, bootJetF, bootJetB, palmEmitterL, palmEmitterR, assembleLayer, flyParts, lockSparks, lockGlint, clickSpark
  } = buildBotRig({ svg });

  let traceIdx = 0;
  let traceCooldown = 0;
  let skidIdx = 0;
  let skidCooldown = 0;

  // Cycle state
  let posX = 16;
  let lastSpan = 0;
  let phase = 0;
  let keyPhase = 0;
  let lastTime = performance.now();
  let blinkTimer = 3.0;
  let isBlinking = false;
  let clickHopTimer = 0;
  let resetWaitTimer = 0;
  // Pixar walk-stop momentum lean-and-settle damped spring + Hit-Stop & Impact Micro-Shake!
  let prevMoveSpeed = 0;
  let velLean = 0;
  let velLeanVel = 0;
  let hitStopTimer = 0;
  let shakeAmp = 0;
  let shakePhase = 0;
  let sonicHitDone = false;
  let storyPinged = [false, false, false, false, false];

  const STORY_TWIG_TARGETS = [
    ["RPA 自动化"],
    ["思维链 CoT", "ReAct 闭环"],
    ["Function Calling"],
    ["Coding Agent", "LangGraph 状态机"],
    ["Agent Skills", "Harness 驾驭工程"]
  ];

  function triggerImpact(stopSec, amp) {
    hitStopTimer = Math.max(hitStopTimer, stopSec);
    shakeAmp = Math.max(shakeAmp, amp);
  }

  function pingStoryTwigs(eraIdx) {
    if (storyPinged[eraIdx] || !skeletonGridEl) return;
    storyPinged[eraIdx] = true;
    const targets = STORY_TWIG_TARGETS[eraIdx];
    if (!targets) return;
    const col = skeletonGridEl.querySelectorAll(".era-col")[eraIdx];
    if (!col) return;
    const items = col.querySelectorAll(".twig-item");
    let delay = 0;
    items.forEach((tw) => {
      const titleEl = tw.querySelector(".twig-title");
      const txt = titleEl ? titleEl.textContent.trim() : "";
      if (targets.some((t) => txt.includes(t))) {
        setTimeout(() => {
          tw.classList.add("is-story-ping");
          setTimeout(() => tw.classList.remove("is-story-ping"), 1150);
        }, delay);
        delay += 140;
      }
    });
  }

  // 5-beat + opening Human Wind-Up state machine per cycle
  let b0 = 0, b0t = 0; // Era 1 Opening: 0=human cranks Mark I wind-up key (0.96s), 1=human watches & reacts to trip, 2=human faded out
  let b1 = 0, b1t = 0; // Era 1 pebble: 0=jog, 1=trip, 2=long belly-slide into Era 2, 3=pop up, 4=done
  let b2 = 0, b2t = 0; // Era 2 desk:   0=approach, 1=read+CoT(0.95s), 2=done
  let b3 = 0, b3t = 0; // Era 3 wall:   0=approach, 1=bonk+recoil+wrench+turn+sink(1.42s), 2=done
  let b4 = 0, b4t = 0; // Era 4 gate:   0=approach, 1=press+0.25s freeze+lift(1.02s), 2=done
  let b5 = 0, b5t = 0; // Era 5 pad:    0=approach, 1=dock harness(1.22s), 2=walk to launch pad, 3=ignition & liftoff, 4=airborne handoff (waiting for dock)
  let initPositioned = false;
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

  bus.on("mech:docked", () => {
    if (waitingForDock) {
      waitingForDock = false;
      restingCompleted = true;
      syncEraCaptions(-1, false);
    }
  });

  let wallBroken = false;  // Era 3 brick wall shattered cleanly into rubble stumps!
  let taskDone = false;    // Era 4 computer monitor shows permanent luminous bamboo ✓!
  let hasBrain = false;   // Physical brain docked from Era 2 Glass Vat!
  let hasWrench = false;  // Physical spiral drill equipped from Era 3 Toolbox!
  let hasToolRig = false; // Permanent Mark III industrial roll-cage + back tool pod upgrade!
  let isEquipped = false;
  let claspRippleTimer = 0;
  let lockSparkTimer = 0;
  let gateRippleTimer = 0;
  let brainDockTimer = 0;
  let toolSnapTimer = 0;
  let happyCarryTimer = 0;

  function resetCycle(startX) {
    posX = startX;
    phase = 0;
    b0 = 0;
    b0t = 0;
    b1 = b2 = b3 = b4 = b5 = 0;
    b1t = b2t = b3t = b4t = b5t = 0;
    wallBroken = false;
    taskDone = false;
    hasBrain = false;
    hasWrench = false;
    hasToolRig = false;
    isEquipped = false;
    humanGroup.setAttribute("opacity", "0");
    claspRippleTimer = 0;
    lockSparkTimer = 0;
    gateRippleTimer = 0;
    brainDockTimer = 0;
    toolSnapTimer = 0;
    happyCarryTimer = 0;
    resetWaitTimer = 0;
    prevMoveSpeed = 0;
    velLean = 0;
    velLeanVel = 0;
    hitStopTimer = 0;
    shakeAmp = 0;
    sonicHitDone = false;
    storyPinged = [false, false, false, false, false];
    groundBounceEl.setAttribute("opacity", "0");
    lockGlint.setAttribute("opacity", "0");
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
    bus.emit("mech:abort-gantry");
    const w = evoLayerEl.clientWidth || 1280;
    const startX = 14;
    const endX = Math.max(240, w - 18);
    const span = endX - startX;
    S = getScale(span);
    const [ax1, ax2, ax3, ax4, ax5] = computeEraAnchors(startX, span, S);
    const humanX = Math.max(startX + 9, ax1 - 50 * S);
    const botStartX = Math.max(humanX + 16.5 * S, ax1 - 33.5 * S);
    const anchors = [
      botStartX,
      ax2 - 56 * S,
      ax3 - 56 * S,
      ax4 - 56 * S,
      ax5 - 46 * S
    ];
    resetCycle(botStartX);
    initPositioned = true;
    const idx = Math.max(0, Math.min(4, eraIdx || 0));
    posX = Math.max(startX, anchors[idx]);
    if (idx >= 1) { b0 = 2; b1 = 4; }
    if (idx >= 2) { b2 = 2; hasBrain = true; }
    if (idx >= 3) { b3 = 2; hasWrench = false; hasToolRig = true; wallBroken = true; }
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
    propEl.addEventListener("mouseenter", () => {
      if (!skeletonGridEl) return;
      const dot = skeletonGridEl.querySelectorAll(".spine-dot")[idx];
      if (dot) dot.classList.add("is-prop-hover");
    });
    propEl.addEventListener("mouseleave", () => {
      if (!skeletonGridEl) return;
      const dot = skeletonGridEl.querySelectorAll(".spine-dot")[idx];
      if (dot) dot.classList.remove("is-prop-hover");
    });
  });



  bus.on("walker:summon", summonWalkerAtEra);

  botGroup.addEventListener("click", (e) => {
    e.stopPropagation();
    clickHopTimer = 0.5;
  });

  function tick(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;

    if (getView() === "home") {
      const w = evoLayerEl.clientWidth || 1280;
      const startX = 14;
      const endX = Math.max(240, w - 18);
      const span = endX - startX;
      S = getScale(span);

      // 5 Concrete prop anchor X positions (centered cleanly inside each column clear of .spine-dot!)
      const [x1, x2, x3, x4, x5] = computeEraAnchors(startX, span, S);

      // Era 1 Opening Coordinates: Engineer stands cleanly right behind Mark I's wind-up key!
      const humanX = Math.max(startX + 9, x1 - 50 * S);
      const botStartX = Math.max(humanX + 16.5 * S, x1 - 33.5 * S);
      if (!initPositioned) {
        initPositioned = true;
        posX = botStartX;
        lastSpan = span;
      } else if (lastSpan > 0 && Math.abs(span - lastSpan) > 1) {
        const ratio = clamp01((posX - startX) / lastSpan);
        posX = startX + ratio * span;
        lastSpan = span;
      }

      // Calm post-ceremony resting state: keep all 5 resolved diorama scenes crisp & solid ink until user summons!
      if (restingCompleted) {
        botGroup.setAttribute("opacity", "0");
        humanGroup.setAttribute("opacity", "0");
        syncEraCaptions(-1, false);
        const setRestProp = (el, px) => {
          el.setAttribute("transform", `translate(${px.toFixed(1)}, ${BASE_Y}) scale(${S})`);
          el.setAttribute("opacity", "1");
          el.setAttribute("color", "#1D1B18");
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
        groundBounceEl.setAttribute("opacity", "0");
        trenchGlow.setAttribute("opacity", "0");
        launchSteamL.setAttribute("opacity", "0");
        launchSteamR.setAttribute("opacity", "0");
        // Keep idle ambient life gently breathing in resting state (slow tower beacons + live EKG + coffee steam!)
        const restBeacon = Math.sin(now * 0.0032) > 0.25 ? "#5CE09B" : "#2D6A47";
        gantryBeaconL.setAttribute("fill", restBeacon);
        gantryBeaconR.setAttribute("fill", restBeacon);
        const rst1 = Math.sin(now * 0.0026) * 0.65;
        const rst2 = Math.cos(now * 0.0022) * 0.55;
        mugSteam1.setAttribute("transform", `translate(${(rst1 * 0.5).toFixed(2)}, ${(-Math.abs(rst1) * 0.9).toFixed(2)})`);
        mugSteam2.setAttribute("transform", `translate(${(rst2 * 0.5).toFixed(2)}, ${(-Math.abs(rst2) * 0.8).toFixed(2)})`);
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

      // Unhurried, readable evolution walking pace (~32% slower + gentle viewport-width scaling so narrow panes never race!)
      const spanScale = 0.68 + clamp01(span / 1200) * 0.32;
      const baseSpeed =
        (evo < 0.85
          ? 62
          : evo < 1.75
          ? 46
          : evo < 2.65
          ? 60
          : evo < 3.45
          ? 50
          : 46) * spanScale;

      // Direct vertical launch right from the Era 5 Launch Gantry center (x5)!
      const launchX = x5;

      // Hit-Stop impact freeze + damped runway micro-shake for tactile animation weight!
      if (shakeAmp > 0.04) {
        shakePhase += dt * 95;
        const sxOff = Math.sin(shakePhase) * shakeAmp;
        const syOff = Math.cos(shakePhase * 1.35) * shakeAmp * 0.55;
        svg.style.transform = `translate3d(${sxOff.toFixed(2)}px, ${syOff.toFixed(2)}px, 0)`;
        shakeAmp *= Math.exp(-16 * dt);
      } else if (shakeAmp > 0) {
        shakeAmp = 0;
        svg.style.transform = "";
      }
      if (hitStopTimer > 0) {
        hitStopTimer = Math.max(0, hitStopTimer - dt);
        requestAnimationFrame(tick);
        return;
      }

      // Trigger each era's silent-film beat once per cycle
      if (b1 === 0 && posX >= x1 - 7.5 * S) { b1 = 1; b1t = 0; triggerImpact(0.042, 1.5); pingStoryTwigs(0); }
      if (b2 === 0 && posX >= x2 - 21.5 * S){ b2 = 1; b2t = 0; }
      if (b3 === 0 && posX >= x3 - 13.0 * S){ b3 = 1; b3t = 0; triggerImpact(0.052, 2.3); }
      if (b4 === 0 && posX >= x4 - 16.5 * S){ b4 = 1; b4t = 0; }
      if (b5 === 0 && posX >= x5 - 0.8 * S) { posX = x5; b5 = 1; b5t = 0; }

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

      if (b0 === 0) {
        // Era 1 Opening Beat (双手拧发条!): Engineer cranks Mark I's brass butterfly key 3 crisp turns over ~1.45s!
        b0t += dt * 0.66;
        activeEraIdx = 0;
        isEraBeat = true;
        posX = botStartX;
        moveSpeed = 0;
        extraLean = 4;
        keyPhase = b0t * 19.6; // 3 crisp full rotations over ~1.45s!
        if (b0t >= 0.96) {
          b0 = 1;
          b0t = 0;
        }
      } else if (clickHopTimer > 0 && b5 !== 3) {
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
        // Era 2 Beat (缸中之脑，会推理): Unhurried ~2.38s beat (bell-jar lift -> brain dock -> blink -> 3-step CoT!)
        b2t += dt * 0.68;
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
          pingStoryTwigs(1);
        }
        if (b2t >= 1.62) b2 = 2;
      } else if (b3 === 1) {
        // Era 3 Beat (撞墙试错，接工具): Unhurried ~2.90s beat (BONK -> recoil -> pop open -> snap Drill -> drill & SHATTER!)
        b3t += dt * 0.66;
        activeEraIdx = 2;
        isEraBeat = true;
        moveSpeed = 0;
        if (b3t < 0.34) {
          const u = b3t / 0.34;
          visualDX = -Math.sin(u * Math.PI * 0.5) * 28.0;
          extraLean = -44 * (1 - u * 0.35);
          beatHopH = Math.sin(u * Math.PI) * 1.8;
          armPose = "bonk";
        } else if (b3t < 0.58) {
          // Brief epiphany beat: head shake -> toolbox lid flips cleanly upright -> antenna flashes bamboo green!
          const u = (b3t - 0.34) / 0.24;
          visualDX = -28.0;
          extraLean = 4;
          armPose = "epiphany";
          epiphanyNow = u > 0.35;
          headNodDeg = u < 0.5 ? Math.sin(u * Math.PI * 4) * 8 : -5;
        } else if (b3t < 0.94) {
          // Reach cleanly into open toolbox & snap big Spiral Drill onto forearm!
          visualDX = -28.0;
          extraLean = 6;
          armPose = "grabTool";
          if (b3t >= 0.74 && !hasWrench) {
            hasWrench = true;
            hasToolRig = true;
            toolSnapTimer = 0.28;
          }
        } else if (b3t < 1.18) {
          // Step confidently clear of toolbox right up to brick wall with Spiral Drill armed!
          const u = (b3t - 0.94) / 0.24;
          visualDX = lerp(-28.0, -11.2, u);
          extraLean = 6;
          armPose = "wrench";
        } else if (b3t < 1.56) {
          // DRILL INTO BRICK WALL! Extended arm drives drill cone dead-on into left brick face!
          visualDX = -11.2 + Math.sin(b3t * 85) * 0.85;
          extraLean = 8;
          armPose = "wrench";
        } else {
          // SHATTER! Wall bursts cleanly into jagged rubble with Hit-Stop impact + celebratory follow-through!
          if (!wallBroken) {
            wallBroken = true;
            triggerImpact(0.048, 2.5);
            pingStoryTwigs(2);
          }
          const fu = clamp01((b3t - 1.56) / 0.24);
          const fEase = 1 - Math.pow(1 - fu, 3);
          visualDX = lerp(-11.2, -9.0, fEase);
          beatHopH = Math.sin(fu * Math.PI) * 1.4;
          extraLean = lerp(10, 3, fEase);
          armPose = "wrench";
        }
        if (b3t >= 1.92) {
          wallBroken = true;
          b3 = 2;
        }
      } else if (b4 === 1) {
        // Era 4 Beat (手眼脑通，状态机): Unhurried ~2.44s beat (scan -> live typing -> || freeze -> ✓!)
        b4t += dt * 0.64;
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
            pingStoryTwigs(3);
          }
          armPose = b4t < 1.24 ? "type" : "walk";
          extraLean = b4t < 1.24 ? 5 : 0;
          headNodDeg = b4t >= 1.24 ? Math.sin(clamp01((b4t - 1.24) / 0.30) * Math.PI) * 8 : 0;
        }
        if (b4t >= 1.56) {
          taskDone = true;
          happyCarryTimer = 0.55; // Carry happy ^ ^ smile briskly as he steps away toward Launch Gantry!
          b4 = 2;
        }
      } else if (b5 === 1) {
        // Era 5 Beat A (~1.94s): Tall Heroic Upright Suit-Up Convergence inside Launch Gantry -> Unified Ver.Ka Takeover at Lock-In!
        b5t += dt * 0.64;
        posX = x5;
        activeEraIdx = 4;
        isEraBeat = true;
        moveSpeed = 0;
        armPose = "dock";
        const waveImpacts = [0.34, 0.52, 0.72, 0.88];
        let recoil = 0;
        for (let i = 0; i < waveImpacts.length; i++) {
          const d = b5t - waveImpacts[i];
          if (d >= 0 && d < 0.12) recoil += Math.sin((d / 0.12) * Math.PI) * 0.45;
        }
        crouchY = recoil;
        if (b5t >= 0.88 && !isEquipped) {
          isEquipped = true;
          claspRippleTimer = 0.72;
          lockSparkTimer = 0.28;
          triggerImpact(0.040, 1.8);
          pingStoryTwigs(4);
          // Hand off at the EXACT armor lock-in flash so ONE SINGLE Ver.Ka Gundam model stands, ignites & flies seamlessly!
          if (!handoffStarted) {
            handoffStarted = true;
            waitingForDock = true;
            const getAnchor = () => {
              const lr = evoLayerEl.getBoundingClientRect();
              const cw = evoLayerEl.clientWidth || 1280;
              const cSpan = Math.max(240, cw - 18) - 14;
              const cS = getScale(cSpan);
              const cAnchors = computeEraAnchors(14, cSpan, cS);
              return { x: lr.left + cAnchors[4], padDeckY: lr.top + BASE_Y - 3.5 * cS, scale: cS };
            };
            const a0 = getAnchor();
            botGroup.setAttribute("opacity", "0");
            bus.emit("mech:liftoff", {
              x: a0.x,
              padDeckY: a0.padDeckY,
              scale: a0.scale,
              getAnchor,
              standSec: (1.24 - 0.88) / 0.64,
              igniteSec: 0.68 / 0.72,
              forcePatrol: true
            });
          }
        }
        if (b5t >= 0.88) {
          headNodDeg = Math.sin(clamp01((b5t - 0.88) / 0.30) * Math.PI) * 9;
        }
        // Directly transition into in-gantry ignition FX (trench glow + horizontal steam plumes + shockwave)!
        if (b5t >= 1.24) {
          b5 = 3;
          b5t = 0;
        }
      } else if (b5 === 3) {
        // Era 5 Beat B (~0.94s): Launch Gantry Ignition FX synced 1:1 with the unified Ver.Ka Gundam lifting vertically!
        b5t += dt * 0.72;
        posX = x5;
        activeEraIdx = 4;
        isEraBeat = true;
        moveSpeed = 0;
        armPose = "launch";
        if (b5t < 0.32) {
          const u = clamp01(b5t / 0.32);
          jetPower = u * 0.95;
        } else if (b5t < 0.68) {
          const u = clamp01((b5t - 0.32) / 0.36);
          const ease = 1 - Math.pow(1 - Math.min(1, u * 1.45), 3);
          launchLiftY = ease * 14.0;
          jetPower = 1.05 + u * 0.35;
        } else {
          launchLiftY = 14.0;
          jetPower = 1.4;
          handoffTrailT = 0;
          b5 = 4;
          if (!sonicHitDone) {
            sonicHitDone = true;
            shakeAmp = Math.max(shakeAmp, 2.2);
          }
          syncEraCaptions(-1, false);
          if (!handoffStarted) {
            handoffStarted = true;
            waitingForDock = true;
            const lr = evoLayerEl.getBoundingClientRect();
            botGroup.setAttribute("opacity", "0");
            bus.emit("mech:liftoff", {
              x: lr.left + x5,
              padDeckY: lr.top + BASE_Y - 3.5 * S,
              scale: S,
              standSec: 0,
              igniteSec: 0,
              forcePatrol: true
            });
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
      if (happyCarryTimer > 0) happyCarryTimer = Math.max(0, happyCarryTimer - dt);

      if (posX >= endX && b5 !== 3 && b5 !== 4) {
        resetWaitTimer = 1.4;
      }

      const drawX = posX + visualDX * S;

      // =================================================================
      // ALL 5 2.5D DIORAMA SCENES ALWAYS CRISP SOLID INK (no ghostly fade!)
      // =================================================================
      const setPropFocus = (el, px) => {
        const near = clamp01(1 - Math.abs(drawX - px) / (86 * S));
        const easedNear = near * near * (3 - 2 * near);
        el.setAttribute("transform", `translate(${px.toFixed(1)}, ${BASE_Y}) scale(${S})`);
        el.setAttribute("opacity", "1");
        el.setAttribute("color", "#1D1B18");
        return easedNear;
      };

      setPropFocus(prop1, x1);
      setPropFocus(prop2, x2);
      setPropFocus(prop3, x3);
      setPropFocus(prop4, x4);
      const near5 = setPropFocus(prop5, x5);

      // Era 1 Robotics Engineer animation (BOTH HANDS crank Mark I's brass butterfly key -> watches -> facepalm!)
      if (b0 === 0) {
        const u = clamp01(b0t / 0.96);
        const fadeIn = clamp01(b0t / 0.14);
        humanGroup.setAttribute("transform", `translate(${humanX.toFixed(1)}, ${BASE_Y}) scale(${S})`);
        humanGroup.setAttribute("opacity", fadeIn.toFixed(2));
        // Slight athletic stance while turning Mark I's butterfly wind-up key with BOTH hands
        humanLegB.setAttribute("d", "M -0.9,-9.0 L -3.1,-4.4 L -3.5,0 L -1.5,0");
        humanLegF.setAttribute("d", "M 0.9,-9.0 L 3.1,-4.4 L 2.1,0 L 4.3,0");
        const crankA = b0t * 19.6;
        const tRotDeg = 14 + Math.sin(crankA) * 2.2;
        const tRad = (tRotDeg * Math.PI) / 180;
        humanTorsoG.setAttribute("transform", `translate(0, -9.0) rotate(${tRotDeg.toFixed(1)})`);
        // Exact mathematical center of Mark I's sculpted brass butterfly key in humanGroup local coords!
        const mRad = (26 * Math.PI) / 180;
        const keyX_h = (posX - humanX) / S + (-10.8 * Math.cos(mRad) + 4.2 * Math.sin(mRad));
        const keyY_h = -6.4 + (-10.8 * Math.sin(mRad) - 4.2 * Math.cos(mRad));
        const toTorsoLocal = (wx, wy) => {
          const dx_t = wx;
          const dy_t = wy - (-9.0);
          return {
            x: dx_t * Math.cos(tRad) + dy_t * Math.sin(tRad),
            y: -dx_t * Math.sin(tRad) + dy_t * Math.cos(tRad)
          };
        };
        // Front/Right hand grips wing #1 (+crankA) & Back/Left hand grips opposite wing #2 (crankA + π)!
        const hF = toTorsoLocal(keyX_h + Math.cos(crankA) * 0.95, keyY_h + Math.sin(crankA) * 2.45);
        const hB = toTorsoLocal(keyX_h - Math.cos(crankA) * 0.95, keyY_h - Math.sin(crankA) * 2.45);
        const eFx = (2.6 + hF.x) * 0.5 + 0.5;
        const eFy = (-6.2 + hF.y) * 0.5 + 1.5;
        const eBx = (1.6 + hB.x) * 0.5 + 0.3;
        const eBy = (-6.4 + hB.y) * 0.5 - 1.3;
        humanArmF.setAttribute("d", `M 2.6,-6.2 L ${eFx.toFixed(1)},${eFy.toFixed(1)} L ${hF.x.toFixed(1)},${hF.y.toFixed(1)}`);
        humanHand.setAttribute("cx", hF.x.toFixed(1));
        humanHand.setAttribute("cy", hF.y.toFixed(1));
        humanArmB.setAttribute("d", `M 1.4,-6.6 L ${eBx.toFixed(1)},${eBy.toFixed(1)} L ${hB.x.toFixed(1)},${hB.y.toFixed(1)}`);
        humanHandB.setAttribute("cx", hB.x.toFixed(1));
        humanHandB.setAttribute("cy", hB.y.toFixed(1));
        // Center ratchet arcs + golden full-wind sparkle star cleanly on Mark I's brass butterfly key!
        windTicks.setAttribute("transform", `translate(${keyX_h.toFixed(1)}, ${keyY_h.toFixed(1)})`);
        const crankPulse = Math.abs(Math.sin(u * Math.PI * 3));
        windTicks.setAttribute("opacity", (crankPulse * 0.88).toFixed(2));
        if (u > 0.78) {
          const su = (u - 0.78) / 0.22;
          const sc = 0.4 + Math.sin(su * Math.PI) * 0.85;
          keyFullSpark.setAttribute("transform", `translate(${keyX_h.toFixed(1)}, ${(keyY_h - 4.2).toFixed(1)}) scale(${sc.toFixed(2)}) rotate(${(su * 45).toFixed(1)})`);
          keyFullSpark.setAttribute("opacity", Math.sin(su * Math.PI).toFixed(2));
        } else {
          keyFullSpark.setAttribute("opacity", "0");
        }
        engFaceHappy.setAttribute("opacity", "1");
        engFaceOops.setAttribute("opacity", "0");
        humanSweat.setAttribute("opacity", "0");
      } else if (b0 === 1) {
        b0t += dt;
        const tripped = b1 >= 1;
        const fadeOut = b1 >= 3 ? 1 - clamp01((b1t) / 0.32) : (b0t > 2.8 ? 1 - clamp01((b0t - 2.8) / 0.4) : 1);
        const stepBackX = -lerp(0, 2.2 * S, clamp01(b0t / 0.24));
        humanGroup.setAttribute("transform", `translate(${(humanX + stepBackX).toFixed(1)}, ${BASE_Y}) scale(${S})`);
        humanGroup.setAttribute("opacity", fadeOut.toFixed(2));
        humanLegB.setAttribute("d", "M -0.9,-9.6 L -2.2,-4.8 L -2.8,0 L -0.8,0");
        humanLegF.setAttribute("d", "M 0.9,-9.6 L 2.0,-4.8 L 1.6,0 L 3.8,0");
        windTicks.setAttribute("opacity", "0");
        keyFullSpark.setAttribute("opacity", "0");
        if (tripped) {
          // Comedic engineer facepalm + flat exasperated eyes + bamboo sweat-drop + "..."!
          humanTorsoG.setAttribute("transform", "translate(0, -9.6) rotate(-6)");
          humanArmB.setAttribute("d", "M -2.6,-6.2 L -5.0,-3.2 L -2.8,-0.8");
          humanHandB.setAttribute("cx", "-2.8");
          humanHandB.setAttribute("cy", "-0.8");
          humanArmF.setAttribute("d", "M 2.8,-6.2 L 6.4,-7.8 L 4.0,-12.4");
          humanHand.setAttribute("cx", "4.0");
          humanHand.setAttribute("cy", "-12.4");
          engFaceHappy.setAttribute("opacity", "0");
          engFaceOops.setAttribute("opacity", "1");
          humanSweat.setAttribute("opacity", "0.96");
        } else {
          // Stands proudly upright with hands on hips watching Mark I chug off!
          const standU = clamp01(b0t / 0.18);
          humanTorsoG.setAttribute("transform", `translate(0, -9.6) rotate(${lerp(14, 0, standU).toFixed(1)})`);
          humanArmB.setAttribute("d", "M -2.6,-6.2 L -5.2,-3.4 L -2.8,-0.8");
          humanHandB.setAttribute("cx", "-2.8");
          humanHandB.setAttribute("cy", "-0.8");
          humanArmF.setAttribute("d", "M 2.8,-6.2 L 5.2,-3.4 L 2.8,-0.8");
          humanHand.setAttribute("cx", "2.8");
          humanHand.setAttribute("cy", "-0.8");
          engFaceHappy.setAttribute("opacity", "1");
          engFaceOops.setAttribute("opacity", "0");
          humanSweat.setAttribute("opacity", "0");
        }
        if (fadeOut <= 0.02) b0 = 2;
      } else {
        humanGroup.setAttribute("opacity", "0");
      }

      // Prop 1 updates: pebble kick dust burst during trip
      if (b1 === 1 || (b1 === 2 && b1t < 0.24)) {
        const du = b1 === 1 ? clamp01(b1t / 0.22) * 0.55 : 0.55 + clamp01(b1t / 0.24) * 0.45;
        pebbleDust.setAttribute("transform", `translate(${(du * 4.5).toFixed(1)}, ${(-du * 2.5).toFixed(1)})`);
        pebbleDust.setAttribute("opacity", ((1 - du) * 0.85).toFixed(2));
      } else {
        pebbleDust.setAttribute("opacity", "0");
      }

      // Prop 2 updates (缸中之脑，会推理): Live EKG waveform, overhead crane piston, swaying liquid, trailing neural dots & 3-step CoT!
      const vatIdleBob = Math.sin(now * 0.0035) * 0.7;
      const reasoningNow = b2 === 1 && b2t >= 0.98;
      const brainInVat = b2 === 0 || (b2 === 1 && b2t < 0.34);
      // Live animated green EKG neural pulse waveform on dark base oscilloscope!
      const ekgFreq = b2 === 1 && b2t < 0.98 ? 0.015 : (b2 === 2 ? 0.003 : 0.006);
      const ekgAmp = b2 === 1 && b2t < 0.98 ? 1.45 : (b2 === 2 ? 0.25 : 0.92);
      const ekgP = ((now * ekgFreq) % 1);
      const pkX = lerp(-5.8, -2.0, ekgP);
      vatEkgWave.setAttribute(
        "d",
        `M -6.3,-5.4 L ${(pkX - 0.7).toFixed(1)},-5.4 L ${(pkX - 0.2).toFixed(1)},${(-5.4 - ekgAmp).toFixed(2)} L ${(pkX + 0.3).toFixed(1)},${(-5.4 + ekgAmp * 0.85).toFixed(2)} L ${(pkX + 0.75).toFixed(1)},-5.4 L -1.5,-5.4`
      );
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
        vatCranePiston.setAttribute("y2", "-30.4");
        vatBrainGroup.setAttribute("transform", `translate(0, ${(-16.8 + vatIdleBob).toFixed(2)})`);
        vatBrainGroup.setAttribute("opacity", "1");
        brainTrailDots.forEach((d) => d.setAttribute("opacity", "0"));
        vatEyeSleep.setAttribute("opacity", "0.85");
        vatEyeAwake.setAttribute("opacity", "0");
        vatAntTip.setAttribute("fill", "#FAF8F4");
        vatGlow.setAttribute("opacity", (0.28 + 0.14 * Math.sin(now * 0.004)).toFixed(2));
        vatEmitter.setAttribute("opacity", "0.65");
        cotChainGroup.setAttribute("opacity", "0");
      } else if (b2 === 1) {
        // Overhead crane piston physically lifts glass bell-jar up (0..0.34s), holds (0.34..0.72s), lowers cleanly back!
        let domeLift = 0;
        if (b2t < 0.34) {
          const u = clamp01(b2t / 0.34);
          domeLift = -(1 - Math.pow(1 - u, 3)) * 5.0;
        } else if (b2t < 0.72) {
          domeLift = -5.0;
        } else {
          const u = clamp01((b2t - 0.72) / 0.32);
          domeLift = -(1 - u * u * (3 - 2 * u)) * 5.0;
        }
        vatDomeGroup.setAttribute("transform", `translate(0, ${domeLift.toFixed(1)})`);
        vatDomeGroup.setAttribute("opacity", "1");
        vatCranePiston.setAttribute("y2", (-30.4 + domeLift).toFixed(1));

        // Brain wakes up (0.16s) and smoothly arcs from vat to robot neck with 5 trailing bamboo neural light particles!
        if (b2t < 0.72) {
          vatBrainGroup.setAttribute("opacity", "1");
          const awake = b2t >= 0.16;
          vatEyeSleep.setAttribute("opacity", awake ? "0" : "0.85");
          vatEyeAwake.setAttribute("opacity", awake ? "1" : "0");
          vatAntTip.setAttribute("fill", awake ? "#2D6A47" : "#FAF8F4");
          if (b2t < 0.34) {
            const u = clamp01(b2t / 0.34);
            vatBrainGroup.setAttribute("transform", `translate(0, ${(-16.8 - u * 4.2).toFixed(1)})`);
            brainTrailDots.forEach((d) => d.setAttribute("opacity", "0"));
          } else {
            const u = clamp01((b2t - 0.34) / 0.38);
            const e = u * u * (3 - 2 * u);
            const inv = 1 - e;
            const bx = inv * inv * 0 + 2 * inv * e * -10.4 + e * e * -20.8;
            const by = inv * inv * -21.0 + 2 * inv * e * -29.2 + e * e * -22.2;
            vatBrainGroup.setAttribute("transform", `translate(${bx.toFixed(1)}, ${by.toFixed(1)})`);
            brainTrailDots.forEach((d, ti) => {
              const tu = clamp01(u - (ti + 1) * 0.085);
              if (tu > 0.02) {
                const te = tu * tu * (3 - 2 * tu);
                const tinv = 1 - te;
                const tx = tinv * tinv * 0 + 2 * tinv * te * -10.4 + te * te * -20.8;
                const ty = tinv * tinv * -21.0 + 2 * tinv * te * -29.2 + te * te * -22.2;
                d.setAttribute("cx", tx.toFixed(1));
                d.setAttribute("cy", ty.toFixed(1));
                d.setAttribute("opacity", ((1 - ti * 0.18) * Math.sin(tu * Math.PI) * 0.9).toFixed(2));
              } else {
                d.setAttribute("opacity", "0");
              }
            });
          }
        } else {
          vatBrainGroup.setAttribute("opacity", "0");
          brainTrailDots.forEach((d) => d.setAttribute("opacity", "0"));
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
        vatCranePiston.setAttribute("y2", "-30.4");
        vatBrainGroup.setAttribute("opacity", "0");
        brainTrailDots.forEach((d) => d.setAttribute("opacity", "0"));
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
      wallBeacon.setAttribute("fill", !wallBroken && Math.sin(now * (drillingNow ? 0.024 : 0.005)) > -0.1 ? "#B83B2A" : "#E4DDD0");
      wallTorqueArcs.setAttribute("opacity", drillingNow ? (0.45 + 0.55 * Math.abs(Math.sin(b3t * 42))).toFixed(2) : "0");
      // Live spraying stone-chip particles arcing backward from drill contact point!
      drillChips.forEach((ch, ci) => {
        if (drillingNow) {
          const cu = ((b3t * 4.8 + ci * 0.17) % 1);
          const vx = -(3.5 + (ci % 3) * 2.4);
          const vy = -(3.2 + (ci % 2) * 2.2);
          const cx = -8.4 + vx * cu;
          const cy = -13.6 + vy * cu + 9.2 * cu * cu;
          ch.setAttribute("transform", `translate(${(cx + 8).toFixed(1)}, ${(cy + 14).toFixed(1)}) rotate(${(cu * 140 * (ci % 2 === 0 ? 1 : -1)).toFixed(0)}, -8, -14)`);
          ch.setAttribute("opacity", (Math.sin(cu * Math.PI) * 0.92).toFixed(2));
        } else {
          ch.setAttribute("opacity", "0");
        }
      });

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
      // Gentle rising steam wisps above coffee mug + live workstation tower disk/CPU LEDs + side LangGraph monitor!
      const st1 = Math.sin(now * 0.0026) * 0.65;
      const st2 = Math.cos(now * 0.0022) * 0.55;
      mugSteam1.setAttribute("transform", `translate(${(st1 * 0.5).toFixed(2)}, ${(-Math.abs(st1) * 0.9).toFixed(2)})`);
      mugSteam2.setAttribute("transform", `translate(${(st2 * 0.5).toFixed(2)}, ${(-Math.abs(st2) * 0.8).toFixed(2)})`);
      const diskBlink = typingNow ? Math.sin(now * 0.036) > 0 : Math.sin(now * 0.0035) > 0.3;
      towerLed1.setAttribute("fill", diskBlink ? "#5CE09B" : "#2D6A47");
      towerLed2.setAttribute("fill", typingNow && !diskBlink ? "#B5F5D4" : "#8A8275");
      sideGraphN1.setAttribute("fill", b4 >= 1 || taskDone ? "#5CE09B" : "#8A8275");
      sideGraphN2.setAttribute("fill", (b4 === 1 && b4t >= 0.38) || taskDone ? (freezeAll ? "#F6D365" : "#5CE09B") : "#8A8275");
      sideGraphN3.setAttribute("fill", taskDone ? "#5CE09B" : "#8A8275");

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
      const b5FastBlink = Math.sin(now * 0.018) > 0;
      const b5SlowBlink = Math.sin(now * 0.0036) > 0.15;
      const beaconFill = chk3 ? (b5FastBlink ? "#5CE09B" : "#2D6A47") : (b5SlowBlink ? "#B83B2A" : "#E4DDD0");
      gantryBeaconL.setAttribute("fill", beaconFill);
      gantryBeaconR.setAttribute("fill", beaconFill);
      // Mechanical launch clamps flare cleanly outward like aerospace umbilical arms (zero beacon collision!)
      const clampOpenU = b5 >= 2 ? 1 : (b5 === 1 ? smooth(0.84, 1.14, b5t) : 0);
      gantryClampL.setAttribute("transform", `rotate(${(-clampOpenU * 76).toFixed(1)}, -15.4, -17.4)`);
      gantryClampR.setAttribute("transform", `rotate(${(clampOpenU * 76).toFixed(1)}, 15.2, -17.4)`);
      // Blazing flame-trench exhaust glow & horizontal high-pressure steam plumes during ignition & liftoff!
      if (b5 === 3 || (b5 === 4 && handoffTrailT < 0.72)) {
        const steamU = b5 === 3 ? clamp01(b5t / 0.68) : clamp01(0.75 + handoffTrailT * 0.55);
        const steamOp = b5 === 3 ? clamp01(jetPower * 0.92) : clamp01(1 - handoffTrailT / 0.72) * 0.82;
        trenchGlow.setAttribute("opacity", (steamOp * 0.92).toFixed(2));
        launchSteamL.setAttribute("opacity", steamOp.toFixed(2));
        launchSteamR.setAttribute("opacity", steamOp.toFixed(2));
        launchSteamL.setAttribute("transform", `translate(${(-steamU * 9.5).toFixed(1)}, ${(-steamU * 1.4).toFixed(1)}) scale(${(0.68 + steamU * 0.55).toFixed(2)})`);
        launchSteamR.setAttribute("transform", `translate(${(steamU * 9.5).toFixed(1)}, ${(-steamU * 1.4).toFixed(1)}) scale(${(0.68 + steamU * 0.55).toFixed(2)})`);
      } else {
        trenchGlow.setAttribute("opacity", "0");
        launchSteamL.setAttribute("opacity", "0");
        launchSteamR.setAttribute("opacity", "0");
      }
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

      // Stage 5 Flying Modular Parts convergence with Mechanical Snap-Lock Overshoot!
      if (b5 === 1 && b5t < 0.94) {
        assembleLayer.setAttribute("opacity", "1");
        flyParts.forEach(({ sp, trail, piece }) => {
          if (b5t >= sp.t0 && b5t < sp.t1) {
            const rawU = clamp01((b5t - sp.t0) / (sp.t1 - sp.t0));
            // Snap-lock overshoot: arrives briskly, overshoots ~5% past socket, then snaps rigidly flush!
            const u = rawU < 0.84
              ? Math.pow(rawU / 0.84, 1.55) * 1.055
              : lerp(1.055, 1.0, (rawU - 0.84) / 0.16);
            const inv = 1 - u;
            const px = inv * inv * sp.sx + 2 * inv * u * sp.cx + u * u * sp.tx;
            const py = inv * inv * sp.sy + 2 * inv * u * sp.cy + u * u * sp.ty;
            const rot = sp.rot0 * (1 - clamp01(u));
            const fadeIn = clamp01(rawU * 4.5);
            piece.setAttribute("transform", `translate(${px.toFixed(1)}, ${py.toFixed(1)}) rotate(${rot.toFixed(1)})`);
            piece.setAttribute("opacity", fadeIn.toFixed(2));
            const prevU = Math.max(0, clamp01(u) - 0.22);
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
      if (lockSparkTimer > 0) {
        const gu = 1 - lockSparkTimer / 0.28;
        const shift = lerp(-9, 9, gu);
        lockGlint.setAttribute("transform", `translate(${shift.toFixed(1)}, ${(shift * 0.5).toFixed(1)})`);
        lockGlint.setAttribute("opacity", (Math.sin(gu * Math.PI) * 0.92).toFixed(2));
      } else {
        lockGlint.setAttribute("opacity", "0");
      }

      // Ambient Ground Bounce Light along timeline spine for Era 2 Vat, Era 4 Screen, Era 5 Gantry Ignition!
      if (b5 === 3 || (b5 === 4 && handoffTrailT < 0.65)) {
        const gOp = b5 === 3 ? clamp01(0.35 + jetPower * 0.58) : clamp01(1 - handoffTrailT / 0.65) * 0.65;
        groundBounceEl.setAttribute("cx", x5.toFixed(1));
        groundBounceEl.setAttribute("rx", ((28 + jetPower * 12) * S).toFixed(1));
        groundBounceEl.setAttribute("opacity", gOp.toFixed(2));
      } else if (b5 === 1) {
        groundBounceEl.setAttribute("cx", x5.toFixed(1));
        groundBounceEl.setAttribute("rx", (26 * S).toFixed(1));
        groundBounceEl.setAttribute("opacity", (0.28 + 0.35 * Math.sin(clamp01(b5t / 1.2) * Math.PI)).toFixed(2));
      } else if (b4 === 1 && (scanningTerminal || typingNow || taskDone)) {
        groundBounceEl.setAttribute("cx", x4.toFixed(1));
        groundBounceEl.setAttribute("rx", (22 * S).toFixed(1));
        groundBounceEl.setAttribute("opacity", "0.42");
      } else if (b2 === 1 && b2t < 1.38) {
        groundBounceEl.setAttribute("cx", x2.toFixed(1));
        groundBounceEl.setAttribute("rx", (20 * S).toFixed(1));
        groundBounceEl.setAttribute("opacity", (Math.sin(clamp01(b2t / 1.38) * Math.PI) * 0.52).toFixed(2));
      } else {
        groundBounceEl.setAttribute("opacity", "0");
      }

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
      // 5-GENERATION MECH EVOLUTION (Mark I -> Mark II -> Mark III -> Mark IV -> Mark V!)
      // Distinct proportions, permanent hardware upgrades & chassis silhouettes per era!
      // =================================================================
      const headW = hasBrain ? 1 : 0;              // CRT head physically docks from Era 2 Glass Vat!
      const kneeW = smooth(0.75, 1.25, evo);       // Articulated knees unfold in Era 2
      // Spiral Drill stays armed during Era 3 shatter beat, then stows immediately on Mark III's back pod during march!
      const wrenchW = hasWrench && b3 === 1 ? 1 : 0;
      const gogglesW = smooth(2.38, 2.66, evo);    // Era 4–5 Mark IV Precision Tactician unlocks cleanly entering Era 4!
      const isMk1 = !hasBrain;
      const isMk4 = gogglesW > 0.5;
      const keyW = hasBrain ? 0 : 1 - smooth(0.95, 1.22, evo); // Wind-up key fades as brain takes over!
      const edgeFade = handoffStarted || b5 === 4
        ? 0
        : b5 === 3
        ? (b5t > 0.64 ? 1 - smooth(1.05, 1.54, b5t) : 1)
        : (b0 === 0 ? 1 : smooth(0, 0.02, progress)) * (1 - smooth(0.96, 1, progress));

      // Smooth vertical step-up onto Era 5 architectural docking pad deck (stays continuous during in-gantry launch!)
      const onPadDist = Math.abs(drawX - x5) / S;
      const padStandY = (1 - smooth(10, 17, onPadDist)) * 3.5;

      // Distinct generation proportions:
      // Mark I (squat wide tin-box) -> Mark II (lean lab prototype) -> Mark III (sleek exo-tool mech) -> Mark IV (tall tactician) -> Mark V (heroic Gundam!)
      const legSeg = lerp(3.3, 7.3, smooth(0.2, 3.4, evo));
      const strideLen = lerp(5.8, 14.2, smooth(0.2, 3.6, evo));
      const torsoH = isMk1 ? 8.4 : (isMk4 ? 10.9 : (hasToolRig ? 10.2 : 10.0));
      const torsoW = isMk1 ? 12.6 : (isMk4 ? 8.4 : (hasToolRig ? 8.2 : 7.4));

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

      // Era 1 wind-up key + Mark I top red signal beacon + analog chest dial gauge needle!
      keyGroup.setAttribute("opacity", keyW.toFixed(2));
      rpaTopCap.setAttribute("opacity", isMk1 ? "1" : "0");
      mk1FrontDial.setAttribute("opacity", isMk1 ? "1" : "0");
      if (isMk1) {
        const woundPct = b0 === 0 ? clamp01(b0t / 0.96) : 1;
        const needleAng = lerp(-130, 55, woundPct) * (Math.PI / 180);
        mk1Needle.setAttribute("x2", (0.4 + Math.cos(needleAng) * 1.8).toFixed(1));
        mk1Needle.setAttribute("y2", (-4.3 + Math.sin(needleAng) * 1.8).toFixed(1));
        const lampOn = b0 >= 1 || (b0 === 0 && b0t > 0.72);
        mk1Lamp.setAttribute("fill", lampOn ? "#B83B2A" : "#EDE8DE");
      }
      if (keyW > 0.02) {
        const keyShudder = b1 === 1 ? Math.sin(b1t * 48) * 1.1 : 0;
        keyGroup.setAttribute("transform", `translate(${keyShudder.toFixed(1)}, ${hipY.toFixed(1)}) rotate(${leanDeg.toFixed(1)})`);
        // True 3D foreshortening of the twin-lobed brass butterfly wind-up wings as the spindle spins!
        const bowSY = 0.24 + 0.76 * Math.abs(Math.cos(keyPhase));
        keyBowG.setAttribute("transform", `translate(-10.8, -4.2) scale(1, ${bowSY.toFixed(3)})`);
      }
      stuckBang.setAttribute("opacity", b1 === 1 ? "0.95" : "0");

      // Legs: Era 1 jog/slide -> Era 2–5 articulated IK gait -> Era 3 bonk recoil stumble -> Heroic Iron Man flight pose
      const liftH = b1 === 0 ? 2.4 : lerp(0.5, 3.6, kneeW);
      const isFlying = b5 === 3 && launchLiftY > 2;
      const isBonkRecoil = b3 === 1 && b3t < 0.34;
      const bonkU = isBonkRecoil ? clamp01(b3t / 0.34) : 0;
      const isSymStance = armPose === "dock" || armPose === "launch";
      const f1 = isSliding
        ? { x: -1.8, y: -1.8, pitch: 0 }
        : isFlying
        ? { x: 2.9, y: 0.4, pitch: 0.24 }
        : isBonkRecoil
        ? { x: lerp(3.4, 1.8, bonkU), y: -Math.sin(bonkU * Math.PI) * 2.2, pitch: -0.22 }
        : isSymStance
        ? { x: 3.3, y: 0, pitch: 0 }
        : moveSpeed > 0
        ? footPose(phase, strideLen, liftH)
        : { x: 2.2, y: 0, pitch: 0 };
      const f2 = isSliding
        ? { x: -0.4, y: -1.2, pitch: 0 }
        : isFlying
        ? { x: -2.9, y: -2.2, pitch: 0.30 }
        : isBonkRecoil
        ? { x: lerp(-1.2, -3.6, bonkU), y: -Math.sin(Math.max(0, bonkU - 0.25) / 0.75 * Math.PI) * 1.6, pitch: 0.14 }
        : isSymStance
        ? { x: -3.3, y: 0, pitch: 0 }
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
      } else if (isSymStance) {
        // Era 5 Tall Heroic Front-Facing Symmetrical Hangar Stance (straight upright legs — ZERO crooked half-squat!)
        const hipR = 2.2;
        const hipL = -2.2;
        const footRy = f1.y - totalLift;
        const footLy = f2.y - totalLift;
        const k1 = { x: lerp(hipR, f1.x, 0.52) + 0.25, y: lerp(hipY + 0.6, footRy, 0.48) };
        const k2 = { x: lerp(hipL, f2.x, 0.52) - 0.25, y: lerp(hipY + 0.6, footLy, 0.48) };
        frontThigh.setAttribute("d", capsuleSegPath(hipR, hipY + 0.6, k1.x, k1.y, 1.32, 1.02));
        frontShin.setAttribute("d", capsuleSegPath(k1.x, k1.y, f1.x, footRy, 1.04, 0.86));
        frontShin.setAttribute("opacity", "1");
        backThigh.setAttribute("d", capsuleSegPath(hipL, hipY + 0.6, k2.x, k2.y, 1.32, 1.02));
        backShin.setAttribute("d", capsuleSegPath(k2.x, k2.y, f2.x, footLy, 1.04, 0.86));
        backShin.setAttribute("opacity", "1");
        frontFoot.setAttribute("d", capsuleFootPath(f1.x - 1.1, footRy, 2.6, 0));
        backFoot.setAttribute("d", capsuleFootPath(f2.x - 1.5, footLy, 2.6, 0));
        kneeJoint1.setAttribute("cx", k1.x.toFixed(1));
        kneeJoint1.setAttribute("cy", k1.y.toFixed(1));
        kneeJoint1.setAttribute("opacity", "1");
        kneeJoint2.setAttribute("cx", k2.x.toFixed(1));
        kneeJoint2.setAttribute("cy", k2.y.toFixed(1));
        kneeJoint2.setAttribute("opacity", "1");
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
      backLegGroup.setAttribute("opacity", isSymStance ? "1" : "0.78");
      backFoot.setAttribute("opacity", hasBoots ? "0" : (isSymStance ? "1" : "0.75"));
      frontFoot.setAttribute("opacity", hasBoots ? "0" : "1");

      // Torso (neck + sleek waist band + sculpted chassis with warm stone bevel + vents)
      const hw = torsoW * 0.5;
      const topW = lerp(hw * 0.90, hw * 0.98, smooth(0.8, 3.2, evo));
      pelvisEl.setAttribute("d", `M ${(-hw * 0.68).toFixed(1)},-0.1 L ${(hw * 0.68).toFixed(1)},-0.1 L ${(hw * 0.50).toFixed(1)},1.35 L ${(-hw * 0.50).toFixed(1)},1.35 Z`);
      torsoEl.setAttribute("d", `M ${(-hw).toFixed(1)},0 L ${hw.toFixed(1)},0 L ${topW.toFixed(1)},${(-torsoH + 1.0).toFixed(1)} Q ${topW.toFixed(1)},${(-torsoH).toFixed(1)} ${(topW - 1.0).toFixed(1)},${(-torsoH).toFixed(1)} L ${(-topW + 1.0).toFixed(1)},${(-torsoH).toFixed(1)} Q ${(-topW).toFixed(1)},${(-torsoH).toFixed(1)} ${(-topW).toFixed(1)},${(-torsoH + 1.0).toFixed(1)} Z`);
      torsoShade.setAttribute("d", `M ${(-hw + 0.5).toFixed(1)},-0.5 L ${(-hw * 0.35).toFixed(1)},-0.5 L ${(-topW * 0.35).toFixed(1)},${(-torsoH + 0.7).toFixed(1)} L ${(-topW + 0.6).toFixed(1)},${(-torsoH + 0.7).toFixed(1)} Z`);
      chestPanel.setAttribute("d", `M ${(-hw * 0.42).toFixed(1)},${(-torsoH * 0.66).toFixed(1)} L ${(hw * 0.42).toFixed(1)},${(-torsoH * 0.66).toFixed(1)} M ${(-hw * 0.32).toFixed(1)},${(-torsoH * 0.42).toFixed(1)} L ${(hw * 0.24).toFixed(1)},${(-torsoH * 0.42).toFixed(1)}`);
      // Distinct 5-Generation Torso Overlays (Mark I Dial -> Mark II Prototype -> Mark III Industrial Rig -> Mark IV Tactician -> Mark V Gundam!)
      const showMk2 = hasBrain && !hasToolRig && !isMk4 && !hasTorsoArmor;
      const showMk3 = hasToolRig && !isMk4 && !hasTorsoArmor;
      const showMk4 = isMk4 && !hasTorsoArmor;
      mk2ProtoEl.setAttribute("opacity", showMk2 ? "1" : "0");
      if (showMk2) {
        const m2Breath = 0.55 + 0.45 * Math.sin(now * 0.008);
        mk2PulseBar.setAttribute("opacity", m2Breath.toFixed(2));
        mk2CoreAura.setAttribute("opacity", (0.25 + m2Breath * 0.45).toFixed(2));
      }
      mk3RigEl.setAttribute("opacity", showMk3 ? "1" : "0");
      mk3BackEl.setAttribute("opacity", showMk3 ? "1" : "0");
      mk3StowedDrill.setAttribute("opacity", showMk3 && wallBroken && wrenchW < 0.25 ? "1" : "0");
      mk4TactEl.setAttribute("opacity", showMk4 ? "1" : "0");
      // Mark IV compute backpack shows cleanly in side profile (zero wings before Stage 5!)
      mk4BackEl.setAttribute("opacity", showMk4 && !isSymStance ? "1" : "0");
      if (showMk4) {
        const s1Lit = b4 >= 1 || taskDone;
        const s2Lit = (b4 === 1 && b4t >= 0.38) || taskDone;
        const s3Lit = taskDone;
        mk4Led1.setAttribute("opacity", s1Lit ? "1" : "0.4");
        mk4Led2.setAttribute("opacity", s2Lit ? "1" : "0.25");
        mk4Led3.setAttribute("opacity", s3Lit ? "1" : "0.2");
      }
      chestPanel.setAttribute("opacity", "0");
      chestLed.setAttribute("opacity", "0");
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

      // Modular Hardcore Wing-Binder Pack + Layered Shoulder Pauldrons + Skirt Armor + Hexagonal Bamboo Arc Core!
      jetpackEl.setAttribute("opacity", hasTorsoArmor ? "1" : "0");
      shoulderArmorEl.setAttribute("opacity", hasTorsoArmor ? "1" : "0");
      skirtArmorEl.setAttribute("opacity", hasTorsoArmor ? "1" : "0");
      harnessGroup.setAttribute("opacity", hasTorsoArmor ? "1" : "0");
      if (hasTorsoArmor) {
        // Symmetrical twin wing-binders are clearly visible on lock-in, then flare to full 100% span on ignition!
        const wingFan = b5 === 3 ? smooth(0.05, 0.56, b5t) : 0;
        const ws = lerp(0.78, 1.0, wingFan);
        const wRot = lerp(16, 0, wingFan);
        groundWingL.setAttribute("transform", `translate(-4.2, -8.4) scale(${ws.toFixed(3)}, ${ws.toFixed(3)}) rotate(${(-wRot).toFixed(1)}) translate(4.2, 8.4)`);
        groundWingR.setAttribute("transform", `translate(4.2, -8.4) scale(${ws.toFixed(3)}, ${ws.toFixed(3)}) rotate(${wRot.toFixed(1)}) translate(-4.2, 8.4)`);
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
        harnessHexG.setAttribute("transform", `translate(0, ${cy})`);
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
      // Heroic upward sky-gaze right after 8-piece armor lock-in and throughout liftoff!
      const launchLookUp = (b5 === 3 && launchLiftY > 1) || (b5 === 1 && b5t >= 0.98) ? -9 : 0;
      headGroup.setAttribute("transform", `translate(${headX.toFixed(2)}, ${headY.toFixed(2)}) scale(${hScale.toFixed(3)}) rotate(${(walkTilt + headNodDeg + launchLookUp).toFixed(1)})`);

      // Distinct Head Silhouette Evolution: Mark II-III Heatsink Fins -> Mark IV Aerodynamic Ear-Wing -> Mark V Symmetric Front Head!
      const isMk5Head = armPose === "dock" || armPose === "launch" || hasHeadCrest;
      mk2HeadFins.setAttribute("opacity", headW > 0.5 && !isMk4 ? "1" : "0");
      crtEarsEl.setAttribute("opacity", !isMk4 || isMk5Head ? "1" : "0");
      mk4EarWings.setAttribute("opacity", isMk4 && !isMk5Head ? "1" : "0");
      // Center antenna cleanly flush on crown above V-Fin emerald gem in Mark V front stance!
      if (isMk5Head) {
        antGroup.setAttribute("transform", `translate(1.4, -0.4) rotate(${(Math.sin(phase * Math.PI * 2) * 3).toFixed(1)}, -0.8, -5.0)`);
      } else {
        antGroup.setAttribute("transform", `rotate(${(Math.sin(phase * Math.PI * 2) * 5).toFixed(1)}, -0.8, -5.0)`);
      }
      // Era 2->3 carryover: gentle thinking pulse on antenna tip while striding with newly docked brain!
      const brainPulse = b2 === 2 && b3 === 0 && Math.sin(now * 0.0085) > 0.15;
      antTip.setAttribute("fill", hasHeadCrest || reasoningNow || epiphanyNow || awakeNow ? "#2D6A47" : (brainPulse ? "#6BC492" : "#FAF8F4"));
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

      // Era 4-5 dual-optic visor + typing eye-darting + happy victory ^ ^ smile arcs (centers symmetrically in Mark V!)
      const showHappy = useGoggles && ((b4 === 1 && taskDone && b4t >= 1.12 && b4t < 1.54) || happyCarryTimer > 0);
      const visorShiftX = isMk5Head ? -1.5 : 0;
      gogglesEl.setAttribute("opacity", gogglesW.toFixed(2));
      gogglesEl.setAttribute("transform", visorShiftX ? `translate(${visorShiftX}, 0)` : "");
      visorGlint2.setAttribute("opacity", useGoggles ? "1" : "0");
      visorGlint2.setAttribute("transform", visorShiftX ? `translate(${visorShiftX}, 0)` : "");
      goggleHappy.setAttribute("opacity", showHappy ? "1" : "0");
      goggleEye.setAttribute("opacity", useGoggles && !isBlinking && !showHappy ? "1" : "0");
      if (typingNow) {
        const lookScreen = Math.sin(b4t * 16) > 0;
        goggleEye.setAttribute("transform", lookScreen ? "translate(0.35, -0.35)" : "translate(0.15, 0.55)");
      } else if (visorShiftX) {
        goggleEye.setAttribute("transform", `translate(${visorShiftX}, 0)`);
      } else {
        goggleEye.removeAttribute("transform");
      }
      const twinEyeFill = freezeAll || scanningTerminal || hasHeadCrest ? "#B5F5D4" : "#FAF8F4";
      gEyeL.setAttribute("fill", twinEyeFill);
      gEyeR.setAttribute("fill", twinEyeFill);

      // Articulated 2-segment Arms & Props (Pincer / CoT Chin / Forehead Bonk / Wrench / Gate Press / Suit-Up / Launch)
      const swing = moveSpeed > 0 ? Math.sin(phase * Math.PI * 2) * lerp(1.6, 5.4, kneeW) : 0;
      const armLen = lerp(5.8, 8.8, smooth(0.4, 3.4, evo));
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
        // Era 2 Awakening: curiously raises & waves hands slightly while looking down at newly acquired body!
        const handWave = Math.sin((b2t - 0.72) * 26) * 1.4;
        fHX = fSX + 5.4;
        fHY = fSY + 1.8 + handWave;
        bHX = bSX + 3.0;
        bHY = bSY + 2.8 - handWave * 0.7;
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
        fHX = fSX + 7.4;
        fHY = -12.4;
        bHX = bSX - 2.0;
        bHY = bSY + 5.6;
        fBend = 0.45;
      } else if (armPose === "wrench") {
        // Era 3: extends right forearm cleanly forward -> crisp celebratory upward drill-lift on shatter!
        const triumphRaise = b3 === 1 && b3t >= 1.56 ? 2.6 : 0;
        fHX = fSX + 4.3;
        fHY = -13.6 - triumphRaise;
        bHX = bSX - 2.4;
        bHY = bSY + 5.8;
        fBend = -0.38;
      } else if (armPose === "scan") {
        // Era 4: poised alert stance while dual-optic visor scans big desktop monitor
        fHX = fSX + 3.6;
        fHY = fSY + 5.6;
        bHX = bSX - 2.0;
        bHY = bSY + 6.2;
        fBend = 0.5;
      } else if (armPose === "type") {
        // Era 4: BOTH hands hover dead-center over angled keyboard keys rapidly alternating keystrokes (哒哒哒)!
        const tapL = freezeAll ? 0 : Math.sin(b4t * 42) * 1.35;
        const tapR = freezeAll ? 0 : -Math.sin(b4t * 42) * 1.35;
        fHX = fSX + 9.2;
        fHY = -13.4 + tapR;
        bHX = bSX + 8.6;
        bHY = -13.4 + tapL;
        fBend = 0.72;
        bBend = 0.72;
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
      shoulderPin.setAttribute("opacity", hasTorsoArmor || isSymStance ? "0" : "1");

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

      // Mark III Heavy Gunmetal Exoskeleton Forearm Quick-Connect Socket (persists after toolbox pickup until Mark IV!)
      mk3ArmCuff.setAttribute("opacity", hasToolRig && !isMk4 && !hasGauntlets ? "1" : "0");
      if (hasToolRig && !isMk4 && !hasGauntlets) {
        mk3ArmCuff.setAttribute("transform", `translate(${fHX.toFixed(1)}, ${fHY.toFixed(1)})`);
      }

      // Era 3 Big Spiral Mechanical Drill attached to right forearm (spins flutes during drilling!)
      drillGroup.setAttribute("opacity", wrenchW.toFixed(2));
      if (wrenchW > 0.02) {
        drillGroup.setAttribute("transform", `translate(${fHX.toFixed(1)}, ${fHY.toFixed(1)})`);
        const spinShift = drillingNow ? Math.sin(b3t * 70) * 0.6 : 0;
        drillFlutes.setAttribute("d", `M ${(4.0 + spinShift).toFixed(1)},-1.7 L ${(4.7 + spinShift).toFixed(1)},1.7 M ${(5.9 + spinShift * 0.7).toFixed(1)},-1.0 L ${(6.4 + spinShift * 0.7).toFixed(1)},1.0`);
      }

      // Era 5 Iron Man luminous gradient palm repulsor plumes + symmetric twin wing-binder & boot thrusters!
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
        // Symmetric twin wing-binder vernier plumes (left & right!)
        const pY = hipY - 6.8;
        const pLen = (4.2 + jetPower * 8.2) * flick;
        packJetL.setAttribute("d", `M -8.6,${pY.toFixed(1)} L -6.0,${pY.toFixed(1)} L -7.8,${(pY + pLen).toFixed(1)} Z`);
        packJetR.setAttribute("d", `M 6.0,${pY.toFixed(1)} L 8.6,${pY.toFixed(1)} L 7.8,${(pY + pLen).toFixed(1)} Z`);
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

  return { summonWalkerAtEra };
}
