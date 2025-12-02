import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { TodoItemRow } from "../components/TodoItemRow";
import { CreateItemDialog } from "../components/CreateItemDialog";
import { useListItems } from "@/hooks/useTodoItems";
import { Header } from "@/components/Header";
import { EmptyList } from "@/components/EmptyList";
import { Loading } from "@/components/Loading";
import { FailedToLoad } from "@/components/FailedToLoad";

export function ListItems() {
  const { listId } = useParams<{ listId: string }>();
  const { state } = useLocation();
  const [showCreateItem, setShowCreateItem] = useState(false);

  const { data: items, isLoading, error } = useListItems(listId!);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !items) {
    <FailedToLoad
      failedMessage="Failed to load items"
      backText="Back to Lists"
      hasBackNavigation={true}
    />;
  }

  const completedCount =
    items?.filter((item) => item.status === "Completed").length || 0;
  const totalCount = items?.length || 0;

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header
          title={state.name}
          subtitle={
            totalCount > 0
              ? `${completedCount} of ${totalCount} completed`
              : null
          }
          buttonText="Add Item"
          onButtonClick={setShowCreateItem}
          hasBackNavigation
        />

        {!items || items.length === 0 ? (
          <EmptyList
            emptyMessage="No items yet. Add one to get started!"
            buttonText="Add First Item"
            onButtonClick={setShowCreateItem}
          />
        ) : (
          <div className="container mx-auto px-4 py-8">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-1">
                  {items.map((item) => (
                    <TodoItemRow key={item.id} item={item} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <CreateItemDialog
        listId={listId!}
        open={showCreateItem}
        onOpenChange={setShowCreateItem}
      />
    </>
  );
}
