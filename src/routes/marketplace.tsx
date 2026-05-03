import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Plus, MessageCircle, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/marketplace")({
  component: Marketplace,
  head: () => ({ meta: [{ title: "Marketplace — NanoTech Health" }] }),
});

type Listing = {
  id: string;
  user_id: string;
  type: "available" | "needed";
  medicine_name: string;
  strength: string | null;
  quantity: number;
  expiry_date: string | null;
  created_at: string;
  profile?: { pharmacy_name: string; city: string; phone: string; email: string };
};

function Marketplace() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"all" | "available" | "needed">("all");
  const [region, setRegion] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

  const fetchListings = async () => {
    setLoading(true);
    const { data: rows } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });
    if (!rows) { setListings([]); setLoading(false); return; }
    const userIds = [...new Set(rows.map((r) => r.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, pharmacy_name, city, phone, email")
      .in("id", userIds);
    const map = new Map((profiles ?? []).map((p) => [p.id, p]));
    setListings(rows.map((r) => ({ ...r, profile: map.get(r.user_id) as Listing["profile"] })));
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchListings();
  }, [user]);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (type !== "all" && l.type !== type) return false;
      if (search && !l.medicine_name.toLowerCase().includes(search.toLowerCase())) return false;
      if (region && !l.profile?.city.toLowerCase().includes(region.toLowerCase())) return false;
      return true;
    });
  }, [listings, search, type, region]);

  const handleContact = (mode: "whatsapp" | "email", l: Listing) => {
    if (!profile?.is_subscribed) {
      toast.error("Upgrade your subscription to contact pharmacies");
      navigate({ to: "/subscription" });
      return;
    }
    if (!l.profile) return;
    if (mode === "whatsapp") {
      const phone = l.profile.phone.replace(/[^\d]/g, "");
      const msg = encodeURIComponent(`Hi ${l.profile.pharmacy_name}, regarding your NanoTech Health listing for ${l.medicine_name}...`);
      window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    } else {
      window.location.href = `mailto:${l.profile.email}?subject=NanoTech Health: ${l.medicine_name}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-sm text-muted-foreground">Live feed of stock available and needed.</p>
          </div>
          <Link to="/create-listing">
            <Button><Plus className="h-4 w-4 mr-2" />Create Listing</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-6">
          <Input placeholder="Search medicine..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All listings</SelectItem>
              <SelectItem value="available">Stock available</SelectItem>
              <SelectItem value="needed">Stock needed</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Filter by region..." value={region} onChange={(e) => setRegion(e.target.value)} />
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border bg-card p-10 text-center">
            <p className="text-muted-foreground">No listings yet. Be the first to post.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((l) => (
              <article key={l.id} className="rounded-xl border bg-card p-5 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    l.type === "available"
                      ? "bg-success/15 text-success"
                      : "bg-info/15 text-info"
                  }`}>
                    {l.type === "available" ? "🟢 Available" : "🔵 Needed"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(l.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{l.medicine_name}</h3>
                {l.strength && <p className="text-sm text-muted-foreground">{l.strength}</p>}
                <div className="mt-3 text-sm space-y-1">
                  <p><span className="text-muted-foreground">Quantity:</span> {l.quantity}</p>
                  {l.expiry_date && <p><span className="text-muted-foreground">Expires:</span> {l.expiry_date}</p>}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="font-medium text-sm">{l.profile?.pharmacy_name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{l.profile?.city}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => handleContact("whatsapp", l)}>
                    <MessageCircle className="h-4 w-4 mr-1" />WhatsApp
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleContact("email", l)}>
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
