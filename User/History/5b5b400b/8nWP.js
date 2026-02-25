/**
 * rentUtils.js
 * Helper functions to query dynamic rent amounts based on cycles.
 */

// Returns "YYYY-MM" offset by months
export function addMonths(dateString, monthsToAdd) {
    const [year, month] = dateString.split('-').map(Number);
    const totalMonths = year * 12 + month - 1 + monthsToAdd;
    const newYear = Math.floor(totalMonths / 12);
    const newMonth = (totalMonths % 12) + 1;
    return `${newYear}-${newMonth.toString().padStart(2, '0')}`;
}

export function getCurrentRentRecord(unit, targetMonth) {
    if (!unit.rentHistory || unit.rentHistory.length === 0) return null;
    // Fallback to sorting by startMonth desc and taking the latest
    const sorted = [...unit.rentHistory].sort((a, b) => (a.startMonth > b.startMonth ? -1 : 1));

    const record = sorted.find(r => targetMonth >= r.startMonth && targetMonth <= r.endMonth);
    return record || sorted[0]; // If outside bounds, pick the latest cycle recorded
}

export function getCurrentRentAmount(unit, targetMonth) {
    const record = getCurrentRentRecord(unit, targetMonth);
    return record ? Number(record.amount) : 0;
}

export function getExpiringRentCycles(buildingData, currentMonth, thresholdMonths = 1) {
    const expiring = [];
    const triggerMonth = addMonths(currentMonth, thresholdMonths);

    buildingData.floors.forEach(floor => {
        floor.units.forEach(unit => {
            if (unit.isPrivate) return;
            const record = getCurrentRentRecord(unit, currentMonth);
            if (record && record.endMonth <= triggerMonth) {
                expiring.push({
                    unit,
                    record
                });
            }
        });
    });

    return expiring;
}
