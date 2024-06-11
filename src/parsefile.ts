
export const parseFile = (filepath : string) => {
    let s = "";
    for(let i=0;i<filepath.length;i++){
        if(filepath[i] === '\\'){
            s += '/'
        } else {
            s += filepath[i]
        }
    }
    return s;
}