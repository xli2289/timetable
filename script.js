// 初始化分数和总积分
let scores = [];
let totalScore = 0;

// 页面加载完成后执行的代码
document.addEventListener('DOMContentLoaded', () => {
    // 为课程表中的单元格添加点击事件
    document.querySelectorAll('#schedule td[data-activity]').forEach(cell => {
        cell.addEventListener('click', () => {
            const activityName = cell.getAttribute('data-activity');
            addScore(activityName, 1);
            showModal(activityName);
        });
    });

    // 获取模态框元素
    var modal = document.getElementById("myModal");
    var exchangeModal = document.getElementById("exchangeModal");

    // 获取关闭模态框的元素
    var span = document.getElementsByClassName("close")[0];
    var exchangeSpan = document.getElementsByClassName("exchange-close")[0];

    // 为关闭模态框的元素添加点击事件
    span.onclick = function() {
        modal.style.display = "none";
    }
    exchangeSpan.onclick = function() {
        exchangeModal.style.display = "none";
    }

    // 为窗口添加点击事件，点击模态框外部关闭模态框
    window.onclick = function(event) {
        if (event.target == modal || event.target == exchangeModal) {
            modal.style.display = "none";
            exchangeModal.style.display = "none";
        }
    }
});

// 显示课程表
function showSchedule() {
    document.getElementById('schedule').classList.remove('hidden');
    document.getElementById('scores').classList.add('hidden');
    document.getElementById('totalScoreSchedule').textContent = totalScore;
}

// 显示积分记录
function showScores() {
    document.getElementById('schedule').classList.add('hidden');
    document.getElementById('scores').classList.remove('hidden');
    document.getElementById('totalScoreScores').textContent = totalScore;
    renderScores();
}

// 添加积分
function addScore(name, score) {
    const date = new Date().toLocaleDateString();
    scores.push({ date, description: `参与 "${name}" 活动`, score });
    totalScore += score;
    document.getElementById('totalScoreSchedule').textContent = totalScore;
    document.getElementById('totalScoreScores').textContent = totalScore;
    renderScores();
}

// 删除积分
function removeScore(index) {
    totalScore -= scores[index].score;
    document.getElementById('totalScoreSchedule').textContent = totalScore;
    document.getElementById('totalScoreScores').textContent = totalScore;
    scores.splice(index, 1);
    renderScores();
}

// 渲染积分记录
function renderScores() {
    const scoreList = document.getElementById('scoreList');
    scoreList.innerHTML = '';

    // 按日期分组积分记录
    const groupedScores = {};
    scores.forEach(item => {
        if (!groupedScores[item.date]) {
            groupedScores[item.date] = [];
        }
        groupedScores[item.date].push(item);
    });

    // 渲染分组后的积分记录
    for (const date in groupedScores) {
        const group = groupedScores[date];
        group.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${date}</td>
                <td>${item.description}</td>
                <td>${item.score}</td>
                <td><span class="delete-btn" onclick="removeScore(${index})">删除</span></td>
            `;
            scoreList.appendChild(row);
        });
    }
}

// 显示模态框
function showModal(activityName) {
    var modal = document.getElementById("myModal");
    document.getElementById("activityName").innerText = activityName;
    document.getElementById("activityScore").innerText = 1;
    modal.style.display = "block";
}

// 打开兑换模态框
function openExchangeModal() {
    var exchangeModal = document.getElementById("exchangeModal");
    document.getElementById("exchangeMessage").innerText = "";
    exchangeModal.style.display = "block";
}

// 兑换商品
function exchangeProduct(productName, productPrice) {
    if (totalScore >= productPrice) {
        const date = new Date().toLocaleDateString();
        scores.push({ date, description: `兑换 ${productName}`, score: -productPrice });
        totalScore -= productPrice;
        document.getElementById('totalScoreSchedule').textContent = totalScore;
        document.getElementById('totalScoreScores').textContent = totalScore;
        renderScores();
        document.getElementById("exchangeMessage").innerText = `成功兑换 ${productName}!`;
    } else {
        document.getElementById("exchangeMessage").innerText = `积分不足，无法兑换 ${productName}.`;
    }
}
