import { cn } from "@/lib/utils";
import * as React from "react";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  unit?: string;
}

export const NumberField = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ label, hint, unit, className, id, ...props }, ref) => {
    const reactId = React.useId();
    const fieldId = id ?? reactId;
    return (
      <div className="space-y-1.5">
        <label htmlFor={fieldId} className="field-label flex items-baseline justify-between gap-2">
          <span>{label}</span>
          {hint ? <span className="text-[11px] text-muted-foreground/80 font-normal">{hint}</span> : null}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={fieldId}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            pattern="[0-9.,\-]*"
            className={cn("field-input pr-14 font-mono-num", className)}
            {...props}
          />
          {unit ? (
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
              {unit}
            </span>
          ) : null}
        </div>
      </div>
    );
  }
);
NumberField.displayName = "NumberField";

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  options: { value: string | number; label: string }[];
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, hint, options, className, id, ...props }, ref) => {
    const reactId = React.useId();
    const fieldId = id ?? reactId;
    return (
      <div className="space-y-1.5">
        <label htmlFor={fieldId} className="field-label flex items-baseline justify-between gap-2">
          <span>{label}</span>
          {hint ? <span className="text-[11px] text-muted-foreground/80 font-normal">{hint}</span> : null}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            className={cn("field-input appearance-none pr-9", className)}
            {...props}
          >
            {options.map((o) => (
              <option key={String(o.value)} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            viewBox="0 0 20 20" fill="currentColor" aria-hidden
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    );
  }
);
SelectField.displayName = "SelectField";
