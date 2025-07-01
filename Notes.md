Dựa trên phân tích cấu trúc project, đây là cấu trúc thư mục quan trọng của **SudokuKillerApp**:

## 📁 Cấu trúc thư mục quan trọng - SudokuKillerApp

```
SudokuKillerApp/
├── �� Mobile Platforms
│   ├── android/                 # Android native code
│   │   ├── app/
│   │   │   ├── src/main/
│   │   │   │   ├── java/com/finbertngo/sudokukiller/
│   │   │   │   │   ├── MainActivity.kt
│   │   │   │   │   └── MainApplication.kt
│   │   │   │   └── res/         # Android resources
│   │   │   └── build.gradle
│   │   └── build.gradle
│   └── ios/                     # iOS native code
│       ├── SudokuKillerApp/
│       │   ├── AppDelegate.swift
│       │   ├── Info.plist
│       │   └── Images.xcassets/
│       └── Podfile
│
├── �� Core Application
│   ├── src/
│   │   ├── App.tsx              # Main App component
│   │   ├── appConfig.ts         # App configuration
│   │   │
│   │   ├── 📱 Screens/          # Main screen components
│   │   │   ├── MainScreen/      # Home screen
│   │   │   ├── BoardScreen/     # Game board screen
│   │   │   ├── StatisticsScreen/ # Statistics & charts
│   │   │   ├── LeaderboardScreen/ # Rankings
│   │   │   ├── PlayerScreen/    # Player profiles
│   │   │   ├── SettingsScreen/  # App settings
│   │   │   ├── HowToPlayScreen/ # Tutorial
│   │   │   ├── OptionsScreen/   # Game options
│   │   │   ├── AboutGame/       # About page
│   │   │   └── SkWebViewScreen/ # Web view screens
│   │   │
│   │   ├── 🧩 Components/       # Reusable UI components
│   │   │   ├── Board/           # Game board components
│   │   │   │   ├── Grid.tsx     # Sudoku grid
│   │   │   │   ├── NumberPad.tsx # Number input
│   │   │   │   ├── ActionButtons.tsx # Game actions
│   │   │   │   ├── CageBorders.tsx # Killer Sudoku cages
│   │   │   │   ├── InfoPanel.tsx # Game info
│   │   │   │   └── PauseModal.tsx # Pause dialog
│   │   │   ├── Statistics/      # Chart components
│   │   │   │   ├── ChartsStats.tsx
│   │   │   │   ├── GameBarChart.tsx
│   │   │   │   ├── GamePieChart.tsx
│   │   │   │   ├── TimeLineChart.tsx
│   │   │   │   └── LevelStats.tsx
│   │   │   ├── Leaderboard/     # Ranking components
│   │   │   │   ├── PlayerRanking.tsx
│   │   │   │   ├── TimeRanking.tsx
│   │   │   │   ├── LevelRanking.tsx
│   │   │   │   └── CompletionRanking.tsx
│   │   │   ├── Player/          # Player components
│   │   │   ├── Main/            # Main menu components
│   │   │   ├── HowToPlay/       # Tutorial components
│   │   │   ├── GameHistory/     # Game history components
│   │   │   └── commons/         # Common UI components
│   │   │
│   │   ├── 🔧 Services/         # Business logic services
│   │   │   ├── BoardService.ts  # Game board logic
│   │   │   ├── PlayerService.ts # Player management
│   │   │   ├── StatsService.ts  # Statistics calculation
│   │   │   ├── LeaderboardService.ts # Rankings
│   │   │   ├── SettingsService.ts # App settings
│   │   │   ├── QuoteService.ts  # Daily quotes
│   │   │   └── BackgroundService.ts # Background tasks
│   │   │
│   │   ├── 💾 Storage/          # Data persistence
│   │   │   ├── appStorage.ts    # App-wide storage
│   │   │   ├── gameStorage.ts   # Game data storage
│   │   │   ├── statsStorage.ts  # Statistics storage
│   │   │   ├── playerProfileStorage.ts # Player profiles
│   │   │   ├── leaderboard.ts   # Leaderboard data
│   │   │   ├── migrations/      # Database migrations
│   │   │   └── mock/            # Mock data for testing
│   │   │
│   │   ├── 🎣 Hooks/            # Custom React hooks
│   │   │   ├── useGameTimer.ts  # Game timer logic
│   │   │   ├── usePlayerProfile.ts # Player state
│   │   │   ├── useInitGame.ts   # Game initialization
│   │   │   ├── useHintCounter.ts # Hint system
│   │   │   ├── useMistakeCounter.ts # Error tracking
│   │   │   └── useDailyQuote.ts # Daily quotes
│   │   │
│   │   ├── 🌍 i18n/             # Internationalization
│   │   │   ├── i18n.ts          # i18n configuration
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   └── locales/         # Language files
│   │   │       ├── en.json      # English
│   │   │       ├── ja.json      # Japanese
│   │   │       └── vi.json      # Vietnamese
│   │   │
│   │   ├── 🎨 Theme/            # UI theming
│   │   │   └── themeStyles.ts   # Theme definitions
│   │   │
│   │   ├── 📊 Types/            # TypeScript type definitions
│   │   │   ├── game.ts          # Game-related types
│   │   │   ├── player.ts        # Player types
│   │   │   ├── stats.ts         # Statistics types
│   │   │   ├── leaderboard.ts   # Leaderboard types
│   │   │   └── settings.ts      # Settings types
│   │   │
│   │   ├── ��️ Utils/            # Utility functions
│   │   │   ├── boardUtil.ts     # Board calculations
│   │   │   ├── statsUtil.ts     # Statistics helpers
│   │   │   ├── playerUtil.ts    # Player utilities
│   │   │   ├── dateUtil.ts      # Date handling
│   │   │   ├── colorUtil.ts     # Color utilities
│   │   │   └── constants.ts     # App constants
│   │   │
│   │   ├── 📡 Events/           # Event system
│   │   │   ├── eventBus.ts      # Event bus
│   │   │   ├── handlers/        # Event handlers
│   │   │   └── types/           # Event types
│   │   │
│   │   ├── 🧭 Navigation/       # Navigation setup
│   │   │   └── BottomTabs.tsx   # Bottom tab navigation
│   │   │
│   │   └── ��️ Context/          # React Context
│   │       └── ThemeContext.tsx # Theme context
│   │
├── 📦 Configuration Files
│   ├── package.json             # Dependencies & scripts
│   ├── app.json                 # React Native config
│   ├── tsconfig.json            # TypeScript config
│   ├── babel.config.js          # Babel config
│   ├── metro.config.js          # Metro bundler config
│   └── jest.config.js           # Testing config
│
├── 🎨 Assets/                   # Static assets
│   ├── images/                  # Images
│   ├── tutorial/                # Tutorial images
│   └── htmls/                   # HTML files (licenses, etc.)
│
└── 📸 Screenshots/              # App screenshots
    ├── Board_Dark.png
    ├── Board_Light.png
    ├── ChartsStats_Dark.png
    └── ChartsStats_Light.png
```

