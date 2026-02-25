(function() {
    console.log("%c 🕵️ Spy Tool Injected Successfully! ", "background: #222; color: #bada55; font-size: 16px; padding: 4px; border-radius: 4px;");

    const pixelEvents = [];

    function logPixelEvent(source, data) {
        const event = { source, data, timestamp: new Date().toISOString() };
        pixelEvents.push(event);
        console.groupCollapsed(`%c 🎯 Pixel Event Detected: ${source} `, "background: #ff0000; color: #fff; font-weight: bold; padding: 2px 4px; border-radius: 2px;");
        console.log("Data:", data);
        console.groupEnd();
        
        // Visual Feedback
        const toast = document.createElement('div');
        toast.style.cssText = 'position: fixed; top: 20px; right: 20px; background: rgba(0,0,0,0.8); color: white; padding: 10px 20px; border-radius: 5px; z-index: 10000; font-family: monospace; transition: opacity 0.5s;';
        toast.textContent = `🎯 ${source} Event`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // Intercept Fetch
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const [url, config] = args;
        if (typeof url === 'string') {
            if (url.includes('facebook') || url.includes('google-analytics') || url.includes('g.doubleclick') || url.includes('collect')) {
                 logPixelEvent('FETCH', { url, method: config?.method || 'GET', body: config?.body });
            }
        }
        return originalFetch.apply(this, args);
    };

    // Intercept XHR
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        this._method = method;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        if (this._url && (this._url.includes('facebook') || this._url.includes('google-analytics') || this._url.includes('g.doubleclick') || this._url.includes('collect'))) {
            logPixelEvent('XHR', { url: this._url, method: this._method, body });
        }
        return originalSend.apply(this, arguments);
    };

    window.__spyToolEvents = pixelEvents;

})();
