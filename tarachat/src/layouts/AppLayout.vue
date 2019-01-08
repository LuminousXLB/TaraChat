<template>
  <q-layout view="lHh LpR lFf">
    <q-layout-header>
      <q-toolbar color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'">
        <q-toolbar-title>
          {{ title }}
          <div slot="subtitle">Running on Quasar v{{ $q.version }}</div>
        </q-toolbar-title>
        <q-btn flat round dense @click="Connect">
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
          v-for="(nickname, uid) in onlineusers"
          :key="`${uid}-${nickname}`"
          @click.native="ClickContactHandler (uid, nickname)"
        >
          <q-item-side :avatar="avatars[nickname]"/>
          <q-item-main :label="nickname"/>
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <chat-panel :avatars="avatars" :chats="chats[onchat.uid]"/>
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
        ref="editor"
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
import ChatPanel from 'pages/app/ChatPanel'

export default {
  name: 'MyLayout',
  components: {
    'chat-panel': ChatPanel
  },
  data () {
    return {
      drawer: true,
      input: '',
      nickname: '',
      onlineusers: {},
      avatars: {},
      onchat: {},
      chats: {},
      title: 'Tara Chat'
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
      const timestamp = new Date()
      const message = this.input
      if (this.chats[this.onchat.uid] === undefined) {
        this.$set(this.chats, this.onchat.uid, [])
      }

      // this.onchat.uid
      this.chats[this.onchat.uid].push({
        name: this.nickname,
        sent: true,
        message,
        timestamp
      })

      this.input = ''
      this.$refs.editor.$el.children[1].focus()

      SendMessage({
        touid: this.onchat.uid,
        message,
        timestamp
      }).then(() => {
        console.log('success')
      }).catch(error => {
        console.error(error)
      })
    },
    fetchAvatar (nickname) {
      Avatar(nickname).then(payload => {
        this.$set(this.avatars, nickname, payload.uri)
      })
    },
    ClickContactHandler (uid, nickname) {
      this.title = 'Tara Chat - ' + nickname
      this.onchat = { uid: parseInt(uid), nickname }
    }
  },
  mounted () {
    ipcRenderer.on('broadcast.online', (event, arg) => {
      this.$set(this.onlineusers, parseInt(arg.uid), arg.nickname)
      this.fetchAvatar(arg.nickname)
    })

    ipcRenderer.on('broadcast.offline', (event, arg) => {
      this.$delete(this.onlineusers, parseInt(arg.uid))
    })

    this.nickname = this.$q.sessionStorage.get.item('nickname')
    this.fetchAvatar(this.nickname)

    FetchOnlineUsers().then(({ onlineusers }) => {
      let ou = onlineusers.filter(({ uid }) => this.$q.sessionStorage.get.item('uid') !== uid)
      for (let { uid, nickname } of ou) {
        this.$set(this.onlineusers, parseInt(uid), nickname)
        this.fetchAvatar(nickname)
      }
    })
  }
}
</script>

<style>
</style>
