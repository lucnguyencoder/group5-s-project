import SetTitle from "@/components/common/SetTitle";
import DataManagementLayout from "@/components/layout/DataManagementLayout";
import { StaffCreateForm } from "@/components/modules/store/StaffCreateForm";
import StoreStaffList from "@/components/modules/store/StoreStaffList";
import { Button } from "@/components/ui/button";
import { Plus, PlusCircle, RefreshCcw } from "lucide-react";
import React from "react";

function StoreStaffListPage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <SetTitle title="Staff Management" />
      <DataManagementLayout
        headerLeft={
          <>
            <h1 className="text-xl font-semibold">Staff Management</h1>
          </>
        }
        headerRight={
          <>
            <Button onClick={handleRefresh} size={"sm"} variant={"outline"}>
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
            <StaffCreateForm onAccountCreated={handleRefresh} asChild>
              <Button size="sm" className="flex items-center">
                <Plus />
                Create
              </Button>
            </StaffCreateForm>
          </>
        }
        containScroll={true}
      >
        <StoreStaffList handleRefresh={handleRefresh} />
      </DataManagementLayout>
    </>
  );
}

export default StoreStaffListPage;
