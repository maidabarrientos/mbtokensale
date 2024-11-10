"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { TokenFormValues } from "./types";

export function BasicInfo() {
  const { control } = useFormContext<TokenFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Configure the basic parameters of your token
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Token" {...field} />
                </FormControl>
                <FormDescription>
                  The name of your token
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="MTK" {...field} />
                </FormControl>
                <FormDescription>
                  The symbol of your token (e.g., BTC, ETH)
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="decimals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Decimals</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Number of decimal places (0-18)
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={control}
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
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}