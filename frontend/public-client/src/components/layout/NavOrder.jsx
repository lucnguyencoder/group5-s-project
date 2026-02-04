import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getOrdersList } from "@/services/orderService";
import { ReceiptText } from "lucide-react";
import { useEffect, useState } from "react";
import SmallOrderCard from "../modules/nav/SmallOrderCard";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { useUser } from "@/context/UserContext";

export function NavOrder() {
  const { user, isAuthenticated } = useUser();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let intervalId;

    const fetchOrders = async () => {
      try {
        const response = await getOrdersList({ is_completed: false });
        if (response.success) {
          setOrders(response?.data?.data || []);
        } else {
          console.error("Failed to fetch orders:", response.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (isAuthenticated && user?.id) {
      fetchOrders();
      intervalId = setInterval(fetchOrders, 30000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAuthenticated, user?.id]);

  const showLoginPrompt = () => (
    <>
      <DropdownMenuLabel>Please log in to view your orders.</DropdownMenuLabel>
      <Link to="/auth/login">
        <Button variant="outline" className="w-full">
          Log In
        </Button>
      </Link>
    </>
  );

  const listAllOrder = () => (
    <>
      {/* <DropdownMenuLabel>My Orders</DropdownMenuLabel> */}
      <DropdownMenuGroup>
        {orders.length === 0 && (
          <DropdownMenuItem disabled>
            No current active orders found.
          </DropdownMenuItem>
        )}
        {orders.map((order) => (
          <Link to={`/order/${order.order_id}`} key={order.id}>
            <SmallOrderCard key={order?.order_id} data={order} />
          </Link>
        ))}
        {/* <pre>
            <code>{JSON.stringify(orders, null, 2)}</code>
          </pre> */}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />

      <Link to="orders">
        <DropdownMenuItem>View all orders</DropdownMenuItem>
      </Link>
    </>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger as Child>
        <Button
          variant="outline"
          className={"border-none rounded-l-lg rounded-r-xs"}
        >
          <ReceiptText className="h-5 w-5" />
          Orders{" "}
          {orders.length > 0 && <Badge className="">{orders.length}</Badge>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        {isAuthenticated && user?.id ? listAllOrder() : showLoginPrompt()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
