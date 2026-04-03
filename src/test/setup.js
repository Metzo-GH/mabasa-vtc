import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Teardown pour éviter le blocage de Vitest (fantôme)
afterEach(() => {
  cleanup();
});
