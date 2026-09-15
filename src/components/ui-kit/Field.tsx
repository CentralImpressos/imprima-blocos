import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <span className="panel-label">{label}</span>
      {children}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <Field label={label} className={className}>
      <input
        className="field-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number | undefined;
  max?: number | undefined;
  suffix?: string | undefined;
}) {
  return (
    <Field label={suffix ? `${label} (${suffix})` : label}>
      <input
        type="number"
        className="field-input"
        value={Number.isFinite(value) ? value : 0}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </Field>
  );
}

export function Check({
  label,
  checked,
  onChange,
  disabled,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange?: ((v: boolean) => void) | undefined;
  disabled?: boolean | undefined;
  hint?: string | undefined;
}) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 py-1 text-xs",
        disabled ? "cursor-not-allowed opacity-80" : "cursor-pointer",
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] border transition-colors",
          checked ? "border-primary bg-primary" : "border-border-strong bg-surface",
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-primary-foreground" aria-hidden>
            <path
              d="M2.5 6.2 4.8 8.5 9.5 3.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="square"
            />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="font-medium">{label}</span>
      {hint && <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-3 py-2">
      <h2 className="panel-label">{children}</h2>
      {right}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "default",
  size = "md",
  disabled,
  title,
  className,
  type = "button",
}: {
  children: ReactNode;
  onClick?: (() => void) | undefined;
  variant?: "default" | "primary" | "ghost" | "danger";
  size?: "sm" | "md";
  disabled?: boolean | undefined;
  title?: string | undefined;
  className?: string | undefined;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-[3px] border font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "h-6 px-2 text-[11px]" : "h-8 px-3 text-xs",
        variant === "primary" &&
          "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "default" && "border-input bg-surface text-foreground hover:bg-secondary",
        variant === "ghost" && "border-transparent bg-transparent text-muted-foreground hover:bg-secondary",
        variant === "danger" && "border-input bg-surface text-destructive hover:bg-destructive/10",
        className,
      )}
    >
      {children}
    </button>
  );
}
