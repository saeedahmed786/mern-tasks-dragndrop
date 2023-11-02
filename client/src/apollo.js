// import ApolloClient from 'apollo-boost';

// const client = new ApolloClient({
//     uri: "http://localhost:8000/graphql", // Replace with your server's URL
// });

// export default client;


import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'http://localhost:8000/graphql',
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token'); // Replace with how you store the token on the client side
    if (token) {
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : '',
            },
        };
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all', // Set to 'all' to include errors in query responses
        },
        query: {
            errorPolicy: 'all',
        },
    },
});


export default client;