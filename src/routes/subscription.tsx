import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/subscription")({
  component: Subscription,
  head: () => ({ meta: [{ title: "Subscription — NanoTech Health" }] }),
});

const benefits = [
  "Post unlimited stock listings",
  "Contact other pharmacies via WhatsApp & email",
  "Filter and search the full marketplace",
  "Be discovered by pharmacies in your region",
];

function Subscription() {
  const { user, profile, refreshProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

  const upgrade = async (plan: "monthly" | "annual") => {
    setBusy(true);
    // Payment provider not yet integrated — flag account as subscribed for MVP
    const { error } = await supabase.from("profiles").update({ is_subscribed: true }).eq("id", user!.id);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Subscribed (${plan}). You can now post and contact.`);
    await refreshProfile();
    navigate({ to: "/marketplace" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl font-bold">Upgrade to unlock the marketplace</h1>
          <p className="mt-3 text-muted-foreground">
            Viewing is always free. Posting and contacting requires a subscription.
          </p>
          {profile?.is_subscribed && (
            <p className="mt-4 inline-block px-3 py-1 rounded-full bg-success/15 text-success text-sm font-medium">
              ✓ You have an active subscription
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {[
            { id: "monthly", title: "Monthly", price: "$29", per: "per month" },
            { id: "annual", title: "Annual", price: "$290", per: "per year", badge: "Save 17%" },
          ].map((p) => (
            <div key={p.id} className="rounded-2xl border bg-card p-8 flex flex-col">
              {p.badge && (
                <span className="self-start text-xs font-semibold px-2 py-1 rounded-full bg-primary text-primary-foreground mb-3">
                  {p.badge}
                </span>
              )}
              <h2 className="text-2xl font-bold">{p.title}</h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className="text-muted-foreground">{p.per}</span>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />{b}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6"
                disabled={busy || profile?.is_subscribed}
                onClick={() => upgrade(p.id as "monthly" | "annual")}
              >
                {profile?.is_subscribed ? "Active" : "Upgrade"}
              </Button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
