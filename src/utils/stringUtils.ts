/**
 * String utilities for safe handling of special characters
 * Prevents platform-specific issues with dollar signs and template literals
 */

// Safe constants for terminal prompts and common strings
export const TERMINAL_CONSTANTS = {
  PROMPT: '$ ',
  WELCOME: '$ Welcome to rustyclint Terminal',
  HELP: '$ Type "help" for available commands',
} as const;

/**
 * Safely concatenates strings without using template literals
 * Prevents issues with dollar sign interpolation
 */
export function safeStringConcat(...parts: (string | number)[]): string {
  return parts.map(part => String(part)).join('');
}

/**
 * Safely formats command output without template literal risks
 */
export function formatCommandOutput(command: string, output: string): string[] {
  const commandLine = TERMINAL_CONSTANTS.PROMPT + command.trim();
  
  if (!output || output.trim() === '') return [commandLine];
  
  // Split output by newlines and return as separate entries
  // Filter out empty lines at the beginning and end
  const outputLines = output.split('\n').filter((line, index, array) => {
    // Keep all non-empty lines
    if (line.trim() !== '') return true;
    // Keep empty lines that are between non-empty lines
    if (index > 0 && index < array.length - 1) return true;
    return false;
  });
  
  return [commandLine, ...outputLines];
}

/**
 * Checks if a line is a terminal prompt line
 */
export function isTerminalPrompt(line: string): boolean {
  return line && line.startsWith(TERMINAL_CONSTANTS.PROMPT);
}

/**
 * Escapes dollar signs in strings for safe processing
 */
export function escapeDollarSigns(input: string): string {
  return input.replace(/\$/g, '\\$');
}

/**
 * Safely formats Python f-string-like output without template literals
 */
export function formatPythonOutput(template: string, values: Record<string, any>): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    const placeholder = `{${key}}`;
    result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value));
  }
  return result;
}

/**
 * Safe string interpolation that avoids dollar sign conflicts
 */
export function safeInterpolate(template: string, values: string[]): string {
  let result = template;
  values.forEach((value, index) => {
    result = result.replace(`{${index}}`, value);
  });
  return result;
}

/**
 * Safely formats Dart/Flutter error messages without dollar sign interpolation
 */
export function formatDartError(errorMessage: string): string {
  // Replace ${variable} patterns with safe concatenation
  return errorMessage.replace(/\$\{([^}]+)\}/g, (match, variable) => {
    return `' + ${variable} + '`;
  });
}

/**
 * Converts Dart string interpolation to safe concatenation
 */
export function convertDartStringInterpolation(dartCode: string): string {
  if (!dartCode) return '';
  
  // Convert 'Error: ${e.message}' to 'Error: ' + e.message
  return dartCode.replace(/'([^']*)\$\{([^}]+)\}([^']*)'/g, (match, before, variable, after) => {
    const parts = [];
    if (before) parts.push(`'${before}'`);
    parts.push(variable);
    if (after) parts.push(`'${after}'`);
    return parts.join(' + ');
  });
}