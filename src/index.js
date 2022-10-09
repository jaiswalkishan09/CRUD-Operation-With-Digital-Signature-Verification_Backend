const express= require("express");
const userAuthRouter = require("./routes/userAuthRoutes");
const app = express();
const dotenv=require("dotenv")
const userRouter = require("./routes/userRoutes");
const cors= require("cors")

dotenv.config({path:__dirname+'/.env'});

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/usersauth",userAuthRouter)

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log("server listning on port no:",PORT);
})