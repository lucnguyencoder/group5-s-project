import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import publicDataService from "../services/publicDataService";
import { toast } from "sonner";
import { DetailBreadcrumb } from "@/components/modules/common/DetailBreadcrumb";
import StoreDetailHeader from "../components/modules/store/StoreDetailHeader";
import StoreBasicProperties from "../components/modules/store/StoreBasicProperties";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FoodList from "@/components/modules/food/FoodList";
import { Button } from "@/components/ui/button";
import {
  Blocks,
  MenuIcon,
  Sparkles,
  SquareMenu,
  Star,
  StarIcon,
  TicketPercent,
} from "lucide-react";
import StorePromotionTab from "@/components/modules/store/StorePromotionTab";
import { FeatureFood } from "@/components/modules/food/FeatureFood";
import SetTitle from "@/components/common/SetTitle";

const StoreDetailPage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("menu");

  useEffect(() => {
    const fetchStoreDetails = async () => {
      if (!storeId) {
        navigate("/stores");
        return;
      }

      setLoading(true);
      try {
        const result = await publicDataService.getStoreDetails(storeId);
        if (result.success) {
          setStoreData(result.data);
        } else {
          toast.error(result.message || "Failed to load store details");
          navigate("/stores");
        }
      } catch (error) {
        toast.error("Failed to load store details", error);
        navigate("/stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStoreDetails();
  }, [storeId, navigate]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-6 gap-y-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="aspect-[16/10] animate-pulse bg-muted rounded-xl"></div>
            <div className="space-y-3">
              <div className="h-8 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="h-96 bg-muted animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!storeData) {
    return null;
  }

  const TabButton = ({ value, label, icon }) => (
    <div
      value={value}
      onClick={() => setTab(value)}
      className={`flex text-center pl-3 pr-4 py-1.5 cursor-pointer rounded-full font-semibold active:scale-98 transition-all duration-200 ${tab === value
        ? "bg-card-foreground text-card shadow-lg"
        : "text-muted-foreground hover:bg-card/100"
        } transition-colors duration-200`}
    >
      {icon && <span className="mr-2 scale-70">{icon}</span>}
      {label}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SetTitle title={`${storeData.name}`} />
      <div className="lg:col-span-3 overflow-hidden sticky">
        <StoreDetailHeader storeData={storeData} />
        <StoreBasicProperties storeData={storeData} />
      </div>
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="flex gap-2 w-full">
          <TabButton value="featured" label="Featured" icon={<Sparkles />} />
          <TabButton value="menu" label="Menu" icon={<SquareMenu />} />
          <TabButton
            value="promotion"
            label="Promotions"
            icon={<TicketPercent />}
          />
        </div>
        <div className="flex-1 px-0 py-1">
          {tab === "featured" && <FeatureFood />}
          {tab === "promotion" && <StorePromotionTab storeId={storeId} />}
          {tab === "menu" && <FoodList query={{ storeId: storeData.id }} />}
        </div>
      </div>
    </div>
  );
};

export default StoreDetailPage;
