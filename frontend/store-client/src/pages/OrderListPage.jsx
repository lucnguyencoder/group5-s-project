import SetTitle from "@/components/common/SetTitle";
import DataManagementLayout from "@/components/layout/DataManagementLayout";
import OrderListLayout from "@/components/modules/order/OrderListLayout";

export const OrderListPage = () => {
  return (
    <>
      <SetTitle title="My Orders" />
      <DataManagementLayout containScroll={true}>
        <OrderListLayout />
      </DataManagementLayout>
    </>
  );
};
