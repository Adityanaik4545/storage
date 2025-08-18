'use server'

import { createAdminClient } from "../appwrite";
import {InputFile} from "node-appwrite/file"
import { appwriteconfig } from "../appwrite/config";
import { ID } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringyfy } from "../utils";
import { error } from "console";
import { revalidatePath } from "next/cache";

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