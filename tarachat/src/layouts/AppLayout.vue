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
        <q-list-header>Friends</q-list-header>
        <q-item v-for="(contact, index) in contacts" :key="`${contact}-${index}`">
          <q-item-side :avatar="avatars[contact]"/>
          <q-item-main :label="contact" sublabel="No Latest Message"/>
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
import { SendMessage } from 'src/utils/chat.js'

export default {
  name: 'MyLayout',
  data () {
    return {
      drawer: true,
      input: '',
      contacts: [
        'Docs',
        'GitHub',
        'Discord',
        'Forum',
        'Twitter'
      ],
      avatars: {}
    }
  },
  computed: {
    nickname () {
      console.log(__filename, this.$q.sessionStorage.get.item('nickname'))
      return this.$q.sessionStorage.get.item('nickname')
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
        toFriend: 'whoever',
        message: input
      })
      alert(this.input)
    }
  },
  mounted () {
    Avatar(this.nickname).then(({ uri, arg }) => {
      this.avatars[this.nickname] = uri
      this.avatars.__ob__.dep.notify() // 这条是用来强制更新view的，如果没有发现特殊的bug不要抄过去
    })
    for (let identity of this.contacts) {
      Avatar(identity).then((payload) => {
        const uri = payload.uri
        const ident = payload.identity

        console.log(identity, ident, uri)

        this.avatars[identity] = uri
        this.avatars.__ob__.dep.notify() // 这条是用来强制更新view的，如果没有发现特殊的bug不要抄过去
      })
    }
  }
}
</script>

<style>
</style>
