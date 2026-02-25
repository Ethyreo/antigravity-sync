export const buildingData = {
    floors: [
        {
            level: 6,
            name: "6th Floor",
            units: [
                {
                    id: "601",
                    name: "Owner's Residence (Upper)",
                    type: "Private",
                    contact: "Private",
                    rentHistory: [],
                    elecUnit: "MAIN-01",
                    waterConn: "WTR-01",
                    isPrivate: true,
                    monthlyRecords: {
                        "2026-02": { rentStatus: "paid", elecBill: 0, waterBill: 0, garbageBill: 0 }
                    }
                }
            ]
        },
        {
            level: 5,
            name: "5th Floor",
            units: [
                {
                    id: "501",
                    name: "Owner's Residence (Lower)",
                    type: "Private",
                    contact: "Private",
                    rentHistory: [],
                    elecUnit: "MAIN-02",
                    waterConn: "WTR-02",
                    isPrivate: true,
                    monthlyRecords: {
                        "2026-02": { rentStatus: "paid", elecBill: 0, waterBill: 0, garbageBill: 0 }
                    }
                }
            ]
        },
        {
            level: 4,
            name: "4th Floor",
            units: [
                {
                    id: "401",
                    name: "SILVER OAK BnB",
                    type: "Single Large Unit",
                    contact: "+91 98765 43210",
                    rentHistory: [{ amount: 120000, startMonth: "2026-01", endMonth: "2026-11" }],
                    elecUnit: "MET-401",
                    waterConn: "WTR-401",
                    isProminent: true,
                    monthlyRecords: {
                        "2026-01": { rentStatus: "paid", elecBill: 4200, waterBill: 750, garbageBill: 300 },
                        "2026-02": { rentStatus: "paid", elecBill: 4500, waterBill: 800, garbageBill: 300 }
                    }
                }
            ]
        },
        {
            level: 3,
            name: "3rd Floor",
            units: [
                {
                    id: "301",
                    name: "3rd Floor 2BHK",
                    type: "2BHK Flat",
                    contact: "+91 91234 56789",
                    rentHistory: [{ amount: 35000, startMonth: "2026-01", endMonth: "2026-02" }], // Expiring this cycle for the alert
                    elecUnit: "MET-301",
                    waterConn: "WTR-301",
                    monthlyRecords: {
                        "2026-01": { rentStatus: "paid", elecBill: 1100, waterBill: 400, garbageBill: 150 },
                        "2026-02": { rentStatus: "overdue", elecBill: 1200, waterBill: 400, garbageBill: 150 }
                    }
                },
                {
                    id: "302",
                    name: "3rd Floor Single",
                    type: "Single Room",
                    contact: "+91 99887 76655",
                    rentHistory: [{ amount: 12000, startMonth: "2026-01", endMonth: "2026-11" }],
                    elecUnit: "MET-302",
                    waterConn: "WTR-302",
                    monthlyRecords: {
                        "2026-02": { rentStatus: "paid", elecBill: 400, waterBill: 200, garbageBill: 100 }
                    }
                }
            ]
        },
        {
            level: 2,
            name: "2nd Floor",
            units: [
                {
                    id: "201",
                    name: "2nd Floor 2BHK (A)",
                    type: "2BHK Flat",
                    contact: "+91 98877 66554",
                    rentHistory: [{ amount: 35000, startMonth: "2026-01", endMonth: "2026-11" }],
                    elecUnit: "MET-201",
                    waterConn: "WTR-201",
                    monthlyRecords: {
                        "2026-02": { rentStatus: "paid", elecBill: 1100, waterBill: 400, garbageBill: 150 }
                    }
                },
                {
                    id: "202",
                    name: "2nd Floor 2BHK (B)",
                    type: "2BHK Flat",
                    contact: "+91 97766 55443",
                    rentHistory: [{ amount: 35000, startMonth: "2026-01", endMonth: "2026-03" }], // Expiring soon
                    elecUnit: "MET-202",
                    waterConn: "WTR-202",
                    monthlyRecords: {
                        "2026-02": { rentStatus: "unpaid", elecBill: 1300, waterBill: 400, garbageBill: 150 }
                    }
                },
                {
                    id: "203",
                    name: "2nd Floor Single",
                    type: "Single Room",
                    contact: "+91 96655 44332",
                    rentHistory: [{ amount: 12000, startMonth: "2026-01", endMonth: "2026-11" }],
                    elecUnit: "MET-203",
                    waterConn: "WTR-203",
                    monthlyRecords: {
                        "2026-02": { rentStatus: "paid", elecBill: 350, waterBill: 200, garbageBill: 100 }
                    }
                }
            ]
        },
        {
            level: 1,
            name: "1st Floor",
            units: [
                {
                    id: "101",
                    name: "1st Floor 2BHK",
                    type: "2BHK Flat (AirBnb)",
                    contact: "+91 95544 33221",
                    rentHistory: [{ amount: 45000, startMonth: "2026-01", endMonth: "2026-11" }],
                    elecUnit: "MET-101",
                    waterConn: "WTR-101",
                    monthlyRecords: {
                        "2026-02": { rentStatus: "paid", elecBill: 2200, waterBill: 600, garbageBill: 200 }
                    }
                },
                {
                    id: "102",
                    name: "1st Floor Small Flat",
                    type: "Small Flat",
                    contact: "+91 94433 22110",
                    rentHistory: [{ amount: 20000, startMonth: "2026-01", endMonth: "2026-02" }], // Expiring this cycle
                    elecUnit: "MET-102",
                    waterConn: "WTR-102",
                    monthlyRecords: {
                        "2026-02": { rentStatus: "overdue", elecBill: 600, waterBill: 250, garbageBill: 100 }
                    }
                }
            ]
        },
        {
            level: 0,
            name: "Ground Floor",
            units: [
                {
                    id: "001",
                    name: "Ground Floor Flat",
                    type: "Flat",
                    contact: "+91 93322 11009",
                    rentHistory: [{ amount: 25000, startMonth: "2026-01", endMonth: "2026-11" }],
                    elecUnit: "MET-001",
                    waterConn: "WTR-001",
                    monthlyRecords: {
                        "2026-02": { rentStatus: "paid", elecBill: 800, waterBill: 300, garbageBill: 150 }
                    }
                }
            ]
        },
        {
            level: -1,
            name: "Basement",
            units: [
                {
                    id: "B01",
                    name: "Basement Studio 1",
                    type: "1 RK Studio",
                    contact: "+91 92211 00998",
                    rentHistory: [{ amount: 10000, startMonth: "2026-01", endMonth: "2026-11" }],
                    elecUnit: "MET-B01",
                    waterConn: "WTR-B01",
                    monthlyRecords: {
                        "2026-02": { rentStatus: "paid", elecBill: 300, waterBill: 150, garbageBill: 50 }
                    }
                },
                {
                    id: "B02",
                    name: "Basement Studio 2",
                    type: "1 RK Studio",
                    contact: "+91 91100 99887",
                    rentHistory: [{ amount: 10000, startMonth: "2026-01", endMonth: "2026-11" }],
                    elecUnit: "MET-B02",
                    waterConn: "WTR-B02",
                    monthlyRecords: {
                        "2026-02": { rentStatus: "paid", elecBill: 250, waterBill: 150, garbageBill: 50 }
                    }
                }
            ]
        }
    ]
};
