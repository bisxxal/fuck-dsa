import fs from "node:fs"
import path from "node:path"
import { app } from "electron"
import { EventEmitter } from "events"
import { OpenAI } from "openai"


interface Config {
    apiKey: string;
    apiProvider: "openai" | "gemini" | "anthropic";  // Added provider selection
    extractionModel: string;
    solutionModel: string;
    debuggingModel: string;
    language: string;
    opacity: number;
}
class ConfigHelper extends EventEmitter {
    private configPath: string; // path to the config file

    private defaultConfig: Config = {
        apiKey: "",
        apiProvider: "gemini", // Default to Gemini
        extractionModel: "gemini-2.0-flash", // Default to Flash for faster responses
        solutionModel: "gemini-2.0-flash",
        debuggingModel: "gemini-2.0-flash",
        language: "python",
        opacity: 1.0
    };
    constructor() {
        super();
        try {
            // Use the app's user data directory to store the config
            this.configPath = path.join(app.getPath("userData"), "config.json");

        } catch (error) {
            console.warn('Could not access user data path, using fallback');
            this.configPath = path.join(process.cwd(), 'config.json');
        }
        // Ensure the initial config file exists
        this.ensureConfigExists();
    }
    private ensureConfigExists(): void {
        try {
            if (!fs.existsSync(this.configPath)) {
                this.saveConfig(this.defaultConfig);
            }
        }
        catch (err) {

        }
    }

    private sanitizeModelSelection(model: string, provider: "openai" | "gemini" | "anthropic"): string {
        if (provider === "openai") {
            const allowedModels = ['gpt-4o', 'gpt-4o-mini'];
            if (!allowedModels.includes(model)) {
                console.warn(`Invalid OpenAI model specified: ${model}. Using default model: gpt-4o`);
                return 'gpt-4o';
            }
            return model;
        } else if (provider === "gemini") {
            const allowedModels = ['gemini-1.5-pro', 'gemini-2.0-flash'];
            if (!allowedModels.includes(model)) {
                console.warn(`Invalid Gemini model specified: ${model}. Using default model: gemini-2.0-flash`);
                return 'gemini-2.0-flash';
            }
            return model;
        } else if (provider === "anthropic") {
            const allowedModels = ['claude-3-7-sonnet-20250219', 'claude-3-5-sonnet-20241022', 'claude-3-opus-20240229'];
            if (!allowedModels.includes(model)) {
                console.warn(`Invalid Anthropic model specified: ${model}. Using default model: claude-3-7-sonnet-20250219`);
                return 'claude-3-7-sonnet-20250219';
            }
            return model;
        }
        return model;
    }

    public loadConfig(): Config {
        try {
            if (fs.existsSync(this.configPath)) {
                const config = JSON.parse(fs.readFileSync(this.configPath, "utf-8"));

                if (config.apiProvider !== "openai" && config.apiProvider !== "gemini" && config.apiProvider !== "anthropic") {
                    config.apiProvider = "gemini";
                }
                if (config.extractionModel) {
                    config.extractionModel = this.sanitizeModelSelection(config.extractionModel, config.apiProvider);
                }
                if (config.solutionModel) {
                    config.solutionModel = this.sanitizeModelSelection(config.solutionModel, config.apiProvider);
                }
                if (config.debuggingModel) {
                    config.debuggingModel = this.sanitizeModelSelection(config.debuggingModel, config.apiProvider);
                }
                return {
                    ...this.defaultConfig,
                    ...config
                };
            }
            // If no config exists, create a default one
            this.saveConfig(this.defaultConfig);
            return this.defaultConfig;
        }
        catch (err) {
            console.error("Error loading config:", err);
            return this.defaultConfig;
        }
    }

