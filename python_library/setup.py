from setuptools import setup

# read the contents of your README file
from os import path

this_directory = path.abspath(path.dirname(__file__))
with open(path.join(this_directory, "README.md")) as f:
    long_description = f.read()

setup(
    name="finicapi",
    version="0.1.6",
    description="Finic.ai is a platform for deploying integrations and workflow automations in Python. This is the Python client for Finic",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="Ayan Bandyopadhyay",
    author_email="ayan@finic.ai",
    packages=["finicapi"],
    install_requires=[
        "requests",
    ],
    entry_points={
        "console_scripts": [
            "create-finic-app=finicapi.cli:create_finic_app",
            "finic-deploy=finicapi.cli:deploy",
        ],
    },
)
