import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';

interface StatCardProps {
  type: 'appointments' | 'pending' | 'cancelled';
  count: number;
  label: string;
  icon: string;
}

const StatCard = ({ count = 0, label, icon, type }: StatCardProps) => {
  const iconColor =
    type === 'appointments'
      ? 'text-yellow-400'
      : type === 'pending'
      ? 'text-blue-400'
      : 'text-red-400';

  return (
    <div className="stat-card">
      <Image src={icon} alt={label} width={32} height={32} className={`icon ${iconColor}`} />
      <div className="content">
        <span className="count">{count}</span>
        <span className="label">{label}</span>
      </div>
    </div>
  );
};

export default StatCard;
