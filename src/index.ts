import { createClient, commandOptions } from "redis";
import { parseFile } from "./parsefile";
import Redis from 'ioredis'
import { getUrl } from "./geturl";
import simpleGit from "simple-git"
import path from "path"
import { getAllFiles } from "./getAllFiles";
import { updatestatus } from "./updatestatus";
import { uploadFile } from "./aws";
import { deleteFolder } from "./deleteFolder";
const publisher = new Redis({
    host : process.env.REDIS_HOST as string,
    port : parseInt(process.env.REDIS_PORT as string) as number,
    username : process.env.REDIS_USERNAME as string,
    password : process.env.REDIS_PASSWORD as string
})

const subscriber = new Redis({
    host : process.env.REDIS_HOST as string,
    port : parseInt(process.env.REDIS_PORT as string) as number,
    username : process.env.REDIS_USERNAME as string,
    password : process.env.REDIS_PASSWORD as string
})

async function main () {
    while(1){
        const res = await subscriber.brpop('redeploy-queue', 0);
        // console.log(res);
            // @ts-ignore
            const id = res[1]
            // console.log(id);
            await updatestatus(id, "uploading")
            await publisher.hset("status", id, "uploading...")
            const repoUrl = await getUrl(id) as string
            await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
            // console.log('hi');
            
            const files = getAllFiles(path.join(__dirname, `output/${id}`));

            const allPromises = files.map(async (file) => {
                await uploadFile(parseFile(file).slice(__dirname.length + 1), file)
            })

            await Promise.all(allPromises)

            //update status
            await updatestatus(id, "uploaded")
            console.log("deleting files");
            
            await deleteFolder(path.join(__dirname, `output/${id}`))
            
            console.log("deleted all files");
            await publisher.lpush("build-queue", id)
            await publisher.hset("status", id, "uploaded...")
    }
}

main()