export default {
  summary: { high: 2, medium: 3, low: 1 },
  risks: [
    {
      id: 1,
      name: "Prompt Injection",
      category: "Model/Prompt",
      severity: "High",
      confidence: 0.93,
      description:
        "Untrusted input may manipulate system prompts or context to influence outputs.",
      mitigation:
        "Use prompt templates, input sanitization, and allowlists.",
    },
    {
      id: 2,
      name: "Data Poisoning",
      category: "Data",
      severity: "High",
      confidence: 0.87,
      description: "Unverified data can corrupt model training.",
      mitigation:
        "Validate data, perform provenance checks, monitor anomalies.",
    },
    {
      id: 3,
      name: "Insecure Model API",
      category: "API",
      severity: "Medium",
      confidence: 0.8,
      description: "Public APIs without auth can be abused.",
      mitigation: "Use OAuth/JWT, rate limits, input validation.",
    },
    {
      id: 4,
      name: "Model Inversion",
      category: "Privacy",
      severity: "Medium",
      confidence: 0.6,
      description: "Attackers may reconstruct training data.",
      mitigation: "Use differential privacy, output obfuscation.",
    },
    {
      id: 5,
      name: "Supply Chain Attack",
      category: "SupplyChain",
      severity: "Medium",
      confidence: 0.55,
      description: "Compromised dependencies or models.",
      mitigation: "Use signed artifacts and integrity checks.",
    },
    {
      id: 6,
      name: "Insufficient Monitoring",
      category: "Ops",
      severity: "Low",
      confidence: 0.45,
      description: "Lack of alerts delays detection.",
      mitigation: "Enable central logging and alerts.",
    },
  ],
};
