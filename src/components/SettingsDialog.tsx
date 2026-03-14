import { useState, useEffect } from "react";
import { toastError, toastSuccess } from "@/provider/toast";
import KeyboardShotcuts from "./ui/keyboardShotcuts";
import { modelCategories } from "@/utils/modelsConfig";

type APIProvider = "openai" | "gemini" | "anthropic";

interface SettingsDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function SettingsDialog({ open: externalOpen, onOpenChange }: SettingsDialogProps) {
    const [open, setOpen] = useState(externalOpen || false);
    const [apiKey, setApiKey] = useState("");
    const [apiProvider, setApiProvider] = useState<APIProvider>("openai");
    const [extractionModel, setExtractionModel] = useState("gpt-4o");
    const [solutionModel, setSolutionModel] = useState("gpt-4o");
    const [debuggingModel, setDebuggingModel] = useState("gpt-4o");
    const [isLoading, setIsLoading] = useState(false);

    // Sync with external open state
    useEffect(() => {
        if (externalOpen !== undefined) {
            setOpen(externalOpen);
        }
    }, [externalOpen]);

    // Handle open state changes
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        // Only call onOpenChange when there's actually a change
        if (onOpenChange && newOpen !== externalOpen) {
            onOpenChange(newOpen);
        }
    };

    // Load current config on dialog open
    useEffect(() => {
        if (open) {
            setIsLoading(true);
            interface Config {
                apiKey?: string;
                apiProvider?: APIProvider;
                extractionModel?: string;
                solutionModel?: string;
                debuggingModel?: string;
            }

            window.electronAPI
                .getConfig()
                .then((config: Config) => {
                    setApiKey(config.apiKey || "");
                    setApiProvider(config.apiProvider || "openai");
                    setExtractionModel(config.extractionModel || "gpt-4o");
                    setSolutionModel(config.solutionModel || "gpt-4o");
                    setDebuggingModel(config.debuggingModel || "gpt-4o");
                })
                .catch((error: unknown) => {
                    console.error("Failed to load config:", error);
                    toastError("Failed to load settings");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [open]);

    // Handle API provider change
    const handleProviderChange = (provider: APIProvider) => {
        setApiProvider(provider);

        // Reset models to defaults when changing provider
        if (provider === "openai") {
            setExtractionModel("gpt-4o");
            setSolutionModel("gpt-4o");
            setDebuggingModel("gpt-4o");
        } else if (provider === "gemini") {
            setExtractionModel("gemini-1.5-pro");
            setSolutionModel("gemini-2.5-flash");
            setDebuggingModel("gemini-1.5-pro");
        } else if (provider === "anthropic") {
            setExtractionModel("claude-3-7-sonnet-20250219");
            setSolutionModel("claude-3-7-sonnet-20250219");
            setDebuggingModel("claude-3-7-sonnet-20250219");
        }
    };

    const handleSave = async () => {
        setIsLoading(true);

        console.log('clicked handelSAve ', apiKey,
            apiProvider,
            extractionModel,
            solutionModel,
            debuggingModel)

        try {
            const result = await window.electronAPI.updateConfig({
                apiKey,
                apiProvider,
                extractionModel,
                solutionModel,
                debuggingModel,
            });

            if (result) {
                toastSuccess("Settings saved successfully");
                handleOpenChange(false);

                // Force reload the app to apply the API key
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
            console.log("res is ", result)
        } catch (error) {
            console.error("Failed to save settings:", error);
            //   showToast("Error", "Failed to save settings", "error");
            toastError("Failed to save settings");
        } finally {
            setIsLoading(false);
        }
    };

    // Mask API key for display
    const maskApiKey = (key: string) => {
        if (!key || key.length < 10) return "";
        return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
    };

    // Open external link handler
    const openExternalLink = (url: string) => {
        window.electronAPI.openLink(url);
    };

    return (
        <div className=" p-10 text-sm flex bg-[black] text-white backdrop-blur-xl flex-col gap-4  ">
            <h1 className=" text-2xl font-bold">API Settings</h1>
            <p className=" ">Configure your API key and model preferences. You'll need your own API key to use this application.</p>

            <form className="card px-5 py-4" >
                <label htmlFor="apiProvider">API Provider</label>
                <br />

                <div className=" flex justify-between mt-6 my-4">
                    <div onClick={() => handleProviderChange('openai')} className={`${apiProvider === 'openai' ? 'buttonbg' : ''} !rounded-2xl text-lg gap-2 card h-18 center w-40 `}>
                        <p className=" capitalize font-bold ">OpenAI</p>
                    </div>
                    <div onClick={() => handleProviderChange('gemini')} className={`${apiProvider === 'gemini' ? 'buttonbg' : ''} !rounded-2xl text-lg gap-2 card h-18 center w-40 `}>
                        <p className=" capitalize font-bold ">Gemini</p>
                    </div>
                    <div onClick={() => handleProviderChange('anthropic')} className={`${apiProvider === 'anthropic' ? 'buttonbg' : ''} !rounded-2xl text-lg gap-2 card h-18 center w-40 `}>
                        <p className=" capitalize font-bold ">Anthropic</p>
                    </div>
                </div>

                <div className=" flex flex-col gap-2 card p-2">
                    <label className=" text-base font-medium capitalize" htmlFor="apiKey ">{apiProvider} API Key</label>
                    <input
                        id="apiKey"
                        type="password"
                        value={apiKey}
                        required
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={
                            apiProvider === "openai" ? "sk-..." :
                                apiProvider === "gemini" ? "[GCP_API_KEY]" :
                                    "sk-ant-..."}
                        className=" w-[500px] px-4 py-2 rounded-xl border border-orange-500/20 " name="apiKey" />
                    <p className="text-xs text-white/50">
                        Your API key is stored locally and never sent to any server except {apiProvider === "openai" ? "OpenAI" : "Google"}
                    </p>
                </div>

                <div className="mt-5 p-2 rounded-md bg-white/5 border border-white/10">
                    <p className="text-xs text-white/80 mb-1">Don't have an API key?</p>
                    {apiProvider === "openai" ? (
                        <>
                            <p className="text-xs text-white/60 mb-1">1. Create an account at <button
                                onClick={() => openExternalLink('https://platform.openai.com/signup')}
                                className="text-blue-400 hover:underline cursor-pointer">OpenAI</button>
                            </p>
                            <p className="text-xs text-white/60 mb-1">2. Go to <button
                                onClick={() => openExternalLink('https://platform.openai.com/api-keys')}
                                className="text-blue-400 hover:underline cursor-pointer">API Keys</button> section
                            </p>
                            <p className="text-xs text-white/60">3. Create a new secret key and paste it here</p>
                        </>
                    ) : apiProvider === "gemini" ? (
                        <>
                            <p className="text-xs text-white/60 mb-1">1. Create an account at <button
                                onClick={() => openExternalLink('https://aistudio.google.com/')}
                                className="text-blue-400 hover:underline cursor-pointer">Google AI Studio</button>
                            </p>
                            <p className="text-xs text-white/60 mb-1">2. Go to the <button
                                onClick={() => openExternalLink('https://aistudio.google.com/app/apikey')}
                                className="text-blue-400 hover:underline cursor-pointer">API Keys</button> section
                            </p>
                            <p className="text-xs text-white/60">3. Create a new API key and paste it here</p>
                        </>
                    ) : (
                        <>
                            <p className="text-xs text-white/60 mb-1">1. Create an account at <button
                                onClick={() => openExternalLink('https://console.anthropic.com/signup')}
                                className="text-blue-400 hover:underline cursor-pointer">Anthropic</button>
                            </p>
                            <p className="text-xs text-white/60 mb-1">2. Go to the <button
                                onClick={() => openExternalLink('https://console.anthropic.com/settings/keys')}
                                className="text-blue-400 hover:underline cursor-pointer">API Keys</button> section
                            </p>
                            <p className="text-xs text-white/60">3. Create a new API key and paste it here</p>
                        </>
                    )}
                </div>

                <div className="space-y-4 mt-5">
                    <p className="text-sm font-medium text-white">AI Model Selection</p>
                    <p className="text-xs text-white/60 -mt-3 mb-2">
                        Select which models to use for each stage of the process
                    </p>

                    {modelCategories.map((category) => {
                        // Get the appropriate model list based on selected provider
                        const models =
                            apiProvider === "openai" ? category.openaiModels :
                                apiProvider === "gemini" ? category.geminiModels :
                                    category.anthropicModels;

                        return (
                            <div key={category.key} className="mb-4">
                                <label className="text-sm font-medium text-white mb-1 block">
                                    {category.title}
                                </label>
                                <p className="text-xs text-white/60 mb-2">{category.description}</p>

                                <div className="space-y-2">
                                    {models.map((m) => {
                                        // Determine which state to use based on category key
                                        const currentValue =
                                            category.key === 'extractionModel' ? extractionModel :
                                                category.key === 'solutionModel' ? solutionModel :
                                                    debuggingModel;

                                        // Determine which setter function to use
                                        const setValue =
                                            category.key === 'extractionModel' ? setExtractionModel :
                                                category.key === 'solutionModel' ? setSolutionModel :
                                                    setDebuggingModel;

                                        return (
                                            <div
                                                key={m.id}
                                                className={`p-2 rounded-lg cursor-pointer transition-colors ${currentValue === m.id
                                                    ? "bg-white/10 border border-white/20"
                                                    : "bg-black/30 border border-white/5 hover:bg-white/5"
                                                    }`}
                                                onClick={() => setValue(m.id)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`w-3 h-3 rounded-full ${currentValue === m.id ? "bg-white" : "bg-white/20"
                                                            }`}
                                                    />
                                                    <div>
                                                        <p className="font-medium text-white text-xs">{m.name}</p>
                                                        <p className="text-xs text-white/60">{m.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <KeyboardShotcuts />

                <div className=" flex center mt-5  gap-5">
                    <button onClick={() => handleOpenChange(false)} className="border-white/30 border px-5 py-3 rounded-2xl hover:bg-white/5 text-white">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={isLoading || !apiKey} className="px-4 py-3 buttonbg  disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-2xl font-medium ">
                        {isLoading ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </form>
        </div>
    )

}
