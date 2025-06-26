'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import './Success.css';
import { CheckCircle2, CalendarDays, User } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();

  const doctor = searchParams.get('doctor');
  const datetime = searchParams.get('datetime');

  const [formattedDate, setFormattedDate] = useState('');
  const [formattedTime, setFormattedTime] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(true);

  useEffect(() => {
    if (datetime) {
      const dateObj = new Date(datetime);
      setFormattedDate(
        dateObj.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      );
      setFormattedTime(
        dateObj.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    }
  }, [datetime]);

  useEffect(() => {
    const sendOTP = async () => {
      try {
        const res = await fetch('/api/send-otp', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          setOtpSent(true);
        } else {
          console.error('OTP failed to send:', data.error);
        }
      } catch (error) {
        console.error('Error sending OTP:', error);
      } finally {
        setOtpLoading(false);
      }
    };

    sendOTP();
  }, []);

  return (
    <div className="success-container">
      <div className="logo">CarePulse</div>

      <div className="success-icon">
        <CheckCircle2 size={72} color="#00e676" />
      </div>

      <h2 className="success-heading">
        Your <span className="highlight">appointment request</span> has been successfully submitted!
      </h2>

      <p className="subtext">We'll be in touch shortly to confirm.</p>

      <div className="details-container">
        <span className="details-label">Requested appointment details:</span>
        <div className="details">
          <span className="doctor-detail">
            <User size={16} /> {doctor}
          </span>
          <span className="datetime-detail">
            <CalendarDays size={16} /> {formattedDate} - {formattedTime}
          </span>
        </div>
      </div>

      <div className="otp-status">
        {otpLoading ? (
          <p className="otp-message">📤 Sending OTP to your registered phone number...</p>
        ) : otpSent ? (
          <p className="otp-message success">✅ OTP sent successfully!</p>
        ) : (
          <p className="otp-message error">❌ Failed to send OTP.</p>
        )}
      </div>
    </div>
  );
}
