function simulateProcessDocument(docId) {
  try {
    var doc = DocumentApp.openById(docId);
    var body = doc.getBody();
    var text = body.getText();

    console.log("Pre-processed text: " + text); // Log pre-processed text

    // Simulated response for demonstration purposes
    var simulatedResponse = JSON.stringify([
      { end: 107, entity: 'B-FIRSTNAME', index: 24, score: 0.9893500208854675, start: 105, word: 'af' },
      { end: 110, entity: 'I-FIRSTNAME', index: 25, score: 0.9304861426353455, start: 107, word: '##ons' },
      { end: 111, entity: 'I-FIRSTNAME', index: 26, score: 0.9419087171554565, start: 110, word: '##o' },
      { end: 115, entity: 'B-LASTNAME', index: 27, score: 0.8674280643463135, start: 112, word: 'car' },
      { end: 118, entity: 'I-LASTNAME', index: 28, score: 0.6228554248809814, start: 115, word: '##val' },
      { end: 120, entity: 'I-LASTNAME', index: 29, score: 0.5454228520393372, start: 118, word: '##ho' },
      { end: 140, entity: 'B-STATE', index: 34, score: 0.9634017944335938, start: 132, word: 'portugal' },
      { end: 150, entity: 'B-FIRSTNAME', index: 24, score: 0.9893500208854675, start: 105, word: 'ped' },
      { end: 170, entity: 'I-FIRSTNAME', index: 25, score: 0.9304861426353455, start: 107, word: '##ro'}
    ]);
    var processedEntities = processEntitiesOnServer(JSON.parse(simulatedResponse));

    console.log("Server-side processing complete.");
    var hasSensitiveInfo = detectSensitiveInformation({processedEntities: processedEntities});

    // Return both processed entities and sensitive info detection result
    return { preProcessedText: text, processedEntities: processedEntities, sensitiveInfoDetected: hasSensitiveInfo };
  } catch (e) {
    console.error("Error simulating document processing: " + e.toString());
    return { error: "Error simulating document processing: " + e.toString() };
  }
}

function processEntitiesOnServer(processedTextArray) {
  var entityDict = {};
  var entityLastIndex = {}; // Tracks the last index of each entity type

  processedTextArray.forEach(function(entity) {
    var entityType = entity.entity.slice(2); // Get rid of 'B-' and 'I-' prefixes
    var word = entity.word.replace('##', '');
    var isContinuation = entity.entity.startsWith('I-') && entityLastIndex[entityType] !== undefined && (entity.index - entityLastIndex[entityType] === 1);

    if (!entityDict[entityType]) {
      entityDict[entityType] = [word]; // Initialize with the first word
    } else if (isContinuation) {
      // Continuation of the same word
      var lastWordIndex = entityDict[entityType].length - 1;
      entityDict[entityType][lastWordIndex] = entityDict[entityType][lastWordIndex] + word;
    } else {
      // New word for the entity type or a separate instance of the same entity type
      entityDict[entityType].push(word); 
    }

    // Update the last index for this entity type
    entityLastIndex[entityType] = entity.index;
  });

  // Convert the dictionary arrays into strings for easy display
  var entitiesString = "";
  for (var key in entityDict) {
    // Join words of the same entity with a space, separate different entities of the same type with a comma
    entitiesString += key + ": " + entityDict[key].join(', ') + "\n";
  }

  return entitiesString.trim();
}

function consolidateEntities(processedEntities) {
  let consolidatedEntityDict = {};

  processedEntities.forEach(entityString => {
    // Split each entity string by newline to process each entity type separately
    let entities = entityString.split('\n');
    entities.forEach(entity => {
      // Split by the first occurrence of ": " to separate the entity type from its values
      let [type, values] = entity.split(': ');
      if (!consolidatedEntityDict[type]) {
        // Initialize if this entity type hasn't been encountered before
        consolidatedEntityDict[type] = new Set(values.split(', '));
      } else {
        // Add new values to the set (automatically handles duplicates)
        values.split(', ').forEach(value => consolidatedEntityDict[type].add(value));
      }
    });
  });

  // Convert the dictionary back into the desired string format
  let consolidatedEntities = [];
  for (let [type, valueSet] of Object.entries(consolidatedEntityDict)) {
    consolidatedEntities.push(`${type}: ${Array.from(valueSet).join(', ')}`);
  }

  return consolidatedEntities.join('\n');
}



// detectSensitiveInformation.gs

/**
 * Checks the server response for sensitive information.
 * @param {Object} response - The response object from the server.
 * @return {boolean} true if sensitive information is detected; otherwise, false.
 */
function detectSensitiveInformation(response) {
  // Assuming 'response' is an object that contains an array of processed entities
  // This example simply checks if the response array is not empty
  // You may need to adjust the logic based on your actual data structure and criteria for sensitive information
  
  // Example of checking if any entities are detected
  if (response || response.processedEntities || response.processedEntities.length > 0) {
    return true; // Sensitive information detected
  } else {
    return false; // No sensitive information detected
  }
}



function testsimulateProcessDocument() {
  // Replace 'docId' with the ID of the Google Doc you want to process
  var docId = 'docID';

  // Call the processDocument function to simulate processing the document
  var result = simulateProcessDocument(docId);
  // Log the result to the console
  console.log(result);
  var detectSensitiveInformation_var = detectSensitiveInformation(result);
  console.log(detectSensitiveInformation_var);
}


function getEntityDataForChart(entityFrequencies) {
  // Assume entityFrequencies is an object like { 'FIRSTNAME': 2, 'LASTNAME': 1, 'STATE': 1 }
  var dataForChart = [];
  for (var entity in entityFrequencies) {
    dataForChart.push([entity, entityFrequencies[entity]]);
  }
  return dataForChart;
}