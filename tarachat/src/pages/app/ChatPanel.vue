<template>
  <q-page class="flex">
    <q-scroll-area style="flex: 1">
      <div class="fit">
        <q-chat-message
          v-for="(chat, index) in chats"
          :key="`${index}-${chat.name}-${chat.timestamp}`"
          :name="chat.name"
          :avatar="avatars[chat.name]"
          :text="[chat.message]"
          :stamp="format(chat.timestamp)"
          :sent="chat.sent"
        />
      </div>
    </q-scroll-area>
  </q-page>
</template>

<style>
</style>

<script>
import { Avatar } from 'src/utils/avatar.js'
import dateFns from 'date-fns'

export default {
  name: 'chat-panel',
  data () {
    return {}
  },
  props: ['avatars', 'chats'],
  methods: {
    format: dateFns.distanceInWordsToNow
  },
  created () {
    Avatar('me').then(({ uri, arg }) => {
      this.avatarMe = uri
    })
  }
}
</script>
