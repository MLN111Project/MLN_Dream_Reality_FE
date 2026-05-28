export default {
  common: {
    back: "Quay lại",
    comingSoon: "Đang phát triển",
    start: "Bắt đầu",
    step: "Bước {n}/4",
    stepTimeline: "Bước 3/4 · Mô phỏng cuộc đời",
    stepEnding: "Bước 4/4 · Kết cục của bạn",
  },
  stats: {
    passion: "Đam mê",
    money: "Thu nhập",
    creativity: "Sáng tạo",
    mentalHealth: "Sức khỏe tinh thần",
    socialRecognition: "Công nhận",
  },
  envModifiers: {
    salary: "Lương",
    creativity: "Sáng tạo",
    freedom: "Tự do",
    mentalHealth: "Sức khỏe tinh thần",
    recognition: "Công nhận",
  },
  chart: {
    title: "Quan hệ sản xuất vs. Lực lượng sản xuất",
    subtitle:
      "Theo dõi đam mê suy giảm và căng thẳng gia tăng khi hệ thống gây áp lực",
    passion: "Đam mê",
    stress: "Căng thẳng",
    creativity: "Sáng tạo",
  },
  home: {
    badge: "MLN 111 · Nhóm 3",
    title: "Giấc mơ vs Thực tế",
    description:
      "Web game tương tác theo nhóm — mô phỏng nghề nghiệp & triết học Mác–Lênin về mâu thuẫn lực lượng sản xuất và quan hệ sản xuất.",
    admin: "Tạo phòng (Admin)",
    adminDesc: "Chọn ngành, điều khiển 12 câu, theo dõi 8 đội",
    join: "Tham gia nhóm",
    joinDesc: "Nhập mã phòng, 1 đại diện mỗi nhóm",
    solo: "Chơi solo (demo)",
    soloDesc: "Trải nghiệm mô phỏng cá nhân",
  },
  admin: {
    createTitle: "Tạo phòng chơi",
    createSubtitle:
      "Chọn ngành nghề cho cả phòng. Mỗi đội tự chọn môi trường làm việc và trả lời 12 câu.",
    careerLabel: "Ngành nghề (cả phòng)",
    createRoom: "Tạo mã phòng",
    backToCareerSelect: "Chọn lại ngành nghề",
    serverOldQuizTitle: "Máy chủ đang chạy phiên bản cũ (3 câu quiz)",
    serverOldQuiz:
      "Dừng terminal server cũ (Ctrl+C), rồi chạy lại: npm run dev:all. Terminal phải hiện «12 câu timeline/phòng». Tạo phòng mới sau khi restart.",
    endingCol: "Kết cục",
    environmentCol: "Môi trường",
    teamEndingsOverview: "Tổng quan kết cục các đội",
    teamEndingsHint: "Mỗi đội có kết cục riêng theo lựa chọn trong 12 câu.",
    dashboard: "Bảng điều khiển Admin",
    roomCode: "Mã phòng",
    music: "Nhạc nền",
    startGame: "Bắt đầu",
    nextQuestion: "Câu tiếp theo",
    question: "Câu",
    teams: "Các nhóm",
    team: "Nhóm",
    score: "Điểm",
    eventCol: "Sự kiện câu",
    perTeamEventsHint: "Mỗi nhóm có sự kiện ngẫu nhiên riêng cho câu hiện tại.",
    answered: "Đã trả lời",
    yes: "Có",
    no: "Chưa",
    classSummary: "Tổng hợp lớp",
    incomePct: "{n}% nhóm ưu tiên thu nhập",
    passionPct: "{n}% giữ đam mê",
    quitPct: "{n}% chọn từ bỏ / kiệt sức",
    philosophy:
      "Điều này phản ánh mâu thuẫn giữa lực lượng sản xuất và quan hệ sản xuất. Người lao động trẻ có kỹ năng và nhiệt huyết, nhưng khi môi trường, lương thưởng, KPI và sự công nhận không phù hợp, động lực phát triển có thể bị kìm hãn hoặc triệt tiêu.",
    backHome: "Về trang chủ",
  },
  play: {
    joinTitle: "Tham gia phòng",
    joinSubtitle: "Chọn môi trường làm việc cho nhóm của bạn trước khi vào phòng.",
    roomCode: "Mã phòng",
    teamName: "Tên nhóm",
    teamPlaceholder: "Nhóm 1",
    environmentLabel: "Quan hệ sản xuất / Môi trường làm việc",
    environmentChosen: "Môi trường đã chọn",
    join: "Vào phòng",
    joinError: "Không thể tham gia phòng. Thử lại.",
    roomNotFound:
      "Không tìm thấy phòng. Admin cần tạo phòng mới (server restart sẽ xóa phòng cũ).",
    invalidEnvironment: "Môi trường không hợp lệ. Tải lại trang và chọn lại.",
    roomFull: "Phòng đã đủ 8 nhóm.",
    gameStarted: "Game đã bắt đầu, không thể tham gia thêm.",
    socketUrlMissing:
      "Chưa cấu hình server game. Trên Vercel thêm biến VITE_SOCKET_URL = URL HTTPS Render (vd. https://xxx.onrender.com) rồi redeploy.",
    serverOffline:
      "Không kết nối được máy chủ game (cổng 3001). Chạy: npm run dev:all (hoặc npm run server trong terminal khác).",
    waitingTitle: "Phòng chờ",
    waiting: "Đang chờ Admin bấm Bắt đầu...",
    questionsTotal: "Phiên chơi có {n} câu hỏi (timeline solo)",
    you: "bạn",
    question: "Câu",
    score: "Điểm",
    points: "điểm",
    choiceRecorded: "Đã ghi nhận lựa chọn của nhóm.",
    yourChoice: "Đáp án nhóm bạn đã chọn",
    finalScore: "Tổng điểm nhóm",
    answered: "Đã ghi nhận +{points} điểm",
    fastWarning: "Bạn cần đọc kỹ câu hỏi trước khi trả lời.",
    waitNext: "Đã trả lời — chờ câu tiếp theo",
    eventThisQuestion: "Biến cố câu này (chỉ nhóm bạn)",
    skipEvent: "Không thực hiện biến cố",
    skipEventOn: "Đã chọn: bỏ qua biến cố câu này (chỉ +điểm trả lời)",
    pickTargetTeam: "Chọn nhóm để thực hiện biến cố",
    pickTargetFirst: "Hãy chọn nhóm trước khi trả lời câu hỏi.",
    targetSelected: "Đã chọn: {name}",
    stealZeroHint: "{name} đang 0 điểm — cướp được 0 điểm từ biến cố (vẫn +điểm trả lời).",
    swapZeroHint: "Hoán đổi với {name} sẽ đổi điểm hai bên bình thường.",
    eventAmountLabel: "mức ±{amount} điểm",
    popupStealFrom: "Ăn cướp {amount} điểm từ {name}",
    popupSwap: "Hoán đổi điểm với {name}",
    eventTypes: {
      neutral: "Câu thường",
      bonus_points: "⚡ Thưởng điểm bất ngờ",
      penalty_points: "⚠️ Trừ điểm bất ngờ",
      steal_points: "🏴 Ăn cướp điểm đội khác",
      swap_points: "🔀 Hoán đổi điểm với đội khác",
    },
    events: {
      neutral: "Ghi nhận! {pointsDelta} điểm.",
      event_skipped: "Đã bỏ qua biến cố. Chỉ +{pointsDelta} điểm trả lời.",
      bonus_points: "Thưởng bất ngờ! +{amount} điểm (tổng {pointsDelta}).",
      penalty_points: "Trừ điểm bất ngờ! −{amount} điểm.",
      steal_points: "Ăn cướp {stolen}/{stealTarget} điểm từ {stolenFrom}.",
      steal_points_empty:
        "{stolenFrom} đang 0 điểm — không cướp thêm được. Chỉ +{pointsDelta} điểm trả lời.",
      steal_points_fail: "Không có đội để cướp. +{pointsDelta} điểm.",
      swap_points: "Hoán đổi điểm với {swappedWith}! ({scoreBefore} → {scoreAfter})",
      swap_points_fail: "Không có đội để hoán đổi. +{pointsDelta} điểm.",
    },
    gameOver: "Kết thúc phiên chơi",
    yourStats: "Chỉ số nhóm bạn",
    currentRoom: "Mã phòng đang tham gia",
    connecting: "Đang kết nối phòng...",
    backHome: "Về trang chủ",
  },
  loading: {
    dream: "Giấc mơ",
    vs: " vs ",
    reality: "Thực tế",
    tagline: "Lực lượng sản xuất × Quan hệ sản xuất",
  },
  landing: {
    badge: "MLN111 · Triển lãm tương tác Chủ nghĩa Mác–Lênin",
    simulator: "Mô phỏng",
    hook: "Nếu giấc mơ của bạn chưa bao giờ là vấn đề?",
    theoryIntro: "Khám phá mâu thuẫn giữa",
    theoryForcesParen: "(tài năng, đam mê, sáng tạo)",
    theoryAnd: "và",
    theoryRelationsParen: "(lương bổng, quản lý độc hại, môi trường kìm hãm).",
    forces: "Lực lượng sản xuất",
    relations: "Quan hệ sản xuất",
    cta: "Bắt đầu mô phỏng",
    scroll: "Cuộn để khám phá",
    videoLabel: "Video storyboard giới thiệu",
    videoMuted: "Bấm để bật tiếng",
    videoSoundOn: "Đang bật tiếng",
    videoSoundOff: "Đang tắt tiếng",
    galleryLabel: "Xem trước triển lãm",
    quote:
      "Đôi khi người tài năng không thất bại. Đôi khi hệ thống làm họ thất bại.",
    card1Title: "Chọn giấc mơ",
    card1Desc:
      "Chọn nghề nghiệp đại diện cho lực lượng sản xuất — tài năng và đam mê của bạn.",
    card2Title: "Đối diện hệ thống",
    card2Desc:
      "Trải nghiệm cách quan hệ sản xuất định hình lương, tự do và sức khỏe tinh thần.",
    card3Title: "Sống dòng thời gian",
    card3Desc: "Đi qua các sự kiện cảm xúc. Mỗi lựa chọn thay đổi tương lai.",
  },
  dream: {
    title: "Chọn",
    titleHighlight: "Giấc mơ",
    subtitle:
      "Nghề nghiệp đại diện cho lực lượng sản xuất — sự sáng tạo, tài năng, kỹ năng và đam mê chờ được giải phóng.",
    continue: "Tiếp tục",
  },
  transition: {
    line1: "Bạn từng nghĩ tài năng là đủ.",
    line2: "Rồi hệ thống bắt đầu định giá bạn.",
    line3: "Quan hệ sản xuất đang chờ đợi.",
    continue: "Đối diện hệ thống",
  },
  workEnv: {
    title: "Quan hệ",
    titleHighlight: "Sản xuất",
    subtitle:
      "Là {career}, bạn sẽ làm việc ở đâu? Mỗi môi trường định hình lương, sáng tạo, tự do, sức khỏe tinh thần và sự công nhận.",
    selectHint: "Chọn một môi trường để tiếp tục",
    selected: "Đã chọn: {environment}",
    continue: "Bắt đầu dòng đời",
  },
  timeline: {
    lifeAs: "Cuộc đời của",
    at: "tại",
    currentStage: "Giai đoạn hiện tại",
    eventProgress: "Sự kiện {current}/{total}",
    journeyProgress: "Tiến độ hành trình",
    questionProgress: "Câu hỏi {current}/{total}",
    selectAnswer: "Chọn một đáp án để tiếp tục",
    confirmHint: "Nhấn Tiếp theo để ghi nhận lựa chọn",
    next: "Tiếp theo",
    seeResults: "Xem kết quả",
    nextStage: "Giai đoạn tiếp theo",
    stageComplete: "Hoàn thành giai đoạn",
    stageCompleteHint:
      "Bạn đã trả lời hết sự kiện của giai đoạn này. Tiếp tục hành trình.",
    liveStatus: "Trạng thái trực tiếp",
    systemStress: "Căng thẳng hệ thống",
    creativeSuppression: "Kìm hãm sáng tạo",
    yourStats: "Chỉ số của bạn",
  },
  ending: {
    finalStats: "Chỉ số cuối cùng",
    journeyAt: "{career} tại {environment}",
    marxistTitle: "Phân tích Mác-xít",
    marxistMid: "— tài năng, đam mê và sáng tạo — bị định hình bởi",
    marxistEnd:
      ": lao động hưởng lương, hệ thống quản lý và ràng buộc thể chế. Mâu thuẫn giữa những gì bạn có thể tạo ra và những gì hệ thống cho phép quyết định con đường của bạn.",
    forces: "Lực lượng sản xuất",
    relations: "quan hệ sản xuất",
    restart: "Mô phỏng cuộc đời khác",
    home: "Về trang chủ",
    finalQuote:
      "Đôi khi người tài năng không thất bại. Đôi khi hệ thống làm họ thất bại.",
    personalizedTitle: "Phân tích dành cho bạn",
    aiTitle: "Phân tích AI — Lực lượng sản xuất & Lao động",
    aiSubtitle: "Công nghệ hiện đại phản chiếu hành trình của bạn.",
    aiLoading: "AI đang phân tích lựa chọn và chỉ số của bạn…",
    aiError: "Không tải được phân tích AI. Thử tải lại trang.",
    aiKeyMissing:
      "Thêm GEMINI_API_KEY vào file .env và khởi động lại server để bật phân tích Gemini.",
    aiConclusion: "Kết luận cá nhân",
    aiCareerTrend: "Xu hướng nghề nghiệp",
    aiPassionConflict: "Đam mê vs. thực tế lao động",
    aiForces: "Lực lượng sản xuất & quan hệ sản xuất",
    aiBurnoutTag: "Burnout",
    aiBurnout: {
      low: "Thấp",
      moderate: "Trung bình",
      high: "Cao",
      critical: "Rất cao",
    },
    comparisonTitle: "Cùng giấc mơ, khác quan hệ sản xuất",
    comparisonSubtitle:
      "Người lao động không đổi — chỉ có cấu trúc xung quanh họ thay đổi.",
    comparisonCareer: "Nghề: {career}",
    comparisonEnvColumn: "Môi trường",
    socialTitle: "Bạn không cô đơn",
    socialSubtitle: "Áp lực cấu trúc vượt ra ngoài câu chuyện của bạn",
    secretBadge: "Kết cục bí mật đã mở khóa",
    statLevel: {
      high: "Cao",
      mid: "Trung bình",
      low: "Thấp",
      unstable: "Bất ổn",
    },
    personalized: {
      burnedOut:
        "Bạn không thiếu tài năng. Quan hệ sản xuất đòi hỏi năng suất liên tục đã triệt tiêu sức khỏe tinh thần.",
      corporateMachine:
        "Bạn tồn tại trong hệ thống, nhưng không còn là phiên bản từng mơ ước.",
      creativeSurvivor:
        "Lực lượng sản xuất bị bẻ cong — nhưng tia sáng sáng tạo vẫn còn.",
      systemChanger: "Bạn nhận ra vấn đề không nằm ở cá nhân, mà ở cấu trúc.",
      dreamAbandoned:
        "Bạn không thất bại. Điều kiện sản xuất khiến giấc mơ không thể duy trì.",
      collectiveChange:
        "Bạn chọn sáng tạo tập thể thay vì leo thang doanh nghiệp — chuyển hóa quan hệ sản xuất để giải phóng tài năng.",
    },
    social: {
      itBurnout: "Tỷ lệ burnout ngành IT",
      teacherSalary: "Giáo viên dưới mức sống tối thiểu",
      designerOT: "Designer làm OT không lương",
      creatorDepression: "Creator báo cáo trầm cảm",
    },
  },
  careers: {
    teacher: {
      title: "Giáo viên",
      tagline: "Định hình tư duy, định hình tương lai",
    },
    filmmaker: {
      title: "Nhà làm phim",
      tagline: "Kể những câu chuyện thế giới cần",
    },
    artist: { title: "Nghệ sĩ", tagline: "Sáng tạo điều không thể đo lường" },
    developer: {
      title: "Lập trình viên",
      tagline: "Học hỏi · teamwork · giải quyết vấn đề",
    },
    designer: {
      title: "Truyền thông / Thiết kế",
      tagline: "Sáng tạo · KPI · xử lý feedback",
    },
    teacher: {
      title: "Nhà giáo",
      tagline: "Định hình tư duy, định hình tương lai",
    },
    filmmaker: {
      title: "Nhà làm phim",
      tagline: "Kể những câu chuyện thế giới cần",
    },
    artist: { title: "Họa sĩ", tagline: "Sáng tạo điều không thể đo lường" },
    translator: {
      title: "Ngôn ngữ",
      tagline: "Kết nối thế giới bằng ngôn ngữ",
    },
    founder: {
      title: "Kinh doanh",
      tagline: "Thay đổi thế giới — hoặc kiệt sức vì nó",
    },
    ngo: {
      title: "Phi lợi nhuận",
      tagline: "Ý nghĩa xã hội, nguồn lực hạn chế",
    },
  },
  environments: {
    corporate: {
      title: "Công ty tập đoàn",
      description: "Lương ổn định, hệ thống phân cấp cứng, ít tự do sáng tạo",
    },
    startup: {
      title: "Startup",
      description: "Nhịp độ nhanh, giấc mơ cổ phần, văn hóa kiệt sức",
    },
    ngo: {
      title: "Tổ chức phi lợi nhuận",
      description: "Công việc có ý nghĩa, thiếu kinh phí, lao động cảm xúc",
    },
    freelance: {
      title: "Freelance",
      description: "Tự do và bất ổn song song",
    },
    government: {
      title: "Cơ quan nhà nước",
      description: "Ổn định việc làm, quan liêu, đổi mới chậm",
    },
  },
  stages: {
    student: { title: "Sinh viên", subtitle: "Tràn đầy hy vọng và tiềm năng" },
    intern: {
      title: "Thực tập sinh",
      subtitle: "Lần đầu chạm vào thế giới thực",
    },
    fresher: { title: "Fresher", subtitle: "Bước vào lực lượng lao động" },
    year1: { title: "1 năm kinh nghiệm", subtitle: "Thực tế dần lộ diện" },
    year3: { title: "3 năm kinh nghiệm", subtitle: "Ngã ba đường xuất hiện" },
  },
  events: {
    s1: {
      title: "Kỳ vọng gia đình",
      narrative:
        'Bố mẹ hỏi: "Nghề này có kiếm được nhiều tiền không?" Gánh nặng kỳ vọng đè lên vai bạn.',
      choices: ["Vẫn theo đuổi đam mê", "Thỏa hiệp vì ổn định"],
    },
    s2: {
      title: "Tia sáng sáng tạo đầu tiên",
      narrative:
        "Bạn tạo ra thứ gì đó tự hào. Trong khoảnh khắc, giấc mơ có vẻ thật và trong tầm tay.",
      choices: ["Chia sẻ với thế giới", "Giữ riêng — sợ bị phán xét"],
    },
    i1: {
      title: "Làm thêm không lương",
      narrative:
        '"Ai cũng vậy." Sếp giao việc cuối tuần không trả công. Thời gian của bạn không được trân trọng.',
      choices: ["Im lặng chấp nhận", "Phản hồi một cách chuyên nghiệp"],
    },
    i2: {
      title: "Được mentor công nhận",
      narrative:
        "Một đồng nghiệp cấp cao thấy tiềm năng và hướng dẫn chân thành. Khoảnh khắc hiếm hoi được nhìn thấy.",
      choices: ["Đón nhận sự hướng dẫn", "Giữ thận trọng — khó tin tưởng"],
    },
    f1: {
      title: "Quản lý độc hại",
      narrative:
        "Sếp chiếm công lao của bạn. Cuộc họp như màn trình diễn quyền lực, không phải hợp tác.",
      choices: ["Chịu đựng vì lương", "Ghi nhận và báo cáo"],
    },
    f2: {
      title: "Thực tế lương thấp",
      narrative:
        "Thuê nhà, ăn uống, đi lại — lương vừa đủ sống sót. Giấc mơ có vẻ đắt đỏ.",
      choices: ["Làm thêm việc phụ", "Cắt giảm chi tiêu, giữ giấc mơ"],
    },
    y1a: {
      title: "Cảnh báo kiệt sức",
      narrative:
        "Bạn không ngủ được. Sáng tạo trống rỗng. Hệ thống đòi hỏi nhiều hơn khả năng bạn có.",
      choices: [
        'Cố gắng — văn hóa "hustle"',
        "Nghỉ để chăm sóc sức khỏe tinh thần",
      ],
    },
    y1b: {
      title: "AI thay thế việc làm",
      narrative:
        'Tiêu đề báo chí: "AI sẽ thay thế nghề của bạn." Nỗi sợ lan khắp văn phòng như khói.',
      choices: [
        "Học công cụ mới cấp tốc",
        "Đặt câu hỏi về hệ thống, không phải bản thân",
      ],
    },
    y1c: {
      title: "Kìm hãm sáng tạo",
      narrative:
        'Ý tưởng hay nhất bị từ chối vì "không đúng thương hiệu." Bạn thành cỗ máy thực thi tầm nhìn người khác.',
      choices: ["Tuân theo để giữ việc", "Sáng tạo bí mật bên cạnh"],
    },
    y3a: {
      title: "Cơ hội nước ngoài",
      narrative:
        "Lời mời từ nước ngoài — lương tốt hơn, văn hóa mới, bỏ lại tất cả phía sau.",
      choices: ["Liều một lần", "Ở lại vì cộng đồng"],
    },
    y3b: {
      title: "Cộng đồng công nhận",
      narrative:
        "Công việc giúp người thật. Cộng đồng cảm ơn bạn công khai. Lần đầu bạn cảm thấy được nhìn thấy.",
      choices: ["Chia sẻ khoảnh khắc", "Khiêm tốn, tiếp tục làm việc"],
    },
    y3c: {
      title: "Ngã ba đường",
      narrative:
        "Ba con đường: leo nấc thang công ty, đấu tranh thay đổi hệ thống, hoặc rời bỏ hoàn toàn.",
      choices: [
        "Leo nấc thang",
        "Đấu tranh thay đổi hệ thống",
        "Rời khỏi hệ thống",
      ],
    },
  },
  endings: {
    burnedOut: {
      title: "Kiệt sức",
      subtitle: "Ngọn lửa từng cháy sáng đã tắt",
      quote: "Bạn trao hết mọi thứ. Hệ thống lấy hết và trả lại sự mệt mỏi.",
      description:
        "Lực lượng sản xuất — tài năng, đam mê, sáng tạo — bị nuốt chửng bởi quan hệ sản xuất đòi hỏi sản lượng vô hạn mà không quan tâm con người lao động.",
    },
    corporateMachine: {
      title: "Cỗ máy doanh nghiệp",
      subtitle: "Thành công trên giấy, trống rỗng bên trong",
      quote: "Bạn leo thang. Nhưng thang đó dựa vào bức tường sai.",
      description:
        "Bạn thích nghi hoàn toàn với hệ thống đến mức giấc mơ ban đầu không còn nhận ra. Lực lượng sản xuất bị bẻ theo quan hệ sản xuất.",
    },
    creativeSurvivor: {
      title: "Người sáng tạo sống sót",
      subtitle: "Đầy vết thương nhưng vẫn sáng tạo",
      quote: "Họ cố bẻ gãy bạn. Bạn cong đi, nhưng không gãy.",
      description:
        "Dù bị kìm hãm, bạn giữ được tia sáng sáng tạo. Mâu thuẫn vẫn còn — nhưng bạn cũng vậy.",
    },
    systemChanger: {
      title: "Người thay đổi hệ thống",
      subtitle: "Bạn chọn chuyển hóa, không phải tuân theo",
      quote:
        "Một người không sửa được tất cả. Nhưng một người có thể bắt đầu tất cả.",
      description:
        "Bạn nhận ra tài năng cá nhân không thể vượt qua rào cản cấu trúc. Bạn đấu tranh cho quan hệ sản xuất mới giải phóng lực lượng sản xuất.",
    },
    dreamAbandoned: {
      title: "Giấc mơ bị bỏ lại",
      subtitle: "Giấc mơ chưa bao giờ là vấn đề",
      quote:
        "Đôi khi người tài năng không thất bại. Đôi khi hệ thống làm họ thất bại.",
      description:
        "Bạn buông giấc mơ không phải vì thiếu năng lực, mà vì điều kiện sản xuất khiến duy trì nó là không thể.",
    },
    collectiveChange: {
      title: "Thay đổi tập thể",
      subtitle: "Quan hệ sản xuất mới, lực lượng được giải phóng",
      quote: "Bạn không chờ phép. Bạn xây cấu trúc mới nơi tài năng được thở.",
      description:
        "Từ chối nấc thang doanh nghiệp và nuôi dưỡng cộng đồng, bạn bắt đầu chuyển hóa quan hệ sản xuất — giải phóng lực lượng sản xuất cho sáng tạo chung.",
    },
  },
};
