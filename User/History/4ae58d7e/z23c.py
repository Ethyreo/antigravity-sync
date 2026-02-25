#!/usr/bin/env python3
"""
Simple HTTP server for testing the game with ES6 modules.
Run this server and open http://localhost:8080 in your browser.
"""

import http.server
import socketserver
import os

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🦔 Sonic Multiverse Dev Server")
        print(f"📁 Serving: {DIRECTORY}")
        print(f"🌐 Open: http://localhost:{PORT}")
        print(f"🧪 Tests: http://localhost:{PORT}/test.html")
        print(f"\nPress Ctrl+C to stop...")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
