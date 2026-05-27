/** Quiz ngành Lập trình viên — mỗi câu 5 đáp án, 1 đáp án lệch (wrongIndex) */
export const developerQuiz = [
  {
    id: 'dev1',
    narrative:
      'Sprint đầu tiên: tech lead yêu cầu bạn chọn hướng xử lý khi deadline gấp và code legacy khó đọc.',
    choices: [
      { label: 'Ưu tiên học hỏi từ senior', effects: { growth: 12, passion: 6 }, score: 80 },
      { label: 'Phối hợp nhóm để chia task', effects: { growth: 10, recognition: 8 }, score: 85 },
      { label: 'Thích nghi quy trình hiện tại', effects: { stress: -5, money: 5 }, score: 75 },
      { label: 'Tập trung giải quyết vấn đề cốt lõi', effects: { growth: 14, burnoutRisk: 3 }, score: 90 },
      { label: 'Bỏ ngành, chuyển sang bán hàng online', wrong: true, effects: { passion: -20 }, score: 0 },
    ],
  },
  {
    id: 'dev2',
    narrative: 'Công ty thông báo cắt ngân sách đào tạo. Bạn vẫn phải deliver tính năng mới.',
    choices: [
      { label: 'Tự học tài liệu mã nguồn mở', effects: { growth: 15, passion: 8 }, score: 88 },
      { label: 'Nhờ mentor ngoài giờ', effects: { recognition: 10, growth: 8 }, score: 82 },
      { label: 'Làm việc nhóm chia sẻ kiến thức', effects: { growth: 12, stress: -4 }, score: 86 },
      { label: 'Đổi stack cá nhân để thử thách', effects: { passion: 10, burnoutRisk: 6 }, score: 70 },
      { label: 'Từ chối học — chỉ copy-paste', wrong: true, effects: { growth: -15 }, score: 0 },
    ],
  },
  {
    id: 'dev3',
    narrative: 'Tin tức AI có thể thay thế một phần công việc của team bạn.',
    choices: [
      { label: 'Học công cụ AI để tăng năng suất', effects: { growth: 18, money: 6 }, score: 92 },
      { label: 'Thảo luận với team về định hướng', effects: { recognition: 12, passion: 5 }, score: 85 },
      { label: 'Giữ nguyên cách làm truyền thống', effects: { stress: 8, growth: -5 }, score: 40 },
      { label: 'Đề xuất quy trình mới cho công ty', effects: { growth: 14, recognition: 14 }, score: 95 },
      { label: 'Phớt lờ vì tin AI không ảnh hưởng', wrong: true, effects: { burnoutRisk: 10 }, score: 0 },
    ],
  },
];
