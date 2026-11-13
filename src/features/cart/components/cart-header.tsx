import { Button } from "@/shared/ui/button";
import { BrushCleaning } from "lucide-react";
import React from "react";

export default function CartHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="title flex items-end gap-2.5">
        <h2 className="text-text-plain text-5xl font-bold">Cart</h2>
        <p className="text-text-muted text-base font-medium">6 products</p>
      </div>
      <Button variant="secondary">
        <BrushCleaning size={20} />
        Clear Cart
      </Button>
    </div>
  );
}
