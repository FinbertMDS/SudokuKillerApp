- đa ngôn ngữ
- numpad: nếu đã điền toàn bộ số vào các ô thì xóa khỏi numpad.
  VD: số 1 khi được điền 9 lần thì số 1 sẽ ko hiển thị ở numpad nữa
-----
- Tối ưu lại hiển thị của Grid.tsx renderCell để hàm này không bị gọi lại nhiều lần
- Statisic chỉ hiển thị của 7 ngày gần nhất
-----
- xoá ghi chú khi điền số vào 1 ô: xoá trong ô đó, xoá các ghi chú bằng số đó cùng hàng và cột
- cho hiển thị số của notes bé lại 1 chút
- Hiển thị của notes và tổng cage bị trùng vào nhau khó nhìn
- Expert vẫn dễ, ban đầu ko hiển thị số nào gợi ý
- Nếu ở mode ghi chú thì cho hiển thị tất cả các numpad.

const sampleGameLogs = [
  {
    id: "6a5d4532-1f68-4c63-8805-7b9ec6db12b9",
    level: "easy",
    date: "2025-04-30T06:00:00Z",
    durationSeconds: 320,
    completed: true,
    endTime: "2025-04-30T06:05:20Z",
    mistakes: 1,
  },
  {
    id: "a54c38aa-e2c3-4a17-bdbc-4b2b19c4919e",
    level: "medium",
    date: "2025-04-29T14:00:00Z",
    durationSeconds: 450,
    completed: true,
    endTime: "2025-04-29T14:07:30Z",
    mistakes: 2,
  },
  {
    id: "8f28d5c5-f25a-4c01-b01c-330cf88ab47a",
    level: "hard",
    date: "2025-04-28T09:00:00Z",
    durationSeconds: 620,
    completed: true,
    endTime: "2025-04-28T09:10:20Z",
    mistakes: 0,
  },
  {
    id: "64b3e754-92fc-4bfb-89a3-19284930b1b7",
    level: "easy",
    date: "2025-04-27T15:00:00Z",
    durationSeconds: 280,
    completed: false,
    endTime: "2025-04-27T15:04:40Z",
    mistakes: 3,
  },
  {
    id: "de2ea462-2a14-4747-a330-fb98e40481c9",
    level: "medium",
    date: "2025-04-26T08:30:00Z",
    durationSeconds: 540,
    completed: true,
    endTime: "2025-04-26T08:39:00Z",
    mistakes: 1,
  },
  {
    id: "ad457191-1df5-4e07-8f71-e189bf4f29c4",
    level: "hard",
    date: "2025-04-25T13:20:00Z",
    durationSeconds: 700,
    completed: true,
    endTime: "2025-04-25T13:31:00Z",
    mistakes: 0,
  },
  {
    id: "b9ddf823-1f16-437f-95a0-0ce0c9cb7fd0",
    level: "easy",
    date: "2025-04-24T10:00:00Z",
    durationSeconds: 380,
    completed: true,
    endTime: "2025-04-24T10:06:20Z",
    mistakes: 1,
  },
  {
    id: "c52f529e-9c50-4b69-91e0-63db11900251",
    level: "medium",
    date: "2025-04-23T17:45:00Z",
    durationSeconds: 600,
    completed: true,
    endTime: "2025-04-23T17:55:00Z",
    mistakes: 2,
  },
  {
    id: "68d7a35f-9dcd-4af8-b7ed-937019276d1c",
    level: "hard",
    date: "2025-04-22T11:15:00Z",
    durationSeconds: 560,
    completed: true,
    endTime: "2025-04-22T11:24:20Z",
    mistakes: 1,
  },
  {
    id: "2f65793b-7266-4ee1-83e4-f7ef30f1c478",
    level: "medium",
    date: "2025-04-21T09:10:00Z",
    durationSeconds: 420,
    completed: false,
    endTime: "2025-04-21T09:17:00Z",
    mistakes: 2,
  },
  {
    id: "f689dc08-d4db-466a-bf8b-9e8455dd182e",
    level: "easy",
    date: "2025-04-20T07:00:00Z",
    durationSeconds: 300,
    completed: true,
    endTime: "2025-04-20T07:05:00Z",
    mistakes: 0,
  },
  {
    id: "3a3f6c3e-6c6d-474a-8a09-883e832bf783",
    level: "hard",
    date: "2025-04-19T16:00:00Z",
    durationSeconds: 750,
    completed: true,
    endTime: "2025-04-19T16:12:30Z",
    mistakes: 3,
  },
  {
    id: "c8187f10-ef96-40ea-979e-5e26cb25e9d5",
    level: "medium",
    date: "2025-04-18T12:00:00Z",
    durationSeconds: 410,
    completed: true,
    endTime: "2025-04-18T12:06:50Z",
    mistakes: 1,
  },
  {
    id: "d58ae3a3-c802-4b20-8b58-bce243d7e973",
    level: "easy",
    date: "2025-04-17T10:00:00Z",
    durationSeconds: 290,
    completed: false,
    endTime: "2025-04-17T10:04:50Z",
    mistakes: 2,
  }
];
