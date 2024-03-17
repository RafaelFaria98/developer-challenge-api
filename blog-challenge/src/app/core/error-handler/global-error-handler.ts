import { ErrorHandler } from '@angular/core';

const ERRORS_KEY = 'lgc_errors';

export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    // Handle error (write message to local storage for example)
    this.saveToLocalStorage(error);

    console.error('Global error:', error);
  }

  private saveToLocalStorage(error: Error): void {
    let errors: string[] = [];
    const localStorageErrors = localStorage.getItem(ERRORS_KEY);
    if (localStorageErrors) {
      errors = JSON.parse(localStorageErrors);
    }

    errors.push(error.message);
    localStorage.setItem(ERRORS_KEY, JSON.stringify(errors));
  }
}
