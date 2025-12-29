let allRepos = [];
let currentUser = null;
let activityChart = null;
let languageChart = null;

document.addEventListener('DOMContentLoaded', function() {
  updateHistoryUI();

  document.getElementById('searchBtn').addEventListener('click', fetchData);
  document.getElementById('clearBtn').addEventListener('click', clearAll);
  document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);
  document.getElementById('searchInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') fetchData();
  });
  document.getElementById('languageFilter').addEventListener('change', filterByLanguage);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      filterRepos(this.dataset.filter);
    });
  });
});

function toggleTheme() {
  document.body.classList.toggle('light-theme');
  const icon = document.getElementById('themeIcon');

  if (document.body.classList.contains('light-theme')) {
    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
  } else {
    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
  }
}

function addToHistory(username) {
  let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
  history = history.filter(u => u !== username);
  history.unshift(username);
  history = history.slice(0, 5);
  localStorage.setItem('searchHistory', JSON.stringify(history));
  updateHistoryUI();
}

function updateHistoryUI() {
  const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
  const container = document.getElementById('searchHistory');

  if (history.length === 0) {
    container.innerHTML = '';
    return;
  }

  let html = '<span class="history-label">Recent:</span>';
  history.forEach(user => {
    html += `<button class="history-btn" data-username="${user}">${user}</button>`;
  });

  container.innerHTML = html;

  container.querySelectorAll('.history-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.getElementById('searchInput').value = this.dataset.username;
      fetchData();
    });
  });
}

function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
  setTimeout(() => errorDiv.classList.add('hidden'), 5000);
}

function setLoading(isLoading) {
  document.getElementById('loadingSpinner').classList.toggle('hidden', !isLoading);
  document.getElementById('userCard').classList.toggle('hidden', isLoading);
  document.getElementById('statsSection').classList.toggle('hidden', isLoading);
  document.getElementById('repoFilters').classList.toggle('hidden', isLoading);
  document.getElementById('repoContainer').classList.toggle('hidden', isLoading);
}

async function getUserData(userName) {
  const response = await fetch(`https://api.github.com/users/${userName}`);
  if (!response.ok) throw new Error('User not found');
  return response.json();
}

async function getRepos(userName) {
  const response = await fetch(`https://api.github.com/users/${userName}/repos?per_page=100&sort=updated`);
  if (!response.ok) throw new Error('Repositories not found');
  return response.json();
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    btn.style.backgroundColor = '#10b981';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.backgroundColor = '';
    }, 2000);
  });
}

function createActivityChart(data) {
  const ctx = document.getElementById('activityChart');
  if (activityChart) activityChart.destroy();

  activityChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Repos', 'Gists', 'Followers', 'Following'],
      datasets: [{
        label: 'Count',
        data: [data.public_repos, data.public_gists, data.followers, data.following],
        backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#9ca3af' },
          grid: { color: '#30363d' }
        },
        x: {
          ticks: { color: '#9ca3af' },
          grid: { display: false }
        }
      }
    }
  });
}

function createLanguageChart(repos) {
  const ctx = document.getElementById('languageChart');
  if (languageChart) languageChart.destroy();

  const languages = {};
  repos.forEach(repo => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });

  const sortedLangs = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (sortedLangs.length === 0) {
    ctx.parentElement.innerHTML = '<p style="color: #9ca3af; text-align: center;">No language data available</p>';
    return;
  }

  languageChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: sortedLangs.map(l => l[0]),
      datasets: [{
        data: sortedLangs.map(l => l[1]),
        backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#9ca3af', padding: 15 }
        }
      }
    }
  });

  updateLanguageFilter(languages);
}

function updateLanguageFilter(languages) {
  const select = document.getElementById('languageFilter');
  let options = '<option value="all">All Languages</option>';

  Object.keys(languages).sort().forEach(lang => {
    options += `<option value="${lang}">${lang} (${languages[lang]})</option>`;
  });

  select.innerHTML = options;
}

function filterRepos(type) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.filter === type) {
      btn.classList.add('active');
    }
  });

  let filtered = [...allRepos];

  switch(type) {
    case 'stars':
      filtered.sort((a, b) => b.stargazers_count - a.stargazers_count);
      break;
    case 'recent':
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    case 'forks':
      filtered.sort((a, b) => b.forks_count - a.forks_count);
      break;
    default:
      filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }

  displayRepos(filtered);
}

function filterByLanguage() {
  const selectedLang = document.getElementById('languageFilter').value;

  let filtered = allRepos;
  if (selectedLang !== 'all') {
    filtered = allRepos.filter(repo => repo.language === selectedLang);
  }

  displayRepos(filtered);
}

