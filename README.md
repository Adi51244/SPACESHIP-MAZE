# 🚀 Spaceship Maze Puzzle Game

A modern, responsive maze puzzle game where players create paths by rotating tiles and changing arrow directions. Complete levels in the least number of moves to maximize your score!

![Game Banner](https://img.shields.io/badge/Status-Complete-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎮 Game Overview

**Spaceship Maze Puzzle** is an engaging brain-teaser game where your goal is to create a valid path from the spaceship icon to the target by manipulating tiles with directional arrows. The game features:

- ✨ **Beautiful Space-themed UI** with animated starfield background
- 🎯 **5 Progressive Levels** with increasing difficulty
- ⏱️ **Time Challenges** with countdown timer
- 🏆 **Scoring System** based on efficiency and speed
- 📱 **Fully Responsive** - works on desktop, tablet, and mobile
- ⌨️ **Keyboard Shortcuts** for faster gameplay

## 🎯 How to Play

### Objective
Create a path from the **spaceship icon** (left) to the **target icon** (right) by rotating tiles and changing arrow directions. Complete the puzzle in the **least number of moves** to earn the highest score!

### Controls

#### Mouse/Touch Controls
1. **Select a Tile**: Click/tap on any tile to select it
2. **Rotate Tile**: Click the rotate button (🔄) to rotate the selected tile 90° clockwise
3. **Change Arrows**: Click the arrow button (⇅) to flip all arrow directions on the tile
4. **Check Path**: Click the checkmark (✓) to verify if your path is complete

#### Keyboard Shortcuts
- **R** - Rotate selected tile
- **A** - Change arrow direction
- **Enter** - Check path
- **Escape** - Deselect tile

### Game Rules

1. **Path Creation**: Connect the spaceship to the target using tiles with arrows
2. **Arrow Mechanics**: The arrow button changes directions for ALL possible paths entering and exiting the tile
3. **Move Counter**: Each action (rotate/change arrow) counts as one move
4. **Time Limit**: Complete the level before time runs out (varies by level)
5. **Scoring**: Earn more points by:
   - Using fewer moves (closer to optimal)
   - Completing faster
   - Achieving perfect path (optimal moves)

## 🏆 Scoring System

### Base Score
- **1000 points** per level completed

### Bonuses
- **Move Bonus**: Up to 500 points based on move efficiency
  - Formula: `baseScore × (1 - (moves - optimal) / optimal) × 0.5`
- **Time Bonus**: Up to 300 points based on time efficiency
  - Formula: `baseScore × (timeRemaining / timeLimit) × 0.3`
- **Perfect Bonus**: 500 points for matching optimal moves exactly

### Star Rating
- ⭐⭐⭐ **3 Stars**: 90%+ efficiency (moves ≤ optimal × 1.1)
- ⭐⭐ **2 Stars**: 70%+ efficiency (moves ≤ optimal × 1.4)
- ⭐ **1 Star**: Completed

## 📊 Level System

| Level | Grid Size | Optimal Moves | Time Limit | Difficulty |
|-------|-----------|---------------|------------|------------|
| 1     | 6×6       | 8             | 5:00       | Easy       |
| 2     | 7×7       | 12            | 5:00       | Medium     |
| 3     | 8×8       | 15            | 5:00       | Medium     |
| 4     | 8×8       | 18            | 4:00       | Hard       |
| 5     | 9×9       | 22            | 4:00       | Expert     |

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or dependencies required!

### Running the Game

1. **Download/Clone** the repository
   ```bash
   git clone https://github.com/yourusername/spaceship-maze-puzzle.git
   ```

2. **Open the game** in your browser
   - Simply double-click `index.html`
   - Or use a local server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     ```

3. **Play!**
   - Open `http://localhost:8000` in your browser
   - Click "Start Game" and enjoy!

## 📁 Project Structure

```
Spaceship-Maze-Puzzle/
│
├── index.html          # Main HTML structure
├── styles.css          # Styling and animations
├── game.js            # Game logic and mechanics
├── README.md          # This file
│
└── Refference/        # Reference images and design inspiration
    ├── IMG-20251105-WA0001.jpg
    ├── IMG-20251105-WA0002.jpg
    └── ...
```

## 🎨 Features

### Visual Design
- **Cyberpunk/Space Theme** with neon colors
- **Animated Starfield** background with parallax effect
- **Glowing Effects** on buttons and tiles
- **Smooth Transitions** and animations
- **Custom Fonts**: Orbitron (headings), Rajdhani (body)

### Gameplay Features
- **Dynamic Tile Generation** for varied puzzles
- **Path Validation** algorithm
- **Real-time Move Counter**
- **Countdown Timer** with auto-progression
- **Modal System** for rules, success, and game over
- **Responsive Grid** that adapts to different screen sizes

### Technical Features
- **Pure Vanilla JavaScript** - no frameworks required
- **CSS Grid Layout** for responsive design
- **Canvas API** for path visualization
- **Local Storage** ready for save progress (can be added)
- **Performance Optimized** for smooth gameplay

## 🔧 Customization

### Adding New Levels

Edit `game.js` and add to the `levels` array:

```javascript
{
    level: 6,
    gridSize: { rows: 10, cols: 10 },
    optimalMoves: 25,
    timeLimit: 180,
    tiles: generateLevelTiles(6)
}
```

### Changing Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #00d9ff;      /* Cyan */
    --secondary-color: #ff00ff;    /* Magenta */
    --accent-color: #00ff88;       /* Green */
    /* ... more colors ... */
}
```

### Modifying Difficulty

Adjust these parameters in `game.js`:

```javascript
// Base score per level
const baseScore = 1000;

// Time limits
timeLimit: 300  // seconds

// Optimal moves
optimalMoves: 8
```

## 📱 Browser Compatibility

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome  | 90+            | ✅ Fully Supported |
| Firefox | 88+            | ✅ Fully Supported |
| Safari  | 14+            | ✅ Fully Supported |
| Edge    | 90+            | ✅ Fully Supported |
| Opera   | 76+            | ✅ Fully Supported |

## 🐛 Known Issues & Future Enhancements

### Known Issues
- Path visualization on canvas needs enhancement
- Mobile touch controls may need fine-tuning

### Planned Features
- [ ] Save progress to local storage
- [ ] Leaderboard system
- [ ] Sound effects and music
- [ ] More level variations
- [ ] Hint system
- [ ] Undo/Redo functionality
- [ ] Custom level editor
- [ ] Multiplayer mode

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Developer

Created with ❤️ by [Your Name]

## 🙏 Acknowledgments

- Inspired by classic maze puzzle games
- Reference design from Accenture assessment interface
- Font families: Orbitron and Rajdhani from Google Fonts
- Icons: Custom SVG designs

## 📞 Support

If you encounter any issues or have questions:

- Open an issue on GitHub
- Email: your.email@example.com
- Twitter: @yourhandle

---

**Enjoy the game! 🚀 May your paths be optimal and your moves be few!** ⭐⭐⭐
