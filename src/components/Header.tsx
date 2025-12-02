import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  subtitle: string | null;
  buttonText: string;
  onButtonClick: (open: boolean) => void;
  hasBackNavigation?: boolean;
}

export function Header({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  hasBackNavigation,
}: HeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          {hasBackNavigation && (
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            </div>
            {subtitle && (
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <Button onClick={() => onButtonClick(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
