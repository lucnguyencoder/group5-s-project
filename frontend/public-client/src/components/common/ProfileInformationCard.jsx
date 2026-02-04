import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { EarthIcon, Edit, LockIcon, Pencil, ShieldIcon } from "lucide-react";

function ProfileInformationCard({
  icon,
  title,
  children,
  onClick,
  visibility,
  onRight = false,
  isSquare = false,
  rightChildren,
}) {
  if (onRight)
    return (
      <Card
        className={`p-3 h-full relative group ${
          isSquare ? "aspect-square" : ""
        } ${
          onClick
            ? " hover:bg-secondary/10 z`cursor-pointer hover:scale-102 active:scale-98 hover:shadow-md transition-all duration-200"
            : ""
        }`}
        onClick={onClick}
      >
        {onClick && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Pencil className="h-4 w-4 opacity-50" />
          </div>
        )}

        <CardContent
          className={`p-3.5 flex items-start w-full justify-between ${
            isSquare ? "h-full justify-between" : "h-full"
          }`}
        >
          <div className="h-full">
            <div className="text-primary">{icon}</div>
            {visibility && (
              <p className="text-xs font-bold text-muted-foreground mt-3 uppercase font-mono flex gap-1 items-center">
                {visibility}
              </p>
            )}
            <h3 className="text-xl font-medium pb-0 mt-0">{title}</h3>
            <div className="mt-auto">{rightChildren}</div>
          </div>

          <div
            className={`mt-auto text-lg font-medium h-full flex items-center`}
          >
            {children}
          </div>
        </CardContent>
      </Card>
    );

  return (
    <Card
      className={`p-3 h-full relative group ${
        isSquare ? "aspect-square" : ""
      } ${
        onClick
          ? " hover:bg-secondary/10 z`cursor-pointer hover:scale-102 active:scale-98 hover:shadow-md transition-all duration-200"
          : ""
      }`}
      onClick={onClick}
    >
      {onClick && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Pencil className="h-4 w-4 opacity-50" />
        </div>
      )}

      <CardContent
        className={`p-3.5 flex items-start flex-col ${
          isSquare ? "h-full justify-between" : "h-full"
        }`}
      >
        <div className="text-primary">{icon}</div>
        {visibility && (
          <p className="text-xs font-bold text-muted-foreground mt-3 uppercase font-mono flex gap-1 items-center">
            {/* <div className="scale-75">
              {visibility === "public" ? (
                <EarthIcon className="h-4 w-4" />
              ) : visibility === "private" ? (
                <LockIcon className="h-4 w-4" />
              ) : (
                <ShieldIcon className="h-4 w-4" />
              )}
            </div> */}
            {visibility}
          </p>
        )}
        <h3 className="text-lg pb-0 mt-0">{title}</h3>

        <div className={`mt-auto text-lg font-medium w-full`}>{children}</div>
      </CardContent>
    </Card>
  );
}

export default ProfileInformationCard;
