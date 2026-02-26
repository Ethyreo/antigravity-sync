export const buildingData = {
    floors: [
        {
            level: 5,
            name: "5th Floor",
            units: [
                { id: "501", name: "Attic", type: "Private Residence", isPrivate: true, elecUnit: "MAIN-05", waterConn: "WTR-05", tenantHistory: [], rentHistory: [], monthlyRecords: {} }
            ]
        },
        {
            level: 4,
            name: "4th Floor",
            units: [
                { id: "401", name: "Main Residence", type: "Private Residence", isPrivate: true, elecUnit: "MAIN-04", waterConn: "WTR-04", tenantHistory: [], rentHistory: [], monthlyRecords: {} }
            ]
        },
        {
            level: 3,
            name: "3rd Floor",
            units: [
                { id: "301", name: "Silver Oak BnB", type: "Full Floor Guest House", isProminent: true, elecUnit: "MET-301", waterConn: "WTR-301", tenantHistory: [], rentHistory: [], monthlyRecords: {} }
            ]
        },
        {
            level: 2,
            name: "2nd Floor",
            units: [
                { id: "201", name: "Front Flat", type: "2RK Flat", elecUnit: "MET-201", waterConn: "WTR-201", tenantHistory: [], rentHistory: [], monthlyRecords: {} },
                { id: "202", name: "Single Room 1", type: "Single Room", elecUnit: "MET-202", waterConn: "WTR-201", tenantHistory: [], rentHistory: [], monthlyRecords: {} },
                { id: "203", name: "Single Room 2", type: "Single Room", elecUnit: "MET-203", waterConn: "WTR-201", tenantHistory: [], rentHistory: [], monthlyRecords: {} },
                { id: "204", name: "Rear Unit", type: "3-Room Unit", elecUnit: "MET-204", waterConn: "WTR-202", tenantHistory: [], rentHistory: [], monthlyRecords: {} }
            ]
        },
        {
            level: 1,
            name: "1st Floor",
            units: [
                { id: "101", name: "1st Floor AirBnB", type: "2RK AirBnB", isProminent: true, elecUnit: "MET-101", waterConn: "WTR-101", tenantHistory: [], rentHistory: [], monthlyRecords: {} },
                { id: "102", name: "1st Floor Rear Flat", type: "2RK Flat", elecUnit: "MET-102", waterConn: "WTR-101", tenantHistory: [], rentHistory: [], monthlyRecords: {} }
            ]
        },
        {
            level: 0,
            name: "Ground Floor",
            units: [
                { id: "001", name: "Ground 1BHK", type: "1BHK Flat", elecUnit: "MET-001", waterConn: "WTR-001", tenantHistory: [], rentHistory: [], monthlyRecords: {} },
                { id: "002", name: "Ground Single Room", type: "Single Room", elecUnit: "MET-002", waterConn: "WTR-001", tenantHistory: [], rentHistory: [], monthlyRecords: {} }
            ]
        },
        {
            level: -1,
            name: "Basement",
            units: [
                { id: "B01", name: "Basement Studio 1", type: "Studio", elecUnit: "MET-B01", waterConn: "WTR-B01", tenantHistory: [], rentHistory: [], monthlyRecords: {} },
                { id: "B02", name: "Basement Studio 2", type: "Studio", elecUnit: "MET-B02", waterConn: "WTR-B02", tenantHistory: [], rentHistory: [], monthlyRecords: {} }
            ]
        }
    ]
};
