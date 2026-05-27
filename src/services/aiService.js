/**
 * Phân tích kết thúc game bằng Gemini — gọi trực ti tiếp từ server.
 * Trên trình duyệt: analyzeGameEnd() proxy qua POST /api/ai/analyze.
 */

const ENV_FREEDOM = {
  corporate: 25,
  startup: 65,
  ngo: 55,
  freelance: 80,
  government: 20,
};

const CAREER_LABELS = {
  developer: 'Lập trình viên',
  designer: 'Truyền thông / Thiết kế',
  teacher: 'Nhà giáo',
  filmmaker: 'Nhà làm phim',
  artist: 'Họa sĩ',
  translator: 'Ngôn ngữ',
  founder: 'Kinh doanh',
  ngo: 'Phi lợi nhuận',
};

const ENV_LABELS = {
  corporate: 'Công ty tập đoàn',
  startup: 'Startup',
  ngo: 'Tổ chức phi lợi nhuận',
  freelance: 'Freelance',
  government: 'Nhà nước / Công quyền',
};

const ENDING_LABELS = {
  burnedOut: 'Kiệt sức',
  corporateMachine: 'Cỗ máy doanh nghiệp',
  creativeSurvivor: 'Người sáng tạo sống sót',
  systemChanger: 'Người thay đổi hệ thống',
  dreamAbandoned: 'Từ bỏ giấc mơ',
  collectiveChange: 'Thay đổi tập thể',
};

/** Chỉ số gameplay gửi lên AI (theo yêu cầu đồ án). */
export function buildGameplayMetrics(stats = {}, environmentId = null) {
  const freedom =
    ENV_FREEDOM[environmentId] ??
    Math.round(((stats.creativity ?? 50) + (stats.money ?? 50)) / 2);

  return {
    passion: Math.round(stats.passion ?? 0),
    money: Math.round(stats.money ?? 0),
    stress: Math.round(100 - (stats.mentalHealth ?? 50)),
    growth: Math.round(stats.creativity ?? 0),
    recognition: Math.round(stats.socialRecognition ?? 0),
    freedom: Math.round(freedom),
  };
}

export function buildAnalysisPayload({
  careerId,
  environmentId,
  stats,
  endingId,
  flags = {},
  history = [],
  choices = [],
  teamName = null,
  score = null,
}) {
  const metrics = buildGameplayMetrics(stats, environmentId);
  const journey = history.map((h) => ({
    stage: h.label,
    passion: h.passion,
    money: h.money,
    creativity: h.creativity,
    mentalHealth: h.mentalHealth,
    socialRecognition: h.socialRecognition,
  }));

  return {
    player: teamName ? { teamName, score } : null,
    career: CAREER_LABELS[careerId] || careerId,
    environment: ENV_LABELS[environmentId] || environmentId,
    ending: ENDING_LABELS[endingId] || endingId,
    endingId,
    metrics,
    rawStats: { ...stats },
    flags,
    journey,
    choices: choices.map((c, i) => ({
      n: i + 1,
      stage: c.stageTitle || c.stage,
      question: c.questionTitle || c.question,
      answer: c.choiceLabel || c.answer,
      effects: c.effects || null,
    })),
  };
}

function buildPrompt(payload) {
  return `Bạn là AI phân tích kết quả mô phỏng game giáo dục MLN111 (Triết học Mác – Lênin) về lao động tri thức và công nghệ AI.

Bối cảnh: AI trong dự án đại diện cho công nghệ hiện đại, sự phát triển lực lượng sản xuất, và mâu thuẫn mới trong lao động thời đại AI — KHÔNG phải chatbot hỗ trợ chung.

Dữ liệu người chơi (JSON):
${JSON.stringify(payload, null, 2)}

Hãy phân tích bằng tiếng Việt, giọng văn sâu sắc nhưng dễ hiểu cho sinh viên (2–4 câu mỗi mục, trừ burnoutSummary 1 câu).

Trả về ĐÚNG một JSON object (không markdown) với các khóa:
{
  "conclusion": "kết luận cá nhân hóa",
  "careerTrend": "phân tích xu hướng nghề nghiệp dựa trên lựa chọn và chỉ số",
  "burnoutLevel": "low | moderate | high | critical",
  "burnoutSummary": "mô tả ngắn mức burnout",
  "passionRealityConflict": "mâu thuẫn giữa đam mê và thực tế lao động",
  "forcesAndRelations": "liên hệ lực lượng sản xuất (công nghệ, kỹ năng, sáng tạo) và quan hệ sản xuất (sở hữu, quản lý, KPI, hợp đồng)"
}`;
}

