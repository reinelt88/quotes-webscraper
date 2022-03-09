const chai = require("chai");
const chaiHttp = require("chai-http");
const {createService} = require("../../src/quote-service");
const {getExpectedData} = require("../helpers/prepare");
const {getFailString} = require("../helpers/render");
const {validateResponse} = require("../helpers/validate");
const {expect} = chai;
chai.use(chaiHttp);
const app = createService();

describe("GET /quotes?tag=:tag", () => {
    it('should return an array of quotes tagged "life"', done => {
        const req = "/quotes";
        const path = "./test/fixtures/tag_life.json";
        const expectedData = getExpectedData(path);

        chai.request(app)
            .get(req)
            .query({tag: "life"})
            .end(async (err, res) => {
                try {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body, "response.body").to.be.a("object");
                    expect(res.body.data, "response.body.data").to.be.a("array");

                    const expected = await expectedData;

                    expect(
                        res.body.data.length, "response.body.data.length"
                    ).to.equal(expected.data.length);

                    if (!validateResponse(res.body.data, expected.data)) {
                        expect.fail(null, null, getFailString(res.body, expected));
                    }

                    done();
                }
                catch (err) { done(err); }
            });
    });

    it('should return an array of quotes tagged "paraphrased"', done => {
        const req = "/quotes";
        const path = "./test/fixtures/tag_paraphrased.json";
        const expectedData = getExpectedData(path);

        chai.request(app)
            .get(req)
            .query({tag: "paraphrased"})
            .end(async (err, res) => {
                try {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body, "response.body").to.be.a("object");
                    expect(res.body.data, "response.body.data").to.be.a("array");

                    const expected = await expectedData;

                    expect(
                        res.body.data.length, "response.body.data.length"
                    ).to.equal(expected.data.length);

                    if (!validateResponse(res.body.data, expected.data)) {
                        expect.fail(null, null, getFailString(res.body, expected));
                    }

                    done();
                }
                catch (err) { done(err); }
            });
    });

    it('should return an empty data array on no content query "foo"', async () => {
        const req = "/quotes";
        const res = await chai.request(app)
            .get(req)
            .query({tag: "foo"});
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body, "response.body").to.be.a("object");
        expect(res.body.data, "response.body.data").to.be.a("array");
        expect(res.body.data.length, "response.body.data.length").to.equal(0);
    });
});

describe("GET /quotes", () => {
    it('should return an array of all quotes', done => {
        const req = "/quotes";
        const path = "./test/fixtures/quotes.json";
        const expectedData = getExpectedData(path);

        chai.request(app).get(req).end(async (err, res) => {
            try {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body, "response.body").to.be.a("object");
                expect(res.body.data, "response.body.data").to.be.a("array");

                const expected = await expectedData;

                expect(
                    res.body.data.length, "response.body.data.length"
                ).to.equal(expected.data.length);

                if (!validateResponse(res.body.data, expected.data)) {
                    expect.fail(null, null, getFailString(res.body, expected));
                }

                done();
            }
            catch (err) { done(err); }
        });
    });
});
