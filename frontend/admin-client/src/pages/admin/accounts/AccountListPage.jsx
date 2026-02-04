//done
import DataManagementLayout from "@/components/layout/DataManagementLayout";
import AccountsDataTable from "@/components/modules/admin/accounts/AccountsDataTable";
import { AccountCreateDialog } from "@/components/modules/admin/accounts/AccountCreateDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import React from "react";
import PrivateComponents from "@/components/layout/PrivateComponents";
import SetTitle from "@/components/common/SetTitle";

function AccountListPage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <DataManagementLayout
      headerLeft={
        <>
          <h1 className="text-xl font-semibold">Accounts</h1>
        </>
      }
      headerRight={
        <>
          <PrivateComponents
            url="/api/admin/users"
            method="POST"
          >
            <AccountCreateDialog onAccountCreated={handleRefresh}>
              <Button size="sm" className="flex items-center">
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Account
              </Button>
            </AccountCreateDialog>
          </PrivateComponents>
        </>
      }
      containScroll={true}
    >
      <SetTitle title="Accounts" />
      <AccountsDataTable />
    </DataManagementLayout>
  );
}

export default AccountListPage;
