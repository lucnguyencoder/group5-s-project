import SetTitle from "@/components/common/SetTitle";
import { StoreCustomization } from "@/components/modules/store/StoreCustomization";

export const StoreCustomizationPage = () => {
    return (
        <div className="container mx-auto p-4">
            <SetTitle title="Customization" />
            <StoreCustomization />
        </div>
    );
}