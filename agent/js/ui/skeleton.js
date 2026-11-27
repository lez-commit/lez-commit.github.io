import { esc } from "../core/utils.js";
import { AGENT_MAP_DATA, SHORT_ERA_LABELS } from "../data/map-data.js";
import {
  NODE_MAP,
  POST_MAP,
  state,
  getPublishedPostsForNode,
  hasFlagshipPost
} from "../core/store.js";
import { bus } from "../core/bus.js";

/**
 * 5-Column Evolution Graph Renderer:
 * - Uses clean 3-row architectural grid per column (catalog / runway / footer)
 *   so scrolled content NEVER collides with the robot runway and vertical stems never break!
 * - Keyboard accessible (Enter/Space on published rows, aria-expanded on carets).
 */
export function createSkeleton({ skeletonGridEl, tooltip, brushing, openArticle }) {
  function updateColumnScrollMasks() {
    if (!skeletonGridEl) return;
    skeletonGridEl.querySelectorAll(".era-col").forEach((col) => {
      const lower = col.querySelector(".era-lower");
      if (!lower) return;
      const overflow = lower.scrollHeight > lower.clientHeight + 2;
      const hasMore = overflow && lower.scrollTop + lower.clientHeight < lower.scrollHeight - 2;
      const hasUp = overflow && lower.scrollTop > 2;
      col.classList.toggle("has-scroll-more", hasMore);
      col.classList.toggle("has-scroll-up", hasUp);
    });
  }

  function render() {
    if (!skeletonGridEl) return;
    const colsHtml = AGENT_MAP_DATA.eras
      .map((era, eraIdx) => {
        let eraHasFlagship = false;
        let litNodeCount = 0;
        let firstPubIdx = -1;

        era.nodes.forEach((rawNode, idx) => {
          const node = NODE_MAP.get(rawNode.id);
          const pubs = getPublishedPostsForNode(node);
          if (pubs.length > 0) {
            litNodeCount += 1;
            if (firstPubIdx === -1) firstPubIdx = idx;
            if (pubs.some((p) => p.isFlagship)) eraHasFlagship = true;
          }
        });

        const twigsHtml = era.nodes
          .map((rawNode, idx) => {
            const node = NODE_MAP.get(rawNode.id);
            const pubs = getPublishedPostsForNode(node);
            const pub = pubs.length > 0;
            const flagship = hasFlagshipPost(node);
            const isMulti = pubs.length >= 2;
            const isCollapsed = pub && state.collapsedNodes.has(node.id);

            const stemCls =
              firstPubIdx !== -1 && idx >= firstPubIdx
                ? eraHasFlagship
                  ? "is-stem-vermilion"
                  : "is-stem-bamboo"
                : "";

            const stemEndCls = idx === firstPubIdx ? "is-stem-end" : "";

            const itemCls = [
              "twig-item",
              pub ? "is-published" : "is-planned",
              pub && flagship ? "is-flagship" : "",
              pub ? "is-has-branches" : "",
              isMulti ? "is-multi-node" : "",
              isCollapsed ? "is-collapsed" : "",
              stemCls,
              stemEndCls
            ]
              .filter(Boolean)
              .join(" ");

            let badgeHtml = "";
            if (pub) {
              const caret = isCollapsed ? "▸" : "▾";
              badgeHtml = `<button class="twig-badge" type="button" data-toggle-node="${node.id}" aria-expanded="${!isCollapsed}" aria-label="折叠或展开文章分支" title="折叠/展开分支">${caret}</button>`;
            }

            let subListHtml = "";
            if (pub) {
              const subItems = pubs
                .map((p) => {
                  const subCls = ["sub-twig-btn", p.isFlagship ? "is-flagship-sub" : ""]
                    .filter(Boolean)
                    .join(" ");
                  return `
                    <li>
                      <button class="${subCls}" type="button" data-open-article="${p.id}" data-node-id="${node.id}" title="${esc(p.title)}">
                        <span class="sub-twig-branch" aria-hidden="true">└</span>
                        <span class="sub-twig-title">${esc(p.shortTitle)}</span>
                      </button>
                    </li>
                  `;
                })
                .join("");
              subListHtml = `<ul class="sub-twig-list">${subItems}</ul>`;
            }

            const rowA11y = pub
              ? `tabindex="0" role="button" aria-label="${esc(node.title)}"`
              : "";

            return `
              <li class="${itemCls}" data-node-id="${node.id}" data-era-id="${era.id}">
                <div class="twig-row" data-node-id="${node.id}" ${rowA11y}>
                  <span class="twig-dot" aria-hidden="true"></span>
                  <span class="twig-title">${esc(node.title)}</span>
                  ${badgeHtml}
                </div>
                ${subListHtml}
              </li>
            `;
          })
          .join("");

        const spineCls = eraHasFlagship
          ? "is-lit-vermilion"
          : litNodeCount > 0
          ? "is-lit-bamboo"
          : "";

        const colCls = [
          "era-col",
          litNodeCount > 0 ? "has-published" : "",
          eraHasFlagship ? "has-flagship" : ""
        ]
          .filter(Boolean)
          .join(" ");

        const compact = SHORT_ERA_LABELS[era.id] || { short: era.title, yr: era.year };
        const fullMetaTip = `${era.num} ${era.title}（${era.year}）· ${era.whisper}`;

        return `
          <section class="${colCls}" data-era-id="${era.id}" data-era-idx="${eraIdx}">
            <div class="era-lower">
              <ul class="twig-list">${twigsHtml}</ul>
            </div>
            <div class="era-runway-slot" aria-hidden="true"></div>
            <button class="spine-dot ${spineCls}" type="button" data-summon-era="${eraIdx}" title="点击召唤机器人从此时代演进" aria-label="从${esc(compact.short)}时代召唤机器人"></button>
            <header class="era-upper" data-summon-era="${eraIdx}" title="${esc(fullMetaTip)} · 点击从本时代演进">
              <div class="era-title-row">
                <span class="era-num-tag">${esc(era.num)}</span>
                <h2 class="era-title">${esc(compact.short)}</h2>
                <span class="era-year">${esc(compact.yr)}</span>
              </div>
            </header>
            <button class="era-scroll-mask" type="button" aria-label="向下滚动查看更多节点">↓ 更多</button>
          </section>
        `;
      })
      .join("");

    skeletonGridEl.innerHTML = `<div class="timeline-spine" aria-hidden="true"></div>${colsHtml}`;

    skeletonGridEl.querySelectorAll(".era-lower").forEach((lower) => {
      lower.addEventListener("scroll", () => {
        updateColumnScrollMasks();
        tooltip.hideTip();
      }, { passive: true });
    });

    requestAnimationFrame(updateColumnScrollMasks);
  }

  function toggleNodeBranch(nodeId, itemEl) {
    const collapsed = state.collapsedNodes.has(nodeId);
    if (collapsed) {
      state.collapsedNodes.delete(nodeId);
    } else {
      state.collapsedNodes.add(nodeId);
    }
    if (itemEl) {
      itemEl.classList.toggle("is-collapsed", !collapsed);
      const badge = itemEl.querySelector(".twig-badge");
      if (badge) {
        badge.textContent = !collapsed ? "▸" : "▾";
        badge.setAttribute("aria-expanded", String(collapsed));
      }
    }
    requestAnimationFrame(updateColumnScrollMasks);
  }

  function activateRow(row) {
    const node = NODE_MAP.get(row.dataset.nodeId);
    if (!node) return;
    const pubs = getPublishedPostsForNode(node);
    if (pubs.length === 0) return;
    if (pubs.length === 1) {
      openArticle(pubs[0].id);
      return;
    }
    toggleNodeBranch(node.id, row.closest(".twig-item"));
  }

  if (skeletonGridEl) {
    skeletonGridEl.addEventListener("mouseover", (e) => {
      const subBtn = e.target.closest(".sub-twig-btn[data-open-article]");
      if (subBtn) {
        const post = POST_MAP.get(subBtn.dataset.openArticle);
        if (post) brushing.highlightFromPost(post);
        tooltip.hideTip();
        return;
      }

      const row = e.target.closest(".twig-row[data-node-id]");
      if (!row) return;
      const node = NODE_MAP.get(row.dataset.nodeId);
      if (!node) return;

      const pubs = getPublishedPostsForNode(node);
      if (pubs.length > 0) {
        brushing.highlightFromTwig(node.id);
        const hint = pubs.length === 1 ? "已收录 1 篇 · 点击直达阅读" : `已收录 ${pubs.length} 篇 · 点击展开/折叠`;
        tooltip.showTip(`<div class="qt-meta">${esc(node.milestone)}</div><div>${hint}</div>`, row);
      } else {
        brushing.clearHoverLinks();
        brushing.resetReadout();
        tooltip.showTip(`<div class="qt-meta">${esc(node.milestone)}</div><div>待研写 · 规划节点</div>`, row);
      }
    });

    skeletonGridEl.addEventListener("mouseout", (e) => {
      if (!skeletonGridEl.contains(e.relatedTarget)) {
        brushing.clearHoverLinks();
        brushing.resetReadout();
        tooltip.hideTip();
      } else {
        const leftRow = e.target.closest(".twig-row, .sub-twig-btn");
        const enteredRow =
          e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".twig-row, .sub-twig-btn");
        if (leftRow && !enteredRow) {
          brushing.clearHoverLinks();
          brushing.resetReadout();
          tooltip.hideTip();
        }
      }
    });

    skeletonGridEl.addEventListener("click", (e) => {
      const summonTrigger = e.target.closest("[data-summon-era]");
      if (summonTrigger) {
        e.stopPropagation();
        bus.emit("walker:summon", Number(summonTrigger.dataset.summonEra));
        return;
      }

      const scrollCue = e.target.closest(".era-scroll-mask");
      if (scrollCue) {
        const lower = scrollCue.closest(".era-col") && scrollCue.closest(".era-col").querySelector(".era-lower");
        if (lower) {
          lower.scrollBy({ top: Math.max(120, lower.clientHeight * 0.55), behavior: "smooth" });
        }
        return;
      }

      const subBtn = e.target.closest(".sub-twig-btn[data-open-article]");
      if (subBtn) {
        openArticle(subBtn.dataset.openArticle);
        return;
      }

      const caretBtn = e.target.closest(".twig-badge[data-toggle-node]");
      if (caretBtn) {
        e.stopPropagation();
        toggleNodeBranch(caretBtn.dataset.toggleNode, caretBtn.closest(".twig-item"));
        return;
      }

      const row = e.target.closest(".twig-row[data-node-id]");
      if (row) activateRow(row);
    });

    skeletonGridEl.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const row = e.target.closest(".twig-row[data-node-id]");
      if (!row || e.target.closest(".twig-badge")) return;
      e.preventDefault();
      activateRow(row);
    });
  }

  return { render, updateColumnScrollMasks };
}
