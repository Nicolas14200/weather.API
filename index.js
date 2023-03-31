require("dotenv").config();
const express    = require('express');
const app        = express();
const axios      = require("axios");
const mapUsers   = new Map();
const mapWeather = new Map();
const port       = 3000 ;
///////////   FONCTION     ////////////////////////
function fillUrlWeather (api_key, town){
    const urlWeather = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${town}&aqi=no`;
    return urlWeather ;
}
//////////////////////////////////////////////////
app.use(express.json());
//////////////////////////////////////////////////
app.post('/signup', (req,res)=>{
    try{
        if (!mapUsers.has(req.body.email)){
            mapUsers.set(req.body.email,[req.body.email, req.body.password]);
            console.log("enregistré !!")
            return res.status(200).send(mapUsers.get(req.body.email));
    }
    return res.status(418).send("already exists");

    }catch{
        return res.status(404).send("ERREUR"); 
    }
})
///////////////////////////////////////////////////
app.post('/signin', (req,res)=>{
    try{
        if (req.body.password === mapUsers.get(req.body.email)[1]){
            return res.status(200).send(`Salut ${req.body.email}`);
        }
        return res.status(404).send("password incorect"); 
    }catch{
        return res.status(404).send("ERREUR"); 
    }  
})
////////////////////////////////////////////////////
app.use((req, res, next)=>{
    if(req.get("isConnected") === "false"){
        return res.status(401).send("no connect");
    };
    return next();
})
////////////////////////////////////////////////////
app.post('/weather',async function (req, res){
    try{
        let town = req.body.town;
        if (!mapWeather.has(town)){
            const urlWeather = fillUrlWeather(process.env.WEATHER_API_KEY,town);
            
            const rep = await axios.get(urlWeather);
            mapWeather.set(town, rep.data.current.temp_c);
            
            const sentence = `a ${town} il fait : ${mapWeather.get(town)} °`;
            return res.status(200).send(sentence);

        }
        const sentence = `a ${town} il fait : ${mapWeather.get(town)} °`;
        return res.status(200).send(sentence);

    }catch{
        return res.status(404).send("ERREUR");
    }
});

app.listen(port,()=>console.log("listen on port 3000"));