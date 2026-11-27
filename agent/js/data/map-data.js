
  /* =======================================================================
     1. SINGLE SOURCE OF TRUTH: AGENT_MAP_DATA (5 Eras · 32 Nodes · 35 Posts)
        - 5 columns: 5, 6, 6, 7, 8 nodes
        - Growth stages:
            stage 1 — 实况: 1 real flagship post (2026-11-20)
            stage 2 — 半年: 18 posts across 5 eras (incl. multi-post nodes & 2-post day)
            stage 3 — 满载: 35 posts across all 32 nodes (incl. 2-post & 3-post days)
     ======================================================================= */
export const AGENT_MAP_DATA = {
    blog: "Agent 演进手札",
    subtitle: "以时间轴为骨，以长文为血肉",
    readingNow: "Context Engineering & LLM Wiki",
    eras: [
      {
        id: "era-01",
        num: "01",
        year: "1950s–2016",
        title: "规则与 RPA 期",
        whisper: "按脚本跑，无大脑",
        nodes: [
          {
            id: "n01",
            title: "专家系统",
            articleTitle: "专家系统与死规则边界",
            kw: "Symbolic AI",
            pubStage: 2,
            date: "2026-06-12",
            readTime: "6 min",
            summary: "早年专家系统试图把人类经验穷举成 if-else 规则树，却在真实世界的长尾例外面前迅速崩溃。",
            points: [
              "封闭确定性规则（如财务对账、合规校验）依然应该用传统代码写死，而非浪费大模型。",
              "规则树的维护成本会随例外分支呈指数级膨胀，这是符号主义难以跨越的天花板。",
              "看懂规则边界，才能在实战里克制地决定哪些环节交给代码、哪些交给模型。"
            ]
          },
          {
            id: "n01b",
            title: "有限状态机 FSM",
            articleTitle: "有限状态机与确定性编排",
            kw: "FSM",
            pubStage: 3,
            date: "2026-01-12",
            readTime: "6 min",
            summary: "经典状态机用显式状态与迁移表驯服复杂业务流，也是现代图编排框架（如 LangGraph）的精神前身。",
            points: [
              "显式枚举状态节点与合法迁移路径，能把不可控的隐式副作用收敛到可测试、可回放的轨道上。",
              "当业务存在审批挂起、失败补偿与超时回滚时，状态机远比散落的回调逻辑更稳健。"
            ]
          },
          {
            id: "n02",
            title: "RPA 自动化",
            articleTitle: "RPA 脚本为何脆弱",
            kw: "RPA",
            pubStage: 2,
            date: "2026-07-04",
            readTime: "7 min",
            summary: "RPA 早已让软件能自动点鼠标填表，为什么网页按钮挪动十像素整条产线就会原地罢工？",
            points: [
              "RPA 依赖固定坐标或 DOM 路径回放，优点是极快、便宜且 100% 可复现。",
              "缺乏语义理解能力，导致任何异常弹窗或界面微调都会瞬间中断执行。",
              "今天构建自动化流程时，固定高频路径用代码/RPA，非结构化突发决策再引入 Agent。"
            ]
          },
          {
            id: "n02b",
            title: "工作流 DAG",
            articleTitle: "规则引擎与工作流 DAG",
            kw: "Workflow DAG",
            pubStage: 2,
            date: "2026-06-24",
            readTime: "6 min",
            summary: "Airflow、BPMN 与传统规则引擎早已把确定性编排做到极致，看清 DAG 边界才能避免把一切问题硬做成 Agent。",
            points: [
              "有向无环图（DAG）天然擅长处理并行依赖、定时调度与幂等重试，且运行成本几乎为零。",
              "只有当节点之间需要语义判断、动态路由或不确定步数探索时，才值得引入大模型。"
            ]
          },
          {
            id: "n03",
            title: "传统多智能体",
            articleTitle: "从规则到泛化的鸿沟",
            kw: "History",
            pubStage: 3,
            date: "2026-01-22",
            readTime: "5 min",
            summary: "多智能体理论早在 80 年代就写进了教材，真正让 Agent 卡壳半个世纪的只是缺一颗通用大脑。",
            points: [
              "软件工程从不缺调用外部系统的“手脚”，缺的是能泛化处理未知指令的推理内核。",
              "以史为镜：现代 Agent 浪潮的本质是通用语言模型补齐了最后一块大脑拼图。"
            ]
          }
        ]
      },
      {
        id: "era-02",
        num: "02",
        year: "2017–2022",
        title: "通用大脑诞生",
        whisper: "缸中之脑，会推理",
        nodes: [
          {
            id: "n04",
            title: "Transformer",
            articleTitle: "Transformer 注意力直觉",
            kw: "Foundation",
            pubStage: 3,
            date: "2026-02-10",
            readTime: "8 min",
            summary: "跳过繁杂矩阵推导，从架构师视角理解 Self-Attention 为何既赋予了语言智能，也埋下了“桌面有限”的物理约束。",
            points: [
              "上下文窗口变大不等于注意力无限——无关噪声越多，关键指令的权重越容易被稀释。",
              "后来的上下文工程、Skills 渐进披露与多 Agent 隔离，底层全是在保护注意力的信噪比。"
            ]
          },
          {
            id: "n04b",
            title: "SFT 与 RLHF",
            articleTitle: "预训练、SFT 与 RLHF 对齐",
            kw: "Alignment",
            pubStage: 3,
            date: "2026-02-18",
            readTime: "7 min",
            summary: "从只会续写文本的统计机器到听懂指令的助手：预训练注入世界知识，SFT 教对话格式，RLHF 对齐人类偏好。",
            points: [
              "理解后训练（Post-training）的边界，就能明白为何有些风格能靠 Prompt 扭转，而有些领域能力必须微调。",
              "工具调用与拒绝越权行为，本质上都是后训练阶段刻意强化的行为分布。"
            ]
          },
          {
            id: "n05",
            title: "上下文学习 ICL",
            articleTitle: "上下文学习 ICL 原理",
            kw: "ICL",
            pubStage: 2,
            date: "2026-07-23",
            readTime: "6 min",
            summary: "不用重新训练权重，光靠上下文里的指令和示例就能让模型学会新规矩，彻底改写了软件构建方式。",
            points: [
              "In-Context Learning 让自然语言成为最高层的编排胶水，极大降低了智能应用门槛。",
              "Few-shot 示例本质上是在有限桌面里为模型锚定输出分布与风格边界。"
            ]
          },
          {
            id: "n05b",
            title: "思维链 CoT",
            articleTitle: "CoT 思维链与分步推理",
            kw: "CoT",
            pubStage: 2,
            date: "2026-08-01",
            readTime: "6 min",
            summary: "让模型把草稿纸摊在输出里：Chain-of-Thought 揭示了用推理期额外 Token 换取复杂逻辑正确率的底层规律。",
            points: [
              "一步直出答案时模型只有固定层数的前向计算；展开中间步骤相当于给自己开辟了外部工作记忆。",
              "从显式 Prompt 诱导 CoT 到后来内化进推理模型，本质一脉相承。"
            ]
          },
          {
            id: "n06",
            title: "ReAct 闭环",
            articleTitle: "ReAct 边想边做闭环",
            kw: "ReAct",
            pubStage: 2,
            date: "2026-08-11",
            readTime: "9 min",
            summary: "Thought → Action → Observation。短短三步交错循环，成为今天所有现代 Agent 跳动不息的心脏。",
            points: [
              "把思考与外部工具观察交织在一起，第一次让模型能对照真实反馈修正幻觉。",
              "无论外围封装多么复杂，Coding Agent 与 Deep Research 的底层骨架依然是 ReAct 循环。"
            ]
          },
          {
            id: "n07",
            title: "Prompt 工程",
            articleTitle: "Prompt 工程的核心范式",
            kw: "Prompt",
            pubStage: 3,
            date: "2026-02-28",
            readTime: "6 min",
            summary: "脱离玄学咒语，把 Prompt 工程还原成清晰的接口契约：角色边界、输入结构、反例约束与输出格式。",
            points: [
              "好的提示词不是写长篇大论，而是消除业务语境里的歧义与隐性假设。",
              "当系统提示词膨胀到数千字还压不住翻车时，说明该升级到工作流拆解或 Skills 了。"
            ]
          }
        ]
      },
      {
        id: "era-03",
        num: "03",
        year: "2023",
        title: "野蛮生长与撞墙",
        whisper: "撞墙试错，接工具",
        nodes: [
          {
            id: "n08",
            title: "AutoGPT",
            articleTitle: "AutoGPT 狂潮与失控复盘",
            kw: "AutoGPT",
            pubStage: 3,
            date: "2026-03-14",
            readTime: "7 min",
            summary: "2023 年春天的全自动 Agent 神话很快演变成死循环与天价账单，而那次集体撞墙逼出了务实的工程派。",
            points: [
              "当单步推理只有 80% 稳定度时，连续 10 步全自动执行的成功率会指数衰减到不足 11%。",
              "行业自此清醒：架构选型不是越自主越好，而是在可控性与自主性之间找平衡点。"
            ]
          },
          {
            id: "n09",
            title: "Chain 管道",
            articleTitle: "Chain 为什么是一条直线",
            kw: "Chain",
            pubStage: 2,
            date: "2026-08-29",
            readTime: "6 min",
            summary: "步骤固定、不需要 AI 拐弯的任务，一条单向管道不仅最稳最省钱，还能白嫖流式输出、并发批处理与自动重试。",
            points: [
              "逻辑只写一遍，通过 .stream()、.batch()、.with_retry() 一键切换线上工程能力。",
              "选型保底铁律：能用直线 Chain 稳定交付的任务，绝不放任 Agent 自由发挥。"
            ]
          },
          {
            id: "n10",
            title: "Naive RAG",
            articleTitle: "Naive RAG 检索流水线",
            kw: "RAG",
            pubStage: 3,
            date: "2026-03-29",
            readTime: "7 min",
            summary: "切片、向量化、Top-K 召回、拼接回答——傻瓜版 RAG 虽不完美，但在文档规整的场景里仍是性价比之王。",
            points: [
              "Naive RAG 的典型短板是不分青红皂白硬搜，且召回质量差时没有纠错回头路。",
              "落地时先做好文档清洗与合理分块，往往比盲目换更贵的向量库有效十倍。"
            ]
          },
          {
            id: "n10b",
            title: "混合检索 & Rerank",
            articleTitle: "Embedding 与混合检索基础",
            kw: "Hybrid Search",
            pubStage: 2,
            date: "2026-09-06",
            readTime: "7 min",
            summary: "纯向量检索擅长语义泛化却常漏掉专有名词与错误码：BM25 关键词 + 向量召回 + Rerank 重排是生产检索的稳妥基线。",
            points: [
              "RRF（倒数排名融合）能在不调复杂权重的前提下，把字面精确匹配与语义相似度自然合并。",
              "先粗召回再交由 Cross-Encoder Reranker 精排，能显著减少喂进大模型上下文的噪声段落。"
            ]
          },
          {
            id: "n11",
            title: "Function Calling",
            articleTitle: "Function Calling 与 JSON",
            kw: "Tools",
            pubStage: 2,
            date: "2026-09-14",
            readTime: "7 min",
            summary: "在能稳定吐出严格 Schema 的 JSON 之前，大模型只是会写散文的诗人；结构化输出让它第一次真正长出可靠的“手”。",
            points: [
              "许多看似需要复杂 Agent 的业务，其实只需模型稳定吐出结构化 JSON 交给传统代码分支执行。",
              "强类型 Schema 约束是从源头消灭解析报错、衔接确定性后端的最轻量方案。"
            ]
          },
          {
            id: "n11b",
            title: "对话记忆与窗口",
            articleTitle: "多轮对话状态与窗口截断",
            kw: "Chat Memory",
            pubStage: 3,
            date: "2026-04-03",
            readTime: "6 min",
            summary: "早期对话系统靠拼接全量历史维持连贯性，一旦触及上下文上限，滑动窗口与滚动摘要成为第一代工程补丁。",
            points: [
              "简单按轮次截断容易把用户最早交代的核心约束一起丢掉，导致中后期答非所问。",
              "把系统规范、核心事实与近期对话分层管理，是迈向系统化上下文工程的第一步。"
            ]
          }
        ]
      },
      {
        id: "era-04",
        num: "04",
        year: "2024",
        title: "从聊天到干活",
        whisper: "手眼脑通，状态机",
        nodes: [
          {
            id: "n12",
            title: "LangGraph 状态机",
            kw: "LangGraph",
            summary: "分清“乐高积木”与“拼装方式”，从线上无状态架构彻底看懂状态机与 Checkpointer 存档演进。",
            posts: [
              {
                id: "n12-p1",
                title: "从一脸懵到彻底通透：为什么说 LangChain 是“直线”，以及我们为什么需要 LangGraph？",
                shortTitle: "从 LangChain 到 LangGraph 彻底通透",
                pubStage: 1,
                isFlagship: true,
                date: "2026-11-20",
                readTime: "8 min",
                summary: "分清“乐高积木”与“拼装方式”，从线上无状态架构彻底看懂 Checkpointer 存档与模型能力驱动框架演进的底层规律。"
              },
              {
                id: "n12-p2",
                title: "Checkpointer 实战手记：用“存档与读档”跑通跨天人工审批（Human-in-the-loop）",
                shortTitle: "Checkpointer 跨天人工审批实战手记",
                pubStage: 2,
                date: "2026-11-23",
                readTime: "6 min",
                summary: "当业务需要人工确认高危操作、而审批人两天后才点同意时，如何用 thread_id 与持久化检查点实现无状态挂起与恢复。",
                points: [
                  "线上后端服务必须保持无状态，绝不能靠本地 while 循环在内存里阻塞等待人工响应。",
                  "interrupt_before 在触发敏感工具前将完整 State 序列化入库，释放全部计算资源。",
                  "携带同一 thread_id 恢复执行时，图状态机从断点精准续跑，天然支持审计回溯与分支重演。"
                ]
              }
            ]
          },
          {
            id: "n13",
            title: "Agentic RAG",
            articleTitle: "Agentic RAG 意图路由",
            kw: "Agentic RAG",
            pubStage: 2,
            date: "2026-09-28",
            readTime: "7 min",
            summary: "不再对一句“你好”也强行搜库：先做意图路由，检索后自评相关性，不满意就重写查询再打回去重搜。",
            points: [
              "把检索降级成 Agent 可按需多次调用的工具，彻底打通了“查不到就换词重查”的闭环。",
              "多出的路由与评估步会增加延迟，建议在复杂知识问答场景才从 Naive RAG 升级。"
            ]
          },
          {
            id: "n13b",
            title: "Workflow 五大模式",
            articleTitle: "工作流编排五大设计模式",
            kw: "Workflow Patterns",
            pubStage: 2,
            date: "2026-10-14",
            readTime: "7 min",
            summary: "拆解生产中最常用的五种 LLM 编排模式：链式、路由、并行、编排器-执行者、评估优化循环，以及何时才该上真 Agent。",
            points: [
              "绝大多数业务问题落在可控的工作流模式里，比开放式 Agent 更易调试且延迟稳定。",
              "评估-优化循环（Evaluator-Optimizer）特别适合有明确验收标准的写作、代码与翻译任务。"
            ]
          },
          {
            id: "n14",
            title: "MCP 协议",
            kw: "MCP",
            summary: "AI 界的 Type-C 标准接口：靠统一协议与自动服务发现终结胶水代码，但也必须警惕插满工具撑爆桌面。",
            posts: [
              {
                id: "n14-p1",
                title: "MCP 统一工具插座：为什么说它是 AI 界的 Type-C 与“自动报菜名”？",
                shortTitle: "MCP 统一工具插座与服务发现",
                pubStage: 2,
                date: "2026-10-14",
                readTime: "8 min",
                summary: "AI 界的 Type-C 标准接口：靠统一协议与自动服务发现终结每个平台重写一遍 Tool 胶水代码的噩梦。",
                points: [
                  "连数据库或外部 SaaS 时先查现成 MCP Server 直接插拔，避免每个框架重复封装 Tool。",
                  "MCP Server 连上即自动递交工具 Schema 菜单，省去手动维护接口说明书的负担。"
                ]
              },
              {
                id: "n14-p2",
                title: "MCP 踩坑实录：一口气插十几个 Server 是怎么把上下文桌面撑爆的？",
                shortTitle: "MCP 工具膨胀与按需挂载避坑",
                pubStage: 3,
                date: "2026-10-19",
                readTime: "5 min",
                summary: "每个 MCP Server 动辄暴露二三十个工具定义，还没开口提问就先烧掉上万 Token 并严重干扰选工具准确率。",
                points: [
                  "工具说明书全量驻留上下文会稀释注意力，工具超过 30 个时模型选错参数的概率陡增。",
                  "实战解法：按业务场景裁剪工具子集，或将低频外部操作收敛为按需执行的脚本 + Skill。"
                ]
              }
            ]
          },
          {
            id: "n15",
            title: "Computer Use",
            articleTitle: "Computer Use 看屏操作",
            kw: "GUI Agent",
            pubStage: 3,
            date: "2026-04-18",
            readTime: "6 min",
            summary: "多模态让 Agent 长出了眼睛——当面对压根没有 API 和 MCP 的老旧软件时，直接看截图点鼠标成了最强兜底。",
            points: [
              "选型次序不可颠倒：有 API/MCP 优先调接口，无接口可走时才动用视觉看屏操作。",
              "相比早年 RPA，视觉模型能在界面微调或突发弹窗时临场识别并继续推进任务。"
            ]
          },
          {
            id: "n15b",
            title: "Coding Agent",
            articleTitle: "Coding Agent 与终端闭环",
            kw: "Coding Agent",
            pubStage: 3,
            date: "2026-04-18",
            readTime: "8 min",
            summary: "从行内补全到自主读仓、改文件、跑单测、看报错再修复：命令行与文件系统为何是 Agent 最天然的操作系统。",
            points: [
              "编译器与单元测试提供了零成本、高确定性的真实环境反馈，极大拉高了多步自主执行上限。",
              "grep、diff、git 等 Unix 文本原语天然契合语言模型的读写方式，比图形界面高效数倍。"
            ]
          },
          {
            id: "n16",
            title: "推理模型",
            articleTitle: "推理模型与长程规划",
            kw: "Reasoning",
            pubStage: 3,
            date: "2026-04-26",
            readTime: "7 min",
            summary: "当模型学会在动手前先内部打草稿，复杂拆解与长程纠错首次跨过可用线，外围编排也随之变得更轻盈。",
            points: [
              "强推理模型适合高难度规划与架构判断，但延迟和费用较高，切忌拿来做简单分类。",
              "模型越聪明，越不需要在 Prompt 里手把手写死细碎思维链步骤。"
            ]
          }
        ]
      },
      {
        id: "era-05",
        num: "05",
        year: "2025–2026",
        title: "驾驭工程与产品化",
        whisper: "卷马具，进生产",
        nodes: [
          {
            id: "n17",
            title: "上下文工程",
            kw: "Context",
            summary: "发现 Agent 越跑越傻、开始忘规矩时，别光死磕改 Prompt——优先清理长历史和脏工具日志，把高信噪比还给桌面。",
            posts: [
              {
                id: "n17-p1",
                title: "上下文工程导论：为什么参数几千亿的大模型，干活时的“注意力桌面”依然很窄？",
                shortTitle: "上下文腐化与注意力信噪比",
                pubStage: 2,
                date: "2026-10-29",
                readTime: "9 min",
                summary: "区分参数长期知识与短期注意力手电筒：当历史对话和报错堆满桌面，信噪比崩塌才是 Agent 越跑越笨的元凶。",
                points: [
                  "长窗口不等于零衰减，冗余中间态会同时拉低指令遵循度、推高账单并拖慢首字延迟。",
                  "把上下文工程视为“大模型的专职秘书”：每轮推理前精准决定桌上留什么、撤什么。"
                ]
              },
              {
                id: "n17-p2",
                title: "清理桌面的三把手术刀：阶段压缩、文件卸载与过期工具日志裁剪",
                shortTitle: "清理上下文桌面的三把手术刀",
                pubStage: 2,
                date: "2026-11-03",
                readTime: "7 min",
                summary: "不改半句核心 Prompt，靠 Compaction、Scratchpad 文件落盘与旧 Observation 清理让长程任务稳如磐石。",
                points: [
                  "阶段压缩（Compaction）：子目标完成后浓缩为结构化交接摘要，丢弃流水账过程。",
                  "文件系统卸载：大段网页原文与长 JSON 落盘保存，上下文中仅保留文件路径与摘要索引。"
                ]
              }
            ]
          },
          {
            id: "n18",
            title: "Agent Skills",
            articleTitle: "Skills 渐进式披露手册",
            kw: "Skills",
            pubStage: 2,
            date: "2026-11-09",
            readTime: "7 min",
            summary: "MCP 管的是“手脚能连谁”，Skills 管的是“干活有没有章法”。平时只留薄目录卡，真开工才按需抽对应 SOP。",
            points: [
              "把写稿、画图、评审等老手标准封装成按需加载的技能手册，彻底告别臃肿系统提示词。",
              "渐进式披露让 Agent 既能掌握几十套专业套路，又不至于把有限桌面撑爆。"
            ]
          },
          {
            id: "n18b",
            title: "Prompt Caching",
            articleTitle: "Prompt Caching 与成本延迟",
            kw: "Prompt Cache",
            pubStage: 2,
            date: "2026-11-14",
            readTime: "7 min",
            summary: "前缀缓存命中率直接决定多轮 Agent 的真实账单与首字延迟：静态指令前置、工具定义稳定化与模型分级路由实战。",
            points: [
              "别在 System Prompt 开头塞秒级动态时间戳——一次前缀抖动会让整轮 KV Cache 全部失效。",
              "高命中缓存 + 简单子任务路由小模型，能把长程 Agent 的运行成本压低 60% 以上。"
            ]
          },
          {
            id: "n19",
            title: "Multi-Agent 隔离",
            articleTitle: "Multi-Agent 上下文隔离",
            kw: "Multi-Agent",
            pubStage: 3,
            date: "2026-05-08",
            readTime: "8 min",
            summary: "拆多 Agent 的核心绝不是过家家式角色扮演，而是把脏数据留在子桌子上，同时引入独立质检左右互搏。",
            points: [
              "子 Agent 啃完十几篇杂乱网页只向主脑汇报精炼结论，防止主上下文被瞬间淹没。",
              "严防过度设计：能用“单 Agent + MCP + Skills”稳拿下的场景，坚决不硬拆多 Agent。"
            ]
          },
          {
            id: "n20",
            title: "长期记忆 & LLM Wiki",
            articleTitle: "长期记忆遗忘与 LLM Wiki",
            kw: "Memory",
            pubStage: 3,
            date: "2026-05-28",
            readTime: "9 min",
            summary: "只记不忘就是慢性记忆污染。分清存档、RAG 与带遗忘衰减的记忆，再看 LLM Wiki 如何把“查时现拼”变为“存时消化”。",
            points: [
              "遗忘在工程上是垃圾回收：分清临时状态与长期偏好，按时间衰减和事实冲突动态覆盖。",
              "LLM Wiki 让模型在写入资料时就编织成互链 Markdown 百科，极大减轻查询期推理负担。"
            ]
          },
          {
            id: "n21",
            title: "沙箱与 Evals",
            articleTitle: "安全沙箱与 Evals 闭环",
            kw: "Sandbox & Evals",
            pubStage: 3,
            date: "2026-05-28",
            readTime: "8 min",
            summary: "把会写代码的 AI 当作不可信用户关进一次性云端沙箱；上线第一天接 Tracing，边跑边攒 30 题错题 Evals 告别凭感觉测。",
            points: [
              "只要允许 AI 现场写代码或动文件系统，必接 E2B / Modal 等隔离沙箱，防删库与提示词注入。",
              "Tracing（行车记录仪）+ 错题本自动阅卷回归，是治好改一处崩三处“打地鼠”的唯一解。"
            ]
          },
          {
            id: "n21b",
            title: "HITL 权限护栏",
            articleTitle: "Human-in-the-loop 与权限分级",
            kw: "HITL & Safety",
            pubStage: 3,
            date: "2026-05-28",
            readTime: "6 min",
            summary: "只读自动放行、局部写入按需确认、外部发送与删除强制二次审批：在自动化效率与线上风险之间画出清晰护栏。",
            points: [
              "把工具按可逆性与爆炸半径分级，而不是所有动作都弹窗打断或全部无条件放行。",
              "好的审批卡片只展示决策所需的关键 diff 与影响范围，让人类 3 秒就能放心拍板。"
            ]
          },
          {
            id: "n22",
            title: "Harness 驾驭工程",
            articleTitle: "Harness 驾驭工程与协议",
            kw: "Harness & Jev",
            pubStage: 3,
            date: "2026-06-03",
            readTime: "9 min",
            summary: "Agent = 模型（野马）+ Harness（马具）。用分级路由 / Jev 管住延迟与账单，用 AG-UI 与 A2A 补齐前后端及跨体边界。",
            points: [
              "同一模型套上不同的工作区、确定性 Hooks 与验证闭环，真实任务成功率可差出数倍。",
              "MCP（连工具）+ AG-UI（推前端过程与审批卡）+ A2A（跨体协作）共同拼齐现代协议版图。"
            ]
          }
        ]
      }
    ]
  };

