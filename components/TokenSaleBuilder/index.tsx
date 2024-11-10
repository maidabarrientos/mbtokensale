"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { ContractPreview } from "@/components/ContractPreview";
import { FeatureCards } from "@/components/FeatureCards";
import { BasicInfo } from "./BasicInfo";
import { PaymentConfig } from "./PaymentConfig";
import { AdvancedFeatures } from "./AdvancedFeatures";
import { TokenFormValues, tokenFormSchema } from "./types";

export default function TokenSaleBuilder() {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<string[]>(["ETH"]);

  const form = useForm<TokenFormValues>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: {
      name: "",
      symbol: "",
      decimals: "18",
      totalSupply: "1000000",
      acceptedTokens: ["ETH"],
      tokenAddresses: {},
      rate: "1000",
      maxPurchase: "10000",
      vestingPeriod: "180",
      softCap: "100",
      hardCap: "1000",
      saleCap: "1000000",
      individualCap: "10000",
      enableWhitelist: false,
      enableVesting: true,
      enableBuybackProtection: false,
      enableBridge: false,
      enableBurn: false,
      enableStaking: false,
      enablePause: true,
      burnRate: "2",
      stakingRewardRate: "12",
      stakingMinPeriod: "30",
    },
  });

  const handleTokenToggle = useCallback((symbol: string) => {
    setSelectedTokens(prev => {
      const newTokens = prev.includes(symbol)
        ? prev.filter(t => t !== symbol)
        : [...prev, symbol];
      
      form.setValue("acceptedTokens", newTokens, { 
        shouldValidate: true 
      });
      
      return newTokens;
    });
  }, [form]);

  const onSubmit = useCallback((values: TokenFormValues) => {
    setShowPreview(true);
    toast({
      title: "Contract Configuration Ready",
      description: "Review your token sale contract configuration.",
    });
  }, [toast]);

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

        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-4xl space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <BasicInfo control={form.control} />
            </TabsContent>

            <TabsContent value="payment">
              <PaymentConfig
                selectedTokens={selectedTokens}
                onTokenToggle={handleTokenToggle}
                control={form.control}
              />
            </TabsContent>

            <TabsContent value="advanced">
              <AdvancedFeatures control={form.control} />
            </TabsContent>
          </Tabs>

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

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contract Preview</DialogTitle>
            </DialogHeader>
            {showPreview && <ContractPreview config={form.getValues()} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}