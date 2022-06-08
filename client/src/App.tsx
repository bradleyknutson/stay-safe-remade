import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthPage } from "./components/AuthPage/AuthPage";

import { setContext } from "@apollo/client/link/context";
import { Header } from "./components/Header/Header";
import { SafeActions } from "./components/SafeActions/SafeActions";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Header>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SafeActions />} />
            <Route path="/signup" element={<AuthPage variant="signup" />} />
            <Route path="/login" element={<AuthPage variant="login" />} />
          </Routes>
        </BrowserRouter>
      </Header>
    </ApolloProvider>
  );
}

export default App;
