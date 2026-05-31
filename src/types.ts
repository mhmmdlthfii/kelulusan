/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum GraduationStatus {
  LULUS = "Lulus",
  LULUS_BERSYARAT = "Lulus Bersyarat",
  TIDAK_LULUS = "Tidak Lulus"
}

export enum UserRole {
  SUPER_ADMIN = "Super Admin",
  OPERATOR = "Operator"
}

export enum AnnouncementStatus {
  DRAFT = "Draft",
  PUBLISH = "Publish"
}

export interface Student {
  nisn: string;
  nis: string;
  name: string;
  gender: "Laki-laki" | "Perempuan";
  birthPlace: string;
  birthDate: string; // YYYY-MM-DD
  className: string;
  photoUrl: string;
  status: GraduationStatus;
  grades?: Record<string, number>; // mapelId -> nilai
}

export interface Subject {
  id: string;
  name: string;
  kkm: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  status: AnnouncementStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationSettings {
  schoolName: string;
  schoolLogo: string; // base64 or URL
  schoolFavicon: string;
  address: string;
  email: string;
  phone: string;
  footerText: string;
  graduationDate: string; // YYYY-MM-DD
  graduationTime: string; // HH:MM
  academicYear: string;
  principalName: string;
  principalNip: string;
  signatureImage: string; // base64 or URL
  announcementTemplate: string;
  schoolLogoRight?: string; // base64 or URL for right kop logo
  watermarkImage?: string; // dedicated watermark image for SKL background
  sklNumberTemplate?: string; // customizable layout format for letter reference numbers
  backgroundImage?: string; // custom background image url
}

export interface LoginLog {
  id: string;
  username: string;
  ip: string;
  timestamp: string;
  status: "Success" | "Failed";
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface VerificationCode {
  code: string; // unique UUID/Short hash
  nisn: string;
  studentName: string;
  schoolName: string;
  isValid: boolean;
  createdAt: string;
}
