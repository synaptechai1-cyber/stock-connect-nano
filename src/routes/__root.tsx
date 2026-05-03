import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NanoTech Health — Pharmacy Exchange Marketplace" },
      { name: "description", content: "Connect with pharmacies to share surplus and needed medication stock. Reduce shortages. Prevent waste." },
      { property: "og:title", content: "NanoTech Health — Pharmacy Exchange Marketplace" },
      { property: "og:description", content: "Connect with pharmacies to share surplus and needed medication stock. Reduce shortages. Prevent waste." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "NanoTech Health — Pharmacy Exchange Marketplace" },
      { name: "twitter:description", content: "Connect with pharmacies to share surplus and needed medication stock. Reduce shortages. Prevent waste." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4acd29aa-3edd-4f21-a5b4-99f839a148c4/id-preview-3add5c4c--81e4348b-7b25-4563-aba6-bdda69cc4ec1.lovable.app-1777799482197.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4acd29aa-3edd-4f21-a5b4-99f839a148c4/id-preview-3add5c4c--81e4348b-7b25-4563-aba6-bdda69cc4ec1.lovable.app-1777799482197.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
}
