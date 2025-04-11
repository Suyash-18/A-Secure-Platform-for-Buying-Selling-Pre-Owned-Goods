import express from "express";
import cors from "cors";


const app = express();
const port = process.env.PORT || 8080; // Use environment variable or 8080

const corsOptions = {
    origin: ["http://localhost:5173"], // Replace with your frontend URL
};
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors(corsOptions));



app.get("/", async (req, res) => {
        res.json({response: "Hello!!!"});
        console.log("Hello World!!");    
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});








