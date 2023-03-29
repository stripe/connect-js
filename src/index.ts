import { loadScript, initStripeConnect, LoadConnect } from "./shared";

// Execute our own script injection after a tick to give users time to do their
// own script injection.
const stripePromise = Promise.resolve().then(() => loadScript());

let loadCalled = false;

stripePromise.catch((err: Error) => {
  if (!loadCalled) {
    console.warn(err);
  }
});

export const loadConnect: LoadConnect = () => {
  loadCalled = true;

  return stripePromise.then(maybeConnect => initStripeConnect(maybeConnect));
};
