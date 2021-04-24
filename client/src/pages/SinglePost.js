import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Card, Grid, Image, Button, Icon, Label, Form } from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from './../context/auth';
import LikeButton from './../components/LikeButton';
import DeleteButton from './../components/DeleteButton';
import MyPopup from '../util/MyPopup';

function SinglePost(props){
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const [comment, setComment] = useState('');

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update(){
      setComment('');
      commentInputRef.current.blur(); //focus状態を外す
    },
    variables: {
      postId,
      body: comment
    }
  });

  const { data, loading, error } = useQuery(FETCH_POST_QUERY, {
    variables: { postId: postId }
  });
  if(loading){
    return <h1>Loading posts...</h1>;
  }
  if(error) {
    console.log(error);
    return "error"; // blocks rendering
  }
  const getPost = data.getPost;

  function deletePostCallback() {
    props.history.push('/');
  }

  let postMarkup;
  if (!getPost){
    postMarkup = <p>Loading posts..</p>;
  } else {
    const { id, body, username, createdAt, likeCount, likes, commentCount, comments } = getPost;
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image src='https://react.semantic-ui.com/images/avatar/large/steve.jpg' size="small" float="right" />
          </Grid.Column>
          <Grid.Column width={12}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{id, likes, likeCount}} />
                <MyPopup content="Comment on post">
                  <Button as="div" labelPosition='right' onClick={() => console.log('Comment on post')}>
                    <Button color='blue' basic>
                      <Icon name='comments' />
                    </Button>
                    <Label basic color='blue' pointing='left'>
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map(comment => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!){
    createComment(postId: $postId, body: $body){
      id
      comments{
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query getPost($postId: ID!){
    getPost(postId: $postId){
      id
      body
      username
      createdAt
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        body
        createdAt
      }
    }
  }
`;

export default SinglePost;