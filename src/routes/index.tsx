import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Pill, Recycle, MapPin, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "NanoTech Health — Pharmacy Exchange Marketplace" },
      { name: "description", content: "Post surplus stock. Find what you need. Connect instantly with trusted pharmacies." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Logo className="h-20 w-20" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              A Smarter Way for Pharmacies to Help Each Other
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Post surplus stock. Find what you need. Connect instantly with trusted pharmacies in your region.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link to="/signup"><Button size="lg">Join the Marketplace</Button></Link>
              <Link to="/login"><Button size="lg" variant="outline">Log in</Button></Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Pill, title: "Reduce shortages", desc: "Find medication you need from nearby pharmacies in seconds." },
              { icon: Recycle, title: "Prevent waste", desc: "Share surplus stock before it expires." },
              { icon: MapPin, title: "Stay regional", desc: "Connect with pharmacies in your city or region." },
              { icon: Zap, title: "No setup", desc: "No inventory uploads. No tutorials. Post in 30 seconds." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border bg-card p-6">
                <div className="h-10 w-10 rounded-md bg-accent text-accent-foreground flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <div className="rounded-2xl bg-primary text-primary-foreground p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to connect?</h2>
            <p className="mt-3 opacity-90">Register your pharmacy and start posting in under a minute.</p>
            <div className="mt-6">
              <Link to="/signup"><Button size="lg" variant="secondary">Create your account</Button></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
