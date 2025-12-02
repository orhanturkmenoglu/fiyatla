import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redisClient = createClient({
  url: REDIS_URL,
});


redisClient.on("error",(err)=>{
    console.log("Redis Client Error ",err);
})


await redisClient.connect();


export default redisClient;