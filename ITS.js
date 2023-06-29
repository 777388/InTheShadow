function copyVariablesToShadowRoot(obj, ShadowRoot) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        const nestedShadowRoot = ShadowRoot.attachShadow({ mode: 'open' });
        copyVariablesToShadowRoot(value, nestedShadowRoot);
      } else {
        ShadowRoot[key] = value;
      }
    }
  }
}

function watchVariableChanges(obj, shadowRoot) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      let currentValue = obj[key];

      Object.defineProperty(obj, key, {
        get() {
          return currentValue;
        },
        set(newValue) {
          console.log(`Variable '${key}' changed:`, currentValue, '->', newValue);
          currentValue = newValue;

          // Update the value in the ShadowRoot
          ShadowRoot[key] = newValue;
        },
        enumerable: true,
        configurable: true,
      });

      if (typeof currentValue === 'object' && currentValue !== null) {
        const nestedShadowRoot = document.createElement('div');
        ShadowRoot.appendChild(nestedShadowRoot);
        watchVariableChanges(currentValue, nestedShadowRoot);
      }
    }
  }
}

function inspectDOM() {
  const bodyElement = document.body;
  const shadowRoot = bodyElement.attachShadow({ mode: 'open' });

  copyVariablesToShadowRoot(window, ShadowRoot);
  watchVariableChanges(window, ShadowRoot);
}

window.addEventListener('DOMContentLoaded', inspectDOM);
