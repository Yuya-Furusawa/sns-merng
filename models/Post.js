// Postモデルの作成
// おそらくmongoose特有？
const { model, Schema } = require('mongoose');

const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String
    }
  ],
  likes: [
    {
      username: String,
      createdAt: String
    }
  ],
  // userをプロパティにもつ
  // typeはidなので、idで指定する
  // refはリレーションを表現
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
});

// modelはMongoDBからdocumentを読み書きするために使う
// これは`Post`で呼び出し可能
module.exports = model('Post', postSchema);