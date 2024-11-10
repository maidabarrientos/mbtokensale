"use client";

import { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface TokenSelectorProps {
  symbol: string;
  name: string;
  icon: string;
  isSelected: boolean;
  onToggle: (symbol: string) => void;
}

export const TokenSelector = memo(function TokenSelector({
  symbol,
  name,
  icon,
  isSelected,
  onToggle,
}: TokenSelectorProps) {
  return (
    <Card className={cn("transition-colors", isSelected && "border-primary")}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <div>
              <span className="font-medium">{symbol}</span>
              <p className="text-xs text-muted-foreground">{name}</p>
            </div>
          </div>
          <Switch 
            checked={isSelected}
            onCheckedChange={() => onToggle(symbol)}
          />
        </div>
      </CardContent>
    </Card>
  );
});