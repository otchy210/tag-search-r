import React, { FC, useState } from "react";
import styled from "styled-components";
import { updateTabState } from "../common";

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
`;

interface LabelProps {
    selected: boolean;
};

const Label = styled.label<LabelProps>`
    display: inline-block;
    margin: 0.1em 0.25em;
    padding: 0 0.5em;
    line-height: 1.5em;
    background-color: ${props => props.selected ? '#cfc' : 'transparent'};
    border-style: solid;
    border-width: 1px;
    border-color: ${props => props.selected ? '#090' : '#333'};
    border-radius: 1em;
    color: ${props => props.selected ? '#090' : 'inherit'};
    cursor: pointer;
    &:hover {
        background-color: #fff;
    }
`;

interface Props {
    site: SiteConfig;
    tagSummary: TagSummary;
}

const SearchTags: FC<Props> = ({site, tagSummary}) => {
    const [selectedTags, setSelectedTags] = useState<SelectedTags>([]);
    const getSelectedTagKey = (tagKey: string, tag: string) => {
        return `${tagKey}::${tag}`;
    };
    const isTagSelected = (tagKey: string, tag: string) => {
        const selectedTagKey = getSelectedTagKey(tagKey, tag);
        return selectedTags.includes(selectedTagKey);
    };
    const updateSelectedTagsState = (selectedTags: SelectedTags) => {
        setSelectedTags(selectedTags);
        updateTabState({selectedTags});
    }
    return <Table>
        {site.tagTypes.map(tagType => {
            return <Tr>
                <Th>{tagType.label}</Th>
                <Td>
                    {site.sortTags(tagType, tagSummary[tagType.key]).map(([tag, count]) => {
                        return <Label
                            selected={isTagSelected(tagType.key, tag)}
                            onClick={() => {
                                const tagKey = tagType.key;
                                const selectedTagKey = getSelectedTagKey(tagKey, tag);
                                if (isTagSelected(tagKey, tag)) {
                                    updateSelectedTagsState(selectedTags.filter(existingTagKey => {
                                        return existingTagKey !== selectedTagKey;
                                    }));
                                } else {
                                    const newSelectedTags = [...selectedTags];
                                    newSelectedTags.push(selectedTagKey);
                                    updateSelectedTagsState(newSelectedTags);
                                }
                            }}
                        >{tag}({count})</Label>
                    })}
                </Td>
            </Tr>;
        })}
    </Table>;
};

export default SearchTags;