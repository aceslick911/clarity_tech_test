import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';

const GET_SUPPLIERS = gql`
{
  Suppliers(first: 1000) {
    nodes {
     name,
      number,
      messages_sent,
      messages_recv,
      workorders(first:100){
        nodes{
          description,
          date_due,
          date_completed,
          priority,
          report_provided
        }
      },
      services(first:100){
        nodes{
          name,
          description
        }
      }
    }
  },
}
`

const servicesView = ({ services }) => {

    return services.nodes.length > 0 ? (<div>
        <h2>Services:</h2>
        <ul>
            {services && services.nodes.map((service) => (
                <li key={service["_id"]} className="services">
                    <div><label>Name: </label>{service.name}</div>
                    <div><label>Desc: </label>{service.description}</div>

                </li>
            ))}
        </ul>
    </div>) : (<div>No services</div >)
}


const workOrderView = ({ workorders }) => {

    return workorders.nodes.length > 0 ? (<div>
        <h2>Work orders:</h2>
        <ul>
            {workorders && workorders.nodes.map((workorder) => (
                <li key={workorder["_id"]} className="workorders">
                    <div><label>Desc: </label>{workorder.description}</div>
                    <div><label>date_due: </label>{workorder.date_due}</div>
                    <div><label>date_completed: </label>{workorder.date_completed}</div>
                    <div><label>priority: </label>{workorder.priority}</div>
                    <div><label>report_provided: </label>{workorder.report_provided}</div>
                </li>
            ))}
        </ul>
    </div>) : (<div>No work orders</div >)
}


const supplierView = ({ supplier }) => {
    return (
        <div key={supplier["_id"]} className="supplier">
            <div><label>Name: </label>{supplier.name}</div>
            <div><label>Number: </label>{supplier.number}</div>
            <div><label>Msgs Sent: </label>{supplier.messages_sent}</div>
            <div><label>Msgs Recv: </label>{supplier.messages_recv}</div>
            {servicesView({ services: supplier.services })}
            {workOrderView({ workorders: supplier.workorders })}
        </div>
    )
}


const cache = new InMemoryCache();
const link = new HttpLink({
    uri: 'http://localhost:4000/'
})

const client = new ApolloClient({
    cache,
    link
})

export const DB1App = () => {
    return (<ApolloProvider client={client}>
        <DB1 />
    </ApolloProvider>)
}

export const DB1 = () => {
    const { data, loading, error } = useQuery(GET_SUPPLIERS);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    return (
        <>
            <h1>Database 1 - Suppliers</h1>
            <div className="container">
                {data &&
                    data.Suppliers &&
                    data.Suppliers.nodes.map((supplier, index) => supplierView({ supplier })

                    )}
            </div>
        </>
    );
}