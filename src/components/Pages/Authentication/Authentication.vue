<template>
    <div id="app">
        <v-app id="inspire">
          <v-content>
            <v-container fluid fill-height>
              <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                  <v-card class="elevation-12" v-if="signUpVisible == false">
                    <v-toolbar dark color="primary">
                      <v-toolbar-title>Login form</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                      <v-form v-model="validLogin">
                        <v-text-field  
                        v-model="credentials.username"
                        prepend-icon="account_box"
                        :rules="rules"
                        required
                        required name="login" label="Login" type="text"></v-text-field>
                        <v-text-field prepend-icon="lock"
                         v-model="credentials.password"
                        :rules="rules"
                        :append-icon="loginPasswordVisible ? 'visibility' : 'visibility_off'"
                        :append-icon-cb="() => (loginPasswordVisible = !loginPasswordVisible)"
                        :type="loginPasswordVisible ? 'text' : 'password'"
                        required
                         name="password" label="Password" id="password" type="password"></v-text-field>
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click.native="submitAuthentication()">Login</v-btn>
                      <v-btn flat color="primary" @click.native="signUpVisible=true">Create account</v-btn>
                    </v-card-actions>
                  </v-card>

                    <v-card class="elevation-12" v-if="signUpVisible">
                      <v-toolbar dark color="primary">
                        <v-toolbar-title>Sign Up form</v-toolbar-title>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-card-text>
                        <v-form v-model="validSignUp">
                          <v-text-field label="Username"
                          v-model="newUser.username"
                          prepend-icon="account_box"
                          :rules="rules"
                          required>
                          </v-text-field>


                          <v-text-field label="Password"
                          v-model="newUser.password"
                          prepend-icon="lock"
                          :rules="rules"
                          :append-icon="signUpPasswordVisible ? 'visibility' : 'visibility_off'"
                          :append-icon-cb="() => (signUpPasswordVisible = !signUpPasswordVisible)"
                          :type="signUpPasswordVisible ? 'text' : 'password'"
                          required>
                          </v-text-field>                  
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="primary" @click.native="signUpVisible=false">Login</v-btn>
                          <v-btn block color="primary" @click.native="submitSignUp()">Sign Up</v-btn>
                        </v-card-actions>
                    </v-card>
                    <v-snackbar bottom="bottom"
                    color="red lighten-1"
                    v-model="snackbar">
                    {{ message }}
                    </v-snackbar>
                </v-flex>
              </v-layout>
            </v-container>
          </v-content>
        </v-app>
      </div>

  <!--div class="l-auth-container">
    <div class="l-auth">
      <v-form v-model="validLogin">
        <v-text-field label="Username"
                      v-model="credentials.username"
                      prepend-icon="account_box"
                      :rules="rules"
                      required
                      color="light-blue lighten-1">
        </v-text-field>

        <v-text-field label="Password"
                      v-model="credentials.password"
                      prepend-icon="lock"
                      :rules="rules"
                      :append-icon="loginPasswordVisible ? 'visibility' : 'visibility_off'"
                      :append-icon-cb="() => (loginPasswordVisible = !loginPasswordVisible)"
                      :type="loginPasswordVisible ? 'text' : 'password'"
                      color="light-blue lighten-1"
                      required>
        </v-text-field>

        <v-btn flat color="light-blue lighten-1" @click.native="signUpVisible = true">Create account</v-btn>
        <v-btn color="light-blue lighten-1" @click.native="submitAuthentication()">Login</v-btn>
      </v-form>
    </div>

    <div class="l-signup" v-if="signUpVisible">
      <v-form v-model="validSignUp">
        <v-text-field label="Username"
                      v-model="newUser.username"
                      prepend-icon="account_box"
                      :rules="rules"
                      required
                      color="light-blue lighten-1">
        </v-text-field>

        <v-text-field label="Employe ID"
                      v-model="newUser.emp_id"
                      prepend-icon="account_box"
                      :rules="rules"
                      required
                      color="light-blue lighten-1">
        </v-text-field>

        <v-text-field label="Password"
                      v-model="newUser.password"
                      prepend-icon="lock"
                      :rules="rules"
                      :append-icon="signUpPasswordVisible ? 'visibility' : 'visibility_off'"
                      :append-icon-cb="() => (signUpPasswordVisible = !signUpPasswordVisible)"
                      :type="signUpPasswordVisible ? 'text' : 'password'"
                      color="light-blue lighten-1"
                      required>
        </v-text-field>

        <v-btn block color="light-blue lighten-1" @click.native="submitSignUp()">Sign Up</v-btn>
      </v-form>
    </div>

    <v-snackbar bottom="bottom"
                color="red lighten-1"
                v-model="snackbar">
      {{ message }}
    </v-snackbar>
  </div !-->
</template>
<script>
import Authentication from '@/components/pages/Authentication'
export default {
  data () {
    return {
      snackbar: false,
      validLogin: false,
      validSignUp: false,
      signUpVisible: false,
      loginPasswordVisible: false,
      signUpPasswordVisible: false,
      rules: [ (value) => !!value || 'This field is required' ],
      credentials: {
        username: '',
        password: ''
      },
      newUser: {
        username: '',
        password: '',
        emp_id: ''
      },
      message: '',
      drawer: null
    }
  },
  props: {
        source: String
  },
  methods: {
    submitAuthentication () {
      Authentication.authenticate(this, this.credentials, '/')
    },

    submitSignUp () {
      Authentication.signup(this, this.newUser, '/')
    }
  }
}
</script>
