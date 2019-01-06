<template>
  <q-page :padding="true">
    <div class="q-display-3">Login</div>
    <hr class="q-hr q-my-lg">

    <q-field :error="$v.form.email.$error" error-label="Please type a valid email">
      <q-input v-model="form.email" type="email" float-label="Email" @blur="$v.form.email.$touch"/>
    </q-field>

    <q-input v-model="form.password" type="password" float-label="Password"/>

    <hr class="q-hr q-my-lg">

    <div class="row justify-around">
      <q-btn color="primary" class="q-py-sm q-px-xl" label="Register" @click="routeRegister"/>
      <q-btn color="primary" class="q-py-sm q-px-xl" label="Login" @click="submit"/>
    </div>
  </q-page>
</template>

<script>
import { Login } from 'src/utils/auth.js'
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  data: function () {
    return {
      form: {
        email: 'username@example.com',
        password: 'asdfqwer'
      }
    }
  },
  validations: {
    form: {
      email: { required, email }
    }
  },
  methods: {
    routeRegister () {
      this.$router.push({ name: 'Register' })
    },
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please review fields again.')
        return
      }

      const { email, password } = this.form
      Login({ email, password }).then(({ uid, nickname, onlineusers }) => {
        this.$q.sessionStorage.set('uid', uid)
        this.$q.sessionStorage.set('nickname', nickname)
        this.$q.sessionStorage.set('onlineusers', onlineusers)
        console.log(onlineusers)
        this.$router.push({ name: 'Chat' })
      }).catch(error => {
        this.$q.dialog({
          title: 'Login Failed',
          message: error,
          color: 'negative',
          ok: true,
          preventClose: true
        }).then(() => {
          this.form.password = ''
        })
      })
    }
  }
}
</script>

<style>
</style>
