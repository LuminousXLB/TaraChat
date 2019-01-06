<template>
  <q-page :padding="true">
    <div class="q-display-3">Register</div>
    <hr class="q-hr q-my-lg">

    <q-field :error="$v.form.nickname.$error" error-label="Please type a nickname">
      <q-input v-model="form.nickname" type="text" float-label="Nickname"/>
    </q-field>

    <q-field :error="$v.form.email.$error" error-label="Please type a valid email">
      <q-input v-model="form.email" type="email" float-label="Email" @blur="$v.form.email.$touch"/>
    </q-field>

    <q-field :error="$v.form.password.$error" error-label="Please type a longer password">
      <q-input v-model="form.password" type="password" float-label="Password"/>
    </q-field>

    <hr class="q-hr q-my-lg">

    <div class="row justify-around">
      <q-btn color="primary" class="q-py-sm q-px-xl" label="Go Back" @click="routeLogin"/>
      <q-btn color="primary" class="q-py-sm q-px-xl" label="Submit" @click="submit"/>
    </div>
  </q-page>
</template>

<script>
import { Register } from 'src/utils/auth.js'
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'Register',
  data: function () {
    return {
      form: {
        nickname: '',
        email: 'username@example.com',
        password: 'asdfqwer'
      }
    }
  },
  validations: {
    form: {
      nickname: { required },
      email: { required, email },
      password: { required, minLength: minLength(6) }
    }
  },
  methods: {
    routeLogin () {
      this.$router.push({ name: 'Login' })
    },
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please review fields again.')
        return
      }

      const { nickname, email, password } = this.form
      Register({ nickname, email, password }).then(() => {
        this.$q.notify({
          message: `Register Success`,
          timeout: 1500,
          type: 'positive',
          position: 'bottom-right'
        })
        this.$router.push({ name: 'Login' })
      }).catch(error => {
        this.$q.dialog({
          title: 'Register Failed',
          message: error,
          color: 'negative',
          ok: true,
          preventClose: true
        })
      })
    }
  }
}
</script>

<style>
</style>
