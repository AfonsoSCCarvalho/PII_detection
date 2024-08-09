
function processDocument2(docId) {
  try {
    var doc = DocumentApp.openById(docId);
    var body = doc.getBody();
    var text = body.getText();

    console.log("Pre-processed text: " + text); // Log pre-processed text

    var apiEndpoint = 'http://INSERT_YOUR_OWN/classify'; // Assuming Flask app is accessible on port 80
    var options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ text: text }),
      muteHttpExceptions: true // To get detailed errors in case of failure
    };

    console.log("Connecting to server..."); // Indicate connection attempt

    var response = UrlFetchApp.fetch(apiEndpoint, options);

    // Check for non-200 response and log for debugging
    if (response.getResponseCode() != 200) {
      console.error("Error connecting to server: " + response.getContentText());
      return { error: "Error connecting to server. Response Code: " + response.getResponseCode() };
    }

    var responseData = JSON.parse(response.getContentText());

    console.log("Connected successfully and processed the text."); // Indicate successful connection and processing

    return { preProcessedText: text, processedText: responseData };
  } catch (e) {
    console.error("Error processing document: " + e.toString());
    // Return or handle the error appropriately
    return { error: "Error processing document: " + e.toString() };
  }
}


function simulateProcessDocument2(docId) {
  try {
    var doc = DocumentApp.openById(docId);
    var body = doc.getBody();
    var text = body.getText();

    console.log("Pre-processed text: " + text); // Log pre-processed text

    // Simulate creating a JSON package
    var simulatedJsonPayload = JSON.stringify({ text: text });

    // Immediately "unparse" it (simulate processing)
    var simulatedResponse = JSON.parse(simulatedJsonPayload);

    console.log("Simulated processing complete."); // Log simulated processing
    console.log("Un parsed text: " + JSON.stringify(simulatedResponse, null, 2));
    return { preProcessedText: text, processedText: simulatedResponse };
  } catch (e) {
    console.error("Error simulating document processing: " + e.toString());
    return { error: "Error simulating document processing: " + e.toString() };
  }
}
function testProcessDocument2() {
  // Replace 'docId' with the ID of the Google Doc you want to process
  var docId = 'docId';

  // Call the processDocument function to simulate processing the document
  var result = processDocument2(docId);

  // Log the result to the console
  console.log(result);
}
