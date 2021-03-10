import React from 'react';

const UserContext = React.createContext({
  userName: "",
  isLogedIn: false,
  userId: null,
  userIcon: null
});

export default UserContext;
