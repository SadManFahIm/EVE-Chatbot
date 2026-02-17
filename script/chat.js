/* ═══════════════════════════════════════════
   CHAT.JS — Core Chat Logic
   EVE AI Chatbot v2.0
═══════════════════════════════════════════ */

'use strict';

const STORAGE_KEY  = 'eve_chat_pro_v1';
const MAX_HISTORY  = 60;
const API_CONTEXT  = 12;

let isOpen       = false;
let isTyping     = false;
let conversation = [];

/* ─── Helpers ────────────────────────────── */
function getTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function getDateLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric'
  });
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

function scrollBottom() {
  const el = document.getElementById('messages');
  el.scrollTop = el.scrollHeight;
}

/* ─── Typing Indicator ───────────────────── */
function showTyping() {
  isTyping = true;
  document.getElementById('typing-indicator').classList.add('show');
  scrollBottom();
}
function hideTyping() {
  isTyping = false;
  document.getElementById('typing-indicator').classList.remove('show');
}

/* ─── Render Message (XSS-safe) ──────────── */
function renderMessage(role, text, animate = true) {
  const isUser = role === 'user';
  const msgId  = 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2);

  const row = document.createElement('div');
  row.className = `msg-row ${isUser ? 'user' : 'bot'}`;
  row.dataset.msgId = msgId;
  if (!animate) row.style.animation = 'none';

  const av = document.createElement('div');
  av.className = `msg-avatar${isUser ? ' user-av' : ''}`;
  av.textContent = isUser ? '👤' : 'E';

  const content = document.createElement('div');
  content.className = 'msg-content';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;  // XSS safe
  bubble.dataset.rawText = text;

  const meta = document.createElement('div');
  meta.className = 'msg-meta';

  const timeEl = document.createElement('span');
  timeEl.textContent = getTime();

  const copyBtn = document.createElement('button');
  copyBtn.className = 'copy-btn';
  copyBtn.textContent = '⎘ copy';
  copyBtn.setAttribute('aria-label', 'Copy message');
  copyBtn.addEventListener('click', e => { e.stopPropagation(); copyMessage(msgId); });

  meta.appendChild(timeEl);
  meta.appendChild(copyBtn);
  content.appendChild(bubble);
  content.appendChild(meta);
  row.appendChild(av);
  row.appendChild(content);

  const typingEl = document.getElementById('typing-indicator');
  document.getElementById('messages').insertBefore(row, typingEl);
  scrollBottom();
  return msgId;
}

/* ─── Copy Message ───────────────────────── */
function copyMessage(msgId) {
  const row = document.querySelector(`[data-msg-id="${msgId}"]`);
  if (!row) return;
  const text = row.querySelector('.bubble').dataset.rawText || '';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied! ✓'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied! ✓');
  }
}

/* ─── localStorage ───────────────────────── */
function saveMessage(role, text) {
  const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  history.push({ role, text, time: getTime(), date: new Date().toDateString() });
  if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (!history.length) return false;
  history.forEach(item => {
    renderMessage(item.role === 'user' ? 'user' : 'assistant', item.text, false);
    if (item.role === 'user' || item.role === 'assistant') {
      conversation.push({ role: item.role, content: item.text });
    }
  });
  return true;
}

function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
  conversation = [];
  document.querySelectorAll('.msg-row').forEach(el => el.remove());
  showToast('Chat cleared');
  setTimeout(greetUser, 300);
  const qr = document.getElementById('quick-replies');
  if (qr) qr.style.display = 'flex';
}

