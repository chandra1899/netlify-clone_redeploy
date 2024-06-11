import { S3 } from "aws-sdk";
import fs from "fs"

const s3 = new S3({
    accessKeyId : "a915a83a984ca573f61e6f3eab99daee",
    secretAccessKey : "a87f1c585a44ae708ffdd6a2e390d46f79bc1d041fe07a7cc3e793b4c831035e",
    endpoint : "https://04b74d21ee5c34d7a6a3405431dac7ec.r2.cloudflarestorage.com"
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