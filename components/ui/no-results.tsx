import { LuSearchX } from "react-icons/lu";
import { Button } from "./button";
import { Card } from "./card";
import { EmptyState } from "./empty-state";

/** What a list shows when the search and filters leave nothing: a message and a way back. */
export function NoResults({
  title,
  description = "Try a different search or adjust your filters.",
  onClear,
  framed = false,
}: {
  /** "No doctors found" */
  title: string;
  description?: string;
  onClear: () => void;
  /** Wraps it in a card, for lists that aren't already in one. */
  framed?: boolean;
}) {
  const content = (
    <EmptyState
      icon={LuSearchX}
      title={title}
      description={description}
      action={
        <Button variant="secondary" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      }
    />
  );
  return framed ? <Card rounded>{content}</Card> : content;
}
