// src/utils/date.utils.ts

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

// แปลง Status จาก DB ให้อ่านง่ายขึ้น
export const formatStatusText = (status: string): string => {
  switch (status.toUpperCase()) {
    case 'PENDING': return 'Pending';
    case 'IN_PROGRESS': return 'In Progress';
    case 'COMPLETED': case 'PASSED': return 'Passed';
    case 'FAILED': return 'Failed';
    default: return status;
  }
};