import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  UserCog,
  Truck,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  Store,
  Edit,
  X,
  User,
  SquareUser,
  Clock,
  CalendarDays,
  Paperclip,
  Tag,
  FileText,
  UserCircle,
} from "lucide-react";
import { storeService } from "@/services/basicService";
import StaffEditForm from "./StaffEditForm";
import { formatString } from "@/utils/formatter";
import InformationTile from "@/components/common/InformationTile";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { fi } from "date-fns/locale";

export function StaffDetailsPanel({ staffId, onStaffIdChange, onStatusChange }) {
  const [staffDetails, setStaffDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [loadStatus, setLoadStatus] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (staffId) {
      fetchStaffDetails(staffId);
    } else {
      setStaffDetails(null);
    }
  }, [staffId, open]);

  const fetchStaffDetails = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await storeService.getStaffById(id);
      console.log(response)
      if (response.success) {
        setStaffDetails(response.staff);
        setIsActive(response.staff.user.is_active)
        setLoading(false);
      } else {
        setError(response.message || "Failed to load staff details");
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch staff details:", err);
      setError("Could not load staff details. Please try again later.");
      setLoading(false);
    }
  };

  const disableStaff = async () => {
    setLoadStatus(true);
    setError(null);
    try {
      const response = await storeService.disableStaff(staffId);
      console.log(response);
      if (response.success) {
        toast.success(response.message);
        setIsActive(response.isActive);
        fetchStaffDetails(staffId);
      } else {
        toast.error(response.message || "Failed to update staff status:");
      }
    } catch (err) {
      console.error("Failed to update staff status:", err);
      toast.error("Could not update staff status. Please try again later.");
    } finally {
      setLoadStatus(false);
    }
  }

  if (!staffId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
        <UserCog className="h-12 w-12 mb-4 opacity-20" />
        <h3 className="text-lg font-medium mb-1">No Staff Selected</h3>
        <p className="text-sm">Select a staff member to view details</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading staff details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button variant="outline" onClick={() => fetchStaffDetails(staffId)}>
          Retry
        </Button>
      </div>
    );
  }

  if (!staffDetails) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Staff Details</h2>
        <div className="flex gap-2">
          {user?.group?.name === 'manager' &&
            (
              <Button
                variant="outline"
                size="sm"
                onClick={disableStaff}
                disabled={loadStatus}
              >
                {!isActive
                  ?
                  <CheckCircle className="h-4 w-4 mr-2" />
                  :
                  <XCircle className="h-4 w-4 mr-2" />
                }
                {!isActive ? 'Enable' : 'Disable'}
              </Button>
            )}

          {/* //neu nguoi dang xem la manager => id nguoi do phai bang voi id nguoi duoc chon
          hoac nguoi duoc chon khong phai la manager   */}
          {user?.group?.name === "manager" ? (user.id === staffDetails.user_id || staffDetails.user?.group?.name !== 'manager')
            &&
            (<Button variant="default" size="sm" onClick={() => setOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            ) : (
            <>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="mb-6">
            <p className="text-md font-semibold mb-2">Profile</p>
            <div className="space-y-0.5 rounded-lg overflow-hidden border border-card">
              <InformationTile
                icon={<UserCircle className="h-5 w-5 text-muted-foreground" />}
                title="Full Name"
                action={
                  <span className="text-md font-semibold">
                    {staffDetails.full_name}
                  </span>
                }
              />

              <InformationTile
                icon={<User className="h-5 w-5 text-muted-foreground" />}
                title="Username"
                action={
                  <span className="text-md">{staffDetails.username}</span>
                }
              />

              <InformationTile
                icon={<Mail className="h-5 w-5 text-muted-foreground" />}
                title="Email"
                action={<span className="text-md">{staffDetails.email}</span>}
              />

              <InformationTile
                icon={<Phone className="h-5 w-5 text-muted-foreground" />}
                title="Phone"
                action={
                  <span className="text-md">
                    {staffDetails.phone || "Not provided yet"}
                  </span>
                }
              />

              {staffDetails.address && (
                <InformationTile
                  icon={<Store className="h-5 w-5 text-muted-foreground" />}
                  title="Address"
                  action={
                    <span className="text-md">{staffDetails.address}</span>
                  }
                />
              )}

              <InformationTile
                icon={<Tag className="h-5 w-5 text-muted-foreground" />}
                title="Role"
                action={
                  <Badge variant="secondary">
                    {formatString(staffDetails.user?.group?.name)}
                  </Badge>
                }
              />

              <InformationTile
                icon={<Clock className="h-5 w-5 text-muted-foreground" />}
                title="Last Login"
                action={
                  <span className="text-sm">
                    {new Date(staffDetails.user.updated_at).toLocaleString()}
                  </span>
                }
              />

              <InformationTile
                icon={
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                }
                title="Joined"
                action={
                  <span className="text-sm">
                    {new Date(staffDetails.created_at).toLocaleString()}
                  </span>
                }
              />
            </div>
          </div>

          {staffDetails.user?.group?.name === 'courier' && (
            <div className="mb-6">
              <p className="text-md font-semibold mb-2">Courier Information</p>
              <div className="space-y-0.5 rounded-lg overflow-hidden border border-card">
                <InformationTile
                  icon={<Truck className="h-5 w-5 text-muted-foreground" />}
                  title="Vehicle Type"
                  action={
                    <span className="text-md">{staffDetails.vehicle_type}</span>
                  }
                />

                <InformationTile
                  icon={<Paperclip className="h-5 w-5 text-muted-foreground" />}
                  title="Vehicle Plate"
                  action={
                    <span className="text-md">
                      {staffDetails.vehicle_plate}
                    </span>
                  }
                />

                <InformationTile
                  icon={<FileText className="h-5 w-5 text-muted-foreground" />}
                  title="Status"
                  action={
                    <Badge
                      variant={
                        staffDetails.is_courier_active ? "success" : "secondary"
                      }
                    >
                      {staffDetails.is_courier_active ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-1" />
                      )}
                      {staffDetails.is_courier_active ? "Active" : "Inactive"}
                    </Badge>
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <StaffEditForm
        open={open}
        onClose={() => setOpen(false)}
        staffId={staffId}
        refresh={onStatusChange}
      />
    </div >
  );
}

export default StaffDetailsPanel;
