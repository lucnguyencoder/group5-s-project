import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Info, Eye, EyeOff, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function TextField({
  id,
  label,
  required = true,
  icon,
  error,
  helpText,
  containerProps,
  labelProps,
  inputProps = {},
  className,
  value,
  isHideContent = false,
  rightItems = [],
  type,
  onChange,
  onErrorClear,
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(!isHideContent);
  const [hasEdited, setHasEdited] = useState(false);
  const hasValue = value !== undefined && value !== null && value !== "";
  const isFloating = isFocused || hasValue;

  const toggleContentVisibility = () => {
    setIsContentVisible(!isContentVisible);
  };

  const handleChange = (e) => {
    if (error && !hasEdited) {
      setHasEdited(true);

      onErrorClear?.(id || inputProps.id);
    }

    onChange?.(e);
  };

  React.useEffect(() => {
    setHasEdited(false);
  }, [error]);

  const rightIconsCount =
    (helpText ? 1 : 0) +
    (error ? 1 : 0) +
    (isHideContent ? 1 : 0) +
    rightItems.length;

  const rightPadding =
    rightIconsCount > 0
      ? `pr-${Math.min(rightIconsCount * 8 + 4, 24)}`
      : "pr-4";

  return (
    <div className="space-y-1" {...containerProps}>
      <div className="relative w-full">
        <Input
          id={id || inputProps.id}
          required={required}
          value={value}
          type={
            isHideContent && !isContentVisible ? "password" : type || "text"
          }
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            "w-full h-14 pt-6 pb-2 transition-all duration-200 text-base",
            !isFocused && "hover:bg-muted/40 dark:hover:bg-secondary/10",
            icon ? "pl-12" : "pl-4",
            rightPadding,
            className
          )}
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
          {...inputProps}
          {...rest}
          placeholder={""}
        />

        {icon && (
          <div className="absolute left-3.5 top-3/7 -translate-y-1/2 h-3 w-3 text-muted-foreground flex-shrink-0 scale-75">
            {icon}
          </div>
        )}

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {rightItems.map((item, index) => (
            <div
              key={index}
              className="h-6 w-6 flex items-center justify-center"
            >
              {item}
            </div>
          ))}

          {helpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-transparent opacity-75 hover:opacity-100 transition-opacity"
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
                    className="h-6 w-6 p-0 hover:bg-transparent opacity-75 hover:opacity-100 transition-opacity"
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

          {isHideContent && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-transparent"
              onClick={toggleContentVisibility}
              tabIndex={-1}
            >
              {isContentVisible ? (
                <EyeOff className="h-3 w-3 text-muted-foreground" />
              ) : (
                <Eye className="h-3 w-3 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>

        {label && (
          <Label
            htmlFor={id || inputProps.id}
            {...labelProps}
            className={cn(
              "absolute transition-all duration-200 pointer-events-none text-muted-foreground",
              icon ? "left-12" : "left-4",
              isFloating
                ? "top-1.5 text-xs font-medium"
                : "top-1/2 -translate-y-1/2 text-sm opacity-75",
              isFocused && "text-primary",
              error && !hasEdited && "text-destructive",
              labelProps?.className
            )}
          >
            {label}
            {required && " *"}
          </Label>
        )}
      </div>
    </div>
  );
}

export default TextField;
