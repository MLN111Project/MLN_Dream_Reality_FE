/** Quiz ngành Truyền thông / Thiết kế */
export const designerQuiz = [
  {
    id: 'des1',
    narrative:
      'Khách hàng đổi brief lần thứ ba trước deadline 24 giờ. KPI engagement vẫn phải đạt.',
    choices: [
      { label: 'Sáng tạo phương án mới nhanh', effects: { passion: 10, growth: 12 }, score: 88 },
      { label: 'Lắng nghe và xử lý feedback', effects: { recognition: 12, stress: -4 }, score: 90 },
      { label: 'Theo trend ngắn hạn', effects: { money: 8, growth: 6 }, score: 72 },
      { label: 'Phối hợp team content + design', effects: { recognition: 10, passion: 8 }, score: 86 },
      { label: 'Nộp bản cũ, không chỉnh sửa', wrong: true, effects: { recognition: -15 }, score: 0 },
    ],
  },
  {
    id: 'des2',
    narrative: 'Campaign bị chỉ trích trên mạng xã hội. Sếp yêu cầu họp khẩn.',
    choices: [
      { label: 'Phân tích feedback để cải thiện', effects: { growth: 14, passion: 5 }, score: 92 },
      { label: 'Giữ tinh thần sáng tạo', effects: { passion: 12, burnoutRisk: 4 }, score: 80 },
      { label: 'Thích nghi message theo trend', effects: { money: 10, stress: 6 }, score: 75 },
      { label: 'Làm việc nhóm giải quyết khủng hoảng', effects: { recognition: 14, growth: 8 }, score: 94 },
      { label: 'Xóa tài khoản và im lặng', wrong: true, effects: { passion: -18 }, score: 0 },
    ],
  },
  {
    id: 'des3',
    narrative: 'Được mời freelance dự án lớn nhưng trùng giờ OT tại công ty.',
    choices: [
      { label: 'Đàm phán thời gian hợp lý', effects: { money: 15, stress: -5 }, score: 88 },
      { label: 'Ưu tiên KPI công ty trước', effects: { recognition: 10, money: 5 }, score: 82 },
      { label: 'Nhận freelance, hy sinh ngủ', effects: { money: 18, burnoutRisk: 12 }, score: 65 },
      { label: 'Từ chối — tập trung một việc', effects: { passion: 8, stress: -8 }, score: 85 },
      { label: 'Bỏ việc chính để freelance ngay', wrong: true, effects: { money: -10, stress: 20 }, score: 0 },
    ],
  },
];
