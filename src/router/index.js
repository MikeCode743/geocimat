import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    // component: Home,
    component: () => import(/* webpackChunkName: "about" */ '../views/Project/ProjectCalendar.vue'),
  },

  {
    path: '/proyecto/registrar',
    name: 'ProjectForm',
    component: () => import(/* webpackChunkName: "about" */ '../views/Project/ProjectForm'),
  },

  {
    path: '/proyecto/:id/detalle',
    name: 'ProjectDetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/Project/ProjectRepository'),
  },

  {
    path: '/proyecto/Calendario',
    name: 'ProjectCalendar',
    component: () => import(/* webpackChunkName: "about" */ '../views/Project/ProjectCalendar'),
  },

  {
    path: '/administracion/categoria',
    name: 'ManagmentCategory',
    component: () => import(/* webpackChunkName: "about" */ '../views/administration/Category'),
  },

  {
    path: '/administracion/clasificacion',
    name: 'ManagmentClassification',
    component: () => import(/* webpackChunkName: "about" */ '../views/administration/Classification'),
  },

  {
    path: '/administracion/permisos',
    name: 'ManagmentPermits',
    component: () => import(/* webpackChunkName: "about" */ '../views/administration/Permits'),
  },

  {
    path: '/administracion/estadovisita',
    name: 'ManagmentVisitingState',
    component: () => import(/* webpackChunkName: "about" */ '../views/administration/VisitingState'),
  },
];

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL || '/geocimat',
  base: process.env.BASE_URL + '/geocimat',
  routes,
});

export default router;
