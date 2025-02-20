import { decorate } from './private/utils';

function suppressedWarningNoop() {
  // Warnings are currently suppressed via @suppressWarnings
}

function applyWithoutWarnings(context, fn, args) {
  const nativeWarn = console.warn;
  console.warn = suppressedWarningNoop;
  const ret = fn.apply(context, args);
  console.warn = nativeWarn;
  return ret;
}

function handleDescriptor(target, key, descriptor, warningTypes) {
  return {
    ...descriptor,
    value: function suppressWarningsWrapper() {
      return applyWithoutWarnings(this, descriptor.value, arguments);
    }
  };
}

export default function suppressWarnings() {
  return decorate(handleDescriptor, arguments);
}
