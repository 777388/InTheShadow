function copyVariablesToShadowRoot(obj, shadowRoot) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        const nestedContainer = document.createElement('div');
        shadowRoot.appendChild(nestedContainer);
        const nestedShadowRoot = nestedContainer.attachShadow({ mode: 'open' });
        copyVariablesToShadowRoot(value, nestedShadowRoot);
      } else {
        shadowRoot[key] = value;
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
          shadowRoot[key] = newValue;
        },
        enumerable: true,
        configurable: true,
      });

      if (typeof currentValue === 'object' && currentValue !== null) {
        const nestedContainer = document.createElement('div');
        shadowRoot.appendChild(nestedContainer);
        watchVariableChanges(currentValue, nestedContainer);
      }
    }
  }
}

function inspectDOM() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const shadowRoot = container.attachShadow({ mode: 'open' });

  copyVariablesToShadowRoot(window, shadowRoot);
  watchVariableChanges(window, shadowRoot);
}

window.addEventListener('DOMContentLoaded', inspectDOM);
