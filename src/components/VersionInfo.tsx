
import React from 'react';
import { VersionInfo } from '../hooks/useVersioning';

interface VersionInfoProps {
  versionInfo: VersionInfo;
  showDetailed?: boolean;
}

const VersionInfoComponent = ({ versionInfo, showDetailed = false }: VersionInfoProps) => {
  return (
    <div className="bg-gray-50 rounded p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <i className="ri-git-branch-line text-gray-500"></i>
          <span className="text-sm font-medium text-gray-700">
            Versão: {versionInfo.version}
          </span>
        </div>
        {showDetailed && (
          <div className="text-xs text-gray-500">
            Por: {versionInfo.updatedBy}
          </div>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-600">
        <i className="ri-time-line mr-1"></i>
        Última atualização: {versionInfo.lastUpdated}
      </div>
    </div>
  );
};

export default VersionInfoComponent;
