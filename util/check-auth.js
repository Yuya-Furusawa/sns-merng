const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('./../config');

module.exports = (context) => {
  // context = { ...header }
  const authHeader = context.req.headers.authorization;
  if (authHeader){
    //Bearer ...
    const token = authHeader.split('Bearer ')[1];
    if (token){
      try {
        //tokenを検証
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch(err) {
        throw new AuthenticationError('Invalid/Expire token');
      }
    }
    throw new Error('Authentication token must be \'Bearer [token]\'');
  }
  throw new Error('Authorization header must be provided');
};