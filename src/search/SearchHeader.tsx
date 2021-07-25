import React, { FC } from "react";
import styled from "styled-components";

const Header = styled.header`
`;

interface Props {
    site: SiteConfig
};

const SearchHeader: FC<Props> = ({site}) => {
    return <Header>
        {site.title}
    </Header>
};

export default SearchHeader;
