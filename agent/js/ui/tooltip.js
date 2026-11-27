/**
 * Viewport-clamped floating editorial tooltip.
 */
export function createTooltip(tipEl) {
  function showTip(html, targetEl) {
    if (!tipEl || !targetEl) return;
    tipEl.innerHTML = html;
    tipEl.classList.add("is-visible");

    const r = targetEl.getBoundingClientRect();
    const tr = tipEl.getBoundingClientRect();
    const pad = 10;

    let left = r.left + r.width / 2 - tr.width / 2;
    left = Math.max(pad, Math.min(window.innerWidth - tr.width - pad, left));

    let top = r.top - tr.height - 8;
    if (top < pad) top = r.bottom + 8;

    tipEl.style.left = `${left}px`;
    tipEl.style.top = `${top}px`;
  }

  function hideTip() {
    if (!tipEl) return;
    tipEl.classList.remove("is-visible");
  }

  window.addEventListener("blur", hideTip, { passive: true });
  window.addEventListener("resize", hideTip, { passive: true });

  return { showTip, hideTip };
}
