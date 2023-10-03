const readline = require("readline");
const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
const csv = require("fast-csv");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const datasetPath = "Tensor/waterPotability.csv";

async function loadDataset() {
  const data = [];
  const labels = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(datasetPath)
      .pipe(csv.parse({ headers: true }))
      .on("data", (row) => {
        labels.push(parseFloat(row["Potability"]));
        delete row["Potability"];
        data.push(Object.values(row).map(parseFloat));
      })
      .on("end", resolve)
      .on("error", reject);
  });

  return [data, labels];
}

function preprocessData(data, labels) {
  const splitRatio = 0.8;
  const splitIndex = Math.floor(data.length * splitRatio);

  const xTrain = data.slice(0, splitIndex);
  const yTrain = labels.slice(0, splitIndex);
  const xTest = data.slice(splitIndex);
  const yTest = labels.slice(splitIndex);

  return [xTrain, yTrain, xTest, yTest];
}

function createModel() {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 64, activation: "relu", inputShape: [9] })
  );
  model.add(tf.layers.dense({ units: 32, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

  return model;
}

function compileModel(model) {
  model.compile({
    optimizer: tf.train.adam(),
    loss: "binaryCrossentropy",
    metrics: ["accuracy"],
  });
}

async function trainModel(model, xTrain, yTrain, xTest, yTest) {
  const epochs = 100;

  console.log('xTrain length:', xTrain.length);  // Add this
  console.log('yTrain length:', yTrain.length);  // Add this
  console.log('xTest length:', xTest.length);   // Add this
  console.log('yTest length:', yTest.length);   // Add this

  return await model.fit(tf.tensor(xTrain), tf.tensor(yTrain), {
    epochs,
    validationData: [tf.tensor(xTest), tf.tensor(yTest)],
    callbacks: tf.node.tensorBoard("logs"),
  });
}

function predict(model, inputData) {
  const inputTensor = tf.tensor([inputData]);
  const prediction = model.predict(inputTensor);
  return prediction.dataSync()[0];
}

async function main() {
  try {
    const [data, labels] = await loadDataset();
    const [xTrain, yTrain, xTest, yTest] = preprocessData(data, labels);

    const model = createModel();
    compileModel(model);

    await trainModel(model, xTrain, yTrain, xTest, yTest);

    const userInput = [];
    for (let i = 1; i <= 9; i++) {
      const input = await askQuestion(`Enter value for parameter ${i}: `);
      userInput.push(parseFloat(input));
    }

    const prediction = predict(model, userInput);

    console.log(`Predicted Potability: ${prediction > 0.5 ? 1 : 0}`);
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    rl.close();
  }
}

function askQuestion(question) {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      if (isNaN(parseFloat(answer))) {
        reject("Invalid input. Please enter a number.");
      } else {
        resolve(answer);
      }
    });
  });
}

main();