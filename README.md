<h2 align="center">
🦊 Finic
</h2>

<p align="center">
  <p align="center">Build and deploy browser agents.</p>
</p>
<p align="center">
<a href="https://github.com/psychicapi/psychic/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/static/v1?label=license&message=Apache 2.0&color=blue" alt="License">
</a>
<a href="https://github.com/psychicapi/psychic/issues?q=is%3Aissue+is%3Aclosed" target="_blank">
    <img src="https://img.shields.io/github/issues-closed/psychicapi/psychic?color=blue" alt="Issues">
</a>
  <a href="https://finic.ai/docs" target="_blank">
    <img src="https://img.shields.io/badge/documentation-blue">
  </a>
  <a href="https://www.ycombinator.com/companies/finic" target="_blank">
    <img src="https://img.shields.io/badge/Backed%20by%20Y%20Combinator-orange">
  </a>
</p>

[Finic](https://finic.ai/) is a cloud platform designed to simplify the deployment and management of browser-based automation agents, with a focus on fault-tolerant execution. It’s designed for quickly launching bots, scrapers, RPA integrationsm and other jobs that depend on multiple authenticated web services. Finic uses [Playwright](https://github.com/microsoft/playwright-python) to interact with DOM elements, and recommends [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/) for HTML parsing.



https://github.com/user-attachments/assets/19e45af1-5295-45f5-9a65-b4e833a98485



## Features:
* **Cloud Deployment:** Deploy a pre-configured Playwright container to Finic Cloud with a single command. Trigger agents from the Finic dashboard or API.
* **Secure Credential Management:** Safely store and access credentials using Finic’s built-in secret manager.
* **Monitoring:** Track agent execution and view detailed logs through the Finic dashboard.


## Quickstart
Install Finic.
```bash
pip install finicapi
```

Create a new agent with boilerplate code that logs into a website and extracts HTML content.
```bash
create-finic-app example-project
cd example-project
```

Run your agent locally.
```bash
poetry install
poetry run start
```

Deploy your agent to Finic Cloud.
```bash
finic-deploy
```

View and run your agent from the [Finic dashboard](https://app.finic.ai/agents).

## 🚧 Roadmap
* Automated deployment from GitHub.
* Containers with X11 installed for advanced UI automation.
* Session impersonation - sync session tokens to the secret manager so your agents can use them.
* Self healing selectors - use LLMs to propose code fixes when the content changes on target websites.
* Scheduling and orchestration features to define workflows composed of multiple agents.
* Automatically detect rate limits and back off to maximize throughput.
* Set custom timeouts with no upper bound, useful for long running tasks or always-on agents.
