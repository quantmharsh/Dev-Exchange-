// This file we are using to make our environment variables typesafe. by using string
const  env={
    appwrite:{
        endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL),
        projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID  
        ),
        apikey: String(process.env.APPWRITE_API_KEY),
    }
}
export default env