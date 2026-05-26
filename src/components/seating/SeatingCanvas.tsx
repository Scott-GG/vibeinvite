"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { Plus, Trash2, Users, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { addTable, removeTable, assignGuestToTable } from "@/app/dashboard/events/[id]/seating/actions";

type Table = {
  id: string;
  table_name: string;
  capacity: number;
};

type Guest = {
  id: string;
  first_name: string;
  last_name: string;
  table_id: string | null;
};

// --- GuestCard ---
function GuestCard({ guest, isDragging }: { guest: Guest; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: guest.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex cursor-grab items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm shadow-sm transition-shadow active:cursor-grabbing ${
        isDragging ? "opacity-50" : "hover:shadow-md"
      }`}
    >
      <GripVertical className="h-3.5 w-3.5 text-stone-300" />
      <span className="truncate">
        {guest.first_name} {guest.last_name}
      </span>
    </div>
  );
}

// --- TableNode ---
function TableNode({
  table,
  guests,
}: {
  table: Table;
  guests: Guest[];
}) {
  const { isOver, setNodeRef } = useDroppable({ id: table.id });
  const filled = guests.length;
  const pct = table.capacity > 0 ? (filled / table.capacity) * 100 : 0;

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border-2 p-4 transition-all ${
        isOver
          ? "border-amber-500 bg-amber-50"
          : "border-stone-200 bg-stone-50"
      }`}
    >
      {/* Table header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-sm">{table.table_name}</h3>
          <p className="text-xs text-muted-foreground">
            {filled}/{table.capacity} seats
          </p>
        </div>
        <div className="h-16 w-16 rounded-full border-2 border-stone-300 bg-white flex items-center justify-center relative">
          {/* Simple table visualization */}
          <div
            className="absolute inset-1 rounded-full"
            style={{
              background: `conic-gradient(#c9a96e ${pct}%, transparent ${pct}%)`,
              opacity: 0.3,
            }}
          />
          <Users className="h-5 w-5 text-stone-400" />
        </div>
      </div>

      {/* Guests at this table */}
      <div className="space-y-1.5">
        {guests.map((guest) => (
          <GuestCard key={guest.id} guest={guest} />
        ))}
        {guests.length === 0 && (
          <p className="py-3 text-center text-xs text-muted-foreground">
            Drop guests here
          </p>
        )}
      </div>
    </div>
  );
}

// --- Unassigned Pool ---
function UnassignedPool({ guests }: { guests: Guest[] }) {
  const { isOver, setNodeRef } = useDroppable({ id: "unassigned" });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border-2 border-dashed p-4 transition-all ${
        isOver ? "border-stone-400 bg-stone-100" : "border-stone-300"
      }`}
    >
      <h3 className="mb-3 font-medium text-sm text-stone-600">
        Unassigned ({guests.length})
      </h3>
      <div className="space-y-1.5">
        {guests.map((guest) => (
          <GuestCard key={guest.id} guest={guest} />
        ))}
        {guests.length === 0 && (
          <p className="py-6 text-center text-xs text-muted-foreground">
            All guests are seated
          </p>
        )}
      </div>
    </div>
  );
}

// --- Main Canvas ---
export function SeatingCanvas({
  eventId,
  tables: initialTables,
  guests: initialGuests,
}: {
  eventId: string;
  tables: Table[];
  guests: Guest[];
}) {
  const [tables, setTables] = useState(initialTables);
  const [guests, setGuests] = useState(initialGuests);
  const [activeGuest, setActiveGuest] = useState<Guest | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function getGuestsForTable(tableId: string) {
    return guests.filter((g) => g.table_id === tableId);
  }

  function getUnassignedGuests() {
    return guests.filter((g) => !g.table_id);
  }

  function handleDragStart(event: DragStartEvent) {
    const guest = guests.find((g) => g.id === event.active.id);
    if (guest) setActiveGuest(guest);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveGuest(null);
    const { active, over } = event;
    if (!over) return;

    const guestId = active.id as string;
    const dropId = over.id as string;

    const targetTableId = dropId === "unassigned" ? null : dropId;

    // Optimistic update
    setGuests((prev) =>
      prev.map((g) =>
        g.id === guestId ? { ...g, table_id: targetTableId } : g,
      ),
    );

    try {
      await assignGuestToTable(eventId, guestId, targetTableId);
    } catch (e) {
      // Revert on error
      setGuests((prev) =>
        prev.map((g) =>
          g.id === guestId
            ? { ...g, table_id: initialGuests.find((ig) => ig.id === guestId)?.table_id ?? null }
            : g,
        ),
      );
      toast.error(e instanceof Error ? e.message : "Failed to assign guest");
    }
  }

  async function handleAddTable(formData: FormData) {
    const name = formData.get("table_name") as string;
    const capacity = parseInt(formData.get("capacity") as string, 10);
    if (!name || !capacity) return;

    try {
      await addTable(eventId, { table_name: name, capacity });
      setAddOpen(false);
      toast.success(`Table "${name}" added`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add table");
    }
  }

  async function handleRemoveTable(tableId: string) {
    try {
      await removeTable(eventId, tableId);
      // Optimistic
      setTables((prev) => prev.filter((t) => t.id !== tableId));
      setGuests((prev) =>
        prev.map((g) => (g.table_id === tableId ? { ...g, table_id: null } : g)),
      );
      toast.success("Table removed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to remove table");
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger
            render={
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Add Table
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Table</DialogTitle>
            </DialogHeader>
            <form action={handleAddTable} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="table_name">Table Name</Label>
                <Input
                  id="table_name"
                  name="table_name"
                  placeholder="e.g. Table 1, Bridal Table"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min={1}
                  max={20}
                  defaultValue={8}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Table
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tables grid */}
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
          {tables.map((table) => (
            <div key={table.id} className="relative group/table">
              <button
                onClick={() => handleRemoveTable(table.id)}
                className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600 opacity-0 transition-opacity hover:bg-rose-200 group-hover/table:opacity-100"
                title="Remove table"
              >
                <Trash2 className="h-3 w-3" />
              </button>
              <TableNode table={table} guests={getGuestsForTable(table.id)} />
            </div>
          ))}
          {tables.length === 0 && (
            <div className="col-span-2 py-16 text-center">
              <p className="text-muted-foreground">
                No tables yet. Add tables to start building your seating chart.
              </p>
            </div>
          )}
        </div>

        {/* Unassigned pool */}
        <div className="lg:col-span-1">
          <UnassignedPool guests={getUnassignedGuests()} />
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeGuest ? (
          <div className="cursor-grabbing rounded-lg border-2 border-amber-400 bg-white px-3 py-2 text-sm shadow-xl rotate-2">
            {activeGuest.first_name} {activeGuest.last_name}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
