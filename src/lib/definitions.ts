export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be sent to client
  role: 'citizen' | 'admin';
};

export const issueCategories = [
  'Roads and Highways',
  'Water and Sewage',
  'Waste Management',
  'Parks and Recreation',
  'Public Safety',
  'Other',
] as const;

export const issueStatuses = ['Reported', 'In Progress', 'Resolved'] as const;

export const defaultIssueTypes = [
    "Pothole",
    "Broken Streetlight",
    "Trash Overflow",
    "Graffiti",
    "Damaged Signage",
    "Water Leak"
] as const;

export type IssueCategory = typeof issueCategories[number];
export type IssueStatus = typeof issueStatuses[number];
export type DefaultIssueType = typeof defaultIssueTypes[number];

export type IssueUpdate = {
  timestamp: string;
  status: IssueStatus;
  notes?: string;
};

export type Issue = {
  id: string;
  title: string;
  description: string;
  summary: string;
  category: IssueCategory;
  status: IssueStatus;
  location: string;
  imageUrl?: string;
  imageHint?: string;
  userId: string;
  userName: string;
  createdAt: string;
  updates: IssueUpdate[];
};
