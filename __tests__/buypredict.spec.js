const { getAIBuyPrediction } = require("../src/worker/engine/gameai");

// TODO:
// CI thingy

const path = require("path");

process.env.PYTHON="python"
process.env.BUYMODELPATH=path.resolve(__dirname, "../", "src", "worker", "predictor.py");
process.env.BUYMODELSCRIPT=path.resolve(__dirname, "model.joblib");

console.log(process.env.BUYMODELSCRIPT);

describe("Moneypoly AI buy upgrade predictor", () => {
    // eslint-disable-next-line jest/no-done-callback
    test("AI buy upgrade predictor works", async (done) => {
        const a = await getAIBuyPrediction([800, 200, 800, 17, 32]);
        console.log(a);
        expect(a).toEqual(expect.anything());
        done();
    });
});
