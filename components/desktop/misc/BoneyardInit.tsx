"use client";

import { useEffect } from "react";
import { configureBoneyard } from "@/components/desktop/ui/skeleton";

export default function BoneyardInit() {
  useEffect(() => {
    configureBoneyard({
      color: "rgba(39,39,42,1)",
      darkColor: "rgba(63,63,70,1)",
      animate: "shimmer",
      speed: "1.5s",
    });
  }, []);

  return null;
}
