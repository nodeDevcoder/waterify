const readline = require("readline");
const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
const csv = require("fast-csv");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Load the CSV data
const datasetPath = "water_potability.csv";

async function loadDataset() {
  const data = [];
  const labels = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(datasetPath)
      .pipe(csv.parse({ headers: true }))
      .on("data", (row) => {
        data.push(Object.values(row).map(parseFloat));
        labels.push(parseFloat(row["Potability"]));
      })
      .on("end", () => {
        resolve();
      })
      .on("error", (error) => {
        reject(error);
      });
  });

  return [data, labels];
}

// Preprocess the data
function preprocessData(data, labels) {
  // Split the dataset into training and testing sets
  const splitRatio = 0.8;
  const splitIndex = Math.floor(data.length * splitRatio);

  const xTrain = data.slice(0, splitIndex);
  const yTrain = labels.slice(0, splitIndex);
  const xTest = data.slice(splitIndex);
  const yTest = labels.slice(splitIndex);

  return [xTrain, yTrain, xTest, yTest];
}

// Define the model architecture
function createModel() {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 64, activation: "relu", inputShape: [9] })
  );
  model.add(tf.layers.dense({ units: 32, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

  return model;
}

// Compile the model
function compileModel(model) {
  model.compile({
    optimizer: tf.train.adam(),
    loss: "binaryCrossentropy",
    metrics: ["accuracy"],
  });
}

// Train the model
async function trainModel(model, xTrain, yTrain, xTest, yTest) {
  const epochs = 100;
  return await model.fit(tf.tensor(xTrain), tf.tensor(yTrain), {
    epochs,
    validationData: [tf.tensor(xTest), tf.tensor(yTest)],
    callbacks: tf.node.tensorBoard("logs"),
  });
}

// Make predictions
function predict(model, inputData) {
  const inputTensor = tf.tensor([inputData]);
  const prediction = model.predict(inputTensor);
  return prediction.dataSync()[0];
}

// Main function
async function main() {
  const [data, labels] = await loadDataset();
  const [xTrain, yTrain, xTest, yTest] = preprocessData(data, labels);

  const model = createModel();
  compileModel(model);

  await trainModel(model, xTrain, yTrain, xTest, yTest);

  // Prompt the user for input for each of the 9 water quality parameters
  const userInput = [];
  for (let i = 1; i <= 9; i++) {
    const input = await askQuestion(`Enter value for parameter ${i}: `);
    userInput.push(parseFloat(input));
  }

  const prediction = predict(model, userInput);

  console.log(`Predicted Potability: ${prediction > 0.5 ? 1 : 0}`);
  rl.close();
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

main();
