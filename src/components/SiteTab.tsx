import React, { FC } from "react";

type Props = {
    site: SiteConfig,
    selected: boolean,
    select: () => void,
}

const SiteTab: FC<Props> = ({site, selected, select}) => {
    return <li onClick={select}>
        {site.title}{selected && ', selected'}
    </li>
}

export default SiteTab;