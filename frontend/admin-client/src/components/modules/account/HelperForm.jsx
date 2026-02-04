import Button12 from "@/components/common/Button12";
import Information12 from "@/components/common/Information12";
import VerticalAccountCard from "@/components/common/VerticalAccountCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, FilePlus } from "lucide-react";
import React from "react";

function HelperForm() {
  return (
    <VerticalAccountCard title="Others">
      <div className="flex flex-col gap-6">
        <div>
          <div>
            <h2 className="text-md font-semibold">Need Help?</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            {/* khi gặp vấn đề trong quá trình sử dụng, hoặc tố cáo người dùng/cửa hàng */}
            If you encounter any issues while using our service, or if you need
            to report a user or store, please contact us through our support
            team.
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            <Button className="w-full" size={"lg"}>
              <FilePlus />
              Send a new ticket
            </Button>
          </p>
        </div>
        <Separator />
        <div>
          <div>
            <h2 className="text-md font-semibold">Erase Account</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            Erase your account and all associated data. This action is
            irreversible.
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            <Button variant={"outline"} className="w-full" size={"sm"}>
              Contact us
              <ChevronRight />
            </Button>
          </p>
        </div>
      </div>
    </VerticalAccountCard>
  );
}

export default HelperForm;
