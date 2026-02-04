import { Button } from "@/components/ui/button";
import React from "react";

function Button12({
  title,
  description,
  right,
  variant = "default",
  className,
  norrounded = false,
  cursor = false,
  expanded,
  onClick,
  ...props
}) {
  return (
    <Button
      variant={variant}
      className={`w-full p-3 h-auto justify-start ${
        cursor ? "cursor-default" : "cursor-default"
      } ${className} ${norrounded ? "rounded-none" : ""}`}
      onClick={onClick}
      {...props}
    >
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          {right && (
            <div className="text-sm flex items-center space-x-2 gap-4">
              {description} {right}
            </div>
          )}
        </div>
        {/* <p className="text-sm opacity-80 text-left">{description}</p> */}
        {expanded}
      </div>
    </Button>
  );
}

export default Button12;
