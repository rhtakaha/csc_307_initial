const express = require("express");
const app = express();
const port = 5000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name != undefined && job != undefined) {
    let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  } else if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
  res.status(200).end(); //always sending something
});

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined || result.length == 0)
    res.status(404).send("Resource not found.");
  else {
    result = { users_list: result };
    res.send(result);
    res.status(200).end();
  }
});

function findUserById(id) {
  return users["users_list"].find((user) => user["id"] === id); // or line below
  //return users['users_list'].filter( (user) => user['id'] === id);
}

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.status(201).end();
});

function addUser(user) {
  users["users_list"].push(user);
}

//implement to delete a user by id
//first see if that id exists and if it does remove it
app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const check = findUserById(id);
  if (check !== undefined && check.length != 0) {
    deleteUserById(id);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

function deleteUserById(id) {
  users["users_list"] = users["users_list"].filter(
    (users) => users["id"] !== id
  );
}

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};
