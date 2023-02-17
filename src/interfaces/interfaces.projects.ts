import { QueryResult } from "pg"

interface IProjectRequest {
    name: string,
    description: string,
    estimatedTime: string, 
    repository: string, 
    startDate: Date,
    endDate?: Date,
    developerId: number
}

interface Iproject extends IProjectRequest {
    id: number
}

interface IprojectDeveloper extends Iproject  {
    name: string
    email: string
}

type ProjectResult = QueryResult<Iproject>
type ProjectDeveloperResult = QueryResult<IprojectDeveloper>

interface IProjectTechnologiesRequest { 
    name: string
    addedIn: Date
    
}
interface IProjectTechnologies extends IProjectTechnologiesRequest{
    id: number,
    projectID: number, 
    technologyID: number,

}

type IProjectTechnologiesResult = QueryResult<IProjectTechnologies >
export{
    IProjectRequest,
    Iproject,
    ProjectResult,
    ProjectDeveloperResult, 
    IProjectTechnologiesResult, 
    IProjectTechnologiesRequest

}