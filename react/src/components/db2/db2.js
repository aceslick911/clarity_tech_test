import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';

// Query DB

const GET_SUPPLIERS = gql`
{
  Suppliers(first: 1000) {
    nodes {
     name,
     rating
    }
  },
}
`


const supplierView = ({ supplier }) => {
    return (
        <div key={supplier["_id"]} className="supplier">
            <div><label>Name: </label>{supplier.name}</div>
            <div><label>Rating: </label>{supplier.rating}</div>
        </div>
    )
}


const cache = new InMemoryCache();
const link = new HttpLink({
    //uri: 'http://mongoke2:4001/'
    uri: 'http://localhost:4001/'
})

const client = new ApolloClient({
    cache,
    link
})

export const DB2App = () => {
    return (<ApolloProvider client={client}>
        <DB2 />
    </ApolloProvider>)
}

export const DB2 = () => {
    const { data, loading, error } = useQuery(GET_SUPPLIERS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    return (
        <>
            <h1>Database 2 - Supplier Ratings</h1>
            <div className="container">
                {data &&
                    data.Suppliers &&
                    data.Suppliers.nodes.map((supplier, index) => supplierView({ supplier })

                    )}
            </div>
        </>
    );
}