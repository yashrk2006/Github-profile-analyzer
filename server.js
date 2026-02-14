
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const HEADERS = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Static Files (Frontend)
app.use(express.static(path.join(__dirname, 'dist')));

// Scoring Weights
const WEIGHTS = {
    documentation: 0.20,
    codeStructure: 0.15,
    activity: 0.20,
    organization: 0.15,
    impact: 0.15,
    technical: 0.15
};

// Helper: Fetch with better error handling
const fetchGitHub = async (url) => {
    try {
        const response = await axios.get(url, { headers: HEADERS });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) return null;
        throw error;
    }
};

// Helper: Calculate Documentation Score
const calculateDocScore = (repo) => {
    let score = 0;
    if (repo.description) score += 20;
    if (repo.homepage) score += 10;
    if (repo.has_wiki) score += 5;
    return Math.min(score, 100);
};

// Helper: Calculate Activity Score (simplified)
const calculateActivityScore = (events) => {
    if (!events || events.length === 0) return 0;
    const days = new Set(events.map(e => e.created_at.split('T')[0])).size;
    return Math.min((days / 10) * 100, 100);
};

// Helper: Calculate Repo Impact
const calculateImpactScore = (repo) => {
    let score = 0;
    score += repo.stargazers_count * 5;
    score += repo.forks_count * 10;
    score += repo.watchers_count * 2;
    return Math.min(score, 100);
};

