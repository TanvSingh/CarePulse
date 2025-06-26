import { NextResponse } from 'next/server';
import sdk from 'node-appwrite';

const client = new sdk.Client()
  .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
  .setProject(process.env.PROJECT_ID!)
  .setKey(process.env.API_KEY!);

const users = new sdk.Users(client);

export async function POST(req: Request) {
  const { name, email, phone } = await req.json();

  try {
    const user = await users.create(sdk.ID.unique(), email, phone, undefined, name);
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
