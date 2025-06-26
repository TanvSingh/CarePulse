// lib/appwrite.server.ts
import * as sdk from 'node-appwrite';

const client = new sdk.Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
  .setProject(process.env.PROJECT_ID!)
  .setKey(process.env.API_KEY!);

export const databases = new sdk.Databases(client);
