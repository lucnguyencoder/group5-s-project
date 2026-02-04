import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { User, Bike, Phone, Mail } from "lucide-react";
import TextField from "@/components/common/TextField";
import { storeService } from "@/services/basicService";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { formatName, formatString } from "@/utils/formatter";
import { validateEmail, validateFullName, validatePhone } from "@/utils/validators";


const StaffEditForm = ({ open, onClose, staffId, refresh }) => {
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    vehicle_plate: "",
    vehicle_type: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("");
  const [originRole, setOriginRole] = useState('');

  useEffect(() => {
    if (open && staffId) {
      fetchInfo();
    }
  }, [open, staffId])

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };



  const fetchInfo = async () => {
    const data = await storeService.getStaffById(staffId);
    setFormData({
      username: data.staff.username,
      full_name: data.staff.full_name,
      email: data.staff.email,
      vehicle_plate: data.staff.vehicle_plate,
      vehicle_type: data.staff.vehicle_type,
      phone: data.staff.phone,
    });
    setRole(String(data.staff.user.group_id));
    setOriginRole(String(data.staff.user.group_id));
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const validatedEmail = validateEmail(formData.email);
      const validatedPhone = validatePhone(formData.phone);
      const validatedName = validateFullName(formData.full_name);
      if (role === "5") {
        if (!formData.vehicle_plate || !formData.vehicle_type) {
          toast.error("Vehicle plate and type are required for couriers.");
          return;
        }
      }
      if (validatedName) {
        toast.error(validatedName);
        return;
      }
      if (validatedEmail) {
        toast.error(validatedEmail);
        return;
      }
      if (validatedName) {
        toast.error(validatedName);
        return;
      }
      if (validatedPhone) {
        toast.error(validatedPhone);
        return;
      }
      formData.full_name = formatName(formData.full_name);
      const response = await storeService.updateStaff(staffId, formData);
      if (role !== originRole) {
        await storeService.changeRole(staffId, parseInt(role));
      }
      if (response.success) {
        toast.success("Profile updated successfully!");
        refresh();
        onClose();
      }
      else {
        toast.error(response.message);
        onClose();
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-4">
          <div className="flex flex-col gap-4">
            <TextField
              id='full_name'
              label='Name'
              value={formData.full_name || ''}
              onChange={(e) => handleChange("full_name", e.target.value)}
            />
            <TextField
              id="username"
              label="Username"
              value={formData.username || ''}
              onChange={(e) => handleChange("username", e.target.value)}
            />
            <TextField
              id="email"
              label="Email"
              value={formData.email || ''}
              onChange={(e) => handleChange("email", e.target.value)}
              icon={<Mail />}
              error={errors.phone}
            />
            <TextField
              id="phone"
              label="Phone Number"
              value={formData.phone || ''}
              onChange={(e) => handleChange("phone", e.target.value)}
              icon={<Phone />}
              error={errors.phone}
            />
            {role !== "3" && (
              <Select value={String(role)} onValueChange={(value) => setRole(value)}>
                <SelectTrigger >
                  <SelectValue placeholder={"Select Role"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">Sale Agent</SelectItem>
                  <SelectItem value="5">Courier</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          {role === "5" && (
            <div className="flex flex-col gap-4">
              <TextField
                id="vehicle_plate"
                label="Vehicle Plate"
                value={formData.vehicle_plate || ''}
                onChange={(e) => handleChange("vehicle_plate", e.target.value)}
                icon={<Bike />}
              />
              <Select
                value={formData.vehicle_type ? formData.vehicle_type : ''}
                onValueChange={(value) => handleChange("vehicle_type", value)}
              >
                <SelectTrigger className='w-full p-6' id="vehicle_type">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="bicycle">Bicycle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={() => handleSubmit()} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog >
  );
};

export default StaffEditForm;