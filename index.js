import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/convert", async (req,res)=>{

    const {from,to,amount} = req.query;

    try{
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
        const data = await response.json();

        const rate = data.rates[to];
        const result = Number(amount) * rate;

        res.json({ result });

    }catch(err){
        console.log(err);
        res.status(500).json({error:"conversion failed"});
    }
});

app.listen(3000,()=>{
    console.log("Server running on port 3000");
});
