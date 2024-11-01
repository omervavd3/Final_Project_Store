const UserModel = require("../models/userModel");

exports.logIn = async (req,res) => {
    try {
        const { name, password } = req.body;
        const crypto = require('crypto');
        function hashPassword(password) {
          // Create a SHA-256 hash of the password
          const hash = crypto.createHash('sha256');
          hash.update(password);
          return hash.digest('hex'); // Return the hash as a hexadecimal string
        }
        res.clearCookie('user')
        res.clearCookie('userAdmin')
        const newPas = await hashPassword(password)
        const userDB = await UserModel.findOne({name:name, password:newPas})
        //checks if admin
        const adminPass = hashPassword(process.env.ADMIN_PASSWORD);
        if(userDB) {
          if(userDB.name == process.env.ADMIN_NAME && userDB.password == adminPass) {
            res.cookie('userAdmin', userDB._id, { maxAge: 50000000, httpOnly: true });
            res.status(200).send({ message: "Found", admin: true, user:userDB})
          } else {
            res.cookie('user', userDB._id, { maxAge: 50000000, httpOnly: true });
            res.status(200).send({ message: "Found", admin: false, user:userDB})
          }
        } else {
            res.status(200).send({message: "Not found"})
        }
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.signUp = async(req,res) => {
    try {
        const { name, password, gender } = req.body;
        const findUser = await UserModel.findOne({name:name});
        if(findUser) {
          res.status(200).send({ isExits: true, isCreated: false });
        } else {
          const crypto = require('crypto');
          function hashPassword(password) {
            // Create a SHA-256 hash of the password
            const hash = crypto.createHash('sha256');
            hash.update(password);
            return hash.digest('hex'); // Return the hash as a hexadecimal string
          }
          const newPas = await hashPassword(password)
          const userDB = await UserModel.create({ name, password: newPas, gender:gender});
      
          console.log(userDB);
          
          res.status(201).send({ isExits: false, isCreated: true });
        }
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.getAdminCookie = async(req,res) => {
    try {
        const adminCookie = req.cookies.userAdmin;
        res.status(200).send({adminCookie:adminCookie});
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.getUserCookie = async(req,res) => {
    try {
        const userCookie = req.cookies.user;
        res.status(200).send({userCookie:userCookie});
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.logOut = async(req,res) => {
    try {
        res.clearCookie('user')
        res.clearCookie('userAdmin')
        res.status(200).send({loggedOut:true});
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.getUserNameById = async(req,res) => {
    try {
        const {userId} = req.body;
        const user = await UserModel.findOne({_id:userId})
        const name = user.name
        res.status(200).send({userName:name});
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.getUserName = async(req,res) => {
    try {
        const userCookie = req.cookies.user;
        const user = await UserModel.findOne({_id:userCookie})
        const name = user.name
        res.status(200).send({userName:name});
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.getUserGender = async(req,res) => {
    try {
        const userCookie = req.cookies.user;
        const user = await UserModel.findOne({_id:userCookie})
        const gender = user.gender
        res.status(200).send({userGender:gender});
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.changePassword = async(req,res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userCookie = req.cookies.user;
        const crypto = require('crypto');
        function hashPassword(password) {
          // Create a SHA-256 hash of the password
          const hash = crypto.createHash('sha256');
          hash.update(password);
          return hash.digest('hex'); // Return the hash as a hexadecimal string
        }
        const oldPas = await hashPassword(oldPassword)
        const user = await UserModel.findOne({_id:userCookie})
        if(user.password == oldPas) {
            const newPas = await hashPassword(newPassword)
            user.password = newPas
            await user.save()
            res.status(200).send({changedPassword: true});
        } else {
            res.status(200).send({changedPassword: false});
        }
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}

exports.deleteUser = async(req,res) => {
    try {
        const { password } = req.body;
        const userCookie = req.cookies.user;
        const crypto = require('crypto');
        function hashPassword(password) {
          // Create a SHA-256 hash of the password
          const hash = crypto.createHash('sha256');
          hash.update(password);
          return hash.digest('hex'); // Return the hash as a hexadecimal string
        }
        const pas = await hashPassword(password)
        const user = await UserModel.findOne({_id:userCookie})
        if(user.password == pas) {
            user.deleteOne()
            res.status(200).send({isDeleted: true});
        } else {
            res.status(200).send({isDeleted: false});
        }
      } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.messeage });
      }
}