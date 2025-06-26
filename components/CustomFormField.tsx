'use client';

import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { FormFieldType } from "./forms/PatientForm";
import { Checkbox } from "@/components/ui/checkbox";
import "./FormField.css";

import PhoneInput, { E164Number } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Textarea } from "./ui/textarea";

interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const {
    fieldType,
    iconSrc,
    iconAlt,
    placeholder,
    disabled,
    showTimeSelect,
    dateFormat,
    renderSkeleton,
  } = props;

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <FormControl>
          <div className="flex items-center gap-2 border border-gray-700 px-3 py-2 rounded-lg bg-[#1a1a1a]">
            {iconSrc && (
              <Image
                src={iconSrc}
                alt={iconAlt || "icon"}
                width={20}
                height={20}
                className="w-5 h-5"
              />
            )}
            <Input
              {...field}
              placeholder={placeholder || "Enter text here"}
              disabled={disabled}
              className="bg-transparent text-white placeholder-gray-400 border-none focus:ring-0 focus:ring-offset-0"
            />
          </div>
        </FormControl>
      );

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      );

    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            {...field}
            defaultCountry="IN"
            placeholder={placeholder || "Enter phone number"}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="w-full px-3 py-2 text-white bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none placeholder-gray-400"
          />
        </FormControl>
      );

    case FormFieldType.DATE_PICKER:
      return (
        <FormControl>
          <div className="flex items-center gap-2 border border-gray-700 px-3 py-2 rounded-lg bg-[#1a1a1a]">
            <Image
              src="/assets/icons/calendar.svg"
              height={20}
              width={20}
              alt="calendar"
              className="w-5 h-5"
            />
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat={dateFormat ?? "MM/dd/yyyy"}
              showTimeSelect={showTimeSelect ?? false}
              className="w-full bg-transparent text-white focus:outline-none placeholder-gray-400"
            />
          </div>
        </FormControl>
      );

    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-full bg-[#1a1a1a] text-white border border-gray-700 rounded-lg">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="shad-select-content">
              {React.Children.map(props.children, (child) =>
                React.isValidElement(child) && child.type === SelectItem
                  ? React.cloneElement(child, {
                      className: `shad-select-item ${child.props.className || ""}`,
                    })
                  : child
              )}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldType.GENDER_RADIO:
      return (
        <FormControl>
          <div className="flex gap-6 mt-2 text-white">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Male"
                checked={field.value === "Male"}
                onChange={() => field.onChange("Male")}
                className="accent-blue-500"
              />
              Male
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Female"
                checked={field.value === "Female"}
                onChange={() => field.onChange("Female")}
                className="accent-pink-500"
              />
              Female
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Other"
                checked={field.value === "Other"}
                onChange={() => field.onChange("Other")}
                className="accent-purple-500"
              />
              Other
            </label>
          </div>
        </FormControl>
      );

    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;

    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );

    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="form-item">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="form-label">{label}</FormLabel>
          )}
          <RenderField field={field} props={props} />
          <FormMessage className="form-message" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
