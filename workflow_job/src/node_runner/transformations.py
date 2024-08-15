import io
from fastapi import UploadFile
from typing import List, Optional, Tuple, Dict, Any
from models.models import (
    AppConfig,
    User,
    Workflow,
    Edge,
    Node,
    NodeType,
    MappingTransformConfig,
    PythonTransformConfig,
    JoinTransformConfig,
)
import copy
import numpy as np
import pandas as pd
import subprocess
import venv
import os
import ast


def run_mapping_node(
    node_config: MappingTransformConfig,
    inputs: List[str],
    interim_results: Dict[str, List[List[Any]]],
):
    # Run the mapping transformation

    if len(inputs) == 0:
        return
    elif len(inputs) > 1:
        raise ValueError("Mapping node can only have one input")
    input_table = interim_results[inputs[0]]

    # get the mapping
    mappings = node_config.mappings
    # apply the mapping
    output_table = pd.DataFrame(input_table[1:], columns=input_table[0])
    # rename the columns according to the mapping and drop the columns that are not in the mapping
    output_table = output_table.rename(
        columns={mapping.old_name: mapping.new_name for mapping in mappings}
    )
    output_table = output_table[[mapping.new_name for mapping in mappings]]

    return [output_table.columns.tolist()] + output_table.values.tolist()


def run_python_node(
    node_config: PythonTransformConfig,
    inputs: List[str],
    interim_results: Dict,
):
    assert len(inputs) >= 1
    # Run the python transformation

    print("Running python node")

    # Step 1: Create a new virtual environment
    env_name = f"subprocess_env"
    venv_dir = os.path.join(os.getcwd(), env_name)

    venv.create(venv_dir, with_pip=True)

    libraries = node_config.dependencies

    # Step 2: Install pandas in the new virtual environment
    subprocess.check_call([os.path.join(venv_dir, "bin", "pip"), "install"] + libraries)

    python_path = os.path.join(venv_dir, "bin", "python")

    script = node_config.code

    # pass the input data to the python script

    script_input = {}
    for input in inputs:
        script_input[input] = interim_results[input]

    script = f"inputs = {script_input}\n" + script

    # Get the output of the python script
    script += "\nprint(finic_handler(inputs))"

    result = subprocess.run(
        [python_path, "-c", script],
        input=str(interim_results[inputs[0]]),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        env={**os.environ, "PYTHONPATH": venv_dir},
    )

    print("result", result.stdout)
    print("error", result.stderr)
    print(result)

    output = ast.literal_eval(result.stdout)

    # replace all NaN values with None
    output = [[None if pd.isna(value) else value for value in row] for row in output]

    return output
