import React, { useState, useEffect } from 'react';

import gql from "graphql-tag";

const RatingsGuage = ({ rating }) => {
    return (
        <div className="ratings-gauge">
            <div style={{ "width": `${rating / 10 * 100}%` }}></div>
        </div>
    )
}

const supplierView = ({ supplier }) => {
    return (
        <div key={supplier["_id"]} className="supplier">
            <div><label>Name: </label>{supplier.name}</div>
            <div><label>Rating: </label>{supplier.rating} / 10</div>
            <RatingsGuage rating={supplier.rating}></RatingsGuage>
        </div>
    )
}

export const DB2App = () => {
    return (
        <DB2 />
    )
}
const URL = 'http://localhost:3002/'

export const DB2 = () => {
    const [state, setState] = useState({
        data: [],
        loading: true,
        error: null
    })

    const { data, loading, error } = state;

    const refetch = () => {

        setState({ ...state, loading: true })
        fetch(URL).then(async (response) => {
            if (response.ok) {
                let supplierData = await response.json();

                console.log(supplierData);
                setState({ ...state, data: supplierData, loading: false })
            } else {
                setState({ ...state, error: true })
            }
        })
    }

    // Do once
    useEffect(() => {
        refetch();
    }, [])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    const refreshData = () => {
        refetch();
    }

    return (
        <>
            <h1>Database 2 - Supplier Ratings</h1>
            <button onClick={refreshData}>Refresh Data</button>
            <div className="container">
                {

                    data.map((supplier, index) => supplierView({ supplier })

                    )}
            </div>
        </>
    );
}