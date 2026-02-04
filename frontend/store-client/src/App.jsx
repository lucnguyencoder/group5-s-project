import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { StoreProvider } from "./context/StoreContext";
import { Toaster } from "@/components/ui/sonner";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Layout from "./components/layout/Layout";
import { ThemeProvider } from "@/components/theme-provider";
import AuthenticatePage from "./pages/AuthenticatePage";
import AccountPage from "./pages/AccountPage";
import MyStorePage from "./pages/MyStorePage";
import StoreStaffListPage from "./pages/StoreStaffListPage";
import FoodEditPage from "./pages/FoodEditPage";
import FoodListPage from "./pages/FoodListPage";
import CategoryPage from "./pages/CategoryPage";
import CreateCategoryPage from "./pages/CreateCategoryPage";
import ConfigPage from "./pages/ConfigPage";
import DiscountPage from "./pages/DiscountPage";
import TicketListPage from "./pages/tickets/TicketListPage";
import TicketDetailPage from "./pages/tickets/TicketDetailPage";
import { OrderListPage } from "./pages/OrderListPage";
import { StoreCustomizationPage } from "./pages/StoreCustomizationPage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <UserProvider>
        <StoreProvider>
          <Router>
            <Layout>
              <Routes>
                <Route
                  path="/auth/:type"
                  element={
                    <PublicRoute>
                      <AuthenticatePage />
                    </PublicRoute>
                  }
                />
                <Route>
                  <Route
                    path="/account"
                    element={
                      <PrivateRoute reqPerm="/api/auth/me">
                        <AccountPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/store"
                    element={
                      <PrivateRoute reqPerm="/api/store/me">
                        <MyStorePage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/food"
                    element={
                      <PrivateRoute reqPerm="/api/store/foods">
                        <FoodListPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/food/new"
                    element={
                      <PrivateRoute
                        reqPerm="/api/store/foods"
                        reqMethod={"POST"}
                      >
                        <FoodEditPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/discount"
                    element={
                      <PrivateRoute reqPerm="/api/store/discount">
                        <DiscountPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/food/edit/:id"
                    element={
                      <PrivateRoute
                        reqPerm="/api/store/foods/:foodId"
                        reqMethod={"PUT"}
                      >
                        <FoodEditPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/configuration"
                    element={
                      <PrivateRoute reqPerm="/api/store/profile/config">
                        <ConfigPage />
                      </PrivateRoute>
                    }
                  />
                </Route>
                <Route
                  path="/staff"
                  element={
                    <PrivateRoute reqPerm="/api/store/staff">
                      <StoreStaffListPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/menu/categories"
                  element={
                    <PrivateRoute reqPerm="/api/store/categories">
                      <CategoryPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/menu/categories/update"
                  element={
                    <PrivateRoute
                      reqPerm="/api/store/categories"
                      reqMethod={"POST"}
                    >
                      <CreateCategoryPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/menu/categories/update/:categoryId"
                  element={
                    <PrivateRoute
                      reqPerm="/api/store/categories/:id"
                      reqMethod={"PUT"}
                    >
                      <CreateCategoryPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tickets"
                  element={
                    <PrivateRoute reqPerm="/api/store/tickets">
                      <TicketListPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tickets/:ticketId"
                  element={
                    <PrivateRoute reqPerm="/api/store/tickets/:id">
                      <TicketDetailPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <PrivateRoute reqPerm="/api/store/order">
                      <OrderListPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="custom"
                  element={
                    <PrivateRoute reqPerm="/api/store/custom/">
                      <StoreCustomizationPage />
                    </PrivateRoute>
                  }
                />
                <Route path="/error" element={<ErrorPage />} />
              </Routes>
              <Toaster />
            </Layout>
          </Router>
        </StoreProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
