import { menuUrls } from './menu/urls';
import { subMenuUrls } from './sub-menu/urls';

const baseUrl = '/home';

export const homeUrls = {
  menu: menuUrls(baseUrl),
  subMenu: subMenuUrls(baseUrl),
};
