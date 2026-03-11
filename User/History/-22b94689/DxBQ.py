import os
import sys
import platform
import json

def main():
    repo_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    repo_mcp_config_path = os.path.join(repo_dir, "mcp_config.json")
    
    if not os.path.exists(repo_mcp_config_path):
        print(f"Error: {repo_mcp_config_path} not found.")
        sys.exit(1)
        
    with open(repo_mcp_config_path, "r") as f:
        config = json.load(f)
        
    # Update GitHub MCP Server absolute path based on the current OS
    if "github" in config.get("mcpServers", {}):
        bin_dir = os.path.join(repo_dir, "bin")
        if platform.system().lower() == "windows":
            bin_name = "github-mcp-server.exe" # or similar depending on extraction
            cmd_path = os.path.join(bin_dir, "github-mcp-server")
            # Usually .exe on windows, let's just point to github-mcp-server
            # The executable might not have .exe if it's a go build, but releases usually have .exe for Windows.
            cmd_path = os.path.join(bin_dir, "github-mcp-server.exe") if os.path.exists(os.path.join(bin_dir, "github-mcp-server.exe")) else os.path.join(bin_dir, "github-mcp-server")
        else:
            cmd_path = os.path.join(bin_dir, "github-mcp-server")
            
        config["mcpServers"]["github"]["command"] = cmd_path
        
    # Write to local Antigravity config
    gemini_dir = os.path.join(os.path.expanduser("~"), ".gemini", "antigravity")
    os.makedirs(gemini_dir, exist_ok=True)
    local_mcp_config_path = os.path.join(gemini_dir, "mcp_config.json")
    
    with open(local_mcp_config_path, "w") as f:
        json.dump(config, f, indent=2)
        
    print(f"Successfully synced mcp_config.json to {local_mcp_config_path}")

if __name__ == "__main__":
    main()
