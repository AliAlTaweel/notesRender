const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

// Morgan 'tiny' logger for all requests

// Morgan combined format only for error responses (status codes 400 and above)
const customMorgan = (tokens, req, res) => {
  const { name, number } = req.body;
  console.log(req.body);
  return [
    `Server running on port ${PORT}`,
    [
      `${tokens.method(req, res)}`,
      `${tokens.url(req, res)}`,
      `${tokens.status(req, res)}`,
      `${tokens.res(req, res, "content-length")}`,
      `${tokens["response-time"](req, res)} ms`,
      `{"name":"${name}", "number":"${number}"}`,
    ].join(" "), // Join the rest with a comma
  ].join("\n"); // Join the port line and the details line with a newline
};

// EXAMPLE: only log error responses
morgan("combined", {
  skip: function (req, res) {
    return res.statusCode < 400;
  },
});

// EXAMPLE: only log error responses
morgan("combined", {
  skip: function (req, res) {
    return res.statusCode < 400;
  },
});
let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
//========== Middleware =========

//=========== Routes =========
//============ get ==============
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

const arrlength = () => {
  return persons.length;
};
// ============= get info ==============
app.get("/api/info", (req, res) => {
  res.send(`Phonebook has info for ${arrlength()} people <br/><br/>
    ${new Date()}.`);
});
// ============= get with id ============
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: "No Such thing!!!" });
  }
});
// ============= delete with id ============
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  console.log("check01");
  res.status(204).end();
});

// ============= generate Id function ============
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};
app.use(morgan(customMorgan));
// ============= post ============

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "Name and Number are required!" });
  }
  if (persons.find((person) => person.name === name)) {
    return res.status(400).json({ error: "Name must be unique!" });
  }

  const newPerson = {
    id: generateId(),
    name,
    number,
  };
  persons.push(newPerson);
  res.status(201).json(newPerson);
});
//========================================

// ============= PORT & listen ============
const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
