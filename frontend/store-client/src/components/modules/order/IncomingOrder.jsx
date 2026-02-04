import TextField from "@/components/common/TextField"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useStore } from "@/context/StoreContext"
import orderService from "@/services/orderService"
import storeLocationService from "@/services/storeLocationService"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ChevronDown, ChevronUp, Minus } from "lucide-react";
import { useUser } from "@/context/UserContext"


export const IncomingOrder = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const { store } = useStore();
    const { user } = useUser();
    const [orderState, setOrderState] = useState("new");
    const [openDetail, setOpenDetail] = useState({ open: false, index: -1 });
    const [method, setMethod] = useState('');
    const [payment, setPayment] = useState('');
    const fetchData = async () => {
        try {
            const response = await orderService.getNewOrder(store?.id);
            console.log(response);
            if (response.success) {
                setData(response.data.filter((d) => {
                    return d.orderEvents.length > 0 && d.orderEvents[0].event_type === orderState;
                }));
            }
            else {
                toast.error(response.message);
                return;
            }
        }
        catch (error) {
            console.log(error)
            toast.error('Unexpected Error: ', error);
            return;
        }

    }
    const getList = () => {
        return data?.filter((d) => {
            const matchCode = d?.order_code.toLowerCase().includes(search.toLowerCase());
            const matchMethod = method ? d?.order_type === method : true;
            const matchPayment = payment ? d?.payment_option === payment : true;
            return matchCode && matchMethod && matchPayment;
        });
    }

    const getDistance = (latitude, longitude) => {
        const distance = storeLocationService.calculateDistanceOnDevice(store?.latitude, store?.longitude, latitude, longitude);
        return distance
    }

    const handleOpenDetail = (idx) => {
        if (idx === openDetail?.index) {
            setOpenDetail((prev) => ({ ...prev, open: !prev.open }));
        } else {
            setOpenDetail({ open: true, index: idx })
        }
    }

    const handleChangeStatus = async (orderId) => {
        try {
            if (orderState === 'new') {
                if (user?.group?.name !== 'sale_agent') {
                    toast.error('You are not authorized to perform this action');
                    return;
                }
                const updateOrder = data.find((d) => d.order_id === orderId);
                if (updateOrder?.isPaid || updateOrder?.isCompleted) {
                    toast.error('Can not perform this action. The order is already paid or completed');
                    return;
                }
                if (updateOrder?.orderEvents[0]?.event_type !== 'new') {
                    toast.error('Order is already in other state');
                    return;
                }
                const validateInformation = {
                    storeId: store?.id,
                    staffId: user?.id,
                    orderId: updateOrder?.order_id,
                }
                const newEvent = {
                    event_metadata: updateOrder?.orderEvents[0].event_metadata,
                    event_timestamp: new Date().toISOString(),
                    event_type: 'preparing',
                    order_id: updateOrder?.order_id,
                    snapshot_triggered_by_name: user?.email,
                    triggered_by_user_id: user?.id
                }
                const response = await orderService.updateOrderStatusToPreparing(newEvent, validateInformation);
                if (response.success) {
                    toast.success('Order status updated successfully');
                    fetchData();
                }
                else {
                    toast.error(response.message);
                }
            }
        }
        catch (error) {
            console.error(error);
            toast.error('Unexpected Error: ' + error);
        }
    }

    useEffect(() => {
        fetchData();

    }, [store, orderState])
    return (
        <div>
            <br />
            <div className="flex flex-row gap-0 items-center justify-center">
                <Button
                    className="rounded-l rounded-r-none w-50"
                    variant={orderState === 'new' ? 'outline' : 'default'}
                    onClick={() => setOrderState('new')}
                >
                    New
                </Button>
                <Button
                    className="rounded-none w-50"
                    variant={orderState === 'preparing' ? 'outline' : 'default'}
                    onClick={() => setOrderState('preparing')}
                >
                    Preparing
                </Button>
                <Button
                    className="rounded-none w-50"
                    variant={orderState === 'delivering' ? 'outline' : 'default'}
                    onClick={() => setOrderState('delivering')}
                >
                    Delivering / Ready to pick up
                </Button>
                <Button
                    className="rounded-r rounded-l-none w-50"
                    variant={orderState === 'completed' ? 'outline' : 'default'}
                    onClick={() => setOrderState('completed')}
                >
                    Completed
                </Button>
            </div>
            <br />
            <div className="flex flex-row gap-2 items-center justify-center p-2">
                <Input className="h-8 text-xs pr-10" type={'text'} placeholder='Enter Order Code...' value={search} onChange={(e) => setSearch(e.target.value)} />
                <Select value={method} onValueChange={(v) => setMethod(v === 'all' ? '' : v)}>
                    <SelectTrigger>
                        <SelectValue placeholder='All method' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>All method</SelectItem>
                        <SelectItem value='delivery'>Delivery</SelectItem>
                        <SelectItem value='pick_up'>Pick Up</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={payment} onValueChange={(v) => setPayment(v === 'all' ? '' : v)}>
                    <SelectTrigger>
                        <SelectValue placeholder='All payment option' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>All payment option</SelectItem>
                        <SelectItem value='qr'>QR</SelectItem>
                        <SelectItem value='cash'>Cash</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col p-3 gap-5">
                {getList().map((d, idx) => {
                    const createdTime = new Date(d.created_at);
                    const now = new Date();
                    const diffMs = now - createdTime;
                    const diffMinutes = Math.floor(diffMs / 60000);
                    const diffHours = Math.floor(diffMs / 3600000);
                    return (
                        <div>
                            <div className="flex flex-row items-center cursor-pointer"
                                onClick={() => {
                                    handleOpenDetail(idx);
                                }}
                            >
                                <img
                                    className="h-20"
                                    style={{ borderRadius: '50%' }}
                                    src={d.customer.profile_picture ? d.customer.profile_picture :
                                        `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlRM2-AldpZgaraCXCnO5loktGi0wGiNPydQ&s`}
                                />
                                <div className="flex">
                                    <div className="ms-3">
                                        <p className="font-bold">{d.snapshot_recipient_name}</p>
                                        <p>Created {
                                            diffHours > 0
                                                ? `${diffHours} hour${diffHours > 1 ? 's' : ''} ${diffMinutes % 60} minute${diffMinutes % 60 > 1 ? 's' : ''}`
                                                : `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`
                                        } ago
                                        </p>
                                    </div>
                                </div>
                                <div className="ml-auto flex gap-2">
                                    <div className="border rounded p-2">
                                        <p>Distance: {getDistance(d.snapshot_recipient_latitude, d.snapshot_recipient_longitude) / 1000} km</p>
                                    </div>
                                    <div className="border rounded p-2">
                                        <p>Order Code: {d.order_code}</p>
                                    </div>
                                    <div className="border rounded p-2">
                                        <p>Payment method: {d.payment_option.toUpperCase()}</p>
                                    </div>
                                    <div className="border rounded p-2">
                                        <p>{d.order_type.toUpperCase()}</p>
                                    </div>
                                    {(openDetail.open && openDetail?.index === idx) ? <ChevronDown /> : <Minus />}
                                </div>
                            </div>
                            {(openDetail.open && openDetail?.index === idx) && (
                                <div className="p-4">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className={'text-left'}>Product</TableHead>
                                                <TableHead className={'text-center'}>Custom</TableHead>
                                                <TableHead className={'text-center'}>Request</TableHead>
                                                <TableHead className={'text-right'}>Price</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                {d?.orderItems.map((l) => (
                                                    <>
                                                        <TableCell className={'text-left'}>{l?.food.food_name}</TableCell>
                                                        <TableCell className={'text-center'}>{l?.customization || 'None'}</TableCell>
                                                        <TableCell className={'text-center'}>{l?.customer_special_instruction || 'None'}</TableCell>
                                                        <TableCell className={'text-right'}>{l?.sale_price}</TableCell>
                                                    </>
                                                ))}
                                            </TableRow >
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                            <br />
                            <div className="flex justify-end">
                                <Button className={'rounded-none'} onClick={() => handleChangeStatus(d.order_id)}>
                                    {orderState === 'new' && 'Confirm Order'}
                                    {orderState === 'preparing' && 'Assign Courier'}
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order Code</TableHead>
                        <TableHead>Final Price</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-center">Payment Option</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        {getList().map((l) => (
                            <>
                                <TableCell>{l?.order_code}</TableCell>
                                <TableCell>{l?.final_price}</TableCell>
                                <TableCell>{l?.snapshot_recipient_name}</TableCell>
                                <TableCell className={'text-center'}>{l.order?.payment_option.toUpperCase()} </TableCell>
                            </>
                        ))}
                    </TableRow >
                </TableBody>
            </Table> */}
        </div>
    )
}