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
                { id: "401", name: "Owner Residence", type: "Private Residence", isPrivate: true, elecUnit: "100001150650", waterConn: "02126456 - 6890", garbageId: "GA236803S1", tenantHistory: [], rentHistory: [], monthlyRecords: {} }
            ]
        },
        {
            level: 3,
            name: "3rd Floor",
            units: [
                {
                    id: "301", name: "Silver Oak BnB (2A)", type: "Full Floor Guest House", isProminent: true,
                    elecUnit: "100001170249", waterConn: "2126455 - 6889", garbageId: "GA236803S7", contact: "8894212012",
                    tenantHistory: [{ name: "Silver Oak BnB", company: "8894212012", joinDate: "2026-01-01", leaveDate: "2029-01-01" }],
                    rentHistory: [{ amount: 116000, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                }
            ]
        },
        {
            level: 2,
            name: "2nd Floor",
            units: [
                {
                    id: "201", name: "3C", type: "2RK Flat",
                    elecUnit: "200000336127", waterConn: "02126456 - 6890", garbageId: "N/A", contact: "9129867561",
                    tenantHistory: [{ name: "Kamini", company: "9129867561", joinDate: "2026-01-01", leaveDate: "2029-01-01" }],
                    rentHistory: [{ amount: 5000, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                },
                {
                    id: "202", name: "3D", type: "Single Room",
                    elecUnit: "100001150664", waterConn: "2126458 - 12376", garbageId: "GA236803S4", contact: "9459247055",
                    tenantHistory: [{ name: "Bhawna", company: "9459247055", joinDate: "2026-01-01", leaveDate: "2029-01-01" }],
                    rentHistory: [{ amount: 8740, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                },
                {
                    id: "203", name: "3B", type: "Single Room",
                    elecUnit: "100001150666", waterConn: "02126456 - 6890", garbageId: "N/A", contact: "8219556586",
                    tenantHistory: [{ name: "Sunita", company: "8219556586", joinDate: "2026-01-01", leaveDate: "2029-01-01" }],
                    rentHistory: [{ amount: 5500, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                },
                {
                    id: "204", name: "3A", type: "3-Room Unit",
                    elecUnit: "100001150668", waterConn: "2126458 - 12376", garbageId: "GA236803S6", contact: "9418343783",
                    tenantHistory: [{ name: "Kalpana", company: "9418343783", joinDate: "2026-01-01", leaveDate: "2029-01-01" }],
                    rentHistory: [{ amount: 10660, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                }
            ]
        },
        {
            level: 1,
            name: "1st Floor",
            units: [
                {
                    id: "101", name: "4B", type: "2RK AirBnB", isProminent: true,
                    elecUnit: "100001150662", waterConn: "02126456 - 6890", garbageId: "GA236803S3", contact: "9418272337",
                    tenantHistory: [{ name: "Pine and Thatch", company: "9418272337", joinDate: "2026-01-01", leaveDate: "2029-01-01" }],
                    rentHistory: [{ amount: 0, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                },
                {
                    id: "102", name: "4A", type: "2RK Flat",
                    elecUnit: "100001150656", waterConn: "02126458 - 12376", garbageId: "GA236803S5", contact: "9816593357",
                    tenantHistory: [{ name: "Rahul", company: "9816593357", joinDate: "2026-01-01", leaveDate: "2029-01-01" }],
                    rentHistory: [{ amount: 8400, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                }
            ]
        },
        {
            level: 0,
            name: "Ground Floor",
            units: [
                {
                    id: "001", name: "5A", type: "1BHK Flat",
                    elecUnit: "200002060486", waterConn: "02126458 - 12376", garbageId: "GA236803S2", contact: "7018827553",
                    tenantHistory: [{ name: "Chetna", company: "7018827553", joinDate: "2026-01-01", leaveDate: "2029-01-01" }],
                    rentHistory: [{ amount: 8287, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                },
                {
                    id: "002", name: "5B", type: "Single Room",
                    elecUnit: "100001183959", waterConn: "02126456 - 6890", garbageId: "N/A", contact: "8019298624",
                    tenantHistory: [{ name: "Meera", company: "8019298624", joinDate: "2026-01-01", leaveDate: "2029-01-01" }],
                    rentHistory: [{ amount: 4000, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                }
            ]
        },
        {
            level: -1,
            name: "Basement",
            units: [
                {
                    id: "B01", name: "6B", type: "Studio",
                    elecUnit: "200000336121", waterConn: "02126456 - 6890", garbageId: "GA236803S8", contact: "9418344290",
                    tenantHistory: [{ name: "Leena Thakur", company: "9418344290", joinDate: "2026-01-01", leaveDate: "2029-01-01" }],
                    rentHistory: [{ amount: 8500, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                },
                {
                    id: "B02", name: "6A", type: "Studio",
                    elecUnit: "200002060517", waterConn: "02126456 - 6890", garbageId: "GA236803S8", contact: "8580544562",
                    tenantHistory: [{ name: "Amit", company: "8580544562", joinDate: "2026-01-01", leaveDate: "2029-01-01" }],
                    rentHistory: [{ amount: 8500, startMonth: "2026-01", endMonth: null }],
                    monthlyRecords: {}
                }
            ]
        }
    ]
};
