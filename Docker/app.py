from flask import Flask, request, jsonify
from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification
import numpy as np

app = Flask(__name__)

# Load the model
tokenizer = AutoTokenizer.from_pretrained("Isotonic/distilbert_finetuned_ai4privacy_v2")
model = AutoModelForTokenClassification.from_pretrained("Isotonic/distilbert_finetuned_ai4privacy_v2")
pipe = pipeline("token-classification", model=model, tokenizer=tokenizer)

# Conversion function
def convert_to_serializable(data):
    if isinstance(data, np.float32):  # Convert np.float32 to Python float
        return float(data)
    elif isinstance(data, list):  # Recursively process list items
        return [convert_to_serializable(item) for item in data]
    elif isinstance(data, dict):  # Recursively process dictionary items
        return {key: convert_to_serializable(value) for key, value in data.items()}
    return data

@app.route('/classify', methods=['POST'])
def classify():
    try:
        data = request.get_json(force=True)
        text = data['text']
        results = pipe(text)
        # Convert results to be fully JSON-serializable
        serializable_results = convert_to_serializable(results)
        return jsonify(serializable_results)
    except Exception as e:
        app.logger.error(f"An error occurred: {e}")
        return jsonify({"error": "An error occurred during classification."}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
