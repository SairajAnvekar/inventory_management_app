<template>
  <v-content  v-if="role == 'admin'">
    <v-layout>
      <app-header></app-header>
      <v-container>
        <v-layout row wrap>
          <v-flex d-flex xs10 sm10 md10>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Profile</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field label="Name" prepend-icon="account_box" v-model="profile.name" required>
                  </v-text-field>

                  <v-text-field label="Display name" prepend-icon="account_box" v-model="profile.display_name" required>
                  </v-text-field>

                  <v-text-field label="Address" prepend-icon="account_box" v-model="profile.address" required>
                  </v-text-field>

                  <v-text-field label="GSTIN" prepend-icon="account_box" v-model="profile.gstin" required>
                  </v-text-field>

                  <v-text-field label="TIN" prepend-icon="account_box" v-model="profile.tin" required>
                  </v-text-field>

                  <v-text-field label="Phone No" prepend-icon="account_box" v-model="profile.phone" required>
                  </v-text-field>
                <h3> Branch Details</h3>
                  <v-text-field label="Name" prepend-icon="account_box" v-model="branch.name">
                  </v-text-field>

                  <v-text-field label="Name" prepend-icon="account_box" v-model="branch.name" </v-text-field>

                    <v-text-field label="Adress" prepend-icon="account_box" v-model="branch.address" required>
                    </v-text-field>

                    <v-text-field label="Dc Number" prepend-icon="account_box" v-model="branch.dc_number" required>
                    </v-text-field>

                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click.native="addProfile()">add</v-btn>
                <v-btn color="primary" @click.native="updateProfile()">Update</v-btn>
                <v-btn>clear</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <app-footer></app-footer>
    </v-layout>
  </v-content>
</template>
<script>
  import Axios from 'axios'
  import moment from 'moment'
  import Authentication from '@/components/pages/Authentication'
  import APIurlConfig from '../../apiConfig'
  const apiURL = APIurlConfig.API_URL // 'http://localhost:3001'
  export default {
    data() {
      return {
        validated: 1,
        loginPage: false,
        role: this.$cookie.get('role'),
        profile: {},
        branch: {}
      }
    },
    mounted() {
      this.getProfile();
    },
    methods: {

      addProfile() {
        var self = this;
        this.profile.branch = this.branch;

        Axios.post(`${apiURL}/api/v1/profile/`, {
            profile: this.profile
          }, {
            headers: {
              'Authorization': Authentication.getAuthenticationHeader(this)
            }
          })
          .then(function (response) {
            console.log(response);
          }).catch(({
            response: {
              data
            }
          }) => {

          });
      },


      getProfile(context) {
        Axios.get(`${apiURL}/api/v1/profile/`, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (
          this.profile = data[0] ? data[0] : {},
          this.branch = data[0] ? data[0].branch : {}
        ))
      },

      updateProfile(context) {
        this.profile.branch = JSON.parse(JSON.stringify(this.branch));;
        console.log(this.profile);
        Axios.put(`${apiURL}/api/v1/profile/`, {
          profile: this.profile
        }, {
          headers: {
            'Authorization': Authentication.getAuthenticationHeader(this)
          }
        }).then(({
          data
        }) => (
          console.log(data)
        ))
      },
    }
  }

</script>
