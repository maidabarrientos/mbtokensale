"use client";

import { memo } from 'react';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { TokenFormValues } from "./types";
import { SUPPORTED_NETWORKS } from "@/lib/constants";

interface TokenAddressFieldsProps {
  symbol: string;
  control: Control<TokenFormValues>;
}

export const TokenAddressFields = memo(function TokenAddressFields({
  symbol,
  control,
}: TokenAddressFieldsProps) {
  if (symbol === "ETH") return null;

  return (
    <div className="mt-4 space-y-4">
      {SUPPORTED_NETWORKS.map((network) => (
        <FormField
          key={`${symbol}-${network.id}`}
          control={control}
          name={`tokenAddresses.${symbol}.${network.id}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">{network.name} Address</FormLabel>
              <FormControl>
                <Input
                  placeholder={`${symbol} contract address on ${network.name}`}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
});