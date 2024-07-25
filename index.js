const express = require('express')
const app = express()

app.use(express.json())


let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

  app.use(express.static('dist'))

  const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  
  const cors = require('cors')
  
  app.use(cors())
  
  app.use(express.json())
  app.use(requestLogger)
  
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    const note = notes.find(n => n.id === id);
    if(note) {
        response.json(note)
    }else{
        response.status(404).end()
        // response.status(400).json({'id':id, 'error': 'this id does not exist' });
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    const note = notes.filter(n => n.id !== id)

    response.status(204).end()
    // response.status(204).json({'response': 'note deleted successfully...' });
    // console.log('note deleted');
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(note => Number(note.id))) : 0

    return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
    const body = request.body;

    if(!body.content) {
        return response.status(404).json({'error': 'content missing'})
    }

    const duplicate = notes.find(note => note.content === body.content)

    if(duplicate) {
        return response.status(409).json({'error': 'duplicate content'})
    }
    
    const note = {
        id: generateId(),
        content: body.content,
        important: Boolean(body.important) || false ,
    }

    notes = notes.concat(note)

    response.json(note)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`server is running on port ${PORT}`);