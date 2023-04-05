#! /usr/bin/env python3.6
"""
Python 3.6 or newer required.
"""
import stripe

stripe.api_key = 'sk_test_sample_key'

stripe.api_version = '2022-08-01; embedded_connect_beta=v1'

from flask import Flask, jsonify


app = Flask(__name__, static_folder='public',
            static_url_path='', template_folder='public')

@app.route('/account_session', methods=['POST'])
def create_account_session():
    try:
        account_session = stripe.AccountSession.create(
          account="{{account_ID}}"
        )

        return jsonify({
          'client_secret': account_session.client_secret,
        })
    except Exception as e:
        print('An error occurred when calling the Stripe API to create an account session: ', e)
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(port=4242)