import { config } from 'dotenv';
config();

import '@/ai/flows/categorize-reported-issues.ts';
import '@/ai/flows/summarize-issue-descriptions.ts';