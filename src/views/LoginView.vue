<script setup>
import { ref } from 'vue';
import axios from '@axios'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();

const login = () => {
  loading.value = true;
  
  axios.post('/login', {
    email: email.value,
    password: password.value,
  }).then(r => {
    const { token, user } = r.data

    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', JSON.stringify(token))
    
    toast.success('Logged in', {
      autoClose: 3000,
    })

    router.push({ name: 'home' })
  }).catch(e => {
    if (e.response && e.response.status === 401) {
      toast.error('Wrong email or password', {
        autoClose: 3000,
      })
    } else {
      toast.error('Error logging in', {
        autoClose: 3000,
      })
      console.error(e);
    }
  }).finally(() => {
    loading.value = false
  })
};

</script>

<template>
  <div class="flex items-center min-h-screen p-4 lg:justify-center">
    <div
      class="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md"
    >
      <div
        class="p-4 py-6 text-white bg-blue-500 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly"
      >
        <div class="my-3 text-4xl font-bold tracking-wider text-center">
          <a href="#">HIJIFFY</a>
        </div>
        <p class="mt-6 text-xl font-bold text-center text-gray-300 md:mt-0">
          Google Dialogflow Chat
        </p>
      </div>
      <div class="p-5 bg-white md:flex-1">
        <h3 class="my-4 text-2xl font-semibold text-gray-700">Account Login</h3>
        <form action="#" class="flex flex-col space-y-5">
          <div class="flex flex-col space-y-1">
            <label for="email" class="text-sm font-semibold text-gray-500">Email address</label>
            <input
              v-model="email"
              type="email"
              id="email"
              autofocus
              class="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
            />
          </div>
          <div class="flex flex-col space-y-1">
            <div class="flex items-center justify-between">
              <label for="password" class="text-sm font-semibold text-gray-500">Password</label>
            </div>
            <input
              v-model="password"
              type="password"
              id="password"
              class="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
            />
          </div>
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
              :class="loading ? 'bg-blue-200' : 'bg-blue-500'"
              @click.prevent="login"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

  