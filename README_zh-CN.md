<div align="center">

# 🌌 太阳系模拟器

**基于真实物理的程序化生成太阳系模拟器**

*灵感来源于 Android 15 屏保彩蛋*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Canvas API](https://img.shields.io/badge/Canvas_API-2D-blue)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-F7DF1E?logo=javascript&logoColor=black)](https://www.javascript.com/)

[**在线演示**](https://xiphoray.cn/zbored/) • [报告问题](https://github.com/Xiphoray/randomsolarsystem/issues) • [功能建议](https://github.com/Xiphoray/randomsolarsystem/issues)

</div>

---

## ✨ 特性

### 🪐 程序化生成
- **确定性随机**: 使用每日日期(yyyyMMdd)作为种子,确保结果一致
- **基于物理**: 遵循牛顿力学和万有引力定律
- **动态参数**:
  - ⭐ 恒星半径: 30,000 ~ 70,000 公里
  - 🌟 恒星质量: 1×10²⁸ ~ 5×10²⁹ 千克
  - 🌍 行星数量: 每个系统 1 ~ 10 颗
  - 🔴 行星半径: 1,000 ~ 20,000 公里
  - 📏 轨道间距: 1.1x ~ 2.0x 增长因子
  - 🎯 希尔球碰撞检测

### 🎨 视觉效果
- **星空背景**: 200~500 颗随机分布的恒星
- **动画太阳**: 金色核心配双层旋转波浪环
- **彩色行星**: HSL 色彩空间随机色调
- **希尔球**: 半透明红色圆圈显示引力影响范围
- **轨道路径**: 青色虚线圆圈
- **CRT 闪烁效果**: 复古终端风格 HUD,2 秒启动动画

### 🎮 交互控制
- **鼠标滚轮**: 平滑缩放
- **左键拖拽**: 平移视图
- **重置按钮**: 平滑过渡返回初始视角(0.1 插值)
- **复古 HUD**: 绿色终端风格显示系统参数

### ⚡ 性能
- **目标帧率**: 30 FPS
- **时间加速**: 500x ~ 2000x(最外层行星 2-5 分钟完成一圈)
- **响应式设计**: 自适应桌面和移动端屏幕
- **高清支持**: 利用 `devicePixelRatio` 支持视网膜屏幕

---

## 🚀 快速开始

### 方案 1: 独立 HTML 文件(推荐)

直接在现代浏览器中打开 `indexwithjs.html` - 无需服务器!

```bash
# 下载并打开
curl -O https://raw.githubusercontent.com/Xiphoray/randomsolarsystem/main/indexwithjs.html
open indexwithjs.html  # macOS
start indexwithjs.html  # Windows
xdg-open indexwithjs.html  # Linux
```

### 方案 2: 本地开发服务器

```bash
# 使用 npx(需要 Node.js)
npx http-server -p 5173

# 或使用 Python 3
python -m http.server 5173

# 然后访问
http://localhost:5173
```

### 方案 3: 直接文件访问

双击 `index.html` - 内置 CORS 兼容性!

### 🎲 自定义种子

通过添加日期种子生成特定的太阳系:

```
index.html?seed=20250116
indexwithjs.html?seed=20250327
```

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white) | 标记结构 |
| ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white) | 样式和布局 |
| ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black) | 核心逻辑(ES6+) |
| ![Canvas](https://img.shields.io/badge/-Canvas_API-000000?logo=html5&logoColor=white) | 2D 渲染 |
| [seedrandom.js](https://github.com/davidbau/seedrandom) | 确定性伪随机数生成器 |

**零依赖** • **无需构建工具** • **纯原生 JavaScript**

---

## 📁 项目结构

```
solar/
├── indexwithjs.html        # ⭐ 独立的一体化文件
├── index.html              # 模块化入口
├── dist/
│   └── bundle.js          # 打包的非模块构建
├── src/
│   ├── main.js            # 应用入口
│   ├── canvas.js          # Canvas 设置和尺寸处理
│   ├── random.js          # 可设种子的随机数工具
│   ├── constants.js       # 物理常数(G, TAU 等)
│   ├── physics.js         # 轨道力学
│   ├── names.js           # 行星/恒星名称生成器
│   ├── gen/
│   │   └── system.js      # 太阳系生成器
│   ├── render/
│   │   ├── camera.js      # 视口变换
│   │   ├── draw.js        # 绘图原语
│   │   └── starfield.js   # 背景星空
│   ├── input/
│   │   └── controls.js    # 鼠标/滚轮输入处理
│   ├── ui/
│   │   └── hud.js         # 带 CRT 闪烁效果的 HUD
│   └── utils/
│       └── dateSeed.js    # 基于日期的种子生成
├── styles.css             # 全局样式
└── README.md
```

---

## 🧮 物理公式

### 引力常数
```
G = 6.674 × 10⁻¹¹ m³/(kg·s²)
```

### 轨道速度
```
v = √(G × M_恒星 / r)
```

### 希尔球半径(简化)
```
r_希尔 ≈ a × 0.01 × ∛(m_行星 / m_恒星)
```

### 时间尺度计算
```
scale = T_最外层 / 目标周期
限制在 [500, 2000] 范围内
```

---

## 🌐 浏览器兼容性

| 浏览器 | 最低版本 | 状态 |
|--------|----------|------|
| Chrome | 90+ | ✅ 完全支持 |
| Firefox | 88+ | ✅ 完全支持 |
| Edge | 90+ | ✅ 完全支持 |
| Safari | 14+ | ✅ 完全支持 |
| 移动端浏览器 | 现代版本 | ✅ 已在 iOS/Android 测试 |

---

## 🗺️ 路线图

- [x] **阶段 1**: 框架基础
- [x] **阶段 2**: 系统生成
- [x] **阶段 3**: 静态渲染
- [x] **阶段 4**: 轨道运动
- [x] **阶段 5**: UI 优化和 CRT 效果

---

## 🤝 贡献

欢迎贡献!请随时提交 Pull Request。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

---

## 📄 许可证

本项目采用 **MIT 许可证** - 详见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

- 灵感来源于 **Android 15 屏保彩蛋**
- [seedrandom.js](https://github.com/davidbau/seedrandom) 由 David Bau 开发
- Canvas API 文档来自 [MDN Web Docs](https://developer.mozilla.org/)

---

<div align="center">

**用 ❤️ 和 JavaScript 制作**

如果这个项目对你有帮助,请考虑给它一个 ⭐!

</div>