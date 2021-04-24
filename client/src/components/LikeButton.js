import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Label, Icon } from 'semantic-ui-react';
import MyPopup from '../util/MyPopup';

function LikeButton({ user, post: { id, likeCount, likes }}){
  const [liked, setLiked] = useState(false);

  //dislikeは効く
  //likeは効かない
  //likeしたあとのdislikeは効かない
  //更新するとちゃんと表示される（DBの更新はちゃんと行えてる）
  //→これらはクエリにcreatedAtを追加すれば解決した
  useEffect(() => {
    //ログイン済みかつ自分がlikeしているとき、like状態になる
    if (user && likes.find((like) => like.username === user.username)){
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]); //どのタイミングでuserとlikesは更新されるの？たぶんここで詰まってる
  //→たぶんcacheが更新されるタイミングでlikesも更新される

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id }
  });

  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <MyPopup content={ liked ? "Unlike post" : "Like post" }>
      <Button
        as="div"
        labelPosition="right"
        //logout時にもmutationを行おうとしてしまうのでundefinedを追加
        onClick={ user ? likePost : undefined }
      >
        {likeButton}
        <Label basic color="teal" pointing="left">
          {likeCount}
        </Label>
      </Button>
    </MyPopup>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!){
    likePost(postId: $postId){
      id
      likes{
        id
        username
        createdAt
      }
      likeCount
    }
  }
`;

export default LikeButton;