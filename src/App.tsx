import React, { useState } from 'react'
import SiteTabs from './components/SiteTabs';
import { siteConfigs } from './site-config';

function App() {
  const [selectedSite, setSelectedSite] = useState<SiteConfig>(siteConfigs[0]);
  return <SiteTabs selectedSite={selectedSite} selectSite={setSelectedSite} />
}

export default App
