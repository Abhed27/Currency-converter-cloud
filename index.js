import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.static('public'));

app.get("/convert", async (req,res)=>{

    const {from,to,amount} = req.query;

    if(!from || !to || !amount){
        return res.status(400).json({error:"missing params"});
    }

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

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});
