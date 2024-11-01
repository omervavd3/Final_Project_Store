const PurchaseModel = require("../models/purchaseModel");

exports.addPurchase = async(req,res) => {
    try {
        const {productsIds, userName, productsAmounts, totalPrice, userGender, productsTitleForPurchase} = req.body;
        const userId = req.cookies['user'];
        const purchase = await PurchaseModel.create({userId:userId,userName:userName,productsIds:productsIds,productsTitels:productsTitleForPurchase, productsAmounts:productsAmounts, totalPrice:totalPrice, userGender:userGender})
        res.status(200).send({purchaseCreated:true, purchase:purchase})
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.messeage });
    }
}

exports.getAllPurchases = async(req,res) => {
    try {
        const purchases = await PurchaseModel.find({})
        res.status(200).send({purchases:purchases})
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.messeage });
    }
}

exports.getPurchasesById = async(req,res) => {
    try {
        const userId = req.cookies['user'];
        const purchases = await PurchaseModel.find({userId: userId})
        res.status(200).send({purchases:purchases})
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.messeage });
    }
}

exports.getGenderComperason = async(req,res) => {
    try {
        const group = await PurchaseModel.aggregate([
            {
                $group: {
                    _id: "$userGender", // Group by the "product" field
                    totalPrice: { $sum: "$totalPrice" }, // Calculate total price
                }
            }
        ])
        res.status(200).send({group:group})
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.messeage });
    }
}

exports.getProductComperason = async(req,res) => {
    try {
        const group = await PurchaseModel.aggregate([
            {
                $unwind: { path: "$productsTitels", includeArrayIndex: "index" } // Unwind productsTitels and track index
            },
            {
                $unwind: { path: "$productsAmounts", includeArrayIndex: "amountIndex" } // Unwind productsAmounts and track index
            },
            {
                $match: { $expr: { $eq: ["$index", "$amountIndex"] } } // Match entries by index
            },
            {
                $group: {
                    _id: "$productsTitels",                    // Group by each product title
                    totalQuantity: { $sum: "$productsAmounts" }, // Sum all amounts for each title
                }
            },
            {
                $sort: { totalQuantity: -1 } // Optional: Sort by total quantity in descending order
            }
        ]);
        res.status(200).send({group:group})
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.messeage });
    }
}




    