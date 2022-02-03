const database = require('../infra/database');

const getPosts = () => {
  return database.query('SELECT * FROM post');
}

const getPost = (id) => {
  return database.oneOrNone('SELECT * FROM post WHERE id = $1', [id]);
}

const getPostByTitle = (title) => {
  return database.oneOrNone('SELECT * FROM post WHERE title = $1', [title]);
}

const savePost = (post) => {
  return database.one('INSERT INTO post (title, content) VALUES ($1, $2) returning *', [post.title, post.content]);
}

const deletePost = (id) => {
  return database.none('DELETE FROM post WHERE id = $1', [id]);
}

const updatePost = (id, post) => {
  return database.none('UPDATE post SET title = $1, content = $2 WHERE id = $3', [post.title, post.content, id]);
}

module.exports = {
  getPosts,
  getPost,
  savePost,
  deletePost,
  updatePost,
  getPostByTitle
}
