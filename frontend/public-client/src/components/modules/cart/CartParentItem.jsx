import { Avatar } from "@/components/ui/avatar";
import publicDataService from "@/services/publicDataService";
import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
} from "react";
import { toast } from "sonner";
import CartChildrenItem from "./CartChildrenItem";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/utils/formatter";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Store, Truck } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { CartDiscountDialog } from "./CartDiscountDialog";
import { CartContext } from "@/context/CartContext";

function CartParentItem({ storeId, cartItems }) {
  const { increaseQuantity, decreaseQuantity, removeItem, removeWholeStore } =
    useContext(CartContext);
  const { getCoord, isPickUp, deliveryAddresses } = useUser();
  const [location, setLocation] = useState(null);
  const [isExpand, setIsExpand] = useState(true);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [store, setStore] = useState(null);
  const [data, setData] = useState(null);
  const [discountCode, setDiscountCode] = useState(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  const lastCartUpdateRef = useRef(null);
  const isInitialRender = useRef(true);
  const prevCartItemsRef = useRef(JSON.stringify(cartItems));
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (isInitialLoading) {
        setLoadingTimeout(true);
        setIsInitialLoading(false);
      }
    }, 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isInitialLoading]);

  useEffect(() => {
    const setInitialLocation = async () => {
      try {
        if (isPickUp) {
          const coord = await getCoord();
          setLocation(coord || { lat: 0, lng: 0 });
        } else if (deliveryAddresses && deliveryAddresses.length > 0) {
          const defaultAddr = deliveryAddresses.find((addr) => addr.is_default);
          setLocation(
            defaultAddr || deliveryAddresses[0] || { lat: 0, lng: 0 }
          );
        } else {
          setLocation({ lat: 0, lng: 0 });
        }
      } catch (error) {
        console.error("Error setting location:", error);
        setLocation({ lat: 0, lng: 0 });
      }
    };
    setInitialLocation();
  }, [isPickUp, deliveryAddresses, getCoord]);

  const getItemDetail = useCallback(
    async (isUpdate = false) => {
      if (!location) return;

      if (!isUpdate) {
        setIsInitialLoading(true);
      } else {
        setIsUpdating(true);
      }

      const updateId = Date.now();
      lastCartUpdateRef.current = updateId;

      try {
        const des = await publicDataService.getCartItem({
          storeId,
          cartItems,
          location,
          pickup: isPickUp,
          discountCode,
          currentTime: new Date().toLocaleTimeString("en-US", {
            hour12: false,
          }),
        });

        if (lastCartUpdateRef.current === updateId) {
          if (des.success) {
            setStore(des.data.data.store);
            setData(des.data.data);
          } else {
            console.error("Failed to fetch item details:", des.message);
            toast.error(des.message || "Failed to get cart details.");
          }
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("Could not load cart items. Please try again.");
      } finally {
        if (lastCartUpdateRef.current === updateId) {
          setIsInitialLoading(false);
          setIsUpdating(false);
        }
      }
    },
    [storeId, cartItems, isPickUp, location, discountCode]
  );

  useEffect(() => {
    if (location) {
      const currentCartItems = JSON.stringify(cartItems);
      const hasCartChanged = prevCartItemsRef.current !== currentCartItems;

      if (isInitialRender.current || hasCartChanged) {
        isInitialRender.current = false;
        prevCartItemsRef.current = currentCartItems;
        getItemDetail(data !== null);
      }
    }
  }, [storeId, cartItems, isPickUp, location, getItemDetail]);

  useEffect(() => {
    if (location && !isInitialRender.current && data !== null) {
      getItemDetail(true);
    }
  }, [discountCode, getItemDetail, location]);

  const handleIncreaseQuantity = (itemIndex) => {
    increaseQuantity(storeId, itemIndex);
  };

  const handleDecreaseQuantity = (itemIndex) => {
    decreaseQuantity(storeId, itemIndex);
  };

  const handleRemoveItem = (itemIndex) => {
    removeItem(storeId, itemIndex);
  };

  if (loadingTimeout) {
    return (
      <div className="p-4 bg-muted/30 rounded-lg">
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <Store className="w-10 h-10 mb-2 text-muted-foreground" />
          <h3 className="font-semibold">Could not load store data</h3>
          <p className="text-sm text-muted-foreground mt-1">
            We're having trouble loading data for this store.
          </p>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => {
              setLoadingTimeout(false);
              setIsInitialLoading(true);
              getItemDetail(false);
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isInitialLoading ? (
        <div className="animate-pulse bg-muted rounded-lg h-16 w-full mb-4"></div>
      ) : (
        <div className="p-4 relative">
          {isUpdating && (
            <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <div
              className="flex flex-1 items-center space-x-4 p-1 pl-2 cursor-pointer rounded-full
                  hover:bg-muted/50 transition-all duration-200 justify-between"
              onClick={() => setIsExpand(!isExpand)}
            >
              <div
                className="flex items-center gap-2"
                onClick={() => {
                  window.location.href = `/store/${storeId}`;
                }}
              >
                {store?.avatar_url ? (
                  <Avatar className="h-8 w-8 border">
                    <img src={store?.avatar_url} alt={store?.name} />
                  </Avatar>
                ) : (
                  <Avatar className="h-8 w-8 border flex items-center justify-center">
                    <Store className="scale-70 opacity-80" />
                  </Avatar>
                )}
                <div className="flex flex-col justify-center">
                  <h2 className="text-md font-semibold">{store?.name}</h2>
                  <p className="text-xs text-destructive flex items-center gap-2">
                    {data?.decline_reason}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 mr-2 transition-transform duration-200 ${
                  isExpand ? "rotate-180" : ""
                }`}
              />
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                removeWholeStore(storeId);
              }}
              className="ml-2"
            >
              Remove
            </Button>
            <Button
              size="sm"
              disabled={!data?.accept}
              className="mr-2"
              onClick={() => {
                const urlParams = new URLSearchParams();
                if (discountCode) {
                  urlParams.set("discount", discountCode);
                  urlParams.set("pickup", isPickUp);
                }
                if (urlParams.toString()) {
                  window.location.href = `/order/new/${storeId}?${urlParams.toString()}`;
                } else {
                  window.location.href = `/order/new/${storeId}`;
                }
              }}
            >
              Checkout
              <ChevronRight />
            </Button>
          </div>
          {isExpand && (
            <div className="mt-0 ml-6 pl-3 border-l pt-1">
              {(data?.items || []).map((item, index) => (
                <CartChildrenItem
                  key={index}
                  item={item}
                  onIncreaseQuantity={() => handleIncreaseQuantity(index)}
                  onDecreaseQuantity={() => handleDecreaseQuantity(index)}
                  onRemoveItem={() => handleRemoveItem(index)}
                />
              ))}
              <Separator className="my-2" />
              <div className="flex items-center h-10">
                <div className="w-1/2">
                  <CartDiscountDialog
                    storeId={storeId}
                    discountCode={discountCode}
                    setDiscountCode={setDiscountCode}
                    currentDiscount={data?.discount || null}
                  />
                </div>
                {!isPickUp && (
                  <>
                    <Separator orientation="vertical" className="mx-2 h-10" />
                    <div className={`flex w-1/2 items-center gap-4 px-4`}>
                      <div className="flex items-center gap-4">
                        <Truck className="w-6 h-6 text-primary" size={24} />
                        <div className="flex flex-col items-start">
                          <p className="text-sm font-semibold">Shipping Fee</p>
                          <p className="text-xs text-muted-foreground font-normal">
                            {(data?.courier?.distance / 1000).toFixed(1) < 0.1
                              ? "Nearby"
                              : `${(data?.courier?.distance / 1000).toFixed(
                                  1
                                )} km`}
                          </p>
                        </div>
                      </div>
                      <p className="ml-auto text-sm text-muted-foreground font-medium">
                        {formatPrice(data?.courier?.fee || 0)}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center mt-2 px-4">
                <span className="text-md font-semibold">Total to pay</span>
                <span className="text-md font-medium text-primary">
                  {formatPrice(data?.finalPrice)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CartParentItem;
