/* jshint esversion: 6 */
import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import ShowBench from './../components/ShowBench.vue';
import DoubleColorBall from './../components/doubleColorBall.vue';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  }, {
    path: '/showBench',
    name: 'ShowBench',
    component: ShowBench
  }, {
    path: '/doubleColorBall',
    name: 'DoubleColorBall',
    component: DoubleColorBall
  }]
});
