'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import './NewAppointment.css';
import SubmitButton from '@/components/SubmitButton';
import CustomFormField from '@/components/CustomFormField';
import { Form } from '@/components/ui/form';
import { FormFieldType } from '@/components/forms/PatientForm';
import { Doctors } from '@/types/constants';
import { SelectContent, SelectItem } from '@/components/ui/select';

const formSchema = z.object({
  primaryPhysician: z.string().min(1, 'Please select a doctor'),
  schedule: z.date({ required_error: 'Please select appointment date and time' }),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof formSchema>;

const NewAppointmentForm = ({
  type = 'create',
}: {
  type?: 'create' | 'cancel' | 'schedule';
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryPhysician: '',
      schedule: new Date(),
      reason: '',
      note: '',
      cancellationReason: '',
    },
  });

  const handleSubmit = async (values: AppointmentFormData) => {
    setIsLoading(true);

    setTimeout(() => {
      form.reset();

      const doctor = values.primaryPhysician;
      const datetime = values.schedule.toISOString();

      router.push(
        `/new-appointment/success?doctor=${encodeURIComponent(doctor)}&datetime=${encodeURIComponent(datetime)}`
      );

      setIsLoading(false);
    }, 1000);
  };

  const buttonLabel =
    type === 'cancel'
      ? 'Cancel Appointment'
      : type === 'schedule'
      ? 'Schedule Appointment'
      : 'Create Appointment';

  return (
    <div className="split-container">
      <div className="form-section">
        <div className="form-content">
          <div className="logo-container">
            <Image src="/assets/icons/logo-full.svg" alt="Logo" width={200} height={100} />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="form-box">
              <section className="section-header">
                <h1>New Appointment</h1>
                <p className="text-dark-700">Request a new appointment</p>
              </section>

              {type !== 'cancel' && (
                <>
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="primaryPhysician"
                    label="Doctor"
                    placeholder="Select a Doctor"
                  >
                    <SelectContent className="custom-select-content">
                      {Doctors.map((doctor) => (
                        <SelectItem key={doctor.name} value={doctor.name} className="custom-select-item">
                          <div className="select-item-inner">
                            <Image
                              src={doctor.image}
                              alt={doctor.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                            <span>{doctor.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </CustomFormField>

                  <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="schedule"
                    label="Expected appointment date"
                    showTimeSelect
                    dateFormat="MM/dd/yyyy - h:mm aa"
                  />

                  <div className="field-row">
                    <div className="field-col">
                      <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="reason"
                        label="Reason for appointment"
                        placeholder="Enter reason"
                      />
                    </div>
                    <div className="field-col">
                      <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="note"
                        label="Notes"
                        placeholder="Enter notes"
                      />
                    </div>
                  </div>
                </>
              )}

              {type === 'cancel' && (
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="cancellationReason"
                  label="Reason for Cancellation"
                  placeholder="Enter cancellation reason"
                />
              )}

              <SubmitButton
                isLoading={isLoading}
                className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}
              >
                {buttonLabel}
              </SubmitButton>
            </form>
          </Form>
        </div>

        <div className="form-footer">
          <div className="footer-left">© 2024</div>
          <div className="footer-center">CarePulse</div>
          <div className="footer-right">
            <a href="#">Admin</a>
          </div>
        </div>
      </div>

      <div className="image-section">
        <Image
          src="/assets/images/appointment-img.png"
          alt="Register"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
    </div>
  );
};

export default NewAppointmentForm;
