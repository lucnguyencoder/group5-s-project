import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddMemberDialog } from "./StoreDetailsStaff";
import {
  Store,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  Edit,
  Save,
  X,
  AlertTriangle,
  Ban,
  CheckCircle,
  Settings,
  UserPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import storeManagementService from "@/services/store/storeManagementService";
import { Label } from "@/components/ui/label";
import { StoresStatusDialog } from "./StoresStatusDialog";
import VerticalAccountCard from "@/components/common/VerticalAccountCard";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function StoreDetailsInformation({ store, onStoreUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: store?.name || "",
    description: store?.description || "",
    address: store?.address || "",
    phone: store?.phone || "",
    email: store?.email || "",
    opening_time: store?.opening_time?.substring(0, 5) || "09:00",
    closing_time: store?.closing_time?.substring(0, 5) || "22:00",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = () => {
    setFormData({
      name: store?.name || "",
      description: store?.description || "",
      address: store?.address || "",
      phone: store?.phone || "",
      email: store?.email || "",
      opening_time: store?.opening_time?.substring(0, 5) || "09:00",
      closing_time: store?.closing_time?.substring(0, 5) || "22:00",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await storeManagementService.updateStore(store.id, formData);
      toast.success("Store information updated successfully");
      setIsEditing(false);
      if (onStoreUpdate) {
        onStoreUpdate();
      }
    } catch (error) {
      toast.error(error.message || "Failed to update store information");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!store) return null;

    if (!store.isActive) {
      return <Badge variant="destructive">disable</Badge>;
    } else if (store.isTempClosed) {
      return <Badge variant="warning">Temporarily Closed</Badge>;
    } else {
      return <Badge variant="primary">Active</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-5 gap-6">
      {/* Left Column (60%) - Store Information */}
      <div className="col-span-3">
        <VerticalAccountCard
          title={
            <>
              <Store className="mr-2 h-5 w-5" /> Store Information
            </>
          }
        >
          {isEditing ? (
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opening_time">Opening Time</Label>
                  <Input
                    id="opening_time"
                    name="opening_time"
                    type="time"
                    value={formData.opening_time}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="closing_time">Closing Time</Label>
                  <Input
                    id="closing_time"
                    name="closing_time"
                    type="time"
                    value={formData.closing_time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <Table className="w-full">
                <TableBody>
                  <TableRow className="h-12">
                    <TableCell className="font-medium w-1/3 px-6 py-4">
                      Status
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {getStatusBadge()}
                    </TableCell>
                  </TableRow>
                  <TableRow className="h-12">
                    <TableCell className="font-medium px-6 py-4">
                      Store Name
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {store?.name || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow className="h-12">
                    <TableCell className="font-medium px-6 py-4">
                      Description
                    </TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground">
                      {store?.description || "No description available"}
                    </TableCell>
                  </TableRow>
                  <TableRow className="h-12">
                    <TableCell className="font-medium px-6 py-4">
                      Address
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{store?.address || "No address available"}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="h-12">
                    <TableCell className="font-medium px-6 py-4">
                      Phone Number
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {store?.phone || "No phone number available"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="h-12">
                    <TableCell className="font-medium px-6 py-4">
                      Email
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{store?.email || "No email available"}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="h-12">
                    <TableCell className="font-medium px-6 py-4">
                      Operating Hours
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          Opens {store?.opening_time?.substring(0, 5) || "N/A"}{" "}
                          - Closes{" "}
                          {store?.closing_time?.substring(0, 5) || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="h-12">
                    <TableCell className="font-medium px-6 py-4">
                      Created On
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {store?.created_at
                            ? new Date(store.created_at).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </VerticalAccountCard>
      </div>

      <div className="col-span-2">
        <VerticalAccountCard
          title={
            <>
              <Settings className="mr-2 h-5 w-5" /> Store Actions
            </>
          }
        >
          <div className="space-y-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start"
              onClick={handleEdit}
              disabled={isEditing}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Store Information
            </Button>

            <StoresStatusDialog
              id={store?.id}
              name={store?.name}
              isActive={store?.isActive}
              isTempClosed={false}
              type="status"
              onStatusChange={onStoreUpdate}
            >
              <Button
                variant={store?.isActive ? "destructive" : "default"}
                size="lg"
                className="w-full justify-start"
              >
                {store?.isActive ? (
                  <>
                    <Ban className="h-4 w-4 mr-2" />
                    Disable Store
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Activate Store
                  </>
                )}
              </Button>
            </StoresStatusDialog>

            {store?.isActive ? (
              <StoresStatusDialog
                id={store?.id}
                name={store?.name}
                isActive={store?.isActive}
                isTempClosed={store?.isTempClosed}
                type="temp"
                onStatusChange={onStoreUpdate}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start"
                >
                  {store?.isTempClosed ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Reopen Store
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Temporarily Close
                    </>
                  )}
                </Button>
              </StoresStatusDialog>
            ) : (
              <></>
            )}
          </div>
        </VerticalAccountCard>
      </div>
    </div>
  );
}
