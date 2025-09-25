import { api, endpoints } from "./api";

export interface ImageItem {
  id: string;
  url: string;
  patient?: string;
}

export async function listImages(): Promise<ImageItem[]> {
  return api.get<ImageItem[]>(endpoints.listImages());
}
