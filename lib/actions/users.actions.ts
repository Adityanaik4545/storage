"use server"

import { ID, Query } from "node-appwrite"
import { createAdminClient } from "../appwrite"
import { appwriteconfig } from "../appwrite/config"
import { parseStringyfy } from "../utils"

const getUserByEmail = async(email:string) =>{
    const {databases}= await createAdminClient()
    const result = await databases.listDocuments(appwriteconfig.databaseId, appwriteconfig.userCollectionId, [Query.equal("email",[email])] )

    return result.total > 0 ? result.documents[0] : null
}
const handleError=(error:unknown,message:string)=>{
    console.log(error,message);
    throw error;
    
}

const sendEmailOTP=async({email}:{email:string})=>{
     const {account} = await createAdminClient()

     try {
        const session = await account.createEmailToken(ID.unique(),email);
        return session.userId
     } catch (error) {
        handleError(error,"Failed to send email OTP")
     }
}

 export const createAccount = async({fullName, email}:{fullName:string,email:string})=>{
const existingUser= await getUserByEmail(email)
const accountId= await sendEmailOTP({email})
if(!accountId) throw new Error("Failed to send OTP")

    if (!existingUser) {
        const {databases} = await createAdminClient();

        await databases.createDocument(
            appwriteconfig.databaseId,
            appwriteconfig.userCollectionId,
            ID.unique(),
            {
                fullName,
                email,
                avatar:"https://cdn-icons-png.flaticon.com/512/6596/6596121.png",
                accountId,
            }
        )
    }
    return parseStringyfy({accountId})
}