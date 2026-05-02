(function () {
  function syncPair(main, top, sizer) {
    let syncing = false;

    function syncSizer() {
      sizer.style.width = main.scrollWidth + "px";
    }

    function syncFromMain() {
      if (syncing) return;
      syncing = true;
      top.scrollLeft = main.scrollLeft;
      syncing = false;
    }

    function syncFromTop() {
      if (syncing) return;
      syncing = true;
      main.scrollLeft = top.scrollLeft;
      syncing = false;
    }

    syncSizer();
    main.addEventListener("scroll", syncFromMain);
    top.addEventListener("scroll", syncFromTop);
    window.addEventListener("resize", syncSizer);
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(syncSizer).observe(main);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncSizer);
    }
  }

  /* Плавающий заголовок: клонируем thead и показываем fixed вверху,
     когда оригинальный thead уходит за верхний край viewport */
  function setupStickyHeader(main) {
    var tables = main.querySelectorAll("table");
    if (!tables.length) return;

    // Строим DOM: повторяем структуру обёрток для наследования CSS
    var wrap = document.createElement("div");
    wrap.className = "locators-sticky-header";
    wrap.setAttribute("aria-hidden", "true");

    var syncDiv = document.createElement("div");
    syncDiv.className = "locators-scroll-sync";

    var scrollDiv = document.createElement("div");
    scrollDiv.className = "locators-h-scroll";

    var tbl = document.createElement("table");
    var cg = tables[0].querySelector("colgroup");
    if (cg) tbl.appendChild(cg.cloneNode(true));
    tbl.appendChild(tables[0].querySelector("thead").cloneNode(true));

    scrollDiv.appendChild(tbl);
    syncDiv.appendChild(scrollDiv);
    wrap.appendChild(syncDiv);
    document.body.appendChild(wrap);

    function update() {
      var shouldShow = false;

      for (var i = 0; i < tables.length; i++) {
        var thead = tables[i].querySelector("thead");
        if (!thead) continue;
        var theadRect = thead.getBoundingClientRect();
        var tableRect = tables[i].getBoundingClientRect();

        // thead ушёл за верх, но таблица ещё видна
        if (theadRect.bottom <= 0 && tableRect.bottom > 50) {
          shouldShow = true;
          break;
        }
      }

      if (!shouldShow) {
        wrap.style.display = "none";
        return;
      }

      wrap.style.display = "block";

      // Позиционируем точно по основному контейнеру
      var mr = main.getBoundingClientRect();
      wrap.style.left = mr.left + "px";
      wrap.style.width = mr.width + "px";

      // Синхронизируем горизонтальную прокрутку
      scrollDiv.scrollLeft = main.scrollLeft;
    }

    window.addEventListener("scroll", update, { passive: true });
    main.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  document.querySelectorAll("[data-locators-scroll-sync]").forEach(function (root) {
    var main = root.querySelector("[data-locators-main-scroll]");
    var top = root.querySelector("[data-locators-top-scroll]");
    var sizer = root.querySelector("[data-locators-scroll-sizer]");
    if (main && top && sizer) {
      syncPair(main, top, sizer);
      setupStickyHeader(main);
    }
  });
})();
