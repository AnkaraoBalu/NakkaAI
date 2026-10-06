# Fuelix admin setup

Deploy the updated backend and frontend, and apply database migration
`011_fuelix_provider.sql` using the existing migration command. Keep
`PROVIDER_KEYS_SECRET` set to the existing server encryption secret.

1. In **Admin > Provider Keys**, choose **Fuelix**, add your Fuelix API key,
   and save it. The key is encrypted; only its last four characters are shown.
   The automatic key test requests `https://api.fuelix.ai/v1/models` using
   Bearer authentication. It checks access to the model list, not every model.
2. In **Admin > Plans**, edit the desired plan and click
   **Add GPT-5.4 via Fuelix**, or add a model manually:
   - Model ID: `gpt-5.4`
   - Provider: **Fuelix**
   - Provider model name: `gpt-5.4`
   - Input/output/cache prices: the rates charged by your Fuelix account.
3. Set the plan's allowance windows before allowing users to spend its credit.
   Prices and allowance budgets are not automatically filled in.
4. Sign in to Nakka again to refresh the extension's model cache. Its model
   list is served by Nakka; the backend attaches the saved Fuelix key and
   forwards GPT requests to `https://api.fuelix.ai/v1/chat/completions`.

The extension's `provider: openai` is its wire protocol. In the server admin
plan, select **Fuelix** so the server uses the Fuelix key and endpoint.
You do not need an OpenAI API key or a provider key in the extension YAML.

`FUELIX_BASE_URL` optionally overrides the full Chat Completions endpoint.
Only OpenAI-compatible models are supported through this Fuelix route.
Model availability and live completions must be tested after you add your key.
