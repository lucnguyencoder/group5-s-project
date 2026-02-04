import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SetTitle from "@/components/common/SetTitle";

const FoodPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <SetTitle title="Food Menu" />
      <h1 className="text-2xl font-bold mb-6">Food Menu</h1>
    </div>
  );
};

export default FoodPage;
