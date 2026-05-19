$ErrorActionPreference = "Stop"
$projectId = "4080389428660489312"
$baseDir = Join-Path $PSScriptRoot "..\stitch-mlcaps"
$baseDir = [System.IO.Path]::GetFullPath($baseDir)
New-Item -ItemType Directory -Force -Path $baseDir | Out-Null

$mcp = Get-Content "$env:USERPROFILE\.cursor\mcp.json" -Raw | ConvertFrom-Json
$key = $mcp.mcpServers.stitch.headers.'X-Goog-Api-Key'
$headers = @{ "Content-Type" = "application/json"; "X-Goog-Api-Key" = $key }
$uri = "https://stitch.googleapis.com/mcp"

function Invoke-StitchTool($name, $arguments) {
  $body = @{ jsonrpc = "2.0"; id = 1; method = "tools/call"; params = @{ name = $name; arguments = $arguments } } | ConvertTo-Json -Compress -Depth 10
  $r = Invoke-RestMethod -Uri $uri -Method POST -Headers $headers -Body $body
  if ($r.result.isError) { throw $r.result.content[0].text }
  return $r.result.structuredContent
}

function Sanitize-DirName([string]$s) {
  $s = $s -replace '[<>:"/\\|?*]', '-'
  if ($s.Length -gt 80) { $s = $s.Substring(0, 80) }
  return $s.Trim().TrimEnd('.')
}

$screens = @(
  @{ order = "01"; id = "0335363b0f49490eb7bdd629aa32bc07"; slug = "catalogo-editorial" },
  @{ order = "02"; id = "9541504173810824800"; slug = "design-md" },
  @{ order = "04"; id = "5fd522b1b2ca4110ab340232ce803f9a"; slug = "coleccion-delimitada" },
  @{ order = "05"; id = "799ce029d93742d2a6823fb31f3cdae6"; slug = "photo-navy-trucker" },
  @{ order = "06"; id = "97ca546af8ac49e9a5af3c5ea503bf7e"; slug = "photo-beige-vintage" },
  @{ order = "07"; id = "c9f94f349c6149218fc57b3c493fa543"; slug = "photo-white-minimal" },
  @{ order = "08"; id = "d73c1255a041420ca7803e4521b5a2fd"; slug = "photo-black-baseball" },
  @{ order = "09"; id = "da6cb95d83834d76bc21b35f3ea1c1d9"; slug = "exploracion-infinita" },
  @{ order = "10"; id = "cd974c887f444952afe0c011c73eba3b"; slug = "exploracion-infinita-ampliada" },
  @{ order = "11"; id = "2fcbc0c4c7694595928a81b7ddf3fb52"; slug = "exploracion-infinita-2" },
  @{ order = "12"; id = "d23b5037615d48dfba33bd371b9adfeb"; slug = "detalle-producto" }
)

$manifest = @()

foreach ($item in $screens) {
  $screenId = $item.id
  $name = "projects/$projectId/screens/$screenId"
  Write-Host "Fetching $screenId ..."
  $screen = Invoke-StitchTool "get_screen" @{ name = $name; projectId = $projectId; screenId = $screenId }
  $dirName = "$($item.order)-$($item.slug)"
  $dir = Join-Path $baseDir $dirName
  New-Item -ItemType Directory -Force -Path $dir | Out-Null

  $meta = @{
    screenId = $screenId
    title = $screen.title
    name = $screen.name
    width = $screen.width
    height = $screen.height
    deviceType = $screen.deviceType
  }
  $meta | ConvertTo-Json | Set-Content (Join-Path $dir "metadata.json") -Encoding UTF8

  $imgPath = Join-Path $dir "screenshot.png"
  $htmlPath = Join-Path $dir "screen.html"

  if ($screen.screenshot.downloadUrl) {
    curl.exe -L -sS -o $imgPath $screen.screenshot.downloadUrl
    $meta.screenshotFile = "screenshot.png"
  }

  if ($screen.htmlCode.downloadUrl) {
    curl.exe -L -sS -o $htmlPath $screen.htmlCode.downloadUrl
    $meta.htmlFile = "screen.html"
  }

  $manifest += [PSCustomObject]@{
    order = $item.order
    folder = $dirName
    screenId = $screenId
    title = $screen.title
    hasScreenshot = (Test-Path $imgPath)
    hasHtml = (Test-Path $htmlPath)
  }
  Write-Host "  -> $dirName (img=$(Test-Path $imgPath) html=$(Test-Path $htmlPath))"
}

# Design system (not a screen)
Write-Host "Fetching design system ..."
$ds = Invoke-StitchTool "list_design_systems" @{ projectId = $projectId }
$dsDir = Join-Path $baseDir "03-design-system-kinetic-monochrome"
New-Item -ItemType Directory -Force -Path $dsDir | Out-Null
$ds | ConvertTo-Json -Depth 20 | Set-Content (Join-Path $dsDir "design-system.json") -Encoding UTF8
$designMd = $ds.designSystems[0].designSystem.theme.designMd
if (-not $designMd) { $designMd = $ds.designSystems[0].designSystem.designMd }
$designMd | Set-Content (Join-Path $dsDir "DESIGN.md") -Encoding UTF8
$ds.designSystems[0].designSystem.styleGuidelines | Set-Content (Join-Path $dsDir "style-guidelines.md") -Encoding UTF8

$manifest += [PSCustomObject]@{
  order = "03"
  folder = "03-design-system-kinetic-monochrome"
  screenId = "af51e76df8d047b18d128167fa15773e"
  title = "Design System - Kinetic Monochrome"
  hasScreenshot = $false
  hasHtml = $false
}

$manifest | ConvertTo-Json | Set-Content (Join-Path $baseDir "manifest.json") -Encoding UTF8
Write-Host "Done. Output: $baseDir"
