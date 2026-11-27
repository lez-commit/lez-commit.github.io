import { esc } from "../core/utils.js";
import { AGENT_MAP_DATA } from "../data/map-data.js";
import {
  NODE_MAP,
  state,
  getPublishedPostsForNode,
  hasFlagshipPost,
  getAllPublishedPosts,
  resolveTarget,
  exportSkeletonJSON
} from "../core/store.js";
import { bus } from "../core/bus.js";

/**
 * Archive view, About JSON view (with modern Clipboard copy), Article Reader
 * (including properly indented flagship essay), return-afterglow, and Hash Router.
 */
export function createViews({
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
  updateColumnScrollMasks
}) {
  let suppressHashSync = false;

  function renderArchive() {
    if (!archiveContentEl) return;
    archiveContentEl.innerHTML = AGENT_MAP_DATA.eras
      .map((era) => {
        const rowsHtml = era.nodes
          .map((rawNode) => {
            const node = NODE_MAP.get(rawNode.id);
            const pubs = getPublishedPostsForNode(node);
            const pub = pubs.length > 0;
            const flagship = hasFlagshipPost(node);

            const cls = [
              "archive-item",
              pub ? "is-published" : "is-planned",
              pub && flagship ? "is-flagship" : ""
            ]
              .filter(Boolean)
              .join(" ");

            if (!pub) {
              return `
                <div class="${cls}">
                  <span class="archive-dot" aria-hidden="true"></span>
                  <div>
                    <div class="archive-item-title">${esc(node.title)}</div>
                    <div class="archive-item-sub">${esc(node.kw)} · ${esc(node.summary)}</div>
                  </div>
                  <span class="archive-status">待研写</span>
                </div>
              `;
            }

            if (pubs.length === 1) {
              const p = pubs[0];
              return `
                <div class="${cls}" data-open-article="${p.id}" tabindex="0" role="button">
                  <span class="archive-dot" aria-hidden="true"></span>
                  <div>
                    <div class="archive-item-title">${esc(p.title)}</div>
                    <div class="archive-item-sub">${esc(node.title)} · ${esc(p.summary)}</div>
                  </div>
                  <span class="archive-status">${p.date}</span>
                </div>
              `;
            }

            const subListHtml = pubs
              .map(
                (p, i) => `
                  <button class="archive-subpost-btn" type="button" data-open-article="${p.id}">
                    <span>${i + 1}. ${esc(p.title)}</span>
                    <span class="archive-subpost-date">${p.date}</span>
                  </button>
                `
              )
              .join("");

            return `
              <div class="${cls}">
                <span class="archive-dot" aria-hidden="true"></span>
                <div>
                  <div class="archive-item-title">${esc(node.title)}</div>
                  <div class="archive-item-sub">${esc(node.kw)} · ${esc(node.summary)}</div>
                  <div class="archive-subposts">${subListHtml}</div>
                </div>
                <span class="archive-status">${pubs.length} 篇手札</span>
              </div>
            `;
          })
          .join("");

        return `
          <section class="era-group">
            <header class="era-group-head">
              <h2 class="era-group-title">
                <span class="era-group-num">${era.num}</span>
                <span>${esc(era.title)}</span>
              </h2>
              <span class="era-group-period">${esc(era.year)}</span>
            </header>
            <div>${rowsHtml}</div>
          </section>
        `;
      })
      .join("");
  }

  function renderAbout() {
    if (jsonPreEl) jsonPreEl.textContent = exportSkeletonJSON();
  }

  function buildSeriesSwitcherHTML(node, currentPost, sameDayPosts) {
    let html = "";

    if (sameDayPosts && sameDayPosts.length > 1) {
      const dayItemsHtml = sameDayPosts
        .map((p, idx) => {
          const active = p.id === currentPost.id ? "is-current" : "";
          return `
            <button class="series-tab-btn ${active}" type="button" data-switch-post="${p.id}" data-from-date="${esc(currentPost.date)}">
              <span>${idx + 1}. ${esc(p.title)}</span>
              <span class="series-tab-date">${esc(p.node.title)}</span>
            </button>
          `;
        })
        .join("");

      html += `
        <aside class="node-series-box" aria-label="同日发布文章切换">
          <div class="node-series-head">
            <span>${esc(currentPost.date)} 当日共发布 ${sameDayPosts.length} 篇文章</span>
            <span>点击切换同日篇章</span>
          </div>
          <div class="node-series-tabs">${dayItemsHtml}</div>
        </aside>
      `;
    }

    const pubs = getPublishedPostsForNode(node);
    if (pubs.length > 1) {
      const itemsHtml = pubs
        .map((p, idx) => {
          const active = p.id === currentPost.id ? "is-current" : "";
          return `
            <button class="series-tab-btn ${active}" type="button" data-switch-post="${p.id}">
              <span>${idx + 1}. ${esc(p.title)}</span>
              <span class="series-tab-date">${p.date}</span>
            </button>
          `;
        })
        .join("");

      html += `
        <aside class="node-series-box" aria-label="同节点系列文章切换">
          <div class="node-series-head">
            <span>本节点共收录 ${pubs.length} 篇演进手札</span>
            <span>点击切换同节点篇章</span>
          </div>
          <div class="node-series-tabs">${itemsHtml}</div>
        </aside>
      `;
    }

    return html;
  }

  function renderFlagshipEssay(post, seriesHtml) {
    const codeSample = [
      `<span class="c-kw">from</span> langchain_core.prompts <span class="c-kw">import</span> ChatPromptTemplate`,
      `<span class="c-kw">from</span> langchain_openai <span class="c-kw">import</span> ChatOpenAI`,
      `<span class="c-kw">from</span> langchain_core.output_parsers <span class="c-kw">import</span> StrOutputParser`,
      ``,
      `<span class="c-cmt"># 核心逻辑只写这一遍</span>`,
      `chain = (`,
      `  ChatPromptTemplate.from_template(<span class="c-str">"用一句话夸夸{topic}"</span>)`,
      `  | ChatOpenAI()`,
      `  | StrOutputParser()`,
      `)`,
      ``,
      `<span class="c-cmt"># 1. 正常用：等它全部生成完吐出来</span>`,
      `print(chain.<span class="c-fn">invoke</span>({<span class="c-str">"topic"</span>: <span class="c-str">"摸鱼"</span>}))`,
      ``,
      `<span class="c-cmt"># 2. 网页“打字机效果”：直接换 .stream()，不用改任何解析代码</span>`,
      `<span class="c-kw">for</span> chunk <span class="c-kw">in</span> chain.<span class="c-fn">stream</span>({<span class="c-str">"topic"</span>: <span class="c-str">"摸鱼"</span>}):`,
      `  print(chunk, end=<span class="c-str">""</span>, flush=<span class="c-kw">True</span>)`,
      ``,
      `<span class="c-cmt"># 3. 批量处理一堆数据：直接换 .batch()，框架自动并发跑完</span>`,
      `results = chain.<span class="c-fn">batch</span>([{<span class="c-str">"topic"</span>: <span class="c-str">"摸鱼"</span>}, {<span class="c-str">"topic"</span>: <span class="c-str">"下班"</span>}, {<span class="c-str">"topic"</span>: <span class="c-str">"发工资"</span>}])`,
      ``,
      `<span class="c-cmt"># 4. 怕大模型 API 偶尔抽风：套个 .with_retry()，失败自动重试 3 次</span>`,
      `safe_chain = chain.<span class="c-fn">with_retry</span>(stop_after_attempt=3)`
    ].join("\n");

    return `
      <div class="art-meta">
        <span>${post.date}</span>
        <span>·</span>
        <span>约 ${post.readTime}</span>
        <span>·</span>
        <span>实文刊载</span>
      </div>
      <h1 class="art-h1">${esc(post.title)}</h1>
      ${seriesHtml}
      <p class="art-lead">${esc(post.summary)}</p>

      <div class="art-prose">
        <p>
          最近在复盘 Agent 开发框架时，看到一句很常见的话：<strong>“普通 LangChain 是一条直线走到黑的固定链路”</strong>。
        </p>
        <p>
          说实话，我一开始完全无法理解这句话。在我印象里，LangChain 不就是一个封装了各种好用 API 的“工具箱”吗（调 LLM、封装 Tool 都在里面）？而且大家都是写 Python 的，想要路由我写个 <code>if</code> 不行吗？想要循环我手搓个 <code>while</code> 跑 ReAct 不也挺香吗？凭什么说它是一条死板的直线？
        </p>
        <p>
          顺着这个疑问一路深挖下去，我才发现自己之前只是停留在“调 API 跑通 Demo”的层面，漏掉了好几层工程背景。把这些拼图补齐后，整个 AI 框架的演进逻辑瞬间就通透了。
        </p>

        <h2>一、先分清一件事：“乐高积木” vs “拼装方式”</h2>
        <p>如果把开发比作拼乐高，我之所以一开始觉得别扭，是因为把 LangChain 里的两个概念混在了一起：</p>
        <ul>
          <li><strong>工具箱（零件库）</strong>：是我们熟悉的那些组件，比如提示词模板、大模型接口、工具封装。它们是一个个独立的积木块。</li>
          <li><strong>Chain（拼装方式）</strong>：是 LangChain 最早力推的一种拼法——通过 <code>|</code>（管道符）把积木<strong>排成一排</strong>首尾相连。</li>
        </ul>
        <p>
          大家吐槽的“一条直线走到黑”，其实特指这种<strong>用 <code>|</code> 串起来的流水线写法</strong>——数据只能单向往前走，中间没法拐弯，也没法回头重试。而后来推出的 LangGraph，本质上是换了一种<strong>能拐弯、能画圈的拼法</strong>，里面塞的零件依然是 LangChain 工具箱里的那套 API。
        </p>

        <h2>二、灵魂拷问：为什么非要用 <code>|</code> 框死自己，直接写 <code>if</code> 和 <code>while</code> 不香吗？</h2>
        <p>
          从“拿来就能用”的业务视角看，<code>|</code> 的核心爽点就一句话：<strong>“逻辑只写一遍，运行模式一键切换”</strong>。把几个零件用 <code>|</code> 串起来交给框架统一调度后，线上最常用的 4 种工程能力，换个后缀名就能<strong>直接白嫖</strong>：
        </p>

        <pre><code>${codeSample}</code></pre>

        <p>
          要是全用原生 Python 自己写，从单次调用改成全链路流式、并发批处理加失败重试，得折腾一堆胶水代码；用 Chain 就只是换个词的事，本质上是把直线流程里的工程脏活全自动化的偷懒神器。
        </p>

        <h2>三、为什么手搓 <code>while</code> 扛不住真正的 Agent？</h2>
        <p>既然本地写个 <code>while</code> 循环就能跑通 ReAct（思考 → 调工具 → 继续思考 → 输出），为什么后来还要搞出状态机框架 LangGraph？绕不开两个现实痛点：</p>

        <h3>1. 早期的“焊死黑盒”不好干预</h3>
        <p>
          早年 LangChain 把 <code>while</code> 循环打包进 <code>AgentExecutor</code> 黑盒里。真到业务中你想让它“准备调用高危工具前先停下来等我确认”，盒子是焊死的，根本伸不进手去改。
        </p>

        <h3>2. 本地跑脚本 vs 线上跑服务（无状态架构）</h3>
        <p>
          这才是 LangGraph 最核心的价值。假如你的 Agent 跑到一半触发了 <strong>Human-in-the-loop（人工介入）</strong>，停下来等审批，但审批人<strong>两天后</strong>才点同意。本地 <code>while</code> 循环不可能一直卡在服务器内存里干等两天——线上服务必须是<strong>无状态</strong>的，不能靠内存死记进度。
        </p>
        <p>
          LangGraph 用<strong>状态机 + Checkpointer（检查点）</strong>优雅地解决了这个问题，就像打游戏的<strong>存档与读档</strong>：
        </p>
        <ul>
          <li>跑到需要人工确认的节点时，把当前全部状态（State）“存档”进数据库，程序直接退出释放资源；</li>
          <li>两天后点击同意，系统再从数据库“读档”复活，无缝接着往下跑。</li>
        </ul>

        <h2>四、终极悟道：不是当年框架没设计好，而是时代变了</h2>
        <p>复盘到最后，我终于理顺了 AI 框架演进的底层因果线：<strong>模型的能力上限，决定了框架的形态。</strong></p>
        <ul>
          <li><strong>Chain 时代（GPT-3 / 3.5 时期）</strong>：模型还不够聪明，自己循环试错动不动陷入死循环，连 RAG 也是闭眼硬搜的 Naive RAG。在那个阶段，一条直线的 Chain 完全够用。</li>
          <li><strong>Graph / Agent 时代</strong>：推理与 Function Calling 成熟后，大模型终于够格当大脑自己做决策。RAG 进化成会意图路由与重写的 Agentic RAG，Agent 也需要反思、纠错与持久化存档，这才催生了把循环、路由和存档全部摊开给你画的 LangGraph。</li>
        </ul>

        <hr class="art-hr" />
        <p>
          <strong>写在最后：</strong>现在 AI 迭代这么快，真正值钱的不是背 API，而是搞清楚每个架构设计背后到底在解决什么业务痛点、什么时候该搬出哪套工具，剩下的具体代码完全可以放心交给 AI 协作完成。
        </p>
      </div>
    `;
  }

  function renderNotePreview(post, seriesHtml) {
    const node = post.node;
    const pts = (post.points || []).map((p) => `<li>${esc(p)}</li>`).join("");
    return `
      <div class="art-meta">
        <span>${post.date}</span>
        <span>·</span>
        <span>约 ${post.readTime}</span>
        <span>·</span>
        <span>${esc(node.kw)}</span>
      </div>
      <h1 class="art-h1">${esc(post.title)}</h1>
      ${seriesHtml}
      <p class="art-lead">${esc(post.summary)}</p>

      <div class="art-prose">
        <h2>一、演进坐标</h2>
        <p>
          本篇手札归属演进图谱节点 <strong>${node.era.num} ${esc(node.era.title)}（${esc(node.era.year)}）› ${esc(node.title)}</strong>。在这一阶段，行业围绕「${esc(node.era.whisper)}」完成了关键跃迁。
        </p>
        <h2>二、核心要点</h2>
        <ul>${pts}</ul>
        <h2>三、选型自查</h2>
        <p>
          在真实产品中引入 <strong>${esc(node.kw)}</strong> 之前，始终回到“可控性 ↔ 自主性”的根本权衡：能用更简单方案稳稳交付的，绝不为追新名词增加额外复杂度与 Token 损耗。
        </p>
      </div>
    `;
  }

  function syncHash(nextHash) {
    if (suppressHashSync) return;
    try {
      const target = nextHash || "";
      if (window.location.hash !== target) {
        if (target) {
          window.history.pushState(null, "", target);
        } else if (window.location.hash) {
          window.history.pushState(null, "", window.location.pathname + window.location.search);
        }
      }
    } catch (_) {
      // Ignore history restrictions on non-HTTP origins
    }
  }

  function switchView(nextView, options) {
    const opts = options || {};
    state.view = nextView;
    document.body.classList.toggle("view-home", nextView === "home");

    Object.keys(views).forEach((k) => {
      if (views[k]) views[k].classList.toggle("is-visible", k === nextView);
    });

    if (navLinksEl) {
      navLinksEl.querySelectorAll(".nav-btn").forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.view === nextView);
      });
    }

    brushing.clearHoverLinks();
    tooltip.hideTip();
    if (!opts.skipHash) {
      if (nextView === "home") syncHash("");
      else if (nextView === "articles") syncHash("#articles");
      else if (nextView === "about") syncHash("#about");
    }
    if (nextView === "home") requestAnimationFrame(updateColumnScrollMasks);
    if (nextView === "articles") renderArchive();
    if (nextView === "about") renderAbout();
    bus.emit("view:changed", nextView);
  }

  function triggerReturnAfterglow(nodeId) {
    if (!nodeId || !skeletonGridEl) return;
    if (state.afterglowTimer) {
      clearTimeout(state.afterglowTimer);
      state.afterglowTimer = null;
    }
    skeletonGridEl.querySelectorAll(".twig-row.is-just-read").forEach((el) => {
      el.classList.remove("is-just-read");
    });

    const row = skeletonGridEl.querySelector(`.twig-row[data-node-id="${nodeId}"]`);
    if (!row) return;

    brushing.revealTwigInColumn(row.closest(".twig-item"));
    void row.offsetWidth;
    row.classList.add("is-just-read");

    state.afterglowTimer = setTimeout(() => {
      row.classList.remove("is-just-read");
      state.afterglowTimer = null;
    }, 1250);
  }

  function returnToHomeWithAfterglow() {
    const lastId = state.lastReadNodeId;
    switchView("home");
    if (lastId) {
      requestAnimationFrame(() => {
        updateColumnScrollMasks();
        triggerReturnAfterglow(lastId);
      });
    }
  }

  function openArticle(targetId, options) {
    const resolved = resolveTarget(targetId);
    if (!resolved) return;

    const { node, post } = resolved;
    state.lastReadNodeId = node.id;

    const opts = options || {};
    let sameDayPosts = null;
    if (opts.fromDate && state.footprint) {
      const rec = state.footprint.dayMap.get(opts.fromDate);
      if (rec && rec.posts.length > 1) sameDayPosts = rec.posts;
    }

    const pubs = getPublishedPostsForNode(node);
    const seriesSuffix = pubs.length > 1 ? ` · 共 ${pubs.length} 篇` : "";
    if (readerCoordTagEl) {
      readerCoordTagEl.textContent = `${node.era.num} ${node.era.title} › ${node.title}${seriesSuffix}`;
    }

    const seriesHtml = buildSeriesSwitcherHTML(node, post, sameDayPosts);
    const html = post.isFlagship
      ? renderFlagshipEssay(post, seriesHtml)
      : renderNotePreview(post, seriesHtml);

    const allPosts = getAllPublishedPosts();
    const idx = allPosts.findIndex((p) => p.id === post.id);
    const nextPost = allPosts.length > 1 ? allPosts[(idx + 1) % allPosts.length] : null;

    if (readerBodyEl) {
      readerBodyEl.innerHTML =
        html +
        `<div class="art-foot-nav">
          <button class="outline-btn" type="button" id="foot-back-map">← 返回演进图谱</button>
          ${
            nextPost
              ? `<button class="outline-btn" type="button" data-open-article="${nextPost.id}">下一篇：${esc(nextPost.shortTitle)} →</button>`
              : ""
          }
        </div>`;
    }

    switchView("reader", { skipHash: true });
    syncHash(`#post/${encodeURIComponent(post.id)}`);
    window.scrollTo({ top: 0, behavior: "instant" });

    const footBtn = document.getElementById("foot-back-map");
    if (footBtn) {
      footBtn.addEventListener("click", () => returnToHomeWithAfterglow());
    }
  }

  function applyRouteFromHash() {
    const h = window.location.hash || "";
    suppressHashSync = true;
    try {
      if (h === "#articles") {
        switchView("articles", { skipHash: true });
      } else if (h === "#about") {
        switchView("about", { skipHash: true });
      } else if (h.startsWith("#post/")) {
        const postId = decodeURIComponent(h.slice(6));
        if (resolveTarget(postId)) {
          openArticle(postId);
        } else {
          switchView("home", { skipHash: true });
        }
      } else if (state.view !== "home") {
        returnToHomeWithAfterglow();
      }
    } finally {
      suppressHashSync = false;
    }
  }

  if (navLinksEl) {
    navLinksEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".nav-btn[data-view]");
      if (!btn) return;
      switchView(btn.dataset.view);
    });
  }

  document.addEventListener("click", (e) => {
    const switchBtn = e.target.closest("[data-switch-post]");
    if (switchBtn) {
      openArticle(switchBtn.dataset.switchPost, {
        fromDate: switchBtn.dataset.fromDate || null
      });
      return;
    }
    if (e.target.closest(".sub-twig-btn")) return;
    const trigger = e.target.closest("[data-open-article]");
    if (!trigger) return;
    openArticle(trigger.dataset.openArticle);
  });

  if (archiveContentEl) {
    archiveContentEl.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const item = e.target.closest(".archive-item[data-open-article]");
      if (!item) return;
      e.preventDefault();
      openArticle(item.dataset.openArticle);
    });
  }

  if (btnBackMapEl) {
    btnBackMapEl.addEventListener("click", () => returnToHomeWithAfterglow());
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.view !== "home") {
      returnToHomeWithAfterglow();
    }
  });

  if (btnCopyJsonEl) {
    btnCopyJsonEl.addEventListener("click", async () => {
      const text = exportSkeletonJSON();
      const markCopied = () => {
        btnCopyJsonEl.classList.add("is-copied");
        btnCopyJsonEl.textContent = "已复制 JSON";
        setTimeout(() => {
          btnCopyJsonEl.classList.remove("is-copied");
          btnCopyJsonEl.textContent = "一键复制 JSON";
        }, 1800);
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          markCopied();
          return;
        }
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        markCopied();
      } catch (_) {
        btnCopyJsonEl.textContent = "请手动选择复制";
      }
    });
  }

  window.addEventListener("hashchange", applyRouteFromHash);
  window.addEventListener("popstate", applyRouteFromHash);

  return {
    renderArchive,
    renderAbout,
    switchView,
    openArticle,
    returnToHomeWithAfterglow,
    applyRouteFromHash
  };
}
