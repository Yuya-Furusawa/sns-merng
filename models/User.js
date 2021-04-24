// Userモデルの作成
// おそらくmongoose特有？
const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String
});

// modelはMongoDBからdocumentを読み書きするために使う
// これは`User`で呼び出し可能
module.exports = model('User', userSchema);