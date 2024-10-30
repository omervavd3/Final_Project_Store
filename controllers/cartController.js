const CartModel = require("../models/cartModel")

exports.getUserCart = async(req,res) => {
    try {
        const userId = req.cookies.user;
        const userCart = await CartModel.find({userId: userId})
        res.status(200).send({userCart});
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.addToCart = async(req,res) => {
    try {
        const {productId} = req.body;
        const userId = req.cookies.user;
        const userCart = await CartModel.findOne({userId: userId, productId:productId})
        if(userCart) {
            userCart.amount++;
            await userCart.save();
            res.status(200).send({isAdded: true});
        } else {
            await CartModel.create({userId,productId, amount:1})
            res.status(200).send({isAdded: true});
        }
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.removeOneFromCart = async(req,res) => {
    try {
        const {productId} = req.body;
        const userId = req.cookies.user;
        const userCart = await CartModel.findOne({userId: userId, productId:productId})
        if(userCart.amount == 1) {
            await CartModel.findOneAndDelete({userId: userId, productId:productId})
            res.status(200).send({removedOne:false, removedAll:true});
        } else {
            userCart.amount = userCart.amount - 1
            await userCart.save()
            res.status(200).send({removedOne:true, removedAll:false});
        }
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.removeAllFromCart = async(req,res) => {
    try {
        const {productId} = req.body;
        const userId = req.cookies.user;
        const userCart = await CartModel.findOne({userId: userId, productId:productId})
        await CartModel.findOneAndDelete({userId: userId, productId:productId})
        res.status(200).send({removedAll:true});
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.deleteFromDeleteCategory = async(req,res) => {
    try {
        const {productsIds} = req.body;
        for (let index = 0; index < productsIds.length; index++) {
            await CartModel.findOneAndDelete({productId:productsIds[index]})
        }
        res.status(200).send({isDeleted:true});
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.amountOfProductsInCart = async(req,res) => {
    try {
        const userId = req.cookies.user;
        const cart = await CartModel.find({userId: userId})
        var amount = 0;
        for (let index = 0; index < cart.length; index++) {
            amount += cart[index].amount
        }
        res.status(200).send({amount});
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.clearCartAfterPurchase = async(req,res) => {
    try {
        const userId = req.cookies.user;
        const cart = await CartModel.find({userId: userId})
        for (let index = 0; index < cart.length; index++) {
            await cart[index].deleteOne()
        }
        res.status(200).send({cartClear:true});
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.deleteFromDeleteProduct = async(req,res) => {
    try {
        const {productId} = req.body;
        const cart = await CartModel.find({productId: productId})
        for (let index = 0; index < cart.length; index++) {
            await cart[index].deleteOne()
        }
        res.status(200).send({cartClear:true});
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}