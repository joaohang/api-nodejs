const axios = require('axios');
const crypto = require('crypto');
const postsService = require('../service/postsService');

const generateRandomString = () => {
  return crypto.randomBytes(20).toString('hex');
}

const apiUrl = `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/posts`

const request = (url, method, data) => {
  return axios({
    url,
    method,
    data,
    validateStatus: false
  });
}

test('Should get posts', async () => {
  //Given - Dado que
  const post1 = await postsService.savePost({ title: generateRandomString(), content: generateRandomString() });
  const post2 = await postsService.savePost({ title: generateRandomString(), content: generateRandomString() });

  //When - Quando acontecer
  const response = await request(apiUrl, 'get')
  //Then - então
  expect(response.status).toBe(200);
  const posts = response.data;
  await postsService.deletePost(post1.id);
  await postsService.deletePost(post2.id);
  expect(posts).toHaveLength(2);
});

test('Should save post', async () => {

  const data = { title: generateRandomString(), content: generateRandomString() };

  const response = await request(apiUrl, 'post', data)

  const post = response.data;
  expect(post.title).toBe(data.title);
  expect(post.content).toBe(data.content);
  await postsService.deletePost(post.id);
  expect(response.status).toBe(201);
});

test('Should not save post', async () => {

  const data = { title: generateRandomString(), content: generateRandomString() };

  const response1 = await request(apiUrl, 'post', data)
  const response2 = await request(apiUrl, 'post', data)


  const post = response1.data;
  await postsService.deletePost(post.id);
  expect(response2.status).toBe(409);
});

test('Should update post', async () => {

  const post = await postsService.savePost({ title: generateRandomString(), content: generateRandomString() });
  post.title = generateRandomString();
  post.content = generateRandomString();

  const response = await request(`${apiUrl}/${post.id}`, 'put', post);
  const updatedPost = await postsService.getPost(post.id)

  expect(updatedPost.title).toBe(post.title);
  expect(updatedPost.content).toBe(post.content);
  await postsService.deletePost(updatedPost.id);
  expect(response.status).toBe(204);
});

test('Should not update a post', async () => {

  const post = {
    id: 1
  }
  const response = await request(`${apiUrl}/${post.id}`, 'put', post);
  expect(response.status).toBe(404);
});

test('Should delete post', async () => {
  const post = await postsService.savePost({ title: generateRandomString(), content: generateRandomString() });

  const response = await request(`${apiUrl}/${post.id}`, 'delete');
  const deletedPost = await postsService.getPosts();

  expect(deletedPost).toHaveLength(0);
  expect(response.status).toBe(204);
});