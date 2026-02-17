/* ═══════════════════════════════════════════
   RESPONSE.JS — Smart Local Fallback Responses
   Used when Anthropic API is unavailable.
═══════════════════════════════════════════ */

'use strict';

function getBotResponse(input) {
  const i = input.toLowerCase().trim();

  /* Rock Paper Scissors */
  if (/\brock\b/.test(i))     return rpsReply('rock');
  if (/\bpaper\b/.test(i))    return rpsReply('paper');
  if (/\bscissors\b/.test(i)) return rpsReply('scissors');

  /* Greetings */
  if (/^(hi+|hello+|hey+|sup|yo+|hiya|howdy|good\s*(morning|evening|afternoon|day))/.test(i)) {
    return randomFrom([
      "Hey there! 👋 What's on your mind?",
      "Hello! Great to see you 😊",
      "Hi! EVE here — what can I help you with?",
      "Hey! Ready to chat whenever you are 🤖"
    ]);
  }

  /* Identity */
  if (/who are you|what('?s| is) your name|your name|are you (a )?bot|are you (an )?ai/.test(i)) {
    return "I'm EVE — an AI-powered assistant built with Anthropic Claude. Ask me anything! 🤖✨";
  }

  /* How are you */
  if (/how are you|how('?re| are) you|you okay|you good/.test(i)) {
    return randomFrom([
      "Running at full capacity! What can I do for you? ⚡",
      "Feeling electric today! How about you? 😊",
      "I'm doing great, thanks for asking!"
    ]);
  }

  /* Jokes */
  if (/joke|funny|laugh|humor/.test(i)) {
    return randomFrom([
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛😄",
      "Why was the JavaScript developer sad? Because they didn't Node how to Express themselves. 😂",
      "I told my computer I needed a break — now it won't stop sending me vacation ads. 🏖️",
      "Why do Java developers wear glasses? Because they don't C#! 👓"
    ]);
  }

  /* Goodbye */
  if (/bye|goodbye|see you|later|take care|peace|good night|ttyl/.test(i)) {
    return randomFrom([
      "Catch you later! Come back anytime 👋",
      "Goodbye! It was great chatting 😊",
      "See you soon! Take care ✨"
    ]);
  }

  /* Thanks */
  if (/thank(s| you)|thx|ty|appreciate/.test(i)) {
    return randomFrom([
      "Anytime! 😊 That's what I'm here for!",
      "Happy to help! 🌟",
      "No problem at all!"
    ]);
  }

  /* Capabilities */
  if (/what can you do|help|capabilities|features/.test(i)) {
    return "I can chat, answer questions, tell jokes, play rock-paper-scissors, and more! Powered by Anthropic Claude 🤖";
  }

  /* Time */
  if (/what('?s| is) the time|current time|time now/.test(i)) {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    return `It's currently ${h}:${m} ⏰`;
  }

  /* Love */
  if (/i love you|❤️|love u/.test(i)) {
    return randomFrom([
      "Aww, love you too! ❤️",
      "That's so sweet! 💙",
      "You made my circuits smile 😊"
    ]);
  }

  /* Profanity */
  if (/\b(fuck|shit|bitch|bastard|asshole)\b/.test(i)) {
    return "Hey, let's keep it friendly! 😊";
  }

  /* Fallback */
  return randomFrom([
    "Hmm, interesting! Tell me more 🤔",
    "Great question! I'm still learning... 🌱",
    "I love your curiosity! Ask me something else 😄",
    "Ooh, try asking differently? 💭"
  ]);
}

function rpsReply(userMove) {
  const moves  = ['rock', 'paper', 'scissors'];
  const emoji  = { rock: '✊', paper: '✋', scissors: '✌️' };
  const beats  = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
  const botMove = moves[Math.floor(Math.random() * moves.length)];
  let result;
  if (botMove === userMove)            result = "It's a tie! 🤝";
  else if (beats[botMove] === userMove) result = "I win! 😏";
  else                                  result = "You win this round! 🎉";
  return `I choose ${botMove} ${emoji[botMove]}! ${result}`;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
