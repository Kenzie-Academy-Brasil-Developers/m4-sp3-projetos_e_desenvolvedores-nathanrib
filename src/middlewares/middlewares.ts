import { Request, Response, NextFunction } from "express"
import { QueryConfig } from "pg"
import { client } from "../database"

const ensuranceDevelopersExists =async (req:Request, res: Response, next:NextFunction): Promise<Response| void > => {

    const developerId: number = parseInt(req.params.id)

    const queryString: string = `
    SELECT 
        COUNT (*)      
    FROM 
        developers 
    WHERE 
        id = $1
    
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [developerId]
    }

    const queryResult = await client.query(queryConfig)
    
    if(Number(queryResult.rows[0].count) > 0 ){
        return next()
    }
    
    return res.status(404).json({
        message: "developer not found"
    } )
    
}

const ensuranceProjectExists =async (req:Request, res: Response, next:NextFunction): Promise<Response| void > => {

    const projectId: number = parseInt(req.params.id)

    const queryString: string = `
    SELECT 
        COUNT (*)      
    FROM 
        projects 
    WHERE 
        id = $1
    
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectId]
    }

    const queryResult = await client.query(queryConfig)
    
    if(Number(queryResult.rows[0].count) > 0 ){
        return next()
    }
    
    return res.status(404).json({
        message: "project not found"
    } )
    
}




export {ensuranceDevelopersExists, ensuranceProjectExists}