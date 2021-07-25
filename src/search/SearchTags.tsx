import React, { FC } from "react";
import styled from "styled-components";

const Table = styled.table`
`;

const Tr = styled.tr`
`;

const Th = styled.th`
    margin: 0;
    padding: 0.25em 0.5em;
    white-space: nowrap;
    text-align: left;
    vertical-align: top;
    font-size: 0.8em;
`;

const Td = styled.td`
    margin: 0;
    padding: 0.25em 0.5em;
    overflow: auto;
    font-size: 0.8em;
    & > div {
        max-height: 120px;
    }
`;

const Label = styled.label`
    display: inline-block;
    margin: 0.1em 0.25em;
    padding: 0 0.5em;
    line-height: 1.5em;
    border-style: solid;
    border-width: 1px;
    border-color: #333;
    border-radius: 1em;
    cursor: pointer;
    &:hover {
        background-color: #ccc;
    }
`;

interface Props {
    site: SiteConfig;
    tagSummary: TagSummary;
}

const SearchTags: FC<Props> = ({site, tagSummary}) => {
    return <Table>
        {site.tagTypes.map(tagType => {
            return <Tr>
                <Th>{tagType.label}</Th>
                <Td><div>
                    {site.sortTags(tagType, tagSummary[tagType.key]).map(([tag, count]) => {
                        return <Label>{tag}({count})</Label>
                    })}
                </div></Td>
            </Tr>;
        })}
    </Table>;
};

export default SearchTags;