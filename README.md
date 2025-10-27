<div align="center">

# 🌌 Solar System Simulator

**A procedurally generated solar system simulator with realistic physics**

*Inspired by Android 15 screensaver easter egg*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Canvas API](https://img.shields.io/badge/Canvas_API-2D-blue)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-F7DF1E?logo=javascript&logoColor=black)](https://www.javascript.com/)

[**Live Demo**](https://your-demo-url.com) • [Report Bug](https://github.com/yourusername/solar/issues) • [Request Feature](https://github.com/yourusername/solar/issues)

</div>

---

## ✨ Features

### 🪐 Procedural Generation
- **Deterministic Randomness**: Uses daily date (yyyyMMdd) as seed for consistent results
- **Physics-Based**: Follows Newtonian mechanics and gravitational laws
- **Dynamic Parameters**:
  - ⭐ Star radius: 30,000 ~ 70,000 km
  - 🌟 Star mass: 1×10²⁸ ~ 5×10²⁹ kg
  - 🌍 Planets: 1 ~ 10 bodies per system
  - 🔴 Planet radius: 1,000 ~ 20,000 km
  - 📏 Orbit spacing: 1.1x ~ 2.0x growth factor
  - 🎯 Hill sphere collision detection

### 🎨 Visual Effects
- **Starfield Background**: 200~500 randomly distributed stars
- **Animated Sun**: Gold core with dual-layer rotating wavy rings
- **Colorful Planets**: HSL color space with random hues
- **Hill Spheres**: Semi-transparent red circles showing gravitational influence
- **Orbit Paths**: Cyan dashed circles
- **CRT Flicker Effect**: Retro terminal-style HUD with 2-second boot animation

### 🎮 Interactive Controls
- **Mouse Wheel**: Smooth zoom in/out
- **Left Click + Drag**: Pan camera view
- **Reset Button**: Return to initial viewport with smooth transition (0.1 lerp)
- **Retro HUD**: Green terminal-style display with system parameters

### ⚡ Performance
- **Target Frame Rate**: 30 FPS
- **Time Acceleration**: 500x ~ 2000x (outermost planet completes orbit in 2-5 minutes)
- **Responsive Design**: Auto-adapts to desktop and mobile screens
- **HiDPI Support**: Leverages `devicePixelRatio` for Retina displays

---

## 🚀 Quick Start

### Option 1: Standalone HTML (Recommended)

Simply open `indexwithjs.html` in any modern browser - no server required!

```bash
# Download and open
curl -O https://raw.githubusercontent.com/yourusername/solar/main/indexwithjs.html
open indexwithjs.html  # macOS
start indexwithjs.html  # Windows
xdg-open indexwithjs.html  # Linux
```

### Option 2: Local Development Server

```bash
# Using npx (Node.js required)
npx http-server -p 5173

# Or Python 3
python -m http.server 5173

# Then visit
http://localhost:5173
```

### Option 3: Direct File Access

Double-click `index.html` - CORS compatibility built-in!

### 🎲 Custom Seed

Generate a specific system by adding a date seed:

```
index.html?seed=20250116
indexwithjs.html?seed=20250327
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|--------|
| ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white) | Markup structure |
| ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white) | Styling and layout |
| ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black) | Core logic (ES6+) |
| ![Canvas](https://img.shields.io/badge/-Canvas_API-000000?logo=html5&logoColor=white) | 2D rendering |
| [seedrandom.js](https://github.com/davidbau/seedrandom) | Deterministic PRNG |

**Zero dependencies** • **No build tools** • **Pure vanilla JavaScript**

---

## 📁 Project Structure

```
solar/
├── indexwithjs.html        # ⭐ Standalone all-in-one file
├── index.html              # Modular entry point
├── dist/
│   └── bundle.js          # Bundled non-module build
├── src/
│   ├── main.js            # Application entry
│   ├── canvas.js          # Canvas setup & resize handling
│   ├── random.js          # Seedable RNG utilities
│   ├── constants.js       # Physical constants (G, TAU, etc.)
│   ├── physics.js         # Orbital mechanics
│   ├── names.js           # Planet/star name generators
│   ├── gen/
│   │   └── system.js      # Solar system generator
│   ├── render/
│   │   ├── camera.js      # Viewport transform
│   │   ├── draw.js        # Drawing primitives
│   │   └── starfield.js   # Background stars
│   ├── input/
│   │   └── controls.js    # Mouse/wheel input handlers
│   ├── ui/
│   │   └── hud.js         # HUD with CRT flicker effect
│   └── utils/
│       └── dateSeed.js    # Date-based seed generation
├── styles.css             # Global styles
└── README.md
```

---

## 🧮 Physics Formulas

### Gravitational Constant
```
G = 6.674 × 10⁻¹¹ m³/(kg·s²)
```

### Orbital Velocity
```
v = √(G × M_star / r)
```

### Hill Sphere Radius (Simplified)
```
r_Hill ≈ a × 0.01 × ∛(m_planet / m_star)
```

### Time Scale Calculation
```
scale = T_outer / target_period
Clamped to [500, 2000]
```

---

## 🌐 Browser Compatibility

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 90+ | ✅ Fully supported |
| Firefox | 88+ | ✅ Fully supported |
| Edge | 90+ | ✅ Fully supported |
| Safari | 14+ | ✅ Fully supported |
| Mobile browsers | Modern | ✅ Tested on iOS/Android |

---

## 🗺️ Roadmap

- [x] **Phase 1**: Framework foundation
- [x] **Phase 2**: System generation
- [x] **Phase 3**: Static rendering
- [x] **Phase 4**: Orbital motion
- [x] **Phase 5**: UI polish & CRT effects
- [ ] **Phase 6**: Rocket flight mechanics
- [ ] **Phase 7**: Trajectory planning
- [ ] **Phase 8**: Multi-system exploration

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by **Android 15 screensaver easter egg**
- [seedrandom.js](https://github.com/davidbau/seedrandom) by David Bau
- Canvas API documentation by [MDN Web Docs](https://developer.mozilla.org/)

---

<div align="center">

**Made with ❤️ and JavaScript**

If you found this project helpful, please consider giving it a ⭐!

</div>
