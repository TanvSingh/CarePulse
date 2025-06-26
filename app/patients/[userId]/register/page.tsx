'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Doctors } from '@/types/constants';
import { IdentificationTypes } from '@/types/constants';

import { Form } from '@/components/ui/form';
import SubmitButton from '@/components/SubmitButton';
import CustomFormField from '@/components/CustomFormField';
import { FormFieldType } from '@/components/forms/PatientForm';
import { PatientFormValidation } from '@/lib/validation';
import './Register.css';
import { getUser } from '@/lib/actions/patient.actions';
import { FormControl } from '@/components/ui/form';
import { FileUploader } from '@/components/FileUploader';



const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false); 
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      birthDate: undefined,
      gender: '',
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        const userData = await getUser(userId);
        if (userData) {
          setUser(userData);
          form.reset({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            gender: userData.gender || '',
          });
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user');
      }
    };

    fetchUser();
  }, [userId]);

  const onSubmit = async () => {
    router.push(`/new-appointment?userId=${userId}`);
  };
  return (
    <div className="split-container">
      <div className="form-section">
        <div className="form-content">
          <div className="logo-container">
            <Image src="/assets/icons/logo-full.svg" alt="Logo" width={200} height={100} />
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="form-box">
              <section className="section-header">
                <h1>Welcome</h1>
                <p className="text-dark-700">Let us know more about yourself.</p>
              </section>

              {/* Personal Info */}
              <section className="section-header">
                <div className="mb-9 space-y-1">
                  <h2 className="text-dark-700">Personal Information</h2>
                </div>
              </section>

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                iconSrc="/assets/icons/user.svg"
                iconAlt="user"
              />

              <div className="input-row">
                <div className="input-field">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="Enter email address"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="email"
                  />
                </div>
                <div className="input-field">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="phone"
                    label="Phone Number"
                    placeholder="Enter number"
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-field">
                  <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="birthDate"
                    label="Date of Birth"
                  />
                </div>
                <div className="input-field">
                  <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="gender"
                    label="Gender"
                    renderSkeleton={(field) => (
                      <FormControl>
                        <div className="flex gap-6 mt-2 text-white">
                          {["Male", "Female", "Other"].map((option) => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                value={option}
                                checked={field.value === option}
                                onChange={() => field.onChange(option)}
                                className="h-4 w-4 accent-blue-500"
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      </FormControl>
                    )}
                  />
                </div>
              </div>

              {/* Address and Occupation */}
              <div className="input-row">
                <div className="input-field">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="address"
                    label="Address"
                    placeholder="Enter address"
                  />
                </div>
                <div className="input-field">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="occupation"
                    label="Occupation"
                    placeholder="Enter Occupation"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="input-row">
                <div className="input-field">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="emergencyContactName"
                    label="Emergency contact name"
                    placeholder="Guardian's name"
                  />
                </div>
                <div className="input-field">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="emergencyContactNumber"
                    label="Emergency contact number"
                    placeholder="Enter number"
                  />
                </div>
              </div>

              {/* Medical Info */}
              <section className="section-header">
                <div className="mb-9 space-y-1">
                  <h2 className="text-dark-700">Medical Information</h2>
                </div>
              </section>

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"
                label="Primary Physician"
                placeholder="Select a physician"
              >
                <SelectContent className="custom-select-content">
                  {Doctors.map((doctor) => (
                    <SelectItem key={doctor.name} value={doctor.name} className="custom-select-item">
                      <div className="flex items-center gap-2">
                        <Image
                          src={doctor.image}
                          width={24}
                          height={24}
                          alt={doctor.name}
                          className="rounded-full"
                        />
                        <span>{doctor.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </CustomFormField>

              <div className="input-row">
                <div className="input-field">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="insuranceProvider"
                    label="Insurance Provider"
                    placeholder="Enter Insurance"
                  />
                </div>
                <div className="input-field">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="insurancePolicyNumber"
                    label="Insurance policy number"
                    placeholder="Enter number"
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-field">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="allergies"
                    label="Allergies (if any)"
                    placeholder="Enter any allergies"
                  />
                </div>
                <div className="input-field">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="currentMedication"
                    label="Current medication (if any)"
                    placeholder="Enter medication"
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-field">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="familyMedicalHistory"
                    label="Family medical History"
                    placeholder="Enter any"
                  />
                </div>
                <div className="input-field">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="pastMedicalHistory"
                    label="Past Medical History"
                    placeholder="Enter any"
                  />
                </div>
              </div>

              {/* Identification */}
              <section className="section-header">
                <div className="mb-9 space-y-1">
                  <h2 className="text-dark-700">Identification and Verification</h2>
                </div>
              </section>

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="identificationType"
                label="Identification Type"
                placeholder="Select an identification type"
              >
                {IdentificationTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </CustomFormField>

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="identificationNumber"
                label="Identification Number"
                placeholder="Enter number"
              />

              <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="identificationDocument"
                label="Scanned copy of identification document"
                renderSkeleton={() => (
                  <FormControl>
                    <FileUploader />
                  </FormControl>
                )}
              />

              {/* Consent */}
              <section className="section-header">
                <div className="mb-9 space-y-1">
                  <h2 className="text-dark-700">Consent and Privacy</h2>
                </div>
              </section>

              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="treatmentConsent"
                label="I consent to treatment"
              />
              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="disclosureConsent"
                label="I consent to disclosure of information"
              />
              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="privacyConsent"
                label="I consent to privacy policy"
              />

              <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
            </form>
          </Form>
        </div>

        <div className="form-footer">
          <p>© 2024 CarePulse</p>
          <a href="#">Admin</a>
        </div>
      </div>

      <div className="image-section">
        <Image
          src="/assets/images/register-img.png"
          alt="Register"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
    </div>
  );
};

export default RegisterPage;
