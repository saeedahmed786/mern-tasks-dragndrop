import { BrowserRouter, Link, Route, Switch } from "react-router-dom"
import { Login } from "./pages/Auth/Login";
import { Signup } from "./pages/Auth/Signup";
import Home from "./pages/Home/Home";
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { isAuthenticated, logout } from "./components/Auth/auth";

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql', // Replace with your GraphQL server URL
  cache: new InMemoryCache(),
});

function App() { 
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <BrowserRouter>
          <div className="flex justify-between items-center bg-[#0000003d] text-white p-4">
            <Link to="/" className="text-[28px] font-bold text-white">
              To Do App
            </Link>
            <div className="text-[17px]">
              {
                isAuthenticated() ?
                  <div className="flex gap-4 items-center">
                    <div>{isAuthenticated().fullName}</div>
                    <a href="/login" className="text-white" onClick={() => logout()}>Logout</a>
                  </div>
                  :
                  <div>
                    <Link to="/login" className="text-white">Login</Link>
                  </div>
              }
            </div>
          </div>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/" component={Home} />
          </Switch>
        </BrowserRouter>
      </div>
    </ApolloProvider>
  );
}

export default App;
