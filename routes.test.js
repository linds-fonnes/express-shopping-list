process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb")

let item = {name: "Popsicle", price: 1.45}

beforeEach(function() {
    items.push(item)
})

afterEach(function () {
    items.length = 0; 
})

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({items: [item]})
    })
})

describe("GET /items/:item", () =>{
    test("Get item by name", async() => {
        const res = await request(app).get(`/items/${item.name}`);
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({foundItem: item})
    })
})

describe("POST /items", () => {
    test("creating a new item", async() => {
        const res = await request(app).post("/items").send({name: "Pizza", price: 2.50});
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({added: {name: 'Pizza', price: 2.50}})
    })
    test("responds with 400 if name is missing", async () => {
        const res = await request(app).post("/items").send({});
        expect(res.statusCode).toBe(400)
    })
})

describe("PATCH /items/:name", () =>{
    test("updating an item's name", async () => {
        const res = await request(app).patch(`/items/${item.name}`).send({name: "Ice Cream"});
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({updated : {name: 'Ice Cream', price: item.price}})
    })

    test("updating an item's price", async () => {
        const res = await request(app).patch(`/items/${item.name}`).send({price: 3.50});
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({updated : {name: item.name, price: 3.50}})
    })

    test("updating an item's price AND name", async () => {
        const res = await request(app).patch(`/items/${item.name}`).send({name: "Sorbet", price: 2.99});
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({updated : {name: "Sorbet", price: 2.99}})
    })

    test("responds with 404 for invalid name", async() => {
        const res = await request(app).patch("/items/chips").send({name: "Lays", price: 1.88});
        expect(res.statusCode).toBe(404)
    })
})

describe("DELETE /items/:item", () => {
    test("deleting an item", async () => {
        const res = await request(app).delete(`/items/${item.name}`);
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({message: 'Deleted'})
    })

    test("responds with 404 for deleting invalid item", async() => {
        const res = await request(app).delete("/items/hotdog");
        expect(res.statusCode).toBe(404)
    })
})