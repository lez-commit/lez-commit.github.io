import { AGENT_MAP_DATA, NODE_MILESTONES } from "../data/map-data.js";
import { toISO } from "./utils.js";

export const TODAY_ISO = "2026-11-25";
export const CAL_END = new Date(2026, 10, 28); // Saturday of 2026-11-25's week
export const TOTAL_WEEKS = 53;
export const TOTAL_DAYS = TOTAL_WEEKS * 7; // 371 days
export const CAL_START = new Date(CAL_END);
CAL_START.setDate(CAL_END.getDate() - (TOTAL_DAYS - 1)); // Sun 2025-11-23

export const NODE_MAP = new Map();
export const POST_MAP = new Map();
export const ALL_NODES = [];

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

export const state = {
  view: "home", // "home" | "articles" | "about" | "reader"
  stage: 3,
  lastReadNodeId: null,
  afterglowTimer: null,
  collapsedNodes: new Set(),
  footprint: null
};

export function getPublishedPostsForNode(node) {
  return node.posts
    .filter((p) => p.pubStage <= state.stage)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function isPublished(node) {
  return getPublishedPostsForNode(node).length > 0;
}

export function hasFlagshipPost(node) {
  return getPublishedPostsForNode(node).some((p) => p.isFlagship);
}

export function getAllPublishedPosts() {
  const list = [];
  ALL_NODES.forEach((node) => {
    getPublishedPostsForNode(node).forEach((p) => list.push(p));
  });
  return list.sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : a.id < b.id ? 1 : -1
  );
}

export function resolveTarget(targetId) {
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

export function buildFootprint() {
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

  state.footprint = { days, dayMap, pubPostCount: publishedPosts.length };
  return state.footprint;
}

export function exportSkeletonJSON() {
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

buildFootprint();
