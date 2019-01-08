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

        <div v-for="({tonickname, filename, percentage}, digest) in sendFileProgress" :key="digest">
          <div class="q-caption">{{filename}} => {{tonickname}}</div>
          <q-progress :percentage="percentage"/>
        </div>

        <div
          v-for="({fromnickname, filename, percentage}, digest) in receiveFileProgress"
          :key="digest"
        >
          <div class="q-caption">{{fromnickname}} => {{filename}}</div>
          <q-progress :percentage="percentage"/>
        </div>

        <q-list-header>Other Online Users</q-list-header>
        <q-item
          v-for="(nickname, uid) in onlineusers"
          :key="`${uid}-${nickname}`"
          @click.native="ClickContactHandler (uid, nickname)"
        >
          <q-item-side :avatar="avatars[nickname]"/>
          <q-item-main :label="nickname"/>
          <q-item-side v-if="unread[uid]" icon="chat_bubble"/>
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <chat-panel :avatars="avatars" :chats="chats[onchat.uid]"/>
    </q-page-container>

    <q-layout-footer>
      <q-editor
        v-model="input"
        :disable="sendMessageDisabled"
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

        <q-btn
          icon-right="attach_file"
          :disable="sendMessageDisabled"
          label="Send File"
          @click="SendFile"
        />
        <q-btn
          icon-right="send"
          :disable="sendMessageDisabled || !input"
          label="Send"
          @click="SendMessage"
        />
      </q-toolbar>
    </q-layout-footer>

    <q-modal v-model="fileModalOpened"></q-modal>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { Logout } from 'src/utils/auth.js'
import { Connect } from 'src/utils/socket.js'
import { Avatar } from 'src/utils/avatar.js'
import { FetchOnlineUsers, SendMessage, SendFile } from 'src/utils/chat.js'
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
      uid: -1,
      onlineusers: {},
      avatars: {},
      onchat: {},
      chats: {},
      unread: {},
      title: 'Tara Chat',
      fileModalOpened: false,
      sendFileProgress: {},
      receiveFileProgress: {},
      percentage: 22
    }
  },
  computed: {
    sendMessageDisabled () {
      return this.onchat.uid === undefined
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
    SendFile () {
      console.log('SendFile Clicked')
      SendFile({
        fromuid: this.uid,
        touid: this.onchat.uid
      }).then(({ touid, name, size, digest }) => {
        console.log({ touid, name, size, digest })
        this.$set(this.sendFileProgress, digest, {
          tonickname: this.onlineusers[this.onchat.uid],
          filename: name,
          percentage: 0
        })
      })
    },
    SendMessage () {
      console.log(this.input)
      const timestamp = new Date()
      const message = this.input

      if (this.chats[this.onchat.uid] === undefined) {
        this.$set(this.chats, this.onchat.uid, [])
      }

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
      this.$set(this.unread, this.onchat.uid, false)
    }
  },
  mounted () {
    this.nickname = this.$q.sessionStorage.get.item('nickname')
    this.uid = this.$q.sessionStorage.get.item('uid')
    this.fetchAvatar(this.nickname)

    ipcRenderer.on('broadcast.online', (event, arg) => {
      this.$set(this.onlineusers, parseInt(arg.uid), arg.nickname)
      this.fetchAvatar(arg.nickname)
    })

    ipcRenderer.on('broadcast.offline', (event, arg) => {
      this.$delete(this.onlineusers, parseInt(arg.uid))
    })

    ipcRenderer.on('chat.sendfile.progress', (event, arg) => {
      const { infoobj, progress } = arg
      this.$set(this.sendFileProgress[infoobj.digest], 'percentage', progress.percentage)
      if (progress.percentage >= 100) {
        this.$delete(this.sendFileProgress[infoobj.digest], 'percentage')
      }
    })

    ipcRenderer.on('r.chat.sendfile', (event, arg) => {
      this.$delete(this.sendFileProgress, arg.digest)
      this.$q.notify({
        message: `Send file complete.`,
        timeout: 2500,
        color: 'positive',
        position: 'bottom-left'
      })
    })

    ipcRenderer.on('chat.receivefile', (event, arg) => {
      const { fromuid, name, newPath, digest } = arg
      this.$set(this.receiveFileProgress, digest, {
        fromnickname: this.onlineusers[fromuid],
        filename: name,
        newPath,
        percentage: 0
      })
    })

    ipcRenderer.on('chat.receivefile.progress', (event, arg) => {
      const { infoobj, progress } = arg
      this.$set(this.receiveFileProgress[infoobj.digest], 'percentage', progress.percentage)
      if (progress.percentage >= 100) {
        this.$q.notify({
          message: `File received at ${this.receiveFileProgress[infoobj.digest].newPath}`,
          timeout: 2500,
          color: 'positive',
          position: 'bottom-left'
        })
        this.$delete(this.receiveFileProgress, infoobj.digest)
      }
    })

    FetchOnlineUsers().then(({ onlineusers }) => {
      let ou = onlineusers.filter(({ uid }) => this.$q.sessionStorage.get.item('uid') !== uid)
      for (let { uid, nickname } of ou) {
        this.$set(this.onlineusers, parseInt(uid), nickname)
        this.fetchAvatar(nickname)
      }

      ipcRenderer.on('q.chat.receivemsg', (event, arg) => {
        const { fromuid, touid, message, timestamp } = arg
        let channel = fromuid

        if (touid !== this.uid) {
          channel = touid
        }

        if (this.chats[channel] === undefined) {
          this.$set(this.chats, channel, [])
        }

        this.chats[channel].push({
          name: this.onlineusers[fromuid],
          sent: false,
          message,
          timestamp
        })

        if (this.onchat.uid !== channel) {
          this.$set(this.unread, channel, true)
        }
      })
    })
  }
}
</script>

<style>
</style>
