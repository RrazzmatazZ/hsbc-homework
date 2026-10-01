"use client";

import { useId, useState } from "react";

import type { PropertyFieldDefinition } from "@/lib/property-fields";

type PropertyInputProps = PropertyFieldDefinition & {
  defaultValue?: number;
  containerClassName?: string;
  inputClassName?: string;
};

function getValidationMessage(input: HTMLInputElement, label: string) {
  const { validity } = input;

  if (validity.valueMissing) return `${label} is required.`;
  if (validity.badInput) return `${label} must be a number.`;
  if (validity.rangeUnderflow) return `${label} must be at least ${input.min}.`;
  if (validity.rangeOverflow) return `${label} must be no more than ${input.max}.`;
  if (validity.stepMismatch) return `${label} must use increments of ${input.step}.`;

  return "";
}

export function PropertyInput({
  name,
  label,
  placeholder,
  min,
  max,
  step,
  defaultValue,
  containerClassName = "",
  inputClassName = "",
}: PropertyInputProps) {
  const generatedId = useId();
  const inputId = `${name}-${generatedId}`;
  const errorId = `${inputId}-error`;
  const [error, setError] = useState("");

  function validate(input: HTMLInputElement) {
    setError(getValidationMessage(input, label));
  }

  return (
    <div className={containerClassName}>
      <label htmlFor={inputId} className="item-title form-label">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        type="number"
        required
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        onBlur={(event) => validate(event.currentTarget)}
        onChange={(event) => {
          if (error) validate(event.currentTarget);
        }}
        onInvalid={(event) => {
          event.preventDefault();
          validate(event.currentTarget);
        }}
        className={`form-control ${inputClassName}`}
      />
      {error ? (
        <p id={errorId} role="alert" className="form-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
