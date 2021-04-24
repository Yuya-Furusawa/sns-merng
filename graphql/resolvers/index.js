// リゾルバ関数のまとめ
const postsResolvers = require('./posts');
const userResolvers = require('./users');
const commentResolvers = require('./comments');

module.exports = {
  Post: {
    commentCount: (parent) => parent.comments.length,
    likeCount: (parent) => parent.likes.length
  },
  Query: {
    ...postsResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentResolvers.Mutation
  },
  Subscription: {
    ...postsResolvers.Subscription
  }
}