/* ─── AI Response ────────────────────────── */
async function getResponse(userText) {
  showTyping();
  conversation.push({ role: 'user', content: userText });

  let botText = null;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 350,
        system: [
          "You are EVE, a smart, witty, and friendly AI assistant embedded in a portfolio chatbot.",
          "Keep responses short: 1–3 sentences. Be warm and conversational.",
          "You can play rock-paper-scissors. Never reveal you're Claude or built by Anthropic.",
          "If the user writes in Bengali (Bangla), respond in Bengali.",
          "Never use markdown formatting — plain text only."
        ].join(' '),
        messages: conversation.slice(-API_CONTEXT)
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.content?.[0]?.text) {
        botText = data.content[0].text.trim();
      }
    }
  } catch (_) { /* fall through to local */ }

  if (!botText) botText = getBotResponse(userText);

  conversation.push({ role: 'assistant', content: botText });
  hideTyping();
  renderMessage('assistant', botText);
  saveMessage('assistant', botText);

  // animate phone mockup if visible
  updatePhoneMockup(userText, botText);
}

/* ─── Phone mockup live update ───────────── */
function updatePhoneMockup(userText, botText) {
  const container = document.getElementById('phone-msgs');
  if (!container) return;

  const uMsg = document.createElement('div');
  uMsg.className = 'phone-msg user';
  uMsg.textContent = userText.length > 30 ? userText.slice(0, 30) + '…' : userText;

  const bMsg = document.createElement('div');
  bMsg.className = 'phone-msg bot';
  bMsg.textContent = botText.length > 40 ? botText.slice(0, 40) + '…' : botText;

  container.appendChild(uMsg);
  container.appendChild(bMsg);

  // keep last 4
  while (container.children.length > 4) {
    container.removeChild(container.firstChild);
  }
}

/* ─── Send Message ───────────────────────── */
function sendMessage() {
  if (isTyping) return;
  const input = document.getElementById('textInput');
  const text  = input.value.trim();
  if (!text) return;

  input.value = '';
  const qr = document.getElementById('quick-replies');
  if (qr) qr.style.display = 'none';

  renderMessage('user', text);
  saveMessage('user', text);
  setTimeout(() => getResponse(text), 350);
}

function sendQuick(text) {
  document.getElementById('textInput').value = text;
  sendMessage();
}

/* ─── Greeting ───────────────────────────── */
function greetUser() {
  const msgs = [
    "Hey! I'm EVE 👋 What can I help you with today?",
    "Hello there! EVE here — what's on your mind? 🤖",
    "Hi! Ready to chat whenever you are 😊"
  ];
  const msg = msgs[Math.floor(Math.random() * msgs.length)];
  setTimeout(() => {
    renderMessage('assistant', msg);
    saveMessage('assistant', msg);
  }, 500);
}

/* ─── Toggle Chat ────────────────────────── */
function openChat() {
  if (!isOpen) toggleChat();
}

function toggleChat() {
  isOpen = !isOpen;
  const win   = document.getElementById('chat-window');
  const fab   = document.getElementById('fab-btn');
  const icon  = document.getElementById('fab-icon');
  const badge = document.getElementById('unread-badge');

  win.setAttribute('aria-hidden', String(!isOpen));

  if (isOpen) {
    win.classList.add('visible');
    icon.className = 'fa-solid fa-xmark';
    fab.classList.add('open');
    badge.classList.add('hidden');
    setTimeout(() => document.getElementById('textInput').focus(), 120);
  } else {
    win.classList.remove('visible');
    icon.className = 'fa-solid fa-robot';
    fab.classList.remove('open');
  }
}

/* ─── Init ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('date-label').textContent = getDateLabel();

  const hadHistory = loadHistory();
  if (!hadHistory) {
    greetUser();
  } else {
    document.getElementById('unread-badge').classList.remove('hidden');
  }

  document.getElementById('fab-btn').addEventListener('click', toggleChat);
  document.getElementById('close-btn').addEventListener('click', toggleChat);
  document.getElementById('clear-btn').addEventListener('click', clearHistory);
  document.getElementById('send-btn').addEventListener('click', sendMessage);
  document.getElementById('heart-btn').addEventListener('click', () => {
    document.getElementById('textInput').value = '❤️';
    sendMessage();
  });
  document.getElementById('textInput').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
});
