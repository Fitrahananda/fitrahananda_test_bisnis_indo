const { Article, User } = require("../models");
const HttpError = require("../utils/HttpError");
const { Op, fn, col, where } = require("sequelize");
// Get all published articles
exports.getAllArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    // Array untuk menampung semua kondisi
    const conditions = [];

    // Filter status (jika ada)
    if (req.query.status) {
      if (req.query.status !== "published" && req.query.status !== "draft") {
        throw new HttpError("status must be `published` or `draft`", 401);
      }
      conditions.push({ status: req.query.status.toLowerCase() });
    }

    // Filter search (jika ada)
    if (req.query.search) {
      const keyword = req.query.search.toLowerCase();
      conditions.push(
        where(fn("LOWER", col("title")), {
          [Op.like]: `%${keyword}%`,
        })
      );
    }

    // Bentuk akhir dari WHERE clause
    const whereClause = conditions.length > 0 ? { [Op.and]: conditions } : {};
    const { count, rows: articles } = await Article.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: "Fetch article successfully",
      data: {
        currentPage: page,
        totalPages,
        totalData: count,
        articles,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get a single article by ID
exports.getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
    });

    if (!article) {
      throw new HttpError("Article not found", 404);
    }
    res.status(200).json({
      success: true,
      message: "fetch one article successfully",
      data: {
        article,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Create a new article
exports.createArticle = async (req, res, next) => {
  const { title, body, status = "draft" } = req.body;

  try {
    const article = await Article.create({
      title,
      body,
      status: "draft",
      user_id: req.user.id,
    });
    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: {
        article,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Update an article
exports.updateArticle = async (req, res, next) => {
  const { title, body, status } = req.body;

  try {
    let article = await Article.findByPk(req.params.id);

    if (!article) {
      throw new HttpError("Article not found", 404);
    }

    // Check if user owns the article
    if (article.user_id !== req.user.id) {
      throw new HttpError("Not authorized", 403);
    }

    // Update article
    await article.update({
      title,
      body,
    });
    res.status(201).json({
      success: true,
      message: "Article updated successfully",
      data: {
        article,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Update an article
exports.updateToPublish = async (req, res, next) => {
  const { title, body, status } = req.body;

  try {
    let article = await Article.findByPk(req.params.id);

    if (!article) {
      throw new HttpError("Article not found", 404);
    }

    // Check if user owns the article
    if (article.user_id !== req.user.id) {
      throw new HttpError("Not authorized", 403);
    }

    // Update article
    await article.update({
      title,
      body,
      status: "published",
    });
    res.status(201).json({
      success: true,
      message: "Article updated status successfully",
      data: {
        article,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Delete an article
exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      throw new HttpError("Article not found", 404);
    }

    // Check if user owns the article
    if (article.user_id !== req.user.id) {
      throw new HttpError("Not authorized", 403);
    }

    // Delete article
    await article.destroy();
    res.status(201).json({
      success: true,
      message: "Article deleted successfully",
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// Get articles by current user
exports.getUserArticles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Kumpulkan semua kondisi di array
    const conditions = [{ user_id: req.user.id }];

    // Wajib: hanya artikel milik user ini

    // Filter status (jika ada)
    if (req.query.status) {
      const allowedStatuses = ["published", "draft"];
      const status = req.query.status.toLowerCase();
      if (!allowedStatuses.includes(status)) {
        throw new HttpError("Status must be 'published' or 'draft'", 400);
      }
      conditions.push({ status });
    }

    // Filter search (jika ada)
    if (req.query.search) {
      const keyword = req.query.search.toLowerCase();
      conditions.push(
        where(fn("LOWER", col("title")), {
          [Op.like]: `%${keyword}%`,
        })
      );
    }

    // Bentuk akhir dari WHERE clause
    const { count, rows: articles } = await Article.findAndCountAll({
      where: {
        [Op.and]: conditions,
      },
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: "Fetch user articles successfully",
      data: {
        currentPage: page,
        totalPages,
        totalData: count,
        articles,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserArticlesById = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      throw new HttpError("Article not found", 404);
    }

    // Check if user owns the article
    if (article.user_id !== req.user.id) {
      throw new HttpError("Not authorized", 403);
    }
    res.status(200).json({
      success: true,
      message: "fetch one article successfully",
      data: {
        article,
      },
    });
  } catch (err) {
    next(err);
  }
};
