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

  document.querySelectorAll("[data-locators-scroll-sync]").forEach(function (root) {
    var main = root.querySelector("[data-locators-main-scroll]");
    var top = root.querySelector("[data-locators-top-scroll]");
    var sizer = root.querySelector("[data-locators-scroll-sizer]");
    if (main && top && sizer) syncPair(main, top, sizer);
  });
})();
