/**
 * User Types
 * Type definitions for user-related data
 */

export type UserRole = "USER" | "GOVERNMENT_WORKER";

export interface ProfileData {
  userRole: UserRole | "";
  city: string;
  state: string;
  country: string;
  occupation: string;
  birthDate: string;
}
