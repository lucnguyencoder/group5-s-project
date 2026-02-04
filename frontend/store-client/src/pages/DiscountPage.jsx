import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import DataManagementLayout from "@/components/layout/DataManagementLayout";
import DiscountEditPanel from "@/components/modules/discount/DiscountEditPanel";
import DiscountTableList from "@/components/modules/discount/DiscountTableList";
import SetTitle from "@/components/common/SetTitle";

function DiscountPage() {
  const [selectedDiscountId, setSelectedDiscountId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleDataChange = () => {
    handleRefresh();
  };

  const handleCreateClick = () => {
    setSelectedDiscountId(null);
    setTimeout(() => {
      setIsCreating(true);
    }, 0);
  };

  return (
    <>
      <SetTitle title="Discount Management" />
      <DataManagementLayout
        headerLeft={<h1 className="text-xl font-semibold">Discounts</h1>}
        headerRight={
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={"default"}
              onClick={handleCreateClick}
              disabled={isCreating}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create new discount
            </Button>
          </div>
        }
        containScroll={true}
      >
        <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
          <ResizablePanel defaultSize={65} minSize={40}>
            <DiscountTableList
              key={refreshKey}
              selectedDiscount={selectedDiscountId}
              setSelectedDiscount={(id) => {
                setIsCreating(false);
                setSelectedDiscountId(id);
              }}
              refreshKey={refreshKey}
            />
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={35} minSize={25}>
            <DiscountEditPanel
              key={isCreating ? "create-discount" : selectedDiscountId}
              selectedDiscount={selectedDiscountId}
              setSelectedDiscount={setSelectedDiscountId}
              onDataChange={handleDataChange}
              isCreating={isCreating}
              setIsCreating={setIsCreating}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </DataManagementLayout>
    </>
  );
}

export default DiscountPage;
