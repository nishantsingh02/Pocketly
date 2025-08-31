import { cn } from "@/lib/utils";
import React from "react";

interface ChartContainerProps {
  config: Record<string, any>;
  className?: string;
  children: React.ReactNode;
}

export function ChartContainer({
  className,
  children,
}: ChartContainerProps) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
}

export function ChartTooltipContent() {
  return null;
}