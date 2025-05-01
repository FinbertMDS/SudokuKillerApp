export const formatTime = (seconds: number | null) => {
  if (seconds == null) {
    return '-';
  }
  const minutes = Math.floor(seconds / 60);
  const totalSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${totalSeconds
    .toString()
    .padStart(2, '0')}`;
};
