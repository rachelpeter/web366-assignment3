require("dotenv").config();
const Sequelize = require("sequelize");

// set up sequelize to point to our postgres database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true, // This will help you connect to the database with SSL
      rejectUnauthorized: false, // Allows self-signed certificates
    },
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("PostgresSQL Connected ");
  })
  .catch((err) => {
    console.log("Error:", err);
  });

module.exports = sequelize;
