import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import SetTitle from "@/components/common/SetTitle";

const ErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUser();
  const errorMessage = location.state?.message || "An error occurred";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleContactUs = () => {
    window.location.href = "mailto:support@yami.com";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/100 z-50">
      <SetTitle title={"An error occured"} />
      <div className="w-full max-w-md rounded-lg overflow-hidden">
        <div className="p-6 text-center">
          <img
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh_4V8mcCFE4v_sliuclUDfmYyXy6DHch-AIEonixjg8P9Cy_NF8NIJgreitvI4Q0Cn3ZmlOzGr47kpP45AIREffX7hb3K4EbGKwOI6y0u-E_PnovIEkfLf4ChR5v3YHEhKuFiC7eaMfT8/s1600/4c7a1d3932a211fa.png"
            alt="Error Icon"
            className="w-32 h-32 mx-auto mb-4"
          />

          <div className="space-y-4 mb-6">
            <p className="text-xl font-semibold ">{errorMessage}</p>
            <p className="text-muted-foreground">
              We apologize for the inconvenience. Please contact our support
              team if you need assistance.
            </p>
          </div>

          <div className="flex space-y-3 w-full gap-2 justify-center">
            <Button variant="outline" onClick={handleContactUs}>
              Contact Us
            </Button>
            <Button onClick={handleLogout}>Sign out</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
