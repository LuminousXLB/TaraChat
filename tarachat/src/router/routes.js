const routes = [
  {
    path: '/',
    component: () => import('layouts/BrandLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/login'
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('pages/auth/Login.vue')
        // children: [{ path: '', component: () => import('pages/Index.vue') }]
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('pages/auth/Register.vue')
        // children: [{ path: '', component: () => import('pages/Index.vue') }]
      }
    ]
  },
  {
    path: '/app',
    name: 'App',
    component: () => import('layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'Chat',
        component: () => import('pages/app/Chat.vue')
      }
    ]
    // children: [{ path: '', component: () => import('pages/Index.vue') }]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
