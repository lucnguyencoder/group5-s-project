import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Heart, Eye, ShoppingCart, X, Star } from 'lucide-react'
import publicDataService from '@/services/publicDataService'
import { formatPrice } from '@/utils/formatter'
import { toast } from 'sonner'
import HorizontalProperties from "@/components/common/HorizontalProperties";
import { useNavigate } from 'react-router-dom';

export const FollowingStore = () => {
    const [followingStores, setFollowingStores] = useState([]);
    const navigate = useNavigate();
    const fetchFollowingStores = async () => {
        try {
            const response = await publicDataService.getAllFollowingStore();
            console.log("Following Stores:", response);
            if (response.success) {
                setFollowingStores(response.data || []);
                console.log("Following Stores:", response.data[0]);
            } else {
                console.error("Failed to fetch following stores:", response.message);
            }
        } catch (error) {
            console.error("Error fetching following stores:", error);
        }
    }
    const handelUnfollowStore = async (storeId) => {
        try {
            const response = await publicDataService.addFavoriteStore(storeId);
            if (response.success) {
                toast.success("Store unfollowed successfully");
                fetchFollowingStores();
            } else {
                toast.error(response.message || "Failed to unfollow store");
            }
        } catch (error) {
            toast.error("Failed to unfollow store");
        }
    }
    useEffect(() => {
        fetchFollowingStores();
    }, []);
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Your Following Stores</h2>
                    <div className="text-sm text-gray-600">
                        {followingStores.length} following stores
                    </div>
                </div>
                <div className=" overflow-hidden">
                    <div className='overflow-x-auto flex flex-col gap-5 p-3'>
                        {followingStores.map((data) => (
                            <div key={data.id} className="flex gap-3 p-5 border-b last:border-b-0 hover:bg-gray-100/5 p-5 border rounded-sm cursor-pointer" onClick={() => navigate(`/store/${data.store_id}`)}>
                                <div>
                                    <img
                                        src={data.store.avatar_url}
                                        alt={data.store.store_name}
                                        className="w-32 h-32 object-cover rounded-md"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="flex flex-col justify-center flex-1">
                                    <div>
                                        <h1 className="text-3xl font-medium">{data.store.name}</h1>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        <div>
                                            <HorizontalProperties
                                                icon={
                                                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                                }
                                                value={data.store.rating}
                                            />
                                        </div>
                                        <div>Description: {data.store.description}</div>
                                        <div>Address: {data.store.address}</div>
                                    </div>
                                </div>
                                <div className="flex justify-end items-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); handelUnfollowStore(data.store.id); }}
                                    >
                                        <X className="w-4 h-4 text-red-600" />
                                        Remove from saved
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {followingStores.length === 0 && (
                    <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                            No following stores yet
                        </h3>
                    </div>
                )}
            </div>
        </div>
    )
}