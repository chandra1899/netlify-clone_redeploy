import { createClient, commandOptions } from "redis";

const subscriber = createClient()
subscriber.connect()
const publisher = createClient()
publisher.connect()

async function main () {
    while(1){
        
    }
}

main()