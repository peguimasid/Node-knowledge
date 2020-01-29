const express = require('express')
const app = express();

app.use(express.json());

const projects = [];

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

function logRequests(req, res, next) {

  console.count("Número de requisições");

  return next();
}

app.use(logRequests);


//Listar todos projetos
app.get('/projects', (req, res) => {
  return res.json(projects);
});

//Criar projeto
app.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id, 
    title,
    tasks: []
  }

  projects.push(project);

  return res.json(project)
})

//Editar projeto
app.put('/projects/:id', checkProjectExists, (req, res) =>{
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.title = title

  return res.json(project);
})

//Deletar projeto
app.delete('/projects/:id',checkProjectExists , (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id)

  projects.splice(projectIndex, 1);

  return res.send()
})

//Add nova task ao projeto
app.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.tasks.push(title);
  return res.json(project);
})


app.listen(3000)