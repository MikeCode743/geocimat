import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/proyecto/registrar",
    name: "ProjectForm",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Project/ProjectForm"),
  },
  {
    path: "/proyecto/:id/detalle",
    name: "ProjectDetail",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/Project/ProjectRepository"
      ),
  },

  /* ROUTES OF ADMINISTRATION */

  {
    path: "/proyecto/Calendario",
    name: "ProjectCalendar",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/Project/ProjectCalendar"
      ),
  },
  {
    path: "/administracion/categoria",
    name: "ManagmentCategory",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/administration/Category"
      ),
  },
  {
    path: "/administracion/clasificacion",
    name: "ManagmentClassification",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/administration/Classification"
      ),
  },
  {
    path: "/administracion/permisos",
    name: "ManagmentPermits",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/administration/Permits"),
  },
  {
    path: "/administracion/estadovisita",
    name: "ManagmentVisitingState",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/administration/VisitingState"
      ),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
