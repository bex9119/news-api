const { selectArticleById } = require("../models/articles.model");
const { selectCommentsForArticle, insertComment, removeComment, updateCommentVotes } = require("../models/comments.model");

exports.getArticleCommentsById = (req, res, next) => {
    const { article_id } = req.params;
    const selectPromises = [selectCommentsForArticle(article_id), selectArticleById(article_id)]
      Promise.all(selectPromises)
      .then((reslovedPromises) => {
        const comments = reslovedPromises[0]
        res.status(200).send({ comments });
      })
      .catch(next);
  }

  exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const newComment = req.body
    insertComment(article_id, newComment)
    .then((postedComment) => {
      res.status(201).send({postedComment})
    })
    .catch(next)
  }

  exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params
    removeComment(comment_id)
    .then(() => {
      res.status(204).send()
    })
    .catch(next)
  }

  exports.patchCommentVote = (req, res, next) => {
    const { comment_id } = req.params
    const { inc_votes } = req.body
    updateCommentVotes(comment_id, inc_votes)
    .then((updatedComment) => {
      res.status(200).send({updatedComment})
    })
    .catch(next)
  }