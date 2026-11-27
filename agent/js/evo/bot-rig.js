import { mk } from "../core/utils.js";

/**
 * Builds the 5-generation evolving ink-art robot SVG rig (Mark I -> Mark V),
 * sculpted brass butterfly wind-up key, flying modular armor parts, and thruster VFX.
 */
export function buildBotRig({ svg }) {
  // =====================================================================
  // LAYER 2: THE 5-GENERATION EVOLVING MECH (Mark I -> Mark II -> Mark III -> Mark IV -> Mark V!)
  // =====================================================================
  const botGroup = mk("g", { class: "evo-bot-hit" }, svg);
  mk("rect", { x: "-17", y: "-40", width: "34", height: "42", fill: "transparent" }, botGroup);

  const shadowEl = mk("ellipse", { cx: "0", cy: "0.4", rx: "6.8", ry: "1.35", fill: "#1D1B18", "fill-opacity": "0.14" }, botGroup);

  // Stage 1 Vermilion trip `!` burst (raised cleanly above tumbling chassis with zero overlap!)
  const stuckBang = mk("g", { opacity: "0" }, botGroup);
  mk("line", { x1: "2.2", y1: "-31.5", x2: "2.2", y2: "-26.2", stroke: "#B83B2A", "stroke-width": "1.65", "stroke-linecap": "round" }, stuckBang);
  mk("circle", { cx: "2.2", cy: "-23.9", r: "1.05", fill: "#B83B2A" }, stuckBang);

  // Rotatable body wrapper (enables clean belly-slide & recovery)
  const botBody = mk("g", null, botGroup);

  // Stage 1: Sculpted Antique Brass Butterfly Clockwork Wind-Up Key (with stepped socket, spindle & 3D spinning twin wings!)
  const keyGroup = mk("g", { opacity: "1" }, botBody);
  mk("rect", { x: "-6.6", y: "-5.5", width: "1.6", height: "2.6", rx: "0.45", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.78" }, keyGroup);
  mk("rect", { x: "-9.9", y: "-4.85", width: "3.4", height: "1.3", rx: "0.45", fill: "url(#evo-brass)", stroke: "#1D1B18", "stroke-width": "0.8" }, keyGroup);
  const keyBowG = mk("g", { transform: "translate(-10.8, -4.2)" }, keyGroup);
  // Twin sculpted butterfly-wing lobes (upper + lower) with classic clockwork cutouts!
  mk("path", {
    d: "M -0.8,-0.6 C -2.8,-1.8 -3.0,-4.6 -0.2,-4.7 C 2.0,-4.7 2.2,-2.2 0.7,-0.6 C 2.2,1.0 2.0,3.5 -0.2,3.5 C -3.0,3.4 -2.8,0.6 -0.8,-0.6 Z",
    transform: "translate(0, 0.6)",
    fill: "url(#evo-brass)", stroke: "#1D1B18", "stroke-width": "0.88", "stroke-linejoin": "round"
  }, keyBowG);
  mk("ellipse", { cx: "-0.3", cy: "-2.15", rx: "0.88", ry: "1.02", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.65" }, keyBowG);
  mk("ellipse", { cx: "-0.3", cy: "2.15", rx: "0.88", ry: "1.02", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.65" }, keyBowG);
  mk("circle", { cx: "0.1", cy: "0", r: "0.85", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.55" }, keyBowG);

  // Back volumetric mechanical leg (thigh + shin + knee joint) + capsule foot + Stage 5 back boot + back volumetric arm
  const backLegGroup = mk("g", { opacity: "0.82" }, botBody);
  const backThigh = mk("path", { fill: "url(#evo-porcelain-back)", stroke: "#1D1B18", "stroke-width": "0.78", "stroke-linejoin": "round" }, backLegGroup);
  const backShin = mk("path", { fill: "url(#evo-porcelain-back)", stroke: "#1D1B18", "stroke-width": "0.78", "stroke-linejoin": "round" }, backLegGroup);
  const kneeJoint2 = mk("circle", { r: "1.02", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.68", opacity: "0" }, backLegGroup);
  const backFoot = mk("path", { fill: "url(#evo-porcelain-back)", stroke: "#1D1B18", "stroke-width": "0.85", "stroke-linejoin": "round" }, botBody);
  const bootB = mk("g", { opacity: "0" }, botBody);
  mk("path", { d: "M -1.9,-4.3 L 1.7,-4.3 L 2.5,0 L -2.2,0 Z", fill: "url(#evo-porcelain-back)", stroke: "#1D1B18", "stroke-width": "0.82", "stroke-linejoin": "round" }, bootB);
  mk("polygon", { points: "-1.5,-5.2 1.3,-5.2 1.0,-3.4 -0.1,-2.9 -1.2,-3.4", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.62", "stroke-linejoin": "round" }, bootB);
  const backArmGroup = mk("g", { opacity: "0.80" }, botBody);
  const backUpperArm = mk("path", { fill: "url(#evo-porcelain-back)", stroke: "#1D1B18", "stroke-width": "0.76", "stroke-linejoin": "round" }, backArmGroup);
  const backForeArm = mk("path", { fill: "url(#evo-porcelain-back)", stroke: "#1D1B18", "stroke-width": "0.76", "stroke-linejoin": "round" }, backArmGroup);
  const elbowJointB = mk("circle", { r: "0.82", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.65", opacity: "0" }, backArmGroup);
  const gauntletB = mk("g", { opacity: "0" }, botBody);
  mk("path", { d: "M -2.2,-2.2 L 2.2,-2.2 L 1.8,1.3 L -1.8,1.3 Z", fill: "url(#evo-porcelain-back)", stroke: "#1D1B18", "stroke-width": "0.82", "stroke-linejoin": "round" }, gauntletB);
  mk("line", { x1: "-1.1", y1: "-0.6", x2: "1.1", y2: "-0.6", stroke: "#2D6A47", "stroke-width": "0.72", "stroke-linecap": "round" }, gauntletB);

  // Torso group (neck + pelvis + sculpted chassis with warm stone bevel + Stage 5 Hardcore Tactical Armor!)
  const torsoGroup = mk("g", null, botBody);
  // Stage 5: Hardcore Twin Wing-Binder Back Pack (unfolds cleanly outward on ignition!)
  const jetpackEl = mk("g", { opacity: "0" }, torsoGroup);
  const groundWingL = mk("g", null, jetpackEl);
  mk("path", { d: "M -4.2,-9.2 L -11.4,-13.0 L -12.4,-11.2 L -10.2,-7.6 L -5.6,-6.8 L -4.2,-7.2 Z", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.85", "stroke-linejoin": "round" }, groundWingL);
  mk("polygon", { points: "-5.4,-9.1 -10.8,-11.8 -10.1,-10.2 -5.5,-8.0", fill: "#2B2825" }, groundWingL);
  mk("line", { x1: "-6.0", y1: "-8.8", x2: "-10.1", y2: "-10.9", stroke: "#5CE09B", "stroke-width": "0.72", "stroke-linecap": "round" }, groundWingL);
  const groundWingR = mk("g", null, jetpackEl);
  mk("path", { d: "M 4.2,-9.2 L 11.4,-13.0 L 12.4,-11.2 L 10.2,-7.6 L 5.6,-6.8 L 4.2,-7.2 Z", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.85", "stroke-linejoin": "round" }, groundWingR);
  mk("polygon", { points: "5.4,-9.1 10.8,-11.8 10.1,-10.2 5.5,-8.0", fill: "#2B2825" }, groundWingR);
  mk("line", { x1: "6.0", y1: "-8.8", x2: "10.1", y2: "-10.9", stroke: "#5CE09B", "stroke-width": "0.72", "stroke-linecap": "round" }, groundWingR);
  mk("rect", { x: "-3.6", y: "-9.8", width: "7.2", height: "6.8", rx: "0.9", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.8" }, jetpackEl);
  // Stage 1: Mark I Vintage Riveted Tin-Box Top Beacon (fades as Mark II wakes!)
  const rpaTopCap = mk("g", { opacity: "1" }, torsoGroup);
  mk("rect", { x: "-5.2", y: "-9.5", width: "10.4", height: "1.6", rx: "0.55", fill: "#E4DDD0", stroke: "#1D1B18", "stroke-width": "0.95" }, rpaTopCap);
  const mk1Lamp = mk("circle", { cx: "0", cy: "-10.5", r: "1.35", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.85" }, rpaTopCap);
  // Mark III Sculpted 2.5D Hydraulic Tool Power-Pack (drawn BEHIND torsoEl!)
  const mk3BackEl = mk("g", { opacity: "0" }, torsoGroup);
  mk("path", { d: "M -3.6,-9.6 L -7.4,-8.8 L -7.8,-2.8 L -3.8,-2.2 Z", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.82", "stroke-linejoin": "round" }, mk3BackEl);
  mk("path", { d: "M -4.3,-8.6 L -6.7,-8.0 L -6.9,-4.0 L -4.3,-3.6 Z", fill: "url(#evo-porcelain)", stroke: "#1D1B18", "stroke-width": "0.62", "stroke-linejoin": "round" }, mk3BackEl);
  mk("line", { x1: "-5.6", y1: "-7.2", x2: "-5.6", y2: "-4.8", stroke: "#5CE09B", "stroke-width": "0.75", "stroke-linecap": "round" }, mk3BackEl);
  // Stowed Spiral Drill docked cleanly at an aerodynamic angle on the rear power-pack cradle!
  const mk3StowedDrill = mk("g", { opacity: "0", transform: "translate(-5.6, -9.2) rotate(-18)" }, mk3BackEl);
  mk("rect", { x: "-1.5", y: "-1.2", width: "3.0", height: "1.8", rx: "0.4", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.68" }, mk3StowedDrill);
  mk("polygon", { points: "-1.3,-1.2 0,-6.4 1.3,-1.2", fill: "url(#evo-porcelain)", stroke: "#1D1B18", "stroke-width": "0.78", "stroke-linejoin": "round" }, mk3StowedDrill);
  mk("line", { x1: "-0.7", y1: "-2.7", x2: "0.7", y2: "-3.3", stroke: "#2D6A47", "stroke-width": "0.75", "stroke-linecap": "round" }, mk3StowedDrill);
  // Mark IV Compact Dual-Layer State-Machine Compute Backpack (NO WINGS — keeps wings 100% exclusive to Stage 5 Mark V!)
  const mk4BackEl = mk("g", { opacity: "0" }, torsoGroup);
  mk("rect", { x: "-7.2", y: "-9.8", width: "3.8", height: "7.6", rx: "0.75", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.82" }, mk4BackEl);
  mk("rect", { x: "-6.6", y: "-8.9", width: "2.3", height: "5.8", rx: "0.4", fill: "url(#evo-porcelain)", stroke: "#1D1B18", "stroke-width": "0.55" }, mk4BackEl);
  mk("line", { x1: "-5.5", y1: "-7.6", x2: "-5.5", y2: "-4.4", stroke: "#2D6A47", "stroke-width": "0.9", "stroke-dasharray": "1.2 1.0", "stroke-linecap": "round" }, mk4BackEl);
  // Tiny folded telemetry antenna mast on top of compute pack
  mk("line", { x1: "-5.6", y1: "-9.8", x2: "-6.4", y2: "-13.4", stroke: "#1D1B18", "stroke-width": "0.95", "stroke-linecap": "round" }, mk4BackEl);
  mk("circle", { cx: "-6.5", cy: "-13.9", r: "0.75", fill: "#5CE09B", stroke: "#1D1B18", "stroke-width": "0.55" }, mk4BackEl);
  // Mechanical neck collar connecting torso to CRT head
  const neckEl = mk("g", { opacity: "0" }, torsoGroup);
  mk("rect", { x: "-1.9", y: "-12.2", width: "3.8", height: "2.4", rx: "0.6", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.85" }, neckEl);
  mk("line", { x1: "-1.4", y1: "-11.0", x2: "1.4", y2: "-11.0", stroke: "#FAF8F4", "stroke-width": "0.55", "stroke-opacity": "0.45" }, neckEl);
  // Sleek mechanical waist / hip band (grounds IK legs cleanly without crowding knees)
  const pelvisEl = mk("path", { fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.95", "stroke-linejoin": "round" }, torsoGroup);
  // Stage 5: 3-Piece Hardcore Mech Skirt Armor (left/right tassets + gunmetal center codpiece)
  const skirtArmorEl = mk("g", { opacity: "0" }, torsoGroup);
  mk("polygon", { points: "-4.6,-0.3 -1.6,-0.3 -2.0,2.2 -4.9,1.6", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.8", "stroke-linejoin": "round" }, skirtArmorEl);
  mk("polygon", { points: "1.6,-0.3 4.6,-0.3 4.9,1.6 2.0,2.2", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.8", "stroke-linejoin": "round" }, skirtArmorEl);
  mk("polygon", { points: "-1.7,-0.5 1.7,-0.5 1.3,2.4 0,2.9 -1.3,2.4", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.8", "stroke-linejoin": "round" }, skirtArmorEl);
  mk("line", { x1: "0", y1: "0.1", x2: "0", y2: "2.1", stroke: "#5CE09B", "stroke-width": "0.62", "stroke-linecap": "round" }, skirtArmorEl);
  // Sculpted main chassis torso + porcelain gradient & subtle warm stone bevel
  const torsoEl = mk("path", { fill: "url(#evo-porcelain)", stroke: "#1D1B18", "stroke-width": "1.02", "stroke-linejoin": "round" }, torsoGroup);
  const torsoShade = mk("path", { fill: "#E4DDD0", "fill-opacity": "0.52" }, torsoGroup);
  const chestPanel = mk("path", { fill: "none", stroke: "#1D1B18", "stroke-width": "0.72", "stroke-opacity": "0.48", "stroke-linecap": "round" }, torsoGroup);
  const chestLed = mk("circle", { cx: "1.6", cy: "-5.2", r: "0.8", fill: "#2D6A47", opacity: "0" }, torsoGroup);
  // --- FOREGROUND GENERATION CHEST OVERLAYS (Drawn ON TOP of torsoEl so 100% crisp & unmistakable!) ---
  // Mark I Front Riveted Tin-Box Dial Gauge Plate (Era 1)
  const mk1FrontDial = mk("g", { opacity: "1" }, torsoGroup);
  mk("rect", { x: "-5.1", y: "-7.3", width: "10.2", height: "6.0", rx: "0.8", fill: "#E4DDD0", "fill-opacity": "0.78", stroke: "#1D1B18", "stroke-width": "0.72" }, mk1FrontDial);
  mk("circle", { cx: "-4.0", cy: "-6.2", r: "0.45", fill: "#1D1B18" }, mk1FrontDial);
  mk("circle", { cx: "4.0", cy: "-6.2", r: "0.45", fill: "#1D1B18" }, mk1FrontDial);
  mk("circle", { cx: "-4.0", cy: "-2.4", r: "0.45", fill: "#1D1B18" }, mk1FrontDial);
  mk("circle", { cx: "4.0", cy: "-2.4", r: "0.45", fill: "#1D1B18" }, mk1FrontDial);
  mk("circle", { cx: "0.5", cy: "-4.3", r: "2.35", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.82" }, mk1FrontDial);
  // Vintage analog gauge tick marks inside dial
  mk("path", { d: "M 0.5,-6.2 L 0.5,-5.7 M -1.2,-4.3 L -0.7,-4.3 M 2.2,-4.3 L 1.7,-4.3", fill: "none", stroke: "#1D1B18", "stroke-width": "0.48", "stroke-linecap": "round" }, mk1FrontDial);
  const mk1Needle = mk("line", { x1: "0.5", y1: "-4.3", x2: "-0.8", y2: "-5.6", stroke: "#B83B2A", "stroke-width": "1.0", "stroke-linecap": "round" }, mk1FrontDial);
  mk("circle", { cx: "0.5", cy: "-4.3", r: "0.55", fill: "#1D1B18" }, mk1FrontDial);
  // Mark II Lab Prototype Skeletal Collar & Glowing Vertical Neural Bar (with soft breathing aura!)
  const mk2ProtoEl = mk("g", { opacity: "0" }, torsoGroup);
  mk("path", { d: "M -3.9,-10.0 L 3.9,-10.0 L 3.1,-7.8 L -3.1,-7.8 Z", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.65", "stroke-linejoin": "round" }, mk2ProtoEl);
  const mk2CoreAura = mk("ellipse", { cx: "0", cy: "-4.6", rx: "2.8", ry: "3.4", fill: "url(#evo-arc-glow)", opacity: "0.45" }, mk2ProtoEl);
  mk("rect", { x: "-1.3", y: "-7.2", width: "2.6", height: "5.2", rx: "0.9", fill: "#1D1B18" }, mk2ProtoEl);
  const mk2PulseBar = mk("rect", { x: "-0.65", y: "-6.4", width: "1.3", height: "3.6", rx: "0.5", fill: "#5CE09B" }, mk2ProtoEl);
  // Mark III Sleek Industrial Exo-Collar & Dual-Cell Power Core (replaces bulky apron — crisp ceramic+gunmetal mech!)
  const mk3RigEl = mk("g", { opacity: "0" }, torsoGroup);
  mk("path", { d: "M -3.9,-10.2 L 3.9,-10.2 L 4.4,-8.2 L 2.2,-7.6 L -2.2,-7.6 L -4.4,-8.2 Z", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.7", "stroke-linejoin": "round" }, mk3RigEl);
  mk("line", { x1: "-2.6", y1: "-9.3", x2: "2.6", y2: "-9.3", stroke: "#FAF8F4", "stroke-width": "0.55", "stroke-opacity": "0.55", "stroke-linecap": "round" }, mk3RigEl);
  // Flush recessed dual-cell bamboo high-torque power core (natural evolution from Mark II's single neural bar!)
  mk("path", { d: "M -2.2,-6.8 L 2.2,-6.8 L 2.6,-5.8 L 2.2,-2.8 L -2.2,-2.8 L -2.6,-5.8 Z", fill: "#1D1B18", stroke: "#1D1B18", "stroke-width": "0.6" }, mk3RigEl);
  mk("rect", { x: "-1.5", y: "-6.0", width: "1.1", height: "2.5", rx: "0.35", fill: "#5CE09B" }, mk3RigEl);
  mk("rect", { x: "0.4", y: "-6.0", width: "1.1", height: "2.5", rx: "0.35", fill: "#5CE09B" }, mk3RigEl);
  // Slim gunmetal hydraulic waist belt with center latch rivet
  mk("rect", { x: "-3.8", y: "-1.5", width: "7.6", height: "1.15", rx: "0.35", fill: "#2B2825" }, mk3RigEl);
  mk("circle", { cx: "0", cy: "-0.92", r: "0.42", fill: "#E4DDD0" }, mk3RigEl);
  // Mark IV Precision Tactician Collar Yoke & 3-LED State-Machine Chest Bar (Era 4)
  const mk4TactEl = mk("g", { opacity: "0" }, torsoGroup);
  mk("path", { d: "M -4.6,-10.9 L 4.6,-10.9 L 3.7,-8.4 L -3.7,-8.4 Z", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.7", "stroke-linejoin": "round" }, mk4TactEl);
  mk("rect", { x: "-3.5", y: "-7.0", width: "7.0", height: "3.0", rx: "1.0", fill: "#1D1B18" }, mk4TactEl);
  const mk4Led1 = mk("circle", { cx: "-1.9", cy: "-5.5", r: "0.78", fill: "#5CE09B" }, mk4TactEl);
  const mk4Led2 = mk("circle", { cx: "0.0", cy: "-5.5", r: "0.78", fill: "#5CE09B", opacity: "0.35" }, mk4TactEl);
  const mk4Led3 = mk("circle", { cx: "1.9", cy: "-5.5", r: "0.78", fill: "#5CE09B", opacity: "0.2" }, mk4TactEl);
  // Stage 5: Hardcore Layered Angular Shoulder Pauldrons + High Collar + Chest Vents!
  const shoulderArmorEl = mk("g", { opacity: "0" }, torsoGroup);
  mk("path", { d: "M -4.2,-10.6 L -7.6,-11.4 L -8.6,-8.8 L -7.2,-7.0 L -4.4,-7.6 Z", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.9", "stroke-linejoin": "round" }, shoulderArmorEl);
  mk("polygon", { points: "-7.4,-10.8 -8.2,-8.9 -7.1,-7.4 -6.4,-7.8 -7.0,-9.2", fill: "#2B2825" }, shoulderArmorEl);
  mk("path", { d: "M 4.2,-10.6 L 7.6,-11.4 L 8.6,-8.8 L 7.2,-7.0 L 4.4,-7.6 Z", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.9", "stroke-linejoin": "round" }, shoulderArmorEl);
  mk("polygon", { points: "7.4,-10.8 8.2,-8.9 7.1,-7.4 6.4,-7.8 7.0,-9.2", fill: "#2B2825" }, shoulderArmorEl);
  mk("line", { x1: "-5.2", y1: "-9.9", x2: "-7.1", y2: "-10.3", stroke: "#2D6A47", "stroke-width": "0.7", "stroke-linecap": "round" }, shoulderArmorEl);
  mk("line", { x1: "5.2", y1: "-9.9", x2: "7.1", y2: "-10.3", stroke: "#2D6A47", "stroke-width": "0.7", "stroke-linecap": "round" }, shoulderArmorEl);
  mk("polygon", { points: "-4.1,-8.4 -2.2,-8.0 -2.2,-6.7 -3.9,-7.1", fill: "#2B2825" }, shoulderArmorEl);
  mk("polygon", { points: "4.1,-8.4 2.2,-8.0 2.2,-6.7 3.9,-7.1", fill: "#2B2825" }, shoulderArmorEl);
  // Stage 5: Hardcore Hexagonal Bamboo Arc Reactor Core + Double Lock Ripple!
  const harnessGroup = mk("g", { opacity: "0" }, torsoGroup);
  const harnessX1 = mk("line", { stroke: "#1D1B18", "stroke-width": "0.75", "stroke-opacity": "0.52", "stroke-linecap": "round" }, harnessGroup);
  const harnessX2 = mk("line", { stroke: "#1D1B18", "stroke-width": "0.75", "stroke-opacity": "0.52", "stroke-linecap": "round" }, harnessGroup);
  const harnessGlow = mk("circle", { r: "5.4", fill: "url(#evo-arc-glow)" }, harnessGroup);
  const harnessHexG = mk("g", null, harnessGroup);
  mk("polygon", { points: "0,-2.4 2.2,-1.2 2.2,1.2 0,2.4 -2.2,1.2 -2.2,-1.2", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.75", "stroke-linejoin": "round" }, harnessHexG);
  mk("polygon", { points: "0,-1.55 1.4,-0.78 1.4,0.78 0,1.55 -1.4,0.78 -1.4,-0.78", fill: "#2D6A47" }, harnessHexG);
  mk("circle", { cx: "-0.4", cy: "-0.45", r: "0.45", fill: "#EBFFF3", "fill-opacity": "0.92" }, harnessHexG);
  const harnessRipple = mk("circle", { r: "2", fill: "none", stroke: "#2D6A47", "stroke-width": "1.05", opacity: "0" }, harnessGroup);
  const harnessRipple2 = mk("circle", { r: "2", fill: "none", stroke: "#1D1B18", "stroke-width": "0.75", opacity: "0" }, harnessGroup);

  // Front volumetric mechanical leg (porcelain gradient + dark knee joint + Stage 5 heavy greave boot!)
  const frontThigh = mk("path", { fill: "url(#evo-porcelain)", stroke: "#1D1B18", "stroke-width": "0.84", "stroke-linejoin": "round" }, botBody);
  const frontShin = mk("path", { fill: "url(#evo-porcelain)", stroke: "#1D1B18", "stroke-width": "0.84", "stroke-linejoin": "round" }, botBody);
  const frontFoot = mk("path", { fill: "url(#evo-porcelain)", stroke: "#1D1B18", "stroke-width": "0.90", "stroke-linejoin": "round" }, botBody);
  const kneeJoint1 = mk("circle", { r: "1.08", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.70", opacity: "0" }, botBody);
  const bootF = mk("g", { opacity: "0" }, botBody);
  mk("path", { d: "M -1.9,-4.5 L 1.9,-4.5 L 2.9,0 L -2.2,0 Z", fill: "url(#evo-porcelain)", stroke: "#1D1B18", "stroke-width": "0.86", "stroke-linejoin": "round" }, bootF);
  mk("polygon", { points: "-1.5,-5.5 1.5,-5.5 1.2,-3.5 0,-3.0 -1.2,-3.5", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.65", "stroke-linejoin": "round" }, bootF);
  mk("line", { x1: "-0.7", y1: "-4.6", x2: "0.7", y2: "-4.6", stroke: "#5CE09B", "stroke-width": "0.6", "stroke-linecap": "round" }, bootF);

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
  // Mark II–III Raw Rear Neural Heatsink Fins behind CRT Head (visibly distinguishes prototype era!)
  const mk2HeadFins = mk("g", { opacity: "0" }, headGroup);
  mk("path", { d: "M -5.8,-3.4 L -8.2,-4.0 M -5.8,-1.4 L -8.5,-1.6 M -5.8,0.6 L -8.0,1.0", fill: "none", stroke: "#2B2825", "stroke-width": "1.1", "stroke-linecap": "round" }, mk2HeadFins);
  // Mark IV–V Aerodynamic Swept Sensor Ear-Wings + Sleek Visor Brow Hood!
  const mk4EarWings = mk("g", { opacity: "0" }, headGroup);
  mk("path", { d: "M -5.6,-2.2 L -8.4,-4.4 L -7.6,0.8 L -5.6,1.4 Z", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.75", "stroke-linejoin": "round" }, mk4EarWings);
  mk("path", { d: "M -5.2,-4.7 L 5.4,-4.7 L 6.2,-3.2 L -4.4,-3.2 Z", fill: "#2B2825" }, mk4EarWings);
  mk("line", { x1: "-7.6", y1: "-2.8", x2: "-6.6", y2: "-0.8", stroke: "#5CE09B", "stroke-width": "0.65", "stroke-linecap": "round" }, mk4EarWings);
  // Ear-bolt pods (Mark II–III boxy CRT ears, replaced by Mark IV ear-wings in Era 4–5!)
  const crtEarsEl = mk("g", null, headGroup);
  mk("rect", { x: "-6.9", y: "-1.6", width: "1.7", height: "3.4", rx: "0.65", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.95" }, crtEarsEl);
  mk("rect", { x: "5.2", y: "-1.6", width: "1.4", height: "3.2", rx: "0.6", fill: "#EDE8DE", stroke: "#1D1B18", "stroke-width": "0.9" }, crtEarsEl);
  // Boxy CRT head dome (unified matte porcelain ceramic gradient + crisp top specular sheen!)
  mk("rect", { x: "-5.7", y: "-4.7", width: "11.4", height: "9.0", rx: "2.6", fill: "url(#evo-porcelain)", stroke: "#1D1B18", "stroke-width": "1.08" }, headGroup);
  mk("line", { x1: "-3.4", y1: "-3.8", x2: "2.8", y2: "-3.8", stroke: "#FFFFFF", "stroke-width": "0.7", "stroke-opacity": "0.88", "stroke-linecap": "round" }, headGroup);
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
  // Stage 5: Hardcore Swept Mech V-Fin Crest (matches airborne mech-avatar.js v4 1:1!)
  const headCrestEl = mk("g", { opacity: "0" }, headGroup);
  mk("path", { d: "M -6.2,-6.8 L -1.2,-4.8 L 0.2,-7.4 L 1.6,-4.8 L 6.4,-6.8 L 1.8,-3.7 L -1.4,-3.7 Z", fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "0.95", "stroke-linejoin": "round" }, headCrestEl);
  mk("polygon", { points: "0.2,-6.7 1.0,-5.1 0.2,-4.0 -0.6,-5.1", fill: "#2D6A47" }, headCrestEl);

  // Front volumetric mechanical arm (porcelain gradient + dark elbow bushing + Stage 5 Repulsor Gauntlet)
  const frontUpperArm = mk("path", { fill: "url(#evo-porcelain)", stroke: "#1D1B18", "stroke-width": "0.82", "stroke-linejoin": "round" }, botBody);
  const frontForeArm = mk("path", { fill: "url(#evo-porcelain)", stroke: "#1D1B18", "stroke-width": "0.82", "stroke-linejoin": "round" }, botBody);
  const elbowJointF = mk("circle", { r: "0.88", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.68", opacity: "0" }, botBody);
  const shoulderPin = mk("circle", { r: "1.1", fill: "url(#evo-porcelain)", stroke: "#1D1B18", "stroke-width": "0.78" }, botBody);
  const handTipB = mk("circle", { r: "1.0", fill: "url(#evo-porcelain-back)", stroke: "#1D1B18", "stroke-width": "0.78", opacity: "0" }, botBody);
  const handTipF = mk("circle", { r: "1.1", fill: "url(#evo-porcelain)", stroke: "#1D1B18", "stroke-width": "0.82", opacity: "0" }, botBody);
  const pincerEl = mk("path", { fill: "none", stroke: "#1D1B18", "stroke-width": "1.15", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: "1" }, botBody);
  // Mark III Sleek Tapered Gunmetal Exoskeleton Forearm Quick-Connect Cuff (persists after toolbox pickup!)
  const mk3ArmCuff = mk("g", { opacity: "0" }, botBody);
  mk("path", { d: "M -1.5,-1.55 L 1.4,-1.25 L 1.4,1.25 L -1.5,1.55 Z", fill: "#2B2825", stroke: "#1D1B18", "stroke-width": "0.72", "stroke-linejoin": "round" }, mk3ArmCuff);
  mk("line", { x1: "-0.4", y1: "-0.9", x2: "-0.4", y2: "0.9", stroke: "#5CE09B", "stroke-width": "0.6", "stroke-linecap": "round" }, mk3ArmCuff);
  // Era 3 Big Spiral Mechanical Drill attachment (snaps cleanly onto extended forearm!)
  const drillGroup = mk("g", { opacity: "0" }, botBody);
  mk("rect", { x: "-0.8", y: "-2.1", width: "3.4", height: "4.2", rx: "0.85", fill: "#E4DDD0", stroke: "#1D1B18", "stroke-width": "0.88" }, drillGroup);
  mk("polygon", { points: "2.6,-2.2 8.6,0 2.6,2.2", fill: "url(#evo-porcelain)", stroke: "#1D1B18", "stroke-width": "0.92", "stroke-linejoin": "round" }, drillGroup);
  const drillFlutes = mk("path", { d: "M 4.0,-1.7 L 4.7,1.7 M 5.9,-1.0 L 6.4,1.0", fill: "none", stroke: "#2D6A47", "stroke-width": "0.92", "stroke-linecap": "round" }, drillGroup);
  const gauntletF = mk("g", { opacity: "0" }, botBody);
  mk("path", { d: "M -2.3,-2.2 L 2.3,-2.2 L 1.9,1.4 L -1.9,1.4 Z", fill: "url(#evo-porcelain)", stroke: "#1D1B18", "stroke-width": "0.86", "stroke-linejoin": "round" }, gauntletF);
  mk("line", { x1: "-1.2", y1: "-0.5", x2: "1.2", y2: "-0.5", stroke: "#2D6A47", "stroke-width": "0.82", "stroke-linecap": "round" }, gauntletF);
  const repulsorJets = mk("g", { opacity: "0" }, botBody);
  const leftPalmJet = mk("path", { fill: "url(#evo-jet-grad)" }, repulsorJets);
  const leftPalmCore = mk("path", { fill: "#E6FFF1", "fill-opacity": "0.92" }, repulsorJets);
  const rightPalmJet = mk("path", { fill: "url(#evo-jet-grad)" }, repulsorJets);
  const rightPalmCore = mk("path", { fill: "#E6FFF1", "fill-opacity": "0.92" }, repulsorJets);
  const packJetL = mk("path", { fill: "url(#evo-jet-grad)", opacity: "0.78" }, repulsorJets);
  const packJetR = mk("path", { fill: "url(#evo-jet-grad)", opacity: "0.78" }, repulsorJets);
  const bootJetF = mk("path", { fill: "url(#evo-jet-grad)" }, repulsorJets);
  const bootJetB = mk("path", { fill: "url(#evo-jet-grad)", opacity: "0.8" }, repulsorJets);
  const palmEmitterL = mk("circle", { r: "1.5", fill: "#B5F5D4", stroke: "#2D6A47", "stroke-width": "0.6" }, repulsorJets);
  const palmEmitterR = mk("circle", { r: "1.5", fill: "#B5F5D4", stroke: "#2D6A47", "stroke-width": "0.6" }, repulsorJets);

  // Stage 5 Converging Hardcore Armor Modules (8 symmetrical angular tactical pieces matching airborne v4 mech 1:1!)
  const assembleLayer = mk("g", { opacity: "0" }, botGroup);
  const FLY_SPECS = [
    // Wave 1: Heavy Vernier Greaves & Knee Shields from lower-left & lower-right
    { t0: 0.06, t1: 0.34, sx: -44, sy: -8,  cx: -22, cy: -16, tx: -3.2, ty: -4,   rot0: -38, d: "M -2.1,-4.8 L 1.9,-4.8 L 2.7,0 L -2.2,0 Z M -1.3,-3.2 L 1.3,-3.2" },
    { t0: 0.08, t1: 0.36, sx: 44,  sy: -8,  cx: 22,  cy: -16, tx: 3.2,  ty: -4,   rot0: 38,  d: "M -2.1,-4.8 L 2.1,-4.8 L 2.9,0 L -2.2,0 Z M -1.3,-3.2 L 1.5,-3.2" },
    // Wave 2: Angular Repulsor Vambraces from mid-left & mid-right
    { t0: 0.22, t1: 0.52, sx: -48, sy: -19, cx: -24, cy: -24, tx: -6.8, ty: -18,  rot0: -48, d: "M -2.4,-2.2 L 2.4,-2.2 L 1.9,1.5 L -1.9,1.5 Z M -1.2,-0.5 L 1.2,-0.5" },
    { t0: 0.24, t1: 0.54, sx: 48,  sy: -19, cx: 24,  cy: -24, tx: 6.8,  ty: -18,  rot0: 48,  d: "M -2.4,-2.2 L 2.4,-2.2 L 1.9,1.5 L -1.9,1.5 Z M -1.2,-0.5 L 1.2,-0.5" },
    // Wave 3: Symmetrical Twin Wing-Binders (upper-left & upper-right) + Layered Angular Shoulder Pauldrons (top center!)
    { t0: 0.38, t1: 0.72, sx: -44, sy: -46, cx: -24, cy: -35, tx: -6.2, ty: -23.5,rot0: -28, d: "M 0,-1.8 L -7.4,-5.4 L -8.4,-3.6 L -6.0,0.4 L 0,1.2 Z" },
    { t0: 0.38, t1: 0.72, sx: 44,  sy: -46, cx: 24,  cy: -35, tx: 6.2,  ty: -23.5,rot0: 28,  d: "M 0,-1.8 L 7.4,-5.4 L 8.4,-3.6 L 6.0,0.4 L 0,1.2 Z" },
    { t0: 0.42, t1: 0.72, sx: 0,   sy: -52, cx: 0,   cy: -38, tx: 0,    ty: -25.5,rot0: 0,   d: "M -7.6,-2.0 L -3.6,-1.2 L 3.6,-1.2 L 7.6,-2.0 L 8.6,0.8 L 6.8,2.2 L -6.8,2.2 L -8.6,0.8 Z" },
    // Wave 4: Sharp Twin-Blade V-Fin Crest from straight above!
    { t0: 0.60, t1: 0.88, sx: 0,   sy: -58, cx: 4,   cy: -45, tx: 0.2,  ty: -36.5,rot0: 0,   d: "M -6.2,-2.2 L -1.2,-0.2 L 0.2,-2.8 L 1.6,-0.2 L 6.4,-2.2 L 1.6,1.0 L -1.4,1.0 Z" }
  ];
  const flyParts = FLY_SPECS.map((sp, idx) => {
    const trail = mk("line", { stroke: "#2D6A47", "stroke-width": "1.15", "stroke-opacity": "0.62", "stroke-dasharray": "4 2", "stroke-linecap": "round", opacity: "0" }, assembleLayer);
    const piece = mk("g", { opacity: "0" }, assembleLayer);
    mk("path", { d: sp.d, fill: "#FAF8F4", stroke: "#1D1B18", "stroke-width": "1.1", "stroke-linejoin": "round", "stroke-linecap": "round" }, piece);
    if (idx === 2 || idx === 3 || idx === 6) {
      mk("circle", { cx: "0", cy: idx === 6 ? "0" : "-0.4", r: "0.95", fill: "#2D6A47" }, piece);
    } else if (idx === 4 || idx === 5) {
      const dir = idx === 4 ? -1 : 1;
      mk("line", { x1: String(dir * 1.4), y1: "-1.4", x2: String(dir * 6.4), y2: "-3.8", stroke: "#2D6A47", "stroke-width": "0.85", "stroke-linecap": "round" }, piece);
    }
    return { sp, trail, piece };
  });
  // System-Online 4-corner lock flash ticks + diagonal metallic lock glint sweep!
  const lockSparks = mk("g", { opacity: "0" }, botGroup);
  mk("path", {
    d: "M -12,-28 L -15,-31 M 12,-28 L 15,-31 M -12,-10 L -15,-7 M 12,-10 L 15,-7",
    fill: "none", stroke: "#2D6A47", "stroke-width": "1.25", "stroke-linecap": "round"
  }, lockSparks);
  const lockGlint = mk("line", { x1: "-7", y1: "-30", x2: "7", y2: "-16", stroke: "#FFFFFF", "stroke-width": "2.4", "stroke-linecap": "round", "stroke-opacity": "0.92", opacity: "0" }, botGroup);

  // Click happy hop spark
  const clickSpark = mk("g", { opacity: "0" }, botGroup);
  mk("line", { x1: "0", y1: "-35", x2: "0", y2: "-39", stroke: "#2D6A47", "stroke-width": "1.2", "stroke-linecap": "round" }, clickSpark);
  mk("line", { x1: "-4.5", y1: "-34", x2: "-7.5", y2: "-37", stroke: "#2D6A47", "stroke-width": "1.2", "stroke-linecap": "round" }, clickSpark);
  mk("line", { x1: "4.5", y1: "-34", x2: "7.5", y2: "-37", stroke: "#2D6A47", "stroke-width": "1.2", "stroke-linecap": "round" }, clickSpark);


  return {
    botGroup, shadowEl, stuckBang, botBody, keyGroup, keyBowG, backLegGroup, backThigh, backShin, kneeJoint2, backFoot, bootB, backArmGroup, backUpperArm, backForeArm, elbowJointB, gauntletB, torsoGroup, jetpackEl, groundWingL, groundWingR, rpaTopCap, mk1Lamp, mk3BackEl, mk3StowedDrill, mk4BackEl, neckEl, pelvisEl, skirtArmorEl, torsoEl, torsoShade, chestPanel, chestLed, mk1FrontDial, mk1Needle, mk2ProtoEl, mk2CoreAura, mk2PulseBar, mk3RigEl, mk4TactEl, mk4Led1, mk4Led2, mk4Led3, shoulderArmorEl, harnessGroup, harnessX1, harnessX2, harnessGlow, harnessHexG, harnessRipple, harnessRipple2, frontThigh, frontShin, frontFoot, kneeJoint1, bootF, headGroup, antGroup, antTip, cotHeadSpark, mk2HeadFins, mk4EarWings, crtEarsEl, visorScreen, visorGlint1, crtBootLine, eyeEl, eyeFocus, eyeWince, dizzyStars, gogglesEl, visorGlint2, goggleEye, gEyeL, gEyeR, goggleHappy, headCrestEl, frontUpperArm, frontForeArm, elbowJointF, shoulderPin, handTipB, handTipF, pincerEl, mk3ArmCuff, drillGroup, drillFlutes, gauntletF, repulsorJets, leftPalmJet, leftPalmCore, rightPalmJet, rightPalmCore, packJetL, packJetR, bootJetF, bootJetB, palmEmitterL, palmEmitterR, assembleLayer, flyParts, lockSparks, lockGlint, clickSpark
  };
}
