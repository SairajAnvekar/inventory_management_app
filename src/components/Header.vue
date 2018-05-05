<template>
  <header class="l-header-container">
      <v-navigation-drawer fixed v-model="drawer" app>
      <v-list dense>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <router-link to="/" class="text-decoration-none">
              <v-list-tile-title>Home</v-list-tile-title>
            </router-link>
          </v-list-tile-content>
        </v-list-tile> 
        <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon>add</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <router-link to="/manageProduct" class="text-decoration-none">
                <v-list-tile-title>Product</v-list-tile-title>
              </router-link>
            </v-list-tile-content>
          </v-list-tile> 
          <v-list-tile @click="">
              <v-list-tile-action>
                <v-icon>list</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <router-link to="/manageStock" class="text-decoration-none">
                  <v-list-tile-title>Stock</v-list-tile-title>
                </router-link>
              </v-list-tile-content>
            </v-list-tile> 
            <v-list-tile >
                <v-list-tile-action>
                  <v-icon>edit</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title> 
                    <router-link to="/manageUsers" class="text-decoration-none">
                      <v-list-tile-title>Users</v-list-tile-title>
                    </router-link>
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile >
                <v-list-tile-action>
                  <v-icon>search</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title> 
                    <router-link to="/manageInvoicing" class="text-decoration-none">
                      <v-list-tile-title>Invoice</v-list-tile-title>
                    </router-link>
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>      

                  <v-list-tile >
                <v-list-tile-action>
                  <v-icon>search</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title> 
                    <router-link to="/reports" class="text-decoration-none">
                      <v-list-tile-title>Reports</v-list-tile-title>
                    </router-link>
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>      
      </v-list>
    </v-navigation-drawer> 
    <v-toolbar color="indigo" dark fixed app>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>Application</v-toolbar-title>
          <v-spacer></v-spacer>
         <v-toolbar-items>
          <v-menu bottom offset-y>
            <v-btn icon large slot="activator">
              <v-icon>settings</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile @click="goToLink(`/profile`)">
                <v-list-tile-title>
                  <v-icon>account_circle</v-icon> Profile</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="submitSignout()">
                <v-list-tile-title>
                  <v-icon>input</v-icon> Log out</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar-items>    
      </v-toolbar>
  </header>
</template>
<script>
import Authentication from '@/components/pages/Authentication'
 import router from '@/router'
export default {
  data () {
    return {
      search: '',
      status: '',     
      drawer: null
    }
  },
  methods: {
    submitSignout () {
      Authentication.signout(this, '/login')
    },
    goToLink(url){
      router.push(url)
    },
  },
  props: {
      source: String
    }
}
</script>

<style lang="scss">
  @import "./../assets/styles";

  .text-decoration-none{
    text-decoration: none !important;
    color : black
  }
</style>

