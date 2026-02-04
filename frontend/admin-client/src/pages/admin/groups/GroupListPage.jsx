import SetTitle from "@/components/common/SetTitle";
import DataManagementLayout from "@/components/layout/DataManagementLayout";
import GroupsDataTable from "@/components/modules/admin/groups/GroupsDataTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function GroupListPage() {
  return (
    <DataManagementLayout
      headerLeft={
        <>
          <h1 className="text-xl font-semibold">User Groups</h1>
        </>
      }
      headerRight={
        <Link to="/groups/update">
          <Button size="sm" className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Group
          </Button>
        </Link>
      }
      containScroll={false}
    >
      <SetTitle title="User Groups" />
      <div className="p-2">
        <GroupsDataTable />
      </div>
    </DataManagementLayout>
  );
}

export default GroupListPage;
