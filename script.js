let voteData = {
  team1: 0,
  team2: 0
};
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initScrollAnimations();
  initBackToTop();
  initStatCounter();
  initHighlights();
  initVoting();
  initContactForm();
  requestNotificationPermission();
  console.log('頁面已載入完成！');
});
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    console.log('準備請求通知權限');
  }
}
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    }
  });
}
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });
}
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  const animatedElements = document.querySelectorAll('.team-card, .match-item, .stat-card');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}
function initStatCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateValue(entry.target, 0, target, 2000);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(stat => observer.observe(stat));
}
function toggleMatchDetails(gameId) {
  const details = document.getElementById(`${gameId}-details`);
  const button = event.target;
  if (details.style.display === 'none') {
    details.style.display = 'block';
    button.innerHTML = '隱藏詳情 <i class="bi bi-chevron-up"></i>';
  } else {
    details.style.display = 'none';
    button.innerHTML = '查看詳情 <i class="bi bi-chevron-down"></i>';
  }
}
function toggleMatch(gameId) {
  const body = document.getElementById(`${gameId}-body`);
  const icon = document.getElementById(`${gameId}-icon`);
  if (body && icon) {
    if (body.style.display === 'none' || body.style.display === '') {
      body.style.display = 'block';
      icon.classList.remove('bi-chevron-down');
      icon.classList.add('bi-chevron-up');
    } else {
      body.style.display = 'none';
      icon.classList.remove('bi-chevron-up');
      icon.classList.add('bi-chevron-down');
    }
  }
}
function initHighlights() {
  const highlights = [
    {
      title: '第一局：完美開局',
      description: '戰隊 A 在前期取得巨大優勢，15 分鐘經濟領先 5000...',
      image: 'assets/highlight1.jpg',
      game: 'Game 1'
    },
    {
      title: '第二局：絕地反擊',
      description: '戰隊 B 在劣勢下完成驚天逆轉，一波團戰扭轉局勢...',
      image: 'assets/highlight2.jpg',
      game: 'Game 2'
    },
    {
      title: '第三局：五殺時刻',
      description: '選手 XXX 在關鍵團戰中完成五殺，震撼全場觀眾...',
      image: 'assets/highlight3.jpg',
      game: 'Game 3'
    },
    {
      title: '決勝局：史詩對決',
      description: '雙方在第五局展開終極對決，比賽持續 45 分鐘...',
      image: 'assets/highlight4.jpg',
      game: 'Game 5'
    }
  ];
  const container = document.getElementById('highlights-container');
  if (!container) {
    console.log('精彩時刻容器不存在，跳過初始化');
    return;
  }
  highlights.forEach((highlight, index) => {
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-3';
    card.innerHTML = `
      <div class="highlight-card" style="animation-delay: ${index * 0.1}s">
        <img src="${highlight.image}" alt="${highlight.title}" class="highlight-image" onerror="this.src='https:
        <div class="highlight-body">
          <span class="badge bg-primary mb-2">${highlight.game}</span>
          <h5 class="highlight-title">${highlight.title}</h5>
          <p class="highlight-description">${highlight.description}</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}
function initVoting() {
  const savedVotes = localStorage.getItem('lolWorldsVotes');
  if (savedVotes) {
    voteData = JSON.parse(savedVotes);
  }
  const hasVoted = localStorage.getItem('hasVoted');
  if (hasVoted) {
    showVoteResults();
  }
}
function vote(team) {
  const hasVoted = localStorage.getItem('hasVoted');
  if (hasVoted) {
    alert('您已經投過票了！每位訪客只能投票一次。');
    return;
  }
  voteData[team]++;
  localStorage.setItem('lolWorldsVotes', JSON.stringify(voteData));
  localStorage.setItem('hasVoted', 'true');
  localStorage.setItem('votedTeam', team);
  showVoteResults();
}
function showVoteResults() {
  const voteButtons = document.getElementById('vote-buttons');
  const voteResults = document.getElementById('vote-results');
  if (voteButtons) voteButtons.style.display = 'none';
  if (voteResults) voteResults.style.display = 'block';
  updateVoteDisplay();
}
function updateVoteDisplay() {
  const total = voteData.team1 + voteData.team2;
  const team1VotesEl = document.getElementById('team1-votes');
  const team2VotesEl = document.getElementById('team2-votes');
  const totalVotesEl = document.getElementById('total-votes');
  if (team1VotesEl) team1VotesEl.textContent = voteData.team1;
  if (team2VotesEl) team2VotesEl.textContent = voteData.team2;
  if (totalVotesEl) totalVotesEl.textContent = total;
  if (total === 0) {
    updateTeamVote('team1', 0, 0);
    updateTeamVote('team2', 0, 0);
  } else {
    const team1Percentage = Math.round((voteData.team1 / total) * 100);
    const team2Percentage = Math.round((voteData.team2 / total) * 100);
    updateTeamVote('team1', team1Percentage, voteData.team1);
    updateTeamVote('team2', team2Percentage, voteData.team2);
  }
}
function updateTeamVote(team, percentage, votes) {
  const percentageEl = document.getElementById(`${team}-percentage`);
  const progressEl = document.getElementById(`${team}-progress`);
  if (percentageEl) percentageEl.textContent = percentage + '%';
  if (progressEl) {
    setTimeout(() => {
      progressEl.style.width = percentage + '%';
    }, 100);
  }
}
function disableVoting() {
  const voteButtons = document.querySelectorAll('.btn-vote');
  voteButtons.forEach(button => {
    button.disabled = true;
    button.textContent = '已投票';
  });
}
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) {
    console.warn('聯絡表單元素不存在');
    return;
  }
  console.log('聯絡表單已初始化');
  form.addEventListener('submit', function(event) {
    console.log('表單提交事件觸發');
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    console.log('表單驗證狀態:', form.checkValidity());
    if (!form.checkValidity()) {
      console.log('表單驗證失敗，顯示錯誤訊息');
      form.classList.add('was-validated');
      showFormMessage('danger', '請填寫所有必填欄位！');
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) {
        console.log('第一個無效欄位:', firstInvalid.id);
        firstInvalid.focus();
      }
      return false;
    }
    console.log('表單驗證通過，準備送出');
    handleFormSubmit(form);
    return false;
  }, true);
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    input.addEventListener('input', function() {
      if (form.classList.contains('was-validated')) {
        validateField(this);
      }
    });
  });
}
function validateField(field) {
  const parent = field.closest('.mb-3');
  const feedback = parent.querySelector('.invalid-feedback');
  if (!field.checkValidity()) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    if (field.validity.valueMissing) {
      feedback.textContent = '此欄位為必填';
    } else if (field.validity.typeMismatch) {
      feedback.textContent = '請輸入正確的格式';
    } else if (field.validity.tooShort) {
      feedback.textContent = `至少需要 ${field.minLength} 個字元`;
    } else {
      feedback.textContent = field.validationMessage;
    }
  } else {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
  }
}
function handleFormSubmit(form) {
  const formData = new FormData(form);
  const email = formData.get('email');
  const subject = formData.get('subject');
  const message = formData.get('message');
  const data = {
    email: email,
    subject: subject,
    message: message,
    timestamp: new Date().toLocaleString('zh-TW')
  };
  console.log('表單資料：', data);
  const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
  submissions.push(data);
  localStorage.setItem('formSubmissions', JSON.stringify(submissions));
  showFormMessage('success', '感謝您的訊息！郵件程式即將開啟，請點擊發送完成寄信。');
  form.reset();
  form.classList.remove('was-validated');
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.classList.remove('is-valid', 'is-invalid');
  });
  setTimeout(() => {
    const mailtoLink = `mailto:raymondlei.twn@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`寄件者 Email: ${email}\n\n內容：\n${message}\n\n送出時間：${data.timestamp}`)}`;
    const link = document.createElement('a');
    link.href = mailtoLink;
    link.click();
    showNotification('訊息已送出', '郵件程式已開啟，請完成寄信。');
  }, 1000);
}
function showNotification(title, body) {
  if (!("Notification" in window)) {
    console.log('此瀏覽器不支援通知功能');
    return;
  }
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: body,
      icon: 'assets/team1-logo.png',
      badge: 'assets/team1-logo.png',
      vibrate: [200, 100, 200]
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        new Notification(title, {
          body: body,
          icon: 'assets/team1-logo.png',
          badge: 'assets/team1-logo.png',
          vibrate: [200, 100, 200]
        });
      }
    });
  }
}
function showFormMessage(type, message) {
  const messageDiv = document.getElementById('form-message');
  messageDiv.className = type === 'success' ? 'alert alert-success' : 'alert alert-danger';
  messageDiv.textContent = message;
  messageDiv.style.display = 'block';
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
}
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  images.forEach(img => imageObserver.observe(img));
}
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const openDetails = document.querySelectorAll('.match-details[style*="display: block"]');
    openDetails.forEach(detail => {
      detail.style.display = 'none';
    });
  }
  if (event.key === 'Home') {
    event.preventDefault();
    scrollToTop();
  }
});
function showVoteStats() {
  console.log('=== 投票統計 ===');
  console.log('戰隊 A:', voteData.team1, '票');
  console.log('戰隊 B:', voteData.team2, '票');
  console.log('總票數:', voteData.team1 + voteData.team2);
  console.log('已投票:', localStorage.getItem('hasVoted') ? '是' : '否');
}
function resetVotes() {
  if (confirm('確定要重置所有投票資料嗎？')) {
    localStorage.removeItem('lolWorldsVotes');
    localStorage.removeItem('hasVoted');
    voteData = { team1: 0, team2: 0 };
    location.reload();
  }
}
console.log('%c2025 LOL Worlds Finals', 'font-size: 20px; font-weight: bold; color: #c89b3c;');
console.log('%c開發者工具已載入！', 'color: #005a82;');
console.log('%c輸入 showVoteStats() 查看投票統計', 'color: #666;');
console.log('%c輸入 resetVotes() 重置投票資料', 'color: #666;');
