'use server';

import { Client, Databases, Storage, ID, Users, Query } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { parseStringify } from '../utils';

// Appwrite Setup
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const storage = new Storage(client);
const users = new Users(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
const PATIENT_COLLECTION_ID = process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID!;
const BUCKET_ID = process.env.NEXT_PUBLIC_BUCKET_ID!;
const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID!;

// ========== User Management ==========

export const createUser = async ({
  email,
  phone,
  name,
}: {
  email: string;
  phone: string;
  name: string;
}) => {
  try {
    const userId = ID.unique();

    // ✅ Ensure phone number is in E.164 format (starts with +)
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    // ✅ Strip non-digits from password generation and keep 10 digits
    const password = phone.replace(/\D/g, '').slice(0, 10) + 'Aa!';

    const user = await users.create(userId, email, formattedPhone, password, name);
    return parseStringify(user);
  } catch (error) {
    console.error('❌ Server-side error creating user:', error);
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.error('❌ Server-side error getting user:', error);
    return null;
  }
};

// ========== Patient Management ==========

export const getPatient = async (userId: string) => {
  try {
    const res = await databases.listDocuments(
      DATABASE_ID,
      PATIENT_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );
    return parseStringify(res.documents[0]);
  } catch (error) {
    console.error('❌ Server-side error getting patient:', error);
    return null;
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: {
  identificationDocument?: {
    buffer: Buffer;
    fileName: string;
  };
  [key: string]: any;
}) => {
  try {
    let fileId: string | null = null;
    let fileUrl: string | null = null;

    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument.buffer,
        identificationDocument.fileName
      );
      const uploadedFile = await storage.createFile(BUCKET_ID, ID.unique(), inputFile);
      fileId = uploadedFile.$id;
      fileUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID,
      PATIENT_COLLECTION_ID,
      ID.unique(),
      {
        ...patient,
        identificationDocumentId: fileId,
        identificationDocument: fileUrl,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error('❌ Error registering patient:', error);
    throw error;
  }
};

// Export if needed
export { Storage };
