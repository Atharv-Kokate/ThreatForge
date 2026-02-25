# OWASP Single Top 10 for Large Language Model (LLM) Applications
*Comprehensive Knowledge Base for Risk Analysis Context*

This document serves as a knowledge base for analyzing AI/ML systems against the OWASP Top 10 for LLM Applications. It provides definitions, attack vectors, and specific mitigation strategies based on system configurations.

---

## LLM01: Prompt Injection

### Description
Prompt Injection occurs when an attacker manipulates the functioning of a Large Language Model (LLM) through crafted inputs. This can cause the LLM to ignore its pre-programmed instructions and execute the attacker's intent.

### Types
1.  **Direct Injection (Jailbreaking)**: Overwriting the system prompt directly via user input (e.g., "Ignore previous instructions and do X").
2.  **Indirect Injection**: The LLM processes tainted external content (e.g., a website or email) that contains hidden instructions to manipulate the model.

### Risk Factors (System Configuration Signs)
*   **User Input**: `Text` inputs are highly susceptible.
*   **Prompt Guardrails**: `No` or "None". A lack of guardrails is a critical vulnerability.
*   **Access**: Publicly accessible APIs or Chat interfaces.

### Mitigation Strategies
*   **Privilege Control**: The LLM should not have root/admin access to backend systems.
*   **Human in the Loop**: Require user approval for privileged actions.
*   **Segregation**: Separate content from instructions in the prompt (e.g., using delimiters like `###`).
*   **Guardrails**: Implement specific input filters (e.g., NeMo Guardrails, NVIDIA) to detect injection attempts.

---

## LLM02: Insecure Output Handling

### Description
This vulnerability occurs when an LLM's output is blindly trusted and passed directly to backend systems, databases, or browsers without sanitization or validation. This allows the LLM (potentially compromised prompt injection) to execute XSS, CSRF, or SSRF attacks.

### Risk Factors (System Configuration Signs)
*   **Output Consumption**: Output is sent to `Databases`, `Shell`, or `HTML/Browser`.
*   **Integrations**: The model is connected to `SQL` databases or `APIs`.
*   **Data Sanitization**: `No`. Failing to sanitize output is the primary cause.

### Mitigation Strategies
*   **Zero Trust**: Treat all LLM output as untrusted user input.
*   **Encoding**: Apply proper output encoding (HTML, JavaScript, SQL) before rendering or executing.
*   **Sandboxing**: Run code execution capabilities in isolated environments.

---

## LLM03: Training Data Poisoning

### Description
Attackers manipulate the training data or fine-tuning data of the LLM to introduce vulnerabilities, backdoors, or biases. This compromises the model's security, effectiveness, or ethical behavior.

### Risk Factors (System Configuration Signs)
*   **Data Sources**: Using unverified `Public Datasets`, `Web Scraped` data, or `User Feedback`.
*   **Maintenance**: `Fine-tuning` processes that do not validate input data.
*   **Supply Chain**: Relying on external, unverified pre-trained models.

### Mitigation Strategies
*   **Supply Chain Verification**: Verify the provenance of all training data (SBOM).
*   **Sandboxing**: Verify data sources and "clean" datasets before use.
*   **Robustness Testing**: Use techniques like federated learning or adversarial training to detect outliers.

---

## LLM04: Model Denial of Service (DoS)

### Description
Attackers interact with an LLM in a way that consumes an exceptionally high amount of resources (tokens, context window, compute), degrading quality of service or incurring high costs (Resource exhaustion).

### Risk Factors (System Configuration Signs)
*   **Access Methods**: Public `API` access without rate limiting.
*   **Model Type**: Using very large, expensive models (e.g., `GPT-4`) without quotas.
*   **Traffic**: High volume of automated requests.

### Mitigation Strategies
*   **Rate Limiting**: Implement strict per-user and per-IP rate limits.
*   **Resource Caps**: Limit the number of queuing steps or total tokens per request.
*   **Input Validation**: Restrict the size (length) of user inputs before they reach the LLM.

---

## LLM05: Supply Chain Vulnerabilities

### Description
The application lifecycle depends on third-party components: pre-trained models, datasets, and plugins. Expanding the attack surface through vulnerable dependencies (e.g., a malicious PyPi package or a compromised HuggingFace model).

