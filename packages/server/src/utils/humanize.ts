export function humanizeTime(time: number): string {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor((time / 60) % 60);
  const hours = Math.floor(time / 3600);

  if (hours > 0) {
    return hours === 1 ? '1h' : `${hours}h`;
  }
  if (minutes > 0) {
    return minutes === 1 ? '1m' : `${minutes}m`;
  }
  return seconds === 1 ? '1s' : `${seconds}s`;
}
