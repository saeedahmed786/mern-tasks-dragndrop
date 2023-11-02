import { gql } from '@apollo/client';

export const GET_TODOS = gql`
  query {
    todos {
      id
      title
      category
      date
      comments
      members
    }
  }
`;

export const GET_USER = gql`
  query {
    getUser {
      id
      email
      fullName
      members
    }
  }
`;

export const ADD_TODO = gql`
  mutation AddTodo($title: String!, $category: String!, $date: String!) {
    addTodo(title: $title, category: $category, date: $date) {
        id
        title
        category
        date
        comments
    }
  }
`;

export const UPDATE_TODO = gql`
mutation UpdateTodo(
  $id: ID!
  $category: String!
  $title: String!
  $date: String!
) {
  updateTodo(
    id: $id
    category: $category
    title: $title
    date: $date
  ) {
    id
      title
      category
      date
      comments
      members
  }
}
`;

export const DELETE_TODO = gql`
mutation DeleteTodo(
  $id: ID!
) {
  deleteTodo(
    id: $id
  ) {
    id
      title
      category
      date
      comments
      members
  }
}
`;

export const UPDATE_TODO_CATEGORY = gql`
mutation updateTodoCategory(
  $id: ID!
  $category: String!
) {
    updateTodoCategory(
    id: $id
    category: $category
  ) {
    id
      title
      category
      date
      comments
      members
  }
}
`;

export const UPDATE_TODO_COMMENTS = gql`
  mutation UpdateTodoComments($id: ID!, $comments: [String]) {
    updateTodoComments(id: $id, comments: $comments) {
      id
      title
      category
      date
      comments
      members
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation SignupUser($fullName: String!, $email: String!, $password: String!) {
    signUp(fullName: $fullName, email: $email, password: $password) {
      id
      fullName
      email
      members
      token
    }
  }
`;

export const ADD_MEMBER = gql`
  mutation addMember($members: [String]!) {
    signUp(members: $members) {
      id
      fullName
      email
      members
    }
  }
`;

export const SEARCH_MEMBER = gql`
  query searchMember($member: String!) {
    searchMember(member: $member) {
      id
      fullName
      email
    }
  }
`;

export const UPDATE_TODO_MEMBERS = gql`
mutation UpdateTodosMembers($userId: ID!, $member: String!) {
  updateTodosMembers(userId: $userId, member: $member)
}
`

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        status
        message
        user {
          id
          fullName
          email
          members
        }
    }
  }
`; 
