import React, { useRef } from "react";
import DataManagementLayout from "@/components/layout/DataManagementLayout";
import UpdateCategoryForm from "@/components/modules/store/UpdateCategoryForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SetTitle from "@/components/common/SetTitle";

function CreateCategoryPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const formRef = useRef(null);
  const isCreateMode = !categoryId;

  const handleSubmit = async () => {
    console.log("categoryId", categoryId);
    if (!formRef.current) return;
    const result = await formRef.current.submitForm();
    if (result) {
      navigate("/menu/categories");
    }
  };

  const handleCancel = () => {
    navigate("/menu/categories");
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
          <h1 className="text-xl font-semibold">
            {isCreateMode ? "Create Category" : "Edit Category"}
          </h1>
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
                {isCreateMode ? "Create Category" : "Save Changes"}
              </>
            )}
          </Button>
        </>
      }
      containScroll={true}
    >
      <SetTitle title={isCreateMode ? "Create Category" : "Edit Category"} />{" "}
      <UpdateCategoryForm
        ref={formRef}
        id={categoryId}
        isCreateMode={isCreateMode}
      />
    </DataManagementLayout>
  );
}

export default CreateCategoryPage;
