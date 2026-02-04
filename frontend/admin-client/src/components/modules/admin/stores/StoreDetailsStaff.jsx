import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import storeManagementService from "@/services/store/storeManagementService";
import {
  UsersIcon,
  UserPlus,
  Mail,
  Phone,
  UserCog,
  Car,
  Bike,
  ToggleLeft,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import accountManagementService from "@/services/user/accountManagementService";
import VerticalAccountCard from "@/components/common/VerticalAccountCard";

export default function StoreDetailsStaff({ store, onStaffUpdate }) {
  const [members] = useState(store?.members || []);

  const roleBadgeVariant = (role) => {
    switch (role.toLowerCase()) {
      case "manager":
        return "success";
      case "courier":
        return "info";
      case "sale_agent":
        return "warning";
      default:
        return "secondary";
    }
  };

  const toggleMemberStatus = async (memberId) => {
    try {
      await accountManagementService.toggleUserStatus(memberId);
      toast.success("Member status updated successfully");
      if (onStaffUpdate) {
        onStaffUpdate();
      }
    } catch (error) {
      toast.error(error.message || "Failed to update member status");
    }
  };

  return (
    <VerticalAccountCard
      title={
        <>
          <UsersIcon className="mr-2 h-5 w-5" /> Staff Members
        </>
      }
    >
      <div className=" -mx-4 -my-6">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className=" font-medium">Name</TableHead>
              <TableHead className=" font-medium">Email</TableHead>
              <TableHead className=" font-medium">Phone</TableHead>
              <TableHead className=" font-medium">Role</TableHead>
              <TableHead className=" font-medium">Status</TableHead>
              <TableHead className=" font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 px-6">
                  No staff members found
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium ">
                    {member.full_name}
                    {member.role === "courier" && member.is_courier_active && (
                      <Badge variant="outline" className="ml-2">
                        {member.vehicle_info?.vehicle_type === "motorcycle" ? (
                          <Bike className="h-3 w-3 mr-1" />
                        ) : (
                          <Car className="h-3 w-3 mr-1" />
                        )}
                        {member.vehicle_info?.vehicle_plate}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
                      {member.email}
                    </div>
                  </TableCell>
                  <TableCell className="">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                      {member.phone || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="">
                    <Badge
                      variant={roleBadgeVariant(member.role)}
                      className="capitalize"
                    >
                      {member.role.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="">
                    <div className="flex space-x-2">
                      <Badge
                        variant={member.is_active ? "outline" : "destructive"}
                      >
                        {member.is_active ? "Active" : "Disabled"}
                      </Badge>
                      {member.role === "courier" && (
                        <Badge
                          variant={member.is_available ? "success" : "warning"}
                        >
                          {member.is_available ? "Available" : "Unavailable"}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right ">
                    <div className="flex justify-end space-x-2">
                      <ConfirmationDialog
                        title={
                          member.is_active
                            ? "Disable Member"
                            : "Activate Member"
                        }
                        description={`Are you sure you want to ${
                          member.is_active ? "disable" : "activate"
                        } ${member.full_name}?`}
                        confirmText={member.is_active ? "Disable" : "Activate"}
                        confirmVariant={
                          member.is_active ? "destructive" : "default"
                        }
                        onConfirm={() => toggleMemberStatus(member.id)}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${
                            member.is_active
                              ? "text-destructive"
                              : "text-primary"
                          }`}
                        >
                          {member.is_active ? "Disable" : "Activate"}
                        </Button>
                      </ConfirmationDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </VerticalAccountCard>
  );
}

export function AddMemberDialog({ storeId, onMemberAdded, trigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "sale_agent",
    full_name: "",
    phone: "",
    vehicle_type: "motorcycle",
    vehicle_plate: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (value) => {
    setFormData({
      ...formData,
      role: value,
    });
  };

  const handleVehicleTypeChange = (value) => {
    setFormData({
      ...formData,
      vehicle_type: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.full_name) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    }

    if (formData.role === "courier") {
      if (!formData.vehicle_plate) {
        newErrors.vehicle_plate = "Vehicle plate number is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const memberData = {
        ...formData,
      };

      if (formData.role !== "courier") {
        delete memberData.vehicle_type;
        delete memberData.vehicle_plate;
      }

      await storeManagementService.addStoreMember(storeId, memberData);

      toast.success(
        `${formData.full_name} has been added to the store staff successfully.`
      );

      setIsOpen(false);
      resetForm();

      if (onMemberAdded) {
        onMemberAdded();
      }
    } catch (error) {
      toast.error(
        error.message || "Failed to add staff member. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      role: "sale_agent",
      full_name: "",
      phone: "",
      vehicle_type: "motorcycle",
      vehicle_plate: "",
    });
    setErrors({});
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Store Staff Member</DialogTitle>
          <DialogDescription>
            Create a new account for a staff member of this store.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "border-destructive" : ""}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-destructive text-sm">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">Store Manager</SelectItem>
                <SelectItem value="sale_agent">Sales Agent</SelectItem>
                <SelectItem value="courier">Courier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={errors.full_name ? "border-destructive" : ""}
            />
            {errors.full_name && (
              <p className="text-destructive text-sm">{errors.full_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-destructive text-sm">{errors.phone}</p>
            )}
          </div>

          {formData.role === "courier" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="vehicle_type">Vehicle Type *</Label>
                <Select
                  value={formData.vehicle_type}
                  onValueChange={handleVehicleTypeChange}
                >
                  <SelectTrigger id="vehicle_type">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="bicycle">Bicycle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle_plate">Vehicle Plate *</Label>
                <Input
                  id="vehicle_plate"
                  name="vehicle_plate"
                  value={formData.vehicle_plate}
                  onChange={handleChange}
                  className={errors.vehicle_plate ? "border-destructive" : ""}
                />
                {errors.vehicle_plate && (
                  <p className="text-destructive text-sm">
                    {errors.vehicle_plate}
                  </p>
                )}
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
