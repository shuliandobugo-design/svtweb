// 成员数据：优先用脚本已加载的（兼容本地 file:// 双击打开），否则 fetch
let svtMembers = window.SVT_MEMBERS || [];
if (svtMembers.length === 0) {
    fetch('./json/svt-members.json')
        .then(response => response.json())
        .then(data => { svtMembers = data; })
        .catch(() => console.log('读取数据失败：若直接打开 html，请确保已引入 js/svt-members-data.js'));
}

// 点击成员名字跳转到详情页
document.querySelectorAll('.member-name').forEach(item => {
    item.addEventListener('click', () => {
        const memberId = item.getAttribute('data-id');
        // 把成员ID存入本地存储，供详情页读取
        localStorage.setItem('currentMember', memberId);
        // 跳转到详情页
        window.location.href = './member.html';
    });
});

// 随机探索按钮
document.querySelector('.random-btn').addEventListener('click', () => {
    if (svtMembers.length === 0) return;
    const randomIndex = Math.floor(Math.random() * svtMembers.length);
    const randomMember = svtMembers[randomIndex];
    localStorage.setItem('currentMember', randomMember.id);
    window.location.href = './member.html';
});

// 从成员页返回时停留在第二屏（成员选择页）
(function () {
    if (window.location.hash !== '#main') return;
    var pageScroll = document.getElementById('pageScroll');
    var sectionMain = document.getElementById('section-main');
    if (!pageScroll || !sectionMain) return;
    function scrollToMain() {
        pageScroll.scrollTop = sectionMain.offsetTop;
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { requestAnimationFrame(scrollToMain); });
    } else {
        requestAnimationFrame(scrollToMain);
    }
})();
