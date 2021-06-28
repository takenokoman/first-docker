module.exports = {
  "development": {
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.DB_HOST
  },
  "test": {
    "user": "root",
    "password": "root",
    "database": "first_docker",
    "host": "mysql"
  },
  "production": {
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": process.env.DB_HOST
  }
};
