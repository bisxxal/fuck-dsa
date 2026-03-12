'use client'
import { WelcomeScreen } from "@/components/ui/WelcomeScreen"
import { useEffect, useState, useCallback } from "react"
import toast from "react-hot-toast"

export default function AssignmentMarketplace() {

  // const [credits, setCredits] = useState<number>(999)
  const [currentLanguage, setCurrentLanguage] = useState<string>("python")
  const [isInitialized, setIsInitialized] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false)

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Set unlimited credits
  // const updateCredits = useCallback(() => {
  //   setCredits(999) // No credit limit in this version
  //   window.__CREDITS__ = 999
  // }, [])

  // Helper function to safely update language
  const updateLanguage = useCallback((newLanguage: string) => {
    setCurrentLanguage(newLanguage)
    window.__LANGUAGE__ = newLanguage
  }, [])

  // Helper function to mark initialization complete
  const markInitialized = useCallback(() => {
    setIsInitialized(true)
    window.__IS_INITIALIZED__ = true
  }, [])

  // Check for OpenAI API key and prompt if not found
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const hasKey = await window.electronAPI.checkApiKey()
        setHasApiKey(hasKey)

        // If no API key is found, show the settings dialog after a short delay
        if (!hasKey) {
          setTimeout(() => {
            setIsSettingsOpen(true)
          }, 1000)
        }
      } catch (error) {
        console.error("Failed to check API key:", error)
      }
    }

    if (isInitialized) {
      checkApiKey()
    }
  }, [isInitialized])

  // Initialize dropdown handler
  useEffect(() => {
    if (isInitialized) {
      // Process all types of dropdown elements with a shorter delay
      const timer = setTimeout(() => {
        // Find both native select elements and custom dropdowns
        const selectElements = document.querySelectorAll('select');
        const customDropdowns = document.querySelectorAll('.dropdown-trigger, [role="combobox"], button:has(.dropdown)');

        // Enable native selects
        selectElements.forEach(dropdown => {
          dropdown.disabled = false;
        });

        // Enable custom dropdowns by removing any disabled attributes
        customDropdowns.forEach(dropdown => {
          if (dropdown instanceof HTMLElement) {
            dropdown.removeAttribute('disabled');
            dropdown.setAttribute('aria-disabled', 'false');
          }
        });

        console.log(`Enabled ${selectElements.length} select elements and ${customDropdowns.length} custom dropdowns`);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  // Listen for settings dialog open requests
  useEffect(() => {
    if (!window.electronAPI?.onShowSettings) return;
    const unsubscribeSettings = window.electronAPI.onShowSettings(() => {
      console.log("Show settings dialog requested");
      setIsSettingsOpen(true);
    });

    return () => {
      unsubscribeSettings?.();
    };
  }, []);

  // Initialize basic app state
  useEffect(() => {

    const initializeApp = async () => {
      try {
        // Set unlimited credits
        // updateCredits()
        // Load config including language and model settings
        const config = await window.electronAPI.getConfig()

        // Load language preference
        if (config && config.language) {
          updateLanguage(config.language)
        } else {
          updateLanguage("python")
        }

        // Model settings are now managed through the settings dialog
        // and stored in config as extractionModel, solutionModel, and debuggingModel

        markInitialized()
      } catch (error) {
        console.error("Failed to initialize app:", error)
        // Fallback to defaults
        updateLanguage("python")
        markInitialized()
      }
    }

    initializeApp()

    // Event listeners for process events
    const onApiKeyInvalid = () => {
      toast.error("API Key Invalid")
      setApiKeyDialogOpen(true)
    }

    // Setup API key invalid listener
    window.electronAPI.onApiKeyInvalid(onApiKeyInvalid)

    // Define a no-op handler for solution success
    const unsubscribeSolutionSuccess = window.electronAPI.onSolutionSuccess(
      // No credit deduction in this version
      () => { console.log("Solution success - no credits deducted in this version") }
    )

    // Cleanup function
    return () => {
      window.electronAPI.removeListener("API_KEY_INVALID", onApiKeyInvalid)
      unsubscribeSolutionSuccess()
      window.__IS_INITIALIZED__ = false
      setIsInitialized(false)
    }
  }, [updateLanguage, markInitialized])

  // API Key dialog management
  const handleOpenSettings = useCallback(() => {
    console.log('Opening settings dialog');
    setIsSettingsOpen(true);
  }, []);

  const handleCloseSettings = useCallback((open: boolean) => {
    console.log('Settings dialog state changed:', open);
    setIsSettingsOpen(open);
  }, []);

  const handleApiKeySave = useCallback(async (apiKey: string) => {
    try {
      await window.electronAPI.updateConfig({ apiKey })
      setHasApiKey(true)
      toast.success("API key saved successfully")

      // Reload app after a short delay to reinitialize with the new API key
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("Failed to save API key:", error)
      toast.error("Failed to save API key")
    }
  }, [])


  return (
    <div>
      <div className="relative">
        {isInitialized ? (
          hasApiKey ? (
            // <SubscribedApp
            //   credits={credits}
            //   currentLanguage={currentLanguage}
            //   setLanguage={updateLanguage}
            // />
            <div>
              SubscribedApp
            </div>
          ) : (
            <WelcomeScreen onOpenSettings={handleOpenSettings} />
          )
        ) : (
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
              <p className="text-white/60 text-sm">
                Initializing...
              </p>
            </div>
          </div>
        )}
        {/* <UpdateNotification /> */}
      </div>

    </div>
  );
}