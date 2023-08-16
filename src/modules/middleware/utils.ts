export function awaitWrap<T, U = any>(promise: Promise<T>): Promise<[U | null, T | null]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, null]>(err => [err, null])
}

export type SupportedDatabaseType = 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';

export function getDatabaseTypeFromConfig(config: any): SupportedDatabaseType {
  const databaseType: string = config.databaseType || 'mysql'; // default: sql
  if (isValidDatabaseType(databaseType)) {
    return databaseType;
  }
  console.warn(`Unsupported database type: ${databaseType}. Using default: mysql`);
  return 'mysql'; // default: sql 
}

function isValidDatabaseType(type: string): type is SupportedDatabaseType {
  return ['mysql', 'postgres', 'sqlite', 'mariadb', 'mssql'].includes(type);
}