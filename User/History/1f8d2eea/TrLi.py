import os
import sys
import platform
import urllib.request
import json
import tarfile
import zipfile

def get_asset_name():
    system = platform.system().lower()
    machine = platform.machine().lower()

    if system == "darwin":
        os_name = "Darwin"
        arch = "arm64" if machine == "arm64" else "x86_64"
        ext = "tar.gz"
    elif system == "windows":
        os_name = "Windows"
        arch = "arm64" if "arm" in machine else "x86_64"
        ext = "zip"
    elif system == "linux":
        os_name = "Linux"
        arch = "arm64" if "aarch64" in machine or "arm64" in machine else "x86_64"
        ext = "tar.gz"
    else:
        print(f"Unsupported OS: {system}")
        sys.exit(1)

    return f"github-mcp-server_{os_name}_{arch}.{ext}"

def main():
    print("Fetching latest release info...")
    req = urllib.request.Request("https://api.github.com/repos/github/github-mcp-server/releases/latest")
    # Optional: add github token if rate limited
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
    
    target_asset = get_asset_name()
    download_url = None
    
    for asset in data.get("assets", []):
        if asset["name"] == target_asset:
            download_url = asset["browser_download_url"]
            break
            
    if not download_url:
        print(f"Could not find asset {target_asset} for this platform.")
        sys.exit(1)
        
    print(f"Downloading {target_asset}...")
    bin_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "bin")
    os.makedirs(bin_dir, exist_ok=True)
    
    archive_path = os.path.join(bin_dir, target_asset)
    urllib.request.urlretrieve(download_url, archive_path)
    
    print(f"Extracting to {bin_dir}...")
    if archive_path.endswith('.zip'):
        with zipfile.ZipFile(archive_path, 'r') as zip_ref:
            zip_ref.extractall(bin_dir)
    else:
        with tarfile.open(archive_path, "r:gz") as tar:
            tar.extractall(path=bin_dir)
            
    os.remove(archive_path)
    
    # Make executable on Unix
    if platform.system().lower() != "windows":
        bin_path = os.path.join(bin_dir, "github-mcp-server")
        if os.path.exists(bin_path):
            os.chmod(bin_path, 0o755)
            
    print("Installation complete! You can now configure this binary in your mcp_config.json.")

if __name__ == "__main__":
    main()
