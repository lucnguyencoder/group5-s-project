import Button12 from "@/components/common/Button12";
import TextField from "@/components/common/TextField";
import VerticalAccountCard from "@/components/common/VerticalAccountCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/UserContext";
import { ChevronRight, Save, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import authService from "@/services/authService";
import { validateFullName, validatePhone } from "@/utils/validators";
import { formatName } from "@/utils/formatter";

function PersonalInfoForm() {
  const { user, setUser } = useUser();
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState({
    full_name: user.profile?.full_name,
    phone_number: user.profile?.phone_number,
  });

  const handleEdit = (field) => {
    setEditingField(field);
    setEditValue({
      full_name: user.profile?.full_name || "",
      phone_number: user.profile?.phone_number || "",
    });
  };

  const handleSave = async () => {
    try {
      if (editingField === 'fullName') {
        const validatedFullName = validateFullName(editValue.full_name);
        if (validatedFullName) {
          toast.error(validatedFullName);
          return;
        }
        editValue.full_name = formatName(editValue.full_name);
      }
      if (editingField === 'phone') {
        const validatedPhone = validatePhone(editValue.phone_number);
        if (validatedPhone) {
          toast.error(validatedPhone);
          return;
        }
      }
      const response = await authService.updateProfile(user.id, editValue);
      if (response.success) {
        toast.success('Updated!');
        if (setUser) {
          setUser(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              ...editValue
            }
          }));
        };
        setEditingField(null)
      }
      else {
        toast.error('Error during update: ' + response.message);
      }
    }
    catch (error) {
      toast.error('Error during update: ' + error);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  return (
    <VerticalAccountCard title="Basic Information">
      <div className="flex flex-col">
        <Button12
          title="Email"
          variant="ghost"
          description={user?.email || "Not provided yet"}
          cursor={false}
        />
        <Separator />

        {editingField === "fullName" ? (
          <div className="p-4 flex flex-col gap-2">
            <span className="font-medium">Full Name</span>
            <TextField
              id="fullName"
              value={editValue.full_name}
              onChange={(e) => setEditValue((prev) => ({ ...prev, full_name: e.target.value }))}
              label="Full Name"
              autoFocus
            />
            <div className="flex gap-2 justify-end mt-2">
              <Button
                onClick={handleSave}
                size="sm"
                className="flex items-center"
              >
                <Save size={16} className="mr-1" /> Save
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <X size={16} className="mr-1" /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button12
            title="Full Name"
            variant="ghost"
            description={user?.profile?.full_name || "Not provided yet"}
            right={<ChevronRight />}
            cursor={true}
            onClick={() => handleEdit("fullName")}
          />
        )}
        <Separator />

        {/* Phone Number (editable) */}
        {editingField === "phone" ? (
          <div className="p-4 flex flex-col gap-2">
            <span className="font-medium">Phone Number</span>
            <TextField
              id="phone"
              type="tel"
              value={editValue.phone_number}
              onChange={(e) => setEditValue((prev) => ({ ...prev, phone_number: e.target.value }))}
              label="Phone Number"
              autoFocus
            />
            <div className="flex gap-2 justify-end mt-2">
              <Button
                onClick={handleSave}
                size="sm"
                className="flex items-center"
              >
                <Save size={16} className="mr-1" /> Save
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <X size={16} className="mr-1" /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button12
            title="Phone Number"
            variant="ghost"
            description={user?.profile?.phone_number || "Not provided yet"}
            right={<ChevronRight />}
            cursor={true}
            onClick={() => handleEdit("phone")}
          />
        )}
        <Separator />
        {/* gender */}
      </div>
    </VerticalAccountCard>
  );
}

export default PersonalInfoForm;