export const NODE_MILESTONES = {
    n01:  "1970s–1980s · 符号主义与专家系统",
    n01b: "1950s · Moore / Mealy 有限状态机",
    n02:  "2000s–2010s · 桌面流程自动化 RPA",
    n02b: "2014 · Apache Airflow 等工作流 DAG",
    n03:  "1980s–2010s · 经典多智能体理论",
    n04:  "2017.06 · Attention Is All You Need",
    n04b: "2022.03 · InstructGPT 与 RLHF 对齐",
    n05:  "2020.05 · GPT-3 上下文学习论文",
    n05b: "2022.01 · Chain-of-Thought 论文",
    n06:  "2022.10 · ReAct 论文",
    n07:  "2022–2023 · Prompt 工程实践共识",
    n08:  "2023.03 · AutoGPT 开源爆火",
    n09:  "2022.10–2023 · LangChain LCEL 管道",
    n10:  "2020 论文 · 2023 LLM 工程落地爆发",
    n10b: "2023 · BM25 + 向量 + Rerank 检索基线",
    n11:  "2023.06 · OpenAI Function Calling 首发",
    n11b: "2023 · 早期多轮窗口截断与摘要",
    n12:  "2024.01 · LangGraph 状态机框架发布",
    n13:  "2024 · 意图路由与自反思 Agentic RAG",
    n13b: "2024.12 · Anthropic Building Effective Agents",
    n14:  "2024.11 · Anthropic 开源 MCP 协议",
    n15:  "2024.10 · Claude 3.5 Computer Use",
    n15b: "2024 · SWE-agent / Claude Code 终端闭环",
    n16:  "2024.09 · OpenAI o1 推理模型首发",
    n17:  "2025 · Context Engineering 行业共识",
    n18:  "2025 · 模块化 SOP 与 Agent Skills",
    n18b: "2024.08–2025 · Prompt Caching 普及",
    n19:  "2025 · Multi-Agent 上下文隔离实践",
    n20:  "2025–2026 · 长期记忆衰减与 LLM Wiki",
    n21:  "2025 · 隔离沙箱与 Tracing / Evals 闭环",
    n21b: "2025 · 生产级 HITL 审批与权限分级",
    n22:  "2025–2026 · Harness 驾驭工程与 AG-UI / A2A"
  };


export const SHORT_ERA_LABELS = {
  "era-01": { short: "规则脚本", yr: "50s–16" },
  "era-02": { short: "通用大脑", yr: "17–22" },
  "era-03": { short: "工具破壁", yr: "2023" },
  "era-04": { short: "自主干活", yr: "2024" },
  "era-05": { short: "驾驭工程", yr: "25–26" }
};
