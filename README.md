<h2 align="center">
🦊 Finic (alpha 0.1.1)
</h2>

<p align="center">
  <p align="center">Build complex integrations in python.</p>
</p>
<p align="center">
<a href="https://github.com/psychicapi/psychic/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/static/v1?label=license&message=Apache 2.0&color=blue" alt="License">
</a>
<a href="https://github.com/psychicapi/psychic/issues?q=is%3Aissue+is%3Aclosed" target="_blank">
    <img src="https://img.shields.io/github/issues-closed/psychicapi/psychic?color=blue" alt="Issues">
</a>
</p>

[Finic](https://finic.ai/) is an open source python-based integration platform (iPaaS), an alternative for enterprise integration platforms like **Boomi**, **MuleSoft**, and **Tray**. Finic is designed to be simple enough for business users to create v1 integrations with minimal code, but flexible enough for developers and solutions architects to build complex integrations directly in python.

Features:
* 🐣 **Drag and Drop UI:** A low-code web UI for designing and testing new integration workflows. Includes pre-built transformation nodes that can be extended to cover any use case from field mapping and aggregation, to data normalization and type conversions in python, to LLM-powered data extraction from unstructured documents.
* 🧑‍💻 **Dedicated Python Environment:** A configurable python enviornment for each workflow, so you can install packages you need to process data at each step.
* 🪄 **Generative AI Features:** Optional features that leverage LLMs to: 1) save time on tedius tasks like mapping fields and writing transformations and 2) enable business users to understand the workflow and generate simple transformations themselves.

Benefits:
* **Decouple integration from product code:** Finic offers a highly configurable integrations framework so you can separate product code from integrations code.
* **Faster and flexible integrations:** Finic is designed to help teams implement the long tail of custom connectors that out-of-the-box integration platforms don't support.
* **Open source:** Finic is open source, not just copyleft or source-available, so you can deploy to your own cloud with minimal compliance/legal friction.

## 🚧 Roadmap
* Docs and quickstart guide - TBD
* Generative AI features- TBD
* Monitoring - TBD
* Finic cloud - TBD
* Containerization for easy self-hosting - TBD
* Github integration for version control - TBD

## 🙋🏻‍♂️ FAQs
### Is Finic an ETL tool?
While Finic can be used to extract, transform, and load data, it is not an ETL tool in the traditional sense. It provides higher level abstractions than ETL orchestration tools like Airflow or Dagster to make it usable by business teams, but it's not (yet) optimized for efficient processing of very large datasets. Finic is intended to be used for integrating functionality between different applications via APIs or SFTP.

### Is Finic a workflow automation tool?
While Finic can be used by non-technical users, Finic is not a workflow automation tool. Workflow automation tools tend to focus on simple use cases that require connecting applications with standardized APIs, while iPaaS' are optimized for complex use cases that often require substantial data normalization. Finic also operates on a paradigm of many sources to one destination, which means it's not possible to chain together API calls that trigger downstream effects across multiple applications. This also makes it less brittle than workflow automation platforms that fail entirely if a single application in the stack errors out.

### How does Finic compare to other integration platforms?
![Table-item-1](https://github.com/user-attachments/assets/ba6d315b-a792-4eed-812c-86257dbb29ba)
