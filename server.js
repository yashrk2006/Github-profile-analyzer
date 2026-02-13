
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const HEADERS = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Core Analyzer
app.get('/api/analyze/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Concurrent Fetching
        const [userProfile, repos, events] = await Promise.all([
            fetchGitHub(`https://api.github.com/users/${username}`),
            fetchGitHub(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`).catch(() => []),
            fetchGitHub(`https://api.github.com/users/${username}/events/public?per_page=30`).catch(() => [])
        ]);

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
        repoScores.sort((a, b) => b.overall - a.overall).slice(0, 6);

        // Calculate Aggregate Scores
        const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

        const scores = {
            documentation: Math.round(avg(docScores)) || 0,
            codeStructure: 60,
            activity: Math.round(calculateActivityScore(events)),
            organization: userProfile.bio ? 80 : 40,
            impact: Math.min(Math.round(avg(impactScores) + (userProfile.followers * 2)), 100),
            technical: Math.min(Object.keys(languages).length * 15, 100)
        };

        // Overall Score
        const overallScore = Math.round(
            (scores.documentation * WEIGHTS.documentation) +
            (scores.codeStructure * WEIGHTS.codeStructure) +
            (scores.activity * WEIGHTS.activity) +
            (scores.organization * WEIGHTS.organization) +
            (scores.impact * WEIGHTS.impact) +
            (scores.technical * WEIGHTS.technical)
        );

        // Recommendations Logic
        const recommendations = [];
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
        if (userProfile.bio === null) recommendations.push({
            type: 'easy-win',
            title: 'Add a Bio',
            text: 'Your profile lacks a bio. Write a short professional summary of who you are and what you do.'
        });

        res.json({
            username: userProfile.login,
            profile: {
                avatar: userProfile.avatar_url,
                name: userProfile.name,
                bio: userProfile.bio,
                location: userProfile.location,
                followers: userProfile.followers,
                public_repos: userProfile.public_repos
            },
            scores: {
                overall: overallScore,
                breakdown: scores
            },
            repos: repoScores.slice(0, 6),
            languages,
            recommendations
        });

    } catch (error) {
        console.error('Analysis error:', error.message);
        res.status(500).json({ error: 'Failed to analyze profile' });
    }
});

// Start Server (Only in dev or if not running as serverless)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;