function parseAnalysisJson(text) {
  const raw = String(text || '').trim();
  const jsonStr = raw.startsWith('{') ? raw : raw.replace(/^```json?\s*|\s*```$/g, '');
  const parsed = JSON.parse(jsonStr);
  const required = [
    'conclusion',
    'careerTrend',
    'burnoutLevel',
    'burnoutSummary',
    'passionRealityConflict',
    'forcesAndRelations',
  ];
  for (const key of required) {
    if (!parsed[key]) throw new Error(`AI response missing: ${key}`);
  }
  return parsed;
}

async function callGemini(payload) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY_MISSING');
    err.code = 'GEMINI_API_KEY_MISSING';
    throw err;
  }

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.75,
      maxOutputTokens: 2048,
    },
  });

  const result = await model.generateContent(buildPrompt(payload));
  const text = result.response?.text?.();
  if (!text) throw new Error('Empty AI response');
  return parseAnalysisJson(text);
}

/** Gọi từ server Node — không expose API key ra client. */
export async function analyzeGameEnd(payload) {
  if (typeof window !== 'undefined') {
    return requestEndingAnalysis(payload);
  }
  return callGemini(payload);
}

function getApiBaseUrl() {
  const base = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || '';
  return String(base).replace(/\/$/, '');
}

/** Client: gọi game server (dev: Vite proxy /api). */
export async function requestEndingAnalysis(payload) {
  const apiBase = getApiBaseUrl();
  const res = await fetch(`${apiBase}/api/ai/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'AI_ANALYSIS_FAILED');
    err.code = data.code || data.error;
    throw err;
  }
  return data.analysis;
}

export function getFallbackAnalysis(payload, reasonCode) {
  const m = payload?.metrics || buildGameplayMetrics(payload?.rawStats || {});
  const stressHigh = m.stress >= 60;
  const passionLow = m.passion < 40;

  return {
    conclusion: stressHigh
      ? 'Hành trình cho thấy bạn đã hy sinh sức khỏe tinh thần để thích nghi với nhịp độ hệ thống — không phải thiếu năng lực, mà thiếu không gian phục hồi.'
      : 'Bạn vẫn giữ được phần nào đam mê và khả năng thích ứng, dù quan hệ sản xuất liên tục đặt áp lực lên lao động sáng tạo.',
    careerTrend: passionLow
      ? 'Xu hướng nghề nghiệp đang lệch về “an toàn hệ thống” hơn là phát triển bản sắc nghề — cần tái cân bằng giữa kỹ năng mới (AI) và ranh giới cá nhân.'
      : 'Xu hướng cho thấy bạn ưu tiên tích lũy năng lực và công nhận trong khi vẫn tranh giành ý nghĩa công việc — điển hình lao động tri thức thời AI.',
    burnoutLevel: m.stress >= 70 ? 'critical' : m.stress >= 50 ? 'high' : m.stress >= 35 ? 'moderate' : 'low',
    burnoutSummary:
      m.stress >= 60
        ? 'Burnout ở mức đáng lo — căng thẳng vượt ngưỡng bền vững.'
        : 'Burnout ở mức có thể quản lý nếu điều chỉnh nhịp làm việc.',
    passionRealityConflict:
      m.passion > m.money + 15
        ? 'Đam mê và thu nhập/ổn định đang kéo ngược chiều — mâu thuẫn điển hình giữa ý nghĩa lao động và áp lực sinh kế.'
        : 'Mâu thuẫn đam mê – thực tế xuất hiện ở các lựa chọn “chấp nhận hệ thống” thay vì “đổi hệ thống”.',
    forcesAndRelations:
      'Lực lượng sản xuất (AI, công cụ số, kỹ năng mới) phát triển nhanh hơn quan hệ sản xuất (KPI, sở hữu phần mềm, hợp đồng) — tạo ra áp lực buộc lao động thích nghi liên tục mà ít được bảo vệ.',
    _fallback: true,
    _reason: reasonCode,
  };
}
