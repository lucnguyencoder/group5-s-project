import { Card, CardContent } from "@/components/ui/card";
import React from "react";

function Information12({ title, description, right }) {
  return (
    <Card className={"p-3"}>
      <CardContent className={"px-3"}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          {right && (
            <div className="text-sm text-muted-foreground">{right}</div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default Information12;
