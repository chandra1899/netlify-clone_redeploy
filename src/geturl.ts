
export const getUrl =async (id : string) => {
    try {
        let res = await fetch(`${process.env.NEXTJS_BACKEND_URL}/api/geturl`,{
            method:'POST',
            headers:{
              'Access-Control-Allow-Origin': '*',
              Accept:"application/json",
              "Content-Type":"application/json"
            },
            credentials:'include',
            body:JSON.stringify({
                deploymentId : id
            })
          })
          if(res.status === 200){
            let data = await res.json()
            console.log(data);
            return data.repoUrl            
          }
    } catch (error) {
        console.log("error", error);
        
    }
}