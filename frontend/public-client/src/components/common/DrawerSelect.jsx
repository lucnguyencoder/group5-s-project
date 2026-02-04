import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const DrawerSelect = ({
  id,
  label,
  value,
  options = [],
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  noResultsText = "No results found",
  required = false,
  disabled = false,
  error,
  icon,
  className,
  renderOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOptions(options);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = options.filter((option) =>
      option.display.toLowerCase().includes(query)
    );
    setFilteredOptions(filtered);
  }, [searchQuery, options]);

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleSelect = (option) => {
    setSelectedValue(option.value);
    onChange?.(option.value);
    setIsOpen(false);
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setSearchQuery("");
    }
  };

  const defaultRenderOption = (option, isSelected) => (
    <div className="flex items-center justify-between w-full">
      <span>{option.display}</span>
      {isSelected && <Check className="h-4 w-4 text-primary" />}
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="relative">
        <Button
          id={id}
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-between border-input bg-background h-14 py-2 px-4",
            error && "border-destructive",
            disabled && "opacity-50 cursor-not-allowed",
            icon && "pl-12",
            className
          )}
          onClick={() => !disabled && setIsOpen(true)}
          disabled={disabled}
        >
          <div>
            <Label
              htmlFor={id}
              className="text-xs font-normal text-muted-foreground"
            >
              {label}
              {required && <span className="text-destructive">*</span>}
            </Label>
            <span className="truncate text-base">
              {selectedOption ? selectedOption.display : placeholder}
            </span>
          </div>
          <ChevronRight className="h-4 w-4 opacity-50" />
        </Button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <Drawer open={isOpen} onOpenChange={handleOpenChange} direction="right">
        <DrawerContent className="pb-0 flex flex-col h-[100vh] z-99999">
          <DrawerHeader>
            <div className="flex items-center justify-between space-x-4">
              <DrawerClose>
                <Button variant="outline">
                  <ChevronLeft />
                  Back
                </Button>
              </DrawerClose>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                  autoFocusfe
                />
              </div>
            </div>
          </DrawerHeader>

          <div className="px-4 pb-4 flex-1 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start font-normal text-md py-3 px-2",
                    option.value === selectedValue && "bg-muted"
                  )}
                  size="lg"
                  onClick={() => handleSelect(option)}
                >
                  {renderOption
                    ? renderOption(option, option.value === selectedValue)
                    : defaultRenderOption(
                        option,
                        option.value === selectedValue
                      )}
                </Button>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {noResultsText}
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default DrawerSelect;
