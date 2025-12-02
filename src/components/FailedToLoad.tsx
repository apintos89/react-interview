import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface FailedToLoadProps {
  failedMessage: string;
  backText?: string;
  hasBackNavigation?: boolean;
}

export function FailedToLoad({
  failedMessage,
  backText,
  hasBackNavigation,
}: FailedToLoadProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-destructive">{failedMessage}</p>
          {hasBackNavigation && (
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
