import { ModeToggle } from "@/shared/components/ui/mode-toggle";
import "../globals.css";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>
      {children}
    </>
  );
}
