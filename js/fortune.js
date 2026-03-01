(function () {
    var fortuneBtn = document.getElementById('fortuneBtn');
    var fortuneCardWrap = document.getElementById('fortuneCardWrap');
    var members = window.SVT_MEMBERS || [];
    if (!fortuneBtn || !fortuneCardWrap) return;

    fortuneBtn.addEventListener('click', function () {
        if (fortuneBtn.disabled) return;
        if (members.length === 0) return;

        fortuneBtn.disabled = true;
        fortuneBtn.style.pointerEvents = 'none';

        var randomIndex = Math.floor(Math.random() * members.length);
        var member = members[randomIndex];

        var card = document.createElement('a');
        card.href = './member.html';
        card.className = 'fortune-card';
        card.style.setProperty('--fortune-card-color', member.color);

        card.addEventListener('click', function (e) {
            localStorage.setItem('currentMember', member.id);
        });

        card.innerHTML =
            '<div class="fortune-card-bg">' +
            '<img src="./images/' + member.id + '_background.jpg" alt="">' +
            '</div>' +
            '<div class="fortune-card-mask"></div>' +
            '<div class="fortune-card-info">' +
            '<div class="fortune-card-name">' + member.stageName + ' (' + member.realName + ')</div>' +
            '<div class="fortune-card-sub">' + member.team + ' · ' + member.role + '</div>' +
            '</div>';

        fortuneCardWrap.innerHTML = '';
        fortuneCardWrap.appendChild(card);
    });
})();
