import React, { useState, useEffect, useRef } from "react";
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
import accountManagementService from "@/services/user/accountManagementService";
import { Badge } from "@/components/ui/badge";
import { formatName, formatString } from "@/utils/formatter";
import TextField from "@/components/common/TextField";
import SelectField from "@/components/common/SelectField";
import DateField from "@/components/common/DateField";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import { validateDateOfBirth, validateEmail, validateFullName, validatePassword, validatePhone } from "@/utils/validators";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";

export function AccountCreateDialog({ onAccountCreated, children }) {

  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState("customer");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [groupId, setGroupId] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [isVerified, setIsVerified] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [panel, setPanel] = useState("manual");
  const [fileData, setFileData] = useState([])
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchGroups();
    }
  }, [isOpen, userType]);

  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      const groupsData = await accountManagementService.getGroups();
      console.log("Fetched groups:", groupsData);

      const formattedGroups = [];
      const customerGroups = groupsData.filter((g) => g.type === "customer");
      if (customerGroups.length > 0) {
        formattedGroups.push({
          label: "Customer",
          options: customerGroups.map((group) => ({
            value: group.id.toString(),
            display: formatString(group.name),
            type: "customer",
          })),
        });
      }

      const systemGroups = groupsData.filter((g) => g.type === "system");
      console.log("System groups:", systemGroups);
      if (systemGroups.length > 0) {
        formattedGroups.push({
          label: "System",
          options: systemGroups.map((group) => ({
            value: group.id.toString(),
            display: formatString(group.name),
            type: "system",
          })),
        });
      }

      setGroups(formattedGroups);
      console.log("Formatted groups:", formattedGroups);

      if (groupsData.length > 0) {
        const defaultGroup =
          groupsData.find((g) => g.is_default && g.type === userType) ||
          groupsData.find((g) => g.type === userType);

        if (defaultGroup) {
          setGroupId(defaultGroup.id.toString());
          setUserType(defaultGroup.type);
        }
      }
    } catch (error) {
      console.error("Error loading groups:", error);
    } finally {
      setLoadingGroups(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const validatedEmail = validateEmail(email);
    const validatedPassword = validatePassword(password);
    const validatedFullName = validateFullName(fullName);
    if (validatedEmail) {
      newErrors.email = validatedEmail;
    }

    if (validatedPassword) {
      newErrors.password = validatedPassword;
    }

    if (validatedFullName) {
      newErrors.fullName = validatedFullName;
    }

    if (!groupId) {
      newErrors.groupId = "Group is required";
    }
    if (userType === "customer") {
      const validatedDateOfBirth = validateDateOfBirth(dateOfBirth);
      if (validatedDateOfBirth) {
        newErrors.dateOfBirth = validatedDateOfBirth;
      }
    }
    else if (userType === "system") {
      const validatedPhone = validatePhone(phoneNumber);
      if (validatedPhone) {
        newErrors.phoneNumber = validatedPhone;
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
      let profileData = {};

      if (userType === "customer") {
        profileData = {
          full_name: formatName(fullName),
          gender: gender || null,
          date_of_birth: dateOfBirth || null,
          is_verified: isVerified,
        };
      } else if (userType === "system") {
        profileData = {
          full_name: formatName(fullName),
          phone_number: phoneNumber,
        };
      }

      const userData = {
        email,
        password,
        group_id: parseInt(groupId),
        profile_data: profileData,
      };

      await accountManagementService.createUser(userData);

      toast.success(`Account for ${email} has been created successfully.`);

      setIsOpen(false);
      resetForm();

      if (onAccountCreated) {
        onAccountCreated();
      }
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
    setGender("");
    setDateOfBirth("");
    setIsVerified(false);
    setPhoneNumber("");
    setErrors({});
    setPanel('manual');
    setFile(null);
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

    let selectedType = userType;

    console.log("Selected group value:", value);
    console.log("Available groups:", groups);

    for (const groupCategory of groups) {
      if (groupCategory.options) {
        const found = groupCategory.options.find((opt) => opt.value === value);
        if (found) {
          console.log("Found matching group:", found);
          selectedType = found.type;
          break;
        }
      }
    }

    console.log("Setting userType to:", selectedType);
    setUserType(selectedType);
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

  const uploadFile = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    let jsonData = [];
    try {
      if (fileInputRef.current.files.length === 0) {
        toast.error('No file is selected')
        return;
      }
      const data = await new Promise((resolve, reject) => {
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          resolve(data);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      jsonData = XLSX.utils.sheet_to_json(worksheet);
      jsonData = jsonData.map(row => {
        if (row.dob && typeof row.dob === "number") {
          const jsDate = XLSX.SSF.parse_date_code(row.dob);
          if (jsDate) {
            row.dob = `${String(jsDate.d).padStart(2, '0')}-${String(jsDate.m).padStart(2, '0')}-${jsDate.y}`;
          }
        }
        return row;
      });
      if (!jsonData || jsonData.length === 0) {
        toast.error("The Excel file is empty or invalid.");
        return;
      }
      setFileData(jsonData);
      setPreview(true)
    }
    catch (error) {
      console.log(error);
    }
  }

  const importExcel = async () => {
    try {
      let profileData = {};
      for (let account of fileData) {
        account.fullName = account.fullName.toString();
        const checkEmail = validateEmail(account.email);
        const checkPassword = validatePassword(account.password);
        if (!account.groupId) {
          setFile(null);
          setPreview(false);
          toast.error('Group is required');
          if (fileInputRef.current) {
            fileInputRef.current.value = null;
          }
          return;
        }
        if (checkEmail) {
          setFile(null);
          setPreview(false);
          toast.error(checkEmail);
          if (fileInputRef.current) {
            fileInputRef.current.value = null;
          }
          return;
        }
        if (checkPassword) {
          setFile(null);
          setPreview(false);
          toast.error(checkPassword);
          if (fileInputRef.current) {
            fileInputRef.current.value = null;
          }
          return;
        }
        if (account.groupId === 6) {
          const dob = new Date(account.dob);
          const checkDob = validateDateOfBirth(dob);
          const checkFullName = validateFullName(account.fullName);
          if (checkDob) {
            setFile(null);
            setPreview(false);
            toast.error(checkDob);
            if (fileInputRef.current) {
              fileInputRef.current.value = null;
            }
            return;
          }
          if (checkFullName) {
            setFile(null);
            setPreview(false);
            toast.error(checkFullName);
            if (fileInputRef.current) {
              fileInputRef.current.value = null;
            }
            return;
          }
          profileData = {
            full_name: account.fullName,
            gender: account.gender || null,
            date_of_birth: dob || null,
            is_verified: account.isVerified,
          };
        } else if (account.groupId === 1 || account.groupId === 2) {
          const checkFullName = validateFullName(account.fullName);
          const checkPhoneNumber = validatePhone(account.phoneNumber);
          if (checkPhoneNumber) {
            setFile(null);
            setPreview(false);
            toast.error(checkPhoneNumber);
            if (fileInputRef.current) {
              fileInputRef.current.value = null;
            }
            return;
          }
          if (checkFullName) {
            setFile(null);
            setPreview(false);
            toast.error(checkFullName);
            if (fileInputRef.current) {
              fileInputRef.current.value = null;
            }
            return;
          }
          profileData = {
            full_name: account.fullName,
            phone_number: account.phoneNumber,
          };
        } else {
          toast.error('Only Customer, System Admin, and Support Agent accounts can be created');
          setPreview(false);
          setIsOpen(false);
          resetForm();
          return;
        }
        const userData = {
          email: account.email,
          password: account.password,
          group_id: parseInt(account.groupId),
          profile_data: profileData,
        };
        await accountManagementService.createUser(userData);
      }
      toast.success(`Accounts has been created successfully.`);
      setPreview(false);
      setIsOpen(false);
      resetForm();

      if (onAccountCreated) {
        onAccountCreated();
      }
    }
    catch (error) {
      toast.error(`Failed to create account`);
      console.log(error)
      setPreview(false);
      setIsOpen(false);
      resetForm();
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create New Account</DialogTitle>
            <DialogDescription>
              Create a new user account with the appropriate permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 items-center justify-center">
            <Button
              className="w-80"
              variant={panel === 'manual' ? '' : 'outline'}
              onClick={() => setPanel('manual')}
            >
              Manual Create
            </Button>
            <Button
              className="w-80"
              variant={panel === 'auto' ? '' : 'outline'}
              onClick={() => setPanel('auto')}
            >
              Import From Excel
            </Button>
          </div>
          <form onSubmit={panel === 'manual' ? handleSubmit : uploadFile} className="space-y-4">
            {panel === 'manual' && (
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
                      id="group"
                      label="User Group"
                      value={groupId}
                      onChange={handleGroupChange}
                      options={groups}
                      error={errors.groupId}
                      onErrorClear={() => clearError("groupId")}
                      icon={<Users />}
                      disabled={loadingGroups}
                      placeholder={
                        loadingGroups ? "Loading groups..." : "Select a group"
                      }
                      helpText="Determines user permissions"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium">Profile Information</h3>
                    <Badge variant="outline" className="ml-2">
                      Optional
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {userType === "customer" ? (
                      <>
                        <TextField
                          id="fullName"
                          label="Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          icon={<User />}
                          error={errors.fullName}
                          helpText="Customer's display name"
                          onErrorClear={() => clearError("fullName")}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <SelectField
                            id="gender"
                            label="Gender"
                            value={gender}
                            onChange={setGender}
                            options={[
                              { value: "male", display: "Male" },
                              { value: "female", display: "Female" },
                              { value: "other", display: "Other" },
                            ]}
                            error={errors.gender}
                            onErrorClear={() => clearError("gender")}
                            required={false}
                            placeholder="Select gender"
                          />

                          <DateField
                            id="dateOfBirth"
                            label="Date of Birth"
                            value={dateOfBirth ? new Date(dateOfBirth) : null}
                            onChange={(date) => {
                              setDateOfBirth(
                                date ? date.toISOString().split("T")[0] : null
                              );
                            }}
                            error={errors.dateOfBirth}
                            onErrorClear={() => clearError("dateOfBirth")}
                            required={false}
                            helpText="Optional field"
                            maxDate={new Date()}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <TextField
                          id="sysFullName"
                          label="Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          icon={<User />}
                          error={errors.fullName}
                          helpText="System user's display name"
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            {panel === 'auto' && (
              <div className="flex justify-center items-center flex-col text-center">
                <p className="text-sm">
                  Import accounts from an Excel file. Please ensure the file is in
                  the correct format.
                </p>
                <Input type="file" accept=".xlsx, .xls" className="mt-5 w-50"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files.length > 1) {
                      toast.error("Please select only one file.");
                      e.target.value = null;
                      return;
                    }
                    setFile(e.target.files[0]);
                  }}
                />
                <p className="text-sm mt-3  ">Support Format: .xlsx, .xls</p>
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setPanel('manual');
                  setFile(null);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}
              >
                {isLoading ? "Creating..." : panel === 'auto' ? "Upload File" : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={preview}>
        <DialogContent className="lg:max-w-[200vh]">
          <DialogHeader>
            <DialogTitle>Preview Data</DialogTitle>
            <DialogDescription>Review the data before creating accounts</DialogDescription>
          </DialogHeader>
          <div>
            <Table>
              <TableHead>
                Email
              </TableHead>
              <TableHead>
                Password
              </TableHead>
              <TableHead>
                Group ID
              </TableHead>
              <TableHead>
                Full Name
              </TableHead>
              <TableHead>
                Gender
              </TableHead>
              <TableHead>
                Date Of Birth
              </TableHead>
              <TableHead>
                Phone Number
              </TableHead>
              <TableHead>
                Is Verified
              </TableHead>
              <TableBody>
                {fileData.map((data) => (
                  <TableRow>
                    <TableCell>
                      {data.email}
                    </TableCell>
                    <TableCell>
                      {data.password}
                    </TableCell>
                    <TableCell>
                      {data.groupId}
                    </TableCell>
                    <TableCell>
                      {data.fullName}
                    </TableCell>
                    <TableCell>
                      {data.gender || ''}
                    </TableCell>
                    <TableCell>
                      {data.dob || ''}
                    </TableCell>
                    <TableCell>
                      {data.phoneNumber || ''}
                    </TableCell>
                    <TableCell>
                      {data.isVerified ? 'Verified' : 'Unverified'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setFile(null);
              setPreview(false);
              fileInputRef.current.value = null;
            }}
              variant='outline'
            >
              Cancel
            </Button>
            <Button onClick={() => importExcel()}>
              Import Accounts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AccountCreateDialog;
