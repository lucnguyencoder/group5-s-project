import React, {
    useState,
    useEffect,
    useImperativeHandle,
    forwardRef,
    useCallback,
} from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Loader2,
    Search,
    Filter,
    ChevronDown,
    AlertCircleIcon,
    MessageSquare,
    FileText,
    Layers,
    Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { storeService } from "@/services/basicService";
import { useUser } from "@/context/UserContext";
import { useStore } from "@/context/StoreContext";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import TextField from "@/components/common/TextField";
import LargeTextField from "@/components/common/LargeTextField";
import SelectField from "@/components/common/SelectField";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { foodService } from "@/services/foodService";

const UpdateCategoryForm = forwardRef(({ id, isCreateMode = false }, ref) => {
    const { store } = useStore();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [allFood, setAllFood] = useState([]);
    const [foodLoading, setFoodLoading] = useState(false);
    const [assignedFood, setAssignedFood] = useState([]);
    const [removeFood, setRemoveFood] = useState([]);
    const [addFood, setAddFood] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectionFilter, setSelectionFilter] = useState("all");

    const form = useForm({
        defaultValues: {
            category_name: "",
            description: "",
        },
    });

    useImperativeHandle(ref, () => ({
        submitForm: handleSubmit,
        isLoading,
        fetchLoading,
        error,
    }));

    const getAssignedFood = useCallback(async () => {
        if (!id) return;
        setFetchLoading(true);
        setError(null);
        try {
            const response = await storeService.getCategoryById(id);
            const foods = response.category.foods;
            if (response.success) {
                if (foods.length > 0) {
                    setAssignedFood(foods);
                }
            } else {
                setError("Failed to load current food");
                toast.error("Failed to load current food");
            }
        } catch (error) {
            console.error("Error fetching category details:", error);
            setError("Failed to load current food");
            toast.error("Failed to load current food");
        } finally {
            setFetchLoading(false);
        }
    }, [id]);

    const handelAddFood = (food_id) => {
        console.log(removeFood);
        console.log(addFood)
        setRemoveFood((prev) => prev.filter((id) => id !== food_id));
        setAddFood((prev) => {
            if (!prev.includes(food_id)) {
                return [...prev, food_id];
            }
            return prev;
        });
        setAssignedFood((prev) => {
            const foodObj = allFood.find((f) => f.food_id === food_id);
            if (foodObj && !prev.some((f) => f.food_id === food_id)) {
                return [...prev, foodObj];
            }
            return prev;
        });
    };

    const handleRemoveFood = (food_id) => {
        console.log(removeFood);
        console.log(addFood)
        setAddFood((prev) => prev.filter((id) => id !== food_id));
        setRemoveFood((prev) => {
            if (!prev.includes(food_id)) {
                return [...prev, food_id];
            }
            return prev;
        });
        setAssignedFood((prev) => prev.filter((f) => f.food_id !== food_id));
    };

    const fetchCategoryDetails = useCallback(async () => {
        if (!id) return;

        setFetchLoading(true);
        setError(null);

        try {
            const response = await storeService.getCategoryById(id);
            if (response.success) {
                form.reset({
                    category_name: response.category.category_name,
                    description: response.category.description || "",
                });
            } else {
                setError("Failed to load category details");
            }
        } catch (err) {
            console.error("Error fetching category details:", err);
            setError("Failed to load category details");
        } finally {
            setFetchLoading(false);
        }
    }, [id, form]);

    const fetchAllFood = async () => {
        setFoodLoading(true);
        try {
            const response = await foodService.getFoodByStore(user.id);
            console.log("All food:", response.foods);
            if (response.success) {
                setAllFood(response.foods || []);
            } else {
                toast.error("Failed to load food");
            }
        } catch (err) {
            console.error("Error fetching food:", err);
            toast.error("Failed to load food");
        } finally {
            setFoodLoading(false);
        }
    };

    useEffect(() => {
        fetchAllFood();
        console.log(allFood)
        if (id) {
            fetchCategoryDetails();
            getAssignedFood();
        }
    }, [id]);

    const handleSubmit = async () => {
        const values = form.getValues();

        if (!values.category_name) {
            setValidationErrors({
                ...(!values.category_name && { category_name: "Name is required" }),
            });
            return false;
        }
        if (!values.description || values.description.length < 10 || values.description.length > 500) {
            setValidationErrors({
                ...(!values.description && { description: "Description is required" }),
                ...(values.description.length < 10 && { description: "Description must be at least 10 characters" }),
                ...(values.description.length > 500 && { description: "Description must be at most 500 characters" }),
            });
            return false;
        }
        setIsLoading(true);
        try {
            let response;
            if (isCreateMode) {
                const updateData = {
                    categoryData: { ...values, store_id: store.id },
                    foodData: {
                        category_id: '',
                        food_id: assignedFood.map((f) => f.food_id).filter(Boolean)
                    }
                };
                response = await storeService.createCategory(updateData);

                // if (response.success) {
                //     if (assignedFood.length > 0) {
                //         for (const food of assignedFood) {
                //             await storeService.addFood(food.food_id, response.categoryId);
                //         }
                //     }
                // }
            } else {
                const updateData = {
                    categoryData: { ...values, store_id: store.id },
                    foodData: {
                        category_id: id || '',
                        addFood: addFood,
                        removeFood: removeFood
                    }
                }
                response = await storeService.updateCategory(id, updateData);
                if (response.success) {
                    if (removeFood.length > 0) {
                        for (let i = 0; i < removeFood.length; i++) {
                            await storeService.removeFoodCategory(id, removeFood[i]);
                        }
                    }
                    if (addFood.length > 0) {
                        for (let i = 0; i < addFood.length; i++) {
                            await storeService.addFoodCategory(id, addFood[i]);
                        }
                    }
                }
            }

            if (response.success) {
                toast.success(
                    response.message ||
                    (isCreateMode
                        ? "Category created successfully"
                        : "Category updated successfully")
                );
                return response.data || response;
            } else {
                toast.error(
                    response.message ||
                    (isCreateMode ? "Failed to create category" : "Failed to update category")
                );
            }
        } catch (error) {
            console.error(
                isCreateMode ? "Error creating category:" : "Error updating category:",
                error
            );
            toast.error(
                error.message ||
                (isCreateMode ? "Failed to create category" : "Failed to update category")
            );
        } finally {
            setIsLoading(false);
        }
    };

    const isFoodAssigned = (foodId) => {
        return assignedFood.some((f) => f.food_id === foodId);
    };

    const toggleFood = (foodId) => {
        const isAssigned = isFoodAssigned(foodId);
        if (isAssigned) {
            handleRemoveFood(foodId);
        } else {
            handelAddFood(foodId);
        }
    };

    const filteredFood = allFood.filter((food) => {
        const matchesSearch = searchQuery
            ? food.description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            food.food_name?.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        const isAssigned = isFoodAssigned(food.food_id);
        const matchesSelection =
            selectionFilter === "all"
                ? true
                : selectionFilter === "selected"
                    ? isAssigned
                    : selectionFilter === "unselected"
                        ? !isAssigned
                        : true;


        const matchesMethod = true;

        return matchesSearch && matchesSelection && matchesMethod;
    });

    return (
        <div className="w-full h-full">
            {fetchLoading && !isCreateMode ? (
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading category details...</span>
                </div>
            ) : error ? (
                <div className="text-center text-destructive py-4">{error}</div>
            ) : (
                <Form {...form}>
                    <form className="w-full h-full">
                        <ResizablePanelGroup
                            direction="horizontal"
                            className="w-full h-full"
                        >
                            <ResizablePanel defaultSize={40} minSize={30}>
                                <div className="p-6 h-full overflow-auto">
                                    <div className="space-y-4">
                                        <h2 className="text-2xl font-semibold pb-2">
                                            {isCreateMode ? "Create New Category" : "Edit Category"}
                                        </h2>
                                        {!isCreateMode && (
                                            <Alert variant="warning">
                                                <AlertCircleIcon />
                                                <AlertTitle>Caution</AlertTitle>
                                                <AlertDescription>
                                                    <p>
                                                        Modify the category details with care. Changes here can
                                                        affect food organization in the whole application.
                                                    </p>
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                        <FormField
                                            control={form.control}
                                            name="category_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <TextField
                                                            id="name"
                                                            label="Name"
                                                            required={true}
                                                            error={validationErrors.category_name}
                                                            value={field.value}
                                                            icon={<Users />}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <LargeTextField
                                                            id="description"
                                                            label="Description"
                                                            value={field.value}
                                                            onChange={(e) => field.onChange(e.target.value)}
                                                            rows={5}
                                                            icon={<FileText />}
                                                            placeholder="Enter group description"
                                                            required={false}
                                                            showCharCount={true}
                                                            maxLength={500}
                                                            helpText="Provide information about this category's purpose and food items"
                                                            error={validationErrors.description}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </ResizablePanel>

                            <ResizableHandle />

                            <ResizablePanel defaultSize={60} minSize={40}>
                                <div className="h-full flex flex-col">
                                    {foodLoading ? (
                                        <div className="p-6 flex justify-center items-center">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
                                            <span>Loading food...</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col h-full">
                                            <div className="p-4 border-b flex flex-wrap items-center gap-3 shrink-0">
                                                <div className="relative flex-1 min-w-[200px]">
                                                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder="Search food..."
                                                        className="pl-8 h-9"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                    />
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" size="sm" className="h-9">
                                                            Show:{" "}
                                                            {selectionFilter === "all"
                                                                ? "All"
                                                                : selectionFilter === "selected"
                                                                    ? "Selected"
                                                                    : "Unselected"}
                                                            <ChevronDown className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuRadioGroup
                                                            value={selectionFilter}
                                                            onValueChange={setSelectionFilter}
                                                        >
                                                            <DropdownMenuRadioItem value="all">
                                                                All
                                                            </DropdownMenuRadioItem>
                                                            <DropdownMenuRadioItem value="selected">
                                                                Selected
                                                            </DropdownMenuRadioItem>
                                                            <DropdownMenuRadioItem value="unselected">
                                                                Unselected
                                                            </DropdownMenuRadioItem>
                                                        </DropdownMenuRadioGroup>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div className="flex-1 overflow-hidden">
                                                <div className="h-full overflow-auto">
                                                    <Table className="relative w-full">
                                                        <TableHeader className="sticky top-0 bg-background z-10">
                                                            <TableRow>
                                                                <TableHead className="w-[50px]"></TableHead>
                                                                <TableHead className="w-[80px]">ID</TableHead>
                                                                <TableHead className="w-[200px]">
                                                                    Name
                                                                </TableHead>
                                                                <TableHead>Description</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {filteredFood.length === 0 ? (
                                                                <TableRow>
                                                                    <TableCell
                                                                        colSpan={4}
                                                                        className="text-center py-4"
                                                                    >
                                                                        No food items match your filters
                                                                    </TableCell>
                                                                </TableRow>
                                                            ) : (
                                                                filteredFood.map((food) => {
                                                                    const isAssigned = isFoodAssigned(
                                                                        food.food_id
                                                                    );
                                                                    return (
                                                                        <TableRow
                                                                            key={food.food_id}
                                                                            className={cn(
                                                                                "cursor-pointer transition-colors",
                                                                                isAssigned
                                                                                    ? "bg-primary/20 hover:bg-primary/30"
                                                                                    : "hover:bg-muted/50"
                                                                            )}
                                                                            onClick={() =>
                                                                                toggleFood(food.food_id)
                                                                            }
                                                                        >
                                                                            <TableCell
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            >
                                                                                <Checkbox
                                                                                    checked={isAssigned}
                                                                                    onCheckedChange={(checked) => {
                                                                                        if (checked) {
                                                                                            handelAddFood(
                                                                                                food.food_id
                                                                                            );
                                                                                        } else {
                                                                                            handleRemoveFood(
                                                                                                food.food_id
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>{food.food_id}</TableCell>
                                                                            <TableCell>
                                                                                {food.food_name}
                                                                            </TableCell>
                                                                            <TableCell className="truncate max-w-[300px]">
                                                                                {food.description}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </form>
                </Form>
            )}
        </div>
    );
});


export default UpdateCategoryForm;
