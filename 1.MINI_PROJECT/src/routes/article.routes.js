const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");
const {
  articleValidation,
} = require("../middleware/validation/article.validation.js");
// Import controllers
const articleController = require("../controllers/article.controller");

// Get all articles (public)
router.get("/", articleController.getAllArticles);

// Get a single article by ID (public)
router.get("/:id", articleController.getArticleById);

router.use(authMiddleware);
// Create a new article (jwt)
router.post("/", articleValidation.create, articleController.createArticle);

// Update an article (jwt)
router.put("/:id", articleValidation.update, articleController.updateArticle);
// Update an article to publish (jwt)
router.patch(
  "/publish/:id",
  articleValidation.publish,
  articleController.updateToPublish
);

// Delete an article (jwt)
router.delete("/:id", articleController.deleteArticle);

// Get articles by user ID (jwt)
router.get("/user/me", articleController.getUserArticles);

module.exports = router;
