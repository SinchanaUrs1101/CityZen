'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { findUserByEmail, createUser as createNewUser, createIssue as createNewIssue, updateIssueStatus as updateStatus } from './data';
import { createSession, deleteSession } from './session';
import { categorizeReportedIssue } from '@/ai/flows/categorize-reported-issues';
import { summarizeIssueDescription } from '@/ai/flows/summarize-issue-descriptions';
import type { User, IssueStatus } from './definitions';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function authenticate(_prevState: string | undefined, formData: FormData) {
  try {
    const parsed = loginSchema.parse(Object.fromEntries(formData.entries()));
    const user = await findUserByEmail(parsed.email);

    if (!user || user.password !== parsed.password) {
      return 'Invalid email or password.';
    }

    const { password, ...userSessionData } = user;
    await createSession(userSessionData);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return 'Invalid form data.';
    }
    return 'An unexpected error occurred.';
  }
  redirect('/dashboard');
}

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['citizen', 'admin']),
});

export async function signUp(_prevState: string | undefined, formData: FormData) {
    try {
        const parsed = signupSchema.parse(Object.fromEntries(formData.entries()));

        const existingUser = await findUserByEmail(parsed.email);
        if (existingUser) {
            return 'A user with this email already exists.';
        }

        const newUser = await createNewUser({
            name: parsed.name,
            email: parsed.email,
            password: parsed.password,
            role: parsed.role,
        });

        const { password, ...userSessionData } = newUser;
        await createSession(userSessionData);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return 'Invalid form data.';
        }
        return 'An unexpected error occurred.';
    }
    redirect('/dashboard');
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}


const reportIssueSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    location: z.string().min(3, "Location is required"),
    userId: z.string().optional(),
    userName: z.string().optional(),
});

export async function reportIssue(_prevState: string | undefined, formData: FormData) {
    try {
        const parsed = reportIssueSchema.parse(Object.fromEntries(formData.entries()));
        
        // AI Categorization
        const { category } = await categorizeReportedIssue({ issueDescription: parsed.description });
        
        // AI Summarization
        const { summary } = await summarizeIssueDescription({ issueDescription: parsed.description });

        await createNewIssue({
            title: parsed.title,
            description: parsed.description,
            summary: summary,
            category: category,
            status: 'Reported',
            location: parsed.location,
            userId: parsed.userId || '0',
            userName: parsed.userName || 'Anonymous',
            // imageUrl will be handled separately in a real app
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return `Invalid form data. ${error.errors.map(e => e.message).join(', ')}`;
        }
        console.error(error);
        return 'An unexpected error occurred while reporting the issue.';
    }

    revalidatePath('/dashboard');
    redirect('/dashboard');
}

export async function updateIssueStatus(issueId: string, status: IssueStatus, notes?: string) {
    try {
        await updateStatus(issueId, status, notes);
    } catch (error) {
        return 'Failed to update status.';
    }
    revalidatePath('/dashboard');
    revalidatePath(`/issues/${issueId}`);
}
