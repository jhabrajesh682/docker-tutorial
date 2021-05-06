const userModal = require("../models/user.model");
const bcrypt = require("bcrypt");
class User {

    async createUser(req, res) {
        console.log("req body====>📁", req.body);
        let user = new userModal({
            ...req.body
        })

        //Encryption of password
        const salt = await bcrypt.genSalt(10);
        console.log("salt=========>❌ ", salt);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        res.status(200).send({
            message: "user successfully created",
            result: user
        })
    }

    async getAllUsers(req, res) {
        let limit
        let page
        if (req.query.limit) {
            limit = (parseInt(req.query.limit) ? parseInt(req.query.limit) : 10);
            page = req.query.page ? (parseInt(req.query.page) ? parseInt(req.query.page) : 1) : 1;
        }

        const createdAt = req.query.createdAt ? (req.query.createdAt == 'desc' ? -1 : 1) : 1
        const users = await userModal.find({})
            .select("-password")
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ createdAt: createdAt })
            .lean()
        res.status(200).send({
            status: true,
            user: users
        })
    }


    async getOneAndUpdateUser(req, res) {

        let userId = req.params.id
        let user = await userModal.findById(userId)
        if (!user) {
            res.status(404).send({
                message: "user not exist"
            })
        }
        user.set(req.body)
        await user.save()

        res.status(200).send({
            message: "user successfully updated",
            result: user
        })

    }

    async getOneAndDeleteUser(req, res) {
        let userId = req.params.id
        let user = await userModal.findByIdAndRemove(userId).lean()
        let status = false
        if (status) {
            status = true
        }

        res.status(200).send({
            message: "user successfully deleted",
            user: user,
            status: status
        })

    }

    async authenticateUsers(req, res) {

        if (req.session) {
            console.log("req.session.user=====>", req.session.user);
        }
        let user = await userModal.findOne({ username: req.body.username })
        req.session.user = user
        if (!user) {
            res.status(404).send({
                message: "user not found",
                status: false,
                Email: req.body.Email
            })
        }
        let validatePassword = await bcrypt.compare(req.body.password, user.password)
        if (!validatePassword) {
            return res.status(400).send({
                message: "pls enter correct password",
                status: false,
                Email: req.body.Email
            })
        }
        //create JWT token when user login and save Email and userId of user
        // let token = user.getSignedJwtToken();
        // console.log("token====>", token);

        res.status(200).send({
            message: "user successfully logged in"
        })
    }


}
module.exports = User