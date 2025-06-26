// lib/appwrite.client.ts
import { Client, Databases, Storage } from "appwrite";

// ✅ Only use public env vars on the client
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!endpoint || !projectId) {
  throw new Error("Missing Appwrite client config: check NEXT_PUBLIC_* vars.");
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

export const databases = new Databases(client);
export const storage = new Storage(client);