### Risk Factors (System Configuration Signs)
*   **Model Source**: Downloading models from public hubs without verification (`HuggingFace`, `CivitAI`).
*   **Integrations**: Using numerous third-party `Plugins`.
*   **Environment**: Outdated libraries (e.g., old `transformers` or `langchain` versions).

### Mitigation Strategies
*   **SBOM**: Maintain a Software Bill of Materials for all AI components.
*   **Scanning**: Regularly scan model files (e.g., `.pkl`, `.pt`) for malware (Pickle scanning).
*   **Vetting**: Only use models from trusted publishers.

---

## LLM06: Sensitive Information Disclosure

### Description
The LLM may inadvertently reveal confidential information, proprietary algorithms, or other sensitive data in its responses. This can happen if the model was trained on sensitive data (PII) or if the context window includes private data.

### Risk Factors (System Configuration Signs)
*   **Data Handling**: Contains `Sensitive`, `PII`, `PHI`, or `Secrets`.
*   **Sanitization**: `No sanitization` before model use.
*   **Multi-tenant**: `Yes` - Risk of data leakage between tenants if context isn't isolated.

### Mitigation Strategies
*   **Data Scrubbing**: Sanitize and scrub PII/PHI from training and RAG context data.
*   **Output Filtering**: Implement regex-based filters on the output to catch patterns like SSNs or Keys.
*   **Access Control**: Ensure the LLM only has access to data the current user is authorized to see (Authorization-aware Retrieval).

---

## LLM07: Insecure Plugin Design

### Description
LLM plugins (extensions) often accept free-text input and bridge the LLM to external actions. If these plugins do not enforce strict input validation and access control, they can be exploited to perform unauthorized actions (like sending emails or deleting files).

### Risk Factors (System Configuration Signs)
*   **Integrations**: System uses `Plugins` or `Tools` (e.g., Zapier, Email, GitHub).
*   **Interaction Control**: `No` prompt guardrails or confirmation steps.
*   **Auth**: Plugins running with broad permissions.

### Mitigation Strategies
*   **Parameterized Inputs**: Force plugins to accept typed parameters, not raw text.
*   **Least Privilege**: Plugins should run with the minimum necessary identity/scope.
*   **User Confirmation**: Require explicit "Yes/No" from the human before a plugin executes a side-effect (e.g., "Send email?").

---

## LLM08: Excessive Agency

### Description
Granting an LLM excessive permissions, autonomy, or ability to "reason" and execute chains of actions without adequate supervision. This can lead to unexpected and potentially harmful outcomes if the model hallucinates or is tricked.

### Risk Factors (System Configuration Signs)
*   **System Type**: `Autonomous Agent` or `AutoGPT`.
*   **Human in Loop**: `No`.
*   **Permissions**: Read/Write access to critical systems.

### Mitigation Strategies
*   **Limit Scope**: Restrict the tools and functions the LLM can call.
*   **Human Oversight**: Mandate human approval for high-impact actions.
*   **Timeouts**: Avoid open-ended loops where the agent can invoke itself indefinitely.

---

## LLM09: Overreliance

### Description
Users or systems trusting the LLM's output without verification. This "hallucination" risk can lead to bad automated decisions, insecure code generation, or misinformation.

### Risk Factors (System Configuration Signs)
*   **Criticality**: `High` or `Safety-critical`.
*   **Output Consumption**: Automated downstream processing without human review.
*   **Explainability**: `No` mechanism to trace why a decision was made.

### Mitigation Strategies
*   **Disclaimers**: Explicitly label AI output as potentialy inaccurate.
*   **Verification**: Cross-reference output with trusted sources (RAG is a mitigation here!).
*   **Code Review**: Never deploy LLM-generated code without manual security review.

---

## LLM10: Model Theft

### Description
Unauthorized access to, copying of, or "distillation" of proprietary LLM models. This includes extracting the model weights or querying the API to replicate its behavior (training a shadow model).

### Risk Factors (System Configuration Signs)
*   **Visibility**: `Public` or `External`.
*   **Deployment**: `On-premise` (risk of physical theft) or `Edge` device.
*   **Access Control**: Weak `Authentication` on the inference API.

### Mitigation Strategies
*   **Access Control**: Strong API key management and role-based access.
*   **Watermarking**: Watermark model outputs to detect distillation.
*   **Audit Logs**: Monitor for unusual query patterns (e.g., extraction attacks).
