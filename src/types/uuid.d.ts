/**
 * UUID Type Definitions
 */

// UUID string type - ensures it's a string that represents a UUID
export type UUID = string;

// UUID v4 specific type
export type UUIDv4 = string;

// Short UUID type (8 characters)
export type ShortUUID = string;

// UUID validation result
export interface UUIDValidationResult {
  isValid: boolean;
  version?: number;
  error?: string;
}

// UUID generator options
export interface UUIDGeneratorOptions {
  version?: 4; // Currently only v4 is supported
  uppercase?: boolean;
  removeHyphens?: boolean;
}

// UUID utility functions interface
export interface UUIDUtils {
  generate(): UUID;
  v4(): UUIDv4;
  isValid(uuid: string): boolean;
  isValidAny(uuid: string): boolean;
  short(): ShortUUID;
  multiple(count: number): UUID[];
  toUpperCase(uuid: string): string;
  toLowerCase(uuid: string): string;
  removeHyphens(uuid: string): string;
  addHyphens(uuid: string): string;
}

// Entity with UUID interface
export interface EntityWithUUID {
  id: UUID;
  createdAt?: Date;
  updatedAt?: Date;
}

// UUID format options
export type UUIDFormat = 'standard' | 'uppercase' | 'lowercase' | 'no-hyphens';

// UUID generation result
export interface UUIDGenerationResult {
  uuid: UUID;
  format: UUIDFormat;
  timestamp: Date;
}

// Export commonly used types
export type {
  UUID as default,
  UUIDv4,
  ShortUUID,
  EntityWithUUID,
};