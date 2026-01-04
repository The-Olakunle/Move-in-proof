interface RoomQueueItem {
  id: string;
  name: string;
  icon: string;
  instanceIndex: number; // 1-based: "Bedroom 1", "Bedroom 2", etc.
  storageKey: string; // e.g., "bedroom_1", "bedroom_2"
}

interface SelectedRoom {
  id: string;
  name: string;
  icon: string;
  count: number;
}

/**
 * Initialize the room queue from selected rooms.
 * Expands rooms with count > 1 into individual instances.
 */
export function initializeRoomQueue(): RoomQueueItem[] {
  const selectedRoomsJson = localStorage.getItem("selectedRooms");
  if (!selectedRoomsJson) return [];

  const selectedRooms: SelectedRoom[] = JSON.parse(selectedRoomsJson);
  const queue: RoomQueueItem[] = [];

  selectedRooms.forEach((room) => {
    for (let i = 1; i <= room.count; i++) {
      queue.push({
        id: room.id,
        name: room.count > 1 ? `${room.name} ${i}` : room.name,
        icon: room.icon,
        instanceIndex: i,
        storageKey: `${room.id}_${i}`,
      });
    }
  });

  // Store the queue and reset the index
  localStorage.setItem("roomQueue", JSON.stringify(queue));
  localStorage.setItem("currentRoomIndex", "0");

  return queue;
}

/**
 * Get the current room queue from localStorage.
 */
export function getRoomQueue(): RoomQueueItem[] {
  const queueJson = localStorage.getItem("roomQueue");
  if (!queueJson) return [];
  return JSON.parse(queueJson);
}

/**
 * Get the current room index.
 */
export function getCurrentRoomIndex(): number {
  const indexStr = localStorage.getItem("currentRoomIndex");
  return indexStr ? parseInt(indexStr, 10) : 0;
}

/**
 * Get the current room being reported.
 */
export function getCurrentRoom(): RoomQueueItem | null {
  const queue = getRoomQueue();
  const index = getCurrentRoomIndex();
  return queue[index] || null;
}

/**
 * Move to the next room in the queue.
 * Returns the next room, or null if there are no more rooms.
 */
export function advanceToNextRoom(): RoomQueueItem | null {
  const queue = getRoomQueue();
  const currentIndex = getCurrentRoomIndex();
  const nextIndex = currentIndex + 1;

  if (nextIndex >= queue.length) {
    return null; // No more rooms
  }

  localStorage.setItem("currentRoomIndex", nextIndex.toString());
  return queue[nextIndex];
}

/**
 * Check if the current room is the last room in the queue.
 */
export function isLastRoom(): boolean {
  const queue = getRoomQueue();
  const currentIndex = getCurrentRoomIndex();
  return currentIndex >= queue.length - 1;
}

/**
 * Get the URL path for a room.
 */
export function getRoomPath(room: RoomQueueItem): string {
  return `/report/${room.id}/${room.instanceIndex}`;
}

/**
 * Get the notes URL path for a room.
 */
export function getRoomNotesPath(room: RoomQueueItem): string {
  return `/report/${room.id}/${room.instanceIndex}/notes`;
}

/**
 * Clear the room queue (used when starting fresh or completing report).
 */
export function clearRoomQueue(): void {
  localStorage.removeItem("roomQueue");
  localStorage.removeItem("currentRoomIndex");
}

export type { RoomQueueItem, SelectedRoom };
