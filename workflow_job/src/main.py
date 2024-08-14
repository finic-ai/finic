import json
import os
import random
import sys
import time

# Retrieve Job-defined env vars
TASK_INDEX = os.getenv("CLOUD_RUN_TASK_INDEX", 0)
TASK_ATTEMPT = os.getenv("CLOUD_RUN_TASK_ATTEMPT", 0)
# Retrieve User-defined env vars
SLEEP_MS = os.getenv("SLEEP_MS", 0)
FAIL_RATE = os.getenv("FAIL_RATE", 0)


# Define main script
def main(sleep_ms=0, fail_rate=0):
    """Program that simulates work using the sleep method and random failures.

    Args:
        sleep_ms: number of milliseconds to sleep
        fail_rate: rate of simulated errors
    """
    print(f"Starting Task #{TASK_INDEX}, Attempt #{TASK_ATTEMPT}...")
    # Simulate work by waiting for a specific amount of time
    time.sleep(float(sleep_ms) / 1000)  # Convert to seconds

    # Simulate errors
    random_failure(float(fail_rate))

    print(f"Completed Task #{TASK_INDEX}.")


def random_failure(rate):
    """Throws an error based on fail rate

    Args:
        rate: a float between 0 and 1
    """
    if rate < 0 or rate > 1:
        # Return without retrying the Job Task
        print(
            f"Invalid FAIL_RATE env var value: {rate}. "
            + "Must be a float between 0 and 1 inclusive."
        )
        return

    random_failure = random.random()
    if random_failure < rate:
        raise Exception("Task failed.")


# Start script
if __name__ == "__main__":
    try:
        main(SLEEP_MS, FAIL_RATE)
    except Exception as err:
        message = (
            f"Task #{TASK_INDEX}, " + f"Attempt #{TASK_ATTEMPT} failed: {str(err)}"
        )

        print(json.dumps({"message": message, "severity": "ERROR"}))
        sys.exit(1)  # Retry Job Task by exiting the process
