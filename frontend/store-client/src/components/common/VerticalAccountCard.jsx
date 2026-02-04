import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

function VerticalAccountCard({ title, children, footer, ...props }) {
  return (
    <Card className={"pt-0 overflow-hidden"}>
      <CardHeader className={"p-0"}>
        <CardTitle className="flex items-center gap-2 text-md border-b mt-0 px-4 py-2 bg-background/50 font-normal -mb-2">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={"px-4"}>{children}</CardContent>
      {footer && <CardFooter className={"justify-end"}>{footer}</CardFooter>}
    </Card>
  );
}

export default VerticalAccountCard;
