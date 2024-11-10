"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { TokenFormValues } from "./types";
import { SUPPORTED_NETWORKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface TokenCardProps {
  symbol: string;
  name: string;
  icon: string;
  isSelected: boolean;
  onToggle: (symbol: string, checked: boolean) => void;
  control: Control<TokenFormValues>;
}

export const TokenCard = memo(function TokenCard({
  symbol,
  name,
  icon,
  isSelected,
  onToggle,
  control,
}: TokenCardProps) {
  const handleToggle = (checked: boolean) => {
    onToggle(symbol, checked);
  };

  return (
    <Card className={cn("transition-colors", isSelected && "border-primary")}>
      <CardContent className="p-4 space-y-4">
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
            onCheckedChange={handleToggle}
          />
        </div>
        {isSelected && symbol !== "ETH" && (
          <div className="space-y-4">
            {SUPPORTED_NETWORKS.map((network) => (
              <FormField
                key={network.id}
                control={control}
                name={`tokenAddresses.${symbol}.${network.id}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">{network.name} Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Enter ${symbol} contract address on ${network.name}`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Contract address for {symbol} on {network.name} network
                    </FormDescription>
                  </FormItem>
                )}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});