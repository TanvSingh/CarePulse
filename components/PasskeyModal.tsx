'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './PasskeyModal.css';
import Image from 'next/image';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { decryptKey, encryptKey } from '@/lib/utils';

const PasskeyModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const encryptedKey =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('accessKey')
      : null;

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);

    if (path) {
      if (path.startsWith('/admin')) {
        // stay only if accessKey is correct, otherwise redirect to home
        if (accessKey !== process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
          localStorage.removeItem('accessKey');
          router.replace('/');
        }
      } else if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        // if already verified and not on admin, let them click manually
        setIsOpen(false);
      }
    }
  }, [encryptedKey, path, router]);

  const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const adminKey = process.env.NEXT_PUBLIC_ADMIN_PASSKEY;
    if (!adminKey) {
      console.warn('Admin passkey environment variable is missing.');
    }

    if (passkey === adminKey) {
      const encrypted = encryptKey(passkey);
      localStorage.setItem('accessKey', encrypted);
      setIsOpen(false);

      setTimeout(() => {
        router.push('/admin');
      }, 200);
    } else {
      setError('Invalid passkey. Please try again.');
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setPasskey('');
    setError('');
  };

  return (
    <>
      <button className="open-passkey-button" onClick={() => setIsOpen(true)}>
        Admin
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Image
                src="/assets/icons/close.svg"
                alt="close"
                width={20}
                height={20}
                onClick={closeModal}
                className="cursor-pointer"
              />
            </div>

            <div className="modal-header">
              <h2>Admin Access Verification</h2>
            </div>

            <div className="modal-description">
              To access the admin page, please enter the 6-digit OTP.
            </div>

            <div>
              <InputOTP maxLength={6} value={passkey} onChange={setPasskey}>
                <InputOTPGroup className="shad-otp">
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      className="shad-otp-slot"
                      index={index}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
            </div>

            <div className="modal-footer">
              <button
                className="modal-button cancel-button"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="modal-button continue-button"
                onClick={validatePasskey}
                disabled={passkey.length !== 6}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PasskeyModal;
