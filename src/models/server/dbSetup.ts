// Setting up our database 
import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import { databases } from "./config";
import createQustionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
export async function  getOrCreateDB(){
    try {
        await databases.get(db);
        console.log("Database connection successfull")
    } catch (error) {
        try {
            await databases.create(db ,db);
            console.log("Database created")
            // creating collections
            await Promise.all([
                createQustionCollection() ,
                createAnswerCollection(),
                createCommentCollection(),
                createVoteCollection()

            ])
            console.log("Collections created")
                
        } catch (error) {
            console.log("Error creating databases or collection", error)
            
        }
        
    }
    return databases

}
 


