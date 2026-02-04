"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Loader2,
  X,
  Eye,
  Edit,
  Search,
  Columns3Cog,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatString } from "@/utils/formatter";
import groupService from "@/services/groups/groupService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

const columns = [
  {
    id: "id",
    label: "ID",
    render: ({ row }) => <div>{row.id}</div>,
  },
  {
    id: "name",
    label: "Name",
    accessor: "name",
    render: ({ row }) => (
      <div className="capitalize">{formatString(row.name)}</div>
    ),
  },
  {
    id: "type",
    label: "Type",
    accessor: "type",
    render: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {formatString(row.type)}
      </Badge>
    ),
  },
  {
    id: "description",
    label: "Description",
    accessor: "description",
    render: ({ row }) => (
      <div className="capitalize">{formatString(row.description)}</div>
    ),
  },
  {
    id: "is_default",
    label: "Default",
    render: ({ row }) => (
      <div>
        {row.is_default ? (
          <Badge variant="success">Yes</Badge>
        ) : (
          <Badge variant="outline">No</Badge>
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
    render: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Link to={`/groups/update/${row.id}`}>
          <Button size="xs" variant="outline" className="text-xs px-2 py-1">
            <Edit className="mr-1 h-4 w-4" /> Edit Group
          </Button>
        </Link>
      </div>
    ),
  },
];

export function GroupsDataTable() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState(
    Object.fromEntries(columns.map((col) => [col.id, true]))
  );
  const [filters, setFilters] = useState({
    name: "",
    type: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchGroups = async (currentFilters = filters) => {
    try {
      setLoading(true);

      const apiFilters = {};
      if (currentFilters.name) apiFilters.name = currentFilters.name;
      if (currentFilters.type) apiFilters.type = currentFilters.type;

      const response = await groupService.getAllGroups(apiFilters);

      if (response.success) {
        setGroups(response.data);
        setError(null);
      } else {
        setError(response.message || "Failed to load groups");
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError("Failed to load groups. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchGroups();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleFilters = (type, value) => {
    let newFilters = { ...filters };

    if (type === "type") {
      newFilters.type = value === "all" ? "" : value;
    } else if (type === "name") {
      newFilters.name = value;
    } else if (type === "clear") {
      newFilters = { name: "", type: "" };
      setSearchValue("");
    }

    setFilters(newFilters);
    fetchGroups(newFilters);
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
          onClick={handleRefresh}
        >
          Reload
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex gap-2 items-center mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              {filters.type ? formatString(filters.type) : "All Types"}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleFilters("type", "all")}>
              All Types
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilters("type", "system")}>
              System
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilters("type", "store")}>
              Store
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilters("type", "customer")}>
              Customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Input
          placeholder="Filter by name..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-8 text-xs pr-10"
          onKeyDown={(e) =>
            e.key === "Enter" && handleFilters("name", searchValue)
          }
        />
        <Button
          className="h-8 px-2 py-0"
          variant="outline"
          onClick={() => handleFilters("name", searchValue)}
        >
          <Search className="mr-1 h-4 w-4" />
          Search
        </Button>

        {(filters.name || filters.type) && (
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
              Columns
              <ChevronDown className="ml-1 h-4 w-4" />
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

      <div className="rounded-md border bg-sidebar">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead key={column.id} className="px-6 py-4 font-medium">
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="h-24">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Please wait</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : groups.length ? (
              groups.map((group) => (
                <TableRow key={group.id} className="h-14">
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id} className="px-6 py-4">
                      {column.render({
                        row: group,
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
                  No groups found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default GroupsDataTable;
