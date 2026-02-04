import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  Share,
  Star,
  MapPin,
  CalendarClock,
  Phone,
  Map,
  User,
  MoreVertical,
  Flag,
  Check,
  Leaf,
  ArrowUpRight,
  ListPlus,
  Clock2,
  AlertCircleIcon,
  BadgePlus,
  Search,
  MessageCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import TextField from "@/components/common/TextField";

const StoreDetailHeader = ({ storeData }) => {
  return (
    <>
      {storeData.cover_image_url && storeData.avatar_url ? (
        <div className="relative w-full">
          <img
            src={storeData.cover_image_url}
            alt={storeData.name}
            className={`w-full object-cover max-h-[30vh] rounded-lg mb-4 border-1 border-border/50`}
          />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-b-lg" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-auto">
            <div className="flex items-center gap-3 w-full">
              {storeData.avatar_url && (
                <Avatar className="h-18 w-18 border-2 border-white/20">
                  <img src={storeData.avatar_url} alt={storeData.name} />
                </Avatar>
              )}
              <div className="w-full">
                <h2 className="font-semibold text-xl mb-0 text-white">
                  {storeData.name}
                </h2>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <h2 className="font-semibold text-3xl mb-0 px-1 pb-3 text-white">
            {storeData.name}
          </h2>
        </div>
      )}
      {!storeData.isActive && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>
            This store is force closed and disabled by Yami staff.
          </AlertTitle>
          <AlertDescription>
            <p>
              We are sorry for the inconvenience. If you need any assistance,
              please make a ticket to our support team directly.
            </p>
            <Link to="/tickets/new">
              <Button variant={"outline"} size={"sm"}>
                <BadgePlus />
                Create a ticket
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default StoreDetailHeader;
