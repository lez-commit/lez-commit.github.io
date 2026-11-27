import { esc } from "../core/utils.js";
import { TOTAL_WEEKS, state } from "../core/store.js";

/**
 * 53-Week 1:1 GitHub Publish Contribution Graph renderer & hover/click controller.
 */
export function createFootprint({ fpCanvasEl, fpReadoutEl, tooltip, brushing, openArticle }) {
  function render() {
    if (!fpCanvasEl || !state.footprint) return;
    if (fpReadoutEl) {
      fpReadoutEl.classList.remove("is-active");
      fpReadoutEl.innerHTML = brushing.defaultReadoutHTML();
    }

    const { days } = state.footprint;
    const monthMarks = new Array(TOTAL_WEEKS).fill("");
    let prevM = -1;
    let lastLabelCol = -10;

    for (let col = 0; col < TOTAL_WEEKS; col++) {
      const firstDayOfCol = days[col * 7];
      const m = firstDayOfCol.month;
      if (m !== prevM) {
        const nextMonthTooClose =
          col === 0 &&
          ((days[7] && days[7].month !== m) || (days[14] && days[14].month !== m));
        if (!nextMonthTooClose && col - lastLabelCol >= 3) {
          monthMarks[col] = `${m}月`;
          lastLabelCol = col;
        }
        prevM = m;
      }
    }

    const monthsHtml = monthMarks.map((lbl) => `<span class="gh-mlbl">${lbl}</span>`).join("");
    const weekdaysHtml = ["", "一", "", "三", "", "五", ""]
      .map((w) => `<span class="gh-wday">${w}</span>`)
      .join("");

    const squaresHtml = days
      .map((d) => {
        if (d.isFuture) {
          return `<span class="heat-sq is-future" aria-hidden="true"></span>`;
        }
        const hasPosts = d.count > 0;
        const cls = ["heat-sq", d.level > 0 ? `lvl-${d.level}` : "", hasPosts ? "is-clickable" : ""]
          .filter(Boolean)
          .join(" ");
        const nodeIds = Array.from(new Set(d.posts.map((p) => p.nodeId))).join(",");
        const attrs = hasPosts
          ? `data-pub-date="${d.iso}" data-node-ids="${nodeIds}" tabindex="0" role="button" aria-label="${d.iso} 发布 ${d.count} 篇"`
          : "";
        return `<span class="${cls}" data-iso="${d.iso}" ${attrs}></span>`;
      })
      .join("");

    fpCanvasEl.innerHTML = `
      <div class="gh-graph">
        <div class="gh-months-row">
          <div class="gh-months">${monthsHtml}</div>
        </div>
        <div class="gh-body">
          <div class="gh-weekdays" aria-hidden="true">${weekdaysHtml}</div>
          <div class="gh-grid">${squaresHtml}</div>
        </div>
      </div>
    `;
  }

  if (fpCanvasEl) {
    fpCanvasEl.addEventListener("mouseover", (e) => {
      const sq = e.target.closest(".heat-sq[data-iso]");
      if (!sq || !state.footprint) return;
      const rec = state.footprint.dayMap.get(sq.dataset.iso);
      if (!rec || rec.isFuture) return;

      brushing.highlightFromSquare(rec);
      if (rec.count > 0) {
        const titles = rec.posts.map((p) => `《${esc(p.shortTitle)}》`).join("");
        tooltip.showTip(`<div class="qt-meta">${rec.iso} · 发布 ${rec.count} 篇</div><div>${titles}</div>`, sq);
      } else {
        tooltip.showTip(`<div>${rec.iso} · 无发布</div>`, sq);
      }
    });

    fpCanvasEl.addEventListener("mouseout", (e) => {
      if (!fpCanvasEl.contains(e.relatedTarget)) {
        brushing.clearHoverLinks();
        brushing.resetReadout();
        tooltip.hideTip();
      }
    });

    fpCanvasEl.addEventListener("click", (e) => {
      const sq = e.target.closest(".heat-sq[data-pub-date]");
      if (!sq || !state.footprint) return;
      const rec = state.footprint.dayMap.get(sq.dataset.pubDate);
      if (!rec || rec.posts.length === 0) return;
      openArticle(rec.posts[0].id, { fromDate: rec.iso });
    });

    fpCanvasEl.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const sq = e.target.closest(".heat-sq[data-pub-date]");
      if (!sq || !state.footprint) return;
      e.preventDefault();
      const rec = state.footprint.dayMap.get(sq.dataset.pubDate);
      if (!rec || rec.posts.length === 0) return;
      openArticle(rec.posts[0].id, { fromDate: rec.iso });
    });
  }

  return { render };
}
