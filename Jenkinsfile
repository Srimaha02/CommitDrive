pipeline {
    agent any

    stages {
        stage('Check tools') {
            steps {
                bat 'git --version'
                bat 'docker --version'
            }
        }

        stage('Build backend image') {
            steps {
                bat 'docker build -t commitdrive-backend:%BUILD_NUMBER% backend'
            }
        }

        stage('Build frontend image') {
            steps {
                bat 'docker build -t commitdrive-frontend:%BUILD_NUMBER% --build-arg VITE_API_URL=http://localhost:8080/api frontend'
            }
        }
    }

    post {
        success { echo 'All images built successfully.' }
        failure { echo 'Build failed. Check the stage that turned red.' }
    }
}