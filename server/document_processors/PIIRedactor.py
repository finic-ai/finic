import requests

analyzer_url = "https://presidio-analyzer-ezml2kwdva-uc.a.run.app/analyze"
anonymizer_url = "https://presidio-anonymizer-ezml2kwdva-uc.a.run.app/anonymize"


class PIIRedactor:
    def redact(self, text):
        analyzer_response = requests.post(
            analyzer_url,
            json={"text": text, "language": "en"},
        )
        analyzer_response.raise_for_status()
        analyzer_response_json = analyzer_response.json()

        anonymizer_response = requests.post(
            anonymizer_url,
            json={
                "text": text,
                "analyzer_results": analyzer_response_json,
            },
        )

        anonymizer_response.raise_for_status()
        anonymizer_response_json = anonymizer_response.json()
        return anonymizer_response_json["text"]
