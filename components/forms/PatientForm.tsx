'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import Image from "next/image";
import "./PatientForm.css";
import SubmitButton from "../SubmitButton";
import { useState, useEffect } from "react";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { databases } from "@/lib/appwrite.client";
import PasskeyModal from "../PasskeyModal"; // ✅ Imported your existing modal

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phone-input",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datepicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    const getData = async () => {
      const dbId = process.env.NEXT_PUBLIC_DATABASE_ID;
      const collectionId = process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID;

      if (!dbId || !collectionId) {
        console.error("Missing Appwrite env vars:", { dbId, collectionId });
        return;
      }

      try {
        const res = await databases.listDocuments(dbId, collectionId);
        console.log("Fetched patients:", res);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    getData();
  }, []);

  async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    try {
      const userData = { name, email, phone };
      const user = await createUser(userData);
      if (user) router.push(`/patients/${user.$id}/register`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="split-container">
      {/* LEFT FORM SECTION */}
      <div className="form-section">
        <div className="form-content">
          <div className="logo-container">
            <Image
              src="/assets/icons/logo-full.svg"
              alt="Logo"
              width={200}
              height={100}
            />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="form-box">
              <section className="section-header">
                <h1>HI There YooHOOOO!</h1>
                <p className="text-dark-700">Schedule your first appointment.</p>
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

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter email address"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="phone"
                label="Phone Number"
                placeholder="Enter number"
              />

              <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
          </Form>
        </div>

        {/* Footer with Passkey Modal */}
        <div className="form-footer">
          <p>© 2024 CarePulse</p>
          <PasskeyModal /> {/* ✅ Renders your Admin button + modal */}
        </div>
      </div>

      {/* RIGHT IMAGE SECTION */}
      <div className="image-section">
        <Image
          src="/assets/images/onboarding-img.png"
          alt="Doctors"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
    </div>
  );
};

export default PatientForm;
