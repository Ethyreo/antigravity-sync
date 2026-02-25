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
                    rent: "N/A",
                    rentStatus: "paid", // paid, unpaid, overdue
                    elecUnit: "MAIN-01",
                    elecBill: 0,
                    waterConn: "WTR-01",
                    waterBill: 0,
                    garbageBill: 0,
                    isPrivate: true
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
                    rent: "N/A",
                    rentStatus: "paid",
                    elecUnit: "MAIN-02",
                    elecBill: 0,
                    waterConn: "WTR-02",
                    waterBill: 0,
                    garbageBill: 0,
                    isPrivate: true
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
                    rent: "120000",
                    rentStatus: "paid",
                    elecUnit: "MET-401",
                    elecBill: 4500,
                    waterConn: "WTR-401",
                    waterBill: 800,
                    garbageBill: 300,
                    isProminent: true
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
                    rent: "35000",
                    rentStatus: "overdue",
                    elecUnit: "MET-301",
                    elecBill: 1200,
                    waterConn: "WTR-301",
                    waterBill: 400,
                    garbageBill: 150
                },
                {
                    id: "302",
                    name: "3rd Floor Single",
                    type: "Single Room",
                    contact: "+91 99887 76655",
                    rent: "12000",
                    rentStatus: "paid",
                    elecUnit: "MET-302",
                    elecBill: 400,
                    waterConn: "WTR-302",
                    waterBill: 200,
                    garbageBill: 100
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
                    rent: "35000",
                    rentStatus: "paid",
                    elecUnit: "MET-201",
                    elecBill: 1100,
                    waterConn: "WTR-201",
                    waterBill: 400,
                    garbageBill: 150
                },
                {
                    id: "202",
                    name: "2nd Floor 2BHK (B)",
                    type: "2BHK Flat",
                    contact: "+91 97766 55443",
                    rent: "35000",
                    rentStatus: "unpaid",
                    elecUnit: "MET-202",
                    elecBill: 1300,
                    waterConn: "WTR-202",
                    waterBill: 400,
                    garbageBill: 150
                },
                {
                    id: "203",
                    name: "2nd Floor Single",
                    type: "Single Room",
                    contact: "+91 96655 44332",
                    rent: "12000",
                    rentStatus: "paid",
                    elecUnit: "MET-203",
                    elecBill: 350,
                    waterConn: "WTR-203",
                    waterBill: 200,
                    garbageBill: 100
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
                    rent: "45000",
                    rentStatus: "paid",
                    elecUnit: "MET-101",
                    elecBill: 2200,
                    waterConn: "WTR-101",
                    waterBill: 600,
                    garbageBill: 200
                },
                {
                    id: "102",
                    name: "1st Floor Small Flat",
                    type: "Small Flat",
                    contact: "+91 94433 22110",
                    rent: "20000",
                    rentStatus: "overdue",
                    elecUnit: "MET-102",
                    elecBill: 600,
                    waterConn: "WTR-102",
                    waterBill: 250,
                    garbageBill: 100
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
                    rent: "25000",
                    rentStatus: "paid",
                    elecUnit: "MET-001",
                    elecBill: 800,
                    waterConn: "WTR-001",
                    waterBill: 300,
                    garbageBill: 150
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
                    rent: "10000",
                    rentStatus: "paid",
                    elecUnit: "MET-B01",
                    elecBill: 300,
                    waterConn: "WTR-B01",
                    waterBill: 150,
                    garbageBill: 50
                },
                {
                    id: "B02",
                    name: "Basement Studio 2",
                    type: "1 RK Studio",
                    contact: "+91 91100 99887",
                    rent: "10000",
                    rentStatus: "paid",
                    elecUnit: "MET-B02",
                    elecBill: 250,
                    waterConn: "WTR-B02",
                    waterBill: 150,
                    garbageBill: 50
                }
            ]
        }
    ]
};
