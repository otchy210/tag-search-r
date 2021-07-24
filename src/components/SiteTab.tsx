import React, { FC } from "react";
import styled from "styled-components";

type TabProps = {
    selected: boolean
};

const Tab = styled.li<TabProps>`
  list-style-type: none;
  margin: 0.1em 0.1em 0 0.1em;
  padding: .25em .5em;
  background-color: ${props => props.selected ? '#cff' : 'transparent'};
  cursor: pointer;
  border-style: solid;
  border-width: 1px 1px 0 1px;
  border-radius: 0.25em 0.25em 0 0;
`;

type Props = {
    site: SiteConfig,
    selected: boolean,
    select: () => void,
}

const SiteTab: FC<Props> = ({site, selected, select}) => {
    return <Tab onClick={select} selected={selected}>
        {site.title}
    </Tab>;
}

export default SiteTab;