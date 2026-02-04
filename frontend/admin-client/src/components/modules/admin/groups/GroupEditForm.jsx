import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Loader2,
  Search,
  Filter,
  ChevronDown,
  AlertCircleIcon,
  MessageSquare,
  FileText,
  Layers,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import groupService from "@/services/groups/groupService";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import TextField from "@/components/common/TextField";
import LargeTextField from "@/components/common/LargeTextField";
import SelectField from "@/components/common/SelectField";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GroupEditForm = forwardRef(({ id, isCreateMode = false }, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [allPermissions, setAllPermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [assignedPermission, setAssignedPermission] = useState([]);
  const [removePermission, setRemovePermission] = useState([]);
  const [addPermission, setAddPermission] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectionFilter, setSelectionFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const form = useForm({
    defaultValues: {
      name: "",
      type: "",
      description: "",
    },
  });

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit,
    isLoading,
    fetchLoading,
    error,
  }));

  const getAssignedPermissions = async () => {
    if (!id) return;

    setFetchLoading(true);
    setError(null);
    try {
      const response = await groupService.getPermissionByGroupId(id);
      if (response.success) {
        setAssignedPermission(response.data);
      } else {
        setError("Failed to load current permission");
        toast.error("Failed to load current permission");
      }
    } catch (error) {
      console.error("Error fetching group details:", error);
      setError("Failed to load current permission");
      toast.error("Failed to load current permission");
    } finally {
      setFetchLoading(false);
    }
  };

  const handelAddPermission = (permission_id) => {
    setRemovePermission((prev) => prev.filter((id) => id !== permission_id));
    setAddPermission((prev) => {
      if (!prev.includes(permission_id)) {
        return [...prev, permission_id];
      }
      return prev;
    });
    setAssignedPermission((prev) => {
      const existingPermission = prev.find((p) => p.id === permission_id);
      if (!existingPermission) {
        return [...prev, { id: permission_id }];
      }
      return prev;
    });
  };

  const handleRemovePermission = (permission_id) => {
    setAddPermission((prev) => prev.filter((id) => id !== permission_id));
    setRemovePermission((prev) => {
      if (!prev.includes(permission_id)) {
        return [...prev, permission_id];
      }
      return prev;
    });
    setAssignedPermission((prev) => prev.filter((p) => p.id !== permission_id));
  };

  const fetchGroupDetails = async () => {
    if (!id) return;

    setFetchLoading(true);
    setError(null);

    try {
      const response = await groupService.getGroupById(id);
      if (response.success) {
        form.reset({
          name: response.data.name,
          type: response.data.type,
          description: response.data.description || "",
        });
      } else {
        setError("Failed to load group details");
      }
    } catch (err) {
      console.error("Error fetching group details:", err);
      setError("Failed to load group details");
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchAllPermissions = async () => {
    setPermissionsLoading(true);
    try {
      const response = await groupService.getAllPermissions();
      if (response.success) {
        setAllPermissions(response.data || []);
      } else {
        toast.error("Failed to load permissions");
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
      toast.error("Failed to load permissions");
    } finally {
      setPermissionsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPermissions();

    if (id) {
      fetchGroupDetails();
      getAssignedPermissions();
    }
  }, [id]);

  const handleSubmit = async () => {
    const values = form.getValues();

    if (!values.name || !values.type) {
      setValidationErrors({
        ...(!values.name && { name: "Name is required" }),
        ...(!values.type && { type: "Type is required" }),
      });
      return false;
    }

    const updateData = {
      ...values,
    };

    setIsLoading(true);
    try {
      let response;

      if (isCreateMode) {
        response = await groupService.addGroup(updateData);

        if (response.success) {
          if (assignedPermission.length > 0) {
            for (const permission of assignedPermission) {
              await groupService.addPermission(permission.id, response.groupId);
            }
          }
        }
      } else {
        response = await groupService.updateGroup(id, updateData);

        if (response.success) {
          if (removePermission.length > 0) {
            for (let i = 0; i < removePermission.length; i++) {
              await groupService.removePermission(removePermission[i], id);
            }
          }
          if (addPermission.length > 0) {
            for (let i = 0; i < addPermission.length; i++) {
              await groupService.addPermission(addPermission[i], id);
            }
          }
        }
      }

      if (response.success) {
        toast.success(
          response.message ||
          (isCreateMode
            ? "Group created successfully"
            : "Group updated successfully")
        );
        return response.data || response;
      } else {
        toast.error(
          response.message ||
          (isCreateMode ? "Failed to create group" : "Failed to update group")
        );
        return false;
      }
    } catch (error) {
      console.error(
        isCreateMode ? "Error creating group:" : "Error updating group:",
        error
      );
      toast.error(
        error.message ||
        (isCreateMode ? "Failed to create group" : "Failed to update group")
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const isPermissionAssigned = (permissionId) => {
    return assignedPermission.some((p) => p.id === permissionId);
  };

  const togglePermission = (permissionId) => {
    const isAssigned = isPermissionAssigned(permissionId);
    if (isAssigned) {
      handleRemovePermission(permissionId);
    } else {
      handelAddPermission(permissionId);
    }
  };

  const filteredPermissions = allPermissions.filter((permission) => {
    const matchesSearch = searchQuery
      ? permission.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      permission.url?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const isAssigned = isPermissionAssigned(permission.id);
    const matchesSelection =
      selectionFilter === "all"
        ? true
        : selectionFilter === "selected"
          ? isAssigned
          : selectionFilter === "unselected"
            ? !isAssigned
            : true;

    const matchesMethod =
      methodFilter === "all"
        ? true
        : permission.http_method?.toUpperCase() === methodFilter;

    return matchesSearch && matchesSelection && matchesMethod;
  });

  return (
    <div className="w-full h-full">
      {fetchLoading && !isCreateMode ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading group details...</span>
        </div>
      ) : error ? (
        <div className="text-center text-destructive py-4">{error}</div>
      ) : (
        <Form {...form}>
          <form className="w-full h-full">
            <ResizablePanelGroup
              direction="horizontal"
              className="w-full h-full"
            >
              <ResizablePanel defaultSize={40} minSize={30}>
                <div className="p-6 h-full overflow-auto">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold pb-2">
                      {isCreateMode ? "Create New Group" : "Edit Group"}
                    </h2>
                    {!isCreateMode && (
                      <Alert variant="warning">
                        <AlertCircleIcon />
                        <AlertTitle>Caution</AlertTitle>
                        <AlertDescription>
                          <p>
                            Modify the group details with care. Changes here can
                            affect access to the whole application.
                          </p>
                        </AlertDescription>
                      </Alert>
                    )}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <TextField
                              id="name"
                              label="Name"
                              required={true}
                              error={validationErrors.name}
                              value={field.value}
                              icon={<Users />}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <SelectField
                              id="groupType"
                              label="Group Type"
                              value={field.value}
                              onChange={field.onChange}
                              options={[
                                { value: "system", display: "System" },
                                { value: "store", display: "Store" },
                                { value: "customer", display: "Customer" },
                              ]}
                              icon={<Layers />}
                              error={validationErrors.type}
                              required={true}
                              placeholder="Select group type"
                            />
                          </FormControl>
                          {validationErrors.type && (
                            <FormMessage>{validationErrors.type}</FormMessage>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <LargeTextField
                              id="description"
                              label="Description"
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              rows={5}
                              icon={<FileText />}
                              placeholder="Enter group description"
                              required={false}
                              showCharCount={true}
                              maxLength={500}
                              helpText="Provide information about this group's purpose and permissions"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel defaultSize={60} minSize={40}>
                <div className="h-full flex flex-col">
                  {permissionsLoading ? (
                    <div className="p-6 flex justify-center items-center">
                      <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
                      <span>Loading permissions...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="p-4 border-b flex flex-wrap items-center gap-3 shrink-0">
                        <div className="relative flex-1 min-w-[200px]">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search permissions..."
                            className="pl-8 h-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9">
                              Show:{" "}
                              {selectionFilter === "all"
                                ? "All"
                                : selectionFilter === "selected"
                                  ? "Selected"
                                  : "Unselected"}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuRadioGroup
                              value={selectionFilter}
                              onValueChange={setSelectionFilter}
                            >
                              <DropdownMenuRadioItem value="all">
                                All
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="selected">
                                Selected
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="unselected">
                                Unselected
                              </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9">
                              Method:{" "}
                              {methodFilter === "all" ? "All" : methodFilter}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuRadioGroup
                              value={methodFilter}
                              onValueChange={setMethodFilter}
                            >
                              <DropdownMenuRadioItem value="all">
                                All
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="GET">
                                GET
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="POST">
                                POST
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="PUT">
                                PUT
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="DELETE">
                                DELETE
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="PATCH">
                                PATCH
                              </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <div className="h-full overflow-auto">
                          <Table className="relative w-full">
                            <TableHeader className="sticky top-0 bg-background z-10">
                              <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead className="w-[250px]">
                                  Description
                                </TableHead>
                                <TableHead className="w-[100px]">
                                  Method
                                </TableHead>
                                <TableHead>URL</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredPermissions.length === 0 ? (
                                <TableRow>
                                  <TableCell
                                    colSpan={5}
                                    className="text-center py-4"
                                  >
                                    No permissions match your filters
                                  </TableCell>
                                </TableRow>
                              ) : (
                                filteredPermissions.map((permission) => {
                                  const isAssigned = isPermissionAssigned(
                                    permission.id
                                  );
                                  return (
                                    <TableRow
                                      key={permission.id}
                                      className={cn(
                                        "cursor-pointer transition-colors",
                                        isAssigned
                                          ? "bg-primary/20 hover:bg-primary/30"
                                          : "hover:bg-muted/50"
                                      )}
                                      onClick={() =>
                                        togglePermission(permission.id)
                                      }
                                    >
                                      <TableCell
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Checkbox
                                          checked={isAssigned}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              handelAddPermission(
                                                permission.id
                                              );
                                            } else {
                                              handleRemovePermission(
                                                permission.id
                                              );
                                            }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell>{permission.id}</TableCell>
                                      <TableCell>
                                        {permission.description}
                                      </TableCell>
                                      <TableCell>
                                        {permission.http_method}
                                      </TableCell>
                                      <TableCell className="truncate max-w-[300px]">
                                        {permission.url}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </form>
        </Form>
      )}
    </div>
  );
});

GroupEditForm.displayName = "GroupEditForm";
export default GroupEditForm;
