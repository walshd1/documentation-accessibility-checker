# Documentation Accessibility Checker

Checks documentation for accessibility issues (e.g., alt text, color contrast) using AI to understand content.

## Free
```yaml
- uses: walshd1/documentation-accessibility-checker@v1
  with:
    gemini_api_key: ${{ secrets.GEMINI_API_KEY }}
```

## Paid (cost + 4.75%)
```yaml
- uses: walshd1/documentation-accessibility-checker@v1
  with:
    service_token: ${{ secrets.ACTION_FACTORY_TOKEN }}
```
