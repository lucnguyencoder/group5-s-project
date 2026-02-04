import SetTitle from "@/components/common/SetTitle"
import { FollowingStore } from "@/components/modules/store/FollowingStore"

export const FollowingFoodPage = () => {
    return (
        <>
            <SetTitle title="Following Stores" />
            <FollowingStore />
        </>
    )
}