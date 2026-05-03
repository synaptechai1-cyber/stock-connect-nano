import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-20">
      <div className="container mx-auto px-4 py-10 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="text-sm font-medium">Powered by NanoTech Health</span>
        </div>
        <p className="text-xs text-muted-foreground max-w-xl">
          NanoTech Health is a communication platform for licensed healthcare providers.
          We do not sell medication, set prices, or automate clinical decisions.
        </p>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} NanoTech Health</p>
      </div>
    </footer>
  );
}
