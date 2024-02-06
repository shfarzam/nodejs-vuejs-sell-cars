<!-- Login.vue -->
<template>
    <div class="login-container">
        <div class="login-card">
            <h2 class="title">Sell Cars</h2>
            <form @submit.prevent="login" class="login-form">
                <div class="input-group">
                    <input type="email" id="email" v-model="email" placeholder="Enter your email" class="input-field"
                        required />
                </div>

                <div class="input-group">
                    <input type="password" id="password" v-model="password" placeholder="Enter your password"
                        class="input-field" required />
                </div>

                <button type="submit" class="submit-btn">Login</button>
            </form>

            <p v-if="error" class="error-message">{{ error }}</p>

        </div>
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
                localStorage.setItem('email', this.email);

                // Redirect or perform other actions upon successful login
                this.$router.push('/customers-page');
            } catch (error) {
                this.error = 'Invalid email or password';
            }
        },
    },
};
</script>
  
<style scoped>
@import "../css/LoginStyle.css";
</style>
  