export const languages = [
  { code: "ar", name: "Arabic", flag: "sa" },
  { code: "bg", name: "Bulgarian", flag: "bg" },
  { code: "zh", name: "Chinese", flag: "cn" },
  { code: "hr", name: "Croatian", flag: "hr" },
  { code: "cs", name: "Czech", flag: "cz" },
  { code: "da", name: "Danish", flag: "dk" },
  { code: "nl", name: "Dutch", flag: "nl" },
  { code: "en", name: "English", flag: "us" },
  { code: "fi", name: "Finnish", flag: "fi" },
  { code: "fr", name: "French", flag: "fr" },
  { code: "de", name: "German", flag: "de" },
  { code: "el", name: "Greek", flag: "gr" },
  { code: "hi", name: "Hindi", flag: "in" },
  { code: "hu", name: "Hungarian", flag: "hu" },
  { code: "id", name: "Indonesian", flag: "id" },
  { code: "it", name: "Italian", flag: "it" },
  { code: "ja", name: "Japanese", flag: "jp" },
  { code: "ko", name: "Korean", flag: "kr" },
  { code: "ms", name: "Malay", flag: "my" },
  { code: "no", name: "Norwegian", flag: "no" },
  { code: "pl", name: "Polish", flag: "pl" },
  { code: "pt-br", name: "Portuguese (Brazil)", flag: "br" },
  { code: "pt", name: "Portuguese (Portugal)", flag: "pt" },
  { code: "ro", name: "Romanian", flag: "ro" },
  { code: "ru", name: "Russian", flag: "ru" },
  { code: "sk", name: "Slovak", flag: "sk" },
  { code: "es", name: "Spanish", flag: "es" },
  { code: "sv", name: "Swedish", flag: "se" },
  { code: "ta", name: "Tamil", flag: "in" },
  { code: "tr", name: "Turkish", flag: "tr" },
  { code: "uk", name: "Ukrainian", flag: "ua" },
  { code: "vi", name: "Vietnamese", flag: "vn" },
]

export const getLanguageFlag = (code: string) => {
  const language = languages.find((lang) => lang.code === code)
  return language ? language.flag : "us"
}

export const llmOptions = [
  "gpt-5",
  "gpt-5-mini",
  "gpt-5-nano",
  "gpt-4o-mini",
  "gpt-4o",
  "gpt-4",
  "gpt-4-turbo",
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4.1-nano",
  "gpt-3.5-turbo",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-1.0-pro",
  "claude-sonnet-4",
  "claude-3-7-sonnet",
  "claude-3-5-sonnet",
  "claude-3-5-sonnet-v1",
  "claude-3-haiku",
  "grok-beta",
  "custom-llm",
]

export const modelOptions = [
  {
    id: "eleven_turbo_v2",
    name: "Eleven Turbo v2",
    description: "Fast, high quality (English)",
  },
  {
    id: "eleven_turbo_v2_5",
    name: "Eleven Turbo v2.5",
    description: "Fast, high quality (Multilingual)",
  },
  {
    id: "eleven_flash_v2",
    name: "Eleven Flash v2",
    description: "Fastest, medium quality (English)",
  },
  {
    id: "eleven_flash_v2_5",
    name: "Eleven Flash v2.5",
    description: "Fastest, medium quality (Multilingual)",
  },
]

export const getModelId = (modelType: string | undefined, language: string | undefined) => {
  const safeModelType = modelType || "eleven_turbo_v2_5"
  const safeLanguage = language || "en"

  // If safeModelType is already a full model ID, return it directly
  if (safeModelType.startsWith("eleven_")) {
    // For English, ensure we only use v2 models
    if (safeLanguage === "en") {
      if (safeModelType === "eleven_turbo_v2_5") return "eleven_turbo_v2"
      if (safeModelType === "eleven_flash_v2_5") return "eleven_flash_v2"
    } else {
      // For Non-English, ensure we only use v2_5 models
      if (safeModelType === "eleven_turbo_v2") return "eleven_turbo_v2_5"
      if (safeModelType === "eleven_flash_v2") return "eleven_flash_v2_5"
    }
    return safeModelType
  }

  // Legacy support for old 'turbo'/'flash' format
  if (safeModelType === "turbo") {
    return safeLanguage === "en" ? "eleven_turbo_v2" : "eleven_turbo_v2_5"
  }
  return safeLanguage === "en" ? "eleven_flash_v2" : "eleven_flash_v2_5"
}

export const getAvailableModels = (language: string) => {
  if (language === "en") {
    // For English, only v2 models are available (optimized)
    return modelOptions.filter((model) => model.id === "eleven_turbo_v2" || model.id === "eleven_flash_v2")
  }
  // For all other languages, only v2.5 models are available
  return modelOptions.filter((model) => model.id === "eleven_turbo_v2_5" || model.id === "eleven_flash_v2_5")
}

export const getLanguageName = (code: string) => {
  const language = languages.find((lang) => lang.code === code)
  return language ? language.name : code
}
