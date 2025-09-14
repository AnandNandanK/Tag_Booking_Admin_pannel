// src/features/Events/EventTypes.ts

export interface Artist {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  dateOfBirth: string; // ISO string from backend
  nationality: string;
  websiteUrl: string;
  instagramHandle: string | null;
  twitterHandle: string | null;
  active: boolean | null;
  role: string;
}

export interface EventResponse {
  eventId: number;
  name: string;
  shortDescription: string;
  longDescription: string;
  termsAndConditions: string[];
  category: string;
  genre: string;
  languages: string[];
  durationMinutes: number;
  ageRestriction: number;
  certification: string;
  releaseDate: string; // ISO string
  posterUrl: string;
  thumbnailUrl: string;
  trailerUrl: string;
  basePrice: number;
  status: string;
  organizerId: number;
  artists: Artist[];
}
