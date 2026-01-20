/**
 * uiFlags.ts
 *
 * Feature flag utility for the future UI-V2 rollout.
 *
 * NOTE: This file is currently unused in Phase-0.
 * It serves as a placeholder for controlling the progressive rollout
 * of the new Admin Dashboard V2.
 */

// Master switch for UI V2 - Defaults to false for safety
export const ENABLE_UI_V2 = true;

// Hardcoded roles allowed to access UI V2 during beta testing
const ALLOWED_V2_ROLES = ['ADMIN', 'SUPER_ADMIN', 'MANAGEMENT', 'PRINCIPAL'];

/**
 * Checks if a user role is allowed to see the preliminary V2 UI.
 * 
 * @param role - The role string of the current user.
 * @returns boolean - Whether the user constitutes a pilot group for V2.
 */
export const canUseUIV2 = (role?: string): boolean => {
    // 1. Safety break: If the global flag is strictly false, return false.
    if (!ENABLE_UI_V2) {
        return false;
    }

    // 2. Validate input
    if (!role) {
        return false;
    }

    // 3. Check role against allowed list
    return ALLOWED_V2_ROLES.includes(role.toUpperCase());
};
