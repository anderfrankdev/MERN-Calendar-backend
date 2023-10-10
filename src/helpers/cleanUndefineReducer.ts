export const cleanUndefinedReducer =(acc:any,[key,value]:[string,any])=>{
    if(value !== undefined) acc[key]=value
    return acc;
}