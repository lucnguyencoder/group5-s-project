import publicDataService from "@/services/publicDataService";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import StoreCard from "./StoreCard";
import { ChevronDown, Loader2, ThumbsUpIcon, X } from "lucide-react";

const MAX_ITEM_PER_PAGE = 20;
const DEF_PAGE = 1;

function StoreList({
  filter,
  alertLocation = false,
  orientation = "vertical",
  compact = false,
  pagination = true,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [list, setList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUserIgnoreAlert, setIsUserIgnoreAlert] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
    setList([]);
    setHasMore(true);
    getStoreList(true);
  }, [
    filter.search,
    filter.latitude,
    filter.longitude,
    filter.maxAllowedDistance,
    filter.currentTime,
  ]);

  const getStoreList = async (reset = false) => {
    try {
      const pageToFetch = reset ? DEF_PAGE : currentPage;
      const filterWithPagination = {
        ...filter,
        page: pageToFetch,
      };

      if (reset) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const res = await publicDataService.getStorelist(filterWithPagination);

      if (res.success) {
        const newData = res.data || [];

        if (reset) {
          setList(newData);
          setCurrentPage(2);
        } else {
          setList((prev) => [...prev, ...newData]);
          setCurrentPage((prev) => prev + 1);
        }
        setHasMore(newData.length === MAX_ITEM_PER_PAGE);
      } else {
        if (reset) {
          setList([]);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
      if (reset) {
        setList([]);
      }
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleViewMore = () => {
    if (!isLoadingMore && hasMore) {
      getStoreList(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 w-full flex justify-center items-center gap-4">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <p className="text-lg">
          Please wait for few seconds! Good things come to those who wait...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full overflow-hidden ">
      {alertLocation &&
        !isUserIgnoreAlert &&
        !filter.latitude &&
        !filter.longitude && (
          <div className="pl-4 p-2 bg-card/60 border rounded-lg mb-4 text-md text-primary-foreground flex items-center justify-between gap-2">
            <p>
              You are viewing stores without a specific location. Please set
              your delivery address or current location for better results.
            </p>
            <Button
              variant="ghost"
              onClick={() => setIsUserIgnoreAlert(true)}
              size="icon"
            >
              <X />
            </Button>
          </div>
        )}
      <div
        className={
          orientation === "vertical"
            ? "grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 flex-1"
            : "flex overflow-x-auto pb-3"
        }
      >
        {list.map((item, index) => {
          return (
            <StoreCard
              key={`${item.id}-${index}`}
              data={item}
              compact={compact}
            />
          );
        })}
      </div>

      {list.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No stores found matching your criteria
        </div>
      )}
      {pagination && (
        <div className="text-center py-8">
          {hasMore && list.length > 0 ? (
            <Button
              onClick={handleViewMore}
              disabled={isLoadingMore}
              className={"mt-2 w-full text-md font-semibold"}
              variant="ghost"
            >
              {isLoadingMore ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <>
                  Show More
                  <ChevronDown />
                </>
              )}
            </Button>
          ) : (
            <p>This is all what we have (for now)</p>
          )}
        </div>
      )}
    </div>
  );
}

export default StoreList;
