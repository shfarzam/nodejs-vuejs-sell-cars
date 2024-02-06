<!-- Login.vue -->
<template>
    <div>
        <h2>Home</h2>

        <p v-if="error">{{ error }}</p>
        <!-- Add a navigation link to the home page -->
        <router-link to="/login">Login</router-link>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            email: '',
            password: '',
            error: null,
        };
    },
    methods: {
        async login() {
            try {
                // Call your login API endpoint (implemented in AuthController.js)
                const response = await this.$axios.post('/api/login', {
                    email: this.email,
                    password: this.password,
                });

                // Save the token in local storage or another storage mechanism
                const token = response.data.token;
                localStorage.setItem('token', token);

                // Redirect or perform other actions upon successful login
                // For example, you can use Vue Router to navigate to another page
                // this.$router.push('/dashboard');
            } catch (error) {
                this.error = 'Invalid email or password';
            }
        },
    },
};
</script>
  
<style scoped>
/* Add your styles here */
</style>
  