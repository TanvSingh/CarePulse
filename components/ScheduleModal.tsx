'use client';

import React, { useState } from 'react';
import './ScheduleModal.css';

interface ScheduleModalProps {
  isOpen: boolean;
  doctorName: string | null;
  onClose: () => void;
  onSchedule: () => void;
  onCancelAppointment: () => void;
  status: 'scheduled' | 'pending' | 'cancelled';
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  doctorName,
  onClose,
  onSchedule,
  onCancelAppointment,
  status,
}) => {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');

  if (!isOpen) return null;

  const isAlreadyScheduled = status === 'scheduled';

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Schedule Appointment</h2>
        <p>Please fill in the following details to schedule an appointment</p>

        <label>Doctor</label>
        <input
          type="text"
          placeholder="Doctor's Name"
          value={doctorName || ''}
          disabled
        />

        <label>Expected appointment date</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Reason for appointment</label>
        <textarea
          placeholder="e.g. Headache..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <label>Notes</label>
        <textarea
          placeholder="Additional notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {isAlreadyScheduled ? (
          <p className="already-scheduled-msg">Already Scheduled</p>
        ) : (
          <button className="btn-confirm" onClick={onSchedule}>
            Schedule Appointment
          </button>
        )}

        <button className="btn-close" onClick={onCancelAppointment}>
          Cancel Appointment
        </button>
        <button className="btn-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ScheduleModal;
