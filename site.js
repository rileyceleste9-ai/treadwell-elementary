/* ============================================================
   site.js — shared chrome (top bar, nav, footer) for every page
   Set <body data-page="home"> etc. to highlight the active link.
   ============================================================ */
(function () {
  const NAV = [
    { id: "home", label: "Home", href: "index.html" },
    { id: "about", label: "About", href: "about.html" },
    { id: "this-week", label: "This Week", href: "this-week.html" },
    { id: "calendar", label: "Calendar", href: "calendar.html" },
    { id: "newsletters", label: "Newsletters", href: "newsletters.html" },
    { id: "directory", label: "Staff Directory", href: "directory.html" },
    { id: "parents", label: "Parents & Students", href: "parents-students.html" },
  ];
  const active = document.body.dataset.page || "";

  const navLinks = NAV.map(
    (n) =>
      `<a href="${n.href}" class="${n.id === active ? "active" : ""}">${n.label}</a>`
  ).join("");

  const header = `
  <div class="topbar">
    <div class="wrap">
      <div class="tb-left">
        <a href="tel:9014166130">📞 (901) 416-6130</a>
        <a class="hide-sm" href="https://maps.google.com/?q=3538+Given+Ave+Memphis+TN+38122" target="_blank" rel="noopener">📍 3538 Given Ave, Memphis, TN</a>
      </div>
      <div class="tb-right">
        <a class="ext" href="https://scstn.powerschool.com/public/home.html" target="_blank" rel="noopener">PowerSchool</a>
        <a class="ext" href="https://www.scsk12.org" target="_blank" rel="noopener">District Site</a>
      </div>
    </div>
  </div>
  <header class="site-header">
    <div class="wrap">
      <a class="brand" href="index.html" aria-label="Treadwell Elementary home">
        <img class="brand-logo" src="logo.png" alt="Treadwell Elementary eagle logo">
        <span class="brand-text">
          <span class="name">Treadwell Elementary</span>
          <span class="tag">Onward and Upward</span>
        </span>
      </a>
      <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">☰</button>
      <nav class="mainnav" id="mainnav">
        ${navLinks}
        <a class="nav-cta" href="this-week.html">📅 This Week</a>
      </nav>
    </div>
  </header>`;

  const footer = `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand">
          <img class="footer-logo" src="logo.png" alt="Treadwell Elementary eagle logo">
          <div class="name">Treadwell Elementary School</div>
          <p>3538 Given Avenue<br>Memphis, TN 38122<br>
          Phone: <a style="display:inline" href="tel:9014166130">(901) 416-6130</a><br>
          Questions? <a style="display:inline" href="mailto:rileyc2@scsk12.org">rileyc2@scsk12.org</a><br>
          A proud school of Memphis-Shelby County Schools.</p>
          <div class="pill-row" style="margin-top:14px">
            <a href="https://www.facebook.com/treadwellelem/" target="_blank" rel="noopener" style="padding:0">Facebook</a>
            <span style="color:#5c79a3">·</span>
            <a href="https://www.instagram.com/treadwellelementary/" target="_blank" rel="noopener" style="padding:0">Instagram</a>
          </div>
        </div>
        <div>
          <h4>For Families</h4>
          <a href="parents-students.html">Parents &amp; Students</a>
          <a href="dual-language.html">Dual Language</a>
          <a href="services.html">Student Services</a>
          <a href="title-i.html">Title I Content</a>
          <a href="supply-list.html">Supply Lists</a>
          <a href="directory.html">Staff Directory</a>
        </div>
        <div>
          <h4>Quick Links</h4>
          <a href="https://scstn.powerschool.com/public/home.html" target="_blank" rel="noopener">PowerSchool ↗</a>
          <a href="https://www.scsk12.org/transportation" target="_blank" rel="noopener">Transportation ↗</a>
          <a href="https://schools.mealviewer.com/results/shelby%20county" target="_blank" rel="noopener">Lunch Menus ↗</a>
          <a href="https://www.scsk12.org/registration" target="_blank" rel="noopener">Registration ↗</a>
          <a href="https://www.scsk12.org/calendar" target="_blank" rel="noopener">District Calendar ↗</a>
        </div>
        <div>
          <h4>District</h4>
          <a href="about.html">About Treadwell</a>
          <a href="https://www.scsk12.org" target="_blank" rel="noopener">MSCS Home ↗</a>
          <a href="https://www.scsk12.org/students-parents" target="_blank" rel="noopener">Students &amp; Parents ↗</a>
          <a href="https://www.scsk12.org/health" target="_blank" rel="noopener">Health Services ↗</a>
          <a href="https://www.scsk12.org/welcome" target="_blank" rel="noopener">Contact / Welcome ↗</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} Treadwell Elementary School · Memphis-Shelby County Schools</span>
        <span>Greatness Grows Here. 🌟</span>
      </div>
    </div>
  </footer>`;

  // Inject header at top of body, footer before chatbot/scripts
  document.body.insertAdjacentHTML("afterbegin", header);
  const footMount = document.getElementById("site-footer-mount");
  if (footMount) footMount.outerHTML = footer;
  else document.body.insertAdjacentHTML("beforeend", footer);

  // Mobile toggle
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("mainnav");
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.textContent = open ? "✕" : "☰";
  });
})();
