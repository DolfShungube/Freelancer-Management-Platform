import { defineConfig } from 'vite'
import { resolve } from 'path'
import { application } from 'express'

export default defineConfig({
  root: './',          
  build: {
    target: 'esnext',
    outDir: 'dist',

    rollupOptions: {
      input:{
          main: resolve(__dirname, 'index.html'),
          login: resolve(__dirname, 'frontend/src/pages/login.html'),
          addjob:resolve(__dirname, 'frontend/src/pages/AddJob.html'),
          admin:resolve(__dirname, 'frontend/src/pages/Admin.html'),
          applications:resolve(__dirname, 'frontend/src/pages/Aplication.html'),
          changepassword:resolve(__dirname, 'frontend/src/pages/changePassword.html'),
          chatbox:resolve(__dirname, 'frontend/src/pages/chatbox.html'),
          client:resolve(__dirname, 'frontend/src/pages/Client.html'),
          clientchat:resolve(__dirname, 'frontend/src/pages/clients.html'),
          freelanceddash:resolve(__dirname, 'frontend/src/pages/freelancer-dashboard.html'),
          freelancer:resolve(__dirname, 'frontend/src/pages/Freelancer.html'),
          freelancerchat:resolve(__dirname, 'frontend/src/pages/freelancers.html'),
          newpass:resolve(__dirname, 'frontend/src/pages/newPass.html'),
          progress:resolve(__dirname, 'frontend/src/pages/progress.html'),
          progressreport:resolve(__dirname, 'frontend/src/pages/progressReport.html'),
          register:resolve(__dirname, 'frontend/src/pages/Register.html'),
          settingsadmin:resolve(__dirname, 'frontend/src/pages/Setting_admin.html'),
          settingsclient:resolve(__dirname, 'frontend/src/pages/Setting_client.html'),
          settingsfreelancer:resolve(__dirname, 'frontend/src/pages/Setting.html'),
          contract:resolve(__dirname, 'frontend/src/pages/UploadContract.html'),
          viewjob:resolve(__dirname, 'frontend/src/pages/ViewJob.html')


             }
    }
  }
})