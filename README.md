# 🚀 GitHub Profile Explorer

A beautiful, feature-rich web application to explore and analyze GitHub profiles with interactive visualizations and real-time data.

![GitHub Profile Explorer](https://img.shields.io/badge/version-2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

### 🎨 **Theme Support**
- **Dark Mode** (Default) - Easy on the eyes with GitHub-inspired dark theme
- **Light Mode** - Clean and bright interface for daytime use
- Smooth theme transitions with persistent selection

### 🔍 **Smart Search**
- Search by GitHub username or profile URL
- Search history tracking (last 5 searches)
- Quick access buttons for recent searches
- Enter key support for faster searching
- URL parsing (supports github.com/username format)

### 📊 **Interactive Visualizations**
- **Activity Overview Chart** - Bar chart showing repos, gists, followers, and following
- **Top Languages Chart** - Doughnut chart displaying the top 5 programming languages used
- Powered by Chart.js for smooth, responsive charts

### 🗂️ **Advanced Repository Filtering**
- **All Repos** - Default chronological view
- **Most Starred** - Sort by popularity
- **Most Recent** - Latest repositories first
- **Most Forked** - Most forked projects
- **Language Filter** - Dropdown to filter by programming language

### 💼 **Comprehensive Profile Display**
- Avatar and basic info (name, username, bio)
- Detailed stats (repos, gists, followers, following, join date)
- Company, location, email, blog, and Twitter info
- Hireable status indicator
- Direct link to GitHub profile
- Copy profile link button

### 🎯 **Repository Cards**
Each repository displays:
- Repository name with icon
- Description
- Primary language
- Star count
- Fork count
- Creation date
- Direct link to repository

### 🚦 **User Experience**
- Loading spinner with smooth animations
- Error handling with user-friendly messages
- Responsive design (mobile, tablet, desktop)
- Hover effects and transitions
- Clean, organized layout
- Icon support via Feather Icons

## 🛠️ Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Custom styling with animations
- **JavaScript (ES6+)** - Core functionality
- **GitHub REST API** - Data fetching
- **Chart.js v4.4.0** - Data visualizations
- **Feather Icons** - Beautiful icon set
- **LocalStorage API** - Search history persistence

## 📁 Project Structure

```
github-profile-explorer/
│
├── index.html          # Main HTML structure
├── style.css           # All styles and animations
├── script.js           # JavaScript functionality
└── README.md           # Documentation (this file)
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for API calls and CDN resources)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/github-profile-explorer.git
   ```

2. **Navigate to project directory**
   ```bash
   cd github-profile-explorer
   ```

3. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # Or use a local server (recommended)
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

### Usage

1. **Search for a Profile**
   - Enter a GitHub username (e.g., `torvalds`) or full URL
   - Click "Search" or press Enter

2. **Explore the Profile**
   - View user information and statistics
   - Analyze activity charts
   - Browse repositories

3. **Filter Repositories**
   - Use filter buttons to sort repos
   - Select a language from the dropdown
   - Click any repo card to visit it on GitHub

4. **Toggle Theme**
   - Click the moon/sun icon in the top-right corner
   - Theme preference is saved automatically

5. **Clear Results**
   - Click "Clear" button to reset the view

## 🎨 Customization

### Changing Colors

Edit `style.css` to customize the color scheme:

```css
/* Dark Theme Colors */
body {
  background-color: #0d1117;  /* Main background */
  color: #ffffff;              /* Text color */
}

/* Accent Colors */
.btn-primary {
  background-color: #3b82f6;  /* Primary button */
}
```

### Adding More Chart Types

In `script.js`, you can add new charts:

```javascript
function createCustomChart(data) {
  const ctx = document.getElementById('customChart');
  new Chart(ctx, {
    type: 'line', // or 'pie', 'radar', etc.
    data: {
      // Your data configuration
    }
  });
}
```

## 📊 API Information

This project uses the **GitHub REST API v3**:

- **User Endpoint**: `https://api.github.com/users/{username}`
- **Repos Endpoint**: `https://api.github.com/users/{username}/repos`
- **Rate Limit**: 60 requests/hour (unauthenticated)
- **Documentation**: [GitHub API Docs](https://docs.github.com/en/rest)

### Rate Limit Considerations

For higher rate limits (5,000 requests/hour), add authentication:

```javascript
const response = await fetch(`https://api.github.com/users/${userName}`, {
  headers: {
    'Authorization': 'token YOUR_GITHUB_TOKEN'
  }
});
```

## 🌟 Features Breakdown

| Feature | Description | Status |
|---------|-------------|--------|
| User Search | Search by username or URL | ✅ |
| Profile Display | Complete user information | ✅ |
| Repository List | All public repositories | ✅ |
| Charts | Activity & language visualization | ✅ |
| Filters | Multiple sorting options | ✅ |
| Theme Toggle | Dark/Light mode | ✅ |
| Search History | Recent searches | ✅ |
| Responsive | Mobile-friendly | ✅ |
| Error Handling | User-friendly messages | ✅ |
| Loading States | Visual feedback | ✅ |

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

## 🐛 Known Issues

- GitHub API rate limiting (60 requests/hour for unauthenticated users)
- Some users may have private email addresses
- Very large repositories lists may take time to load

## 🔮 Future Enhancements

- [ ] Add GitHub authentication for higher rate limits
- [ ] Export profile data to PDF/JSON
- [ ] Compare multiple GitHub profiles
- [ ] Display contribution graph
- [ ] Show repository languages breakdown
- [ ] Add user followers/following list
- [ ] Integration with GitHub Gists
- [ ] Pinned repositories section
- [ ] Star history over time
- [ ] Advanced search filters

## 📝 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024 GitHub Profile Explorer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [GitHub API](https://docs.github.com/en/rest) - For providing the data
- [Chart.js](https://www.chartjs.org/) - For beautiful charts
- [Feather Icons](https://feathericons.com/) - For elegant icons
- GitHub community for inspiration

## 📸 Screenshots

### Dark Mode
![Dark Mode Screenshot](screenshot-dark.png)

### Light Mode
![Light Mode Screenshot](screenshot-light.png)

### Mobile View
![Mobile View](screenshot-mobile.png)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by developers, for developers

[Report Bug](https://github.com/yourusername/github-profile-explorer/issues) · [Request Feature](https://github.com/yourusername/github-profile-explorer/issues)

</div>
