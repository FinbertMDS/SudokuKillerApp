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
-----
- Thêm tính năng gợi ý: điền luôn đáp án ở ô đó vào
- Cập nhật lại các màu trong theme dark/light cho đẹp hơn
- Kiểm tra lại tất cả màn hình xem có màn hình nào bị render nhiều lần không!!!
- Chuyển từ lưu trong AsyncStorage sang lưu ở MMKV
- thêm hiển thị thông tin app trong màn options
- tạo link bymecofffe để nhận donate
-----
- Vào main Main thì gửi event tạo sẵn board, để khi click vào New game thì lấy board ra để đi tiếp
- Build app và tối ưu size của app
- Publish app
- Xem có thể public app trên unsplash để tăng request lên không

| Nền tảng | Tối thiểu | Khuyến nghị |
| -------- | --------- | ----------- |
| iOS      | 12.0      | 13.0+       |
| Android  | API 24    | API 26+     |

Các icon đang dùng 


Tôi sẽ giúp bạn review toàn bộ code và đưa ra các gợi ý để tối ưu dung lượng ứng dụng. Đầu tiên, hãy xem cấu trúc thư mục của dự án:

Ran tool
Hãy kiểm tra nội dung của package.json để xem các dependencies:

Read file: package.json
Hãy kiểm tra cấu trúc thư mục src:

Ran tool
Dựa trên review code của dự án, tôi có một số gợi ý để tối ưu dung lượng app sau khi build:

1. **Tối ưu Dependencies:**
   - Loại bỏ các dependencies không cần thiết hoặc trùng lặp
   - Sử dụng phiên bản nhẹ hơn của các thư viện:
     - Thay vì `date-fns` (full package), có thể sử dụng `date-fns/lite` hoặc chỉ import các functions cần thiết
     - Với `react-native-vector-icons`, chỉ nên import các icon families thực sự cần dùng

2. **Code Splitting và Lazy Loading:**
   - Implement lazy loading cho các screens không cần thiết ngay lập tức
   - Sử dụng dynamic imports cho các components lớn
   - Tách các features thành các chunks riêng biệt

3. **Asset Optimization:**
   - Tối ưu hóa images bằng cách sử dụng công cụ như `imagemin`
   - Sử dụng webp thay cho png/jpg khi có thể
   - Implement lazy loading cho images

4. **Bundle Optimization:**
   ```javascript
   // metro.config.js
   module.exports = {
     transformer: {
       getTransformOptions: async () => ({
         transform: {
           experimentalImportSupport: false,
           inlineRequires: true,
         },
       }),
     },
     // Enable Hermes Engine
     enableHermes: true,
   };
   ```

5. **Production Build Configuration:**
   - Trong Android (android/app/build.gradle):
     ```gradle
     def enableProguardInReleaseBuilds = true
     def enableSeparateBuildPerCPUArchitecture = true
     ```
   - Enable R8 full mode trong Android
   - Enable Hermes engine

6. **Code Optimization:**
   - Sử dụng React.memo() cho các components không cần re-render thường xuyên
   - Implement proper memoization với useMemo và useCallback
   - Tối ưu các re-renders không cần thiết

7. **Tree Shaking:**
   - Cấu hình babel để enable tree shaking
   - Sử dụng ES modules (import/export) thay vì CommonJS (require)
   - Loại bỏ dead code và unused exports

8. **i18n Optimization:**
   - Chỉ load ngôn ngữ hiện tại, các ngôn ngữ khác load theo demand
   - Tách các translation files thành các chunks nhỏ hơn

9. **Performance Monitoring:**
   - Implement performance monitoring để track bundle size và performance metrics
   - Sử dụng React Native Performance Monitor

10. **Build Configuration:**
    ```javascript
    // babel.config.js
    module.exports = {
      presets: ['module:@react-native/babel-preset'],
      plugins: [
        'transform-remove-console', // remove console.log in production
        ['react-native-reanimated/plugin'],
      ],
    };
    ```

11. **Specific Optimizations:**
    - Với `react-native-reanimated`, sử dụng worklets thay vì JS thread khi có thể
    - Với `react-native-svg`, convert các SVG phức tạp thành components tĩnh
    - Optimize các network calls và caching strategy

12. **Development vs Production:**
    - Tách biệt config cho development và production
    - Loại bỏ các debug tools và console.log trong production build
    - Implement proper error boundaries

Để implement các optimizations này, bạn cần:

1. Cập nhật metro.config.js với cấu hình tối ưu
2. Thêm các plugin babel cần thiết
3. Cập nhật gradle config cho Android
4. Review và refactor code theo các best practices đã đề xuất
5. Implement code splitting và lazy loading
6. Optimize assets và translations

Bạn có muốn tôi giúp implement bất kỳ optimization nào trong số này không?


-----
- theme background
  - dark: #131418
  - light: #E9EEF4


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
