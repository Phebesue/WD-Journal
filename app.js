require("dotenv").config()
let express = require("express");
let app = express();
const sequelize = require("./db");

let journal = require("./controllers/journalcontroller");
let user = require("./controllers/usercontroller");


sequelize.sync();
// sequelize.sync({force: true})
app.use(require("./middleware/headers"));
app.use(express.json());


// -----  Exposed Route  -----
app.use("/user",user);

// -----  Protected Route  -----
// app.use(require("./middleware/validate-session"));
app.use("/journal",journal);

app.listen(process.env.PORT, () => {console.log(`App is listening on port ${process.env.PORT}`) ;
});

