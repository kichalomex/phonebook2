const { response } = require('express')
const express = require('express')
const app = express()

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelance",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})