import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CreditCard, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PLANS, createRental, getActiveRental } from "@/lib/rentals";
import { getAdminVideo } from "@/lib/admin-videos";
import { recordVideoRental } from "@/lib/admin-videos";

interface RentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: { id: string; title: string; image: string; price: string } | null;
}

type Step = "plan" | "payment" | "success";

const RentDialog = ({ open, onOpenChange, video }: RentDialogProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("plan");
  const [selectedPlan, setSelectedPlan] = useState<"24" | "48" | "72">("48");
  const [processing, setProcessing] = useState(false);

  if (!video) return null;

  const adminVideo = getAdminVideo(video.id);
  const activeRental = getActiveRental(video.id);
  
  // Use admin video prices if available, otherwise fallback to default plans
  const videoPlans = adminVideo ? [
    { hours: "24", price: `$${adminVideo.price24h.toFixed(2)}`, label: "Quick Watch" },
    { hours: "48", price: `$${adminVideo.price48h.toFixed(2)}`, label: "Standard" },
    { hours: "72", price: `$${adminVideo.price72h.toFixed(2)}`, label: "Extended" },
  ] : PLANS;

  const handleReset = () => {
    setStep("plan");
    setSelectedPlan("48");
    setProcessing(false);
  };

  const handleClose = (val: boolean) => {
    if (!val) handleReset();
    onOpenChange(val);
  };

  const handlePay = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    await createRental(video.id, selectedPlan);
    if (adminVideo) {
      const price = selectedPlan === "24" ? adminVideo.price24h : selectedPlan === "48" ? adminVideo.price48h : adminVideo.price72h;
      await recordVideoRental(video.id, price);
    }
    setProcessing(false);
    setStep("success");
  };

  const handleWatch = () => {
    handleClose(false);
    navigate(`/watch/${video.id}`);
  };

  const plan = videoPlans.find((p) => p.hours === selectedPlan)!;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        {activeRental ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-foreground">You already have access!</DialogTitle>
              <DialogDescription>Your rental for "{video.title}" is still active.</DialogDescription>
            </DialogHeader>
            <Button onClick={handleWatch} className="w-full mt-2">
              Watch Now
            </Button>
          </>
        ) : step === "plan" ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-foreground">Rent this video</DialogTitle>
              <DialogDescription className="line-clamp-1">{video.title}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 mt-2">
              {videoPlans.map((p) => (
                <button
                  key={p.hours}
                  onClick={() => setSelectedPlan(p.hours as "24" | "48" | "72")}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    selectedPlan === p.hours
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.hours} hours access</p>
                    </div>
                  </div>
                  <span className="font-display font-bold text-foreground">{p.price}</span>
                </button>
              ))}
            </div>
            <Button onClick={() => setStep("payment")} className="w-full mt-2">
              Continue to Payment
            </Button>
          </>
        ) : step === "payment" ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-foreground">Payment</DialogTitle>
              <DialogDescription>
                {plan.label} — {plan.hours}hrs for {plan.price}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Card Number</label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-secondary rounded-md border border-border">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="bg-transparent text-sm text-foreground outline-none flex-1 placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2.5 bg-secondary rounded-md border border-border text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2.5 bg-secondary rounded-md border border-border text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>
              <Button onClick={handlePay} disabled={processing} className="w-full">
                {processing ? "Processing…" : `Pay ${plan.price}`}
              </Button>
              <button
                onClick={() => setStep("plan")}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to plan selection
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Check className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-1">You're all set!</h3>
              <p className="text-sm text-muted-foreground mb-6">
                You have {plan.hours} hours to watch "{video.title}"
              </p>
              <Button onClick={handleWatch} className="w-full">
                Start Watching
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RentDialog;
