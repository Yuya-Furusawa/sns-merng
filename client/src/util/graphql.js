import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
  query getPosts{
    getPosts {
      id
      body
      username
      createdAt
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        username
        body
        createdAt
      }
      commentCount
    }
  }
`;