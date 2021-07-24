import { error, log } from "./common";
import { siteConfigs } from "./site-config";

export const main = (): void => {
    const targetSites = siteConfigs.filter(site => {
        return site.urlMatcher.test(location.href);
    });
    if (targetSites.length > 1) {
        error(`Found more than 1 sites ${targetSites.map(site => site.title).join(',')}`);
        return;
    } else if (targetSites.length === 0) {
        return;
    }
    const site = targetSites[0];
    log(`Loading ${site.title}`);
};