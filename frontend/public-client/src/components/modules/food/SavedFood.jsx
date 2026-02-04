import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Heart, Eye, ShoppingCart, X } from 'lucide-react';
import publicDataService from '@/services/publicDataService';
import { formatPrice } from '@/utils/formatter';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import FoodContainer from './FoodContainer';
import FoodCard from './FoodCard';
export const SavedFood = () => {
    const [savedFoods, setSavedFoods] = useState([]);
    const navigate = useNavigate();
    const fetchSavedFoods = async () => {
        try {
            const response = await publicDataService.getAllSavedFood();
            if (response.success) {
                setSavedFoods(response.data || []);
                console.log("Saved Foods:", response);
            } else {
                console.error("Failed to fetch saved foods:", response.message);
            }
        } catch (error) {
            console.error("Error fetching saved foods:", error);
        }
    }
    const handelUnsaveFood = async (foodId) => {
        try {
            const response = await publicDataService.addFavoriteFood(foodId);
            if (response.success) {
                toast.success("Food unsaved successfully");
                fetchSavedFoods();
            } else {
                toast.error(response.message || "Failed to unsave food");
            }
        } catch (error) {
            console.error("Error unsaving food:", error);
        }
    }
    useEffect(() => {
        fetchSavedFoods();
    }, []);
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Your Saved Food</h2>
                </div>

                <div className=" overflow-hidden">
                    <div className='overflow-x-auto flex flex-col gap-5 p-3'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                            {savedFoods.map((data) => (
                                <div className='h-auto' key={data.id}>
                                    <FoodCard key={data.id} food={data.food} horizontal={false} horizontalContainer={false} className='h-full' />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {savedFoods.length === 0 && (
                    <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                            No saved food yet
                        </h3>
                        <p className="">
                            Discover and save your favorite dishes
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}