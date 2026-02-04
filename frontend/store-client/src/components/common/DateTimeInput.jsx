"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, CalendarIcon, AlertCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimeField from "./TimeField";

function DateTimeInput({
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
  date,
  setDate,
  rightItems = [],
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("date");

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("00:00:00");

  // Parse the initial date string if provided
  useEffect(() => {
    if (date) {
      try {
        // Parse the date string: "YYYY-MM-DD HH:MM:SS"
        const [datePart, timePart] = date.split(" ");
        setSelectedDate(new Date(datePart));
        setSelectedTime(timePart || "00:00:00");
      } catch (error) {
        console.error("Invalid date format:", error);
      }
    }
  }, [date]);

  const hasValue = date !== undefined && date !== null && date !== "";
  const isFloating = isFocused || hasValue;

  // Format a date object to YYYY-MM-DD
  const formatDate = (dateObj) => {
    if (!dateObj) return "";

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Combine date and time into the required format
  const updateDateTime = (newDate, newTime) => {
    const dateToUse = newDate || selectedDate;
    const timeToUse = newTime || selectedTime;

    if (!dateToUse) return;

    const formattedDate = formatDate(dateToUse);
    const dateTimeString = `${formattedDate} ${timeToUse}`;

    setDate?.(dateTimeString);
  };

  // Handle date selection
  const handleDateSelect = (newDate) => {
    setSelectedDate(newDate);
    updateDateTime(newDate, selectedTime);
  };

  // Handle time change
  const handleTimeChange = (e) => {
    const newTime = e.target.value + ":00"; // Add seconds
    setSelectedTime(newTime);
    updateDateTime(selectedDate, newTime);
  };

  // Format the display value
  const displayValue = date || "";

  // Calculate right padding based on number of icons
  const rightIconsCount =
    (helpText ? 1 : 0) + (error ? 1 : 0) + 1 + rightItems.length; // +1 for calendar icon

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
          value={displayValue}
          type="text"
          readOnly
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            "w-full h-14 pt-6 pb-2 transition-all duration-200 text-base cursor-pointer",
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
            rest.onBlur?.(e);
          }}
          onClick={() => setIsPopoverOpen(true)}
          {...inputProps}
          {...rest}
        />

        {icon && (
          <div className="absolute left-3.5 top-3/7 -translate-y-1/2 h-3 w-3 text-muted-foreground flex-shrink-0 scale-75">
            {icon}
          </div>
        )}

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Custom right items */}
          {rightItems.map((item, index) => (
            <div
              key={index}
              className="h-6 w-6 flex items-center justify-center"
            >
              {item}
            </div>
          ))}

          {/* Date time picker trigger */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-transparent opacity-75 hover:opacity-100 transition-opacity"
                tabIndex={-1}
              >
                <CalendarIcon className="h-3 w-3 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end" sideOffset={8}>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="flex items-center justify-between px-4 pt-4">
                  <TabsList>
                    <TabsTrigger value="date" className="text-xs">
                      Date
                    </TabsTrigger>
                    <TabsTrigger value="time" className="text-xs">
                      Time
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="date" className="p-0 m-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    captionLayout="dropdown"
                  />
                </TabsContent>

                <TabsContent value="time" className="px-4 pb-4 pt-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Select Time</Label>
                    <TimeField
                      value={selectedTime?.split(":").slice(0, 2).join(":")}
                      onChange={handleTimeChange}
                      className="h-10 pt-2 pb-1"
                      label=""
                    />
                  </div>
                </TabsContent>

                <div className="border-t p-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsPopoverOpen(false)}
                    className="w-full"
                    size="sm"
                  >
                    Confirm
                  </Button>
                </div>
              </Tabs>
            </PopoverContent>
          </Popover>

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

          {error && (
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
                : "top-1/2 -translate-y-1/2 text-sm",
              isFocused && "text-primary",
              error && "text-destructive",
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

export default DateTimeInput;
