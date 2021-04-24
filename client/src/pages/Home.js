import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, GridColumn, Transition } from 'semantic-ui-react';

import { AuthContext } from './../context/auth';
import PostCard from './../components/PostCard';
import PostForm from './../components/PostForm';
import { FETCH_POSTS_QUERY } from './../util/graphql';

function Home() {
  const { user } = useContext(AuthContext);
  const { data, loading, error } = useQuery(FETCH_POSTS_QUERY);
  if(loading){
    return <h1>Loading posts...</h1>;
  }
  if(error) {
    console.log(error);
    return "error"; // blocks rendering
  }
  const posts = data.getPosts;

  return(
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <GridColumn>
            <PostForm />
          </GridColumn>
        )}
        {data && (
          <Transition.Group>
            {posts && posts.map((post) => (
              <Grid.Column key={post.id}>
                <PostCard post={post} />
              </Grid.Column>
            ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;