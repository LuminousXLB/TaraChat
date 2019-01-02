<template>
  <q-layout>
    <q-page-container>
      <q-page :padding="true">
        <div class="q-display-3">Register</div>
        <hr class="q-hr q-my-lg">

        <q-input v-model="nickname" type="text" float-label="Nickname"/>
        <q-input v-model="email" type="email" float-label="Email"/>
        <q-input v-model="password" type="password" float-label="Password"/>

        <hr class="q-hr q-my-lg">

        <div class="row justify-around">
          <q-btn color="primary" class="q-py-sm q-px-xl" label="Go Back" @click="routeLogin"/>
          <q-btn color="primary" class="q-py-sm q-px-xl" label="Submit" @click="Register"/>
        </div>
      </q-page>
    </q-page-container>

    <!-- <q-page-container>
      <router-view />
    </q-page-container>-->
  </q-layout>
</template>

<script>
import { Register } from 'src/utils/auth.js'

export default {
  name: 'Register',
  data: function () {
    return {
      nickname: '',
      email: 'username@example.com',
      password: 'sdf'
    }
  },
  methods: {
    routeLogin () {
      this.$router.push({ name: 'Login' })
    },
    Register () {
      const { nickname, email, password } = this
      Register({ nickname, email, password }).then(() => {
        alert('success')
        this.$router.push({ name: 'Login' })
      }).catch(error => {
        alert(error)
      })
    }
  }
}
</script>

<style>
</style>
