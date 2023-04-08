const users = [
  {
    id: "1",
    name: "Adrian",
    email: "adrian@test.com",
    age: 24,
  },
  {
    id: "2",
    name: "Alyssa",
    email: "ysa@test.com",
    age: 25,
  },
  {
    id: "3",
    name: "Konkon",
    email: "kon@test.com",
    age: 14,
  },
];

const posts = [
  {
    id: "1",
    title: "test title 1",
    body: "Post body",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "2nd title",
    body: "Post sample",
    published: false,
    author: "1",
  },
  {
    id: "3",
    title: "3rd title",
    body: "Post example",
    published: true,
    author: "2",
  },
];
const comments = [
  {
    id: "1",
    text: "That's cool!",
    post: "1",
    author: "1",
  },
  {
    id: "2",
    text: "That's Awesome!",
    post: "1",
    author: "2",
  },
  {
    id: "3",
    text: "Meow!",
    post: "2",
    author: "3",
  },
  {
    id: "4",
    text: "Not here girl",
    post: "2",
    author: "1",
  },
];

const db = {
  users,
  comments,
  posts,
};

export { db as default };
