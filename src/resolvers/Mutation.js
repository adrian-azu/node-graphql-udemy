import { GraphQLError } from "graphql";
import { v4 as uuidv4 } from "uuid";

const Mutation = {
  createUser(parent, args, { db }, info) {
    let { users, posts, comments } = db;

    const emailTaken = users.some((user) => user.email == args.email);
    if (emailTaken) throw new GraphQLError("User already taken");
    const newUser = {
      id: uuidv4(),
      ...args.data,
    };
    users.push(newUser);
    return newUser;
  },
  updateUser(parent, args, { db }, info) {
    const { users } = db;
    let { id, data } = args;
    const user = users.find((user) => user.id === id);
    if (!user) throw new GraphQLError("User does not exists!");
    const emailTaken = users.some((user) => user.email == data.email);
    if (emailTaken) throw new GraphQLError("Email is already taken!");
    Object.keys(data).forEach((value) => {
      user[value] = data[value];
    });
    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const { id } = args;
    let { users, posts, comments } = db;
    let userIndex = users.findIndex((user) => user.id === id);
    console.log(userIndex);
    if (userIndex === -1) {
      throw new GraphQLError("User does not exists!");
    }
    posts = posts.filter((post) => {
      const match = post.author === id;
      if (match) {
        comments = comments.filter((comment) => comment.post === post.id);
      }
      return !match;
    });
    comments = comments.filter((comment) => comment.author === id);
    const [deletedUser] = users.splice(userIndex, 1);
    return deletedUser;
  },

  createPost(parent, args, { db, pubsub }, info) {
    let { users, posts, comments } = db;

    const { data } = args;
    const userFailed = users.some((user) => user.id === data.author);
    if (!userFailed) throw new GraphQLError("User does not exists!");
    const post = {
      id: uuidv4(),
      ...data,
    };
    posts.push(post);
    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }
    return post;
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { posts } = db;
    let { id, data } = args;
    const post = posts.find((post) => post.id === id);
    if (!post) throw new GraphQLError("Post does not exists!");
    const tempPost = post;
    Object.keys(data).forEach((value) => {
      post[value] = data[value];
    });
    if (data?.published) {
      if (data.published && !tempPost.published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      }
      if (!data.published && tempPost.published) {
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: post,
          },
        });
      }
    } else {
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post,
        },
      });
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const { id } = args;
    let { users, posts, comments } = db;

    let postIndex = posts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
      throw new GraphQLError("Post does not exists!");
    }
    comments = comments.filter((comment) => comment.post === id);
    const [deletedPost] = posts.splice(postIndex, 1);
    pubsub.publish("post", {
      post: {
        mutation: "DELETED",
        data: deletedPost,
      },
    });
    return deletedPost;
  },

  createComment(parent, args, { db, pubsub }, info) {
    let { users, posts, comments } = db;

    const { data } = args;
    const userFailed = users.some((user) => user.id === data.author);
    const postFailed = posts.some((post) => post.id === data.post && post.published);
    if (!userFailed) throw new GraphQLError("User does not exists!");
    if (!postFailed) throw new GraphQLError("Post does not exists or not published yet!");
    const comment = {
      id: uuidv4(),
      ...data,
    };
    comments.push(comment);
    pubsub.publish(`comment ${data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });
    return comment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { comments } = db;
    let { id, data } = args;
    const comment = comments.find((comment) => comment.id === id);
    if (!comment) throw new GraphQLError("Comment does not exists!");
    Object.keys(data).forEach((value) => {
      comment[value] = data[value];
    });
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });
    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    let { users, posts, comments } = db;

    const { id } = args;
    let commentIndex = comments.findIndex((comment) => comment.id === id);
    if (commentIndex === -1) {
      throw new GraphQLError("Comment does not exists!");
    }
    const [deletedComment] = comments.splice(commentIndex, 1);
    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment,
      },
    });
    return deletedComment;
  },
};
export { Mutation as default };
