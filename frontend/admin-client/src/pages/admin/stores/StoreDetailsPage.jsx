import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DataManagementLayout from "@/components/layout/DataManagementLayout";
import StoreDetailsInformation from "@/components/modules/admin/stores/StoreDetailsInformation";
import StoreDetailsStaff from "@/components/modules/admin/stores/StoreDetailsStaff";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import storeManagementService from "@/services/store/storeManagementService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SetTitle from "@/components/common/SetTitle";

function StoreDetailsPage() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStoreDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const storeData = await storeManagementService.getStoreById(id);
      setStore(storeData);
    } catch (err) {
      console.error("Error fetching store details:", err);
      setError("Failed to load store details. Please try again later.");
      toast.error("Failed to load store details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreDetails();
  }, [id]);

  return (
    <DataManagementLayout
      headerLeft={
        <>
          <h1 className="text-xl font-semibold">
            {loading
              ? "Loading Store Details..."
              : `Store: ${store?.name || "Unknown"}`}
          </h1>
        </>
      }
      headerRight={<></>}
    >
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading store details...</span>
          </div>
        ) : error ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={fetchStoreDetails}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <StoreDetailsInformation
              store={store}
              onStoreUpdate={fetchStoreDetails}
              onStaffUpdate={fetchStoreDetails}
            />

            <StoreDetailsStaff
              store={store}
              onStaffUpdate={fetchStoreDetails}
            />
          </div>
        )}
        <SetTitle title={`Store Details`} />
      </div>
    </DataManagementLayout>
  );
}

export default StoreDetailsPage;
