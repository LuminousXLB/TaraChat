<template>
  <q-page class="flex">
    <q-scroll-area style="flex: 1">
      <div class="fit">
        <q-chat-message name="me" :avatar="avatarMe" :text="text" stamp="4 minutes ago" sent/>
        <q-chat-message name="me" :avatar="avatarMe" :text="text" stamp="4 minutes ago" sent/>
        <q-chat-message label="This is a label"/>
        <q-chat-message name="me" :avatar="avatarMe" :text="text" stamp="4 minutes ago" sent/>
        <q-chat-message name="me" :avatar="avatarMe" :text="text" stamp="4 minutes ago"/>
        <q-chat-message name="me" :avatar="avatarMe" :text="text" stamp="4 minutes ago" sent/>
        <q-chat-message name="me" :avatar="avatarMe" :text="text" stamp="4 minutes ago"/>
      </div>
    </q-scroll-area>
  </q-page>
</template>

<style>
</style>

<script>
import { Avatar } from 'src/utils/avatar.js'

export default {
  name: 'Chat',
  data () {
    return {
      avatarMe: '',
      text: [
        'hunter3'
      ],
      input: ''
    }
  },
  created () {
    Avatar('me').then(({ uri, arg }) => {
      this.avatarMe = uri
    })
  }
}
</script>
