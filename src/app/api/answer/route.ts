"use server";

import { answerCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request: NextRequest) {
	try {
		// getting fields from request that is comiong
		const { answer, authorId, questionId } = await request.json();
		//creating document
		const response = await databases.createDocument(
			db,
			answerCollection,
			ID.unique(),
			{
				content: answer,
				authorId,
				questionId,
			}
		);
		// now after creating answer . we need to update  user  reputation
		//get prefs from db
		const prefs = await users.getPrefs<UserPrefs>(authorId);
		//update
		await users.updatePrefs(authorId, {
			reputation: Number(prefs.reputation) + 1,
		});
		return NextResponse.json(response, {
			status: 201,
		});
	} catch (error: any) {
		return NextResponse.json(
			{
				message: error?.message || "Error while   submiting answer",
			},
			{
				status: error?.status || 500,
			}
		);
	}
}   
//to delete answers
export  async function DELETE(request: NextRequest){
    try {
         const {answerId}= await request.json()
         //find answer with this id
         const answer = await databases.getDocument(db ,answerCollection ,answerId );
         //now delete this answer
         const response = await databases.deleteDocument(db , answerCollection , answerId);
        //  Now reduce the  reputation of user whose answer is deleted
        const prefs= await  users.getPrefs<UserPrefs>(answer.authorId)
        await users.updatePrefs(answer.authorId , {
            reputation : Number(prefs.reputation)-1
        })
        return NextResponse.json({
            data:response 
        },
    {
         status:200
    })

        
    } catch (error : any) {
        return NextResponse.json(
			{
				message: error?.message || "Error while   submiting answer",
			},
			{
				status: error?.status || 500,
			}
		);
        
    }

}
