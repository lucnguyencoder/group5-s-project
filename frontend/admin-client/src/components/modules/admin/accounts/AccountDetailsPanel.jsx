//done
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  User,
  UserCircle,
  KeyRound,
  Ban,
  CheckCircle,
} from "lucide-react";
import accountManagementService from "@/services/user/accountManagementService";
import { formatString, formatDateTime } from "@/utils/formatter";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AccountChangePasswordDialog } from "./AccountChangePasswordDialog";
import { AccountStatusDialog } from "./AccountStatusDialog";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PanelSection } from "@/components/common/PanelSection";
import PrivateComponents from "@/components/layout/PrivateComponents";

const DisplayValue = ({ value, fallback = "Not specified" }) => {
  if (!value || value === "") {
    return <span className="opacity-50">{fallback}</span>;
  }
  return <span>{value}</span>;
};

export function AccountDetailsPanel({
  accountId,
  onAccountIdChange,
  onStatusChange,
}) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputAccountId, setInputAccountId] = useState(accountId || "");

  useEffect(() => {
    if (accountId) {
      setInputAccountId(accountId);
      fetchAccountDetails(accountId);
    }
  }, [accountId]);

  const fetchAccountDetails = async (id) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const accountData = await accountManagementService.getAccountById(id);
      setAccount(accountData);
    } catch (err) {
      console.error("Error fetching account details:", err);
      setError("Failed to load account details");
    } finally {
      setLoading(false);
    }
  };

  const handleManualFetch = () => {
    if (!inputAccountId) {
      toast.error("Please enter an account ID");
      return;
    }

    onAccountIdChange(inputAccountId);
    fetchAccountDetails(inputAccountId);
  };

  const renderAccountInfo = () => {
    if (!account) return null;

    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium w-1/3">ID</TableCell>
            <TableCell>{account.id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Email</TableCell>
            <TableCell>{account.email}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Role</TableCell>
            <TableCell>
              <Badge className="capitalize">
                {formatString(account.group?.name || "N/A")} &gt;{" "}
                {formatString(account.user_type)}
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">2FA Status</TableCell>
            <TableCell className="font-medium">
              {account.is_enabled_2fa ? "Yes" : "No"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Created</TableCell>
            <TableCell>{formatDateTime(account.created_at)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Last access</TableCell>
            <TableCell>{formatDateTime(account.updated_at)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  const renderProfileInfo = () => {
    if (!account || !account.profile) return <div></div>;

    if (account.user_type === "system") {
      return (
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium w-1/3">Full Name</TableCell>
              <TableCell>
                <DisplayValue
                  value={account.profile.full_name}
                  fallback="Not provided"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Phone</TableCell>
              <TableCell>
                <DisplayValue
                  value={account.profile.phone_number}
                  fallback="Not provided"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    } else if (account.user_type === "customer") {
      return (
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium w-1/3">Full Name</TableCell>
              <TableCell>
                <DisplayValue
                  value={account.profile.full_name}
                  fallback="Not provided"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Date of Birth</TableCell>
              <TableCell>
                <DisplayValue
                  value={
                    account.profile.date_of_birth
                      ? new Date(
                          account.profile.date_of_birth
                        ).toLocaleDateString()
                      : null
                  }
                  fallback="Not provided"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Gender</TableCell>
              <TableCell>
                <DisplayValue
                  value={account.profile.gender}
                  fallback="Not specified"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Verified</TableCell>
              <TableCell className="font-medium">
                {account.profile.is_verified ? "Yes" : "No"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    }

    return <div></div>;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex gap-2 items-center">
        <Input
          placeholder="Enter Account ID"
          value={inputAccountId}
          onChange={(e) => setInputAccountId(e.target.value)}
          className="w-full h-8"
          onKeyDown={(e) => e.key === "Enter" && handleManualFetch()}
        />
        <Button onClick={handleManualFetch} variant="outline" size="sm">
          View
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading account details...</span>
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-4">{error}</div>
        ) : account ? (
          <div className="flex flex-col h-full">
            <PanelSection
              title="Account Details"
              icon={<UserCircle className="h-4 w-4" />}
              defaultExpanded={true}
            >
              {renderAccountInfo()}
            </PanelSection>

            <PanelSection
              title="Assigned Profile"
              icon={<User className="h-4 w-4" />}
              defaultExpanded={true}
            >
              {renderProfileInfo()}
            </PanelSection>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            Select an account or enter an account ID to view details
          </div>
        )}
      </div>

      {account && (
        <div className="p-2 border-t mt-auto flex flex-wrap justify-end gap-2">
          {account.group?.name !== "system_admin" && (
            <PrivateComponents url={"/api/admin/users/:id"} method="PUT">
              <AccountChangePasswordDialog
                id={account.id}
                email={account.email}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <KeyRound className="h-4 w-4 mr-1" />
                  Change Password
                </Button>
              </AccountChangePasswordDialog>
            </PrivateComponents>
          )}
          {account.group?.name !== "system_admin" &&
            account.group?.name !== "manager" && (
              <PrivateComponents url={"/api/admin/users/:id"} method="DELETE">
                <AccountStatusDialog
                  id={account.id}
                  email={account.email}
                  isActive={account.is_active}
                  onStatusChange={() => {
                    if (onStatusChange) onStatusChange();
                    fetchAccountDetails(account.id);
                  }}
                >
                  <Button
                    size="sm"
                    variant={account.is_active ? "destructive" : "success"}
                    className="flex items-center"
                  >
                    {account.is_active ? (
                      <>
                        <Ban className="h-4 w-4 mr-1" /> Disable Account
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" /> Enable Account
                      </>
                    )}
                  </Button>
                </AccountStatusDialog>
              </PrivateComponents>
            )}
        </div>
      )}
    </div>
  );
}
