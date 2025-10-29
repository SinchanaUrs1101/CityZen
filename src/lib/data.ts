import type { User, Issue, IssueStatus, IssueCategory, DefaultIssueType, IssueUpdate } from './definitions';

// In-memory store
let users: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@cityzen.app', password: 'password', role: 'admin' },
    { id: '2', name: 'Citizen Kane', email: 'citizen@cityzen.app', password: 'password', role: 'citizen' },
];

let issues: Issue[] = [
    {
        id: '1',
        title: 'Large Pothole on Main St',
        description: 'There is a very large and dangerous pothole in the middle of Main Street, right in front of the public library. It has already caused damage to several cars. It needs immediate attention before someone gets hurt.',
        summary: 'A large pothole on Main Street near the library is damaging cars and poses a safety risk.',
        category: 'Roads and Highways',
        status: 'Reported',
        location: 'Main Street, near public library',
        imageUrl: 'https://picsum.photos/seed/pothole/600/400',
        imageHint: 'pothole road',
        userId: '2',
        userName: 'Citizen Kane',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updates: [{
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Reported'
        }]
    },
    {
        id: '2',
        title: 'Graffiti on park bench',
        description: 'Someone spray-painted graffiti on one of the new benches in Central Park. It is inappropriate and needs to be cleaned up.',
        summary: 'Inappropriate graffiti on a new bench in Central Park needs removal.',
        category: 'Parks and Recreation',
        status: 'In Progress',
        location: 'Central Park',
        imageUrl: 'https://picsum.photos/seed/graffiti/600/400',
        imageHint: 'graffiti wall',
        userId: '2',
        userName: 'Citizen Kane',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updates: [
            { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'Reported' },
            { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'In Progress', notes: 'Cleanup crew has been assigned.' }
        ]
    },
    {
        id: '3',
        title: 'Overflowing trash can',
        description: 'The trash can at the bus stop on 5th and Elm is completely full and trash is spilling onto the sidewalk.',
        summary: 'Trash can at 5th and Elm bus stop is overflowing.',
        category: 'Waste Management',
        status: 'Resolved',
        location: '5th and Elm',
        imageUrl: 'https://picsum.photos/seed/trash/600/400',
        imageHint: 'overflowing trash',
        userId: '2',
        userName: 'Citizen Kane',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updates: [
            { timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'Reported' },
            { timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), status: 'In Progress' },
            { timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), status: 'Resolved', notes: 'Trash has been collected.' }
        ]
    }
];

// User Functions
export async function findUserByEmail(email: string): Promise<User | undefined> {
    return users.find(user => user.email === email);
}

export async function createUser(userData: Omit<User, 'id'>): Promise<User> {
    const newUser: User = {
        id: (users.length + 1).toString(),
        ...userData
    };
    users.push(newUser);
    return newUser;
}

export async function findUserById(id: string): Promise<User | undefined> {
    return users.find(user => user.id === id);
}

// Issue Functions
export async function getIssues(userId?: string): Promise<Issue[]> {
    if (userId) {
        return issues.filter(issue => issue.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return [...issues].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getIssueById(issueId: string): Promise<Issue | undefined> {
    return issues.find(issue => issue.id === issueId);
}

export async function createIssue(issueData: Omit<Issue, 'id' | 'createdAt' | 'updates'>): Promise<Issue> {
    const now = new Date().toISOString();
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
