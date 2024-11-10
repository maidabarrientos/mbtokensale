import { Card } from "@/components/ui/card";
import { Coins, Lock, Timer, Users } from "lucide-react";

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Multi-Token</h3>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Accept multiple currencies
        </p>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Security</h3>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          OpenZeppelin audited
        </p>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Vesting</h3>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Customizable periods
        </p>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Whitelist</h3>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          KYC support ready
        </p>
      </Card>
    </div>
  );
}