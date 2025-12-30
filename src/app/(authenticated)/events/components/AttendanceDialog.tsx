"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Loader2 } from "lucide-react";
import { useNotificationStore } from "@/store/NotificationStore";
import { getEventAttendance, toggleAttendance, FriendAttendance } from "../actions/attendance.actions";

interface AttendanceDialogProps {
  eventId: string;
  eventName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AttendanceDialog({
  eventId,
  eventName,
  open,
  onOpenChange,
}: AttendanceDialogProps) {
  const [friends, setFriends] = useState<FriendAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { showError } = useNotificationStore();

  useEffect(() => {
    if (open && eventId) {
      loadAttendance();
    }
  }, [open, eventId]);

  const loadAttendance = async () => {
    try {
      setIsLoading(true);
      const data = await getEventAttendance(eventId);
      setFriends(data);
    } catch (error) {
      console.error("Error loading attendance:", error);
      showError("Error al cargar la lista de asistencia");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (friendId: string, currentStatus: boolean) => {
    // Optimistic update
    setFriends((prev) =>
      prev.map((f) =>
        f.id === friendId ? { ...f, attended: !currentStatus } : f
      )
    );

    try {
      await toggleAttendance(eventId, friendId, !currentStatus);
    } catch (error) {
      console.error("Error updating attendance:", error);
      showError("Error al actualizar la asistencia");
      // Revert optimistic update
      setFriends((prev) =>
        prev.map((f) =>
          f.id === friendId ? { ...f, attended: currentStatus } : f
        )
      );
    }
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Asistencia - {eventName}</DialogTitle>
          <DialogDescription>
            Marque los amigos que asistieron a este evento.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar amigo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {search ? "No se encontraron amigos con ese nombre" : "No hay amigos registrados"}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={friend.id}
                    checked={friend.attended}
                    onCheckedChange={() => handleToggle(friend.id, friend.attended)}
                  />
                  <label
                    htmlFor={friend.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                  >
                    {friend.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