function displayRepos(repos) {
  const container = document.getElementById('repoContainer');

  if (repos.length === 0) {
    container.innerHTML = '<div class="empty-state"><h3>No repositories found</h3></div>';
    return;
  }

  let html = '<h2 class="repos-title">Repositories:</h2>';

  repos.forEach(repo => {
    html += `
      <div class="repo-card">
        <a href="${repo.html_url}" target="_blank" class="repo-name">
          <i data-feather="book-open" class="repo-icon"></i>
          ${repo.name}
        </a>

        <p class="repo-description">
          ${repo.description || 'No description available'}
        </p>

        <div class="repo-meta">
          ${repo.language ? `
            <div class="meta-item">
              <i data-feather="code" class="meta-icon" style="color: #f59e0b;"></i>
              <span class="meta-value">${repo.language}</span>
            </div>
          ` : ''}

          <div class="meta-item">
            <i data-feather="star" class="meta-icon" style="color: #f59e0b;"></i>
            <span class="meta-value">${repo.stargazers_count}</span>
          </div>

          <div class="meta-item">
            <i data-feather="git-branch" class="meta-icon" style="color: #8b5cf6;"></i>
            <span class="meta-value">${repo.forks_count}</span>
          </div>

          <div class="meta-item">
            <i data-feather="clock" class="meta-icon" style="color: #60a5fa;"></i>
            <span class="meta-value">${new Date(repo.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  feather.replace();
}

async function fetchData() {
  const input = document.getElementById('searchInput').value.trim();

  if (!input) {
    showError('Please enter a GitHub username or URL');
    return;
  }

  const userName = input.includes('github.com/')
    ? input.split('github.com/')[1].split('/')[0]
    : input;

  setLoading(true);
  document.getElementById('errorMessage').classList.add('hidden');

  try {
    const userData = await getUserData(userName);
    currentUser = userData;
    addToHistory(userName);

    displayUserCard(userData);
    const reposData = await getRepos(userName);
    allRepos = reposData;

    createActivityChart(userData);
    createLanguageChart(reposData);

    filterRepos('all');

    document.getElementById('userCard').classList.remove('hidden');
    document.getElementById('statsSection').classList.remove('hidden');
    document.getElementById('repoFilters').classList.remove('hidden');

  } catch (error) {
    showError('User not found or an error occurred. Please try again.');
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
}

function displayUserCard(data) {
  const card = document.getElementById('userCard');

  card.innerHTML = `
    <div class="user-card-content">
      <div class="user-avatar-container">
        <img src="${data.avatar_url}" alt="User Avatar" class="user-avatar">
      </div>

      <div class="user-info">
        <h2 class="user-name">${data.name || data.login}</h2>
        <p class="user-username">@${data.login}</p>
        <p class="user-bio">${data.bio || 'No bio available'}</p>

        <div class="user-details">
          <div class="user-detail-item">
            <span class="detail-label">Company</span>
            <span>${data.company || 'N/A'}</span>
          </div>
          <div class="user-detail-item">
            <span class="detail-label">Location</span>
            <span>${data.location || 'N/A'}</span>
          </div>
          <div class="user-detail-item">
            <span class="detail-label">Email</span>
            <span>${data.email || 'N/A'}</span>
          </div>
          <div class="user-detail-item">
            <span class="detail-label">Blog</span>
            <span>${data.blog || 'N/A'}</span>
          </div>
          <div class="user-detail-item">
            <span class="detail-label">Twitter</span>
            <span>${data.twitter_username || 'N/A'}</span>
          </div>
          <div class="user-detail-item">
            <span class="detail-label">Hireable</span>
            <span>${data.hireable ? 'Yes' : 'No'}</span>
          </div>
        </div>

        <div class="user-stats">
          <span class="stat-item">📦 <strong>Repos:</strong> ${data.public_repos}</span>
          <span class="stat-item">📝 <strong>Gists:</strong> ${data.public_gists}</span>
          <span class="stat-item">👥 <strong>Followers:</strong> ${data.followers}</span>
          <span class="stat-item">👣 <strong>Following:</strong> ${data.following}</span>
          <span class="stat-item">📅 <strong>Joined:</strong> ${new Date(data.created_at).toLocaleDateString()}</span>
        </div>

        <div>
          <a href="${data.html_url}" target="_blank" class="user-link">
            View Full GitHub Profile →
          </a>
          <button class="copy-btn" onclick="copyToClipboard('${data.html_url}')">
            Copy Link
          </button>
        </div>
      </div>
    </div>
  `;
}

function clearAll() {
  document.getElementById('searchInput').value = '';
  document.getElementById('userCard').classList.add('hidden');
  document.getElementById('statsSection').classList.add('hidden');
  document.getElementById('repoFilters').classList.add('hidden');
  document.getElementById('errorMessage').classList.add('hidden');

  const container = document.getElementById('repoContainer');
  container.innerHTML = '<div class="empty-state"><h3>Search anyone\'s GitHub profile here</h3></div>';

  allRepos = [];
  currentUser = null;

  if (activityChart) activityChart.destroy();
  if (languageChart) languageChart.destroy();
}
