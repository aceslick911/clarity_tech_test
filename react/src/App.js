import React from 'react';
import logo from './logo.svg';
import './App.css';

import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";

const GET_POKEMON_INFO = gql`
{
  pokemons(first: 150) {
    id
    number
    name,
    image,
    evolutions {
      id,
      number,
      name,
      image
    }
  }
}`


const GET_USER_INFO = gql`
{
  Users{
    nodes {
      _id
      username
      email
    }
  }
}
`

function App() {
  const { data, loading, error } = useQuery(GET_USER_INFO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <>
      <h1>Users</h1>


      <div className="container">
        {data &&
          data.Users &&
          data.Users.nodes.map((user, index) => (
            <div key={user["_id"]} className="card">
              <div>{user.username}</div>
              <div>{user.email}</div>
            </div>
          ))}
      </div>
    </>
  );
}

export default App;
