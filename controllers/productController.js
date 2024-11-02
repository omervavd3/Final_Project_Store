const ProductModel = require("../models/productModel");

exports.getAllProducts = async(req,res) => {
    try {
        const products = await ProductModel.find({})
        res.status(200).send({products});
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.addProduct = async(req,res) => {
    try {
        const { title,description,price,amount,img, category, gender} = req.body;
        const findProduct = await ProductModel.findOne({title:title});
        if(findProduct) {
          res.status(200).send({ isExits: true, isCreated: false });
        } else {
          if(img) {
            const productDB = await ProductModel.create({ title:title,description:description,price:price,amount:amount,img:img, category:category, gender:gender});
          } else {
            const productDB = await ProductModel.create({ title:title,description:description,price:price,amount:amount, category:category, gender:gender});
          }          
          res.status(201).send({ isExits: false, isCreated: true });
        }
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.updateProduct = async(req,res) => {
    try {
      const {id,title,description,price,amount,img,category,gender} = req.body;
      const sameName = await ProductModel.findOne({title:title, _id:{ $ne: id }})
      if(sameName) {
        res.status(200).send({isUptadet:false})
      } else {
        const p = await ProductModel.findOneAndUpdate({_id:id}, {title,description,price,amount,img,category,gender});
        res.status(200).send({isUptadet:true})
      }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.messeage });
    }
  }

exports.getProductById = async(req,res) => {
    try {
        const {id} = req.body;
        const p = await ProductModel.findOne({_id:id});
        res.status(200).send({product:p})
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.addToCart = async(req,res) => {
    try {
        const {productId} = req.body;
        const product = await ProductModel.findOne({_id:productId})
        product.amount = product.amount - 1
        await product.save()
        res.status(200).send({})
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.removeOneFromCart = async(req,res) => {
    try {
        const {productId} = req.body;
        const product = await ProductModel.findOne({_id:productId})
        product.amount = product.amount + 1
        await product.save()
        res.status(200).send({})
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.removeAllFromCart = async(req,res) => {
    try {
        const {productId, amount} = req.body;
        console.log(amount)
        const product = await ProductModel.findOne({_id:productId})
        product.amount += Number(amount)
        await product.save()
        res.status(200).send({})
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.deleteFromCategory = async(req,res) => {
    try {
        const {category} = req.body;
        const products = await ProductModel.find({category})
        var ids = [];
        for (let index = 0; index < products.length; index++) {
            ids[index] = products[index]._id
            await products[index].deleteOne()
        }
        res.status(200).send({isDeleted:true, productsIds:ids})
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.getByCategory = async(req,res) => {
    try {
        const {category, gender, minPrice, maxPrice} = req.body;
        var products;
        if(category == 'All categories' && gender != 'All Genders') {
            products = await ProductModel.find({gender, price: { $gte: minPrice, $lte: maxPrice }})
        } else if(category != 'All categories' && gender == 'All Genders') {
            products = await ProductModel.find({category, price: { $gte: minPrice, $lte: maxPrice }})
        } else if(category == 'All categories' && gender == 'All Genders') {
            products = await ProductModel.find({ price: { $gte: minPrice, $lte: maxPrice }})
        } else {
            products = await ProductModel.find({category, gender, price: { $gte: minPrice, $lte: maxPrice }})
        }
        res.status(200).send({products:products})
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.deleteFromDeleteProduct = async(req,res) => {
    try {
        const {productId} = req.body;
        const product = await ProductModel.findOneAndDelete({_id:productId})
        res.status(200).send({isProductDeleted:true})
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.getMaxPrice = async(req,res) => {
    try {
        const result = await ProductModel.aggregate([
            {
                $group: {
                    _id: null,          // Group all documents together
                    maxPrice: { $max: "$price" }  // Find the maximum price
                }
            }
        ]);

        if (result.length > 0) {
            const { maxPrice } = result[0];
            res.status(200).send({maxPrice});
        } else {
            res.status(200).send({maxPrice:0});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.messeage });
    }
}

exports.searchProducts = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || query.trim() === "") {
            // Return all products if the query is empty
            const products = await ProductModel.find({});
            return res.status(200).send({ products });
        }

        // Perform a case-insensitive search on the title field
        const products = await ProductModel.find({
            title: { $regex: query, $options: "i" }
        });

        res.status(200).send({ products });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
};
