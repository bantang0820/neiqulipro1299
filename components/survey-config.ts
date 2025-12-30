export type QuestionType = 'radio' | 'select' | 'input' | 'rank' | 'info' | 'checkbox' | 'group';

export interface Option {
  value: string;
  label: string;
}

export interface SubField {
    id?: string;
    label: string;
    field: string;
    otherField?: string;
    type?: QuestionType; // Allow overriding type in subFields (e.g., input)
    placeholder?: string;
    options?: Option[];
}

export interface Question {
  id: string;
  type: QuestionType | 'rank-group';
  title: string;
  subtitle?: string; // New field for subtitle
  description?: string;
  field?: string;
  otherField?: string; // Field name for the "Other" input
  options?: Option[];
  placeholder?: string;
  sectionTitle?: string; // For grouping visually if needed, though we show one by one
  subFields?: SubField[]; // For combined questions
}

export const surveyQuestions: Question[] = [
  {
    id: 'intro',
    type: 'info',
    title: '家庭自驱力·SDT全景深度诊断系统 (Pro版)',
    subtitle: '修车式系统排查 · 逻辑交叉验证 · 寻找真问题',
    description: '⚠️ 警告：本问卷设有“逻辑交叉验证”机制。如果您为了面子美化答案，诊断系统将失效。\n请哪怕是咬着牙，也要填写真相。',
    sectionTitle: '说明'
  },
  // Profile
  {
    id: 'redBookName',
    type: 'input',
    field: 'redBookName',
    title: '1. 您的小红书名字',
    placeholder: '请输入您的小红书名字',
    sectionTitle: '基础画像'
  },
  {
    id: 'childGender',
    type: 'radio',
    field: 'childGender',
    title: '2. 孩子的性别',
    options: [
      { value: 'male', label: '男' },
      { value: 'female', label: '女' }
    ],
    sectionTitle: '基础画像'
  },
  {
    id: 'childAge',
    type: 'input',
    field: 'childAge',
    title: '3. 孩子的年级',
    placeholder: '例如：小学三年级 / 初二',
    sectionTitle: '基础画像'
  },
  {
    id: 'familyStructure',
    type: 'radio',
    field: 'familyStructure',
    otherField: 'familyStructureOther',
    title: '4. 家庭常住人口与抚养结构',
    description: '家里平时谁和孩子住在一起？谁是主要管教者？',
    options: [
      { value: 'A', label: 'A. 核心家庭：父母+孩子（妈妈主管）' },
      { value: 'B', label: 'B. 核心家庭：父母+孩子（爸爸主管，或两人不管）' },
      { value: 'C', label: 'C. 三代同堂：有爷爷奶奶/外公外婆同住（老人经常插手管教）' },
      { value: 'D', label: 'D. 其他情况：单亲 / 异地 / 保姆带 (请注明)' } 
    ],
    sectionTitle: '基础画像'
  },
  {
    id: 'academicStatus',
    type: 'radio',
    field: 'academicStatus',
    otherField: 'academicStatusOther',
    title: '5. 孩子目前的学业状态（家长主观评估）',
    options: [
      { value: 'A', label: 'A. 领跑区：成绩优异，但可能压力大。' },
      { value: 'B', label: 'B. 中游区：比上不足比下有余，不上不下最焦虑。' },
      { value: 'C', label: 'C. 掉队区：基础差，跟不上学校进度，有厌学苗头。' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '基础画像'
  },
  {
    id: 'corePainPoint',
    type: 'select',
    field: 'corePainPoint',
    otherField: 'corePainPointOther',
    title: '6. 您最想解决的一个核心痛点是？',
    options: [
      { value: 'procrastination', label: '作业磨蹭/拖延' },
      { value: 'addiction', label: '沉迷手机/游戏' },
      { value: 'temper', label: '情绪暴躁/顶嘴' },
      { value: 'weariness', label: '厌学/不想去学校' },
      { value: 'relationship', label: '亲子关系冷漠' },
      { value: 'other', label: '其他 (请注明)' }
    ],
    sectionTitle: '基础画像'
  },
  
  // Bio-Energy
  {
    id: 'sleepStatus',
    type: 'radio',
    field: 'sleepStatus',
    otherField: 'sleepStatusOther',
    title: '7. 孩子过去一周平均真实睡眠时长？',
    options: [
      { value: 'A', label: 'A. 严重红灯：长期缺觉，难叫醒，有起床气' },
      { value: 'B', label: 'B. 勉强黄灯：靠闹钟能醒，周末报复性补觉' },
      { value: 'C', label: 'C. 健康绿灯：睡眠充足，情绪稳定，精力饱满' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '生物学底板'
  },
  {
    id: 'dopamineRank',
    type: 'rank-group',
    title: '8. 【多巴胺分布】请对孩子花费时间最多的三件事进行排序',
    options: [
      { value: "A", label: "A. 刷短视频/社交媒体" },
      { value: "B", label: "B. 玩电子游戏" },
      { value: "C", label: "C. 发呆/无所事事" },
      { value: "D", label: "D. 写作业/补习" },
      { value: "E", label: "E. 阅读/画画/拼搭（心流活动）" },
      { value: "F", label: "F. 户外运动" },
      { value: "G", label: "G. 做家务" },
      { value: "Other", label: "其他 (请注明)" }
    ],
    subFields: [
        { label: '花费时间第 1 多', field: 'dopamineRank1', otherField: 'dopamineRank1Other' },
        { label: '花费时间第 2 多', field: 'dopamineRank2', otherField: 'dopamineRank2Other' },
        { label: '花费时间第 3 多', field: 'dopamineRank3', otherField: 'dopamineRank3Other' },
    ],
    sectionTitle: '生物学底板'
  },
  {
    id: 'exerciseFrequency',
    type: 'radio',
    field: 'exerciseFrequency',
    otherField: 'exerciseFrequencyOther',
    title: '9. 孩子每周“出汗级别”的运动频率是多少？',
    options: [
      { value: 'A', label: 'A. 几乎为零：能躺绝不坐，动一下都喊累' },
      { value: 'B', label: 'B. 低频维持：仅限体育课，放学不动' },
      { value: 'C', label: 'C. 高频放电：每周至少 2-3 次高强度运动' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '生物学底板'
  },
  {
    id: 'withdrawalReaction',
    type: 'radio',
    field: 'withdrawalReaction',
    otherField: 'withdrawalReactionOther',
    title: '10. 当您要求孩子停止电子产品时的“刹车系统”表现如何？',
    options: [
      { value: 'A', label: 'A. 刹车失灵：瞬间暴怒、尖叫、扔东西' },
      { value: 'B', label: 'B. 刹车困难：讨价还价，拖拉，情绪低落' },
      { value: 'C', label: 'C. 刹车正常：虽然不舍但能配合' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '生物学底板'
  },
  {
    id: 'afterSchoolState',
    type: 'radio',
    field: 'afterSchoolState',
    otherField: 'afterSchoolStateOther',
    title: '11. 孩子每天刚放学回家时的状态，最接近以下哪种？',
    options: [
      { value: 'A', label: 'A. 电量耗尽：不想说话，只想独处或发脾气' },
      { value: 'B', label: 'B. 兴奋躁动：停不下来，跑来跑去' },
      { value: 'C', label: 'C. 平稳待机：情绪平和，能正常交流' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '生物学底板'
  },

  // Interaction
  {
    id: 'wakeUpMode',
    type: 'radio',
    field: 'wakeUpMode',
    otherField: 'wakeUpModeOther',
    title: '12. 孩子是如何起床的？',
    options: [
      { value: 'A', label: 'A. 生物钟/闹钟：自己醒/闹钟响一次就起' },
      { value: 'B', label: 'B. 人工闹钟：我叫1-2次，稍微磨蹭一下能起' },
      { value: 'C', label: 'C. 暴力唤醒：我不掀被子/大声吼他根本起不来' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '24小时互动 - 晨起'
  },
  {
    id: 'morningAtmosphere',
    type: 'radio',
    field: 'morningAtmosphere',
    otherField: 'morningAtmosphereOther',
    title: '13. 回想每天早上（起床到出门这段时间），家里的氛围通常是怎样的？',
    options: [
      { value: 'A', label: 'A. 🔴 充满催促声，孩子带着情绪走' },
      { value: 'B', label: 'B. 🟡 我不说话但盯着时间，气压低' },
      { value: 'C', label: 'C. 🟢 各忙各的或简单聊天，情绪平稳' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '24小时互动 - 晨起'
  },
  {
    id: 'firstContact',
    type: 'radio',
    field: 'firstContact',
    otherField: 'firstContactOther',
    title: '14. 孩子进门后的前10分钟，您的第一句话通常属于？',
    options: [
      { value: 'A', label: 'A. 问作业和学习：“作业多吗？”/“快写作业”' },
      { value: 'B', label: 'B. 生活相关：“饿不饿？”吃饭了没' },
      { value: 'C', label: 'C. 什么都聊：“今天学校有什么好玩的事吗？”' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '24小时互动 - 放学'
  },
  {
    id: 'activityBeforeDinnerChild',
    type: 'radio',
    field: 'activityBeforeDinnerChild',
    otherField: 'activityBeforeDinnerChildOther',
    title: '15. 从回家到晚饭前，孩子一般在做什么？',
    options: [
      { value: 'phone', label: '玩手机/看电视' },
      { value: 'idle', label: '发呆/磨蹭' },
      { value: 'homework', label: '已经在写作业了' },
      { value: 'play', label: '运动/玩耍' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '24小时互动 - 放学'
  },
  {
    id: 'activityBeforeDinnerParent',
    type: 'radio',
    field: 'activityBeforeDinnerParent',
    otherField: 'activityBeforeDinnerParentOther',
    title: '16. 晚饭前，家长在做什么？',
    options: [
      { value: 'chores', label: '做饭/做家务（没空管）' },
      { value: 'monitor', label: '在旁边盯着/陪着' },
      { value: 'phone', label: '自己看手机' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '24小时互动 - 放学'
  },
  {
    id: 'homeworkPosition',
    type: 'radio',
    field: 'homeworkPosition',
    otherField: 'homeworkPositionOther',
    title: '17. 孩子写作业时，您的位置是？',
    options: [
      { value: 'A', label: 'A. 贴身人防：坐在旁边，时刻盯着' },
      { value: 'B', label: 'B. 远程监控：不坐旁边，但开着门或巡逻' },
      { value: 'C', label: 'C. 物理隔离：他在房间写，我在外面忙' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '24小时互动 - 作业'
  },
  {
    id: 'homeworkAtmosphere',
    type: 'radio',
    field: 'homeworkAtmosphere',
    otherField: 'homeworkAtmosphereOther',
    title: '18. 作业氛围与互动',
    options: [
      { value: 'A', label: 'A. 充满火药味：经常因为磨蹭、出错而发生争吵，需要我一直盯着催促' },
      { value: 'B', label: 'B. 看似和平但依赖：孩子比较乖，但每做完一项都要问我下一步做什么，或者等着我检查' },
      { value: 'C', label: 'C. 安静且独立：孩子自己在房间写作业，井井有条，基本不需要我介入' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '24小时互动 - 作业'
  },
  {
    id: 'beforeSleepAction',
    type: 'radio',
    field: 'beforeSleepAction',
    otherField: 'beforeSleepActionOther',
    title: '19. 作业做完后到睡觉前，通常发生了什么？',
    options: [
      { value: 'A', label: 'A. 追加任务：“时间还早，再做两页...”' },
      { value: 'B', label: 'B. 报复性娱乐：冲去玩手机，不肯洗澡' },
      { value: 'C', label: 'C. 温情时刻：聊天、阅读，平静入睡' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '24小时互动 - 睡前'
  },
  {
    id: 'dailyReview',
    type: 'radio',
    field: 'dailyReview',
    otherField: 'dailyReviewOther',
    title: '20. 回顾这一天，您觉得自己更像什么角色？',
    options: [
      { value: 'A', label: 'A. 监工：如果不盯着，这一天肯定废了' },
      { value: 'B', label: 'B. 保姆：甚至帮他削铅笔、整理书包' },
      { value: 'C', label: 'C. 合伙人：各司其职，有问题共同解决' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '24小时互动 - 睡前'
  },

  // SDT
  {
    id: 'motivationStage',
    type: 'radio',
    field: 'motivationStage',
    otherField: 'motivationStageOther',
    title: '21. 你认为孩子目前的学习动力是什么？',
    options: [
      { value: 'A', label: 'A. 为了父母而学的，纯靠推，不催不动' },
      { value: 'B', label: 'B. 考的不好会丢人，对不起父母的养育，内疚感' },
      { value: 'C', label: 'C. 知道学习是有用，大部分时候愿意愿意配合父母和学校' },
      { value: 'D', label: 'D. 享受攻克难题的乐趣，享受学习的过程，主动学习' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: 'SDT核心动能'
  },
  {
    id: 'voiceRights',
    type: 'radio',
    field: 'voiceRights',
    otherField: 'voiceRightsOther',
    title: '22. 当您和孩子在计划安排上出现分歧时：',
    options: [
      { value: 'A', label: 'A. 孩子必须听我的安排，按我说的做' },
      { value: 'B', label: 'B. 表面上不强迫，但会讲道理绕晕他，让他按我的来' },
      { value: 'C', label: 'C. 允许他按他的想法来，哪怕效率低或者会犯错' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: 'SDT核心动能'
  },
  {
    id: 'microManagement',
    type: 'radio',
    field: 'microManagement',
    otherField: 'microManagementOther',
    title: '23. 在孩子写作业的过程中，您对他“细节”的干涉程度？',
    options: [
      { value: 'A', label: 'A. 在一边盯着，坐姿、字迹随时纠正' },
      { value: 'B', label: 'B. 过程不管，最后检查，错误的重写' },
      { value: 'C', label: 'C. 只要做完就行，不干预' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: 'SDT核心动能'
  },
  {
    id: 'digitalConflict',
    type: 'radio',
    field: 'digitalConflict',
    otherField: 'digitalConflictOther',
    title: '24. 约定玩20分钟手机，时间到了他还在玩。此时您的真实执行手段是？',
    options: [
      { value: 'A', label: 'A. 直接抢会手机，或者断网' },
      { value: 'B', label: 'B. 对他说：你太让我失望了，我就知道你会说话不算话”' },
      { value: 'C', label: 'C. 不采取动作，但是会在旁边一直催' },
      { value: 'D', label: 'D. 走到他旁边伸出手等待交出手机，不指责也不说话' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: 'SDT核心动能'
  },
  {
    id: 'fearOfDifficulty',
    type: 'radio',
    field: 'fearOfDifficulty',
    otherField: 'fearOfDifficultyOther',
    title: '25. 观察孩子遇到难题（超出当前能力一点点）时的第一反应：',
    options: [
      { value: 'A', label: 'A. 摔笔、哭闹、骂人、放弃' },
      { value: 'B', label: 'B. 发呆、上厕所、假装没看见' },
      { value: 'C', label: 'C. 皱眉，但会试图读题/找例题/找方法' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: 'SDT核心动能'
  },
  {
    id: 'scaffolding',
    type: 'radio',
    field: 'scaffolding',
    otherField: 'scaffoldingOther',
    title: '26. 当孩子向您求助“这题我不会”时，您的通常做法是？',
    options: [
      { value: 'A', label: 'A. 直接给步骤和答案' },
      { value: 'B', label: 'B. 先说两句“上课听什么了？这么简单都不会”' },
      { value: 'C', label: 'C. 不给答案，而是启发他：“卡在哪一步了？”' },
      { value: 'D', label: 'D. 不管不干涉：“自己想！别依赖我”' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: 'SDT核心动能'
  },
  {
    id: 'successFeedback',
    type: 'radio',
    field: 'successFeedback',
    otherField: 'successFeedbackOther',
    title: '27. 当孩子终于攻克了一个难题或考了一次好成绩，您的第一句话通常侧重于？',
    options: [
      { value: 'A', label: 'A. 警示敲打：“别翘尾巴，粗心还是不少”' },
      { value: 'B', label: 'B. 社会比较：“你们班第一名考多少？还有很大的差距，不要翘尾巴”' },
      { value: 'C', label: 'C. 能力肯定：“努力没白费，策略很有效”' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: 'SDT核心动能'
  },
  {
    id: 'tutoringCrash',
    type: 'radio',
    field: 'tutoringCrash',
    otherField: 'tutoringCrashOther',
    title: '28. 晚上9点半，简单的题讲了两遍还不会。那一瞬间，您脱口而出（或心里想）的话？',
    options: [
      { value: 'A', label: 'A. 直接说：“怎么这么笨/猪脑子”' },
      { value: 'B', label: 'B. 说：“这都不会，这辈子完了”' },
      { value: 'C', label: 'C. “我真是失败，教出这种孩子”' },
      { value: 'D', label: 'D. 不管了，“脑子累了，先不做了”' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: 'SDT核心动能'
  },
  {
    id: 'conditionalLove',
    type: 'radio',
    field: 'conditionalLove',
    otherField: 'conditionalLoveOther',
    title: '29. 孩子潜意识里认为，要想获得您的好脸色/笑脸，必须满足什么条件？',
    options: [
      { value: 'A', label: 'A. 必须成绩好、听话，才能让爸爸妈妈开心' },
      { value: 'B', label: 'B. 看家长心情，如果开心了，就会对我好' },
      { value: 'C', label: 'C. 只要不触碰底线，平时妈妈都是爱我的' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: 'SDT核心动能'
  },
  {
    id: 'vulnerableMoment',
    type: 'radio',
    field: 'vulnerableMoment',
    otherField: 'vulnerableMomentOther',
    title: '30. 当孩子感到委屈、伤心或在外面受挫时，他的表现是？',
    options: [
      { value: 'A', label: 'A. 锁门，拒绝沟通，说没事' },
      { value: 'B', label: 'B. 把气撒在家长身上，找茬吵架（踢猫效应）' },
      { value: 'C', label: 'C. 会主动找家长倾诉，寻求安慰，希望得到安慰和理解' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: 'SDT核心动能'
  },
  {
    id: 'pureTime',
    type: 'radio',
    field: 'pureTime',
    otherField: 'pureTimeOther',
    title: '31. 过去一周，您和孩子互动的总时长里，完全不含“管教”的“纯净时间”占比？',
    options: [
      { value: 'A', label: 'A. < 10%：几乎开口就是管教' },
      { value: 'B', label: 'B. 30% 左右：偶尔聊两句，很快绕回学习' },
      { value: 'C', label: 'C. > 50%：经常一起玩、聊废话' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: 'SDT核心动能'
  },
  {
    id: 'authorityChallenge',
    type: 'radio',
    field: 'authorityChallenge',
    otherField: 'authorityChallengeOther',
    title: '32. 孩子翻白眼或顶嘴说“烦死了”。您的第一生理反应？',
    options: [
      { value: 'A', label: 'A. 吼回去，必须压服他，直到他认错' },
      { value: 'B', label: 'B. 觉得心寒，不理他，冷战，直到他主动过来认错' },
      { value: 'C', label: 'C. 叹气，无所谓了，随他去吧' },
      { value: 'D', label: 'D. 保持平静，知道他情绪过载，需要冷静' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: 'SDT核心动能'
  },

  // Conflict Black Box
  {
    id: 'conflictBlackBox',
    type: 'group',
    title: '冲突黑匣子 - 还原一场最近的冲突',
    description: '请详细回忆最近一次比较激烈的冲突，并按顺序回答以下问题。',
    sectionTitle: '冲突黑匣子',
    subFields: [
        { id: 'conflictTime', type: 'input', field: 'conflictTime', label: '33. 当时大概是几点？孩子在做什么？', placeholder: '例如：周二晚上9点，他在玩手机' },
        { id: 'conflictRound1Parent', type: 'input', field: 'conflictRound1Parent', label: '34. 您的第一句话（导火索）是？', placeholder: '👩 家长说：' },
        { id: 'conflictRound1Child', type: 'input', field: 'conflictRound1Child', label: '35. 孩子的反应是？', placeholder: '👦 孩子做/说：' },
        { id: 'conflictRound2Parent', type: 'input', field: 'conflictRound2Parent', label: '36. 您追加的那句“施压”的话是？', placeholder: '👩 家长说：' },
        { id: 'conflictRound2Child', type: 'input', field: 'conflictRound2Child', label: '37. 孩子的反击动作/语言是？', placeholder: '👦 孩子做/说：' },
        { id: 'conflictTrigger', type: 'input', field: 'conflictTrigger', label: '38. 哪个具体表现彻底激怒了您？', placeholder: '例如：他轻蔑的眼神' },
        { id: 'conflictExplosion', type: 'input', field: 'conflictExplosion', label: '39. 失控之下，你们分别做了什么说了什么？', placeholder: '请详细描述...' }
    ]
  },
  // Removed NextDayAtmosphere question as requested
  {
    id: 'breakIce',
    type: 'group',
    title: '40-42. 僵局是如何打破的？',
    sectionTitle: '冲突黑匣子',
    subFields: [
        { id: 'breakIceWho', type: 'select', field: 'breakIceWho', label: '40. 是谁先打破了僵局？', options: [{value: 'parent', label: '我先'}, {value: 'child', label: '孩子先'}, {value: 'none', label: '没人打破'}] },
        { id: 'breakIceWords', type: 'input', field: 'breakIceWords', label: '41. 破冰的第一句话说了什么？', placeholder: '原话记录' },
        { id: 'afterBreakIce', type: 'input', field: 'afterBreakIce', label: '42. 接下来你们分别做了什么说了什么？', placeholder: '请描述后续互动...' }
    ]
  },
  {
    id: 'repairQuality',
    type: 'radio',
    field: 'repairQuality',
    otherField: 'repairQualityOther',
    title: '43. 关于昨晚那场冲突，事后你们有过“复盘”吗？',
    options: [
      { value: 'A', label: 'A. 零复盘：绝口不提' },
      { value: 'B', label: 'B. 讲道理，像上课一样，开启第二轮攻击，我早就说xxx你不听，现在知道错了吧' },
      { value: 'C', label: 'C. 谈感受，真正的链接，比如：昨晚是妈妈态度不好，你当时是什么感受？' },
      { value: 'D', label: 'D. 物质交换，比如：行了别生气了，周末带你去吃大餐，买玩具' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '冲突黑匣子'
  },

  // Shadow
  {
    id: 'narcissismCheck',
    type: 'radio',
    field: 'narcissismCheck',
    otherField: 'narcissismCheckOther',
    title: '44. 当孩子在公共场合表现糟糕，那一瞬间，您内心最真实的感受是？',
    options: [
      { value: 'A', label: 'A. 羞耻感：“太丢人了，我是失败的家长”' },
      { value: 'B', label: 'B. 愤怒感：“付出这么多，凭什么报复我”' },
      { value: 'C', label: 'C. 抽离感：“想装作不认识，赶紧逃离”' },
      { value: 'D', label: 'D. 疼惜感：“他一定很无助，需帮他平静”' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '心理图式'
  },
  {
    id: 'ghostEcho',
    type: 'radio',
    field: 'ghostEcho',
    otherField: 'ghostEchoOther',
    title: '45. 当您情绪失控吼孩子时，那个声音让您联想到了谁？',
    options: [
      { value: 'A', label: 'A. 我的父母：跟我爸妈当年一模一样' },
      { value: 'B', label: 'B. 我的伴侣：在骂那个没用的另一半' },
      { value: 'C', label: 'C. 我自己：骂童年时无能的自己' },
      { value: 'D', label: 'D. 只是针对事：纯粹因为事严重' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '心理图式'
  },
  {
    id: 'ultimateFear',
    type: 'radio',
    field: 'ultimateFear',
    otherField: 'ultimateFearOther',
    title: '46. 如果允许对自己完全诚实，您“不敢放手”的终极恐惧是什么？',
    options: [
      { value: 'A', label: 'A. 无法接受孩子“退化”，以后没有体面的工作' },
      { value: 'B', label: 'B. 不盯着孩子觉得生活很空，不知道自己想去干什么' },
      { value: 'C', label: 'C. 容忍不了失控/不完美' },
      { value: 'D', label: 'D. 小时候没人管/管太严，现在害怕孩子也变成那样' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '心理图式'
  },

  // Mindset
  {
    id: 'timeHorizon',
    type: 'radio',
    field: 'timeHorizon',
    otherField: 'timeHorizonOther',
    title: '47. 【时间观对齐】您愿意给孩子多久的“康复期”？',
    options: [
      { value: 'A', label: 'A. 一周内必须看到成绩变化' },
      { value: 'B', label: 'B. 愿意给 3-6 个月的重建期' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '认知与契约'
  },
  {
    id: 'jCurveExpectation',
    type: 'radio',
    field: 'jCurveExpectation',
    otherField: 'jCurveExpectationOther',
    title: '48. 【好转反应预警】如果初期孩子因为没人催而彻底放羊，您会？',
    options: [
      { value: 'A', label: 'A. 恐慌撤退：立刻恢复吼叫模式' },
      { value: 'B', label: 'B. 咬牙坚持：忍住焦虑，等待拐点' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '认知与契约'
  },
  {
    id: 'flywheelSequence',
    type: 'radio',
    field: 'flywheelSequence',
    otherField: 'flywheelSequenceOther',
    title: '49. 【飞轮启动顺序】先改善关系 → 再建立规则 → 最后提升成绩。您能接受吗?',
    options: [
      { value: 'A', label: 'A. 接受：首月把“不吵架”作为最高KPI' },
      { value: 'B', label: 'B. 犹豫：看到作业写不好，还是想插手' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '认知与契约'
  },
  {
    id: 'growthMindset',
    type: 'radio',
    field: 'growthMindset',
    otherField: 'growthMindsetOther',
    title: '50. 【成长主体确认】方案执行成功的关键在于?',
    options: [
      { value: 'A', label: 'A. 孩子改变：他听话照做就行' },
      { value: 'B', label: 'B. 自我重塑：我先变，孩子才会变' },
      { value: 'Other', label: '其他 (请注明)' }
    ],
    sectionTitle: '认知与契约'
  },
  {
    id: 'commitment',
    type: 'checkbox',
    field: 'commitment',
    title: '52. 我已准备好。无论中间有多少反复，我愿保持觉知，持续行动。',
    sectionTitle: '最终承诺'
  }
];
