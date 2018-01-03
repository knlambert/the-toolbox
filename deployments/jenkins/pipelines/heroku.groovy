pipeline {
    agent none
    stages {
        stage('Clone git resources') {
            agent {
                docker([
                    image: 'knlambert/the-toolbox-build:latest'
                ])
            }
            steps {
                git([
                    url:"https://github.com/knlambert/the-toolbox.git", 
                    branch: "master"
                ])
            }
        }
        stage('Build project') {
            agent {
                docker([
                    image: 'knlambert/the-toolbox-build:latest'
                ])
            }
            steps {
                withEnv([
                    'HOME=.'
                ]) {
                    sh 'cd client && npm install'
                    sh 'cd client && HOME=/ ./node_modules/@angular/cli/bin/ng build --prod'
                }
            }
        }
        stage('Construct build folder') {
            agent {
                docker([
                    image: 'knlambert/the-toolbox-build:latest'
                ])
            }
            steps {
                sh 'rm -rf build && mkdir build'
                sh 'cp -R dist build/'
                sh 'cp -R server build/'
                sh 'cp -R requirements build/'
                sh 'cp main.py build/'
                sh 'cp wsgi.py build/'
                sh 'ls -l build/'
                withCredentials([file(credentialsId: 'toolbox-config-prod.py', variable: 'TOOLBOX_CONFIG')]) {
                    sh 'cat $TOOLBOX_CONFIG > build/config.py'
                }
                withCredentials([file(credentialsId: 'toolbox-notification-config-prod.py', variable: 'TOOLBOX_NOTIFICATION_CONFIG')]) {
                    sh 'cat $TOOLBOX_NOTIFICATION_CONFIG > build/notification_config.py'
                }
            }
        }
        stage('Build docker image') {
            agent {
                node {
                    label 'build'
                }
            }
            steps {
                sh 'heroku container:push web --app the-toolbox-dummy'
                sh 'rm -rf build'
            }
        }
    }
}