import { ArrowUpRight, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";

const ActionButton = ({ icon, title, onClick }) => {
  return (
    <div
      className={`flex flex-col gap-2 items-center justify-center pb-3 w-full  cursor-pointer rounded-md transition-all duration-100 ease-in-out`}
      onClick={onClick}
    >
      <div
        className={`bg-primary/10 py-1.5 px-4 rounded-full text-primary hover:bg-primary/20`}
      >
        <div className="scale-85">{icon}</div>
      </div>
      <div className="align-center text-center text-xs font-semibold text-foreground">
        {title}
      </div>
    </div>
  );
};

export default ActionButton;
