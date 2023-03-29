# Integrate with Connect embedded UIs

Build a full, working integration using Connect embedded UIs. Included are some basic
build and run scripts you can use to start up the application.

## Replace the following variables

Ensure that you have replaced the following placeholders in the downloaded code sample:

- {{CONNECTED_ACCOUNT_ID}}
- pk_INSERT_YOUR_PUBLISHABLE_KEY
- sk_INSERT_YOUR_SECRET_KEY

## Running the sample

1. Build the server

```
pip3 install -r requirements.txt
```

2. Compile and run the server

```
Run npm pack from connect-js and install the tarball in this folder
npm install --save stripe-connect-js-1.0.0.tgz
rollup -c
export FLASK_APP=server.py
python3 -m flask run --port=4242
```

3. Go to [http://localhost:4242/index.html](http://localhost:4242/index.html)
