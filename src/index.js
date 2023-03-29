const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(morgan('tiny'))

morgan.token('object', function(request, require){
    return `${JSON.stringify(request.body)}`
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelance",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }    
]

app.get('/', (request, response) => {
    response.send('<h1>Test</h1>')
})

app.get('/info', (request, response) => {
    response.send(
        `Phonebook has info for ${persons.length} people <br /> ${Date()}`
    )
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    console.log(person);
    if (person !== undefined) {
        response.json(person)
    }else {
        response.status(404).send()
    }
    
})

app.delete('/api/persons/:id', (request, response) => {
    const id =  Number(request.params.id)
    let size = persons.length;
    persons = persons.filter(x => x.id !== id)
    if (size > persons.length) {
        response.status(204).send();
    }
    else {
        response.status(404).send();
    }
    console.log(persons);
})

app.post('/api/persons', (request, response) => {
    const body = request.body;
    const find = persons.find(x => x.name === body.name)

    if (body.name === undefined && body.number === undefined) {
        return response.status(400).json({
            error: 'name and number is missing'
        })
    }else if (body.number === undefined){
        return response.status(400).json({
            error: 'number is missing'
        })
    }else if (body.name === undefined){
        return response.status(400).json({
            error: 'name is missing'
        })
    }else {
        if(find !== undefined){
            return response.status(400).json({
                error: 'name must be unique'
            })
        }
    }

    const person = {
        id:Math.floor(Math.random() * (1000 - 1) + 1),
        name:body.name,
        number:body.number
    }

    persons=persons.concat(person)
    response.json(person)
    console.log(persons);
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})