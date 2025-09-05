import * as chai from "chai";
import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import { createRequire } from "module";

// const require = createRequire(import.meta.url);
// const app = require("../src/server.js"); // load CommonJS server

const { expect } = chai;
let token;

describe("User Signup", function () {
  it("should fail when required fields are missing", function (done) {
    request("http://localhost:8000")
      .post("/api/users/signup")
      .field("name", "parixit")
      .field("email", "")
      .field("phoneNumber", "1234567890")
      .field("password", "Password@123")
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal("All fields are required");
        done();
      });
  });
  it("should fail when name is invalid", function (done) {
    request("http://localhost:8000")
      .post("/api/users/signup")
      .field("name", "A")
      .field("email", "dipvijay@gmail.com")
      .field("phoneNumber", "9587774448")
      .field("password", "Password@123")
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal("Invalid name");
        done();
      });
  });
  it("should fail when phone number is invalid", function (done) {
    request("http://localhost:8000")
      .post("/api/users/signup")
      .field("name", "dipvijay")
      .field("email", "dipvijay@gmail.com")
      .field("phoneNumber", "123456789")
      .field("password", "Password@123")
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal("wrong phone number");
        done();
      });
  });
  it("should fail when email format is invalid", function (done) {
    request("http://localhost:8000")
      .post("/api/users/signup")
      .field("name", "dipvijay")
      .field("email", "invalidemail")
      .field("phoneNumber", "9587774448")
      .field("password", "Abhay@123")
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal("invalid email");
        done();
      });
  });
  it("should fail when password is less than 6 characters", function (done) {
    request("http://localhost:8000")
      .post("/api/users/signup")
      .field("name", "dipvijay")
      .field("email", "dipvijay@gmail.com")
      .field("phoneNumber", "9587774448")
      .field("password", "123")
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal("invalid password");
        done();
      });
  });

  //  it("should succeed when all fields are valid", function (done) {
  //     request("http://localhost:8000")
  //       .post("/api/users/signup")
  //       .field("name", "dipvijay")
  //       .field("email", "dipvijay@gmail.com")
  //       .field("phoneNumber", "9587774448")
  //       .field("password", "Password@123")
  //       .expect(201)
  //       .end((err, res) => {
  //         if (err) return done(err);
  //         expect(res.body.message).to.equal("User created successfully");
  //         done();
  //       });
  //     });
});

describe("User Login", function () {
  it("should fail when required fields are missing", function (done) {
    request("http://localhost:8000")
      .post("/api/users/login")
      .send({ email: "", password: "" })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal("All fields are required");
        done();
      });
  });
  it("should fail when email does not exist", function (done) {
    request("http://localhost:8000")
      .post("/api/users/login")
      .send({ email: "nonexistent@example.com", password: "Password@123" })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal("User does not exist");
        done();
      });
  });
  it("should fail when password is incorrect", function (done) {
    request("http://localhost:8000")
      .post("/api/users/login")
      .send({ email: "dipvijay@gmail.com", password: "wrongpassword" })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal("invalid credentials");
        done();
      });
  });
  it("should succeed when credentials are correct", function (done) {
    request("http://localhost:8000")
      .post("/api/users/login")
      .send({ email: "dipvijay@gmail.com", password: "Password@123" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal("Login successful");
        expect(res.body.token).to.exist;
        token = res.body.token;
        done();
      });
  });
});

describe("Get User Profile", function () {
  it("Get User Profile", function (done) {
    request("http://localhost:8000")
      .get("/api/users/profile")
      .set("Authorization", `${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal("user got profile successfully");
        done();
      });
  });
});
describe(" user update successfully", function () {
  it("update user data successfully", function (done) {
    request("http://localhost:8000")
      .put("/api/users/update")
      .set("Authorization", `${token}`)
      .send({
        name: "dipvijay",
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal("User updated successfully");
        done();
      });
  });
});
// describe("User Delete", function () {
//   it("should delete user successfully", function (done) {
//     request("http://localhost:8000")
//       .delete("/api/users/delete")
//       .set("Authorization", `${token}`)
//       .expect(200)
//       .end((err, res) => {
//         if (err) return done(err);
//         expect(res.body.message).to.equal("User deleted successfully");
//         done();
//       });
//   });
// });

describe("Todo create", function () {
  it("should create a new todo", function (done) {
    request("http://localhost:8000")
      .post("/api/todos/")
      .set("Authorization", `${token}`)
      .send({
        title: "New Todo",
        description: "Todo description",
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal("Todo created successfully");
        done();
      });
  });
});
describe("Get Todos", function () {
  it("should retrieve all todos for the authenticated user", function (done) {
    request("http://localhost:8000")
      .get("/api/todos/")
      .set("Authorization", `${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("array");
        done();
      });
  });
});
describe("Update Todo", function () {
  it("should update an existing todo", function (done) {
    request("http://localhost:8000")
      .post("/api/todos/")
      .set("Authorization", `${token}`)
      .send({
        title: "Todo  Update",
        description: " Description",
      })
      .end((err, res) => {
        if (err) return done(err);
        const todoId = res.body.todo.id;

  
        request("http://localhost:8000")
          .put(`/api/todos/${todoId}`)
          .set("Authorization", `${token}`)
          .send({
            title: "Updated Todo Title",
            description: "Updated Description",
          })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.message).to.equal("Todo updated successfully");
            done();
          });
      });
  });
});
describe("Delete Todo", function () {
  it("should delete an existing todo", function (done) {
    request("http://localhost:8000")
      .post("/api/todos/")
      .set("Authorization", `${token}`)
      .send({
        title: "Todo  deleted",
        description: "This todo  deleted",
      })
      .end((err, res) => {
        if (err) return done(err);
        const todoId = res.body.todo.id;

        request("http://localhost:8000")
          .delete(`/api/todos/${todoId}`)
          .set("Authorization", `${token}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.message).to.equal("Todo deleted successfully");
            done();
          });
      });
  });
});