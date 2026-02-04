import { getBankList } from "@/services/bankService";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function BankSelectDialog({ current_bank, onChange }) {
  const [bank, setBank] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUnsupported, setShowUnsupported] = useState(true);
  const [showBin, setShowBin] = useState(false);
  const fetchBankList = async () => {
    try {
      const response = await getBankList();
      setBank(response.data);
    } catch (error) {
      console.error("Error fetching bank list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchBankList();
  }, []);
  /**
   * "data": [
    {
      "name": "Ngân hàng TMCP Công thương Việt Nam",
      "code": "ICB",
      "bin": "970415",
      "short_name": "VietinBank",
      "supported": true
    },
    {
      "name": "Ngân hàng TMCP Ngoại Thương Việt Nam",
      "code": "VCB",
      "bin": "970436",
      "short_name": "Vietcombank",
      "supported": true
    },
    {
      "name": "Ngân hàng TMCP Quân đội",
      "code": "MB",
      "bin": "970422",
      "short_name": "MBBank",
      "supported": true
    },
    {
      "name": "Ngân hàng TMCP Á Châu",
      "code": "ACB",
      "bin": "970416",
      "short_name": "ACB",
      "supported": true
    },
   */
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className={"capitalize"}>
          {current_bank}
          <ChevronsUpDown />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Select Bank</DialogTitle>
          <DialogDescription>
            Make sure to select the correct bank for your transactions. Any
            errors may lead to transaction failures or wrong receivers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <ScrollArea className="max-h-[50vh] overflow-auto border rounded-md">
            {loading ? (
              <p>Loading banks...</p>
            ) : (
              bank.map((item) => (
                <DialogClose asChild key={item.code}>
                  <div
                    variant="outline"
                    className={`flex items-center p-2  ${
                      current_bank === item.short_name
                        ? "bg-primary/30 text-primary"
                        : " hover:bg-card/30"
                    } ${
                      item.supported
                        ? "cursor-pointer"
                        : "cursor-not-allowed opacity-50"
                    }`}
                    alt={item.supported ? "" : "Unsupported Bank"}
                    onClick={
                      item.supported
                        ? () => {
                            onChange(item.short_name);
                          }
                        : undefined
                    }
                  >
                    <div
                      className={`flex items-center min-w-20 max-w-20 h-12 border rounded-md justify-center mr-2 ${
                        current_bank === item.short_name
                          ? "bg-primary/30 text-primary-foreground font-semibold border-primary/20"
                          : "bg-card"
                      }`}
                    >
                      <span className="text-sm">{item.code}</span>
                    </div>
                    <div>
                      <p>{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.short_name} {showBin ? `(${item.bin})` : ""}
                      </p>
                    </div>
                  </div>
                </DialogClose>
              ))
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="justify-between flex w-full ">
          <div className="flex items-center space-x-2">
            <Switch
              id="supported-banks"
              checked={showUnsupported}
              onCheckedChange={(checked) => {
                setShowUnsupported(checked);
                if (!checked) {
                  setBank((prev) => prev.filter((b) => b.supported));
                } else {
                  fetchBankList();
                }
              }}
            />
            <Label htmlFor="supported-banks">Show Unsupported Bank</Label>
          </div>
          <div className="flex items-center space-x-2 mr-auto ml-2">
            <Switch
              id="show-bin"
              checked={showBin}
              onCheckedChange={setShowBin}
            />
            <Label htmlFor="show-bin">Show BIN</Label>
          </div>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BankSelectDialog;
