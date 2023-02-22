import express, { Application } from "express";
import { startDataBase } from "./database";
import { createDeveloper, createDeveloperInfo, deleteDeveloper, readAllDevelopers, readDeveloperById, readProjectFromDeveloper, updateDeveloper, updateDeveloperInfo } from "./logic/developers.logic";
import { createProject, createTechToPoject, deleteProjecet, deleteTechFromPoject, readAllProjects, readProjectById, updateProject } from "./logic/projects.logic";
import { ensuranceDevelopersExists, ensuranceProjectExists } from "./middlewares/middlewares";


const app: Application = express();
app.use(express.json());

app.post("/developers", createDeveloper);
app.get("/developers", readAllDevelopers);
app.get("/developers/:id", ensuranceDevelopersExists, readDeveloperById);
app.get("/developers/:id/projects", ensuranceDevelopersExists, readProjectFromDeveloper);
app.patch("/developers/:id", ensuranceDevelopersExists, updateDeveloper);
app.delete("/developers/:id", ensuranceDevelopersExists, deleteDeveloper);
app.post("/developers/:id/infos",ensuranceDevelopersExists, createDeveloperInfo);
app.patch("/developers/:id/infos", ensuranceDevelopersExists, updateDeveloperInfo); 

app.post("/projects", createProject);
app.get("/projects", readAllProjects);
app.get("/projects/:id", ensuranceProjectExists, readProjectById);
app.patch("/projects/:id", ensuranceProjectExists, updateProject); 
app.delete("/projects/:id", ensuranceProjectExists, deleteProjecet);
app.post("/projects/:id/technologies", ensuranceProjectExists, createTechToPoject); 
app.delete("/projects/:id/technologies/:name", ensuranceProjectExists, deleteTechFromPoject); 

app.listen("3000", async () => {
  await startDataBase();
  console.log("server is runnig");
});

