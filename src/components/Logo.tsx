import logo from "@/assets/logo.jpg";

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return <img src={logo} alt="NanoTech Health" className={`${className} rounded-full object-cover`} />;
}
