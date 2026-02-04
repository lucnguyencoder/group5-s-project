import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { Toaster } from "@/components/ui/sonner";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Layout from "./components/layout/Layout";
import { ThemeProvider } from "@/components/theme-provider";
import AuthenticatePage from "./pages/AuthenticatePage";
import AccountPage from "./pages/AccountPage";
import AccountListPage from "./pages/admin/accounts/AccountListPage";
import AdminTicketDetail from "./pages/ticketsCustomer/AdminTicketDetail";
import TicketListPage from "./pages/ticketsCustomer/TicketListPage";
import StoreAdminTicketDetail from "./pages/ticketStore/StoreAdminTicketDetail";
import StoreTicketListPage from "./pages/ticketStore/StoreTicketListPage";
import StoreListPage from "./pages/admin/stores/StoreListPage";
import StoreDetailsPage from "./pages/admin/stores/StoreDetailsPage";
import StoreCreatePage from "./pages/admin/stores/StoreCreatePage";
import GroupListPage from "./pages/admin/groups/GroupListPage";
import GroupEditPage from "./pages/admin/groups/GroupEditPage";
import ErrorPage from "./pages/ErrorPage";

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
                <Route
                  path="/accounts"
                  element={
                    <PrivateRoute reqPerm={"/api/admin/users"} reqMethod="GET">
                      <AccountListPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/stores/view" 
                  element={
                    <PrivateRoute reqPerm={"/api/admin/stores"} reqMethod="GET">
                      <StoreListPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/stores/new"
                  element={
                    <PrivateRoute
                      reqPerm={"/api/admin/stores"}
                      reqMethod="POST"
                    >
                      <StoreCreatePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/store/:id"
                  element={
                    <PrivateRoute
                      reqPerm={"/api/admin/stores/:id"}
                      reqMethod="GET"
                    >
                      <StoreDetailsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tickets/user"
                  element={
                    <PrivateRoute
                      reqPerm={"/api/admin/tickets/all"}
                      reqMethod="GET"
                    >
                      <TicketListPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tickets/user/:ticketId"
                  element={
                    <PrivateRoute
                      reqPerm={"/api/admin/tickets/:id"}
                      reqMethod="GET"
                    >
                      <AdminTicketDetail />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tickets/store"
                  element={
                    <PrivateRoute
                      reqPerm={"/api/admin/tickets/all"}
                      reqMethod="GET"
                    >
                      <StoreTicketListPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/tickets/store/:ticketId"
                  element={
                    <PrivateRoute
                      reqPerm={"/api/admin/tickets/:id"}
                      reqMethod="GET"
                    >
                      <StoreAdminTicketDetail />
                    </PrivateRoute>
                  }
                />
              </Route>
              <Route
                path="/groups"
                element={
                  <PrivateRoute reqPerm={"/api/admin/groups"} reqMethod="GET">
                    <GroupListPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/groups/update/:id"
                element={
                  <PrivateRoute
                    reqPerm={"/api/admin/groups/:id"}
                    reqMethod="GET"
                  >
                    <GroupEditPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/groups/update"
                element={
                  <PrivateRoute
                    reqPerm={"/api/admin/groups/add"}
                    reqMethod="POST"
                  >
                    <GroupEditPage />
                  </PrivateRoute>
                }
              />
              <Route path="/error" element={<ErrorPage />} />
            </Routes>
            <Toaster position="bottom-center" />
          </Layout>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
