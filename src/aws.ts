import { S3 } from "aws-sdk";
import fs from "fs"

const s3 = new S3({
    accessKeyId : process.env.AWS_ACCESSKEYID,
    secretAccessKey : process.env.AWS_SECRETACCESSKEY,
    endpoint : process.env.AWS_ENDPOINT
})

export const uploadFile = async (fileName : string, localFilePath : string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket:"vercel",
        Key: fileName,
    }).promise();
    console.log(response);
    
}