import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID!;
const toPhone = process.env.TWILIO_VERIFIED_NUMBER!;

export const sendOTP = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const msg = `🔐 Your OTP for appointment confirmation is: ${otp}`;

  try {
    await client.messages.create({
      body: msg,
      messagingServiceSid: messagingServiceSid, // ✅ fixed here
      to: toPhone,
    });

    return otp;
  } catch (error: any) {
    console.error('❌ OTP Send Error:', error?.message || error);
    throw error;
  }
};
