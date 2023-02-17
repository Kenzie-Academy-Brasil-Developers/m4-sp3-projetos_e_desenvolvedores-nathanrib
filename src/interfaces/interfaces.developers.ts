import { QueryResult } from "pg"

interface IdeveloperRequest {
    name: string, 
    email: string,

}

interface IDeveloper extends IdeveloperRequest{
    id: number
    developerInfoId: number
}

type DeveloperResult = QueryResult<IDeveloper>




interface IdeveloperInfoRequest{
    developerSince: Date
    preferredOS: string
  
}
interface IdeveloperInfo extends IdeveloperInfoRequest{
    id: number
}
type DeveloperInfoResult = QueryResult<IdeveloperInfo>




type DeveloperAndInfos = IDeveloper & IdeveloperInfoRequest

type DeveloperAndInfosResult = QueryResult<DeveloperAndInfos>




export{
    IdeveloperRequest, 
    IDeveloper, 
    DeveloperResult,
    IdeveloperInfoRequest,
    IdeveloperInfo,
    DeveloperInfoResult,
    DeveloperAndInfosResult
}