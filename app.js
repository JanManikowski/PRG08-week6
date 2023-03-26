import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

const csvFile = "./data/mushrooms.csv"
const trainingLabel = "class"
const ignoredColumns = ["class","cap-shape","bruises","odor","gill-color","stalk-shape","stalk-root","stalk-surface-above-ring","stalk-surface-below-ring","stalk-color-above-ring","stalk-color-below-ring","veil-type","veil-color","ring-type","spore-print-color","habitat"]

function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => trainModel(results.data)
    })

}

function trainModel(data) {
    data.sort(() => Math.random() - 0.5);

    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    let decisionTree = new DecisionTree({
        ignoredAttributes: ignoredColumns,
        trainingSet: trainData,
        categoryAttr: trainingLabel
    })

    function testMushroom() {
        let amountCorrect = 0 // keep track of the number of correct predictions

        let truePositives = 0; // aantal werkelijke positieven die correct zijn voorspeld
        let trueNegatives = 0; // aantal werkelijke negatieven die correct zijn voorspeld
        let falsePositives = 0; // aantal werkelijke negatieven die onterecht als positief zijn voorspeld
        let falseNegatives = 0; // aantal werkelijke positieven die onterecht als negatief zijn voorspeld


        for (let i = 0; i < testData.length; i++) {
            // make a copy of the mushroom without the "Label" attribute
            const mushroomWithoutLabel = { ...testData[i] }
            delete mushroomWithoutLabel.class

            // prediction
            let prediction = decisionTree.predict(mushroomWithoutLabel)

            // compare the prediction with the actual label
            if (prediction === testData[i].class) {
                amountCorrect++

                if (prediction === "p") {
                    truePositives++;
                  } else {
                    trueNegatives++;
                  }
                } else {
                  if (prediction === "p") {
                    falsePositives++;
                  } else {
                    falseNegatives++;
                  }
            }
        }

        let accuracy = amountCorrect / testData.length // calculate the accuracy
        console.log(`Accuracy: ${accuracy}`) // display the accuracy in the console

        // toon de Confusion Matrix in de console
        // console.log(`True Positives: ${truePositives}`);
        // console.log(`True Negatives: ${trueNegatives}`);
        // console.log(`False Positives: ${falsePositives}`);
        // console.log(`False Negatives: ${falseNegatives}`);

        // update the HTML table with confusion matrix results
        document.getElementById("truePositives").innerHTML = truePositives.toString();
        document.getElementById("trueNegatives").innerHTML = trueNegatives.toString();
        document.getElementById("falsePositives").innerHTML = falsePositives.toString();
        document.getElementById("falseNegatives").innerHTML = falseNegatives.toString();

           
        return accuracy // return the accuracy as the result of the function

    }

    document.getElementById("accuracy").textContent = `Accuracy: ${(testMushroom ()*100).toFixed(2)}%`

    let jsonStringify = decisionTree.stringify()
    console.log("this is the model: " + jsonStringify)
    

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let json = decisionTree.toJSON()
    let visual = new VegaTree('#view', 1200, 700, decisionTree.toJSON())
    
}



loadData()