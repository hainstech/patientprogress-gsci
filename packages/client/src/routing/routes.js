// @material-ui/icons
import Person from '@material-ui/icons/Person';
import Language from '@material-ui/icons/Language';
import Info from '@material-ui/icons/Info';
import ExitToApp from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import GroupIcon from '@material-ui/icons/Group';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import SettingsIcon from '@material-ui/icons/Settings';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import MarkunreadIcon from '@material-ui/icons/Markunread';
import AssessmentIcon from '@material-ui/icons/Assessment';
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
    icon: MarkunreadIcon,
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
    icon: LocalHospitalIcon,
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
    path: '/metrics',
    name: 'metrics',
    icon: AssessmentIcon,
    component: Search,
    layout: '/professional',
  },
  {
    path: '/patients',
    name: 'patients',
    icon: GroupIcon,
    component: Search,
    layout: '/professional',
  },
  {
    path: '/preferences',
    name: 'preferences',
    icon: SettingsIcon,
    component: Preferences,
    layout: '/professional',
  },
  {
    path: '/invite',
    name: 'invite',
    icon: GroupAddIcon,
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
    name: 'builder',
    icon: HelpIcon,
    component: QuestionnaireBuilder,
    layout: '/admin',
  },
];

export const adminRoutes = [];
