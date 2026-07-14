import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { request } from "http";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const {email,password} = await request.json()
        if(!email){
            return NextResponse.json(
                {error:"email and password are required"},
                {status:400}
            )
        }
        await connectToDatabase();
        const existingUser = await User.findOne({email})
        if(existingUser){
             return NextResponse.json(
                {error:"User already registered"},
                {status:400}
            )
        }
        await User.create({
            email,password
        })
         return NextResponse.json(
                {message:"User registered successfully"},
                {status:200}
            )
    } catch (error) {
        console.error("Registeration error")
         return NextResponse.json(
                {error:"Registration failed"},
                {status:400}
            )
    }
}