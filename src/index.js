const core = require('@actions/core');
const fs = require('fs');
const PROMPT = `You are an AI-powered Documentation Accessibility Checker. Your task is to analyze documentation content and identify potential accessibility issues. You will be provided with the following:

*   **Documentation Content:** {documentation_content}
*   **Target Accessibility Standard (if any):** {accessibility_standard} (e.g., WCAG 2.1 AA, Section 508)
*   **Specific Accessibility Concerns (if any):** {specific_concerns} (e.g., alt text for images, color contrast, heading structure)

Based on this information, identify potential accessibility issues in the provided documentation. For each issue, provide:

1.  **Issue Description:** A clear explanation of the accessibility problem.
2.  **Location:** The specific location of the issue within the documentation content (e.g., paragraph number, image filename, code snippet). Be as precise as possible.
3.  **Severity:** A rating of the issue's severity (High, Medium, Low) based on its impact on users with disabilities.
4.  **Recommendation:** A specific and actionable recommendation for fixing the issue.
5.  **Relevant Accessibility Guideline (if applicable):** The specific guideline from {accessibility_standard} (if provided) that the issue violates.

If no accessibility issues are found, state "No accessibility issues found."

Present your findings in a structured format. For example:

**Issue 1:**

*   **Issue Description:** Missing alt text for image "logo.png".
*   **Location:** Image filename: logo.png
*   **Severity:** High
*   **Recommendation:** Add descriptive alt text to the image "logo.png" that accurately conveys its content and function. For example, "Company Logo - [Company Name]".
*   **Relevant Accessibility Guideline:** WCAG 2.1 AA, 1.1.1 Non-text Content

**Issue 2:**

*   **Issue Description:** Insufficient color contrast between text and background in the code example.
*   **Location:** Code snippet in paragraph 3.
*   **Severity:** Medium
*   **Recommendation:** Increase the contrast ratio between the `;
async function run() {
  try {
    const key = core.getInput('gemini_api_key');
    const token = core.getInput('service_token');
    const ctx = { repoName: process.env.GITHUB_REPOSITORY || '', event: process.env.GITHUB_EVENT_NAME || '' };
    try { Object.assign(ctx, JSON.parse(fs.readFileSync('package.json', 'utf8'))); } catch {}
    let prompt = PROMPT;
    for (const [k, v] of Object.entries(ctx)) prompt = prompt.replace(new RegExp('{' + k + '}', 'g'), String(v || ''));
    let result;
    if (key) {
      const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + key, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.3, maxOutputTokens: 2000 } })
      });
      result = (await r.json()).candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else if (token) {
      const r = await fetch('https://action-factory.walshd1.workers.dev/generate/documentation-accessibility-checker', {
        method: 'POST', headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify(ctx)
      });
      result = (await r.json()).content || '';
    } else throw new Error('Need gemini_api_key or service_token');
    console.log(result);
    core.setOutput('result', result);
  } catch (e) { core.setFailed(e.message); }
}
run();
