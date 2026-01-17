"use client";

import { useEffect, useState } from "react";

export default function TestAppwritePage() {
    const [result, setResult] = useState<string>("Testing...");

    useEffect(() => {
        async function testConnection() {
            const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
            const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

            setResult(`Config: endpoint=${endpoint}, project=${projectId}\n\nTesting direct fetch...`);

            try {
                // Test 1: Direct fetch with X-Appwrite-Project header
                const response = await fetch(`${endpoint}/health/version`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Appwrite-Project": projectId!,
                    },
                });

                const text = await response.text();
                setResult((prev) => prev + `\n\nHealth check response (${response.status}): ${text}`);

                // Test 2: Try account endpoint
                const accountResponse = await fetch(`${endpoint}/account`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Appwrite-Project": projectId!,
                    },
                });

                const accountText = await accountResponse.text();
                setResult((prev) => prev + `\n\nAccount check response (${accountResponse.status}): ${accountText}`);

            } catch (error: any) {
                setResult((prev) => prev + `\n\nError: ${error.message}\n${error.stack}`);
            }
        }

        testConnection();
    }, []);

    return (
        <div className="p-8 font-mono text-sm whitespace-pre-wrap">
            <h1 className="text-xl font-bold mb-4">Appwrite Connection Test</h1>
            <div className="bg-muted p-4 rounded">{result}</div>
        </div>
    );
}
