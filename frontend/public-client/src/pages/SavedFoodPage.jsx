import React from 'react'
import { SavedFood } from '@/components/modules/food/SavedFood'
import SetTitle from '@/components/common/SetTitle'

export const SavedFoodPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <SetTitle title="Saved Foods" />
            <SavedFood />
        </div>
    )
}