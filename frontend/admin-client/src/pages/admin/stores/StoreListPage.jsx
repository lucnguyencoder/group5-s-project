import React from "react";
import DataManagementLayout from "@/components/layout/DataManagementLayout";
import StoresDataTable from "@/components/modules/admin/stores/StoresDataTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import SetTitle from "@/components/common/SetTitle";

function StoreListPage() {
  return (
    <DataManagementLayout
      headerLeft={
        <>
          <h1 className="text-xl font-semibold">Store Management</h1>
        </>
      }
      headerRight={
        <>
          <Link to="/stores/new">
            <Button size="sm" className="flex items-center">
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Store
            </Button>
          </Link>
        </>
      }
    >
      <SetTitle title="Store Management" />
      <div className="p-2">
        <StoresDataTable />
      </div>
    </DataManagementLayout>
  );
}

export default StoreListPage;
