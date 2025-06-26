'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ScheduleModal from '@/components/ScheduleModal';
import './Admin.css';

interface Appointment {
  id: string;
  status: 'scheduled' | 'pending' | 'cancelled';
  patient: { name: string };
  doctorName: string;
  schedule: string;
}

const Admin = () => {
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getData = async (): Promise<Appointment[]> => [
      {
        id: '1',
        status: 'scheduled',
        patient: { name: 'Tanveer Singh' },
        doctorName: 'Dr. Green',
        schedule: new Date().toISOString(),
      },
      {
        id: '2',
        status: 'pending',
        patient: { name: 'Aanya Patel' },
        doctorName: 'Dr. Cruz',
        schedule: new Date(Date.now() + 3600 * 1000).toISOString(),
      },
      {
        id: '3',
        status: 'cancelled',
        patient: { name: 'Ravi Mehra' },
        doctorName: 'Dr. Sharma',
        schedule: new Date(Date.now() + 7200 * 1000).toISOString(),
      },
      {
        id: '4',
        status: 'pending',
        patient: { name: 'Meera Joshi' },
        doctorName: 'Dr. Kapoor',
        schedule: new Date(Date.now() + 10800 * 1000).toISOString(),
      },
      {
        id: '5',
        status: 'pending',
        patient: { name: 'Rajiv Rathi' },
        doctorName: 'Dr. Banerjee',
        schedule: new Date(Date.now() + 14400 * 1000).toISOString(),
      },
    ];
    getData().then(setAppointments);
  }, []);

  const updateAppointmentStatus = (id: string, newStatus: 'scheduled' | 'cancelled') => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status: newStatus } : appt))
    );
    setIsModalOpen(false);
  };

  const openScheduleModal = (id: string, doctor: string) => {
    setSelectedId(id);
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const counts = {
    scheduled: appointments.filter((a) => a.status === 'scheduled').length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <Link href="/" className="admin-logo" onClick={() => router.push('/') }>
          <Image src="/assets/icons/logo-full.svg" alt="Logo" width={140} height={32} />
        </Link>
        <h2 className="admin-title">Admin Dashboard</h2>
        <button className="btn-exit" onClick={() => router.push('/')}>Exit</button>
      </header>

      <div className="welcome-section">
        <h1 className="welcome-title">
          Welcome <span className="emoji">👋</span>
        </h1>
        <p className="welcome-subtext">Start the day with managing new appointments</p>

        <div className="stat-cards">
          <div className="stat-card">📅 Scheduled: {counts.scheduled}</div>
          <div className="stat-card">⏳ Pending: {counts.pending}</div>
          <div className="stat-card">⚠️ Cancelled: {counts.cancelled}</div>
        </div>
      </div>

      <div className="table-section">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Status</th>
              <th>Appointment</th>
              <th>Doctor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, index) => (
              <tr key={appt.id}>
                <td>{index + 1}</td>
                <td>{appt.patient.name}</td>
                <td className={`status-${appt.status}`}>{appt.status}</td>
                <td>{new Date(appt.schedule).toLocaleString()}</td>
                <td>{appt.doctorName}</td>
                <td>
                  {appt.status === 'scheduled' ? (
                    <button className="btn scheduled" disabled>Already Scheduled</button>
                  ) : (
                    <button
                      className="btn schedule"
                      onClick={() => openScheduleModal(appt.id, appt.doctorName)}
                    >
                      Schedule
                    </button>
                  )}
                  <button
                    className="btn cancel"
                    onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ScheduleModal
        isOpen={isModalOpen}
        doctorName={selectedDoctor}
        onClose={() => setIsModalOpen(false)}
        onSchedule={() => updateAppointmentStatus(selectedId, 'scheduled')}
      />
    </div>
  );
};

export default Admin;
