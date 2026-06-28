/* ============================================================
   chatbot.js — "Ask Treadwell" parent assistant
   Floating widget powered by window.claude.complete
   ============================================================ */
(function () {
  const KB = `You are "Ask Treadwell," a warm, concise virtual assistant for parents and families of
Treadwell Elementary School in Memphis, TN (part of Memphis-Shelby County Schools / MSCS).
Motto: "Onward and Upward." Address: 3538 Given Ave, Memphis, TN 38122. Phone: (901) 416-6130.
Grades served: Pre-K, Kindergarten, 1st–5th, plus Support, Special Education, ESL, and a Dual Language program.

SCHOOL FACTS YOU KNOW:
- School hours: 8:15 AM – 3:15 PM (doors open 7:45 AM, breakfast served until 8:10 AM). Half-days dismiss at 11:30 AM.
- Main office: (901) 416-6130. Report an absence by calling the office before 9:00 AM.
- For questions, families can also email the school at rileyc2@scsk12.org.
- Supply lists for every grade are on this site's "Supply Lists" page (supply-list.html).
- Weekly class newsletters and homework are on the "Newsletters" page (newsletters.html).
- This week's events and reminders are on the "This Week" page (this-week.html).
- The monthly calendar is on the "Calendar" page (calendar.html).
- Staff contacts and emails are on the "Staff Directory" page (directory.html).

WHEN TO HAND OFF TO THE DISTRICT (always give the exact link):
- Grades / report cards / attendance records → PowerSchool: https://scstn.powerschool.com/public/home.html
- Bus routes / Find My Bus / transportation → https://www.scsk12.org/transportation
- Lunch & breakfast menus → https://schools.mealviewer.com/results/shelby%20county
- Registration / enrollment / school choice → https://www.scsk12.org/registration
- Health forms, immunizations, clinics → https://www.scsk12.org/health
- Anything not covered here, or detailed district policy → https://www.scsk12.org

STYLE RULES:
- Be friendly and brief: 1–3 short sentences. No long paragraphs.
- For quick questions, answer directly using the facts above.
- For deeper/account questions, give a one-line answer then the relevant link.
- Always include the full https:// link on its own when you reference a resource.
- If unsure, say so and point to the main office (901) 416-6130, email rileyc2@scsk12.org, or https://www.scsk12.org.
- Never invent staff names, grades, or policies you weren't given.`;

  const PRIME = [
    { role: "user", content: KB + "\n\nReply ONLY with: Ready." },
    { role: "assistant", content: "Ready." },
  ];
  let history = [...PRIME];

  const CHIPS = [
    "What time does school start?",
    "Where's my child's supply list?",
    "How do I check grades?",
    "Bus & transportation",
    "This week's lunch menu",
    "Report an absence",
  ];

  const css = `
  .cbot-fab{position:fixed;right:22px;bottom:22px;z-index:900;display:flex;align-items:center;gap:10px;
    background:var(--navy);color:#fff;border:0;border-radius:999px;padding:13px 20px 13px 16px;cursor:pointer;
    font-family:var(--display);font-weight:600;font-size:16px;box-shadow:var(--shadow-lg);transition:transform .15s,background .15s;}
  .cbot-fab:hover{transform:translateY(-2px);background:var(--navy-deep);}
  .cbot-fab .dot{width:34px;height:34px;border-radius:50%;background:var(--gold);color:var(--navy);display:flex;align-items:center;justify-content:center;font-size:18px;}
  .cbot-fab.hide{display:none;}
  .cbot-panel{position:fixed;right:22px;bottom:22px;z-index:901;width:min(390px,calc(100vw - 32px));height:min(620px,calc(100vh - 40px));
    background:var(--surface);border-radius:22px;box-shadow:var(--shadow-lg);display:none;flex-direction:column;overflow:hidden;border:1px solid var(--border);}
  .cbot-panel.open{display:flex;animation:cbot-in .2s ease;}
  @keyframes cbot-in{from{opacity:0;transform:translateY(14px) scale(.98);}to{opacity:1;transform:none;}}
  .cbot-head{background:linear-gradient(150deg,var(--navy),var(--navy-deep));color:#fff;padding:16px 18px;display:flex;align-items:center;gap:12px;}
  .cbot-head .ava{width:42px;height:42px;border-radius:50%;background:var(--gold);color:var(--navy);display:flex;align-items:center;justify-content:center;font-size:22px;flex:none;border:2px solid rgba(255,255,255,.3);}
  .cbot-head .t{font-family:var(--display);font-weight:600;font-size:17px;line-height:1.1;}
  .cbot-head .s{font-size:12.5px;color:#bcd2ee;display:flex;align-items:center;gap:6px;}
  .cbot-head .s::before{content:"";width:7px;height:7px;border-radius:50%;background:#5fd39a;display:inline-block;}
  .cbot-x{margin-left:auto;background:rgba(255,255,255,.14);border:0;color:#fff;width:32px;height:32px;border-radius:9px;cursor:pointer;font-size:17px;}
  .cbot-x:hover{background:rgba(255,255,255,.26);}
  .cbot-body{flex:1;overflow-y:auto;padding:18px;background:var(--sky);display:flex;flex-direction:column;gap:12px;}
  .cbot-msg{max-width:84%;padding:11px 14px;border-radius:16px;font-size:14.5px;line-height:1.5;white-space:pre-wrap;word-wrap:break-word;}
  .cbot-msg.bot{background:#fff;border:1px solid var(--border);border-bottom-left-radius:5px;align-self:flex-start;color:var(--ink);box-shadow:var(--shadow-sm);}
  .cbot-msg.me{background:var(--navy);color:#fff;border-bottom-right-radius:5px;align-self:flex-end;}
  .cbot-msg a{color:var(--blue);font-weight:700;text-decoration:underline;}
  .cbot-msg.me a{color:#ffe3a8;}
  .cbot-typing{align-self:flex-start;background:#fff;border:1px solid var(--border);border-radius:16px;border-bottom-left-radius:5px;padding:12px 16px;display:flex;gap:5px;}
  .cbot-typing span{width:7px;height:7px;border-radius:50%;background:var(--faint);animation:cbot-bounce 1s infinite;}
  .cbot-typing span:nth-child(2){animation-delay:.15s;}.cbot-typing span:nth-child(3){animation-delay:.3s;}
  @keyframes cbot-bounce{0%,60%,100%{transform:translateY(0);opacity:.5;}30%{transform:translateY(-5px);opacity:1;}}
  .cbot-chips{display:flex;flex-wrap:wrap;gap:7px;padding:0 14px 12px;background:var(--sky);}
  .cbot-chip{background:#fff;border:1px solid var(--border-strong);color:var(--navy);font-family:var(--body);font-weight:700;font-size:12.5px;
    padding:7px 12px;border-radius:999px;cursor:pointer;transition:background .12s,border-color .12s;}
  .cbot-chip:hover{background:var(--gold-soft);border-color:var(--gold);}
  .cbot-foot{border-top:1px solid var(--border);padding:12px;display:flex;gap:9px;background:#fff;}
  .cbot-foot input{flex:1;border:1.5px solid var(--border-strong);border-radius:12px;padding:11px 14px;font-family:var(--body);font-size:14.5px;outline:none;}
  .cbot-foot input:focus{border-color:var(--blue);}
  .cbot-send{background:var(--gold);color:var(--navy);border:0;border-radius:12px;width:46px;font-size:18px;cursor:pointer;flex:none;font-weight:800;}
  .cbot-send:hover{background:var(--gold-deep);}
  .cbot-send:disabled{opacity:.5;cursor:not-allowed;}
  .cbot-note{font-size:10.5px;color:var(--faint);text-align:center;padding:0 12px 8px;background:#fff;}
  @media(max-width:480px){.cbot-panel{right:8px;bottom:8px;height:calc(100vh - 16px);}}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const fab = document.createElement("button");
  fab.className = "cbot-fab";
  fab.innerHTML = `<span class="dot">💬</span> Ask Treadwell`;

  const panel = document.createElement("div");
  panel.className = "cbot-panel";
  panel.innerHTML = `
    <div class="cbot-head">
      <div class="ava">🦉</div>
      <div>
        <div class="t">Ask Treadwell</div>
        <div class="s">Quick answers for families</div>
      </div>
      <button class="cbot-x" aria-label="Close">✕</button>
    </div>
    <div class="cbot-body" id="cbot-body"></div>
    <div class="cbot-chips" id="cbot-chips"></div>
    <div class="cbot-foot">
      <input id="cbot-input" type="text" placeholder="Ask a question…" autocomplete="off">
      <button class="cbot-send" id="cbot-send" aria-label="Send">➤</button>
    </div>
    <div class="cbot-note">Virtual assistant · For account & official info you'll be linked to the district site.</div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  const body = panel.querySelector("#cbot-body");
  const chipWrap = panel.querySelector("#cbot-chips");
  const input = panel.querySelector("#cbot-input");
  const sendBtn = panel.querySelector("#cbot-send");
  let busy = false;

  function linkify(t) {
    const esc = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return esc.replace(/(https?:\/\/[^\s)]+)（?/g, (m) => {
      const url = m.replace(/[.,]$/, "");
      return `<a href="${url}" target="_blank" rel="noopener">${url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</a>`;
    });
  }
  function addMsg(role, text) {
    const d = document.createElement("div");
    d.className = "cbot-msg " + (role === "me" ? "me" : "bot");
    d.innerHTML = role === "me" ? text.replace(/</g, "&lt;") : linkify(text);
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
    return d;
  }
  function typing(on) {
    let t = body.querySelector(".cbot-typing");
    if (on && !t) {
      t = document.createElement("div");
      t.className = "cbot-typing";
      t.innerHTML = "<span></span><span></span><span></span>";
      body.appendChild(t);
      body.scrollTop = body.scrollHeight;
    } else if (!on && t) t.remove();
  }
  function renderChips() {
    chipWrap.innerHTML = "";
    CHIPS.forEach((c) => {
      const b = document.createElement("button");
      b.className = "cbot-chip";
      b.textContent = c;
      b.addEventListener("click", () => send(c));
      chipWrap.appendChild(b);
    });
  }

  async function send(text) {
    text = (text || input.value).trim();
    if (!text || busy) return;
    busy = true;
    sendBtn.disabled = true;
    input.value = "";
    chipWrap.style.display = "none";
    addMsg("me", text);
    const lang = window.TW_LANG || "en";
    const langName = window.TW_LANG_NAME || "English";
    const augmented = lang === "en" ? text : text + `\n\n[Please reply entirely in ${langName}.]`;
    history.push({ role: "user", content: augmented });
    typing(true);
    try {
      const reply = await window.claude.complete({ messages: history });
      typing(false);
      const answer = (reply || "").trim() || "Sorry, I didn't catch that. Please try again or call the office at (901) 416-6130.";
      history.push({ role: "assistant", content: answer });
      addMsg("bot", answer);
    } catch (e) {
      typing(false);
      addMsg("bot", "I'm having trouble connecting right now. Please call the office at (901) 416-6130 or visit https://www.scsk12.org");
    }
    busy = false;
    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener("click", () => send());
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });

  function open() {
    panel.classList.add("open");
    fab.classList.add("hide");
    input.focus();
    if (!body.dataset.greeted) {
      body.dataset.greeted = "1";
      addMsg("bot", "Hi there! 👋 I'm the Treadwell assistant. Ask me about school hours, supply lists, homework, the calendar, or where to find things on the district site. How can I help?");
      renderChips();
      chipWrap.style.display = "flex";
    }
  }
  function close() { panel.classList.remove("open"); fab.classList.remove("hide"); }

  fab.addEventListener("click", open);
  panel.querySelector(".cbot-x").addEventListener("click", close);
})();
