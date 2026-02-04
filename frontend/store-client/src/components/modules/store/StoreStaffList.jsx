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
    RefreshCw,
    ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatString } from "@/utils/formatter";
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
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useStore } from "@/context/StoreContext";
import { storeService } from "@/services/basicService";
import StaffDetailsPanel from "./StaffDetailsPanel";

const columns = [
    {
        id: "user_id",
        label: "ID",
        render: ({ row }) => <div>{row.user_id}</div>,
    },
    {
        id: "full_name",
        label: "Full Name",
        render: ({ row }) => <div>{row.full_name}</div>,
    },
    {
        id: "email",
        label: "Email",
        accessor: "email",
        render: ({ row }) => <div>{row.email}</div>,
    },
    {
        id: "phone",
        label: "Phone",
        render: ({ row }) => <div>{row.phone}</div>,
    },
    {
        id: "type",
        label: "Job",
        render: ({ row }) => (
            <div>{formatString(row.user?.group?.name)}</div>
        ),
    },
    {
        id: "created_at",
        label: "Created At",
        render: ({ row }) => (
            <div>{new Date(row.created_at).toLocaleDateString()}</div>
        ),
    },

];

export function StoreStaffList() {
    const { store } = useStore();
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [columnVisibility, setColumnVisibility] = useState(
        Object.fromEntries(columns.map((col) => [col.id, true]))
    );
    const [filters, setFilters] = useState({
        email: "",
        type: "",
        active: undefined,
    });
    const [searchValue, setSearchValue] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        itemPerPage: 10,
        totalPage: 1,
        totalPages: 1,
        totalCount: 0,
        currentPage: 1,
    });
    const [refreshing, setRefreshing] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState(null);

    const fetchStaff = async (
        currentFilters = filters,
        page = pagination.page,
        itemPerPage = pagination.itemPerPage
    ) => {
        if (!store?.id) return;
        try {
            setLoading(true);
            const apiFilters = {};
            if (currentFilters.email) apiFilters.email = currentFilters.email;
            if (currentFilters.type) apiFilters.type = currentFilters.type;
            if (currentFilters.active !== undefined) apiFilters.active = currentFilters.active;

            const response = await storeService.getAllStaff(
                store.id,
                apiFilters,
                { page, itemPerPage }
            );
            console.log(response.staff)
            if (response.success) {
                setStaff(response.staff);
                setPagination({
                    page: response.currentPage || 1,
                    currentPage: response.currentPage || 1,
                    itemPerPage: itemPerPage,
                    totalPage: response.totalPage || Math.ceil(response.total / itemPerPage) || 1,
                    totalPages: response.totalPage || Math.ceil(response.total / itemPerPage) || 1,
                    totalCount: response.total || response.staff.length
                });
                setError(null);
            } else {
                setError(response.message || "Failed to load staff");
            }
        } catch (err) {
            console.error("Error fetching staff:", err);
            setError("Failed to load staff. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchStaff();
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (store?.id) {
            fetchStaff();
        }
    }, [store?.id]);
    const handleFilters = (type, value) => {
        let newFilters = { ...filters };

        if (type === "type") {
            newFilters.type = value === "all" ? "" : value;
        } else if (type === "status") {
            if (value === "active") newFilters.active = true;
            else if (value === "inactive") newFilters.active = false;
            else newFilters.active = undefined;
        } else if (type === "email") {
            newFilters.email = value;
        } else if (type === "clear") {
            newFilters = { email: "", type: "", active: undefined };
            setSearchValue("");
        }
        console.log(newFilters.active)
        setFilters(newFilters);
        fetchStaff(newFilters);
    };

    const handleViewDetails = (staffId) => {
        setSelectedStaffId(staffId);
    };

    const handleRowClick = (staffId, e) => {
        // Check if the click was on a button or any element inside a button
        if (e.target.closest("button")) {
            return;
        }
        setSelectedStaffId(staffId);
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
                                    {filters.type
                                        ? formatString(filters.type)
                                        : "All Types"}
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    onClick={() => handleFilters("type", "all")}
                                >
                                    All Types
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleFilters("type", "sale")}
                                >
                                    Sale Agent
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleFilters("type", "courier")}
                                >
                                    Courier
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleFilters("type", "manager")}
                                >
                                    Manager
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>



                        {filters.type === 'courier' && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 text-xs">
                                        {filters.active === true
                                            ? "Available"
                                            : filters.active === false
                                                ? "Not Available"
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
                                        Available
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleFilters("status", "inactive")}
                                    >
                                        Not Available
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}


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
                            filters.type ||
                            filters.active !== undefined) && (
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

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 text-xs ml-auto"
                            onClick={handleRefresh}
                            disabled={refreshing || loading}
                        >
                            <RefreshCw
                                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
                            />
                        </Button>

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
                                    ) : staff.length ? (
                                        staff.map((staffMember) => (
                                            <TableRow
                                                key={staffMember.user_id}
                                                className={cn(
                                                    "h-14",
                                                    selectedStaffId === staffMember.user_id
                                                        ? "bg-primary/10 hover:bg-primary/20"
                                                        : "hover:bg-secondary/5",
                                                    "cursor-pointer"
                                                )}
                                                onClick={(e) => handleRowClick(staffMember.user_id, e)}
                                            >
                                                {visibleColumns.map((column) => (
                                                    <TableCell key={column.id} className="px-6">
                                                        {column.render({
                                                            row: staffMember,
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
                                                No staff found.
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
                                    fetchStaff(filters, 1, Number(value))
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
                                fetchStaff(filters, page, pagination.itemPerPage)
                            }
                            disabled={loading}
                        />
                    </div>
                </div>


            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={30} minSize={25}>
                <StaffDetailsPanel
                    staffId={selectedStaffId}
                    onStaffIdChange={setSelectedStaffId}
                    onStatusChange={handleRefresh}
                />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}

export default StoreStaffList;
