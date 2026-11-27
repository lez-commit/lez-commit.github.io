(function () {
  "use strict";

  const AgentBlog = (window.AgentBlog = window.AgentBlog || {});
  const AGENT_MAP_DATA = AgentBlog.DATA;
  const NODE_MILESTONES = AgentBlog.NODE_MILESTONES;

  /* =======================================================================
     2. CONSTANTS, NORMALIZED NODE/POST LOOKUPS & STATE
     ======================================================================= */
  const TODAY_ISO = "2026-11-25";
  const CAL_END = new Date(2026, 10, 28); // Saturday of 2026-11-25's week
  const TOTAL_WEEKS = 53;
  const TOTAL_DAYS = TOTAL_WEEKS * 7;     // 371 days
  const CAL_START = new Date(CAL_END);
  CAL_START.setDate(CAL_END.getDate() - (TOTAL_DAYS - 1)); // Sun 2025-11-23

  const NODE_MAP = new Map();
  const POST_MAP = new Map();
  const ALL_NODES = [];

  AGENT_MAP_DATA.eras.forEach((era, eraIdx) => {
    era.nodes.forEach((rawNode) => {
      const rawPosts = Array.isArray(rawNode.posts)
        ? rawNode.posts
        : [
            {
              id: `${rawNode.id}-p1`,
              title: rawNode.articleTitle || rawNode.fullTitle || rawNode.title,
              shortTitle: rawNode.articleTitle || rawNode.title,
              pubStage: rawNode.pubStage,
              isFlagship: !!rawNode.isFlagship,
              date: rawNode.date,
              readTime: rawNode.readTime || "6 min",
              summary: rawNode.summary,
              points: rawNode.points || []
            }
          ];

      const entry = {
        id: rawNode.id,
        title: rawNode.title,
        kw: rawNode.kw,
        milestone: NODE_MILESTONES[rawNode.id] || rawNode.kw,
        summary: rawNode.summary || (rawPosts[0] && rawPosts[0].summary) || "",
        era,
        eraIdx,
        posts: []
      };

      entry.posts = rawPosts.map((p, idx) => {
        const postObj = {
          id: p.id || `${rawNode.id}-p${idx + 1}`,
          nodeId: rawNode.id,
          node: entry,
          era,
          title: p.title || rawNode.title,
          shortTitle: p.shortTitle || rawNode.title,
          pubStage: p.pubStage,
          isFlagship: !!p.isFlagship,
          date: p.date,
          readTime: p.readTime || "6 min",
          summary: p.summary || entry.summary,
          points: p.points || rawNode.points || []
        };
        POST_MAP.set(postObj.id, postObj);
        return postObj;
      });

      NODE_MAP.set(entry.id, entry);
      ALL_NODES.push(entry);
    });
  });

  const state = {
    view: "home",              // "home" | "articles" | "about" | "reader"
    stage: 3,
    lastReadNodeId: null,
    afterglowTimer: null,
    collapsedNodes: new Set()  // multi-post nodes collapsed by user click
  };

  /* DOM Elements */
  const brandHomeBtnEl = document.getElementById("brand-home-btn");
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

  /* =======================================================================
     3. UTILITIES & PURE PUBLISH FOOTPRINT BUILDER
     ======================================================================= */
  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function toISO(dt) {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }


  function getPublishedPostsForNode(node) {
    return node.posts
      .filter((p) => p.pubStage <= state.stage)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  function isPublished(node) {
    return getPublishedPostsForNode(node).length > 0;
  }

  function hasFlagshipPost(node) {
    return getPublishedPostsForNode(node).some((p) => p.isFlagship);
  }

  function getAllPublishedPosts() {
    const list = [];
    ALL_NODES.forEach((node) => {
      getPublishedPostsForNode(node).forEach((p) => list.push(p));
    });
    return list.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id < b.id ? 1 : -1));
  }

  function resolveTarget(targetId) {
    if (!targetId) return null;
    if (POST_MAP.has(targetId)) {
      const post = POST_MAP.get(targetId);
      if (post.pubStage <= state.stage) {
        return { node: post.node, post };
      }
    }
    if (NODE_MAP.has(targetId)) {
      const node = NODE_MAP.get(targetId);
      const pubs = getPublishedPostsForNode(node);
      if (pubs.length > 0) {
        const flagship = pubs.find((p) => p.isFlagship);
        return { node, post: flagship || pubs[0] };
      }
    }
    return null;
  }

  function buildFootprint() {
    const days = [];
    const dayMap = new Map();

    for (let i = 0; i < TOTAL_DAYS; i++) {
      const dt = new Date(CAL_START);
      dt.setDate(CAL_START.getDate() + i);
      const iso = toISO(dt);
      const rec = {
        index: i,
        iso,
        year: dt.getFullYear(),
        month: dt.getMonth() + 1,
        isFuture: iso > TODAY_ISO,
        count: 0,
        level: 0,
        posts: []
      };
      days.push(rec);
      dayMap.set(iso, rec);
    }

    const publishedPosts = getAllPublishedPosts();
    publishedPosts.forEach((post) => {
      const rec = dayMap.get(post.date);
      if (rec && !rec.isFuture) {
        rec.posts.push(post);
        rec.count = rec.posts.length;
        rec.level = rec.count >= 3 ? 3 : rec.count;
      }
    });

    return {
      days,
      dayMap,
      pubPostCount: publishedPosts.length
    };
  }

  let footprint = buildFootprint();

  function defaultReadoutHTML() {
    return `过去一年发布 <strong>${footprint.pubPostCount}</strong> 篇文章`;
  }

  /* =======================================================================
     4. RENDER HOMEPAGE BANDS (Skeleton, GitHub Heatmap, Recent Posts)
     ======================================================================= */
  function updateColumnScrollMasks() {
    skeletonGridEl.querySelectorAll(".era-col").forEach((col) => {
      const lower = col.querySelector(".era-lower");
      if (!lower) return;
      const hasMore =
        lower.scrollHeight > lower.clientHeight + 2 &&
        lower.scrollTop + lower.clientHeight < lower.scrollHeight - 2;
      col.classList.toggle("has-scroll-more", hasMore);
    });
  }

  function renderSkeleton() {
    const colsHtml = AGENT_MAP_DATA.eras
      .map((era) => {
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
              badgeHtml = `<button class="twig-badge" type="button" data-toggle-node="${node.id}" aria-label="折叠或展开文章分支" title="折叠/展开分支">${caret}</button>`;
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

            return `
              <li class="${itemCls}" data-node-id="${node.id}" data-era-id="${era.id}">
                <div class="twig-row" data-node-id="${node.id}">
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

        return `
          <section class="${colCls}" data-era-id="${era.id}">
            <div class="era-lower">
              <ul class="twig-list">${twigsHtml}</ul>
            </div>
            <span class="spine-dot ${spineCls}" aria-hidden="true"></span>
            <header class="era-upper">
              <div class="era-title-row">
                <h2 class="era-title">${esc(era.title)}</h2>
                <span class="era-year">${esc(era.year)}</span>
              </div>
              <p class="era-whisper">${esc(era.whisper)}</p>
            </header>
            <button class="era-scroll-mask" type="button" aria-label="向下滚动查看更多节点">↓ 更多</button>
          </section>
        `;
      })
      .join("");

    skeletonGridEl.innerHTML = `<div class="timeline-spine" aria-hidden="true"></div>${colsHtml}`;

    skeletonGridEl.querySelectorAll(".era-lower").forEach((lower) => {
      lower.addEventListener("scroll", updateColumnScrollMasks, { passive: true });
    });

    requestAnimationFrame(updateColumnScrollMasks);
  }

  function renderFootprint() {
    fpReadoutEl.classList.remove("is-active");
    fpReadoutEl.innerHTML = defaultReadoutHTML();

    const { days } = footprint;
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

    const monthsHtml = monthMarks
      .map((lbl) => `<span class="gh-mlbl">${lbl}</span>`)
      .join("");

    const weekdaysHtml = ["", "一", "", "三", "", "五", ""]
      .map((w) => `<span class="gh-wday">${w}</span>`)
      .join("");

    const squaresHtml = days
      .map((d) => {
        if (d.isFuture) {
          return `<span class="heat-sq is-future" aria-hidden="true"></span>`;
        }
        const hasPosts = d.count > 0;
        const cls = [
          "heat-sq",
          d.level > 0 ? `lvl-${d.level}` : "",
          hasPosts ? "is-clickable" : ""
        ]
          .filter(Boolean)
          .join(" ");

        const nodeIds = Array.from(new Set(d.posts.map((p) => p.nodeId))).join(",");
        const attrs = hasPosts
          ? `data-pub-date="${d.iso}" data-node-ids="${nodeIds}"`
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

  function renderLatestDock() {
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

    dockLatestEl.innerHTML = `
      <div class="recent-head">
        <span class="recent-head-label">最近发布</span>
        <button class="recent-all-btn" type="button" data-jump-view="articles">全部 ${publishedPosts.length} 篇 →</button>
      </div>
      <ul class="recent-list">${listHtml}</ul>
    `;
  }

  /* =======================================================================
     5. RENDER ARCHIVE, ABOUT JSON & ARTICLE READER
     ======================================================================= */
  function renderArchive() {
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
                <div class="${cls}" data-open-article="${p.id}">
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

  function exportSkeletonJSON() {
    const snapshot = {
      blog: AGENT_MAP_DATA.blog,
      subtitle: AGENT_MAP_DATA.subtitle,
      totalPosts: getAllPublishedPosts().length,
      eras: AGENT_MAP_DATA.eras.map((era) => ({
        id: era.id,
        num: era.num,
        year: era.year,
        title: era.title,
        whisper: era.whisper,
        nodes: era.nodes.map((rawNode) => {
          const node = NODE_MAP.get(rawNode.id);
          const pubs = getPublishedPostsForNode(node);
          return {
            id: node.id,
            title: node.title,
            keyword: node.kw,
            status: pubs.length > 0 ? "published" : "planned",
            posts: pubs.map((p) => ({
              id: p.id,
              title: p.title,
              publishedAt: p.date
            }))
          };
        })
      }))
    };
    return JSON.stringify(snapshot, null, 2);
  }

  function renderAbout() {
    jsonPreEl.textContent = exportSkeletonJSON();
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

  <pre><code><span class="c-kw">from</span> langchain_core.prompts <span class="c-kw">import</span> ChatPromptTemplate
  <span class="c-kw">from</span> langchain_openai <span class="c-kw">import</span> ChatOpenAI
  <span class="c-kw">from</span> langchain_core.output_parsers <span class="c-kw">import</span> StrOutputParser

  <span class="c-cmt"># 核心逻辑只写这一遍</span>
  chain = (
ChatPromptTemplate.from_template(<span class="c-str">"用一句话夸夸{topic}"</span>)
| ChatOpenAI()
| StrOutputParser()
  )

  <span class="c-cmt"># 1. 正常用：等它全部生成完吐出来</span>
  print(chain.<span class="c-fn">invoke</span>({<span class="c-str">"topic"</span>: <span class="c-str">"摸鱼"</span>}))

  <span class="c-cmt"># 2. 网页“打字机效果”：直接换 .stream()，不用改任何解析代码</span>
  <span class="c-kw">for</span> chunk <span class="c-kw">in</span> chain.<span class="c-fn">stream</span>({<span class="c-str">"topic"</span>: <span class="c-str">"摸鱼"</span>}):
print(chunk, end=<span class="c-str">""</span>, flush=<span class="c-kw">True</span>)

  <span class="c-cmt"># 3. 批量处理一堆数据：直接换 .batch()，框架自动并发跑完</span>
  results = chain.<span class="c-fn">batch</span>([{<span class="c-str">"topic"</span>: <span class="c-str">"摸鱼"</span>}, {<span class="c-str">"topic"</span>: <span class="c-str">"下班"</span>}, {<span class="c-str">"topic"</span>: <span class="c-str">"发工资"</span>}])

  <span class="c-cmt"># 4. 怕大模型 API 偶尔抽风：套个 .with_retry()，失败自动重试 3 次</span>
  safe_chain = chain.<span class="c-fn">with_retry</span>(stop_after_attempt=3)</code></pre>

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

  function openArticle(targetId, options) {
    const resolved = resolveTarget(targetId);
    if (!resolved) return;

    const { node, post } = resolved;
    state.lastReadNodeId = node.id;

    const opts = options || {};
    let sameDayPosts = null;
    if (opts.fromDate) {
      const rec = footprint.dayMap.get(opts.fromDate);
      if (rec && rec.posts.length > 1) {
        sameDayPosts = rec.posts;
      }
    }

    const pubs = getPublishedPostsForNode(node);
    const seriesSuffix = pubs.length > 1 ? ` · 共 ${pubs.length} 篇` : "";
    readerCoordTagEl.textContent = `${node.era.num} ${node.era.title} › ${node.title}${seriesSuffix}`;

    const seriesHtml = buildSeriesSwitcherHTML(node, post, sameDayPosts);
    const html = post.isFlagship
      ? renderFlagshipEssay(post, seriesHtml)
      : renderNotePreview(post, seriesHtml);

    const allPosts = getAllPublishedPosts();
    const idx = allPosts.findIndex((p) => p.id === post.id);
    const nextPost = allPosts.length > 1 ? allPosts[(idx + 1) % allPosts.length] : null;

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

    switchView("reader", { skipHash: true });
    syncHash(`#post/${encodeURIComponent(post.id)}`);
    window.scrollTo({ top: 0, behavior: "instant" });

    const footBtn = document.getElementById("foot-back-map");
    if (footBtn) {
      footBtn.addEventListener("click", () => returnToHomeWithAfterglow());
    }
  }

  /* =======================================================================
     6. VIEW SWITCHING & RETURN AFTERGLOW FEEDBACK
     ======================================================================= */
  function triggerReturnAfterglow(nodeId) {
    if (!nodeId) return;
    if (state.afterglowTimer) {
      clearTimeout(state.afterglowTimer);
      state.afterglowTimer = null;
    }
    skeletonGridEl.querySelectorAll(".twig-row.is-just-read").forEach((el) => {
      el.classList.remove("is-just-read");
    });

    const row = skeletonGridEl.querySelector(`.twig-row[data-node-id="${nodeId}"]`);
    if (!row) return;

    row.scrollIntoView({ block: "nearest" });
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

  let suppressHashSync = false;

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
    } catch (e) {
      // Ignore history restrictions on file:// origins
    }
  }

  function switchView(nextView, options) {
    const opts = options || {};
    state.view = nextView;
    document.body.classList.toggle("view-home", nextView === "home");

    Object.keys(views).forEach((k) => {
      views[k].classList.toggle("is-visible", k === nextView);
    });

    navLinksEl.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.view === nextView);
    });

    clearHoverLinks();
    hideTip();
    if (!opts.skipHash) {
      if (nextView === "home") syncHash("");
      else if (nextView === "articles") syncHash("#articles");
      else if (nextView === "about") syncHash("#about");
    }
    if (nextView === "home") requestAnimationFrame(updateColumnScrollMasks);
    if (nextView === "articles") renderArchive();
    if (nextView === "about") renderAbout();
  }

  /* =======================================================================
     7. BIDIRECTIONAL BRUSHING & LINKING + QUIET TOOLTIP
     ======================================================================= */
  function clearHoverLinks() {
    document
      .querySelectorAll(".is-linked-era, .is-linked-twig, .is-linked-sq")
      .forEach((el) => el.classList.remove("is-linked-era", "is-linked-twig", "is-linked-sq"));
  }

  function resetReadout() {
    fpReadoutEl.classList.remove("is-active");
    fpReadoutEl.innerHTML = defaultReadoutHTML();
  }

  function showTip(html, targetEl) {
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
    tipEl.classList.remove("is-visible");
  }

  function highlightFromTwig(nodeId) {
    clearHoverLinks();
    const node = NODE_MAP.get(nodeId);
    if (!node) return;
    const pubs = getPublishedPostsForNode(node);
    if (pubs.length === 0) return;

    pubs.forEach((p) => {
      const sq = fpCanvasEl.querySelector(`.heat-sq[data-iso="${p.date}"]`);
      if (sq) sq.classList.add("is-linked-sq");
    });

    fpReadoutEl.classList.add("is-active");
    if (pubs.length > 1) {
      fpReadoutEl.innerHTML = `<strong>${esc(node.title)}</strong> · 收录 <strong>${pubs.length}</strong> 篇（最新 ${pubs[0].date}）`;
    } else {
      fpReadoutEl.innerHTML = `<strong>${pubs[0].date}</strong> · 发布《${esc(pubs[0].shortTitle)}》`;
    }
  }

  function highlightFromSquare(dayRec) {
    clearHoverLinks();
    if (!dayRec || dayRec.isFuture) {
      resetReadout();
      return;
    }

    if (dayRec.count === 0) {
      fpReadoutEl.classList.add("is-active");
      fpReadoutEl.innerHTML = `${dayRec.iso} · 无发布`;
      return;
    }

    const titles = dayRec.posts.map((p) => `《${esc(p.shortTitle)}》`).join("");
    let scrolledOnce = false;
    dayRec.posts.forEach((p) => {
      const node = p.node;
      if (node && isPublished(node)) {
        const eraEl = skeletonGridEl.querySelector(`.era-col[data-era-id="${node.era.id}"]`);
        const twigEl = skeletonGridEl.querySelector(`.twig-item[data-node-id="${node.id}"]`);
        if (eraEl) eraEl.classList.add("is-linked-era");
        if (twigEl) {
          twigEl.classList.add("is-linked-twig");
          if (!scrolledOnce) {
            scrolledOnce = true;
            twigEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
          }
        }
      }
    });

    fpReadoutEl.classList.add("is-active");
    fpReadoutEl.innerHTML = `<strong>${dayRec.iso}</strong> · 发布 ${dayRec.count} 篇：${titles}`;
  }

  /* =======================================================================
     8. MASTER RENDER & EVENT LISTENERS
     ======================================================================= */
  function renderAll() {
    footprint = buildFootprint();
    renderSkeleton();
    renderFootprint();
    renderLatestDock();
    if (state.view === "articles") renderArchive();
    if (state.view === "about") renderAbout();
  }

  if (brandHomeBtnEl) {
    brandHomeBtnEl.addEventListener("click", () => {
      if (state.view !== "home") {
        returnToHomeWithAfterglow();
      }
    });
  }

  navLinksEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-btn[data-view]");
    if (!btn) return;
    switchView(btn.dataset.view);
  });

  // Recent Posts 3-Way Brushing (illuminates heatmap square + knowledge-graph twig + readout!)
  dockLatestEl.addEventListener("mouseover", (e) => {
    const btn = e.target.closest(".recent-item-btn[data-open-article]");
    if (!btn) return;
    const post = POST_MAP.get(btn.dataset.openArticle);
    if (!post) return;
    clearHoverLinks();
    const sq = fpCanvasEl.querySelector(`.heat-sq[data-iso="${post.date}"]`);
    if (sq) sq.classList.add("is-linked-sq");
    const eraEl = skeletonGridEl.querySelector(`.era-col[data-era-id="${post.era.id}"]`);
    const twigEl = skeletonGridEl.querySelector(`.twig-item[data-node-id="${post.nodeId}"]`);
    if (eraEl) eraEl.classList.add("is-linked-era");
    if (twigEl) {
      twigEl.classList.add("is-linked-twig");
      twigEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    fpReadoutEl.classList.add("is-active");
    fpReadoutEl.innerHTML = `<strong>${post.date}</strong> · ${esc(post.era.title)} › 《${esc(post.shortTitle)}》`;
  });

  dockLatestEl.addEventListener("mouseout", (e) => {
    if (!dockLatestEl.contains(e.relatedTarget)) {
      clearHoverLinks();
      resetReadout();
    } else {
      const leftBtn = e.target.closest(".recent-item-btn");
      const enteredBtn = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".recent-item-btn");
      if (leftBtn && !enteredBtn) {
        clearHoverLinks();
        resetReadout();
      }
    }
  });

  // Twig & Sub-twig Hover
  skeletonGridEl.addEventListener("mouseover", (e) => {
    const subBtn = e.target.closest(".sub-twig-btn[data-open-article]");
    if (subBtn) {
      const post = POST_MAP.get(subBtn.dataset.openArticle);
      if (post) {
        clearHoverLinks();
        const sq = fpCanvasEl.querySelector(`.heat-sq[data-iso="${post.date}"]`);
        if (sq) sq.classList.add("is-linked-sq");
        fpReadoutEl.classList.add("is-active");
        fpReadoutEl.innerHTML = `<strong>${post.date}</strong> · 发布《${esc(post.shortTitle)}》`;
      }
      hideTip();
      return;
    }

    const row = e.target.closest(".twig-row[data-node-id]");
    if (!row) return;
    const node = NODE_MAP.get(row.dataset.nodeId);
    if (!node) return;

    const pubs = getPublishedPostsForNode(node);
    if (pubs.length > 0) {
      highlightFromTwig(node.id);
      const hint = pubs.length === 1 ? "已收录 1 篇 · 点击直达阅读" : `已收录 ${pubs.length} 篇 · 点击展开/折叠`;
      showTip(`<div class="qt-meta">${esc(node.milestone)}</div><div>${hint}</div>`, row);
    } else {
      clearHoverLinks();
      resetReadout();
      showTip(`<div class="qt-meta">${esc(node.milestone)}</div><div>待研写 · 规划节点</div>`, row);
    }
  });

  skeletonGridEl.addEventListener("mouseout", (e) => {
    if (!skeletonGridEl.contains(e.relatedTarget)) {
      clearHoverLinks();
      resetReadout();
      hideTip();
    } else {
      const leftRow = e.target.closest(".twig-row, .sub-twig-btn");
      const enteredRow = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".twig-row, .sub-twig-btn");
      if (leftRow && !enteredRow) {
        clearHoverLinks();
        resetReadout();
        hideTip();
      }
    }
  });

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
      }
    }
    requestAnimationFrame(updateColumnScrollMasks);
  }

  // Twig Click: scroll-more pill scrolls column; caret toggles collapse; single-post row opens directly; multi-post row toggles!
  skeletonGridEl.addEventListener("click", (e) => {
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
    if (!row) return;
    const node = NODE_MAP.get(row.dataset.nodeId);
    if (!node) return;

    const pubs = getPublishedPostsForNode(node);
    if (pubs.length === 0) return;

    if (pubs.length === 1) {
      openArticle(pubs[0].id);
      return;
    }
    toggleNodeBranch(node.id, row.closest(".twig-item"));
  });

  // GitHub Heatmap Hover & Click
  fpCanvasEl.addEventListener("mouseover", (e) => {
    const sq = e.target.closest(".heat-sq[data-iso]");
    if (!sq) return;
    const rec = footprint.dayMap.get(sq.dataset.iso);
    if (!rec || rec.isFuture) return;

    highlightFromSquare(rec);
    if (rec.count > 0) {
      const titles = rec.posts.map((p) => `《${esc(p.shortTitle)}》`).join("");
      showTip(
        `<div class="qt-meta">${rec.iso} · 发布 ${rec.count} 篇</div><div>${titles}</div>`,
        sq
      );
    } else {
      showTip(`<div>${rec.iso} · 无发布</div>`, sq);
    }
  });

  fpCanvasEl.addEventListener("mouseout", (e) => {
    if (!fpCanvasEl.contains(e.relatedTarget)) {
      clearHoverLinks();
      resetReadout();
      hideTip();
    }
  });

  fpCanvasEl.addEventListener("click", (e) => {
    const sq = e.target.closest(".heat-sq[data-pub-date]");
    if (!sq) return;
    const rec = footprint.dayMap.get(sq.dataset.pubDate);
    if (!rec || rec.posts.length === 0) return;

    openArticle(rec.posts[0].id, { fromDate: rec.iso });
  });

  // Delegated clicks for Recent Posts, Archive rows, Reader next button & Series switchers
  document.addEventListener("click", (e) => {
    const jumpViewBtn = e.target.closest("[data-jump-view]");
    if (jumpViewBtn) {
      switchView(jumpViewBtn.dataset.jumpView);
      return;
    }

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

  btnBackMapEl.addEventListener("click", () => returnToHomeWithAfterglow());

  // Escape key returns cleanly from reader/subpages to the homepage map!
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.view !== "home") {
      returnToHomeWithAfterglow();
    }
  });

  // Sync browser Back/Forward & deep links (#articles, #about, #post/<id>)
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
  window.addEventListener("hashchange", applyRouteFromHash);
  window.addEventListener("popstate", applyRouteFromHash);

  window.addEventListener("resize", () => {
    if (state.view === "home") {
      requestAnimationFrame(updateColumnScrollMasks);
    }
  });

  // Copy JSON Skeleton (Modern Clipboard API with graceful fallback)
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
    } catch (err) {
      btnCopyJsonEl.textContent = "请手动选择复制";
    }
  });

  // Expose lightweight hooks for animation modules
  AgentBlog.getView = () => state.view;
  AgentBlog.switchView = switchView;

  renderAll();
  if (window.location.hash) {
    applyRouteFromHash();
  }
})();
