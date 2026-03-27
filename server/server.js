import app from "./app.js";
import DBConnection from "./DB/db.js";

const port = process.env.PORT || 8080
app.listen(port,()=>{
DBConnection()
    console.log(`Server is runing on port ${port}`)
})