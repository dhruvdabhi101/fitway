import { apiClient } from "@src/api/client";

interface ApiResponse<T> {
  data: T | null;
  error: { code: string; message: string } | null;
}

export const uploadService = {
  upload: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<ApiResponse<{ url: string }>>("/api/upload", formData, {
      headers: {},
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data?.url) {
      throw new Error("Failed to upload file");
    }

    return response.data;
  },
};
