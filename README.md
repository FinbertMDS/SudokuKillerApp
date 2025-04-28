# Killer Sudoku Mobile App

Welcome to **Killer Sudoku**, a modern and highly-optimized Sudoku Killer game built with **React Native**.


Board_Dark | Board_Light | Main_Dark | Main_Light
---------|----------|---------|---------
![Board_Dark.png](screenshots/Board_Dark.png) | ![Board_Light.png](screenshots/Board_Light.png) | ![Main_Dark.png](screenshots/Main_Dark.png) | ![Main_Light.png](screenshots/Main_Light.png)

---

## 🎯 Features

- ✅ Generate random Killer Sudoku puzzles across 4 difficulty levels: Easy, Medium, Hard, Expert
- ✅ Killer Sudoku board rendering with dynamic cages and sum labels
- ✅ Notes Mode (pencil in possible numbers)
- ✅ Undo, Erase, Hint system
- ✅ Mistake tracking and limit with popup alert after too many mistakes
- ✅ Game timer (pause/resume supported)
- ✅ Local save & resume for interrupted games
- ✅ Battery optimization (auto-pause timer when app backgrounded)
- ✅ Dark Mode / Light Mode switch (auto detects system theme)

---

## 🚀 Tech Stack

- **React Native** (bare workflow)
- **TypeScript**
- **React Native SVG + react-native-svg** (for cages rendering)
- **AsyncStorage** (for persistent statistics and saves)

---

## 🛠 Installation

```bash
git clone https://github.com/FinbertMDS/SudokuKillerApp.git
cd SudokuKillerApp
npm install
npx pod-install # if iOS
npx react-native run-ios   # or run-android
```

---

## 📈 Planned Features (Coming Soon)

- Statistics tracking per difficulty level:
  - Games started
  - Games completed
  - Best time
  - Average time
- Online Multiplayer mode (Challenge your friends!)
- Daily Killer Sudoku Challenge
- Cloud Syncing (Login + Save Progress)
- Animated Cage Drawing
- Sound effects for move feedback

---

## 📚 Credits

- Sudoku generation inspired by killer-sudoku-generator
- Built with love ❤️ and a passion for math puzzles!

---

## 📜 License

This project is licensed under the MIT License.

---

> Built for puzzle lovers, by puzzle lovers. Happy solving! 🔥🧠
