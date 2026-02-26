export const buildingData = {
    floors: [
        {
            level: 5,
            name: "5th Floor",
            units: [
                { id: "501", name: "Attic", type: "Private Residence", isPrivate: true, elecUnit: "MAIN-05", waterConn: "WTR-05", garbageId: "N/A", tenantHistory: [], rentHistory: [], monthlyRecords: {} }
            ]
        },
        {
            level: 4,
            name: "4th Floor",
            units: [
                { id: "401", name: "Main Residence", type: "Private Residence", isPrivate: true, elecUnit: "100001150650", waterConn: "02126456 - 6890", garbageId: "GA236803S1", tenantHistory: [], rentHistory: [], monthlyRecords: {} }
            ]
        },
        {
            level: 3,
            name: "3rd Floor",
            units: [
                {
                    id: "301", name: "Silver Oak BnB", type: "Full Floor Guest House", isProminent: true,
                    elecUnit: "100001170249", waterConn: "2126455 - 6889", garbageId: "GA236803S7",
                    tenantHistory: [{ name: "Silver Oak BnB", joinDate: "2026-01-01", leaveDate: null }],
                    rentHistory: [{ amount: 0, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                }
            ]
        },
        {
            level: 2,
            name: "2nd Floor",
            units: [
                {
                    id: "201", name: "Front Flat", type: "2RK Flat",
                    elecUnit: "200000336127", waterConn: "02126456 - 6890", garbageId: "N/A",
                    tenantHistory: [{ name: "Kamini", joinDate: "2026-01-01", leaveDate: null }],
                    rentHistory: [{ amount: 0, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                },
                {
                    id: "202", name: "Single Room 1", type: "Single Room",
                    elecUnit: "100001150664", waterConn: "2126458 - 12376", garbageId: "GA236803S4",
                    tenantHistory: [{ name: "Bhawna", joinDate: "2026-01-01", leaveDate: null }],
                    rentHistory: [{ amount: 0, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                },
                {
                    id: "203", name: "Single Room 2", type: "Single Room",
                    elecUnit: "100001150666", waterConn: "02126456 - 6890", garbageId: "N/A",
                    tenantHistory: [{ name: "Sunita", joinDate: "2026-01-01", leaveDate: null }],
                    rentHistory: [{ amount: 0, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                },
                {
                    id: "204", name: "Rear Unit", type: "3-Room Unit",
                    elecUnit: "100001150668", waterConn: "2126458 - 12376", garbageId: "GA236803S6",
                    tenantHistory: [{ name: "Kalpana", joinDate: "2026-01-01", leaveDate: null }],
                    rentHistory: [{ amount: 0, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                }
            ]
        },
        {
            level: 1,
            name: "1st Floor",
            units: [
                {
                    id: "101", name: "1st Floor AirBnB", type: "2RK AirBnB", isProminent: true,
                    elecUnit: "100001150662", waterConn: "02126456 - 6890", garbageId: "GA236803S3",
                    tenantHistory: [{ name: "Pine and Thatch", joinDate: "2026-01-01", leaveDate: null }],
                    rentHistory: [{ amount: 0, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                },
                {
                    id: "102", name: "1st Floor Rear Flat", type: "2RK Flat",
                    elecUnit: "100001150656", waterConn: "02126458 - 12376", garbageId: "GA236803S5",
                    tenantHistory: [{ name: "Rahul", joinDate: "2026-01-01", leaveDate: null }],
                    rentHistory: [{ amount: 0, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                }
            ]
        },
        {
            level: 0,
            name: "Ground Floor",
            units: [
                {
                    id: "001", name: "Ground 1BHK", type: "1BHK Flat",
                    elecUnit: "200002060486", waterConn: "02126458 - 12376", garbageId: "GA236803S2",
                    tenantHistory: [{ name: "Chetna", joinDate: "2026-01-01", leaveDate: null }],
                    rentHistory: [{ amount: 0, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                },
                {
                    id: "002", name: "Ground Single Room", type: "Single Room",
                    elecUnit: "100001183959", waterConn: "02126456 - 6890", garbageId: "N/A",
                    tenantHistory: [{ name: "Meera", joinDate: "2026-01-01", leaveDate: null }],
                    rentHistory: [{ amount: 0, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                }
            ]
        },
        {
            level: -1,
            name: "Basement",
            units: [
                {
                    id: "B01", name: "Basement Studio 1", type: "Studio",
                    elecUnit: "200000336121", waterConn: "02126456 - 6890", garbageId: "GA236803S8",
                    tenantHistory: [{ name: "Leena Thakur", joinDate: "2026-01-01", leaveDate: null }],
                    rentHistory: [{ amount: 0, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                },
                {
                    id: "B02", name: "Basement Studio 2", type: "Studio",
                    elecUnit: "200002060517", waterConn: "02126456 - 6890", garbageId: "GA236803S8",
                    tenantHistory: [{ name: "Amit", joinDate: "2026-01-01", leaveDate: null }],
                    rentHistory: [{ amount: 0, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                }
            ]
        }
    ]
};
