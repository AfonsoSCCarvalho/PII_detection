function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Page')
    .setTitle('Select Google Doc')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function testProcessAndHandleDocument() {
  var docId = ''; // Put your test text
  var result = processAndHandleDocument(docId);
  console.log(result);
}


function processAndHandleDocument(docId) {
  var text = getDocumentText(docId);
  if (text === null) {
    return { error: "Failed to get document text." };
  }

  var segments = splitTextIntoSegments(text); // Split text into manageable segments
  var serverResponses = sendToServer(segments); // Send segments to server
  if (serverResponses === null) {
    return { error: "Failed to communicate with server." };
  }

  var processedEntities  = processServerResponse(serverResponses); // Process combined server responses
  if (processedEntities  === null) {
    return { error: "Failed to process server responses." };
  }

  console.log("Document processed successfully.");
  var hasSensitiveInfo = detectSensitiveInformation({processedEntities: processedEntities});

    // Return both processed entities and sensitive info detection result
  return { preProcessedText: text, processedEntities: processedEntities, sensitiveInfoDetected: hasSensitiveInfo };
  } 

function splitTextIntoSegments(text) {
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text]; // Extract sentences
  let segments = [];
  let segment = '';
  let sentenceCount = 0;

  sentences.forEach((sentence) => {
    // Check if adding the next sentence would exceed the max length or sentence count
    if ((segment.length + sentence.length > 600) || sentenceCount === 3) {
      segments.push(segment.trim()); // Add the current segment to the list
      segment = sentence; // Start a new segment with the current sentence
      sentenceCount = 1; // Reset sentence count for the new segment
    } else {
      segment += ' ' + sentence; // Add the sentence to the current segment
      sentenceCount++; // Increment the sentence count
    }
  });

  // Add the last segment if it's not empty
  if (segment.trim().length > 0) {
    segments.push(segment.trim());
  }

  return segments;
}


function getDocumentText(docId) {
  try {
    var doc = DocumentApp.openById(docId);
    var body = doc.getBody();
    var text = body.getText();
    console.log("Pre-processed text: " + text);
    return text; // Return the text for further processing
  } catch (e) {
    console.error("Error opening document: " + e.toString());
    return null; // Indicate failure
  }
}

function sendToServer(segments) {
  var combinedResponses = []; // To store responses from all segments
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    var response = sendSegmentToServer(segment); // Send each segment to the server
    if (response === null) {
      console.error("Failed to get response for segment: " + segment);
      return null; // If any segment fails, return null for now
    }
    combinedResponses.push(response); // Assuming response is already parsed JSON
  }
  return combinedResponses; // Return combined responses
}

function sendSegmentToServer(segment) {
  var apiEndpoint = 'http://PUT Your Server IP/classify';
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ text: segment }),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(apiEndpoint, options);
    if (response.getResponseCode() != 200) {
      console.error("Error connecting to server: " + response.getContentText());
      return null;
    }
    return JSON.parse(response.getContentText()); // Parse and return the response
  } catch (e) {
    console.error("Error sending segment to server: " + e.toString());
    return null;
  }
}


function processServerResponse(combinedResponses) {
  try {
    // Directly process the combined array of responses without joining into a string
    // Assuming combinedResponses is an array of arrays (or similar structure)
    var allProcessedEntities = combinedResponses.flatMap(response => processEntitiesOnServer(response));
    var consoallProcessedEntities = consolidateEntities(allProcessedEntities)
    console.log("Server responses processed successfully.");
    return consoallProcessedEntities;
  } catch (e) {
    console.error("Error processing server responses: " + e.toString());
    return null;
  }
}



