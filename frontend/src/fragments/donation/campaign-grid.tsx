import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";
import type { DonationCampaign } from "../../types";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { formatCurrency, formatNumber } from "../../utils/format";

interface CampaignGridProps {
  campaigns: DonationCampaign[];
  onOpenDetail: (campaign: DonationCampaign) => void;
}

export function CampaignGrid({ campaigns, onOpenDetail }: CampaignGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {campaigns.map((campaign, index) => {
        const progress = campaign.target_amount
          ? (campaign.current_amount / campaign.target_amount) * 100
          : 0;
        return (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div
              className="cursor-pointer transition-all hover:opacity-90"
              role="link"
              tabIndex={0}
              onClick={() => onOpenDetail(campaign)}
              onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onOpenDetail(campaign);
                }
              }}
            >
              <Card className="space-y-4 transition-all hover:border-primary/50 hover:shadow-md">
                <div>
                  <h3 className="text-lg font-semibold">{campaign.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {campaign.description}
                  </p>
                </div>
                <div className="space-y-2">
                  <Progress value={progress} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <p>{formatCurrency(campaign.current_amount)}</p>
                    <p>{Math.round(progress)}%</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <p className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> Campaign #{campaign.id}
                  </p>
                  <p className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />{" "}
                    {formatNumber(campaign.donations_count ?? 0)} donors
                  </p>
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpenDetail(campaign);
                  }}
                >
                  View Details
                </Button>
              </Card>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
