import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { Toaster } from "@/components/ui/sonner";
import FoodPage from "./pages/Food";
import FoodDetailPage from "./pages/FoodDetailPage";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Layout from "./components/layout/Layout";
import { ThemeProvider } from "@/components/theme-provider";
import AuthenticatePage from "./pages/AuthenticatePage";
import AccountPage from "./pages/AccountPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ErrorPage from "./pages/ErrorPage";
import VerifyOtpPage from "./pages/verifyOtpPage";
import FoodListPage from "./pages/FoodListPage";
import TicketListPage from "./pages/tickets/TicketListPage";
import TicketDetailPage from "./pages/tickets/TicketDetailPage";
import StoreDetailPage from "./pages/StoreDetailPage";
import NewOrderPage from "./pages/NewOrderPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import { SavedFoodPage } from "./pages/SavedFoodPage";
import { FollowingFoodPage } from "./pages/FollowingStorePage";
import { YourOrderPage } from "./pages/YourOrderPage";
import StoreListPage from "./pages/StoreListPage";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <UserProvider>
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
                    <PrivateRoute>
                      <AccountPage />
                    </PrivateRoute>
                  }
                />
                <Route path="/food" element={<FoodListPage />} />
                <Route path="/store" element={<StoreListPage />} />
                <Route path="/food/:foodId" element={<FoodDetailPage />} />
                <Route path="/store/:storeId" element={<StoreDetailPage />} />
                <Route
                  path="/order/new/:storeId"
                  element={
                    <PrivateRoute>
                      <NewOrderPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/order/:orderId"
                  element={
                    <PrivateRoute>
                      <OrderDetailPage />
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/food" replace />} />

                <Route path="/error" element={<ErrorPage />} />

                <Route
                  path="/auth/account-recovery/request"
                  element={
                    <PublicRoute>
                      <ForgotPasswordPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/auth/account-recovery/verifyOTP"
                  element={
                    <PublicRoute>
                      <VerifyOtpPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/auth/account-recovery/reset-password"
                  element={
                    <PublicRoute>
                      <ResetPasswordPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/tickets"
                  element={
                    <PrivateRoute>
                      <TicketListPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/messages"
                  element={<Navigate to="/tickets" replace />}
                />
                <Route
                  path="/messages/:ticketId"
                  element={
                    <PrivateRoute>
                      <TicketDetailPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <PrivateRoute>
                      <YourOrderPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/saved"
                  element={
                    <PrivateRoute>
                      <SavedFoodPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/following"
                  element={
                    <PrivateRoute>
                      <FollowingFoodPage />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/food" replace />} />
              </Route>
            </Routes>
            <Toaster />
          </Layout>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
