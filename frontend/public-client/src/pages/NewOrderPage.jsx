import { Avatar } from "@/components/ui/avatar";
import publicDataService from "@/services/publicDataService";
import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
  useMemo,
} from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { formatHours, formatPrice } from "@/utils/formatter";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  HandCoins,
  Landmark,
  MapPin,
  ScanQrCode,
  Store,
  Truck,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { CartContext } from "@/context/CartContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import CartChildrenItem from "@/components/modules/cart/CartChildrenItem";
import { CartDiscountDialog } from "@/components/modules/cart/CartDiscountDialog";
import { Textarea } from "@/components/ui/textarea";
import { createOrder as createOrderService } from "@/services/orderService";
import SetTitle from "@/components/common/SetTitle";

export default function NewOrderPage() {
  const { storeId } = useParams();
  const urlParams = new URLSearchParams(window.location.search);
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    removeWholeStore,
  } = useContext(CartContext);
  const cartItems = useMemo(() => cart[storeId] || [], [cart, storeId]);
  const { getCoord, isPickUp, deliveryAddresses, user } = useUser();
  const [enablePickUp, setEnablePickUp] = useState(
    urlParams.get("pickup") === "true" || isPickUp
  );
  const [location, setLocation] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [store, setStore] = useState(null);
  const [data, setData] = useState(null);
  const [discountCode, setDiscountCode] = useState(
    urlParams.get("discount") || null
  );
  const [prepareTime, setPrepareTime] = useState(null);
  const [paymentOption, setPaymentOption] = useState("cash");
  const [customInstruction, setCustomInstruction] = useState("");
  const lastCartUpdateRef = useRef(null);
  const isInitialRender = useRef(true);
  const prevCartItemsRef = useRef(JSON.stringify(cartItems));

  const navigate = useNavigate();

  const handleCreateOrder = async () => {
    if (!location) {
      toast.error("Please select a delivery location.");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!store) {
      toast.error("Store information is not available.");
      return;
    }

    const orderData = {
      storeId,
      cartItems,
      location,
      pickup: enablePickUp,
      discountCode,
      paymentOption,
      customInstruction,
      userId: user?.id || null,
      currentTime: new Date().toLocaleTimeString(),
    };

    try {
      const response = await createOrderService(orderData);
      if (response.success) {
        console.log("Order created successfully:", response.data);
        toast.success("Order created successfully!");
        removeWholeStore(storeId);
        navigate(`/order/${response.data.order.order_id}`);
      } else {
        toast.error(response.message || "Failed to create order.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("An error occurred while creating the order.");
    }
  };

  useEffect(() => {
    const setInitialLocation = async () => {
      if (enablePickUp) {
        const coord = await getCoord();
        setLocation(coord || null);
      } else if (deliveryAddresses && deliveryAddresses.length > 0) {
        const defaultAddr = deliveryAddresses.find((addr) => addr.is_default);
        setLocation(defaultAddr || null);
      } else {
        setLocation(null);
      }
    };
    setInitialLocation();
  }, [enablePickUp, deliveryAddresses, getCoord]);

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
          pickup: enablePickUp,
          discountCode,
          paymentOption,
          customInstruction,
          userId: user?.id || null,
          currentTime: new Date().toLocaleTimeString("en-US", {
            hour12: false,
          }),
        });
        console.log("Cart items fetched:", des);

        if (lastCartUpdateRef.current === updateId) {
          if (des.success) {
            setStore(des.data.data.store);
            setData(des.data.data);
            data.items.forEach((item) => {
              if (item?.food?.preparation_time) {
                setPrepareTime((prev) => {
                  return Math.max(prev || 0, item.food.preparation_time || 0);
                });
              }
            });
          } else {
            console.error("Failed to fetch item details:", des.message);
            toast.error(des.message || "Failed to get cart details.");
          }
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        if (lastCartUpdateRef.current === updateId) {
          setIsInitialLoading(false);
          setIsUpdating(false);
        }
      }
    },
    [storeId, cartItems, enablePickUp, location, discountCode]
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
  }, [storeId, cartItems, enablePickUp, location, discountCode, getItemDetail]);

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

  return (
    <div className="max-w-7xl mx-auto w-full p-4">
      <SetTitle title="New Order" />
      <p className="text-3xl font-semibold mt-8 mb-4">
        Let's finish your order
      </p>
      {isInitialLoading ? (
        <div className="w-full">
          <div className="mb-4 w-full bg-card border p-4 rounded-lg flex justify-between items-center">
            <p className="text-md text-nowrap">
              It seem you are missing delivery address, please add a new one
            </p>
            <Link to="/account#delivery">
              <Button variant="outline">
                <Edit className="mr-2" />
                Edit my delivery information
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex">
          <div className="relative w-2/3">
            {isUpdating && (
              <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <div
                className="flex flex-1 items-center space-x-4 cursor-pointer rounded-full
                  justify-between"
              >
                <div className="flex items-center gap-2">
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
              </div>
            </div>
            <p className="text-lg font-medium mt-4 mb-3">Order Items</p>
            <div className="-m-3">
              {(data?.items || []).map((item, index) => (
                <CartChildrenItem
                  key={index}
                  item={item}
                  onIncreaseQuantity={() => handleIncreaseQuantity(index)}
                  onDecreaseQuantity={() => handleDecreaseQuantity(index)}
                  onRemoveItem={() => handleRemoveItem(index)}
                />
              ))}
            </div>
            <p className="text-lg font-medium mt-4 mb-3">
              Promotions & Discount
            </p>
            <CartDiscountDialog
              storeId={storeId}
              discountCode={discountCode}
              setDiscountCode={setDiscountCode}
              currentDiscount={data?.discount || null}
            />
            <p className="text-lg font-medium mt-4 mb-3">Receiving Option</p>
            <div className="flex gap-4">
              {data?.storeSettings?.allow_pick_up && (
                <div
                  className={`flex-1 rounded-lg p-4 border-2 transition-all duration-100 cursor-pointer ${
                    !enablePickUp ? "hover:border-primary/60" : "border-primary"
                  }`}
                  onClick={() => {
                    setEnablePickUp(true);
                  }}
                >
                  <Store className="w-7 h-7 text-primary" size={24} />
                  <p className="text-lg font-semibold mt-2">Pickup at store</p>
                  <p className="text-sm text-muted-foreground">Free</p>
                  {/* list */}
                  <ul className="list-disc pl-5 mt-2">
                    {store?.address && (
                      <li className="text-sm text-muted-foreground">
                        Pick up at {store?.address}
                      </li>
                    )}
                    {store?.closing_time && (
                      <li className="text-sm text-muted-foreground">
                        Store closes at {formatHours(store?.closing_time)}, so
                        please arrive before then.
                      </li>
                    )}
                  </ul>
                </div>
              )}
              <div
                className={`flex-1 rounded-lg p-4 border-2 transition-all duration-100 cursor-pointer ${
                  enablePickUp ? "hover:border-primary/60" : "border-primary"
                }`}
                onClick={() => {
                  setEnablePickUp(false);
                }}
              >
                <Truck className="w-7 h-7 text-primary" size={24} />
                <p className="text-lg font-semibold mt-2">
                  Receive at your location
                </p>
                <p className="text-sm text-muted-foreground">
                  {enablePickUp
                    ? "Select to calculate shipping fee"
                    : formatPrice(data?.courier?.fee)}
                </p>
                <ul className="list-disc pl-5 mt-2">
                  {store?.address && (
                    <li className="text-sm text-muted-foreground">
                      Shipped to {location?.address_line || "your location"}
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <p className="text-lg font-medium mt-4 mb-3">Payment Option</p>
            <div className="flex gap-4">
              <div
                className={`flex-1 rounded-lg p-4 border-2 transition-all duration-100 cursor-pointer ${
                  paymentOption === "cash"
                    ? "border-primary"
                    : "hover:border-primary/60"
                }`}
                onClick={() => setPaymentOption("cash")}
              >
                <HandCoins className="w-7 h-7 text-primary" size={24} />
                <p className="text-lg font-semibold mt-2">Cash</p>
                <p className="text-sm text-muted-foreground">
                  Pay with cash on delivery
                </p>
              </div>
              {data?.storeSettings?.bank.trim() &&
                data?.storeSettings?.bank_number && (
                  <div
                    className={`flex-1 rounded-lg p-4 border-2 transition-all duration-100 cursor-pointer ${
                      paymentOption === "qr"
                        ? "border-primary"
                        : "hover:border-primary/60 "
                    }`}
                    onClick={() => {
                      setPaymentOption("qr");
                    }}
                  >
                    <Landmark className="w-7 h-7 text-primary" size={24} />
                    <p className="text-lg font-semibold mt-2">Bank transfer</p>
                    <p className="text-sm text-muted-foreground">
                      Safer, Faster, and more convenient
                    </p>
                  </div>
                )}
            </div>

            <p className="text-lg font-medium mt-4 mb-3">Custom Instruction</p>
            <Textarea
              placeholder="Add any special instructions here..."
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              className={"min-h-[200px]"}
            />
          </div>
          <div className="w-1/3 ml-8">
            <div className="sticky top-4">
              <div className="bg-card p-4 rounded-lg shadow">
                <p className="text-xl font-semibold mb-2">Order Summary</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-md font-medium">Base price</span>
                  <span className="text-md">
                    {formatPrice(data?.basePrice)}
                  </span>
                </div>

                {!enablePickUp && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">Shipping fee</span>
                    <span className="text-sm">
                      {formatPrice(data?.courier?.fee)}
                    </span>
                  </div>
                )}
                {data?.basePrice - data?.salePrice > 0 && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">Discount</span>
                    <span className="text-sm">
                      -{formatPrice(data?.basePrice - data?.salePrice)}
                    </span>
                  </div>
                )}

                {data?.discount?.accepted && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">
                      Coupon{" "}
                      <span className="text-xs text-muted-foreground">
                        ({data?.discount?.data?.code})
                      </span>
                    </span>
                    <span className="text-sm">
                      -{formatPrice(data?.discount.discountedPrice)}
                    </span>
                  </div>
                )}
                <Separator className="my-4" />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-semibold">Total to pay</span>
                  <span className="text-lg font-medium text-primary">
                    {formatPrice(data?.finalPrice)}
                  </span>
                </div>
                <Button
                  className={"w-full mt-4"}
                  onClick={handleCreateOrder}
                  disabled={isUpdating || isInitialLoading || !data?.accept}
                >
                  Order
                </Button>
              </div>
              {/* <div className="bg-card p-4 rounded-lg shadow mt-4">
                <p className="text-md font-semibold mb-2">Preparation Time</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {prepareTime ? `~${prepareTime} minutes` : "Calculating..."}
                  </span>
                </div>
              </div> */}

              {/* <pre>
                <code>
                  {JSON.stringify(
                    {
                      // storeId,
                      // store,

                      // cartItems,
                      // location,
                      // pickup: isPickUp,
                      // discountCode,
                      // paymentOption,
                      // customInstruction,
                      data,
                    },
                    null,
                    2
                  )}
                </code>
              </pre> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
