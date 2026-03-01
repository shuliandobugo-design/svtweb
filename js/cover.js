(function () {
    var pageScroll = document.getElementById('pageScroll');
    var sectionCover = document.getElementById('section-cover');
    var sectionMain = document.getElementById('section-main');
    if (!pageScroll || !sectionCover || !sectionMain) return;

    // 点击封面 → 平滑滚动到首页
    sectionCover.addEventListener('click', function () {
        sectionMain.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // 在封面时向下滚动 → 滚动到首页（避免一次滚过很多）
    sectionCover.addEventListener('wheel', function (e) {
        if (e.deltaY > 0) {
            e.preventDefault();
            sectionMain.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, { passive: false });
})();
