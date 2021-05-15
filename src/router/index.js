import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    // component: Home,
    component: () => import('../views/project/ProjectCalendar.vue'),
  },

  {
    path: '/proyecto/registrar',
    name: 'ProjectForm',
    component: () => import('../views/project/ProjectForm'),
  },

  {
    path: '/proyecto/:id/detalle',
    name: 'ProjectDetail',
    component: () => import('../views/project/ProjectRepository'),
  },

  {
    path: '/proyecto/Calendario',
    name: 'ProjectCalendar',
    component: () => import('../views/project/ProjectCalendar'),
  },

  {
    path: '/administracion/categoria',
    name: 'ManagmentCategory',
    component: () => import('../views/administration/Category'),
  },

  {
    path: '/administracion/clasificacion',
    name: 'ManagmentClassification',
    component: () => import('../views/administration/Classification'),
  },

  {
    path: '/administracion/permisos',
    name: 'ManagmentPermits',
    component: () => import('../views/administration/Permits'),
  },

  {
    path: '/administracion/estadovisita',
    name: 'ManagmentVisitingState',
    component: () => import('../views/administration/VisitingState'),
  },
];

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL || '/geocimat',
  base: process.env.BASE_URL,
  routes,
});

export default router;
