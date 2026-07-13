import { error } from "console";
import mongoose  from "mongoose";
import { cache } from "react";
const MONGODB_URI = process.env.MONGODB_URI!
if(!MONGODB_URI){
    throw new Error("Please define mongodb uri in environment variables")
}

let cached =global.mongoose

if(!cached){
    cached = global.mongoose = {conn:null,promise:null}
}

export async function  connectToDatabase() {
    if(cached.conn){
        return cached.conn
    }

    if(!cached.promise){
        mongoose.connect(MONGODB_URI)
        .then(()=> mongoose.connection)
    }
    try {
        cached.conn = await cached.promise

    }catch (error){ 
        cached.promise = null
        throw error
    }
    return cached.conn
}