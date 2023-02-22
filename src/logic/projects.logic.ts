import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format, { string } from "pg-format";
import {client} from "../database"
import { IProjectRequest, IProjectTechnologiesRequest, IProjectTechnologiesResult, ProjectDeveloperResult, ProjectResult } from "../interfaces/interfaces.projects";




const createProject = async ( req: Request, res: Response): Promise<Response> => {
  try{ 
  const projectData: IProjectRequest = req.body
  const requiredKeys = ["name", "description", "estimatedTime", "repository", "startDate", "endDate","developerId"]
  const developerInfoKeys = Object.keys(projectData)
  if(developerInfoKeys.length > 7 || developerInfoKeys.length === 0 ){
    throw new Error (`required keys are : ${requiredKeys} and you can also send endDate`)
  }



  const queryString: string = format(
    `
    INSERT INTO 
      projects(%I) 
    VALUES (%L)
     RETURNING *;
    `,
    Object.keys(projectData),
    Object.values(projectData)
  )

  const queryResult: ProjectResult =  await client.query(queryString)
  

  return res.status(201).json(queryResult.rows[0])
  } catch(error){

    if(error instanceof Error){
      if(error.message ==  "insert or update on table \"projects\" violates foreign key constraint \"projects_developerId_fkey\""){
        return res.status(404).json({message: "developer ID not found" })
      }
        return res.status(400).json({
            message: error.message
        })
    }
    return res.status(500).json({
        message: 'internal server error'
    })
}

};

const readAllProjects = async (req: Request, res: Response): Promise<Response> =>{

    const queryString:string= `
    
    SELECT 
    p.*,
    pt."addedIn",
    pt."technologyId",
    tec."name" "technologyName"
    FROM
    projects p 
    LEFT JOIN
    projects_techonologies pt ON pt."projectID" = p.id
    LEFT  JOIN
    technologies tec ON tec.id = pt."technologyId";

  
    `
   const queryResult: ProjectDeveloperResult = await client.query(queryString)
   
    return res.json(queryResult.rows)
}

const readProjectById = async (req: Request, res: Response): Promise<Response> =>{

  const projectId: number = parseInt(req.params.id)

  const queryString:string= `
  
  SELECT 
  p.*,
  dev."name" "devName",
  dev.email,
  pt."addedIn",
  pt."technologyId",
  tec."name" "technologyName" 
  FROM projects p 
  JOIN 
  developers dev ON p."developerId" = dev.id
  LEFT JOIN
  projects_techonologies pt ON pt."projectID" = p.id
  LEFT  JOIN
  technologies tec ON tec.id = pt."technologyId"

  WHERE p.id = $1;   
  
  `
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [projectId],
  };

 const queryResult: ProjectDeveloperResult = await client.query(queryConfig)
 
  return res.json(queryResult.rows[0])
}

const deleteProjecet = async (req: Request, res: Response): Promise<Response> => {
  const projectId: number = parseInt(req.params.id);

  const queryString: string = `
     DELETE FROM projects WHERE id = $1;
 `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [projectId],
  };

  const queryResult = await client.query(queryConfig);
  return res.status(204).send();
};

const updateProject = async (req: Request, res: Response): Promise<Response> => {

  try{ 
  const projectId: number = parseInt(req.params.id);
  const projectReqValues = Object.values(req.body);
  const projectReqKeys = Object.keys(req.body);
  const requiredKeys = ["name", "description", "estimatedTime", "repository", "startDate", "endDate","developerId"]

  if(projectReqKeys.length > 7 || projectReqKeys.length === 0 ){
    throw new Error (` required keys are : ${requiredKeys} and you can also send endDate`)
  }


  const queryString: string = format(
    `
    UPDATE projects SET(%I) = ROW(%L) WHERE id = $1 RETURNING * ;
    `,
    projectReqKeys,
    projectReqValues
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [projectId],
  };

  const queryResult = await client.query(queryConfig);
  return res.status(200).json(queryResult.rows[0]);
  } 
  catch (error) {
    if (error instanceof Error) {
      return res.status(409).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: "internal server error",
    });
  }

};

const createTechToPoject = async (req: Request, res: Response): Promise<Response> =>{
    const projectId: number = parseInt(req.params.id)
    const projectsTechnologiesData: IProjectTechnologiesRequest = req.body



    let queryString = `
    SELECT * FROM TECHNOLOGIES WHERE NAME = $1;
    `
    let queryConfig = {
      text: queryString, 
      values: [projectsTechnologiesData.name]
    }

    const queryResultTechnologies = await client.query(queryConfig)
    if(queryResultTechnologies.rowCount === 0){
      return res.status(404).json({message: "technologie not found"})
    }

    queryString = `
    INSERT INTO projects_techonologies ("projectID", "technologyId", "addedIn" ) VALUES ($1,$2, NOW()) RETURNING *;
    `
    const technologyId = queryResultTechnologies.rows[0].id

    queryConfig ={
      text: queryString,
      values:[projectId, technologyId]
    }
   
    const queryResultProjectsTechnologies: IProjectTechnologiesResult = await client.query(queryConfig)

    return res.status(201).json(queryResultProjectsTechnologies.rows[0])
}

const deleteTechFromPoject = async (req: Request, res: Response): Promise<Response> =>{
  const projectId: number = parseInt(req.params.id)
  const projectTechnologyName: string = req.params.name

  let queryString = `
  SELECT * FROM TECHNOLOGIES WHERE NAME = $1;
  `
  let queryConfig = {
    text: queryString, 
    values: [projectTechnologyName]
  }

  const queryResultTechnologies = await client.query(queryConfig)
  if(queryResultTechnologies.rowCount === 0){
    return res.status(404).json({message: "technologie not found"})
  }

   queryString = `
  DELETE FROM 
	  projects_techonologies  
  WHERE
    "projectId" = $1 AND "technologyId"  = $2;
  `;

  const technologyId = queryResultTechnologies.rows[0].id
  const QueryConfig: QueryConfig = {
    text: queryString, 
    values: [projectId, technologyId]
  };
  
 
  const queryResultProjectsTechnologies: IProjectTechnologiesResult = await client.query(queryConfig)

  return res.status(204).send()
}


export 
{createProject,
readAllProjects,
updateProject,
createTechToPoject,
readProjectById,
deleteProjecet,
deleteTechFromPoject

}