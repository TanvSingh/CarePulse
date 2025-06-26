import { NextResponse } from 'next/server';
import { sendOTP } from '@/lib/twilio';

export async function POST() {
  try {
    const otp = await sendOTP();
    return NextResponse.json({ success: true, otp });
  } catch (error: any) {
    console.error('🔴 Twilio Error:', error?.message || error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to send OTP' }, { status: 500 });
  }
}