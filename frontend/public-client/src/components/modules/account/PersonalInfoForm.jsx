import ProfileInformationCard from "@/components/common/ProfileInformationCard";
import { useUser } from "@/context/UserContext";
import {
  User,
  Calendar,
  Users,
  Mail,
  Shield,
  CheckCircle,
  Lock,
  ShieldCheck,
  ChevronRight,
  VenusAndMars,
  Cake,
  KeyRound,
  RectangleEllipsis,
  Edit,
  Trash,
  Upload,
  X,
  Camera,
  Image,
  Loader2,
  ImageUp,
  LaptopMinimal,
  Clock,
  Key,
  RotateCcwKey,
} from "lucide-react";
import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { subYears } from "date-fns";
import InfoEditDialog from "@/components/common/InfoEditDialog";
import { validateChangePasswordForm } from "@/utils/validation/changePassword";
import TextField from "@/components/common/TextField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import UserAvatar from "../common/UserAvatar";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Badge } from "@/components/ui/badge";
import { User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/formatter";

function PersonalInfoForm() {
  const {
    user,
    updateProfile,
    changePassword,
    toggle2Fa,
    uploadAvatar,
    removeAvatar,
  } = useUser();
  const [dialogField, setDialogField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.profile?.full_name || "",
    date_of_birth: user?.profile?.date_of_birth || "",
    gender: user?.profile?.gender || "",
  });

  // Avatar state
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  // 2FA state
  const [is2fa, set2Fa] = useState(user?.is_enabled_2fa);
  const [isToggling, setIsToggling] = useState(false);

  // Password change state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    current_password: "",
    new_password: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordServerError, setPasswordServerError] = useState("");

  // Calculate maximum date (must be at least 13 years old)
  const maxDate = subYears(new Date(), 13);

  const genderOptions = [
    { value: "male", display: "Male" },
    { value: "female", display: "Female" },
    { value: "other", display: "Other" },
  ];

  // Avatar functions
  function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
    setIsCropping(true);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed!");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Maximum size is 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsCropping(true);
  };

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            return;
          }
          blob.name = selectedFile.name;
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile || !completedCrop) return;

    setIsUploading(true);
    try {
      // Get the cropped image
      const croppedImage = await getCroppedImg(imgRef.current, completedCrop);

      // Create a new file from the blob with the original file name
      const croppedFile = new File([croppedImage], selectedFile.name, {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      });

      const response = await uploadAvatar(croppedFile);
      if (response.success) {
        setIsAvatarDialogOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        setCrop(undefined);
        setCompletedCrop(null);
        setIsCropping(false);
        // Reload the page after successful avatar upload
        window.location.reload();
      } else {
        toast.error(response.message || "Failed to upload avatar");
      }
    } catch (error) {
      toast.error("An error occurred while uploading avatar");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsRemoving(true);
    try {
      const response = await removeAvatar();
      if (!response.success) {
        toast.error(response.message || "Failed to remove avatar");
      } else {
        window.location.reload();
      }
    } catch (error) {
      toast.error("An error occurred while removing avatar", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const closeAvatarDialog = () => {
    setIsAvatarDialogOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCrop(undefined);
    setCompletedCrop(null);
    setIsCropping(false);
  };

  // Profile info dialog handlers
  const handleOpenDialog = (field) => {
    setFormData({
      full_name: user?.profile?.full_name || "",
      date_of_birth: user?.profile?.date_of_birth || "",
      gender: user?.profile?.gender || "",
    });
    setDialogField(field);
  };

  const handleCloseDialog = () => {
    setDialogField(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Format the date properly if it's the date_of_birth field
      if (dialogField === "date_of_birth" && formData.date_of_birth) {
        // Handle both Date object and string cases
        let dateValue = formData.date_of_birth;

        // If it's a Date object, format it as YYYY-MM-DD
        if (dateValue instanceof Date) {
          dateValue = format(dateValue, "yyyy-MM-dd");
        }

        await updateProfile({ [dialogField]: dateValue });
      } else {
        // For non-date fields, send the value as is
        await updateProfile({ [dialogField]: formData[dialogField] });
      }

      setDialogField(null);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2FA toggle handler
  const handle2FaToggle = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      const response = await toggle2Fa(user?.id);
      if (response.success) {
        set2Fa(response.is_enabled_2fa);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const errorMessage = error.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsToggling(false);
    }
  };

  // Password change handlers
  const handleOpenPasswordDialog = () => {
    setPasswordFormData({
      current_password: "",
      new_password: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
    setPasswordServerError("");
    setIsPasswordDialogOpen(true);
  };

  const handleClosePasswordDialog = () => {
    setIsPasswordDialogOpen(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setPasswordServerError("");
  };

  const clearPasswordError = (fieldName) => {
    if (passwordErrors[fieldName]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const validatePasswordForm = () => {
    const { isValid, errors: validationErrors } =
      validateChangePasswordForm(passwordFormData);
    setPasswordErrors(validationErrors);
    return isValid;
  };

  const handlePasswordSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validatePasswordForm()) return;
    setLoading(true);
    setPasswordServerError("");

    try {
      const response = await changePassword(
        passwordFormData.current_password,
        passwordFormData.new_password
      );

      if (response.success) {
        toast.success(response.message || "Password changed successfully");
        setPasswordFormData({
          current_password: "",
          new_password: "",
          confirmPassword: "",
        });
        setIsPasswordDialogOpen(false);
      } else {
        toast.error(response.message || "Failed to change password");
        setPasswordServerError(response.message);
      }
    } catch (error) {
      const errorMessage = error.message || "An unexpected error occurred";
      toast.error(errorMessage);
      setPasswordServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getFieldTitle = (field) => {
    switch (field) {
      case "full_name":
        return "Full Name";
      case "gender":
        return "Gender";
      case "date_of_birth":
        return "Date of Birth";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Account Information</h2>

      {/* Basic Information */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 *:grid-cols-1 gap-4">
        <div className="col-span-2">
          <ProfileInformationCard
            icon={<Mail />}
            title="My Account"
            visibility={"basics"}
          >
            <div>
              <h2 className="text-lg font-semibold">
                {user?.email || "Not provided yet"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {user?.profile?.is_verified ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" /> Verified
                  </span>
                ) : (
                  "Please verify your account"
                )}
              </p>
            </div>
          </ProfileInformationCard>
        </div>
        <div className="col-span-2">
          <ProfileInformationCard
            icon={<Image />}
            title="Profile Picture"
            visibility={"public"}
            onClick={() => setIsAvatarDialogOpen(true)}
            // isSquare
            rightChildren={
              <p
                className={
                  "mt-3 flex items-center gap-1 text-md opacity-80 text-md font-medium"
                }
              >
                Change <ChevronRight className="h-5 w-5 mt-1" />
              </p>
            }
            onRight
          >
            <UserAvatar className="w-20 h-20" />
          </ProfileInformationCard>
        </div>
        <div>
          <ProfileInformationCard
            icon={<User />}
            title="Full Name"
            visibility={"public"}
            onClick={() => handleOpenDialog("full_name")}
            isSquare
          >
            {user?.profile?.full_name || "Not provided yet"}
          </ProfileInformationCard>
        </div>

        <div>
          <ProfileInformationCard
            icon={<VenusAndMars />}
            title="Gender"
            visibility={"private"}
            onClick={() => handleOpenDialog("gender")}
            isSquare
          >
            {user?.profile?.gender
              ? user.profile.gender.charAt(0).toUpperCase() +
              user.profile.gender.slice(1)
              : "Not provided yet"}
          </ProfileInformationCard>
        </div>

        <div>
          <ProfileInformationCard
            icon={<Cake />}
            title="Date of Birth"
            visibility={"private"}
            onClick={() => handleOpenDialog("date_of_birth")}
            isSquare
          >
            {user?.profile?.date_of_birth || "Not provided yet"}
          </ProfileInformationCard>
        </div>

        <div>
          <ProfileInformationCard
            icon={<KeyRound />}
            visibility={"security"}
            title="Two-factor Authentication"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <Switch
                  id="two-factor-auth"
                  checked={is2fa || false}
                  onCheckedChange={handle2FaToggle}
                  disabled={isToggling}
                />
                <Label htmlFor="two-factor-auth">
                  {is2fa ? "Enabled" : "Disabled"}
                </Label>
              </div>
            </div>
          </ProfileInformationCard>
        </div>
        <div>
          <ProfileInformationCard
            icon={<RectangleEllipsis />}
            title="Password"
            visibility={"security"}
            onClick={handleOpenPasswordDialog}
            isSquare
          >
            <div className="flex items-center justify-end">
              <Button variant="ghost">
                Change <ChevronRight />
              </Button>
            </div>
          </ProfileInformationCard>
        </div>
      </div>

      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Picture</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            A picture helps people recognize you and lets you know when you’re
            signed in to your account
          </p>
          <Badge
            size="xl"
            variant={"outline"}
            className="-mt-1 -mb-4 text-sm rounded-sm"
          >
            Visible to everyone
          </Badge>
          <div className="flex flex-col items-center gap-4 py-4">
            {previewUrl ? (
              <div className="relative overflow-auto rounded-md">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    src={previewUrl}
                    alt="Preview"
                    onLoad={onImageLoad}
                    className="max-w-full"
                  />
                </ReactCrop>
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 rounded-full p-0 scale-75"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setCrop(undefined);
                    setIsCropping(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <></>
            )}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            {!previewUrl && (
              <Button
                variant="outline"
                onClick={openFileDialog}
                className={"my-8"}
              >
                <LaptopMinimal />
                Upload from computer
              </Button>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {isCropping ? (
              <p className="font-semibold text-center text-primary text-md -mt-6">
                Drag to adjust the crop area
              </p>
            ) : (
              <>
                <p>Supported formats: JPEG, PNG</p>
              </>
            )}
          </div>
          <DialogFooter>
            {user?.profile_picture && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAvatar();
                }}
                className={"mr-auto"}
                variant="destructive"
                disabled={isRemoving}
              >
                {isRemoving ? "..." : "Remove"}
              </Button>
            )}
            <Button variant="outline" onClick={closeAvatarDialog}>
              Cancel
            </Button>

            <Button
              onClick={handleUploadAvatar}
              disabled={!selectedFile || !completedCrop || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" /> Uploading
                </>
              ) : (
                <>
                  <ImageUp className="h-4 w-4" /> Upload image
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <InfoEditDialog
        open={!!dialogField}
        onClose={handleCloseDialog}
        title={getFieldTitle(dialogField)}
        fieldType={dialogField}
        formData={formData}
        onChange={handleChange}
        onSave={handleSave}
        loading={loading}
        options={genderOptions}
        maxDate={maxDate}
      />

      <Dialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {/* {passwordServerError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm mb-4">
                {passwordServerError}
              </div>
            )} */}
            <p className="text-sm text-muted-foreground -mt-4 mb-4">
              Choose a strong password and don't reuse it for other accounts.
              You may be signed out of your account on some devices.
            </p>
            <div className="space-y-4">
              <TextField
                id="current_password"
                label="Current Password"
                name="current_password"
                value={passwordFormData.current_password}
                onChange={handlePasswordChange}
                error={passwordErrors.current_password}
                isHideContent={true}
                icon={<Clock className="h-5 w-5" />}
                onErrorClear={clearPasswordError}
                required
              />
              <TextField
                id="new_password"
                label="New Password"
                name="new_password"
                value={passwordFormData.new_password}
                onChange={handlePasswordChange}
                error={passwordErrors.new_password}
                isHideContent={true}
                icon={<Key className="h-5 w-5" />}
                onErrorClear={clearPasswordError}
                required
              />
              <TextField
                id="confirmPassword"
                label="Confirm New Password"
                name="confirmPassword"
                value={passwordFormData.confirmPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.confirmPassword}
                isHideContent={true}
                icon={<RotateCcwKey className="h-5 w-5" />}
                onErrorClear={clearPasswordError}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClosePasswordDialog}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit} disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PersonalInfoForm;
