import type { User, Issue, IssueStatus, IssueCategory, DefaultIssueType, IssueUpdate } from './definitions';
import { query } from './db';

// Fallback in-memory store when DATABASE_URL is not provided (development)
let users: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@cityzen.app', password: 'password', role: 'admin' },
    { id: '2', name: 'Citizen Kane', email: 'citizen@cityzen.app', password: 'password', role: 'citizen' },
];

let issues: Issue[] = [];

const hasDb = !!process.env.DATABASE_URL;

// If DB is present, developer should create tables (see README). We attempt DB operations when configured.

// User Functions
export async function findUserByEmail(email: string): Promise<User | undefined> {
    if (hasDb) {
        const res = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
        return res.rows[0] as User | undefined;
    }
    return users.find(user => user.email === email);
}

export async function createUser(userData: Omit<User, 'id'>): Promise<User> {
    if (hasDb) {
        const res = await query(
            `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`,
            [userData.name, userData.email, userData.password, userData.role]
        );
        return res.rows[0] as User;
    }
    const newUser: User = {
        id: (users.length + 1).toString(),
        ...userData
    };
    users.push(newUser);
    return newUser;
}

export async function findUserById(id: string): Promise<User | undefined> {
    if (hasDb) {
        const res = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
        return res.rows[0] as User | undefined;
    }
    return users.find(user => user.id === id);
}

// Issue Functions
export async function getIssues(userId?: string): Promise<Issue[]> {
    if (hasDb) {
        if (userId) {
            const res = await query('SELECT * FROM issues WHERE userId = $1 ORDER BY createdAt DESC', [userId]);
            return res.rows as Issue[];
        }
        const res = await query('SELECT * FROM issues ORDER BY createdAt DESC');
        return res.rows as Issue[];
    }
    if (userId) {
        return issues.filter(issue => issue.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return [...issues].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getIssueById(issueId: string): Promise<Issue | undefined> {
    if (hasDb) {
        const res = await query('SELECT * FROM issues WHERE id = $1 LIMIT 1', [issueId]);
        return res.rows[0] as Issue | undefined;
    }
    return issues.find(issue => issue.id === issueId);
}

export async function createIssue(issueData: Omit<Issue, 'id' | 'createdAt' | 'updates'>): Promise<Issue> {
    const now = new Date().toISOString();
    if (hasDb) {
        const updates = JSON.stringify([{ timestamp: now, status: 'Reported' }]);
        const res = await query(
            `INSERT INTO issues (title, description, summary, category, status, location, imageUrl, imageHint, userId, userName, createdAt, updates)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [issueData.title, issueData.description, issueData.summary, issueData.category, issueData.status, issueData.location, issueData.imageUrl || null, issueData.imageHint || null, issueData.userId, issueData.userName, now, updates]
        );
        return res.rows[0] as Issue;
    }

    const newIssue: Issue = {
        id: (issues.length + 1).toString(),
        createdAt: now,
        updates: [{ timestamp: now, status: 'Reported' }],
        ...issueData
    };
    issues.unshift(newIssue);
    return newIssue;
}

export async function updateIssueStatus(issueId: string, status: IssueStatus, notes?: string): Promise<Issue | undefined> {
    if (hasDb) {
        const now = new Date().toISOString();
        // append to updates JSONB array and set status
        const res = await query(
            `UPDATE issues SET status = $1, updates = COALESCE(updates, '[]'::jsonb) || $2 WHERE id = $3 RETURNING *`,
            [status, JSON.stringify({ timestamp: now, status, ...(notes ? { notes } : {}) }), issueId]
        );
        return res.rows[0] as Issue | undefined;
    }

    const issueIndex = issues.findIndex(issue => issue.id === issueId);
    if (issueIndex > -1) {
        const newUpdate: IssueUpdate = {
            timestamp: new Date().toISOString(),
            status,
            ...(notes && { notes })
        };
        issues[issueIndex].status = status;
        issues[issueIndex].updates.push(newUpdate);
        return issues[issueIndex];
    }
    return undefined;
}
