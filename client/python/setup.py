from setuptools import setup

setup(
    name='psychicapi',
    version='0.2',
    description='Psychic.dev is an open-source universal data connector for knowledgebases.',
    author='Ayan Bandyopadhyay',
    author_email='ayan@getsidekick.ai',
    packages=['psychicapi'],
    install_requires=[
        'requests',
    ],
)
