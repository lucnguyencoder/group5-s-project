import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const FoodDetailReview = ({ foodData }) => {
  
  const reviewsData = {
    averageRating: 4.5,
    totalReviews: 128,
    ratingBreakdown: {
      5: 65,
      4: 25,
      3: 7,
      2: 2,
      1: 1,
    },
  };

  const mockReviews = [
    {
      id: 1,
      user: "Thanh H.",
      date: "15/05/2023",
      rating: 5,
      comment: "Món ăn rất ngon, phục vụ tốt. Sẽ quay lại lần sau!",
    },
    {
      id: 2,
      user: "Minh N.",
      date: "12/05/2023",
      rating: 4,
      comment: "Chất lượng ổn, giá cả hợp lý. Đáng thử!",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Reviews</h2>

      {/* Reviews Summary */}
      <div className="bg-muted/20 border border-border/20 rounded-lg px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Average rating */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-4xl font-bold text-primary">
              {reviewsData.averageRating}
            </div>
            <div className="flex items-center mt-2 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(reviewsData.averageRating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {reviewsData.totalReviews} reviews
            </p>
          </div>

          {/* Right: Rating breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const percentage = reviewsData.ratingBreakdown[rating];
              return (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-2">{rating}</span>
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-xs text-muted-foreground">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter tags */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          {[
            "All",
            "Newest",
            "5 star",
            "4 star",
            "3 star",
            "2 star",
            "1 star",
          ].map((filter) => (
            <button
              key={filter}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full border transition-colors",
                filter === "All"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:border-primary/50"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-3">
        {mockReviews.map((review) => (
          <div
            key={review.id}
            className="bg-muted/20 border border-border/20 rounded-lg px-4 py-4"
          >
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center">
                <Avatar className="h-9 w-9 mr-2.5">
                  <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{review.user}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < review.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {review.comment}
            </p>
          </div>
        ))}
        <Button variant="outline" className="w-full h-9">
          Load more reviews
        </Button>
      </div>
    </div>
  );
};

export default FoodDetailReview;
