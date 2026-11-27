import { esc } from "../core/utils.js";
import { AGENT_MAP_DATA } from "../data/map-data.js";
import { POST_MAP, getAllPublishedPosts } from "../core/store.js";

/**
 * Pure minimal Recent Posts panel (no redundant header) with 3-way hover brushing.
 */
export function createRecentDock({ dockLatestEl, brushing }) {
  function render() {
    if (!dockLatestEl) return;
    const publishedPosts = getAllPublishedPosts();
    if (publishedPosts.length === 0) {
      dockLatestEl.innerHTML = "";
      return;
    }

    if (publishedPosts.length === 1) {
      const latest = publishedPosts[0];
      dockLatestEl.innerHTML = `
        <button class="latest-post-btn" type="button" data-open-article="${latest.id}" title="${esc(latest.title)}">
          <span class="latest-post-title">${esc(latest.shortTitle)}</span>
          <span class="latest-post-era">${latest.date} · ${esc(latest.era.title)} › ${esc(latest.node.title)} →</span>
        </button>

        <div class="latest-footer-meta">
          <span class="reading-line" title="正在研写：${esc(AGENT_MAP_DATA.readingNow)}">
            <strong>正在研写：</strong>${esc(AGENT_MAP_DATA.readingNow)}
          </span>
        </div>
      `;
      return;
    }

    const recentThree = publishedPosts.slice(0, 3);
    const listHtml = recentThree
      .map((p) => {
        const cls = ["recent-item-btn", p.isFlagship ? "is-flagship" : ""].filter(Boolean).join(" ");
        return `
          <li>
            <button class="${cls}" type="button" data-open-article="${p.id}" data-node-id="${p.nodeId}" data-post-date="${p.date}" title="${esc(p.title)}">
              <span class="recent-item-dot" aria-hidden="true"></span>
              <span class="recent-item-title">${esc(p.shortTitle)}</span>
              <span class="recent-item-date">${esc(p.date.slice(5))}</span>
            </button>
          </li>
        `;
      })
      .join("");

    dockLatestEl.innerHTML = `<ul class="recent-list">${listHtml}</ul>`;
  }

  if (dockLatestEl) {
    dockLatestEl.addEventListener("mouseover", (e) => {
      const btn = e.target.closest(".recent-item-btn[data-open-article]");
      if (!btn) return;
      const post = POST_MAP.get(btn.dataset.openArticle);
      if (post) brushing.highlightFromRecent(post);
    });

    dockLatestEl.addEventListener("mouseout", (e) => {
      if (!dockLatestEl.contains(e.relatedTarget)) {
        brushing.clearHoverLinks();
        brushing.resetReadout();
      } else {
        const leftBtn = e.target.closest(".recent-item-btn");
        const enteredBtn =
          e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".recent-item-btn");
        if (leftBtn && !enteredBtn) {
          brushing.clearHoverLinks();
          brushing.resetReadout();
        }
      }
    });
  }

  return { render };
}
