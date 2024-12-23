from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, GenerationConfig

app = Flask(__name__)
CORS(app)  # This will allow all cross-origin requests, or you can configure more specifically.

# Your model setup
model_name = r"chitt31/fine_tuned_m2m100_en_gu1"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

generation_config = GenerationConfig.from_pretrained(model_name)
generation_config.early_stopping = True
generation_config.num_beams = 4
model.generation_config = generation_config

@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.json
        english_text = data.get("text", "").strip()

        if not english_text:
            return jsonify({"error": "No text provided"}), 400

        inputs = tokenizer(english_text, return_tensors="pt", padding=True, truncation=True)
        outputs = model.generate(**inputs, num_beams=generation_config.num_beams, early_stopping=generation_config.early_stopping)
        gujarati_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        print(gujarati_text)
        return jsonify({"translated_text": gujarati_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
