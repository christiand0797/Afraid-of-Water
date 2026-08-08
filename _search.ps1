$patterns = @('statsScreen','statsList','openStats','manifest','serviceWorker','sw.js','coinburst','coinBurst','lightning','sLauncher','shield bubble','pickup','statPow','use_jetpack','aow_statPow')
$lines = Get-Content -Path 'index.html'
for ($i = 0; $i -lt $lines.Count; $i++) {
  foreach ($p in $patterns) {
    if ($lines[$i] -match $p) {
      Write-Output ("{0}: {1}" -f ($i+1), $lines[$i].Trim())
      break
    }
  }
}
Write-Output "=== LAST 30 LINES ==="
for ($i = $lines.Count-30; $i -lt $lines.Count; $i++) {
  Write-Output ("{0}: {1}" -f ($i+1), $lines[$i])
}
