<template>
  <q-page :padding="true">
    <div class="q-display-3">Login</div>
    <hr class="q-hr q-my-lg">

    <q-input v-model="email" type="email" float-label="Email"/>
    <q-input v-model="pwd" type="password" float-label="Password"/>

    <hr class="q-hr q-my-lg">

    <div class="row justify-around">
      <q-btn color="primary" class="q-py-sm q-px-xl" label="Register" @click="routeRegister"/>
      <q-btn color="primary" class="q-py-sm q-px-xl" label="Login" @click="Login"/>
    </div>
  </q-page>
</template>

<script>
import { Login } from 'src/utils/auth.js'

export default {
  name: 'Login',
  data: function () {
    return {
      email: 'username@example.com',
      pwd: 'sdf'
    }
  },
  methods: {
    routeRegister () {
      this.$router.push({ name: 'Register' })
    },
    Login () {
      const { email, password } = this
      Login({ email, password }).then(({ nickname }) => {
        alert(nickname)
        this.$router.push({ name: 'Chat' })
      }).catch(error => {
        alert(error)
      })
    }
  }
}
</script>

<style>
</style>
