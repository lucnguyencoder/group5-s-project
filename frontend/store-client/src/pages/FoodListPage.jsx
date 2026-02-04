import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import DataManagementLayout from "@/components/layout/DataManagementLayout";
import FoodTableList from "@/components/modules/food/FoodTableList";
import FoodDetailPanel from "@/components/modules/food/FoodDetailPanel";
import PrivateComponents from "@/components/layout/PrivateComponents";
import SetTitle from "@/components/common/SetTitle";

function FoodListPage() {
  const navigate = useNavigate();
  const [selectedFoodId, setSelectedFoodId] = useState(null);

  const handleCreateFood = () => {
    navigate("/food/new");
  };

  const handleEditFood = (foodId) => {
    navigate(`/food/edit/${foodId}`);
  };

  return (
    <>
      <SetTitle title="Food Management" />
      <DataManagementLayout
        headerLeft={<h1 className="text-xl font-semibold">Foods</h1>}
        headerRight={
          <PrivateComponents url="/api/store/foods" method="POST">
            <Button size="sm" onClick={handleCreateFood}>
              <Plus className="h-4 w-4" />
              Create New Product
            </Button>
          </PrivateComponents>
        }
        containScroll={true}
      >
        <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
          <ResizablePanel defaultSize={65} minSize={40}>
            <FoodTableList
              onFoodSelect={setSelectedFoodId}
              onEditFood={handleEditFood}
            />
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={35} minSize={25}>
            <FoodDetailPanel
              foodId={selectedFoodId}
              onFoodIdChange={setSelectedFoodId}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </DataManagementLayout>
    </>
  );
}

export default FoodListPage;
