// require the express module
import express from "express"; // require the cors module
import cors from "cors";
import authroutes from "./routes/authroutes";
import matchroutes from "./routes/matchroutes";
import helmet from "helmet";
// creates an instance of an Express server
const app = express();
// enable Cross Origin Resource Sharing so this API can be used from web-apps on other domains
app.use(cors());
app.use(helmet());
// allow POST and PUT requests to use JSON bodies
app.use(express.json()); // define the port
app.use("/", authroutes);
app.use("/", matchroutes);

const port = 3000;
// run the server
app.listen(port, () => console.log(`Listening on port: ${port}.`));

module.exports = app;
