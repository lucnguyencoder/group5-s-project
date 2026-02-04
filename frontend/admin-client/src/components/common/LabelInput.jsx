import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function LabelInput({
  id,
  label,
  required = false,
  icon,
  error,
  helpText,
  containerProps,
  labelProps,
  inputProps = {},
  className,
  ...rest
}) {
  return (
    <div className="space-y-2" {...containerProps}>
      {label && (
        <Label htmlFor={id || inputProps.id} {...labelProps}>
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          id={id || inputProps.id}
          required={required}
          className={cn(
            icon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...inputProps}
          {...rest}
        />
      </div>
      {helpText && <p className="text-sm text-muted-foreground">{helpText}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export default LabelInput;
