import { HeartHandshake, MapPin, Users } from "lucide-react";
import type { DonationCampaign } from "../../types";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { formatCurrency, formatNumber } from "../../utils/format";

interface CampaignGridProps {
  campaigns: DonationCampaign[];
  onDonate: (campaign: DonationCampaign) => void;
}

export function CampaignGrid({ campaigns, onDonate }: CampaignGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {campaigns.map((campaign) => {
        const progress = (campaign.raised / campaign.target) * 100;
        return (
          <Card key={campaign.id} className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{campaign.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{campaign.description}</p>
            </div>
            <div className="space-y-2">
              <Progress value={progress} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <p>{formatCurrency(campaign.raised)}</p>
                <p>{Math.round(progress)}%</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <p className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {campaign.location}
              </p>
              <p className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {formatNumber(campaign.donors)} donors
              </p>
            </div>
            <Button className="w-full gap-2" onClick={() => onDonate(campaign)}>
              <HeartHandshake className="h-4 w-4" /> Donate Now
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
