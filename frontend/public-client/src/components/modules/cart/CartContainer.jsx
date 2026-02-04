import React from "react";
import CartParentItem from "./CartParentItem";

function CartContainer({ cart }) {

  return (
    <>
      {/* <pre>
        <code>{JSON.stringify(cart, null, 2)}</code>
      </pre> */}
      {Object.keys(cart).length === 0 ? (
        <div className="text-center text-muted-foreground p-4 min-h-[30vh] flex items-center justify-center text-lg">
          Your cart is empty. Start adding items to your cart!
        </div>
      ) : (
        Object.keys(cart).map((storeId) => (
          <CartParentItem
            key={storeId}
            storeId={storeId}
            cartItems={cart[storeId]}
            location={location}
          />
        ))
      )}
    </>
  );
}

export default CartContainer;
