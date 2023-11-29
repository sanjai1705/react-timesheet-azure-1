import sideBarRoute from '../data/sidebarRoute';

export function getRoutesByRole(role) {
  if (sideBarRoute.hasOwnProperty(role)) {
    return sideBarRoute[role];
  } else {
    return {};
  }
}
