// Connect our server side code with appwrite
import env from "@/env";
import {Client , Avatars , Users , Storage ,    Databases} from "node-appwrite";

let client = new Client();

client
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId) // Your project ID
    .setKey(env.appwrite.apikey) // Your secret API key
 
const databases=new Databases(client);
const avatars= new Avatars(client);
const storage= new Storage(client);
const users=new Users(client)
export {client   ,users , databases , avatars , storage}