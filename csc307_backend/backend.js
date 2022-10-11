const express = require("express");
const user_change = require("./models/user_services");
const app = express();
const port = 5000;
const cors = require("cors");
const crypto = require("crypto");

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

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/users", async (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name != undefined && job != undefined) {
    let result = await user_change.findUserByNameAndJob(name, job);
    //result = { users_list: result };
    res.send(result);
  } else if (name != undefined) {
    //...users/?name=__
    let result = await user_change.findUserByName(name);
    res.send(result);
  } else if (job != undefined) {
    let result = await user_change.findUserByJob(job);
    res.send(result);
  } else {
    //get all users
    let result = await user_change.getUsers(undefined, undefined);
    res.send(result);
  }
  res.status(200).end(); //always sending something
});

// const findUserByName = (name) => {
//   return users["users_list"].filter((user) => user["name"] === name);
// };

app.get("/users/:id", async (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = await user_change.findUserById(id);
  if (result === undefined || result.length == 0)
    res.status(404).send("Resource not found.");
  else {
    res.send(result);
    res.status(200).end();
  }
});

// function findUserById(id) {
//   return users["users_list"].find((user) => user["id"] === id); // or line below
//   //return users['users_list'].filter( (user) => user['id'] === id);
// }

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  // userToAdd.id = idGenerator();
  // addUser(userToAdd);
  user_change.addUser(userToAdd);
  res.status(201).send(userToAdd).end();
});

// function addUser(user) {
//   users["users_list"].push(user);
// }

//implement to delete a user by id
//first see if that id exists and if it does remove it
app.delete("/users/:id", async (req, res) => {
  const id = req.params["id"];
  const check = await user_change.findUserById(id);
  if (check !== undefined && check.length != 0) {
    user_change.deleteUserById(id);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

// function deleteUserById(id) {
//   users["users_list"] = users["users_list"].filter(
//     (users) => users["id"] !== id
//   );
// }

// const findUserByNameAndJob = (name, job) => {
//   return users["users_list"].filter(
//     (user) => user["name"] === name && user["job"] === job
//   );
// };

// //randomly generate an ID to be appending to incoming characters
// function idGenerator() {
//   return crypto.randomBytes(3).toString("hex");
// }
