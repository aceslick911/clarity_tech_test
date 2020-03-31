const { request } = require('graphql-request')

const fetchDB1Data = async () => {
    const endpoint = 'http://localhost:4000/'

    const query = /* GraphQL */`
    {
        Suppliers(first: 1000) {
        nodes {
            name,
            messages_sent,
            messages_recv,
            workorders(first:100){
                nodes{
                    date_due,
                    date_completed,
                    priority
                }
            },
            
        }
        },
    }
    `

    const data = await request(endpoint, query)
    return data.Suppliers.nodes;

}

const filterToWebRequest = async (suppliers) => {
    return suppliers.map(supplier => {
        return {
            name: supplier.name,
            rating: supplier.rating
        }
    });
}


module.exports = {
    fetchDB1Data,
    filterToWebRequest,
}