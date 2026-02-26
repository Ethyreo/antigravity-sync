/**
 * Centralized business logic for evaluating Tenant Occupancy chronologically.
 * Supports Future-Dated move-ins, scheduled evictions, and seamless handovers.
 */

/**
 * Returns today's date in YYYY-MM-DD format for chronological comparisons.
 */
export const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};

/**
 * Evaluates an entire tenant history array and returns the single "Active" tenant 
 * based strictly on today's calendar date.
 * 
 * Rules:
 * 1. A tenant is ACTIVE if they have no leaveDate (null/'Current').
 * 2. A tenant is ACTIVE if their leaveDate is strictly IN THE FUTURE (>= today).
 * 3. A tenant is HISTORICAL if their leaveDate is IN THE PAST (< today).
 * 
 * @param {Array} tenantHistory - The array of tenant objects from the building schema
 * @returns {Object|null} The active tenant object, or null if strictly vacant today
 */
export const getActiveTenant = (tenantHistory) => {
    if (!tenantHistory || tenantHistory.length === 0) return null;

    const today = getTodayDateString();

    // Iterate backwards to find the most recent tenant who is legally active today
    for (let i = tenantHistory.length - 1; i >= 0; i--) {
        const t = tenantHistory[i];

        // If they have no leave date, they are permanently active
        if (!t.leaveDate || t.leaveDate === 'Current') {
            return t;
        }

        // If their scheduled leave date is today or in the future, they are still the active occupant
        if (t.leaveDate >= today) {
            return t;
        }
    }

    // If all tenants have leaveDates in the past, the unit is vacant
    return null;
};

/**
 * Convenience wrapper returning a boolean if the unit is legally occupied today.
 */
export const isUnitOccupied = (tenantHistory) => {
    return getActiveTenant(tenantHistory) !== null;
};
