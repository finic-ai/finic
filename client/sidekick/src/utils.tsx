const utils = () => {
    const getMockResponse = async (responseType: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000))

        if (responseType === "Q&A") {
            return {
                "intent": "Q&A",
                "message": "Yes, you can run load tests on Airbyte running on Kubernetes. To do this, you will need to set up port-forwarding to the airbyte-server deployment using the following command:\r\n\r\n<code>kubectl port-forward deployment\/airbyte-server -n ab 8001:8001<\/code>\r\n\r\nThis will make the Airbyte server available at localhost:8001, and then you can proceed with running the load_test_airbyte.sh shell script as described in the content.\r\n\r\nNote that if your deployment of Airbyte happens to use Google Cloud Endpoints for authentication, you can use the -X option to pass an X-Endpoint-API-UserInfo header value.\r\n\r\nHere is an example command to run the load test on Kubernetes:\r\n\r\n<code>.\/tools\/bin\/load_test\/load_test_airbyte.sh -W <workspace id> -C <num_connections> -H localhost -P 8001 -X <your_endpoints_user_info_header_value><\/code></your_endpoints_user_info_header_value>"
            }
        }
        else {
            return {
                "intent": "Troubleshoot",
                "issue_summary": "The user is asking how to run a loadtest.",
                "questions": [
                    "Do you have the airbyte-test-utils package installed?",
                    "Do you have access to the Airbyte instance's server?",
                    "Do you have the necessary authentication credentials?"
                ],
                "suggestion": "To run a load test, you can use the load_test_airbyte.sh shell script. From your top-level /airbyte directory, run the following command: ./tools/bin/load_test/load_test_airbyte.sh -W <workspace id> -C <num_connections>. Make sure to replace <workspace id> with the ID of the workspace where you want to create the connections, and <num_connections> with the number of connections you want to create. If necessary, you can also use flags to override the default settings",
                "code_example": "<code>./tools/bin/load_test/load_test_airbyte.sh -W my_workspace -C 10</code>"
            }
        }
    }
    
    const post = (url: string, data: any) => {
        return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            return data
        })
    }
    
    return {
        getMockResponse,
        post,
    }
}

export default utils