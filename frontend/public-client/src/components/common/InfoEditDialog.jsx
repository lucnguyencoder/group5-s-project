import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TextField from "@/components/common/TextField";
import DateField from "@/components/common/DateField";
import SelectField from "@/components/common/SelectField";
import { User, Calendar, Users } from "lucide-react";

function InfoEditDialog({
  open,
  onClose,
  title,
  fieldType,
  formData,
  onChange,
  onSave,
  loading,
  options,
  maxDate,
  description,
}) {
  const renderField = () => {
    switch (fieldType) {
      case "full_name":
        return (
          <TextField
            id="full_name"
            name="full_name"
            label="Full Name"
            value={formData.full_name}
            onChange={onChange}
            icon={<User className="h-5 w-5" />}
          />
        );
      case "gender":
        return (
          <SelectField
            id="gender"
            label="Gender"
            value={formData.gender}
            options={options}
            onChange={(value) =>
              onChange({ target: { name: "gender", value } })
            }
            icon={<Users className="h-5 w-5" />}
            placeholder="Select gender"
          />
        );
      case "date_of_birth":
        return (
          <DateField
            id="date_of_birth"
            label="Date of Birth"
            value={
              formData.date_of_birth && formData.date_of_birth !== ""
                ? new Date(formData.date_of_birth)
                : null
            }
            onChange={(date) => {
              onChange({
                target: { name: "date_of_birth", value: date },
              });
            }}
            icon={<Calendar className="h-5 w-5" />}
            maxDate={maxDate}
            placeholder="Select date of birth"
          />
        );
      default:
        return null;
    }
  };

  const descriptionText = {
    full_name:
      "Anyone can see this info when they communicate with you or view content you create in Yami Platform.",
    gender:
      "This info is private. Only you can see it. Your gender may be used for personalization across Yami Platform, including how we refer to you.",
    date_of_birth:
      "This info is private. Only you can see it. We need it to verify your age before giving you access to certain features.",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">{renderField()}</div>
        {descriptionText[fieldType] && (
          <p className="text-sm text-muted-foreground -mt-4 mb-2">
            {descriptionText[fieldType]}
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default InfoEditDialog;
