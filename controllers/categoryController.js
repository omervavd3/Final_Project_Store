const CategoryModel = require("../models/categoryModel");

exports.addCategory = async(req,res) => {
    try {
        const {category} = req.body;
        const c = await CategoryModel.find({category:category})
        if(c[0]) {
            res.status(200).send({isCreated:false});
        } else {
            await CategoryModel.create({category:category})
            res.status(201).send({isCreated:true});
        }
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.getAllCategories = async(req,res) => {
    try {
        const categories = await CategoryModel.find({})
        res.status(200).send({categories});
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.deleteCategory = async(req,res) => {
    try {
        const {category} = req.body;
        await CategoryModel.findOneAndDelete({category})
        res.status(200).send({isDeleted:true});
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}