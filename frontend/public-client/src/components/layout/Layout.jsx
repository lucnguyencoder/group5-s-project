import React from "react";
// import { AppSidebar } from "./AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import NavSecondary from "./NavSecondary";
import { CartProvider } from "@/context/CartContext";

function LayoutContent({ children }) {
  return (
    // <SidebarProvider>
    //   <AppSidebar />
    //   <SidebarInset
    //     className={`flex flex-row transition-all duration-180 ease-in-out

    //       `}
    //     //  ${shouldExpand ? "mr-80" : "mr-8"}
    //   >

    //   </SidebarInset>
    // </SidebarProvider>
    <div className="">
      <NavSecondary />
      <div
        className="pt-0"
      >{children}</div>
    </div>
  );
}

const Layout = ({ children }) => {
  return (
    <CartProvider>
      <LayoutContent>{children}</LayoutContent>
    </CartProvider>
  );
};

export default Layout;
