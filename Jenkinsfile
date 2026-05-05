pipeline {
    agent any

    environment {
        // AWS – in Jenkins Credentials konfigurieren (ID: aws-credentials)
        AWS_DEFAULT_REGION = 'eu-central-1'
        AWS_ACCOUNT_ID     = credentials('aws-account-id')
        ECR_REGISTRY       = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"

        // Image Namen
        BACKEND_IMAGE  = "${ECR_REGISTRY}/drinking-leaderboard-backend"
        FRONTEND_IMAGE = "${ECR_REGISTRY}/drinking-leaderboard-frontend"
        IMAGE_TAG      = "${env.BUILD_NUMBER}-${env.GIT_COMMIT?.take(7) ?: 'latest'}"

        // EC2 Deployment – in Jenkins Credentials konfigurieren
        EC2_HOST = credentials('ec2-host')        // z.B. "ec2-user@1.2.3.4"
        EC2_KEY  = credentials('ec2-ssh-key')     // SSH private key

        // SonarQube – Server "SonarQube" in Jenkins konfigurieren
        SONAR_PROJECT_KEY = 'drinking-leaderboard'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // ─── BACKEND ────────────────────────────────────────────────────────────
        stage('Backend – Install') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Backend – Tests & Coverage') {
            steps {
                dir('backend') {
                    sh 'npm run test:ci'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: 'backend/coverage/junit.xml'
                }
            }
        }

        // ─── FRONTEND ────────────────────────────────────────────────────────────
        stage('Frontend – Install') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Frontend – Tests & Coverage') {
            steps {
                dir('frontend') {
                    sh 'npm run test:ci'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true,
                          testResults: 'frontend/coverage/junit.xml'
                }
            }
        }

        // ─── SONARQUBE ───────────────────────────────────────────────────────────
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh """
                        sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.projectVersion=${env.BUILD_NUMBER}
                    """
                }
            }
        }

        stage('SonarQube – Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // ─── DOCKER BUILD ────────────────────────────────────────────────────────
        stage('Build Docker Images') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            sh "docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} -t ${BACKEND_IMAGE}:latest ."
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            sh "docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -t ${FRONTEND_IMAGE}:latest ."
                        }
                    }
                }
            }
        }

        // ─── AWS ECR PUSH ────────────────────────────────────────────────────────
        stage('Push to AWS ECR') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding',
                                  credentialsId: 'aws-credentials']]) {
                    sh """
                        aws ecr get-login-password --region ${AWS_DEFAULT_REGION} \
                            | docker login --username AWS --password-stdin ${ECR_REGISTRY}

                        docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${BACKEND_IMAGE}:latest

                        docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${FRONTEND_IMAGE}:latest
                    """
                }
            }
        }

        // ─── DEPLOY TO EC2 ───────────────────────────────────────────────────────
        stage('Deploy to AWS EC2') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding',
                                  credentialsId: 'aws-credentials'],
                                 sshUserPrivateKey(credentialsId: 'ec2-ssh-key',
                                                  keyFileVariable: 'SSH_KEY')]) {
                    sh """
                        ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${EC2_HOST} << 'REMOTE'
                            aws ecr get-login-password --region ${AWS_DEFAULT_REGION} \
                                | docker login --username AWS --password-stdin ${ECR_REGISTRY}

                            docker pull ${BACKEND_IMAGE}:latest
                            docker pull ${FRONTEND_IMAGE}:latest

                            cd /opt/drinking-leaderboard
                            BACKEND_IMAGE=${BACKEND_IMAGE}:latest \
                            FRONTEND_IMAGE=${FRONTEND_IMAGE}:latest \
                            docker compose -f docker-compose.prod.yml up -d --remove-orphans

                            docker image prune -f
                        REMOTE
                    """
                }
            }
        }
    }

    post {
        always {
            // Coverage Reports im Jenkins UI anzeigen
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'backend/coverage/lcov-report',
                reportFiles: 'index.html',
                reportName: 'Backend Coverage'
            ])
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'frontend/coverage/lcov-report',
                reportFiles: 'index.html',
                reportName: 'Frontend Coverage'
            ])
            // Lokale Docker Images aufräumen
            sh 'docker image prune -f || true'
        }
        success {
            echo "Deployment erfolgreich: ${BACKEND_IMAGE}:${IMAGE_TAG}"
        }
        failure {
            echo 'Pipeline fehlgeschlagen – bitte Logs prüfen.'
        }
    }
}
