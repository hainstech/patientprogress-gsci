// @material-ui/icons
import Dashboard from '@material-ui/icons/Dashboard';
import Person from '@material-ui/icons/Person';
import Language from '@material-ui/icons/Language';
import Info from '@material-ui/icons/Info';
import ExitToApp from '@material-ui/icons/ExitToApp';
// core components/views for Admin layout
import QuestionnaireList from '../views/patient/QuestionnaireList';
import Profile from '../views/patient/Profile';
import MyProfessional from '../views/patient/MyProfessional';
import Questionnaire from '../views/patient/Questionnaire';

import Invite from '../views/professional/Invite';
import Preferences from '../views/professional/Preferences';
import Search from '../views/professional/Search';

import Register from '../views/auth/Register';
import Login from '../views/auth/Login';
import About from '../views/About';

import QuestionnaireBuilder from '../views/admin/QuestionnaireBuilder';

// Patient Routing
export const patientLinks = [
  {
    path: '/questionnaires',
    name: 'questionnaires',
    icon: Dashboard,
    component: QuestionnaireList,
    layout: '/patient',
  },
  {
    path: '/profile',
    name: 'profile',
    icon: Person,
    component: Profile,
    layout: '/patient',
  },
  {
    path: '/professional',
    name: 'professional',
    icon: Person,
    component: MyProfessional,
    layout: '/patient',
  },
];

export const patientRoutes = [
  {
    path: '/questionnaires/:id',
    component: Questionnaire,
    layout: '/patient',
  },
];

// Professional Routing
export const professionalLinks = [
  {
    path: '/patients',
    name: 'patients',
    icon: Dashboard,
    component: Search,
    layout: '/professional',
  },
  {
    path: '/preferences',
    name: 'preferences',
    icon: Dashboard,
    component: Preferences,
    layout: '/professional',
  },
  {
    path: '/patients',
    name: 'invite',
    icon: Dashboard,
    component: Invite,
    layout: '/professional',
  },
];

export const professionalRoutes = [];

// Guest Routing
export const guestLinks = [
  {
    path: '/',
    name: 'about',
    icon: Info,
    component: About,
    layout: '',
  },
  {
    path: '/login',
    name: 'login',
    icon: ExitToApp,
    component: Login,
    layout: '',
  },
];

export const guestRoutes = [
  {
    path: '/register/:id',
    name: 'login',
    icon: Language,
    component: Register,
    layout: '',
  },
];

// Admin Routing
export const adminLinks = [
  {
    path: '/questionnaire-builder',
    name: 'dashboard',
    icon: Dashboard,
    component: QuestionnaireBuilder,
    layout: '/admin',
  },
];

export const adminRoutes = [];
