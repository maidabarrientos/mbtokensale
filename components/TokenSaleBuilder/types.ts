import { z } from "zod";

export const tokenFormSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  symbol: z.string().min(1, "Token symbol is required"),
  decimals: z.string(),
  totalSupply: z.string(),
  acceptedTokens: z.array(z.string()),
  tokenAddresses: z.record(z.string(), z.record(z.string(), z.string().optional())),
  rate: z.string(),
  maxPurchase: z.string(),
  vestingPeriod: z.string(),
  softCap: z.string(),
  hardCap: z.string(),
  saleCap: z.string(),
  individualCap: z.string(),
  enableWhitelist: z.boolean(),
  enableVesting: z.boolean(),
  enableBuybackProtection: z.boolean(),
  enableBridge: z.boolean(),
  enableBurn: z.boolean(),
  enableStaking: z.boolean(),
  enablePause: z.boolean(),
  burnRate: z.string().optional(),
  stakingRewardRate: z.string().optional(),
  stakingMinPeriod: z.string().optional(),
});

export type TokenFormValues = z.infer<typeof tokenFormSchema>;