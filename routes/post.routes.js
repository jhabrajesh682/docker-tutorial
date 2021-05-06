const router = require("express").Router();
const posts = require("../collection/post.collection")
const auth = require('../middleware/authMiddleware');


const post = new posts();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */
router.get("/", auth, post.getAllPost);
router.post("/create", auth, post.createPost);


router.put("/:id", post.readByUpdateInPost)

router.delete("/:id", post.getonePostAndRemove)




module.exports = router;