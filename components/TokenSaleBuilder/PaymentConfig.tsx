"use client";

import { memo } from 'react';
import { Control } from "react-hook-form";
import { TokenFormValues } from "./types";
import { SUPPORTED_TOKENS } from "@/lib/constants";
import { TokenSelector } from "./TokenSelector";
import { TokenAddressFields } from "./TokenAddressFields";

interface PaymentConfigProps {
  selectedTokens: string[];
  onTokenToggle: (symbol: string) => void;
  control: Control<TokenFormValues>;
}

export const PaymentConfig = memo(function PaymentConfig({
  selectedTokens,
  onTokenToggle,
  control,
}: PaymentConfigProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {SUPPORTED_TOKENS.map((token) => (
          <div key={token.symbol} className="space-y-4">
            <TokenSelector
              {...token}
              isSelected={selectedTokens.includes(token.symbol)}
              onToggle={onTokenToggle}
            />
            {selectedTokens.includes(token.symbol) && (
              <TokenAddressFields
                symbol={token.symbol}
                control={control}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});