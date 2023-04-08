const Query = {
  users: (parents, args, { db }, info) => {
    const { query } = args;
    const { users } = db;
    if (!query) return users;
    return users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
  },
  posts: (parents, args, { db }, info) => {
    const { query } = args;
    const { posts } = db;
    if (!query) return posts;
    return posts.filter((post) => post.title.toLowerCase().includes(query.toLowerCase()) || post.body.toLowerCase().includes(query.toLowerCase()));
  },
  post: () => {
    return { id: "1234690", title: "test title", body: "Post body", published: true };
  },
  me: () => {
    return { id: "1234690", name: "Adrian", email: "adrian@test.com", age: 24 };
  },
  comments: (parents, args, { db }, info) => {
    const { post_id, query } = args;
    const { comments } = db;

    if (query) return comments.filter((comment) => comment.text.toLowerCase().includes(query.toLowerCase()));
    if (post_id) return comments.filter((comment) => comment.post == post_id);
    return comments;
  },
};
export { Query as default };
