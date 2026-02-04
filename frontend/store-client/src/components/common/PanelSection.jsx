import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PanelSection({
  title,
  icon,
  defaultExpanded = true,
  className,
  headerClassName,
  contentClassName,
  children,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={cn("border-t flex-1", className)}>
      <div
        className={cn(
          "flex items-center py-2 px-3 text-sm font-medium cursor-pointer select-none",
          "hover:bg-muted/50 transition-colors",
          headerClassName
        )}
        onClick={toggleExpanded}
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 mr-1.5 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-1.5 shrink-0" />
        )}
        {icon && <span className="mr-1.5">{icon}</span>}
        <span>{title}</span>
      </div>
      {expanded && (
        <div className={cn("px-3 pb-3 text-sm h-full", contentClassName)}>
          {children}
        </div>
      )}
    </div>
  );
}

export default PanelSection;
