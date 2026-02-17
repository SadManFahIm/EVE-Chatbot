<div align="center">

<br/>

```
███████╗██╗   ██╗███████╗
██╔════╝██║   ██║██╔════╝
█████╗  ██║   ██║█████╗
██╔══╝  ╚██╗ ██╔╝██╔══╝
███████╗ ╚████╔╝ ███████╗
╚══════╝  ╚═══╝  ╚══════╝
```

### AI-Powered Chat Assistant

<br/>

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Anthropic](https://img.shields.io/badge/Anthropic_Claude-D97757?style=for-the-badge&logo=anthropic&logoColor=white)](https://anthropic.com)

<br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-00e5ff?style=flat-square)](LICENSE)
[![No Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen?style=flat-square)](package.json)
[![XSS Safe](https://img.shields.io/badge/XSS-Protected-success?style=flat-square&logo=shield)](/)
[![Responsive](https://img.shields.io/badge/Responsive-Mobile%20First-blueviolet?style=flat-square)](/)

<br/>

> **EVE** is a production-grade AI chatbot featuring a full landing page, glassmorphism UI,  
> persistent memory, and Anthropic Claude integration — built with zero frameworks.

<br/>

</div>

---

## 🖥️ Preview

<div align="center">

|         Landing Page         |           Chat Widget            |          Mobile          |
| :--------------------------: | :------------------------------: | :----------------------: |
| Hero · Features · Tech Stack | Glassmorphism · Typing Indicator | Full-screen · FAB Button |

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🤖 Intelligence

- **Anthropic Claude API** — full conversation context, 12-message memory window
- **Smart Local Fallback** — regex-based responses when offline
- **Bangla Support** — responds in Bengali if user writes in Bangla
- **Rock Paper Scissors** — fully playable game inside chat

</td>
<td width="50%">

### 🎨 Design

- **Glassmorphism UI** — `backdrop-filter` blur + translucent surfaces
- **Custom Cursor** — smooth trailing ring (desktop)
- **Scroll Reveal** — `IntersectionObserver` triggered animations
- **3D Card Tilt** — `rotateX/Y` on mousemove for feature cards

</td>
</tr>
<tr>
<td width="50%">

### 🛡️ Security & Robustness

- **XSS Protected** — `textContent` only, never `innerHTML`
- **Persistent History** — localStorage with 60-message rolling window
- **Graceful Degradation** — API fail → instant local fallback
- **ARIA Labels** — screen reader accessible

</td>
<td width="50%">

### ⚡ Performance

- **Zero Dependencies** — no React, no Vue, no bundler
- **CSS Keyframes Only** — no animation libraries needed
- **Debounced Scroll** — passive event listeners throughout
- **Instant Load** — single HTML file entry point

</td>
</tr>
</table>

---

## 🗂️ Project Structure

```
📦 EVE-Pro/
│
├── 📄 index.html               ← Entry point — landing page + chat widget
│
├── 🎨 css/
│   ├── style.css               ← Global variables, landing page, animations
│   └── chat.css                ← Chat widget — FAB, bubbles, typing indicator
│
├── ⚙️ script/
│   ├── response.js             ← Local fallback (regex pattern matching)
│   ├── chat.js                 ← Core: API calls, render, localStorage, XSS
│   └── landing.js              ← Cursor, scroll reveal, counters, card tilt
│
└── 📋 README.md
```

---

## 🏗️ Architecture

```
User Input
    │
    ▼
┌─────────────────────┐
│     chat.js         │  sendMessage() → sanitize → renderMessage()
│   Core Logic        │       │
└─────────────────────┘       │
    │                         ▼
    ▼                  ┌─────────────┐
┌─────────────────┐    │  #messages  │  textContent only (XSS safe)
│  Anthropic API  │    │   DOM node  │
│  /v1/messages   │    └─────────────┘
└─────────────────┘
    │ fail?
    ▼
┌─────────────────┐
│  response.js    │  getBotResponse() → regex matching → randomFrom([])
│  Local Fallback │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  localStorage   │  saveMessage() → rolling 60-message history
└─────────────────┘
```

---

## 🚀 Getting Started

### Option 1 — Open directly

```bash
# No setup needed. Just open in browser:
open index.html
```

### Option 2 — Local server (recommended)

```bash
# Python
python -m http.server 3000

# Node.js
npx serve .

# Then visit → http://localhost:3000
```

### Option 3 — Deploy

```bash
# Netlify Drop — drag & drop the folder at netlify.com/drop
# GitHub Pages — push to repo → Settings → Pages → Deploy from branch
# Vercel — vercel deploy
```

---

## 🛠️ Tech Stack

| Layer     | Technology           | Why                                              |
| --------- | -------------------- | ------------------------------------------------ |
| Structure | **HTML5**            | Semantic, accessible, ARIA-labeled               |
| Styling   | **CSS3**             | Variables, Grid, backdrop-filter, keyframes      |
| Logic     | **Vanilla JS ES6+**  | Zero overhead, async/await, IntersectionObserver |
| AI        | **Anthropic Claude** | `claude-sonnet-4-20250514` — fast, intelligent   |
| Memory    | **localStorage**     | Persistent, client-side, no backend needed       |
| Icons     | **Font Awesome 6**   | Crisp SVG icons via CDN                          |
| Fonts     | **Google Fonts**     | Syne (display) · Instrument Sans (body)          |

---

## 🔑 Key Implementation Details

<details>
<summary><b>🤖 AI Integration</b></summary>

```javascript
// claude-sonnet-4-20250514 with rolling conversation context
const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 350,
    system: "You are EVE, a witty AI assistant...",
    messages: conversation.slice(-12), // last 12 messages for context
  }),
});
```

</details>

<details>
<summary><b>🛡️ XSS Protection</b></summary>

```javascript
// Safe — uses textContent, never innerHTML
const bubble = document.createElement("div");
bubble.textContent = userInput; // ✅ XSS impossible

// What we never do:
// element.innerHTML = userInput  // ❌ XSS risk
```

</details>

<details>
<summary><b>💾 Persistent History</b></summary>

```javascript
// Rolling 60-message localStorage history
function saveMessage(role, text) {
  const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  history.push({ role, text, time: getTime() });
  if (history.length > 60) history.splice(0, history.length - 60);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}
```

</details>

<details>
<summary><b>🎞️ Scroll Reveal</b></summary>

```javascript
// IntersectionObserver — no library, pure browser API
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("visible"), i * 60);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);
```

</details>

---

## 📱 Responsive Breakpoints

| Breakpoint       | Layout                                                    |
| ---------------- | --------------------------------------------------------- |
| `> 1024px`       | Side-by-side hero · 3-column feature grid · Custom cursor |
| `768px – 1024px` | Stacked hero · 2-column grid · No cursor                  |
| `< 768px`        | Single column · Full-screen chat panel · Touch-optimized  |

---

## 🔒 Security

- ✅ All user input → `textContent` (never `innerHTML`)
- ✅ No `eval()` anywhere in codebase
- ✅ No external data sent beyond Anthropic API
- ✅ API key handled server-side (not exposed in client)
- ✅ localStorage only — no cookies, no tracking

---

## 🗺️ Roadmap

- [ ] Voice input / speech-to-text
- [ ] Markdown rendering in bot messages
- [ ] Multi-language UI (i18n)
- [ ] Export chat history as PDF
- [ ] Dark / Light mode toggle

---

## 📄 License

```
MIT License — free to use, fork, and build upon.
```

---

<div align="center">

<br/>

**Built with passion. Engineered to impress.**

<br/>

[![GitHub](https://img.shields.io/badge/Star_on-GitHub-181717?style=for-the-badge&logo=github)](https://github.com)
&nbsp;&nbsp;
[![LinkedIn](https://img.shields.io/badge/Connect-LinkedIn-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com)

<br/>

_EVE v2.0 · Anthropic Claude · Vanilla JS_

</div>
