import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

function TabStyleSelection({ options, value, setValue, big = false }) {
  /**
   * options: [
   *    {
   *     value: "pickup",
   *    label: "Pick Up",
   *    icon: <Store />,
   * }
   * ]
   *
   *
   */
  return (
    <>
      {/* {value} */}
      <Tabs defaultValue={value}>
        <TabsList
          className={`border border-border/30 ${big ? "text-lg" : "text-sm"}`}
        >
          {options.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              onClick={() => setValue(option.value)}
              className={`flex items-center gap-2 ${
                big ? "text-lg" : "text-sm"
              }`}
            >
              {option.icon && <div className="w-4 h-4">{option.icon}</div>}
              <span className="text-sm">{option.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </>
  );
}

export default TabStyleSelection;
