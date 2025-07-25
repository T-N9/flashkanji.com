// lib/api/users.ts

import { apiClient } from "./client";

export const checkUserExists = async (
  id: string
): Promise<{ exists: boolean, user : {
  id: string;
  japanese_level: "N3" | "N4" | "N5";
  username: string;
  created_at: string;
  longest_streak: number;
  current_streak: number;
  total_learned: number;
  total_hours: number;
} }> => {
  const response = await apiClient.post("/users/check-or-create", {
    id,
  });
  return response.data;
};

export interface CreateUserPayload {
  id: string;
  user_id: string;
  username: string;
  occupation: string;
  japanese_level: string;
  dob: string; // ISO format: YYYY-MM-DD
}

export const createUser = async (
  data: CreateUserPayload
): Promise<{ success: boolean }> => {
  const response = await apiClient.post("/users", data);
  return response.data;
};
