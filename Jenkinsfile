pipeline {
    agent any

    stages {
        stage('Check tools') {
            steps {
                bat 'git --version'
                bat 'docker --version'
                bat 'java -version'
                bat 'mvn -v'
            }
        }

        stage('Backend tests') {
            steps {
                dir('backend') {
                    bat 'mvn -B test'
                }
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
        always {
            junit allowEmptyResults: true, testResults: 'backend/target/surefire-reports/*.xml'
        }
        success { echo 'All stages passed.' }
        failure { echo 'Build failed. Check the stage that turned red.' }
    }
}