import {
  patientLinks,
  professionalLinks,
  guestLinks,
  adminLinks,
} from '../routing/routes';

export const useRouteName = (type) => {
  let name = '';
  let routes;
  switch (type) {
    case 'guest':
      routes = guestLinks;
      break;
    case 'professional':
      routes = professionalLinks;
      break;
    case 'patient':
      routes = patientLinks;
      break;
    case 'admin':
      routes = adminLinks;
      break;

    default:
      break;
  }
  routes.forEach((route) => {
    if (window.location.href.indexOf(route.layout + route.path) !== -1) {
      name = route.name;
    }
  });
  return name;
};
