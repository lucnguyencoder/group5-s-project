import { ArrowUpRight, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";

const BigHorizontalProperties = ({
  icon,
  title,
  value,
  square = false,
  noIconBg = false,
  onClick,
}) => {
  if (!value || value === 0) return null;
  return (
    <div
      className={`flex m-0 bg-card/50 gap-2 border border-card/80 shadow-none rounded-lg ${
        square
          ? "flex-col w-full h-full items-start justify-between p-4"
          : "align-center items-center p-2"
      }
        ${onClick ? "cursor-pointer hover:bg-card/80" : ""}`}
      onClick={onClick}
    >
      <div
        className={`${square ? "" : "m-1"} ${
          noIconBg ? "" : "bg-card p-2  aspect-square rounded-full"
        }`}
      >
        {icon}
      </div>
      <div className="pr-5">
        <p className="text-xs font-medium">{title}</p>
        <p className="text-md">{value}</p>
      </div>
      {onClick && !square && (
        <div className="ml-auto">
          <ArrowUpRight className="h-4.5 w-4.5 mr-3 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export default BigHorizontalProperties;
