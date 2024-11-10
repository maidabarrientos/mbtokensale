"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { TokenFormValues } from "./types";

export function AdvancedFeatures() {
  const form = useFormContext<TokenFormValues>();
  const { control, watch } = form;
  const enableStaking = watch("enableStaking");
  const enableBurn = watch("enableBurn");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sale Configuration</CardTitle>
          <CardDescription>
            Configure sale limits and security features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="saleCap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Cap</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Maximum tokens available for sale
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="individualCap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Individual Cap</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Maximum purchase per wallet
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Features</CardTitle>
          <CardDescription>
            Configure security and control mechanisms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={control}
              name="enablePause"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Pausable
                    </FormLabel>
                    <FormDescription>
                      Allow pausing the token sale
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
              control={control}
              name="enableBurn"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Token Burn
                    </FormLabel>
                    <FormDescription>
                      Enable token burning mechanism
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

            {enableBurn && (
              <FormField
                control={control}
                name="burnRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Burn Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Percentage of tokens to burn per transaction
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={control}
              name="enableStaking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Staking
                    </FormLabel>
                    <FormDescription>
                      Enable token staking rewards
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

            {enableStaking && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="stakingRewardRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Staking APY (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Annual percentage yield for staking
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="stakingMinPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Stake Period (days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Minimum staking duration
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}