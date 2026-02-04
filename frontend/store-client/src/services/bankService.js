//** get list from https://qr.sepay.vn/banks.json */

const initBank = {
    "no_banks": "3",
    "data": [
        {
            "name": "Ngân hàng TMCP Công thương Việt Nam",
            "code": "ICB",
            "bin": "970415",
            "short_name": "VietinBank",
            "supported": true
        },
        {
            "name": "Ngân hàng TMCP Ngoại Thương Việt Nam",
            "code": "VCB",
            "bin": "970436",
            "short_name": "Vietcombank",
            "supported": true
        },
        {
            "name": "Ngân hàng TMCP Quân đội",
            "code": "MB",
            "bin": "970422",
            "short_name": "MBBank",
            "supported": true
        }
    ]
}

const getBankList = async () => {
    try {
        const response = await fetch("https://qr.sepay.vn/banks.json");
        const data = await response.json();
        console.log("Fetched bank list:", data);
        return data;
    } catch (error) {
        console.error("Error fetching bank list:", error);
        return initBank;
    }
}

export {
    getBankList
}