// AI Analyzer
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Helper: AI Analysis
const analyzeWithGemini = async (profile, repos, languages) => {
    if (!genAI) return null;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `
        Analyze this GitHub profile for a recruiter.
        Profile: ${profile.name} (${profile.login}), Bio: ${profile.bio || "None"}, Repos: ${repos.length}, Top Langs: ${Object.keys(languages).slice(0, 5).join(', ')}.
        Top Repos: ${repos.slice(0, 3).map(r => r.name + ": " + (r.description || "No desc")).join('; ')}.
        
        Provide a JSON response with these fields:
        {
            "professional_summary": "A 2-sentence polished bio highlighting their strengths and tech stack mastery. Write in third person.",
            "recruiter_tip": "A one-sentence actionable tip for a recruiter looking at this profile (e.g., 'Strong fit for frontend roles due to React focus').",
            "key_strength": "The single most impressive thing about this profile (e.g., 'Consistent open source contributor').",
             "recommendations": [
                { "type": "critical", "title": "Short Title", "text": "Actionable advice" },
                { "type": "info", "title": "Short Title", "text": "Actionable advice" }
            ]
        }
        Return ONLY valid JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        // Clean up markdown code blocks if present
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Analysis Failed:", error.message);
        return null; // Fallback to standard analysis
    }
};

// Core Analyzer
app.get('/api/analyze/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Concurrent Fetching
        // Concurrent Fetching
        const [userProfile, repos, eventsPage1, eventsPage2] = await Promise.all([
            fetchGitHub(`https://api.github.com/users/${username}`),
            fetchGitHub(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`).catch(() => []),
            fetchGitHub(`https://api.github.com/users/${username}/events/public?per_page=100&page=1`).catch(() => []),
            fetchGitHub(`https://api.github.com/users/${username}/events/public?per_page=100&page=2`).catch(() => [])
        ]);

        const events = [...(eventsPage1 || []), ...(eventsPage2 || [])];

        if (!userProfile) return res.status(404).json({ error: 'User not found' });

        // Analysis Variables
        let totalStars = 0;
        let totalForks = 0;
        let languages = {};
        let repoScores = [];

        // Dimension Aggregators
        let docScores = [];
        let impactScores = [];

        // Process Repos
        for (const repo of repos) {
            if (repo.fork) continue;

            totalStars += repo.stargazers_count;
            totalForks += repo.forks_count;

            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }

            // Dimension Scoring (Per Repo)
            const doc = calculateDocScore(repo);
            const impact = calculateImpactScore(repo);
            const struct = 50;

            let repoScore = (doc * 0.4) + (impact * 0.4) + (struct * 0.2);

            docScores.push(doc);
            impactScores.push(impact);

            repoScores.push({
                name: repo.name,
                description: repo.description,
                language: repo.language,
                stars: repo.stargazers_count,
                updated_at: repo.updated_at,
                scores: { doc, impact },
                overall: Math.round(repoScore)
            });
        }

        // Sort repos by score
        repoScores.sort((a, b) => b.overall - a.overall);

        // Calculate Aggregate Scores
        const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

        // Dynamic Code Structure Score (Based on language diversity and repo size)
        const avgSize = repos.length ? repos.reduce((a, r) => a + r.size, 0) / repos.length : 0;
        const structureScore = Math.min(
            (Object.keys(languages).length * 10) +  // Diversity bonus
            (avgSize > 1000 ? 20 : 0) +             // Serious project bonus
            (repos.some(r => r.has_pages) ? 10 : 0) + // Deployment bonus
            (repos.some(r => r.topics && r.topics.length > 0) ? 20 : 0) + // Tagging bonus
            20, // Base
            100
        );

        const scores = {
            documentation: Math.round(avg(docScores)) || 0,
            codeStructure: Math.round(structureScore),
            activity: Math.round(calculateActivityScore(events)),
            organization: (userProfile.bio ? 20 : 0) + (userProfile.location ? 10 : 0) + (userProfile.blog ? 20 : 0) + (userProfile.email ? 10 : 0) + (userProfile.company ? 20 : 0) + (userProfile.twitter_username ? 10 : 0),
            impact: Math.min(Math.round(avg(impactScores) + (userProfile.followers * 2)), 100),
            technical: Math.min(Object.keys(languages).length * 15, 100)
        };

        // Overall Score with smoother weighting
        const overallScore = Math.round(
            (scores.documentation * 0.25) +
            (scores.codeStructure * 0.15) +
            (scores.activity * 0.25) + // Increased weight for activity
            (scores.organization * 0.10) +
            (scores.impact * 0.15) +
            (scores.technical * 0.10)
        );
        const strengths = [];
        const redFlags = [];

        // 1. Analyze Strengths (More Real/Granular)
        const accountAgeYears = (new Date() - new Date(userProfile.created_at)) / (1000 * 60 * 60 * 24 * 365);
        const hasPullRequests = events.some(e => e.type === 'PullRequestEvent');
        const bestRepoStars = Math.max(...repoScores.map(r => r.stars), 0);

        if (scores.documentation > 80) strengths.push({ icon: 'FaBook', text: 'Documentation Pro' });
        if (scores.impact > 70 || totalStars > 50) strengths.push({ icon: 'FaStar', text: 'High Impact' });
        if (scores.activity > 80) strengths.push({ icon: 'FaFire', text: 'Consistent Shipper' });
        if (Object.keys(languages).length >= 4) strengths.push({ icon: 'FaCode', text: 'Polyglot' });
        if (userProfile.followers > 50) strengths.push({ icon: 'FaUsers', text: 'Community Leader' });
        if (accountAgeYears > 3) strengths.push({ icon: 'FaLaptop', text: 'Veteran Developer' });
        if (hasPullRequests) strengths.push({ icon: 'FaCodeBranch', text: 'Open Source Contributor' }); // Need to import icon or map 'default'
        if (bestRepoStars > 20) strengths.push({ icon: 'FaRocket', text: 'Creator of Popular Hits' });

        // Fallback strength if empty
        if (strengths.length === 0) strengths.push({ icon: 'FaLaptop', text: 'Rising Developer' });

        // 2. Analyze Red Flags (More specific)
        const recentActivity = events.length > 0;
        const averageRepoAgeDays = repoScores.length > 0
            ? repoScores.reduce((acc, r) => acc + (new Date() - new Date(r.updated_at)), 0) / repoScores.length / (1000 * 60 * 60 * 24)
            : 0;

        if (scores.documentation < 30) redFlags.push({ icon: 'FaExclamationTriangle', text: 'Missing Docs' });
        if (!recentActivity || scores.activity < 20) redFlags.push({ icon: 'FaRegCalendarTimes', text: 'Ghost Town Activity' });
        if (totalStars < 2 && accountAgeYears > 1) redFlags.push({ icon: 'FaRegSadTear', text: 'Low Engagement' });
        if (Object.keys(languages).length === 1 && repoScores.length > 2) redFlags.push({ icon: 'FaLayerGroup', text: 'Single Language Limit' });
        if (userProfile.following === 0 && userProfile.followers < 5) redFlags.push({ icon: 'FaUserSlash', text: 'Solo Player' }); // Need map for FaUserSlash? checking frontend
        if (averageRepoAgeDays > 365) redFlags.push({ icon: 'FaHistory', text: 'Legacy/Stale Code' });
        if (!userProfile.bio && !userProfile.location && !userProfile.company) redFlags.push({ icon: 'FaGhost', text: 'Ghost Profile' });

        // Recommendations Logic (Initialize array before use if not already)
        let recommendations = [];

        // Check scores before pushing
        if (scores.documentation < 50) recommendations.push({
            type: 'critical',
            title: 'Improve Documentation',
            text: 'Many repositories lack descriptions or READMEs. Add a detailed README.md to your pinned projects to explain what they do.'
        });
        if (scores.activity < 40) recommendations.push({
            type: 'warning',
            title: 'Inconsistent Activity',
            text: 'Recruiters look for consistency. Try to commit code at least a few times a week rather than in bursts.'
        });
        if (Object.keys(languages).length < 2) recommendations.push({
            type: 'info',
            title: 'Expand Tech Stack',
            text: 'You seem to stick to one language. Try building a small project in a different language to show versatility.'
        });

        // Fix: Ensure bio check handles null/undefined safely
        if (!userProfile.bio) recommendations.push({
            type: 'easy-win',
            title: 'Add a Bio',
            text: 'Your profile lacks a bio. Write a short professional summary of who you are and what you do.'
        });

        // --- AI ENHANCEMENT ---
        // If AI key exists, try to get deeper insights
        let aiInsights = null;
        if (process.env.GEMINI_API_KEY) {
            aiInsights = await analyzeWithGemini(userProfile, repoScores, languages);

            if (aiInsights) {
                // If AI succeeded, we can merge or replace specific data
                // For now, let's append AI recommendations to the top of standard ones
                if (aiInsights.recommendations) {
                    recommendations = [...aiInsights.recommendations, ...recommendations];
                }
            }
        }

        res.json({
            username: userProfile.login,
            profile: {
                avatar: userProfile.avatar_url,
                name: userProfile.name,
                bio: aiInsights?.professional_summary || userProfile.bio, // Use AI bio if available
                location: userProfile.location,
                followers: userProfile.followers,
                public_repos: userProfile.public_repos,
                twitter_username: userProfile.twitter_username, // Added for frontend
                company: userProfile.company, // Added for frontend
                following: userProfile.following // Added for frontend
            },
            scores: {
                overall: overallScore,
                breakdown: scores
            },
            repos: repoScores, // Return ALL sorted repos
            languages,
            strengths,
            redFlags,
            recommendations: recommendations.slice(0, 4), // Limit to top 4
            events: events.slice(0, 100), // Return top 100 events for heatmap
            ai_insight: aiInsights // Pass full AI object for frontend to use if needed
        });

    } catch (error) {
        console.error('SERVER ERROR:', error.message);

        // Handle Rate Limiting specifically
        if (error.response && (error.response.status === 403 || error.response.status === 429)) {
            return res.status(403).json({
                error: 'GitHub API Rate Limit Exceeded. Please try again later or add a GITHUB_TOKEN to .env.'
            });
        }

        // Handle other specific errors if needed
        res.status(500).json({ error: 'Failed to analyze profile. Please check the username or try again later.' });
    }
});

// SPA Fallback (Must be after API routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server (Run if executed directly)
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;
