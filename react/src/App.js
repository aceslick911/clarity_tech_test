import React from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components'

import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";

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
    	}
    }
  },
}
`

const workOrderView = ({ workorders }) => {
  return (<div>
    <h2>Work orders:</h2>
    <ul>
      {workorders && workorders.nodes.map((workorder) => (
        <li key={workorder["_id"]} className="workorders">
          <div>{workorder.description}</div>
          <div>{workorder.date_due}</div>
          <div>{workorder.date_completed}</div>
          <div>{workorder.priority}</div>
          <div>{workorder.report_provided}</div>
        </li>
      ))}
    </ul>
  </div>)
}

const styledSupplierView = styled.div`
  display:inline-block;
  height:200;
  width:200;
  border:1px solid black:
  margin:5px;
`

const supplierView = ({ supplier }) => {
  return (
    <styledSupplierView key={supplier["_id"]} className="supplier">
      <label>Name: </label><div>{supplier.name}</div>
      <div>{supplier.number}</div>
      <div>{supplier.messages_sent}</div>
      <div>{supplier.messages_recv}</div>
      {workOrderView({ workorders: supplier.workoders })}
    </styledSupplierView>
  )
}

const App = () => {
  const { data, loading, error } = useQuery(GET_SUPPLIERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <>
      <h1>Suppliers</h1>


      <div className="container">
        {data &&
          data.Suppliers &&
          data.Suppliers.nodes.map((supplier, index) => supplierView({ supplier })

          )}
      </div>
    </>
  );
}

export default App;
