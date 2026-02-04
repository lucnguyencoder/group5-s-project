import SetTitle from "@/components/common/SetTitle";
import DataManagementLayout from "@/components/layout/DataManagementLayout";
import PrivateComponents from "@/components/layout/PrivateComponents";
import CategoryList from "@/components/modules/store/CategoryList";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcwDotIcon } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryPage = () => {
  return (
    <DataManagementLayout
      headerLeft={
        <>
          <h1 className="text-xl font-semibold">Category</h1>
        </>
      }
      containScroll={true}
      headerRight={
        <>
          <PrivateComponents url="/api/store/categories" method="POST">
            <Link to={"/menu/categories/update"}>
              <Button size="sm">
                <Plus />
                Create new Category
              </Button>
            </Link>
          </PrivateComponents>
        </>
      }
    >
      <SetTitle title="Category Management" />
      <CategoryList />
    </DataManagementLayout>
  );
};

export default CategoryPage;
