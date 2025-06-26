import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ButtonProps {
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
}

const SubmitButton = ({ isLoading = false, className = '', children }: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={`w-full shad-primary-btn ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/assets/icons/loading.svg"
            alt="Loading spinner"
            width={20}
            height={20}
            className="animate-spin"
          />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
