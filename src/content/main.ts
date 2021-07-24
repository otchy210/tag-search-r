import { error } from "../common";
import { siteConfigs } from "../site-config";
import { init } from "./init";

export const main = (): void => {
    const sites = siteConfigs.filter(site => {
        return site.urlMatcher.test(location.href);
    });
    if (sites.length > 1) {
        error(`Found more than 1 sites ${sites.map(site => site.title).join(',')}`);
        return;
    } else if (sites.length === 0) {
        return;
    }
    const site = sites[0];
    init(site);
};
