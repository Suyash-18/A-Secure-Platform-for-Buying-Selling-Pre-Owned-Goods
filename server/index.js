import express from "express";
import cors from "cors";


const app = express();
const port = process.env.PORT || 8080; // Use environment variable or 8080

const corsOptions = {
    origin: ["http://localhost:5173"], // Replace with your frontend URL
};
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors(corsOptions));



app.get("/api", async (req, res) => {
    try {

        const result = await chat.sendMessageStream("I want to analyze a my Personality .Please provide me with a series of questions,only one by one, in an MCQ format. After I answer all the questions, please provide a concise summary of the my Personality based on my responses Do not provide any additional instructions or explanations.");

        let fullResponse = ""; // Accumulate the response

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullResponse += chunkText; // Add to accumulated response
        }
        console.log("get")

        chat.params.history.push({ role: "user", parts: [{ text: 'Hey ask me 10 questions and give me summary on a persons behavior just ask me these questions one by one and in mcq format ' }]}, { role: "model", parts: [{ text: fullResponse }] }); // Update history
        res.json({ response: marked(fullResponse) }); // Send the full response as JSON

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "An error occurred." }); // Send error response
    }
});
app.post("/api" , async (req,res) => {
  const {message, history} = req.body
  chat.params.history.push({ role: "user", parts: [{ text: message }] }); // Update history
  try{
  const result = await chat.sendMessageStream(message);
  let fullResponse = ""; // Accumulate the response

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullResponse += chunkText; // Add to accumulated response
        }


        chat.params.history.push( { role: "model", parts: [{ text: fullResponse }] });
        res.json({ response: marked(fullResponse) }); // Send the full response as JSON
        // console.log(chat.params.history);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "An error occurred." }); // Send error response
    }
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    // console.log(chat.params.history)
});








