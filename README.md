# GitHub Portfolio Analyzer & Enhancer 🚀

> **Turn your GitHub profile into recruiter-ready proof.** 

A high-performance, premium web application that analyzes your GitHub activity, repositories, and documentation quality to provide an objective "Employability Score" and actionable feedback.

Designed with **"Maximum Smoothidity"** in mind — featuring fluid animations, glassmorphism, and a cinematic user experience.

![Demo](screenshot.png) *(Add your demo screenshot/gif here)*

## 🌟 Key Features

### 🧠 Intelligent Analysis
- **Objective Scoring Engine**: Evaluates 6 key dimensions:
  - **Documentation**: README quality, descriptions, wiki usage.
  - **Code Structure**: Repository layout and naming conventions.
  - **Activity**: Consistency of commits (consistency > bursts).
  - **Organization**: Pinned repos, topics, and profile completeness.
  - **Impact**: Stars, forks, and community engagement.
  - **Technical**: Language diversity and project complexity.
- **Recruiter Perspective**: Highlights "red flags" (e.g., empty repos, inconsistent activity) that hiring managers look for.
- **Actionable Advice**: Provides specific tasks to improve your score immediately.

### 🎨 Premium UI/UX ("Maximum Smoothidity")
- **Cinematic Landing Page**:
  - Interactive 3D mouse-following background.
  - Floating code snippets and glowing orbs.
  - Magnetic buttons with liquid shine effects.
  - Dynamic "Typewriter" text effects.
- **Data Visualization**:
  - Custom animated **Score Gauge** with glowing pulse effects.
  - Staggered entrance animations for a responsive feel.
  - Interactive "Glassmorphism" cards with hover lift and glow.
- **Performance First**:
  - Parallel data fetching for instant results.
  - Optimistic UI updates and staggered rendering.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Framer Motion (Animations), Tailwind CSS (Styling), Chart.js (Visualization)
- **Backend**: Express.js (GitHub API Proxy, Scoring Logic)
- **Utilities**: Axios, React Router, React Icons

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- A GitHub Account (for API token)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/github-portfolio-analyzer.git
    cd github-portfolio-analyzer
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **(Recommended) Configure GitHub Token**
    To avoid rate limits (60 req/hr), add your Personal Access Token:
    - Create a `.env` file in the root.
    - Add: `GITHUB_TOKEN=ghp_your_token_here`

4.  **Run the App**
    Starts both the frontend (Vite) and backend (Express) concurrently.
    ```bash
    npm run dev
    ```

5.  **View it**
    Open `http://localhost:5173` in your browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License
