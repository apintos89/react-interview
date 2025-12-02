import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface EmptyListProps {
  emptyMessage: string;
  buttonText: string;
  onButtonClick: (open: boolean) => void;
}

export function EmptyList({
  emptyMessage,
  buttonText,
  onButtonClick,
}: EmptyListProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <p className="text-lg text-muted-foreground">{emptyMessage}</p>
            <Button onClick={() => onButtonClick(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {buttonText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
