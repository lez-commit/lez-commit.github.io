import { esc } from "../core/utils.js";
import { NODE_MAP, getPublishedPostsForNode, isPublished, state } from "../core/store.js";

/**
 * Symmetric 3-way Brushing & Linking across:
 *   53-week Heatmap <-> Recent Posts <-> 5-Era Knowledge Graph
 * Scrolls ONLY the local .era-lower container cleanly (never the document viewport!).
 */
export function createBrushing({ skeletonGridEl, fpCanvasEl, fpReadoutEl, dockLatestEl }) {
  function defaultReadoutHTML() {
    return `过去一年发布 <strong>${state.footprint ? state.footprint.pubPostCount : 0}</strong> 篇文章`;
  }

  function clearHoverLinks() {
    document
      .querySelectorAll(".is-linked-era, .is-linked-twig, .is-linked-sq, .is-linked-recent")
      .forEach((el) =>
        el.classList.remove("is-linked-era", "is-linked-twig", "is-linked-sq", "is-linked-recent")
      );
  }

  function resetReadout() {
    if (!fpReadoutEl) return;
    fpReadoutEl.classList.remove("is-active");
    fpReadoutEl.innerHTML = defaultReadoutHTML();
  }

  /** Scroll ONLY .era-lower if the target twig is outside its visible frame */
  function revealTwigInColumn(twigEl) {
    if (!twigEl) return;
    const lower = twigEl.closest(".era-lower");
    if (!lower || lower.scrollHeight <= lower.clientHeight + 2) return;
    const lr = lower.getBoundingClientRect();
    const tr = twigEl.getBoundingClientRect();
    const pad = 12;
    if (tr.top < lr.top + pad) {
      lower.scrollBy({ top: tr.top - lr.top - pad, behavior: "smooth" });
    } else if (tr.bottom > lr.bottom - pad) {
      lower.scrollBy({ top: tr.bottom - lr.bottom + pad, behavior: "smooth" });
    }
  }

  function linkRecentByPostIds(postIds) {
    if (!dockLatestEl || !postIds.length) return;
    postIds.forEach((pid) => {
      const btn = dockLatestEl.querySelector(`.recent-item-btn[data-open-article="${pid}"]`);
      if (btn) btn.classList.add("is-linked-recent");
    });
  }

  function highlightFromTwig(nodeId) {
    clearHoverLinks();
    const node = NODE_MAP.get(nodeId);
    if (!node) return;
    const pubs = getPublishedPostsForNode(node);
    if (pubs.length === 0) return;

    pubs.forEach((p) => {
      const sq = fpCanvasEl && fpCanvasEl.querySelector(`.heat-sq[data-iso="${p.date}"]`);
      if (sq) sq.classList.add("is-linked-sq");
    });
    linkRecentByPostIds(pubs.map((p) => p.id));

    if (fpReadoutEl) {
      fpReadoutEl.classList.add("is-active");
      if (pubs.length > 1) {
        fpReadoutEl.innerHTML = `<strong>${esc(node.title)}</strong> · 收录 <strong>${pubs.length}</strong> 篇（最新 ${pubs[0].date}）`;
      } else {
        fpReadoutEl.innerHTML = `<strong>${pubs[0].date}</strong> · 发布《${esc(pubs[0].shortTitle)}》`;
      }
    }
  }

  function highlightFromPost(post) {
    if (!post) return;
    clearHoverLinks();
    const sq = fpCanvasEl && fpCanvasEl.querySelector(`.heat-sq[data-iso="${post.date}"]`);
    if (sq) sq.classList.add("is-linked-sq");
    linkRecentByPostIds([post.id]);

    if (fpReadoutEl) {
      fpReadoutEl.classList.add("is-active");
      fpReadoutEl.innerHTML = `<strong>${post.date}</strong> · 发布《${esc(post.shortTitle)}》`;
    }
  }

  function highlightFromRecent(post) {
    if (!post) return;
    clearHoverLinks();
    const sq = fpCanvasEl && fpCanvasEl.querySelector(`.heat-sq[data-iso="${post.date}"]`);
    if (sq) sq.classList.add("is-linked-sq");

    const eraEl = skeletonGridEl && skeletonGridEl.querySelector(`.era-col[data-era-id="${post.era.id}"]`);
    const twigEl = skeletonGridEl && skeletonGridEl.querySelector(`.twig-item[data-node-id="${post.nodeId}"]`);
    if (eraEl) eraEl.classList.add("is-linked-era");
    if (twigEl) {
      twigEl.classList.add("is-linked-twig");
      revealTwigInColumn(twigEl);
    }

    if (fpReadoutEl) {
      fpReadoutEl.classList.add("is-active");
      fpReadoutEl.innerHTML = `<strong>${post.date}</strong> · ${esc(post.era.title)} › 《${esc(post.shortTitle)}》`;
    }
  }

  function highlightFromSquare(dayRec) {
    clearHoverLinks();
    if (!dayRec || dayRec.isFuture) {
      resetReadout();
      return;
    }

    if (dayRec.count === 0) {
      if (fpReadoutEl) {
        fpReadoutEl.classList.add("is-active");
        fpReadoutEl.innerHTML = `${dayRec.iso} · 无发布`;
      }
      return;
    }

    const titles = dayRec.posts.map((p) => `《${esc(p.shortTitle)}》`).join("");
    let scrolledOnce = false;
    dayRec.posts.forEach((p) => {
      const node = p.node;
      if (node && isPublished(node)) {
        const eraEl = skeletonGridEl && skeletonGridEl.querySelector(`.era-col[data-era-id="${node.era.id}"]`);
        const twigEl = skeletonGridEl && skeletonGridEl.querySelector(`.twig-item[data-node-id="${node.id}"]`);
        if (eraEl) eraEl.classList.add("is-linked-era");
        if (twigEl) {
          twigEl.classList.add("is-linked-twig");
          if (!scrolledOnce) {
            scrolledOnce = true;
            revealTwigInColumn(twigEl);
          }
        }
      }
    });
    linkRecentByPostIds(dayRec.posts.map((p) => p.id));

    if (fpReadoutEl) {
      fpReadoutEl.classList.add("is-active");
      fpReadoutEl.innerHTML = `<strong>${dayRec.iso}</strong> · 发布 ${dayRec.count} 篇：${titles}`;
    }
  }

  return {
    defaultReadoutHTML,
    clearHoverLinks,
    resetReadout,
    revealTwigInColumn,
    highlightFromTwig,
    highlightFromPost,
    highlightFromRecent,
    highlightFromSquare
  };
}
