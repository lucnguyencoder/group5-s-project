import React, { useRef } from "react";
import DataManagementLayout from "@/components/layout/DataManagementLayout";
import GroupEditForm from "@/components/modules/admin/groups/GroupEditForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SetTitle from "@/components/common/SetTitle";

function GroupEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const formRef = useRef(null);
  const isCreateMode = !id;

  const handleSubmit = async () => {
    if (!formRef.current) return;

    const result = await formRef.current.submitForm();
    if (result) {
      navigate("/groups");
    }
  };

  const handleCancel = () => {
    navigate("/groups");
  };

  const isLoading = formRef.current?.isLoading;
  const fetchLoading = formRef.current?.fetchLoading;

  return (
    <DataManagementLayout
      headerLeft={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </>
      }
      headerRight={
        <>
          <Button
            size="sm"
            className="flex items-center"
            onClick={handleSubmit}
            disabled={isLoading || fetchLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isCreateMode ? "Creating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                {isCreateMode ? "Create Group" : "Save Changes"}
              </>
            )}
          </Button>
        </>
      }
      containScroll={true}
    >
      <SetTitle title={isCreateMode ? "Create Group" : "Edit Group"} />
      <GroupEditForm ref={formRef} id={id} isCreateMode={isCreateMode} />
    </DataManagementLayout>
  );
}

export default GroupEditPage;
