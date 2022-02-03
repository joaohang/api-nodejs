const postsData = require('../data/postsData');

const getPosts = () => {
  return postsData.getPosts();
}

const getPost = async (id) => {
  const post = await postsData.getPost(id);
  if (post == null) {
    throw new Error("Post not found");
  }
  return post;
}

const savePost = async (post) => {
  const existingPost = await postsData.getPostByTitle(post.title);
  if (existingPost) throw new Error('Post already exists');
  return postsData.savePost(post);
}

const deletePost = (id) => {
  return postsData.deletePost(id);
}

const updatePost = async (id, post) => {
  await getPost(id);
  return postsData.updatePost(id, post);
}

module.exports = {
  getPosts,
  getPost,
  savePost,
  deletePost,
  updatePost
};