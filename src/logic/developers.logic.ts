import { Request, Response } from "express";
import format from "pg-format";
import { DeveloperAndInfosResult, DeveloperInfoResult, DeveloperResult, IDeveloper, IdeveloperInfoRequest, IdeveloperRequest } from "../interfaces/interfaces.developers";
import {client} from "../database"
import { QueryConfig } from "pg";



const createDeveloper = async ( req: Request, res: Response): Promise<Response> => {
  try{ 
  const developerData: IdeveloperRequest = req.body
  const developerKeys = Object.keys(developerData)
  if(developerKeys.length > 2 || developerKeys.length == 0){
    throw new Error (`required keys are name and email`)
  }
  const queryString: string = format(
    `
    INSERT INTO 
      developers(%I) 
    VALUES (%L)
    RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
  )

  const queryResult: DeveloperResult =  await client.query(queryString)
  

  return res.status(201).json(queryResult.rows[0])

} catch(error){
    if(error instanceof Error){
        return res.status(400).json({
            message: error.message
        })
    }
    return res.status(500).json({
        message: 'internal server error'
    })
}

};

const createDeveloperInfo = async ( req: Request, res: Response): Promise<Response> => {
 try { 
const developerId = parseInt(req.params.id)
const developerInfoData: IdeveloperInfoRequest = req.body
const developerInfoKeys = Object.keys(developerInfoData)
if(developerInfoKeys.length > 2 || developerInfoKeys.length === 0){
  throw new Error (`required keys are developerSince and preferredOS`)
}

let queryString = `
SELECT 
* 
FROM 
  developers dev
WHERE dev.id = $1;
`
let queryConfig: QueryConfig = {
  text: queryString,
  values: [developerId]
}

const checkDev =  await client.query(queryConfig)
if(checkDev.rows[0].developerInfoId > 0){
  return res.status(409).json({messsage: "developer already has informantion"})
}

queryString = format(
    `
    INSERT INTO 
      developer_infos(%I) 
    VALUES (%L)
    RETURNING *;
    `,
    Object.keys(developerInfoData),
    Object.values(developerInfoData)
  )

  const queryResult: DeveloperInfoResult =  await client.query(queryString)
 
  
  queryString = ` 
    UPDATE
      developers
    SET
      "developerInfoId" = $1
    WHERE 
      id = $2
    RETURNING *;
  `

   queryConfig  = {
    text: queryString,
    values: [queryResult.rows[0].id, developerId]
  }

  await client.query(queryConfig)

  return res.status(201).json(queryResult.rows[0])

 } catch(error){
  if(error instanceof Error){
    if(error.message.startsWith("invalid input value for enum os: ")){
      return res.status(400).json({message: "Invalid OS option.", "options": [ "Windows", "Linux", "MacOS" ]})
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

const readDeveloperById =async (req:Request, res: Response): Promise<Response> => {

  const developerId: number = parseInt(req.params.id)

  const queryString = `
  SELECT 
	dev.*,
  dein."developerSince",
  dein."preferredOS",
  dein.id "developerInfoId"
FROM 
	developers dev 
LEFT JOIN 
	developer_infos dein ON dev.id = dein.id 
WHERE 
	dev.id = $1;
  `

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [developerId]
  }

  const queryResult: DeveloperAndInfosResult = await client.query(queryConfig)



  return res.json(queryResult.rows[0])
  
}

const readAllDevelopers =async (req:Request, res: Response): Promise<Response> => {


  const queryString = `
  SELECT
  dev.*,
  dein.id "developerInfoId",
  dein."developerSince",
  dein."preferredOS"
  FROM 
    developers dev
  LEFT JOIN 
    developer_infos dein ON dev."developerInfoId" = dein.id;
`

  const queryResult: DeveloperAndInfosResult = await client.query(queryString)


  return res.json(queryResult.rows)
  
}

const readProjectFromDeveloper =async (req:Request, res: Response): Promise<Response> => {

  const developerId: number = parseInt(req.params.id)

  const queryString = `
  
  SELECT 
  p.*,
  dev."name",
  dev.email
  FROM 
  projects p
  JOIN 
  developers dev ON p."developerId" = dev.id
  WHERE dev.id =$1;

  `

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [developerId]
  }

  const queryResult: DeveloperAndInfosResult = await client.query(queryConfig)



  return res.json(queryResult.rows)
  
}

const deleteDeveloper = async (req: Request, res: Response): Promise<Response> => {
  const developerId: number = parseInt(req.params.id);

  const queryString: string = `
     DELETE FROM developers WHERE id = $1;
 `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [developerId],
  };

  const queryResult = await client.query(queryConfig);
  return res.status(204).send();
};

const updateDeveloper = async (req: Request, res: Response): Promise<Response> => {

  try{ 
  const developerId: number = parseInt(req.params.id);
  const developerReqValues = Object.values(req.body);
  const developerReqKeys = Object.keys(req.body);

  if(developerReqKeys.length > 2 ){
    throw new Error (`required keys are name and email`)
  }
  if(developerReqKeys.length === 0 ){
    throw new Error (`At least one of those keys must be send.   [ "name", "email" ]`)
  }
  const queryString: string = format(
    `
    UPDATE developers SET(%I) = ROW(%L) WHERE id = $1 RETURNING * ;
    `,
    developerReqKeys,
    developerReqValues
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [developerId],
  };

  const queryResult = await client.query(queryConfig);
  return res.status(200).json(queryResult.rows[0]);
  } 
  catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: "internal server error",
    });
  }

};

const updateDeveloperInfo = async ( req: Request, res: Response): Promise<Response> => {
  try { 
    const developerId = parseInt(req.params.id)
    const developerInfoData: IdeveloperInfoRequest = req.body
    const developerInfoKeys = Object.keys(developerInfoData)
    if(developerInfoKeys.length > 2 || developerInfoKeys.length === 0){
      throw new Error (`required keys are developerSince and preferredOS`)
    }
    
    
    let queryString =  format(
        `
        INSERT INTO 
          developer_infos(%I) 
        VALUES (%L)
        RETURNING *;
        `,
        Object.keys(developerInfoData),
        Object.values(developerInfoData)
      )
    
      const queryResult: DeveloperInfoResult =  await client.query(queryString)
     
      
      queryString = ` 
        UPDATE
          developers
        SET
          "developerInfoId" = $1
        WHERE 
          id = $2
        RETURNING *;
      `
    
      const queryConfig: QueryConfig  = {
        text: queryString,
        values: [queryResult.rows[0].id, developerId]
      }
    
      await client.query(queryConfig)
    
      return res.status(201).json(queryResult.rows[0])
    
     } catch(error){
      if(error instanceof Error){
        if(error.message.startsWith("invalid input value for enum os: ")){
          return res.status(400).json({message: "Invalid OS option.", "options": [ "Windows", "Linux", "MacOS" ]})
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
  


export { 
  createDeveloper, 
  createDeveloperInfo,
  readDeveloperById, 
  readAllDevelopers,
   deleteDeveloper,
   readProjectFromDeveloper,
   updateDeveloper,
   updateDeveloperInfo
   
  };
