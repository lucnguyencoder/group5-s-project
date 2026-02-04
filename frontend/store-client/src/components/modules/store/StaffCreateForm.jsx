import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
    Loader2,
    Mail,
    KeyIcon,
    User,
    Phone,
    Calendar,
    Users,
    Dice5,
} from "lucide-react";
import TextField from "@/components/common/TextField";
import SelectField from "@/components/common/SelectField";
import { storeService } from "@/services/basicService";
import { useStore } from "@/context/StoreContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


export function StaffCreateForm({ onAccountCreated, children }) {
    const { store } = useStore();

    const [isOpen, setIsOpen] = useState(false);
    const [staffType, setStaffType] = useState("sale");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [groupId, setGroupId] = useState("");

    const [fullName, setFullName] = useState("");
    const [vehiclePlate, setVehiclePlate] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const groups = [
        { value: "4", display: "Sale Agent", type: "sale" },
        { value: "5", display: "Courier", type: "courier" },
    ]


    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }


        if (staffType === "sale") {
            if (!fullName) {
                newErrors.fullName = "Full name is required";
            }
        } else if (staffType === "courier") {
            if (!fullName) {
                newErrors.fullName = "Full name is required";
            }
            if (!phoneNumber) {
                newErrors.phoneNumber = "Phone number is required";
            }
            if (!vehiclePlate) {
                newErrors.vehiclePlate = "Vehicle plate is required";
            }
            if (!vehicleType) {
                newErrors.vehicleType = "Vehicle type is required";
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
            if (staffType === "sale") {
                setGroupId('4');
            }
            else {
                setGroupId('5');
            }
            const userName = email.split("@")[0].toLowerCase();
            let storeProfileData = {};

            if (staffType === "sale") {

                storeProfileData = {
                    full_name: fullName,
                    username: userName,
                    store_id: store.id,
                    email: email,
                    phone: phoneNumber || null,
                }
            }
            else if (staffType === "courier") {
                storeProfileData = {
                    full_name: fullName,
                    username: userName,
                    store_id: store.id,
                    email: email,
                    phone: phoneNumber || null,
                    vehicle_plate: vehiclePlate || null,
                    vehicle_type: vehicleType || null,
                };
            }
            const staffData = {
                email,
                password,
                group_id: parseInt(groupId),
                storeProfileData: storeProfileData,
            };

            const response = await storeService.createStaff(staffData);
            if (!response.success) {
                toast.error(response.message || "Failed to create account. Please try again.");
                setIsOpen(false);
                resetForm();
                return;
            }
            toast.success("Account created successfully!");
            setTimeout(() => {
                setIsOpen(false);
                resetForm();
                if (onAccountCreated) {
                    onAccountCreated();
                }
            }, 1000);
        } catch (error) {
            toast.error(
                error.message || "Failed to create account. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setGroupId("");
        setFullName("");
        setPhoneNumber("");
        setErrors({});
        setVehiclePlate("");
        setVehicleType("");
        setStaffType("sale");
    };

    const handleOpenChange = (open) => {
        setIsOpen(open);
        if (!open) {
            resetForm();
        }
    };

    const clearError = (fieldName) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    };

    const handleGroupChange = (value) => {
        setGroupId(value);
        if (value === "4") {
            setStaffType("sale");
        } else if (value === "5") {
            setStaffType("courier");
        }
    };

    const generateRandomPassword = () => {
        const chars =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let password = "";

        password += chars.substr(26, 1);
        password += chars.substr(0, 1);
        password += chars.substr(52, 1);
        password += chars.substr(62, 1);

        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        password = password
            .split("")
            .sort(() => 0.5 - Math.random())
            .join("");

        setPassword(password);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Create New Account</DialogTitle>
                    <DialogDescription>
                        Create a new user account with the appropriate permissions.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium">Account Information</h3>
                            <div className="space-y-4">
                                <TextField
                                    id="email"
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    icon={<Mail />}
                                    error={errors.email}
                                    helpText="Used for login and notifications"
                                    inputProps={{
                                        autoComplete: "email",
                                    }}
                                    onErrorClear={() => clearError("email")}
                                    className="w-full"
                                />

                                <TextField
                                    id="password"
                                    label="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    icon={<KeyIcon />}
                                    error={errors.password}
                                    helpText="Minimum 8 characters"
                                    isHideContent={true}
                                    rightItems={[
                                        <Button
                                            key="generate"
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mr-24 p-0"
                                            onClick={generateRandomPassword}
                                        >
                                            <Dice5 className="h-3 w-3" />
                                            Randomize
                                        </Button>,
                                    ]}
                                    onErrorClear={() => clearError("password")}
                                    className="w-full"
                                />

                                <SelectField
                                    id="staffType"
                                    label="Staff Job"
                                    value={groupId}
                                    onChange={handleGroupChange}
                                    options={groups}
                                    error={errors.groupId}
                                    onErrorClear={() => clearError("groupId")}
                                    icon={<Users />}
                                    helpText="Determines Staff's role and permissions"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <h3 className="text-sm font-medium">Profile Information</h3>
                            </div>

                            <div className="space-y-4">
                                <TextField
                                    id="fullName"
                                    label="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    icon={<User />}
                                    error={errors.fullName}
                                    helpText="Staff's display name"
                                    onErrorClear={() => clearError("fullName")}
                                />

                                <TextField
                                    id="phoneNumber"
                                    label="Phone Number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    icon={<Phone />}
                                    error={errors.phoneNumber}
                                    helpText="Contact phone number"
                                    onErrorClear={() => clearError("phoneNumber")}
                                />

                                {/* Courier-specific fields */}
                                {staffType === "courier" && (
                                    <>
                                        <TextField
                                            id="vehiclePlate"
                                            label="Vehicle Plate"
                                            value={vehiclePlate}
                                            onChange={(e) => setVehiclePlate(e.target.value)}
                                            icon={<User />}
                                            error={errors.vehiclePlate}
                                            helpText="License plate of the vehicle"
                                            onErrorClear={() => clearError("vehiclePlate")}
                                        />
                                        <Select
                                            value={vehicleType}
                                            onValueChange={setVehicleType}
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
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

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
                            {isLoading ? "Creating..." : "Create Account"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default StaffCreateForm;
