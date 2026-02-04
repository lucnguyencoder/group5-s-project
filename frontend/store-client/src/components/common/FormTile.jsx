import React from "react";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";

function FormTile({
  icon,
  title,
  description,
  action,
  isExpanded = false,
  background = true,
  expand,
  disableChildPadding,
  small = false,
  rounded = true,
}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleContainerClick = (e) => {
    if (e.target.closest("[data-prevent-expand]")) {
      return;
    }

    if (isExpanded) {
      setExpanded(!expanded);
    }
  };

  return (
    <>
      <div
        className={`flex items-center justify-between ${background ? "bg-sidebar" : ""
          } ${isExpanded ? "hover:bg-secondary/5 cursor-pointer" : ""} ${rounded && (expanded && isExpanded ? "rounded-t-sm" : "rounded-sm")
          } transition-all ${small ? "py-2" : "py-4"} pl-4 pr-6`}
        onClick={handleContainerClick}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="scale-90">{icon}</div>
          <div>
            <p className="font-medium text-md cursor-default">{title}</p>
            <p className="text-sm text-muted-foreground cursor-default">
              {description}
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-4 justify-end"
          data-prevent-expand
        >
          {action}
          {isExpanded && (
            <ChevronDown
              className={`h-4 w-4 ${expanded ? "" : "rotate-180"
                } transition-transform duration-200 cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            />
          )}
        </div>
      </div>
      {isExpanded && expanded ? (
        <div
          className={`px-4 py-2 rounded-b-md ${background ? "bg-sidebar/70" : ""
            } ${!disableChildPadding ? "pl-13" : ""}`}
        >
          {expand}
        </div>
      ) : null}
    </>
  );
}

export default FormTile;
