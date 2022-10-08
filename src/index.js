const express= require("express");
const app = express();
const userRouter = require("./routes/userRoutes");

app.use(express.json());

app.use("/users", userRouter);

app.listen(4000,()=>{
    console.log("server listning on port");
})