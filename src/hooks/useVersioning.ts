
import { useState, useCallback } from 'react';

export interface VersionInfo {
  version: string;
  lastUpdated: string;
  updatedBy: string;
}

export const useVersioning = () => {
  const [currentVersion, setCurrentVersion] = useState<VersionInfo>({
    version: '1.0.0',
    lastUpdated: new Date().toLocaleString('pt-BR'),
    updatedBy: 'Ricardo Oliveira'
  });

  const generateNewVersion = useCallback((currentVer: string): string => {
    const parts = currentVer.split('.').map(Number);
    parts[2] += 1; // Incrementa patch version
    if (parts[2] >= 100) {
      parts[2] = 0;
      parts[1] += 1; // Incrementa minor version
    }
    if (parts[1] >= 100) {
      parts[1] = 0;
      parts[0] += 1; // Incrementa major version
    }
    return parts.join('.');
  }, []);

  const updateVersion = useCallback(() => {
    const newVersion = generateNewVersion(currentVersion.version);
    const newVersionInfo: VersionInfo = {
      version: newVersion,
      lastUpdated: new Date().toLocaleString('pt-BR'),
      updatedBy: 'Ricardo Oliveira' // Em um sistema real, isso viria do contexto de autenticação
    };
    setCurrentVersion(newVersionInfo);
    
    // Log da atualização para auditoria
    console.log('Sistema atualizado:', newVersionInfo);
    
    return newVersionInfo;
  }, [currentVersion.version, generateNewVersion]);

  return {
    currentVersion,
    updateVersion,
    setCurrentVersion
  };
};
