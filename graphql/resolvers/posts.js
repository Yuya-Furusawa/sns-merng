const { AuthenticationError, UserInputError } = require('apollo-server');
const { argsToArgsConfig } = require('graphql/type/definition');

const Post = require('./../../models/Post');
const checkAuth = require('./../../util/check-auth');

// リゾルバの定義
// クエリ発行時の処理を指定
module.exports = {
  // スキーマ定義に従い、"Query" "getPosts"じゃないとだめ
  Query: {
    async getPosts(){
      try{
        // クエリみたいな
        // Postモデルを読み取り
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    //リゾルバ関数で引数を取るときは、{ parent, args, context, info }で引数にしなくてはならないことに注意
    async getPost(_, { postId }){
      try{
        const post = await Post.findById(postId);
        if (post){
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    //contextはauthenticationとかで使う
    async createPost(_, { body }, context){
      //このuserは絶対にnullではない、事前にエラーが吐かれている
      const user = checkAuth(context);

      if (body.trim() === ''){
        throw new Error('Post must not be empty');
      }

      const newPost = new Post({
        body,
        username: user.username,
        createdAt: new Date().toISOString(),
        user: user.id
      });

      const post = await newPost.save();

      //publish an event
      context.pubsub.publish('NEW_POST', {
        newPost: post
      });

      return post;
    },
    async deletePost(_, { postId }, context){
      const user = checkAuth(context);

      try{
        const post = await Post.findById(postId);
        if (user.username === post.username){
          await post.delete();
          return 'Post deleted successfully!';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch(err){
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context){
      const user = checkAuth(context);

      const post = await Post.findById(postId);
      if (post){
        if (post.likes.find((like) => like.username === user.username)){
          //Post already likes, unlike it
          post.likes = post.likes.filter((like) => like.username !== user.username);
        } else {
          //Not liked, like post
          post.likes.push({
            username: user.username,
            createdAt: new Date().toISOString()
          });
        }
        await post.save();
        return post;
      } else throw new UserInputError('Post not found');
    }
  },
  Subscription: {
    newPost: {
      //An AsyncIterator object listens for events that are associated with a particular label and adds them to a queue for processing.
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
    }
  }
};