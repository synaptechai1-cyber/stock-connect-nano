import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/signup")({
  component: SignUp,
  head: () => ({ meta: [{ title: "Sign up — NanoTech Health" }] }),
});

function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    pharmacy_name: "",
    city: "",
    email: "",
    password: "",
    phone: "",
  });

  const onChange = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          pharmacy_name: form.pharmacy_name,
          city: form.city,
          phone: form.phone,
        },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome to NanoTech Health");
    navigate({ to: "/marketplace" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4"><Logo className="h-14 w-14" /></div>
            <h1 className="text-3xl font-bold">Register your pharmacy</h1>
            <p className="text-sm text-muted-foreground mt-2">Takes less than a minute. No verification delays.</p>
          </div>
          <form onSubmit={submit} className="space-y-4 rounded-xl border bg-card p-6">
            <div>
              <Label htmlFor="pharmacy_name">Pharmacy Name</Label>
              <Input id="pharmacy_name" required value={form.pharmacy_name} onChange={(e) => onChange("pharmacy_name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="city">City / Region</Label>
              <Input id="city" required value={form.city} onChange={(e) => onChange("city", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={(e) => onChange("email", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone">Phone (used for WhatsApp)</Label>
              <Input id="phone" type="tel" required placeholder="+1234567890" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={6} value={form.password} onChange={(e) => onChange("password", e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary underline">Log in</Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
