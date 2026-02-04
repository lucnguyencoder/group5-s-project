import SetTitle from "@/components/common/SetTitle";
import StoreFilterPanel from "@/components/modules/store/StoreFilterPanel";
import StoreList from "@/components/modules/store/StoreList";
import React, { useState } from "react";

function StoreListPage() {
  const [filter, setFilter] = useState({});

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
      <SetTitle title="Stores" />
      <StoreFilterPanel filter={filter} setFilter={setFilter} />
      <StoreList
        filter={filter}
        alertLocation
        compact={false}
        orientation="vertical"
      />
    </div>
  );
}

export default StoreListPage;
