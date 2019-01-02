<template>
  <q-page class="flex">
    <q-list class="fit">
      <q-item class="justify-end">
        <q-chat-message class="" name="me" :avatar="avatarMe" :text="text" stamp="4 minutes ago" sent/>
      </q-item>
      <q-item class="justify-start">
        <q-chat-message name="me" :avatar="avatarMe" :text="text" stamp="4 minutes ago"/>
      </q-item>
    </q-list>
  </q-page>
</template>

<style>
</style>

<script>
import { avatar } from 'src/utils/avatar.js'

export default {
  name: 'Chat',
  data () {
    return {
      avatarMe: '',
      text: [
        '<span style="color: red">hunter2</span><br>hunter3'
      ]
    }
  },
  created () {
    const size = 200
    avatar('me', size).then(({ uri, arg }) => {
      this.avatarMe = uri
    })
  }
}
</script>
