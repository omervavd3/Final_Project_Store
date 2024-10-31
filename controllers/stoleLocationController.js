const StoreLocationModel = require("../models/storeLocationModel")

exports.addStoreLocation = async(req,res) => {
    try {
        const {lat, lng, name, phone, city} = req.body
        const storeName = await StoreLocationModel.findOne({name})
        const storeLocation = await StoreLocationModel.findOne({lng,lat})
        if(storeName || storeLocation) {
            res.status(200).send({isCreated:false})
        } else {
            await StoreLocationModel.create({lat, lng, name, phone, city})
            res.status(200).send({isCreated:true})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.messeage });
    }
}

exports.getAllStoresLocations = async(req,res) => {
    try {
        const stores = await StoreLocationModel.find({})
        res.status(200).send({stores:stores})
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.messeage });
    }
}