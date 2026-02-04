import React from "react";
import { cn } from "@/lib/utils";

const DataManagementLayout = ({
  children,
  headerLeft,
  headerRight,
  containScroll = false, // Set to true for pages that manage their own scrolling
}) => {
  return (
    <div
      className={cn(
        "h-screen flex flex-col w-full",
        containScroll ? "overflow-hidden" : "overflow-auto"
      )}
    >
      {(headerLeft || headerRight) && (
        <div className="border-b bg-background sticky top-0 z-10 w-full">
          <div className="w-full px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">{headerLeft}</div>
              <div className="flex items-center space-x-4">{headerRight}</div>
            </div>
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex-1 w-full",
          containScroll ? "overflow-hidden" : "p-6 overflow-auto"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default DataManagementLayout;
