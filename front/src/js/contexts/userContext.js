import React from 'react';

const UserContext = React.createContext({
  userName: "",
  isLogedIn: false,
  userId: null
});

export default UserContext;
