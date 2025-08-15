import { useState, useEffect } from 'react';

function Versions(): React.JSX.Element {
  const [versions, setVersions] = useState<NodeJS.ProcessVersions>({} as NodeJS.ProcessVersions);

  useEffect(() => {
    // Call the new API to get the versions
    window.api.getVersions().then((vers) => {
      setVersions(vers);
    });
  }, []);

  return (
    <ul className="versions">
      <li className="electron-version">Electron v{versions.electron}</li>
      <li className="chrome-version">Chromium v{versions.chrome}</li>
      <li className="node-version">Node v{versions.node}</li>
    </ul>
  );
}

export default Versions;
