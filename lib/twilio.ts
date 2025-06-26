import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID!;
const toPhone = process.env.TWILIO_VERIFIED_NUMBER!;

export const sendOTP = async (): Promise<number> => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const msg = `🔐 Your OTP for appointment confirmation is: ${otp}`;

  try {
    await client.messages.create({
      body: msg,
      messagingServiceSid: messagingServiceSid,
      to: toPhone,
    });

    return otp;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ OTP Send Error:', error.message);
    } else {
      console.error('❌ OTP Send Error:', error);
    }
    throw error;
  }
};
