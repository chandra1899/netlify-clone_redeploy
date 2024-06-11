import fs from "fs"
import path from "path"

export const getAllFiles = (folderpath : string) => {
    let response : string[] = []
    const allFilesAndFolders = fs.readdirSync(folderpath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderpath, file);
        if(fs.statSync(fullFilePath).isDirectory()){
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath)
        }
    })
    return response;
}