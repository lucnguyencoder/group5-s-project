import React, { useState, useRef, useEffect } from "react";
import FoodCard from "./FoodCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function FoodContainer({
  title = "",
  description = "",
  list,
  horizontal = false,
  horizontalContainer = false,
  maxRow = null,
  sm = 1,
  md = 1,
  lg = 2,
  xl = 3,
  xxl = 4,
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [screenSize, setScreenSize] = useState("xxl");

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize("sm");
      else if (width < 768) setScreenSize("sm");
      else if (width < 1024) setScreenSize("md");
      else if (width < 1280) setScreenSize("lg");
      else if (width < 1536) setScreenSize("xl");
      else setScreenSize("xxl");
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const getItemsPerPage = () => {
    if (!maxRow || horizontalContainer) return list.length;

    let cols;
    switch (screenSize) {
      case "sm":
        cols = sm;
        break;
      case "md":
        cols = md;
        break;
      case "lg":
        cols = lg;
        break;
      case "xl":
        cols = xl;
        break;
      case "xxl":
        cols = xxl;
        break;
      default:
        cols = xxl;
    }

    return cols * maxRow;
  };

  const itemsPerPage = getItemsPerPage();
  const totalPages =
    maxRow && !horizontalContainer ? Math.ceil(list.length / itemsPerPage) : 1;
  const canPageLeft = currentPage > 0;
  const canPageRight = currentPage < totalPages - 1;

  const getCurrentPageItems = () => {
    if (!maxRow || horizontalContainer) return list;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return list.slice(startIndex, endIndex);
  };

  const pageLeft = () => {
    if (canPageLeft) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const pageRight = () => {
    if (canPageRight) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -500, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 500, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (horizontalContainer) {
      checkScroll();
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", checkScroll);
      }

      setTimeout(checkScroll, 100);

      return () => {
        if (scrollContainer) {
          scrollContainer.removeEventListener("scroll", checkScroll);
        }
      };
    }
  }, [horizontalContainer, list]);

  useEffect(() => {
    setCurrentPage(0);
  }, [list, maxRow, screenSize]);

  if (!list || list.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {(title ||
        description ||
        (maxRow && !horizontalContainer && totalPages > 1)) && (
        <div className="flex justify-between items-center mb-4">
          <div>
            {title && <h2 className="text-2xl font-semibold">{title}</h2>}
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </div>
          {maxRow && !horizontalContainer && totalPages > 1 && (
            <div className="flex gap-2">
              <Button
                onClick={pageLeft}
                disabled={!canPageLeft}
                variant="outline"
                size="icon"
                aria-label="Previous page"
              >
                <ChevronLeft />
              </Button>
              <Button
                onClick={pageRight}
                disabled={!canPageRight}
                variant="outline"
                size="icon"
                aria-label="Next page"
              >
                <ChevronRight />
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="w-full flex overflow-hidden relative">
        {horizontalContainer && canScrollLeft && (
          <Button
            onClick={scrollLeft}
            className="absolute left-0 top-2/5 transform translate-x-1/12 backdrop-blur-3xl bg-opacity-70 p-2 h-auto w-auto shadow-md z-10 py-4 border border-card/10"
            aria-label="Scroll left"
            variant={"secondary"}
            size="icon"
          >
            <ChevronLeft />
          </Button>
        )}

        <div
          ref={horizontalContainer ? scrollContainerRef : null}
          className={
            !horizontalContainer
              ? !horizontal
                ? `grid grid-cols-${sm} sm:grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl} 2xl:grid-cols-${xxl} gap-4 flex-1`
                : `grid grid-cols-${sm} sm:grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${md} xl:grid-cols-${lg} 2xl:grid-cols-${xl} gap-6 flex-1`
              : "flex overflow-x-hidden pb-2 gap-2 w-full"
          }
        >
          {getCurrentPageItems().map((food) => (
            <FoodCard
              key={food.food_id}
              food={food}
              horizontal={horizontal}
              horizontalContainer={horizontalContainer}
            />
          ))}
        </div>

        {horizontalContainer && canScrollRight && (
          <Button
            onClick={scrollRight}
            className="absolute right-0 top-2/5 transform -translate-x-1/12 backdrop-blur-3xl bg-opacity-70 p-2 h-auto w-auto shadow-md z-10 py-4 border border-card/10"
            aria-label="Scroll right"
            variant={"secondary"}
            size="icon"
          >
            <ChevronRight />
          </Button>
        )}
      </div>
    </div>
  );
}

export default FoodContainer;
