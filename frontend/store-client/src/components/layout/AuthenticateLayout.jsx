import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const AuthenticateLayout = ({ children, bottomCard }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          {children}
        </Card>

        {bottomCard && (
          <Card className="bg-muted/50 border-dashed">
            <CardContent>{bottomCard}</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AuthenticateLayout;