## 🔑 Đặc điểm quan trọng:

1. **Kiến trúc React Native** với TypeScript
2. **Hỗ trợ đa ngôn ngữ** (EN, JA, VI)
3. **Hệ thống theme** (Dark/Light mode)
4. **Quản lý state** qua React Hooks và Context
5. **Lưu trữ local** với MMKV
6. **Hệ thống event** để xử lý game events
7. **Thống kê chi tiết** với biểu đồ
8. **Leaderboard** với nhiều loại ranking
9. **Killer Sudoku** - phiên bản nâng cao của Sudoku

Đây là một ứng dụng Sudoku hoàn chỉnh với nhiều tính năng nâng cao và kiến trúc code được tổ chức tốt!

---

- đa ngôn ngữ
- numpad: nếu đã điền toàn bộ số vào các ô thì xóa khỏi numpad.
  VD: số 1 khi được điền 9 lần thì số 1 sẽ ko hiển thị ở numpad nữa

---

- Tối ưu lại hiển thị của Grid.tsx renderCell để hàm này không bị gọi lại nhiều lần
- Statisic chỉ hiển thị của 7 ngày gần nhất

---

- xoá ghi chú khi điền số vào 1 ô: xoá trong ô đó, xoá các ghi chú bằng số đó cùng hàng và cột
- cho hiển thị số của notes bé lại 1 chút
- Hiển thị của notes và tổng cage bị trùng vào nhau khó nhìn
- Expert vẫn dễ, ban đầu ko hiển thị số nào gợi ý
- Nếu ở mode ghi chú thì cho hiển thị tất cả các numpad.

---

- Thêm tính năng gợi ý: điền luôn đáp án ở ô đó vào
- Cập nhật lại các màu trong theme dark/light cho đẹp hơn
- Kiểm tra lại tất cả màn hình xem có màn hình nào bị render nhiều lần không!!!
- Chuyển từ lưu trong AsyncStorage sang lưu ở MMKV
- thêm hiển thị thông tin app trong màn options
- tạo link bymecofffe để nhận donate

---

- Vào main Main thì gửi event tạo sẵn board, để khi click vào New game thì lấy board ra để đi tiếp
- Build app và tối ưu size của app
- Publish app
- Xem có thể public app trên unsplash để tăng request lên không

| Nền tảng | Tối thiểu | Khuyến nghị |
| -------- | --------- | ----------- |
| iOS      | 12.0      | 13.0+       |
| Android  | API 24    | API 26+     |

---

Release bug
_Android_

- trang licenses không hiển thị được do lỗi: ERR_CLEARTEXT_NOT_PERMITTED
- trang setting bị chèn ở bottom, không hiển thị hết clear storage
- timefilter không bo tròn ở last item
- thống kê: phân bổ ván theo mức độ: stackedbar nếu ko có data thì cũng hiển thị no data
- thống kê: khi scroll xuống dưới thì 2 chip bên trên vẫn phải có padding

---

app ID
ca-app-pub-4776985253905766~3093131803

ad unit ID: killer-sudoku-ios-main
ca-app-pub-4776985253905766/8720863006

ad unit ID: killer-sudoku-ios-interstitial
ca-app-pub-4776985253905766/9006985221

ad unit ID: killer-sudoku-ios-reward
ca-app-pub-4776985253905766/1244394325

---

android
app ID
ca-app-pub-4776985253905766~6216922933

ad unit ID: killer-sudoku-android-main
ca-app-pub-4776985253905766/8853876327

ad unit ID: killer-sudoku-android-interstitial
ca-app-pub-4776985253905766/1559800119

ad unit ID: killer-sudoku-android-reward
ca-app-pub-4776985253905766/6812126796

---

Lệnh bundle JavaScript code và copy assets với ios

npx react-native bundle \
 --platform ios \
 --dev false \
 --entry-file index.js \
 --bundle-output ios/main.jsbundle \
 --assets-dest ios

---

tăng verion trong app.json

chạy lệnh dưới thì tự đổi trong android và ios

> npx react-native-version --never-amend
> npx react-native-version --never-amend --version 1.0.1

với fastlane thì tự động tăng version code bằng

> android_set_version_code

---

sau khi đổi biến .env cần reset cache
npx react-native start --reset-cache
