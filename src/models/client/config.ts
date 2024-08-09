// this file is used to connect our client to appwrite 
import env from "@/env";
import { Client, Account ,Avatars , Databases ,Storage } from "appwrite";

const client = new Client()
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId);                 // Your project ID

const account = new Account(client);
const databases=new Databases(client);
const avatars= new Avatars(client);
const storage= new Storage(client);
export {client  , account , databases , avatars , storage}

// const promise = account.updatePrefs({darkTheme: true, language: 'en'});

// promise.then(function (response) {
//     console.log(response); // Success
// }, function (error) {
//     console.log(error); // Failure
// });
