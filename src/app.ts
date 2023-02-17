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










// //OQ FALTA NO PROJETO 
// app.post("/developers", createDeveloper); ------------------------------------------ FUNCIONANDO
// app.get("/developers", readAllDevelopers); ------------------------------------------FUNCIONANDO
// app.get("/developers/:id", ensuranceDevelopersExists, readDeveloperById); ---------- FUNCIONANDO
// app.delete --- DELETAR USUARIO E VERIFICAR SE ID EXISTE ---------------------------- FUNCIONANDO
// app.post("/developers/:id/infos",ensuranceDevelopersExists, createDeveloperInfo);--- FUNCIONANDO
// app.get("/developers/:id/projects", ensuranceDevelopersExists);  ------------------- FUNCIONANDO
// app.patch("/developers/:id", ensuranceDevelopersExists);---------------------------- FUNCIONANDO
// app.patch("/developers/:id/infos", ensuranceDevelopersExists,); -------------------- CRIAR ROTA 

// app.post("/projects", createProject);  ---------------- FUNCIONANDO
// app.get("/projects", readAllProjects); ---------------- FUNCIONANDO
// app.get("/projects/:id"); ----------------------------- FUNCIONANDO
// app.delete("/projects/:id"); -------------------------- FUNCIONANDO
// app.patch("/projects/:id"); --------------------------- FUNCIONANDO
// app.post("/developers/:id/technologies"); ------------- FUNCIONANDO 
// app.delete("/developers/:id/technologies/name"); ------ CRIAR ROTA 


// TRATAR: 
// INPUTS DE PATCHS E POSTS
// VERIFICAR SE ALGUNS ID RELACIONAIS EXISTEM 
// RESOLVER ALGUMAS TIPAGENS NAO FEITAS
// CRIAR TRY CATHC PARA DEV INFOS PARA PEGAR ERROS
// ADICIONAR IMAGEM DIAGRAMA