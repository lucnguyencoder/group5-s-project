import React from "react";
import ProfileInformationCard from "./ProfileInformationCard";
import { Mail, User, CalendarDays, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

function Information12() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Row 1 */}
      <div className="col-span-2">
        <ProfileInformationCard icon={<Mail />} title="Email & Status">
          <div>
            <h2 className="text-lg font-semibold">johndoe@example.com</h2>
            <p className="text-sm text-muted-foreground">Account Active</p>
          </div>
        </ProfileInformationCard>
      </div>
      <div>
        <ProfileInformationCard icon={<User />} title="Full Name">
          <div>
            <h2 className="text-lg font-semibold">John Doe</h2>
          </div>
        </ProfileInformationCard>
      </div>

      {/* Row 2 */}
      <div>
        <ProfileInformationCard icon={<Users />} title="Gender">
          <div>
            <h2 className="text-lg font-semibold">Male</h2>
          </div>
        </ProfileInformationCard>
      </div>
      <div>
        <ProfileInformationCard icon={<CalendarDays />} title="Date of Birth">
          <div>
            <h2 className="text-lg font-semibold">01/01/1990</h2>
          </div>
        </ProfileInformationCard>
      </div>
      <div>
        <ProfileInformationCard
          icon={<Shield />}
          title="Security"
          onClick={() => (window.location.href = "/security")}
        >
          <div className="flex justify-end items-center h-full">
            <Button variant="outline" size="sm">
              Security Settings
            </Button>
          </div>
        </ProfileInformationCard>
      </div>
    </div>
  );
}

export default Information12;
