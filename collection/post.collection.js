const postModal = require('../models/post.schema');

class post {
    /**
       * @function - Get all the registered users from the db
       *
       * @param - Express.req , Express.res
       *
       * @returns - List of registered users
       */

    async createPost(req, res) {
        // throw new Error("could not create a user")
        console.log("body====>", req.body);
        try {
            let posts = new postModal({
                ...req.body
            })

            await posts.save()

            return res.status(200).send({
                message: "post created",
                result: posts
            });
        } catch (error) {
            console.log("error==?", error);
        }


    }

    async getAllPost(req, res) {
        let { post } = req.session
        console.log("post in get all", post);
        let limit
        let page
        if (req.query.limit) {
            limit = (parseInt(req.query.limit) ? parseInt(req.query.limit) : 10);
            page = req.query.page ? (parseInt(req.query.page) ? parseInt(req.query.page) : 1) : 1;
        }
        const createdAt = req.query.createdAt ? (req.query.createdAt == 'desc' ? -1 : 1) : 1
        const posts = await postModal.find({})
            .populate('userId')
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ createdAt: createdAt })
            .lean()
        res.status(200).send({
            message: "post from DB",
            status: true,
            post: posts,
        });


    }


    async getonePostAndRemove(req, res) {
        let postId = req.params.id;
        let posts = await postModal.findByIdAndRemove(postId)
        let status = false
        if (posts) {
            status = true
        }
        res.status(200).send({
            status: status,
            post: posts,
        });

    }

    async readByUpdateInPost(req, res) {
        let postId = req.params.id;
        let readId = req.body.readBy
        let posts = await postModal.findById(postId)
        if (!posts) {
            return res.status(404).send({ message: "posts doesnt exist" })
        }

        let postss = await postModal.updateOne({ "_id": postId }, {
            $set: { readBy: readId }
        })
        res.status(200).send({
            status: true,
            post: postss,
        });

    }
}

module.exports = post;