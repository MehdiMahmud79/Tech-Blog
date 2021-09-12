const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const helpers = require("./utils/helpers");

const app = express();
const PORT = process.env.PORT || 3001;
app.set("port", PORT);
// Set up Handlebars.js engine
// const hbs = exphbs.create({});
// Inform Express.js on which template engine to use
app.set("views", path.join(__dirname, "public", "hbsTamplate"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
const sess = {
  name: "session",
  secret: "it is my blog keep the secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
});