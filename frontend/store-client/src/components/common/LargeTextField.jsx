import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Info, AlertCircle, FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function LargeTextField({
  id,
  label,
  required = true,
  icon,
  error,
  helpText,
  containerProps,
  labelProps,
  textareaProps = {},
  className,
  value,
  onChange,
  onErrorClear,
  rows = 4,
  maxLength,
  showCharCount = false,
  resizable = true,
  disabled = false,
  placeholder = "",
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const hasValue = value !== undefined && value !== null && value !== "";

  // Determine character count info
  const charCount = value?.length || 0;
  const charCountText = maxLength
    ? `${charCount}/${maxLength}`
    : `${charCount} characters`;

  const handleChange = (e) => {
    if (error && !hasEdited) {
      setHasEdited(true);
      onErrorClear?.(id || textareaProps.id);
    }

    onChange?.(e);
  };

  React.useEffect(() => {
    setHasEdited(false);
  }, [error]);

  return (
    <div className="space-y-1" {...containerProps}>
      <div className="relative w-full">
        <Textarea
          id={id || textareaProps.id}
          required={required}
          value={value}
          disabled={disabled}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            "w-full min-h-[100px] transition-all duration-200 text-base",
            !isFocused && "hover:bg-muted/40 dark:hover:bg-secondary/10",
            "pt-8 pb-2",
            icon && "pl-12",
            showCharCount && "pb-6",
            !resizable && "resize-none",
            className
          )}
          style={{
            minHeight: rows ? `${rows * 1.5}rem` : "100px",
          }}
          onFocus={(e) => {
            setIsFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            setHasEdited(false);
            rest.onBlur?.(e);
          }}
          onChange={handleChange}
          maxLength={maxLength}
          placeholder={placeholder}
          {...textareaProps}
          {...rest}
        />
        {label && (
          <Label
            htmlFor={id || textareaProps.id}
            {...labelProps}
            className={cn(
              "absolute top-2.5 pointer-events-none text-sm text-muted-foreground bg-secondary-foreground/20 pl-0.5 py-0.5 pr-1 rounded-xl backdrop-blur-md",
              icon ? "left-11.5" : "left-3",
              isFocused && "text-primary",
              error && !hasEdited && "text-destructive",
              labelProps?.className
            )}
          >
            {label}
            {required && " *"}
          </Label>
        )}

        {showCharCount && (
          <div className="absolute right-3 bottom-1 text-xs text-muted-foreground">
            {charCountText}
          </div>
        )}

        {icon && (
          <div className="absolute left-3 top-3 h-3 w-3 scale-80 text-muted-foreground">
            {icon}
          </div>
        )}

        <div className="absolute right-3 top-3 flex items-center gap-1">
          {helpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 hover:bg-transparent opacity-75 hover:opacity-100 transition-opacity"
                    tabIndex={-1}
                  >
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">{helpText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {error && !hasEdited && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 hover:bg-transparent opacity-75 hover:opacity-100 transition-opacity"
                    tabIndex={-1}
                  >
                    <AlertCircle className="h-3 w-3 text-destructive" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">{error}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {error && !hasEdited && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </div>
  );
}

export default LargeTextField;
