'use client';

import { useEffect, useState } from 'react';
import { getPatient } from '@/lib/actions/patient.actions';
import NewAppointmentForm from './page'; // Ensure this is your form component
import { useSearchParams } from 'next/navigation';

interface SearchParamProps {
  params: { userId: string };
  searchParams?: { type?: 'create' | 'cancel' | 'schedule' };
}

export default function NewAppointment({ params }: SearchParamProps) {
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const searchParams = useSearchParams();
  const type = searchParams?.get('type') ?? 'create';

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const fetched = await getPatient(params.userId);
        setPatient(fetched);
      } catch (error) {
        console.error('Error fetching patient:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [params.userId]);

  const handleSendOTP = async () => {
    setSendingOTP(true);
    try {
      const res = await fetch('/api/send-otp', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('✅ OTP sent successfully!');
        setOtpSent(true);
      } else {
        alert('❌ Failed to send OTP.');
      }
    } catch (error) {
      alert('⚠️ Error sending OTP.');
    } finally {
      setSendingOTP(false);
    }
  };

  if (loading) {
    return <div>Loading patient info...</div>;
  }

  if (!patient) {
    return <div>❌ Patient not found.</div>;
  }

  return (
    <div className="new-appointment-container">
      <div className="otp-section" style={{ marginBottom: '1rem' }}>
        <button
          onClick={handleSendOTP}
          disabled={otpSent || sendingOTP}
          style={{
            padding: '8px 16px',
            backgroundColor: otpSent ? 'green' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: otpSent ? 'not-allowed' : 'pointer',
          }}
        >
          {sendingOTP
            ? 'Sending OTP...'
            : otpSent
            ? '✅ OTP Sent'
            : 'Send OTP to Confirm'}
        </button>
      </div>

      <NewAppointmentForm
        userId={params.userId}
        patientId={patient.$id}
        type={type as 'create' | 'cancel' | 'schedule'}
        patient={patient}
      />
    </div>
  );
}
