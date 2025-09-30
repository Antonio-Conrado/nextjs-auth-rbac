"use client";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("ui.notFound");

  const handleGoHome = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        {/* 404 */}
        <div className="relative mb-8">
          <div className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold text-primary/10 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h1 className="mb-4 text-primary text-3xl md:text-4xl font-bold">
            {t("title")}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {t("description")}
          </p>
        </div>

        {/* Buttons*/}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button onClick={handleGoHome} className="gap-2 px-6 py-3" size="lg">
            <ArrowLeft className="w-4 h-4" />
            {t("back")}
          </Button>

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="gap-2 px-6 py-3"
            size="lg"
          >
            <Home className="w-4 h-4" />
            {t("home")}
          </Button>
        </div>

        <div className="mt-16 flex justify-center items-center gap-8 text-muted-foreground">
          <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce delay-300" />
          <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce delay-600" />
        </div>
      </div>
    </div>
  );
}
