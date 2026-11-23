# Setup (every PC, identical)

## 1. Install

1. **Unity Hub** → install the Unity version written in `ProjectSettings/ProjectVersion.txt`
   (once W1 has committed it). Everyone uses **exactly** that version.
   Add the build module for your OS (Windows / Mac Build Support).
2. **VS Code** + extensions:
   - **C# Dev Kit** (it will ask you to install the .NET SDK — do it)
   - **Unity** (by Microsoft)
   - **Cline**
3. **Git** and **Git LFS**, then once per machine:
   ```bash
   git lfs install
   ```

## 2. Clone

```bash
git clone https://github.com/MateInfinit/eth_year_one.git
cd eth_year_one
git lfs pull
```

## 3. Register Unity SmartMerge (once per machine)

Lets git merge scenes/prefabs much more cleanly. Adjust the path to your Unity version.

**Windows (Git Bash):**
```bash
git config merge.unityyamlmerge.name "Unity SmartMerge"
git config merge.unityyamlmerge.driver "'C:/Program Files/Unity/Hub/Editor/<VERSION>/Editor/Data/Tools/UnityYAMLMerge.exe' merge -p %O %B %A %A"
```

**macOS:**
```bash
git config merge.unityyamlmerge.name "Unity SmartMerge"
git config merge.unityyamlmerge.driver "'/Applications/Unity/Hub/Editor/<VERSION>/Unity.app/Contents/Tools/UnityYAMLMerge' merge -p %O %B %A %A"
```

## 4. Open in Unity, connect VS Code

1. Unity Hub → **Add → Add project from disk** → select the repo folder.
2. Check *Window → Package Manager* that **Visual Studio Editor** (`com.unity.ide.visualstudio`) is installed.
3. *Edit → Preferences → External Tools → External Script Editor* → **Visual Studio Code**, then click **Regenerate project files**.
4. Double-click any script in Unity → it should open in VS Code with IntelliSense working.

## 5. Configure Cline

1. Open the repo folder in VS Code (the root, not `Assets/`).
2. Cline settings → add your API key and pick the model the team agreed on.
3. **Auto-approve:** read files = on; edit files = off; terminal = off (loosen later if you trust it).
4. Cline reads [`.clinerules`](.clinerules) automatically. Don't edit it alone, it's shared by all 5 agents.
5. Workflow per task: **Plan mode** → read the plan → **Act mode** → review the diff → test in Unity.
6. Cline **cannot see the Unity Editor**. When there's a compile error or exception, paste the
   Unity Console text into the chat.
7. Use **checkpoints** to roll back when the agent goes off the rails.

## 6. Smoke test

- Project opens without errors in the Console.
- `Window → General → Test Runner → EditMode → Run All` passes.
- You can create a branch, commit, and push.

---

## One-time: creating the Unity project (W1 only)

Unity Hub can't create a project inside a non-empty folder, so:

1. Unity Hub → **New project** → template **Universal 2D (URP)** → create it somewhere temporary.
2. Close Unity. Copy its `Packages/` and `ProjectSettings/` folders into the repo root,
   and merge its `Assets/` into the repo's `Assets/` (keep our `Assets/_Game/`).
3. Open the repo folder in Unity Hub (*Add project from disk*).
4. *Project Settings → Editor*: **Asset Serialization = Force Text**, **Version Control = Visible Meta Files**.
5. Install packages: **Input System**, **2D Pixel Perfect** (part of URP 2D), **Test Framework**, **TextMeshPro**.
6. **Sprite import preset** (so every image imports as pixel art automatically):
   select any sprite → set PPU 16, Filter Point, Compression None → Inspector sliders icon →
   *Save current to…* `Assets/_Game/Art/PixelSprite.preset` → *Project Settings → Preset Manager* →
   add it as default for **TextureImporter** with filter `glob:"Assets/_Game/Art/**"`.
7. **Camera prefab:** `Assets/_Game/Core/Prefabs/MainCamera.prefab` with Camera + **Pixel Perfect Camera**
   (Assets PPU 16, reference resolution 320×180). Every scene uses this prefab, never its own camera.
8. Commit everything Unity generated (`Packages/`, `ProjectSettings/`, `Assets/` incl. all `.meta` files)
   on a branch `setup/unity-project` and open a PR. Everyone else just pulls — **nobody sets these
   settings by hand on their own PC.**

### Where these settings live (all shared via git)
| Setting | File |
|---|---|
| Unity version | `ProjectSettings/ProjectVersion.txt` |
| Asset Serialization = Force Text | `ProjectSettings/EditorSettings.asset` |
| Visible Meta Files | `ProjectSettings/VersionControlSettings.asset` |
| Packages (URP, Input System…) | `Packages/manifest.json` |
| Sprite PPU / filter / compression | each sprite's `.meta` (defaults via the preset above) |
| Default preset rules | `ProjectSettings/PresetManager.asset` |
| Pixel Perfect Camera | `MainCamera.prefab` |

## Pixel-art conventions

- **Pixels Per Unit: 16** for every sprite.
- Sprite import: **Filter Mode = Point (no filter)**, **Compression = None**.
- Main camera gets a **Pixel Perfect Camera** component (reference resolution 320×180, upscaled).
- Pixel font for all UI text (free/licensed font only; put the licence file next to it in `Art/Fonts/`).
