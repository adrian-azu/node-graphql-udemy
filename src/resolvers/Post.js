const Post = {
  author(parent, args, { db }, info) {
    let { users, posts, comments } = db;

    return users.find((user) => user.id === parent.author);
  },
  comments(parent, args, { db }, info) {
    let { users, posts, comments } = db;

    return comments.filter((comment) => comment.post === parent.id);
  },
};
export { Post as default };
