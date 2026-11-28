import { bus } from "./core/bus.js";
import { state, buildFootprint } from "./core/store.js";
import { createTooltip } from "./ui/tooltip.js";
import { createBrushing } from "./ui/brushing.js?v=20261127z11";
import { createSkeleton } from "./ui/skeleton.js?v=20261127z11";
import { createFootprint } from "./ui/footprint.js";
import { createRecentDock } from "./ui/recent.js?v=20261127z11";
import { createViews } from "./ui/views.js?v=20261127z11";
import { initMechAvatar } from "./mech/mech-avatar.js?v=20261127z11";
import { initEvoWalker } from "./evo/evo-walker.js?v=20261127z11";

/**
 * Application Bootstrap — Zero-Build Native ES Modules Entrypoint.
 */
function bootstrap() {
  const navLinksEl = document.getElementById("nav-links");
  const views = {
    home: document.getElementById("view-home"),
    articles: document.getElementById("view-articles"),
    about: document.getElementById("view-about"),
    reader: document.getElementById("view-reader")
  };

  const skeletonGridEl = document.getElementById("skeleton-grid");
  const fpReadoutEl = document.getElementById("fp-readout");
  const fpCanvasEl = document.getElementById("fp-canvas");
  const dockLatestEl = document.getElementById("dock-latest");
  const archiveContentEl = document.getElementById("archive-content");
  const jsonPreEl = document.getElementById("json-pre");
  const btnCopyJsonEl = document.getElementById("btn-copy-json");
  const btnBackMapEl = document.getElementById("btn-back-map");
  const readerCoordTagEl = document.getElementById("reader-coord-tag");
  const readerBodyEl = document.getElementById("reader-body");
  const tipEl = document.getElementById("quiet-tip");

  const tooltip = createTooltip(tipEl);
  const brushing = createBrushing({
    skeletonGridEl,
    fpCanvasEl,
    fpReadoutEl,
    dockLatestEl
  });

  // Forward references resolved immediately after construction
  let skeleton = null;
  let viewsCtrl = null;

  viewsCtrl = createViews({
    navLinksEl,
    views,
    skeletonGridEl,
    archiveContentEl,
    jsonPreEl,
    btnCopyJsonEl,
    btnBackMapEl,
    readerCoordTagEl,
    readerBodyEl,
    tooltip,
    brushing,
    updateColumnScrollMasks: () => skeleton && skeleton.updateColumnScrollMasks()
  });

  skeleton = createSkeleton({
    skeletonGridEl,
    tooltip,
    brushing,
    openArticle: viewsCtrl.openArticle
  });

  const footprint = createFootprint({
    fpCanvasEl,
    fpReadoutEl,
    tooltip,
    brushing,
    openArticle: viewsCtrl.openArticle
  });

  const recent = createRecentDock({
    dockLatestEl,
    brushing
  });

  function renderAll() {
    buildFootprint();
    skeleton.render();
    footprint.render();
    recent.render();
    if (state.view === "articles") viewsCtrl.renderArchive();
    if (state.view === "about") viewsCtrl.renderAbout();
  }

  renderAll();
  if (window.location.hash) {
    viewsCtrl.applyRouteFromHash();
  }

  window.addEventListener("resize", () => {
    if (state.view === "home") {
      requestAnimationFrame(() => skeleton.updateColumnScrollMasks());
    }
  });

  const getView = () => state.view;
  const mech = initMechAvatar({ getView, switchView: viewsCtrl.switchView });
  const walker = initEvoWalker({ getView });

  // Clean debug/automation handle preserving backwards compatibility
  window.AgentBlog = {
    bus,
    getView,
    switchView: viewsCtrl.switchView,
    summonWalkerAtEra: (idx) => walker && walker.summonWalkerAtEra(idx),
    isAvatarDocked: () => (mech ? mech.isDocked() : false),
    onMechLiftoff: (origin) => bus.emit("mech:liftoff", origin)
  };
}

bootstrap();
