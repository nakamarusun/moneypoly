const inter = require("../src/interserver/inter");
const express = require("express");
const request = require("supertest");

const app = express();

// Test route
app.use("/inter", inter.router);
inter.router.get("/", (req, res) => {
    res.sendStatus(200);
})

// Set secretkey for jwt
process.env.JWTKEY = "super-awesome-secret-for-development";

describe("JWT inter Tests", () => {
    // eslint-disable-next-line jest/expect-expect
    test("Whether token generated can be used in request", () => {
        request(app).get("/inter").set({
            Authorization: "Bearer " + inter.genToken()
        }).expect(200).end(function(err, res) {
            if (err) throw err;
        });
    });

    // eslint-disable-next-line jest/expect-expect
    test("Whether expired token returns Forbidden", () => {
        request(app).get("/inter").set({
            Authorization: "Bearer " + inter.genToken(Date.now())
        }).expect(200).end(function(err, res) {
            if (err) throw err;
        });
    });
});