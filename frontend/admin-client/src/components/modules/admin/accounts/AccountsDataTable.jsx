//done
"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  CheckCircle,
  XCircle,
  Loader2,
  X,
  Ban,
  Search,
  Columns3Cog,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatString } from "@/utils/formatter";
import accountManagementService from "@/services/user/accountManagementService";
import { AccountStatusDialog } from "./AccountStatusDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { PaginationList } from "@/components/common/PaginationList";
import { cn } from "@/lib/utils";
import { AccountDetailsPanel } from "./AccountDetailsPanel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { toast } from "sonner"

const columns = [
  {
    id: "id",
    label: "ID",
    render: ({ row }) => <div>{row.id}</div>,
  },
  {
    id: "email",
    label: "Email",
    accessor: "email",
    render: ({ row }) => <div>{row.email}</div>,
  },
  {
    id: "group",
    label: "Group",
    accessor: "group.name",
    render: ({ row }) => (
      <Badge
        variant="outline"
        className="capitalize"
      >
        {formatString(row.group.name)}
      </Badge>
    ),
  },
  {
    id: "is_enabled_2fa",
    label: "2FA Status",
    render: ({ row }) => (
      <div className="flex items-center">
        {row.is_enabled_2fa ? (
          <Badge variant="success" className="flex items-center">
            <CheckCircle className="mr-1 h-3 w-3" />
            Enabled
          </Badge>
        ) : (
          <Badge variant="outlined" className="flex items-center">
            <XCircle className="mr-1 h-3 w-3" />
            Disabled
          </Badge>
        )}
      </div>
    ),
  },
  {
    id: "created_at",
    label: "Created At",
    render: ({ row }) => (
      <div>{new Date(row.created_at).toLocaleDateString()}</div>
    ),
  },
  {
    id: "actions",
    label: "Actions",
    render: ({ row, onViewDetails }) => (
      <div className="flex items-center space-x-2">
        {(row.group.name !== 'system_admin' && row.group.name !== 'manager') && (
          <AccountStatusDialog
            id={row.id}
            email={row.email}
            isActive={row.is_active}
          >
            <Button
              variant="outline"
              className={`h-8 w-8 ${!row.is_active || "text-destructive"}`}
            >
              {row.is_active ? (
                <Ban className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
            </Button>
          </AccountStatusDialog>
        )}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onViewDetails(row.id)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export function AccountsDataTable() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState(
    Object.fromEntries(columns.map((col) => [col.id, true]))
  );
  const [filters, setFilters] = useState({
    email: "",
    userType: "",
    isActive: undefined,
  });
  const [searchValue, setSearchValue] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemPerPage: 20,
    totalPages: 1,
    totalCount: 0,
  });
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const fetchAccounts = async (
    currentFilters = filters,
    page = pagination.currentPage,
    itemPerPage = pagination.itemPerPage
  ) => {
    try {
      setLoading(true);
      const apiFilters = {};
      if (currentFilters.email) apiFilters.email = currentFilters.email;
      if (currentFilters.userType)
        apiFilters.userType = currentFilters.userType;
      if (currentFilters.isActive !== undefined)
        apiFilters.isActive = currentFilters.isActive;

      const response = await accountManagementService.getAllAccounts(
        apiFilters,
        { page, itemPerPage }
      );
      console.log(response)
      if (response.success) {
        setAccounts(response.data);
        setPagination(response.pagination);
        setError(null);
      }
      else {
        toast.error(response.message || "Failed to load accounts");
        setAccounts([]);
        setError(response.message || "Failed to load accounts");
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError("Failed to load accounts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchAccounts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilters = (type, value) => {
    let newFilters = { ...filters };

    if (type === "userType") {
      newFilters.userType = value === "all" ? "" : value;
    } else if (type === "status") {
      if (value === "active") newFilters.isActive = true;
      else if (value === "disabled") newFilters.isActive = false;
      else newFilters.isActive = undefined;
    } else if (type === "email") {
      newFilters.email = value;
    } else if (type === "clear") {
      newFilters = { email: "", userType: "", isActive: undefined };
      setSearchValue("");
    }

    setFilters(newFilters);
    fetchAccounts(newFilters);
  };

  const handleViewDetails = (accountId) => {
    setSelectedAccountId(accountId);
  };

  const handleRowClick = (accountId, e) => {
    if (e.target.closest("button")) {
      return;
    }
    setSelectedAccountId(accountId);
  };

  const visibleColumns = columns.filter((col) => columnVisibility[col.id]);

  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <p>{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Reload
        </Button>
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[600px]r">
      <ResizablePanel defaultSize={65} minSize={40}>
        <div className="flex flex-col h-full">
          <div className="flex gap-2 items-center p-4 border-b">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  {filters.userType
                    ? formatString(filters.userType)
                    : "All Types"}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleFilters("userType", "all")}
                >
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilters("userType", "customer")}
                >
                  Customers
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilters("userType", "system")}
                >
                  Staff
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilters("userType", "store")}
                >
                  Store
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  {filters.isActive === true
                    ? "Active"
                    : filters.isActive === false
                      ? "Disabled"
                      : "All Status"}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleFilters("status", "all")}
                >
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilters("status", "active")}
                >
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilters("status", "disabled")}
                >
                  Disabled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Input
              placeholder="Filter by email..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-8 text-xs pr-10"
              onKeyDown={(e) =>
                e.key === "Enter" && handleFilters("email", searchValue)
              }
            />
            <Button
              className="h-8 px-2 py-0"
              variant="outline"
              onClick={() => handleFilters("email", searchValue)}
            >
              <Search className="mr-1 h-4 w-4" />
              Search
            </Button>

            {(filters.email ||
              filters.userType ||
              filters.isActive !== undefined) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilters("clear")}
                  className="h-8 text-xs"
                >
                  <X className="mr-1 h-4 w-4" />
                  Clear
                </Button>
              )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Columns3Cog className="h-3.5 w-3.5 mr-1" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px]">
                {columns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-xs"
                    checked={columnVisibility[column.id]}
                    onCheckedChange={(value) =>
                      setColumnVisibility((prev) => ({
                        ...prev,
                        [column.id]: value,
                      }))
                    }
                  >
                    {column.label || column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto">
              <Table className="w-full">
                <TableHeader className="sticky top-0 bg-sidebar z-10">
                  <TableRow>
                    {visibleColumns.map((column) => (
                      <TableHead key={column.id} className="px-6 font-medium">
                        {column.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={visibleColumns.length}>
                        <div className="flex justify-center items-center">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <span className="ml-2">Please wait</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : accounts.length || [] ? (
                    accounts.map((account) => (
                      <TableRow
                        key={account.id}
                        className={cn(
                          "h-14",
                          !account.is_active && "opacity-60",
                          selectedAccountId === account.id
                            ? "bg-primary/10 hover:bg-primary/20"
                            : "hover:bg-secondary/5",
                          "cursor-pointer"
                        )}
                        onClick={(e) => handleRowClick(account.id, e)}
                      >
                        {visibleColumns.map((column) => (
                          <TableCell key={column.id} className="px-6">
                            {column.render({
                              row: account,
                              onViewDetails: handleViewDetails,
                            })}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length}
                        className="h-24 text-center"
                      >
                        No accounts found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex items-center justify-between border-t">
            <div className="flex items-center space-x-2 p-1.5">
              <Select
                value={pagination.itemPerPage.toString()}
                onValueChange={(value) =>
                  fetchAccounts(filters, 1, Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 5, 10, 20, 50, 100].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground text-nowrap">
                items per page
              </span>
            </div>

            <PaginationList
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(page) =>
                fetchAccounts(filters, page, pagination.itemPerPage)
              }
              disabled={loading}
            />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={35} minSize={30}>
        <AccountDetailsPanel
          accountId={selectedAccountId}
          onAccountIdChange={setSelectedAccountId}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default AccountsDataTable;
