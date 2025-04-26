require("dotenv").config();


const express = require("express");
const app = express();
const axios = require("axios");
const Retell = require("retell-sdk");

const api_key_retellai = process.env.RETEELAI_API_KEY;
const agent_id_retellai = process.env.RETEELAI_AGENT_ID;

const client  = new Retell({
    apiKey:api_key_retellai,
})


async function startCall() {
    try {
      const response = await client.call.createWebCall({
        agent_id: agent_id_retellai,
        retell_llm_dynamic_variables: {
          customer_name: 'Cimo'
        }
    });
  
    console.log('Web call created:', response);
    } 

    catch (error) {
      console.error('Error creating call:', error); 
    }
}
 


startCall();






app.use(express.json());

app.post("/create-agent",async(req,res)=>{

    console.log(req.body);
    
    const { provider , name, description, other_param} = req.body;

    if(!provider || !name || !description || !other_param){
        return res.status(400).json({error:"Missing required fields"});
    }

    try{
        let response;

        if(provider === 'vapi'){
            response = await axios.post("https://api.vapi.ai/assistants/create",{
                name,
                description,
                some_param:other_param,
            });
        }
        else if(provider === 'retell'){
            response = {
                data:{
                    agent_id:agent_id_retellai,
                    name,
                    description,
                    other_param,
                }
            }
        }
        else{
            return res.status(400).json({error:"Invalid data provided"});
        }
        
        res.json({
            status:"success",
            provider,
            data:response.data,
        });
    }

    catch(e){
        console.log(e.message);
        res.status(500).json({
            status:"error",
            message:"errror in creating the agent ..",
            error:e.response.data,
        })
    }
});




app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});