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

[Finic](https://finic.ai/) is an open source python-based integration platform (iPaaS), an alternative for enterprise integration platforms like **Boomi**, **MuleSoft**, and **Tray**. Finic is designed to be simple enough for business users to use, but flexible enough for developers and solutions architects to build complex integrations directly in code.

https://github.com/user-attachments/assets/00f1ebd0-868b-4383-9050-ad714e48e890

Features:
* 🐣 **Drag and Drop UI:** A web UI for designing and testing new integration workflows.
* 🐣 **Declarative Connector Engine (TBD):** Finic will launch with a connector engine that supports API and SFTP connections configured via JSON. The connector engine will handle all network-level infrastructure (auth, retries, error handling, secrets management) so new connectors can be built in a matter of hours.
* 🧑‍💻 **Hybrid Code/No-Code Platform:** Finic is developer-first and includes a configurable python enviornment for each workflow, so you can install packages you need to process data at each step. At the same time, optional Gen AI features make it easy for non-technical users to review, understand, and even propose changes to work flows.

Benefits:
* **Decouple integration from product code:** Finic offers a highly configurable integrations framework so you can separate product code from integrations code.
* **Flexibility without complexity:** Finic is designed to give developers maximum flexibility without having to learn a new language or complex interface.
* **Open source:** Finic is open source, not just copyleft or source-available, so you can deploy to your own cloud with minimal compliance/legal friction.

## 🚧 Roadmap
* Docs and quickstart guide
* Github integration for version control
* VSCode integraiton for local development
* Generative AI features
* Monitoring
* Finic cloud
* Containerization for easy self-hosting

## 🙋🏻‍♂️ FAQs
### Is Finic an ETL tool?
While Finic can be used to extract, transform, and load data, it is not an ETL tool in the traditional sense. It provides higher level abstractions than ETL orchestration tools like Airflow or Dagster to make it usable by business teams, but it's not (yet) optimized for efficient processing of very large datasets. Finic is intended to be used for integrating functionality between different applications via APIs or SFTP.


### How does Finic compare to other integration platforms?
![Table-item-1](https://github.com/user-attachments/assets/ba6d315b-a792-4eed-812c-86257dbb29ba)
