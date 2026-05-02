(function () {
  /** Синхронизация горизонтальной прокрутки нескольких панелей и зеркальной полосы */
  function syncPanels(panels, mirror, sizer) {
    let syncing = false;

    function maxScrollWidth() {
      var w = 0;
      panels.forEach(function (p) {
        if (p.scrollWidth > w) w = p.scrollWidth;
      });
      return w;
    }

    function syncSizer() {
      sizer.style.width = maxScrollWidth() + "px";
    }

    function applyScrollLeft(sl) {
      syncing = true;
      panels.forEach(function (p) {
        p.scrollLeft = sl;
      });
      mirror.scrollLeft = sl;
      syncing = false;
    }

    function onPanelScroll(e) {
      if (syncing) return;
      applyScrollLeft(e.target.scrollLeft);
    }

    function onMirrorScroll() {
      if (syncing) return;
      applyScrollLeft(mirror.scrollLeft);
    }

    syncSizer();
    panels.forEach(function (p) {
      p.addEventListener("scroll", onPanelScroll);
      if (typeof ResizeObserver !== "undefined") {
        new ResizeObserver(syncSizer).observe(p);
      }
    });
    mirror.addEventListener("scroll", onMirrorScroll);
    window.addEventListener("resize", syncSizer);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncSizer);
    }
  }

  /* Плавающий заголовок: клонируем thead и показываем fixed вверху viewport */
  function setupStickyHeader(root, scrollSource) {
    var tables = root.querySelectorAll("table");
    if (!tables.length || !scrollSource) return;

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

      var mr = scrollSource.getBoundingClientRect();
      wrap.style.left = mr.left + "px";
      wrap.style.width = mr.width + "px";

      scrollDiv.scrollLeft = scrollSource.scrollLeft;
    }

    window.addEventListener("scroll", update, { passive: true });
    scrollSource.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  document.querySelectorAll("[data-locators-scroll-sync]").forEach(function (root) {
    var panels = root.querySelectorAll("[data-locators-scroll-panel]");
    var mirror = root.querySelector("[data-locators-top-scroll]");
    var sizer = root.querySelector("[data-locators-scroll-sizer]");
    if (!panels.length || !mirror || !sizer) return;
    syncPanels(panels, mirror, sizer);
    setupStickyHeader(root, panels[0]);
  });
})();
