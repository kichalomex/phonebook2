require('dotenv').config()
const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const ObjectId = require('mongoose').Types.ObjectId
const Person = require('./models/person')
app.use(cors())
app.use(express.json())
//app.use(morgan('tiny'))
morgan.token('object', function(request, require){
    return `${JSON.stringify(request.body)}`
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))

app.get('/', (request, response) => {
    response.send('<h1>Welcome to PhoneBook Api</h1>')
})

app.get('/info', (request, response) => {
    Person.countDocuments({}).then(size => {
        response.send(
            `Phonebook has info for ${size} people <br /> ${Date()}`
        )
    })
    .catch(error => {
        console.log(error)
        response.status(500).send('Error retriving info')
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
    .catch(error => {
        console.log(error)
        response.status(500).send('Internal Server Error')
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person !== null) {
            response.json(person)
        }else {
            response.status(404).send()
        }
    })
    .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id).then(result => {
        if (result !== null) {
            response.status(204).send()
        }else {
            response.status(404).send()
        }
    })
    .catch(error => {
        console.log(error)
        response.status(404).send()
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body;
    const find = Person.findOne({ name: body.name })

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
        find.then(result => {
            if(result !== undefined){
                return response.status(400).json({
                    error: 'name must be unique'
                })
            }
            const person = Person({
                name:body.name,
                number:body.number
            })
            person.save().then(savedPerson => {
                response.json(savedPerson)
                console.log(savedPerson);
            })
        })
        .catch(error => {
            console.log(error)
            response.status(500).send('Internal Server Error')
        })
    }
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body;
    const personUpdate = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, personUpdate, { new: true }).then(updatePerson => {
        if (updatePerson) {
            response.json(updatePerson)
        } else {
            response.status(404).send()
        }
    })
    .catch(error => {
        console.log(error)
        response.status(404).send()
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})