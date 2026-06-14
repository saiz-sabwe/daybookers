export function formatBookingRef(id: string): string {
  return id.replace(/-/g, "").slice(0, 8).toUpperCase();
}

export function formatTimeLabel(time: string): string {
  return time.slice(0, 5);
}
