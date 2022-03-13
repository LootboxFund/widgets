import LogRocket from 'logrocket';
import { manifest } from '../../manifest'

export const initLogging = () => {
  LogRocket.init('gkpkj9/lootbox', {
    release: manifest.microfrontends.semver
  });
}