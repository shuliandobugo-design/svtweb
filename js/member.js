// 读取当前成员ID
const currentMemberId = localStorage.getItem('currentMember');
if (!currentMemberId) {
    window.location.href = './index.html#main';
    throw new Error('no member');
}

// 成员数据：优先用脚本已加载的（兼容 file://），否则 fetch（需本地服务器）
var members = window.SVT_MEMBERS || [];
function tryRender() {
    if (members.length > 0) {
        const member = members.find(item => item.id === currentMemberId);
        if (!member) {
            window.location.href = './index.html#main';
            return;
        }
        renderMemberPage(member);
        loadRatingData(member.id);
        bindRatingEvents(member.id);
        return;
    }
    fetch('./json/svt-members.json')
        .then(function (response) { return response.json(); })
        .then(function (data) {
            members = data;
            tryRender();
        })
        .catch(function () {
            console.log('读取数据失败，请用本地服务器打开（如 npx serve）或确认已引入 js/svt-members-data.js');
        });
}
tryRender();

// 渲染成员详情页
function renderMemberPage(member) {
    // 设置应援色变量
    document.documentElement.style.setProperty('--member-color', member.color);
    
    // 背景图
    document.getElementById('memberBgImg').src = `./images/${member.id}_background.jpg`;
    
    // 轮播图（多张照片）
    const carouselCount = member.carouselCount || 0;
    if (carouselCount > 0) {
        initCarousel(member.id, carouselCount);
    }
    
    // 头部信息
    document.getElementById('memberName').textContent = `${member.stageName} (${member.realName})`;
    document.getElementById('memberTeam').textContent = `分队：${member.team}`;
    document.getElementById('memberRole').textContent = `团内担当：${member.role}`;
    
    // 基础信息
    const basicInfo = `
        <li>出生日期：${member.birthday}</li>
        <li>国籍：${member.nationality}</li>
        <li>血型：${member.bloodType}</li>
        <li>MBTI：${member.mbti}</li>
        <li>活动状态：${member.status}</li>
    `;
    document.getElementById('basicInfo').innerHTML = basicInfo;
    
    // 主要作品（带链接则显示为可点击）
    const works = member.works.map(work => {
        const text = `${work.name} - ${work.time}`;
        if (work.url) {
            return `<li><a href="${work.url}" target="_blank" rel="noopener noreferrer" class="work-link">${text}</a></li>`;
        }
        return `<li>${text}</li>`;
    }).join('');
    document.getElementById('memberWorks').innerHTML = works;
    
    // 时间线
    const timeline = member.timeline.map(item => `<li>${item.time}：${item.event}</li>`).join('');
    document.getElementById('memberTimeline').innerHTML = timeline;
}

// 轮播图：初始化与切换
function initCarousel(memberId, count) {
    const container = document.getElementById('memberCarousel');
    const track = document.getElementById('carouselTrack');
    const dotsWrap = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    
    container.style.display = 'block';
    track.innerHTML = '';
    dotsWrap.innerHTML = '';
    
    for (let i = 1; i <= count; i++) {
        const img = document.createElement('img');
        img.src = `./images/${memberId}_${i}.jpg`;
        img.alt = `成员照片 ${i}`;
        track.appendChild(img);
        
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === 1 ? ' active' : '');
        dot.setAttribute('data-index', i - 1);
        dotsWrap.appendChild(dot);
    }
    
    let currentIndex = 0;
    const total = count;
    
    function goTo(index) {
        currentIndex = (index + total) % total;
        track.style.transform = `translateX(-${currentIndex * 320}px)`;
        dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentIndex);
        });
    }
    
    prevBtn.onclick = () => goTo(currentIndex - 1);
    nextBtn.onclick = () => goTo(currentIndex + 1);
    dotsWrap.querySelectorAll('.dot').forEach((dot, i) => {
        dot.onclick = () => goTo(i);
    });
    
    // 可选：自动轮播（每 4 秒）
    let autoTimer = setInterval(() => goTo(currentIndex + 1), 4000);
    container.addEventListener('mouseenter', () => clearInterval(autoTimer));
    container.addEventListener('mouseleave', () => {
        autoTimer = setInterval(() => goTo(currentIndex + 1), 4000);
    });
}

// 加载本地点赞点踩数据
function loadRatingData(memberId) {
    // 从localStorage读取，无则初始化为0
    const likeCount = localStorage.getItem(`like_${memberId}`) || 0;
    const dislikeCount = localStorage.getItem(`dislike_${memberId}`) || 0;
    
    document.getElementById('likeCount').textContent = likeCount;
    document.getElementById('dislikeCount').textContent = dislikeCount;
}

// 绑定点赞点踩事件
function bindRatingEvents(memberId) {
    // 点赞
    document.getElementById('likeBtn').addEventListener('click', () => {
        let count = parseInt(localStorage.getItem(`like_${memberId}`) || 0);
        count++;
        localStorage.setItem(`like_${memberId}`, count);
        document.getElementById('likeCount').textContent = count;
    });

    // 点踩
    document.getElementById('dislikeBtn').addEventListener('click', () => {
        let count = parseInt(localStorage.getItem(`dislike_${memberId}`) || 0);
        count++;
        localStorage.setItem(`dislike_${memberId}`, count);
        document.getElementById('dislikeCount').textContent = count;
    });
}
