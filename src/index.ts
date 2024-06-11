import { createClient, commandOptions } from "redis";
import { parseFile } from "./parsefile";
import { getUrl } from "./geturl";
import simpleGit from "simple-git"
import path from "path"
import { getAllFiles } from "./getAllFiles";
import { updatestatus } from "./updatestatus";
import { uploadFile } from "./aws";
const subscriber = createClient()
subscriber.connect()
const publisher = createClient()
publisher.connect()

async function main () {
    while(1){
        const res = await subscriber.brPop(
            commandOptions({ isolated : true }),
            "redeploy-queue",
            0
            );
            // @ts-ignore
            const id = res.element
            console.log(id);
            
            publisher.hSet("status", id, "uploading...")
            const repoUrl = await getUrl(id) as string
            await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
            console.log('hi');
            
            const files = getAllFiles(path.join(__dirname, `output/${id}`));

            const allPromises = files.map(async (file) => {
                await uploadFile(parseFile(file).slice(__dirname.length + 1), file)
            })

            await Promise.all(allPromises)

            //update status
            await updatestatus(id)

            publisher.lPush("build-queue", id)
            publisher.hSet("status", id, "uploaded...")
    }
}

main()