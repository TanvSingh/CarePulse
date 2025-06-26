'use server';

import { Client, Databases, ID, Query } from 'node-appwrite';
import { parseStringify } from '../utils';
import {
  CancelAppointmentSchema,
  CreateAppointmentSchema,
  ScheduleAppointmentSchema,
} from '../validation';
import { Appointment } from '@/types/appwrite.types';
import { sendSMS } from '../twilio'; // adjust path if different

// Appwrite Setup
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

// ✅ Use private environment variables
const DATABASE_ID = process.env.DATABASE_ID!;
const APPOINTMENT_COLLECTION_ID = process.env.APPOINTMENT_COLLECTION_ID!;

// ========== Appointment Actions ==========

export const createAppointment = async (appointment: {
  userId: string;
  patientId: string;
  name?: string;
  email?: string;
  phone?: string;
  appointmentDate: string;
  appointmentTime: string;
  reason?: string;
  note?: string;
  cancellationReason?: string;
  status: string;
  type: 'create' | 'cancel' | 'schedule';
}) => {
  try {
    const {
      userId,
      patientId,
      name,
      email,
      phone,
      appointmentDate,
      appointmentTime,
      reason,
      note,
      cancellationReason,
      status,
      type,
    } = appointment;

    const appointmentData = {
      userId,
      patientId,
      name,
      email,
      phone,
      date: appointmentDate,
      time: appointmentTime,
      reason,
      note,
      cancellationReason,
      status,
      type,
    };

    const newAppointment = await databases.createDocument(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      ID.unique(),
      appointmentData
    );

    // ✅ Send SMS to verified number
    const smsMessage = `📅 Hello ${name || 'Patient'}, your appointment with our clinic is confirmed on ${appointmentDate} at ${appointmentTime}.`;

    await sendSMS(smsMessage);

    return parseStringify(newAppointment);
  } catch (error) {
    console.error('❌ Error creating appointment:', error);
    throw error;
  }
};


export const getAppointmentsByUser = async (userId: string) => {
  try {
    const res = await databases.listDocuments(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );
    return parseStringify(res.documents);
  } catch (error) {
    console.error('❌ Error fetching appointments:', error);
    return [];
  }
};

export const cancelAppointment = async (appointmentId: string, reason: string) => {
  try {
    const updated = await databases.updateDocument(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      appointmentId,
      {
        status: 'cancelled',
        cancellationReason: reason,
      }
    );
    return parseStringify(updated);
  } catch (error) {
    console.error('❌ Error cancelling appointment:', error);
    throw error;
  }
};

export const updateAppointment = async (
  appointmentId: string,
  data: Partial<{
    appointmentDate: string;
    appointmentTime: string;
    note: string;
    status: string;
    reason: string;
  }>
) => {
  try {
    // Map updated field names to Appwrite schema
    const mappedData: any = {
      ...data,
      ...(data.appointmentDate && { date: data.appointmentDate }),
      ...(data.appointmentTime && { time: data.appointmentTime }),
    };
    delete mappedData.appointmentDate;
    delete mappedData.appointmentTime;

    const updated = await databases.updateDocument(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      appointmentId,
      mappedData
    );

    return parseStringify(updated);
  } catch (error) {
    console.error('❌ Error updating appointment:', error);
    throw error;
  }
};

export const getAllAppointments = async () => {
  try {
    const res = await databases.listDocuments(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      [],
      100
    );
    return parseStringify(res.documents);
  } catch (error) {
    console.error('❌ Error getting all appointments:', error);
    return [];
  }
};

// ✅ Must be async for server action
export async function getAppointmentSchema(type: string) {
  switch (type) {
    case 'create':
      return CreateAppointmentSchema;
    case 'cancel':
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc('$createdAt')]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === 'scheduled') {
          acc.scheduledCount += 1;
        } else if (appointment.status === 'pending') {
          acc.pendingCount += 1;
        } else if (appointment.status === 'cancelled') {
          acc.cancelledCount += 1;
        }

        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.error('Error in getRecentAppointmentList:', error);
    return null;
  }
};