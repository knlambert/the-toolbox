rm -rf dist build*
cd client
npm install
npm run build
cd ..
mkdir build
cp -r dist/ build/
cp -r database/ build/
cp -r server/ build/
cp config.py build/
cp main.py build/
cp notification_config.py build/
cp version.yaml build/
cp wsgi.py build/
cp requirements/prod.txt build/requirements.txt
tar -cvf build.tar.gz build/