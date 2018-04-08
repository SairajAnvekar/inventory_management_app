<template>
    <v-text-field label="Name"
    v-model="stock.name"
    prepend-icon="account_box"
    :rules="rules"
    required> </v-text-field>
</template>
    <script>
        import Authentication from '@/components/pages/Authentication'
        export default {
          data () {
            return {
              search: '',
              status: '',     
              rules: [ (value) => !!value || 'This field is required' ]
            }
          },
          methods: {
            submitSignout () {
              Authentication.signout(this, '/login')
            }
          }
        }
        </script>
        
        <style lang="scss">
          @import "./../../assets/styles";
        </style>