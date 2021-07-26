import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { getStoredTabState, updateTabState } from "../common";

const contentHeight = 200;
const tabSize = 32;
const bgColor = '#ccc';

interface ContainerProps {
    opened: boolean;
};

const Container = styled.div<ContainerProps>`
    position: absolute;
    display: flex;
    flex-direction: column;
    margin-top: ${props => props.opened ? '0' : `-${contentHeight + tabSize / 2}px`};
    transition: margin 200ms ease;
    &:hover {
        margin-top: ${props => props.opened ? '0' : `-${contentHeight}px`};
    }
`;

const Content = styled.iframe`
    position: absolute;
    border: none;
    box-sizing: border-box;
    width: 100vw;
    height: ${contentHeight}px;
    background-color: ${bgColor};
    border-style: solid;
    border-width: 0 2px 2px 2px;
    border-color: #fff;
    z-index: 0;
`;

const Tab = styled.span`
    position: absolute;
    left: 0;
    top: ${contentHeight}px;
    display: inline-block;
    margin-top: -2px;
    background-color: ${bgColor};
    background-image: url(${chrome.extension.getURL('img/icon_48.png')});
    background-size: 24px;
    background-position: center;
    background-repeat: no-repeat;
    width: ${tabSize}px;
    height: ${tabSize}px;
    border-style: solid;
    border-width: 0px 2px 2px 2px;
    border-color: #fff;
    border-radius: 0 0 4px 4px;
    cursor: pointer;
    z-index: 1;
`;

interface Props {
    site: SiteConfig;
}

const Pane: FC<Props> = ({site}) => {
    const [opened, setOpened] = useState(false);
    const urlBase = chrome.extension.getURL('search.html');
    const url = `${urlBase}?siteKey=${site.key}`;
    useEffect(() => {
        (async () => {
            const storedState = await getStoredTabState() as any;
            setOpened(storedState?.opened ?? false);
        })();
    }, []);
    return <Container opened={opened}>
        <Content src={url} />
        <Tab onClick={() => {
            const newOpened = !opened;
            updateTabState({opened: newOpened})
            setOpened(newOpened);
        }} />
    </Container>
};

export default Pane;