import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

function VerticalAccountCard({ title, children, footer }) {
  return (
    <div className={"pt-0 overflow-hidden"}>
      <div className={"p-0"}>
        <p className="flex items-center text-xl font-semibold mt-0 bg-background/50 mb-2">
          {title}
        </p>
        <div className="h-[1.5px] bg-gradient-to-r from-border to-transparent mb-5"></div>
      </div>
      <CardContent className={"px-0"}>{children}</CardContent>
      {footer && <div className={"justify-end flex mt-4"}>{footer}</div>}
    </div>
  );
}

export default VerticalAccountCard;
