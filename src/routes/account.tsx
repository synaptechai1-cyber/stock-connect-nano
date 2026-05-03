import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  component: Account,
  head: () => ({ meta: [{ title: "Account — NanoTech Health" }] }),
});

function Account() {
  const { user, profile, refreshProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ pharmacy_name: "", city: "", phone: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (profile) setForm({ pharmacy_name: profile.pharmacy_name, city: profile.city, phone: profile.phone });
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("profiles").update(form).eq("id", user!.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    await refreshProfile();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold mb-6">Account settings</h1>
          <form onSubmit={save} className="space-y-4 rounded-xl border bg-card p-6">
            <div>
              <Label>Email</Label>
              <Input disabled value={profile?.email ?? ""} />
            </div>
            <div>
              <Label htmlFor="pn">Pharmacy name</Label>
              <Input id="pn" value={form.pharmacy_name} onChange={(e) => setForm((f) => ({ ...f, pharmacy_name: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="city">City / Region</Label>
              <Input id="city" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="phone">Phone (WhatsApp)</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="text-sm text-muted-foreground">
              Subscription: {profile?.is_subscribed ? "✓ Active" : "Inactive"}
            </div>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
