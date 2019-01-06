<template>
  <q-layout view="lHh LpR lFf">
    <q-layout-header>
      <q-toolbar color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'">
        <q-toolbar-title>Tara Chat
          <div slot="subtitle">Running on Quasar v{{ $q.version }}</div>
        </q-toolbar-title>
        <q-btn round color="secondary" @click="Connect">
          <q-icon name="cached"/>
        </q-btn>
        <q-btn flat round dense @click="Logout" title="Logout">
          <q-icon name="ion-ios-log-out"/>
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer side="left" v-model="drawer">
      <q-list no-border link inset-delimiter>
        <q-item>
          <q-item-side :avatar="avatars[nickname]"/>
          <q-item-main :label="nickname"/>
        </q-item>
        <q-list-header>Other Online Users</q-list-header>
        <q-item
          v-for="({uid, nickname}, index) in onlineusers"
          :key="`${index}-${uid}-${nickname}`"
        >
          <q-item-side :avatar="avatars[nickname]"/>
          <q-item-main :label="nickname"/>
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>

    <q-layout-footer>
      <q-editor
        v-model="input"
        :toolbar="[
          ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript', 'removeFormat'],
          ['token', 'hr', 'link'],
          ['p', 'quote', 'code'],
          ['unordered', 'ordered', 'outdent', 'indent']
        ]"
        :content-style="{ 'height': '80px', 'overflow-y': 'scroll' }"
      ></q-editor>
      <q-toolbar color="secondary">
        <q-toolbar-title></q-toolbar-title>
        <q-btn dense class="float-right" label="Send" icon="send" @click="SendMessage"></q-btn>
      </q-toolbar>
    </q-layout-footer>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { Logout } from 'src/utils/auth.js'
import { Connect } from 'src/utils/socket.js'
import { Avatar } from 'src/utils/avatar.js'
import { FetchOnlineUsers, SendMessage } from 'src/utils/chat.js'
import { ipcRenderer } from 'electron'

export default {
  name: 'MyLayout',
  data () {
    return {
      drawer: true,
      input: '',
      nickname: '',
      onlineusers: [],
      avatars: {}
    }
  },
  methods: {
    openURL,
    Connect,
    Logout () {
      Logout().then(() => {
        this.$router.push({ name: 'Login' })
      }).catch(error => {
        alert(error)
      })
    },
    SendMessage () {
      console.log(this.input)
      SendMessage({
        touid: 'whoever',
        message: this.input
      })
      alert(this.input)
    },
    fetchAvatar (nickname) {
      Avatar(nickname).then(payload => {
        this.avatars[nickname] = payload.uri
        this.avatars.__ob__.dep.notify()
      })
    }
  },
  mounted () {
    ipcRenderer.on('broadcast.online', (event, arg) => {
      this.onlineusers.push(arg)
      this.fetchAvatar(arg.nickname)
    })

    ipcRenderer.on('broadcast.offline', (event, arg) => {
      const idx = this.onlineusers.findIndex(payload => arg.uid === payload.uid)
      this.onlineusers.splice(idx, 1)
    })

    this.nickname = this.$q.sessionStorage.get.item('nickname')
    this.fetchAvatar(this.nickname)

    FetchOnlineUsers().then(({ onlineusers }) => {
      this.onlineusers = onlineusers.filter(({ uid }) => this.$q.sessionStorage.get.item('uid') !== uid)
      for (let { nickname } of this.onlineusers) {
        this.fetchAvatar(nickname)
      }
    })
  }
}
</script>

<style>
</style>
