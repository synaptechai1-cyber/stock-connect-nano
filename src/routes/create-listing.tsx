import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/create-listing")({
  component: CreateListing,
  head: () => ({ meta: [{ title: "Create listing — NanoTech Health" }] }),
});

function CreateListing() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: "available" as "available" | "needed",
    medicine_name: "",
    strength: "",
    quantity: 1,
    expiry_date: "",
  });

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.is_subscribed) {
      toast.error("You need an active subscription to post listings");
      navigate({ to: "/subscription" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("listings").insert({
      user_id: user!.id,
      type: form.type,
      medicine_name: form.medicine_name,
      strength: form.strength || null,
      quantity: form.quantity,
      expiry_date: form.expiry_date || null,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Listing posted");
    navigate({ to: "/marketplace" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create Listing</h1>
          <p className="text-sm text-muted-foreground mb-6">Takes less than 30 seconds.</p>
          <form onSubmit={submit} className="space-y-4 rounded-xl border bg-card p-6">
            <div>
              <Label>Listing type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as "available" | "needed" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">🟢 Stock Available</SelectItem>
                  <SelectItem value="needed">🔵 Stock Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="medicine">Medicine name</Label>
              <Input id="medicine" required value={form.medicine_name} onChange={(e) => setForm((f) => ({ ...f, medicine_name: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="strength">Strength (optional)</Label>
              <Input id="strength" placeholder="e.g. 500mg" value={form.strength} onChange={(e) => setForm((f) => ({ ...f, strength: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="qty">Quantity</Label>
              <Input id="qty" type="number" min={1} required value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: parseInt(e.target.value || "1") }))} />
            </div>
            <div>
              <Label htmlFor="expiry">Expiry date (optional)</Label>
              <Input id="expiry" type="date" value={form.expiry_date} onChange={(e) => setForm((f) => ({ ...f, expiry_date: e.target.value }))} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Posting..." : "Submit"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
