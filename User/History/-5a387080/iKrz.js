/**
 * Returns the current billing month in YYYY-MM format.
 */
export const getCurrentBillingMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};
