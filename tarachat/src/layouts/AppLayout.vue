<template>
  <q-layout view="hHh LpR lFf">
    <q-layout-header>
      <q-toolbar color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'">
        <!-- <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu"/>
        </q-btn>-->
        <q-toolbar-title>Tara Chat
          <div slot="subtitle">Running on Quasar v{{ $q.version }}</div>
        </q-toolbar-title>

        <q-btn flat round dense @click="Logout" title="Logout">
          <q-icon name="ion-ios-log-out"/>
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer v-model="leftDrawerOpen">
      <q-list no-border link inset-delimiter>
        <q-list-header>Friends</q-list-header>
        <q-item @click.native="openURL('http://quasar-framework.org')">
          <q-item-side letter="D"/>
          <q-item-main label="Docs" sublabel="quasar-framework.org"/>
        </q-item>
        <q-item @click.native="openURL('https://github.com/quasarframework/')">
          <q-item-side letter="G"/>
          <q-item-main label="GitHub" sublabel="github.com/quasarframework"/>
        </q-item>
        <q-item @click.native="openURL('https://discord.gg/5TDhbDg')">
          <q-item-side icon="chat"/>
          <q-item-main label="Discord Chat Channel" sublabel="https://discord.gg/5TDhbDg"/>
        </q-item>
        <q-item @click.native="openURL('http://forum.quasar-framework.org')">
          <q-item-side icon="record_voice_over"/>
          <q-item-main label="Forum" sublabel="forum.quasar-framework.org"/>
        </q-item>
        <q-item @click.native="openURL('https://twitter.com/quasarframework')">
          <q-item-side icon="rss feed"/>
          <q-item-main label="Twitter" sublabel="@quasarframework"/>
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
        :content-style="contentStyle"
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

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: true,
      input: '',
      contentStyle: { 'height': '80px', 'overflow-y': 'scroll' }
    }
  },
  methods: {
    openURL,
    Logout () {
      Logout().then(() => {
        this.$router.push({ name: 'Login' })
      }).catch(error => {
        alert(error)
      })
    },
    SendMessage () {
      console.log(this.input)
      alert(this.input)
    }
  }
}
</script>

<style>
</style>
