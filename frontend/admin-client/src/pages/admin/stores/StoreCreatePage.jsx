import React, { useRef } from "react";
import DataManagementLayout from "@/components/layout/DataManagementLayout";
import StoreCreateForm from "@/components/modules/admin/stores/StoreCreateForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SetTitle from "@/components/common/SetTitle";

function StoreCreatePage() {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const handleSubmit = async () => {
    if (!formRef.current) return;

    const result = await formRef.current.submitForm();
    if (result && result.id) {
      navigate(`/store/${result.id}`);
    }
  };

  const handleCancel = () => {
    navigate("/stores/view");
  };

  const isLoading = formRef.current?.isLoading;

  return (
    <DataManagementLayout
      headerLeft={
        <>
          <h1 className="text-xl font-semibold">Create New Store</h1>
        </>
      }
      headerRight={
        <>
          <Button
            variant="outline"
            size="sm"
            className="mr-2"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            size="sm"
            className="flex items-center"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Create Store
              </>
            )}
          </Button>
        </>
      }
    >
      <SetTitle title="Create New Store" />
      <StoreCreateForm ref={formRef} onCancel={handleCancel} />
    </DataManagementLayout>
  );
}

export default StoreCreatePage;
