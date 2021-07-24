import React, { FC, useState } from "react";
import styled from "styled-components";

const contentHeight = '320px';

interface ContainerProps {
    opened: boolean;
};

const Container = styled.div<ContainerProps>`
    display: flex;
    flex-direction: column;
    margin-top: ${props => props.opened ? '0' : `-${contentHeight}`};
    transition: margin 200ms ease;
`;

const Content = styled.iframe`
    border: none;
    box-sizing: border-box;
    width: 100vw;
    height: ${contentHeight};
    background-color: #999;
    border-style: solid;
    border-width: 0 2px 2px 2px;
    border-color: #fff;
    z-index: 0;
`;

const Tab = styled.span`
    display: inline-block;
    margin-top: -2px;
    background-color: #999;
    background-image: url(${chrome.extension.getURL('img/icon_48.png')});
    background-size: 24px;
    background-position: center;
    background-repeat: no-repeat;
    width: 32px;
    height: 32px;
    border-style: solid;
    border-width: 0px 2px 2px 2px;
    border-color: #fff;
    border-radius: 0 0 4px 4px;
    cursor: pointer;
    z-index: 1;
`;

const Pane: FC = () => {
    const [opened, setOpened] = useState(false);
    return <Container opened={opened}>
        <Content src={chrome.extension.getURL('search.html')} />
        <Tab onClick={() => setOpened(!opened)} />
    </Container>
};

export default Pane;