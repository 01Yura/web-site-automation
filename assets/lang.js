(function () {
  const LANG_KEY = "preferredLanguage";

  function detectLangFromPath() {
    const p = location.pathname;
    if (p.includes("/en/")) return "en";
    if (p.includes("/ru/")) return "ru";
    return null;
  }

  function getLang() {
    return localStorage.getItem(LANG_KEY) || detectLangFromPath() || "ru";
  }

  function setLang(lang) {
    if (lang !== "ru" && lang !== "en") return;
    localStorage.setItem(LANG_KEY, lang);
    document.dispatchEvent(new CustomEvent("lang:change", { detail: lang }));
  }

  function updateHomeLinks(lang) {
    const loc = document.getElementById("link-locators");
    const deps = document.getElementById("link-deps");
    const sel = document.getElementById("link-selenoid");
    const cookbook = document.getElementById("link-cookbook");
    const title = document.getElementById("home-title");
    const desc = document.getElementById("home-desc");
    const homeLabel = document.getElementById("home-switcher-label");
    const attribution = document.getElementById("attribution-text");
    if (loc) loc.href = lang === "en" ? "en/locators.html" : "ru/locators.html";
    if (deps)
      deps.href =
        lang === "en" ? "en/dependencies.html" : "ru/dependencies.html";
    if (cookbook)
      cookbook.href = lang === "en" ? "en/cookbook.html" : "ru/cookbook.html";
    // Go straight to the Selenoid landing for the selected language
    if (sel) sel.href = lang === "en" ? "en/selenoid.html" : "ru/selenoid.html";
    if (title)
      title.textContent =
        lang === "en" ? "Test Automation Materials" : "Материалы по автотестам";
    if (desc)
      desc.textContent =
        lang === "en" ? "Choose a section:" : "Выберите раздел:";
    if (homeLabel) homeLabel.textContent = lang === "en" ? "Home" : "Дом";
    if (attribution) {
      if (lang === "en") {
        attribution.innerHTML =
          'Materials prepared for training employees on test automation project. Author: Yura Primyshev (<a href="https://www.linkedin.com/in/yura-primyshev" target="_blank" rel="noopener">www.linkedin.com/in/yura-primyshev</a>). May 2022';
      } else {
        attribution.innerHTML =
          'Материалы подготовлены для целей обучения сотрудников на проекте автоматизации тестирования. Автор: Yura Primyshev (<a href="https://www.linkedin.com/in/yura-primyshev" target="_blank" rel="noopener">www.linkedin.com/in/yura-primyshev</a>). Май 2022';
      }
    }
  }

  function initLanguageSwitcher() {
    const switcher = document.querySelectorAll(
      ".language-switcher a.lang-link"
    );
    switcher.forEach((a) => {
      a.addEventListener("click", function (e) {
        const href = a.getAttribute("href") || "";
        const lang =
          href.includes("/en/") ||
          href.endsWith("en/selenoid.html") ||
          a.textContent.trim() === "EN"
            ? "en"
            : "ru";
        setLang(lang);
        if (
          location.pathname.endsWith("/index.html") ||
          location.pathname === "/"
        ) {
          e.preventDefault();
        }
      });
    });
  }

  function initHomeSwitcher() {
    const ruTop = document.getElementById("switch-ru");
    const enTop = document.getElementById("switch-en");
    if (ruTop)
      ruTop.addEventListener("click", function () {
        setLang("ru");
      });
    if (enTop)
      enTop.addEventListener("click", function () {
        setLang("en");
      });
  }

  function applyInitial() {
    const lang = getLang();
    updateHomeLinks(lang);
    // Localize buttons on homepage
    const locBtn = document.getElementById("link-locators");
    const depBtn = document.getElementById("link-deps");
    const cookbookBtn = document.getElementById("link-cookbook");
    if (locBtn)
      locBtn.textContent =
        lang === "en" ? "Locators (XPath & CSS)" : "Локаторы (XPath & CSS)";
    if (depBtn)
      depBtn.textContent =
        lang === "en" ? "Dependencies (Java)" : "Зависимости (Java)";
    if (cookbookBtn)
      cookbookBtn.textContent = lang === "en" ? "Cookbook" : "Книга рецептов";
    // Miro link title is language-neutral
    const miroBtn = document.getElementById("link-miro");
    if (miroBtn) miroBtn.textContent = "Java Collection Framework";
    // toggle selenoid single-box language if present
    const blockRu = document.getElementById("sel-ru");
    const blockEn = document.getElementById("sel-en");
    if (blockRu && blockEn) {
      blockRu.style.display = lang === "ru" ? "block" : "none";
      blockEn.style.display = lang === "en" ? "block" : "none";
    }
    // if we are on selenoid.html and have a hash, adjust saved lang
    if (location.pathname.endsWith("/selenoid.html") && location.hash) {
      const h = location.hash.replace("#", "");
      if (h === "ru" || h === "en") setLang(h);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLanguageSwitcher();
    initHomeSwitcher();
    applyInitial();
    document.addEventListener("lang:change", function (e) {
      updateHomeLinks(e.detail);
      // also refresh labels instantly
      const lang = e.detail;
      const locBtn = document.getElementById("link-locators");
      const depBtn = document.getElementById("link-deps");
      const cookbookBtn = document.getElementById("link-cookbook");
      if (locBtn)
        locBtn.textContent =
          lang === "en" ? "Locators (XPath & CSS)" : "Локаторы (XPath & CSS)";
      if (depBtn)
        depBtn.textContent =
          lang === "en" ? "Dependencies (Java)" : "Зависимости (Java)";
      if (cookbookBtn)
        cookbookBtn.textContent = lang === "en" ? "Cookbook" : "Книга рецептов";
    });
  });
})();
