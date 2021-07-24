import React, { FC } from "react";
import styled from "styled-components";
import { siteConfigs } from "../site-config";
import SiteTab from "./SiteTab";

const TabHolder = styled.ul`
  display: flex;
  margin: 0;
  padding: 0;
  border-style: solid;
  border-width: 0 0 1px 0;
`;

type Props = {
    selectedSite: SiteConfig;
    selectSite: (site: SiteConfig) => void;
}

const SiteTabs: FC<Props> = ({selectedSite, selectSite}) => {
    return <TabHolder>
        {siteConfigs.map(site => {
            return <SiteTab
                site={site}
                key={site.title}
                selected={selectedSite === site}
                select={() => selectSite(site)}
            />
        })}
    </TabHolder>;
};
export default SiteTabs;
