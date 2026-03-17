import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, FileText, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddNote, useNotes } from "../hooks/useQueries";

export default function NotesPanel() {
  const { data: notes = [] } = useNotes();
  const addNoteMutation = useAddNote();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please add a title");
      return;
    }
    try {
      await addNoteMutation.mutateAsync({ title, content });
      toast.success("Note saved!");
      setTitle("");
      setContent("");
      setAdding(false);
    } catch {
      toast.error("Failed to save note");
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-base flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" /> Notes
        </h2>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setAdding((a) => !a)}
          className="text-xs"
          data-ocid="notes.open_modal_button"
        >
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="space-y-2 mb-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="glass border-border/50 text-sm"
            data-ocid="notes.input"
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Note content..."
            className="glass border-border/50 text-sm resize-none"
            rows={2}
            data-ocid="notes.textarea"
          />
          <Button
            type="submit"
            size="sm"
            className="btn-gradient w-full"
            disabled={addNoteMutation.isPending}
            data-ocid="notes.submit_button"
          >
            {addNoteMutation.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              "Save Note"
            )}
          </Button>
        </form>
      )}

      <ScrollArea className="max-h-48">
        {notes.length === 0 ? (
          <div className="text-center py-4" data-ocid="notes.empty_state">
            <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">No notes yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notes.map((note, i) => (
              <div
                key={note.title}
                className="glass rounded-xl p-3"
                data-ocid={`notes.item.${i + 1}`}
              >
                <div className="font-semibold text-xs text-foreground">
                  {note.title}
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
