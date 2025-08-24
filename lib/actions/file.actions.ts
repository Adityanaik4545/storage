'use server'

import { createAdminClient } from "../appwrite";
import {InputFile} from "node-appwrite/file"
import { appwriteconfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringyfy } from "../utils";
import { error, log } from "console";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./users.actions";

const handleError=(error:unknown,message:string)=>{
    console.log(error,message);
    throw error;
    
}

export const uploadFile = async({file, ownerId, accountId, path}:UploadFileProps) =>{
    const {databases, storage} = await createAdminClient();

    try {
        const inputFile = InputFile.fromBuffer(file, file.name);
        const bucketFile = await storage.createFile(
            appwriteconfig.bucketId,
            ID.unique(),
            inputFile
        );
        const fileDocument = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            size: bucketFile.sizeOriginal,
            owner: ownerId,
            accountId,
            users:[],
            bucketFileId: bucketFile.$id,
        }
        const newFile = await databases.createDocument(
            appwriteconfig.databaseId,
            appwriteconfig.fileCollectionId,
            ID.unique(),
            fileDocument,
        )
        .catch(async(error:unknown)=>{
            await storage.deleteFile(appwriteconfig.bucketId, bucketFile.$id);
            handleError(error, "failed to create file document");
        })
        revalidatePath(path);
        return parseStringyfy(newFile)
    } catch (error) {
        handleError(error,"failed to upload file")
    }
} 
const createQueries = (currentUser: Models.Document, types: string[])=>{
    const queries = [
        Query.or([
            Query.equal("owner", [currentUser.$id]),
            Query.contains("users", [currentUser.email]),
        ]),
    ];
    if(types.length > 0) queries.push(Query.equal("type", types))
    return queries
};
export const getFiles = async({types=[]}:GetFilesProps) =>{
    const {databases} = await createAdminClient();


    try {
        const currentUser = await getCurrentUser();
        if(!currentUser) throw new Error("User not found !");
        
        const queries = createQueries(currentUser,types);
        
        const files = await databases.listDocuments(
            appwriteconfig.databaseId,
            appwriteconfig.fileCollectionId,
            queries,
        )
        return parseStringyfy(files)
    } catch (error) {
        handleError(error, "failed to get files!")
    }
}

export const renameFile = async({fileId, name, extension, path}:RenameFileProps) =>{

    const {databases} = await createAdminClient();

try {
        const newName = `${name}.${extension}`;
        const updatedFile = await databases.updateDocument(
            appwriteconfig.databaseId,
            appwriteconfig.fileCollectionId,
            fileId,
            {
                name: newName
            },
        );
        revalidatePath(path);
        return parseStringyfy(updatedFile)
        
} catch (error) {
    handleError(error, "failed to rename file!")
}
}
export const updateFileUsers = async({fileId, emails, path}:UpdateFileUsersProps) =>{

    const {databases} = await createAdminClient();

try {
        const updatedFile = await databases.updateDocument(
            appwriteconfig.databaseId,
            appwriteconfig.fileCollectionId,
            fileId,
            {
                users: emails
            },
        );
        revalidatePath(path);
        return parseStringyfy(updatedFile)
        
} catch (error) {
    handleError(error, "failed to update file user!")
}
}
export const deleteFile = async({fileId, bucketFileId, path}:DeleteFileProps) =>{

    const {databases, storage} = await createAdminClient();

try {
        const deleteFile = await databases.deleteDocument(
            appwriteconfig.databaseId,
            appwriteconfig.fileCollectionId,
            fileId,
        );
        if(deleteFile){
            await storage.deleteFile(
                appwriteconfig.bucketId,
                bucketFileId
            )
        }
        revalidatePath(path);
        return parseStringyfy({status:'success'})
        
} catch (error) {
    handleError(error, "failed to update file user!")
}
}