    // Save configuration to disk
    public saveConfig(config: Config): void {
        try {
            // Ensure the directory exists
            const configDir = path.dirname(this.configPath);
            if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir, { recursive: true });
            }
            // Write the config  
            fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
        } catch (err) {
            console.error("Error saving config:", err);
        }
    }

    // update specific config
    public updateConfig(updates: Partial<Config>): Config {
        try {
            const currentConfig = this.loadConfig();
            let provider = updates.apiProvider || currentConfig.apiProvider;

            // Auto-detect provider based on API key format if a new key is provided
            if (updates.apiKey && !updates.apiProvider) {
                // If API key starts with "sk-", it's likely an OpenAI key
                if (updates.apiKey.trim().startsWith('sk-')) {
                    provider = "openai";
                    console.log("Auto-detected OpenAI API key format");
                } else if (updates.apiKey.trim().startsWith('sk-ant-')) {
                    provider = "anthropic";
                    console.log("Auto-detected Anthropic API key format");
                } else {
                    provider = "gemini";
                    console.log("Using Gemini API key format (default)");
                }

                // Update the provider in the updates object
                updates.apiProvider = provider;
            }

            // If provider is changing, reset models to the default for that provider
            if (updates.apiProvider && updates.apiProvider !== currentConfig.apiProvider) {
                if (updates.apiProvider === "openai") {
                    updates.extractionModel = "gpt-4o";
                    updates.solutionModel = "gpt-4o";
                    updates.debuggingModel = "gpt-4o";
                } else if (updates.apiProvider === "anthropic") {
                    updates.extractionModel = "claude-3-7-sonnet-20250219";
                    updates.solutionModel = "claude-3-7-sonnet-20250219";
                    updates.debuggingModel = "claude-3-7-sonnet-20250219";
                } else {
                    updates.extractionModel = "gemini-2.0-flash";
                    updates.solutionModel = "gemini-2.0-flash";
                    updates.debuggingModel = "gemini-2.0-flash";
                }
            }

            // Sanitize model selections in the updates
            if (updates.extractionModel) {
                updates.extractionModel = this.sanitizeModelSelection(updates.extractionModel, provider);
            }
            if (updates.solutionModel) {
                updates.solutionModel = this.sanitizeModelSelection(updates.solutionModel, provider);
            }
            if (updates.debuggingModel) {
                updates.debuggingModel = this.sanitizeModelSelection(updates.debuggingModel, provider);
            }

            const newConfig = { ...currentConfig, ...updates };
            this.saveConfig(newConfig);

            // Only emit update event for changes other than opacity
            // This prevents re-initializing the AI client when only opacity changes
            if (updates.apiKey !== undefined || updates.apiProvider !== undefined ||
                updates.extractionModel !== undefined || updates.solutionModel !== undefined ||
                updates.debuggingModel !== undefined || updates.language !== undefined) {
                this.emit('config-updated', newConfig);
            }

            return newConfig;
        } catch (error) {
            console.error('Error updating config:', error);
            return this.defaultConfig;
        }
    }
    public hasApiKey(): boolean {
        const config = this.loadConfig();
        return !!config.apiKey && config.apiKey.trim().length > 0;
    }


    public isValidApiKeyFormat(apiKey: string, provider?: "openai" | "gemini" | "anthropic"): boolean {
        const key = apiKey.trim();

        if (!key) return false;

        // Auto-detect provider if not supplied
        if (!provider) {
            if (key.startsWith("sk-ant-")) {
                provider = "anthropic";
            } else if (key.startsWith("sk-")) {
                provider = "openai";
            } else {
                provider = "gemini";
            }
        }

        switch (provider) {
            case "openai":
                return /^sk-[a-zA-Z0-9-_]{20,}$/.test(key);

            case "anthropic":
                return /^sk-ant-[a-zA-Z0-9-_]{20,}$/.test(key);

            case "gemini":
                return /^[a-zA-Z0-9-_]{30,}$/.test(key) && !key.startsWith("sk-");

            default:
                return false;
        }
    }

    public getOpacity(): number {
        const config = this.loadConfig();
        return config.opacity !== undefined ? config.opacity : 1.0;
    }

    public setOpacity(opacity: number): void {
        // Ensure opacity is between 0.1 and 1.0
        const validOpacity = Math.min(1.0, Math.max(0.1, opacity));
        this.updateConfig({ opacity: validOpacity });
    }


    public getLanguage(): string {
        const config = this.loadConfig();
        return config.language || "python";
    }

    public async testApiKey(apiKey: string, provider?: "openai" | "gemini" | "anthropic"): Promise<{ valid: boolean; error?: string }> {
        const key = apiKey.trim();

        if (!key) {
            return { valid: false, error: "API key is empty" };
        }

        // Auto-detect provider if not specified
        if (!provider) {
            if (key.startsWith("sk-ant-")) {
                provider = "anthropic";
            } else if (key.startsWith("sk-")) {
                provider = "openai";
            } else if (key.length >= 30) {
                provider = "gemini";
            } else {
                return { valid: false, error: "Unable to detect API provider" };
            }
        }

        try {
            switch (provider) {
                case "openai":
                    return await this.testOpenAIKey(key);

                case "anthropic":
                    return await this.testAnthropicKey(key);

                case "gemini":
                    return await this.testGeminiKey(key);

                default:
                    return { valid: false, error: "Unknown API provider" };
            }
        } catch (err: any) {
            return {
                valid: false,
                error: err?.message ?? "API key validation failed",
            };
        }
    }

    private async testOpenAIKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
        const key = apiKey.trim();

        // 1️⃣ Basic format check (prevents useless API calls)
        if (!/^sk-[a-zA-Z0-9-_]{20,}$/.test(key)) {
            return { valid: false, error: "Invalid OpenAI API key format." };
        }

        try {
            const openai = new OpenAI({
                apiKey: key,
                timeout: 8000, // prevents hanging requests
            });

            // Lightweight validation call
            await openai.models.list();

            return { valid: true };

        } catch (error: any) {
            const status =
                error?.status ??
                error?.response?.status ??
                error?.cause?.status;

            if (status === 401 || status === 403) {
                return {
                    valid: false,
                    error: "Invalid OpenAI API key.",
                };
            }

            if (status === 429) {
                return {
                    valid: false,
                    error: "OpenAI rate limit or quota exceeded.",
                };
            }

            if (status >= 500) {
                return {
                    valid: false,
                    error: "OpenAI server error. Please try again later.",
                };
            }

            if (error?.name === "AbortError") {
                return {
                    valid: false,
                    error: "OpenAI validation request timed out.",
                };
            }

            return {
                valid: false,
                error: "Network error validating OpenAI API key.",
            };
        }
    }
    private async testGeminiKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {

        const key = apiKey.trim();
        if (!key || key.length < 30) {
            return { valid: false, error: "Invalid Gemini API key format." };
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`,
                {
                    method: "POST",
                    signal: controller.signal,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: "ping" }] }],
                    }),
                }
            );

            clearTimeout(timeout);

            if (response.status === 200) {
                return { valid: true };
            }

            if (response.status === 401 || response.status === 403) {
                return { valid: false, error: "Invalid Gemini API key." };
            }

            if (response.status === 429) {
                return { valid: false, error: "Gemini rate limit exceeded." };
            }

            return {
                valid: false,
                error: `Gemini validation failed (status ${response.status}).`,
            };
        } catch (err: any) {
            if (err.name === "AbortError") {
                return { valid: false, error: "Gemini validation timed out." };
            }

            return {
                valid: false,
                error: "Network error validating Gemini API key.",
            };
        }
    }

    private async testAnthropicKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
        const key = apiKey.trim();

        if (!/^sk-ant-[a-zA-Z0-9-_]{20,}$/.test(key)) {
            return { valid: false, error: "Invalid Anthropic API key format." };
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        try {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": key,
                    "anthropic-version": "2023-06-01",
                },
                body: JSON.stringify({
                    model: "claude-3-haiku-20240307",
                    max_tokens: 1,
                    messages: [{ role: "user", content: "ping" }],
                }),
            });

            clearTimeout(timeout);

            if (response.status === 200) {
                return { valid: true };
            }

            if (response.status === 401 || response.status === 403) {
                return { valid: false, error: "Invalid Anthropic API key." };
            }

            if (response.status === 429) {
                return { valid: false, error: "Anthropic rate limit exceeded." };
            }

            return {
                valid: false,
                error: `Anthropic validation failed (status ${response.status}).`,
            };
        } catch (err: any) {
            if (err.name === "AbortError") {
                return { valid: false, error: "Anthropic validation timed out." };
            }

            return {
                valid: false,
                error: "Network error validating Anthropic API key.",
            };
        }
    }

}
export const configHelper = new ConfigHelper();
