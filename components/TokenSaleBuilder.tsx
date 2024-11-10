"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Coins, Lock, Timer, Users, Wallet } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { SUPPORTED_TOKENS } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ContractPreview } from "@/components/ContractPreview";
import { FeatureCards } from "@/components/FeatureCards";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const tokenFormSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  symbol: z.string().min(1, "Token symbol is required"),
  decimals: z.string().regex(/^\d+$/).transform(Number).pipe(
    z.number().min(0).max(18)
  ),
  totalSupply: z.string().regex(/^\d+$/).transform(Number).pipe(
    z.number().min(1)
  ),
  acceptedTokens: z.array(z.string()).min(1, "Select at least one payment token"),
  rate: z.string().regex(/^\d+$/).transform(Number).pipe(
    z.number().min(1)
  ),
  vestingPeriod: z.string().regex(/^\d+$/).transform(Number).pipe(
    z.number().min(0)
  ),
  softCap: z.string().regex(/^\d+$/).transform(Number).pipe(
    z.number().min(0)
  ),
  hardCap: z.string().regex(/^\d+$/).transform(Number).pipe(
    z.number().min(1)
  ),
  enableWhitelist: z.boolean(),
  enableVesting: z.boolean(),
  enableBuybackProtection: z.boolean(),
});

export type TokenFormValues = z.infer<typeof tokenFormSchema>;

export default function TokenSaleBuilder() {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [contractConfig, setContractConfig] = useState<TokenFormValues | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<string[]>(['ETH']);

  const form = useForm<TokenFormValues>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: {
      name: "",
      symbol: "",
      decimals: "18",
      totalSupply: "1000000",
      acceptedTokens: ['ETH'],
      rate: "1000",
      vestingPeriod: "180",
      softCap: "100",
      hardCap: "1000",
      enableWhitelist: false,
      enableVesting: true,
      enableBuybackProtection: false,
    },
  });

  function onSubmit(values: TokenFormValues) {
    setContractConfig(values);
    setShowPreview(true);
    toast({
      title: "Contract Configuration Ready",
      description: "Review your token sale contract configuration.",
    });
  }

  const toggleToken = (token: string) => {
    setSelectedTokens(prev => {
      const newTokens = prev.includes(token)
        ? prev.filter(t => t !== token)
        : [...prev, token];
      form.setValue('acceptedTokens', newTokens);
      return newTokens;
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Token Sale Contract Builder
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
            Create your custom ERC20 token sale smart contract with advanced features and security
          </p>
        </div>

        <Tabs defaultValue="basic" className="w-full max-w-4xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Token Information</CardTitle>
                    <CardDescription>
                      Configure the basic parameters of your ERC20 token
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Token Name</FormLabel>
                            <FormControl>
                              <Input placeholder="My Token" {...field} />
                            </FormControl>
                            <FormDescription>
                              The full name of your token
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="symbol"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Token Symbol</FormLabel>
                            <FormControl>
                              <Input placeholder="MTK" {...field} />
                            </FormControl>
                            <FormDescription>
                              The trading symbol (3-4 characters)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="decimals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Decimals</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Number of decimal places (usually 18)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="totalSupply"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Supply</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Total number of tokens to mint
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Configuration</CardTitle>
                    <CardDescription>
                      Configure accepted tokens and rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <FormLabel>Accepted Tokens</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {SUPPORTED_TOKENS.map((token) => (
                          <Card
                            key={token.symbol}
                            className={`cursor-pointer transition-colors ${
                              selectedTokens.includes(token.symbol)
                                ? 'border-primary'
                                : ''
                            }`}
                            onClick={() => toggleToken(token.symbol)}
                          >
                            <CardContent className="flex items-center justify-between p-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{token.icon}</span>
                                <span>{token.symbol}</span>
                              </div>
                              <Switch
                                checked={selectedTokens.includes(token.symbol)}
                                onCheckedChange={() => toggleToken(token.symbol)}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="rate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Token Rate</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Tokens per payment token
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Features</CardTitle>
                    <CardDescription>
                      Configure additional security and vesting options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <FormField
                        control={form.control}
                        name="enableWhitelist"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Whitelist
                              </FormLabel>
                              <FormDescription>
                                Enable KYC whitelist for token sale
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="enableVesting"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Vesting
                              </FormLabel>
                              <FormDescription>
                                Enable token vesting schedule
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="enableBuybackProtection"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Buyback Protection
                              </FormLabel>
                              <FormDescription>
                                Enable anti-dump mechanisms
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    {form.watch('enableVesting') && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="vestingPeriod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vesting Period (days)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormDescription>
                                Token lock period after sale
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="softCap"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Soft Cap</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Minimum goal for the sale
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hardCap"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hard Cap</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Maximum amount to raise
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <div className="flex flex-col gap-4">
                <FeatureCards />
                <Separator />
                <div className="flex justify-end">
                  <Button type="submit" size="lg">
                    Generate Contract
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </Tabs>

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contract Preview</DialogTitle>
            </DialogHeader>
            {contractConfig && <ContractPreview config={contractConfig} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}