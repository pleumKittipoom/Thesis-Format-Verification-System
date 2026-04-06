export interface Announcement {
  announceId: string;
  title: string;
  description: string;
  imgBase64?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MetaData {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface AnnouncementResponse {
  success: boolean;
  data: Announcement[];
  meta: MetaData;
}