import { localStorageRepository } from './localStorageRepository.js';

/**
 * The active BookRepository instance.
 * To swap implementations (e.g. to a REST API or GraphQL backend),
 * instantiate the alternative repository here and export it.
 */
export const bookRepository = localStorageRepository;
export default bookRepository;
