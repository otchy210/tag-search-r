import React, { FC } from "react";
import { siteConfigs } from "../site-config";
import SiteTab from "./SiteTab";

type Props = {
    selectedSite: SiteConfig;
    selectSite: (site: SiteConfig) => void;
}

const SiteTabs: FC<Props> = ({selectedSite, selectSite}) => {
    return <ul>
        {siteConfigs.map((site, index) => {
            return <SiteTab site={site} selected={selectedSite === site} select={() => selectSite(site)} />
        })}
    </ul>
};
export default SiteTabs;
