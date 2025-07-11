/**
 * Service for managing language preferences
 */
export const LanguageService = {
    /**
     * Storage key for the language preference
     */
    STORAGE_KEY: 'vcash_language_preference',

    /**
     * Default language to use if no preference is found
     */
    DEFAULT_LANGUAGE: 'rs',

    /**
     * Get the stored language preference
     * @returns The stored language code or the default language
     */
    getLanguagePreference(): string {
        try {
            const storedLanguage = localStorage.getItem(this.STORAGE_KEY)
            return storedLanguage || this.DEFAULT_LANGUAGE
        } catch (error) {
            console.error('Error getting language preference:', error)
            return this.DEFAULT_LANGUAGE
        }
    },

    /**
     * Save the language preference
     * @param language - The language code to save
     */
    setLanguagePreference(language: string): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, language)
        } catch (error) {
            console.error('Error saving language preference:', error)
        }
    }
}
