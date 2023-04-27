# Simple test app for testing the connect-js package
This is a simple app that renders the embedded payments component and loads the connect-js script using this npm package. Use this app to test out the library.

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
Run 
yarn local-test-install --> download packages from yalc cache
yarn start --> runs rollup to compile and starts the server
```

3. Go to [http://localhost:4242/index.html](http://localhost:4242/index.html)
