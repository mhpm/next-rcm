/**
 * UUID v4 Generator Library
 * Generates RFC 4122 compliant UUIDs
 */

/**
 * Generates a random UUID v4
 * @returns {string} A UUID v4 string in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
export function generateUUID(): string {
  // Use crypto.randomUUID if available (modern browsers and Node.js 14.17+)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback using crypto.getRandomValues where available
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
      ""
    );
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
      12,
      16
    )}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  // Last-resort deterministic fallback (should rarely be used)
  const base = "00000000000000000000000000000000";
  return `${base.slice(0, 8)}-${base.slice(8, 12)}-${
    "4" + base.slice(13, 16)
  }-${"8" + base.slice(17, 20)}-${base.slice(20)}`;
}

/**
 * Generates a UUID v4 (alias for generateUUID)
 * @returns {string} A UUID v4 string
 */
export function uuidv4(): string {
  return generateUUID();
}

/**
 * Validates if a string is a valid UUID v4
 * @param {string} uuid - The string to validate
 * @returns {boolean} True if the string is a valid UUID v4
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validates if a string is a valid UUID (any version)
 * @param {string} uuid - The string to validate
 * @returns {boolean} True if the string is a valid UUID
 */
export function isValidUUIDAny(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Generates a short UUID (8 characters) for cases where full UUID is too long
 * Note: This is not RFC 4122 compliant and has higher collision probability
 * @returns {string} A short 8-character UUID-like string
 */
export function generateShortUUID(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(36).padStart(2, "0"))
      .join("")
      .slice(0, 8);
  }
  return removeHyphens(generateUUID()).slice(0, 8);
}

/**
 * Generates multiple UUIDs
 * @param {number} count - Number of UUIDs to generate
 * @returns {string[]} Array of UUID strings
 */
export function generateMultipleUUIDs(count: number): string[] {
  return Array.from({ length: count }, () => generateUUID());
}

/**
 * Converts a UUID to uppercase
 * @param {string} uuid - The UUID to convert
 * @returns {string} Uppercase UUID
 */
export function toUpperCaseUUID(uuid: string): string {
  return uuid.toUpperCase();
}

/**
 * Converts a UUID to lowercase
 * @param {string} uuid - The UUID to convert
 * @returns {string} Lowercase UUID
 */
export function toLowerCaseUUID(uuid: string): string {
  return uuid.toLowerCase();
}

/**
 * Removes hyphens from a UUID
 * @param {string} uuid - The UUID to process
 * @returns {string} UUID without hyphens
 */
export function removeHyphens(uuid: string): string {
  return uuid.replace(/-/g, "");
}

/**
 * Adds hyphens to a UUID string without hyphens
 * @param {string} uuid - The UUID string without hyphens (32 characters)
 * @returns {string} UUID with hyphens
 */
export function addHyphens(uuid: string): string {
  if (uuid.length !== 32) {
    throw new Error("UUID without hyphens must be exactly 32 characters long");
  }
  return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(
    12,
    16
  )}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
}

// Default export
const uuidUtils = {
  generate: generateUUID,
  v4: uuidv4,
  isValid: isValidUUID,
  isValidAny: isValidUUIDAny,
  short: generateShortUUID,
  multiple: generateMultipleUUIDs,
  toUpperCase: toUpperCaseUUID,
  toLowerCase: toLowerCaseUUID,
  removeHyphens,
  addHyphens,
};

export default uuidUtils;
