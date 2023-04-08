const User = {
  posts(parent, args, { db }, info) {
    let { users, posts, comments } = db;

    return posts.filter((post) => post.author === parent.id);
  },
  comments(parent, args, { db }, info) {
    let { users, posts, comments } = db;

    return comments.filter((comment) => comment.author === parent.id);
  },
};

export { User as default };
