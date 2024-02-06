// Type overloads
declare namespace chrome.contextMenus {
  export interface CreateProperties<T extends string = string>
    extends chrome.contextMenus.CreateProperties {
    id?: T;
  }

  /**
   * [Type overload]
   * Creates a new context menu item. Note that if an error occurs during creation, you may not find out until the creation callback fires (the details will be in chrome.runtime.lastError).
   * @param callback Called when the item has been created in the browser. If there were any problems creating the item, details will be available in chrome.runtime.lastError.
   * @returns The ID of the newly created item.
   */
  export function create<T extends string>(
    createProperties: CreateProperties<T>,
    callback?: () => void
  ): number | string;
}

// Depend on I18nMessageType from locales.d.ts
declare namespace chrome.i18n {
  /**
   * [Type Overload]
   * Gets the localized string for the specified message. If the message is missing, this method returns an empty string (''). If the format of the getMessage() call is wrong — for example, messageName is not a string or the substitutions array has more than 9 elements — this method returns undefined.
   * @param messageName The name of the message, as specified in the messages.json file.
   * @param substitutions Optional. Up to 9 substitution strings, if the message requires any.
   */
  export function getMessage<T>(
    messageName: keyof T,
    substitutions?: string | string[]
  ): string;
}
