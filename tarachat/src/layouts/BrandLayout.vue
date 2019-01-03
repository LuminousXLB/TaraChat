<template>
  <q-layout>
    <q-layout-header>
      <q-btn round color="secondary" @click="Connect">
        <q-icon name="cached"/>
      </q-btn>
    </q-layout-header>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { Connect } from 'src/utils/socket.js'

export default {
  name: 'BrandLayout',
  methods: {
    Connect
  }
}
</script>

<style>
</style>
