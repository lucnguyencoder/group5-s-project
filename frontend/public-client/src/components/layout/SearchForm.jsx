import React from "react";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function SearchForm({ ...props }) {
  return (
    <div className="relative max-w-[200px] mr-1">
      <Input
        id="search"
        placeholder="Find something..."
        className="pl-10 rounded-lg border-none"
      />
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 opacity-50 select-none" />
    </div>
  );
}
