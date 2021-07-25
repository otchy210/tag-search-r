export type JsonSerializable =
    null |
    boolean |
    string |
    number |
    JsonSerializable[] |
    {[key: string]: JsonSerializable};
